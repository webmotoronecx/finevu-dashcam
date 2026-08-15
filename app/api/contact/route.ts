import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BUSINESS } from "@/lib/data/business";
import { sendAutoReply } from "@/lib/email/formAutoReply";

// Server-side handler for website form submissions. Sends via Resend using the
// secret RESEND_API_KEY (never exposed to the browser). Recipient and sender are
// overridable via env.
//
// finevuaustralia.com.au IS verified in Resend as of 2026-08-13, so the sandbox
// restriction is gone — but CONTACT_FROM_EMAIL is still unset, which means the
// onboarding@resend.dev fallback below is what actually sends. Set it to the verified
// domain in Vercel; the fallback stays as a fail-safe, not as the intended sender.
//
// ⚠️ Accepting this message is NOT delivering it. A 200 from this route means Resend
// accepted the send — nobody currently has access to the CONTACT_TO_EMAIL mailbox, so no
// submission has ever been confirmed to arrive. See FB-08 before treating the forms as
// working end to end.
// CONTACT_TO_EMAIL accepts a COMMA-SEPARATED LIST, so submissions can go to more than one
// inbox — e.g. support plus a personal address while the shared mailbox is being sorted.
// Resend's `to` takes up to 50 recipients; they all appear on the same message, so every
// recipient can see the others. Use a group alias instead if that isn't wanted.
// Blank entries are dropped, so a trailing comma is harmless.
const TO_EMAIL = (process.env.CONTACT_TO_EMAIL || "support@finevuaustralia.com.au")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "FineVu Website <onboarding@resend.dev>";

type Payload = {
  subject?: string;
  replyTo?: string;
  botcheck?: string;
  turnstileToken?: string;
  fields?: Record<string, unknown>;
  attachment?: { filename?: string; contentBase64?: string };
};

// Guard against Vercel's ~4.5 MB request-body limit (base64 inflates ~1/3).
const MAX_ATTACHMENT_BASE64 = 4 * 1024 * 1024;

// Abuse caps. The honeypot below only stops naive bots — a scripted POST that simply
// omits the botcheck field walks straight past it. Turnstile (FB-07) has since landed and
// is the durable defence; these limits are the layer behind it. None of them
// are reachable by a real submission: the largest form (/warranty-claim) sends 12
// fields, and its longest free-text field is a short description.
const MAX_FIELDS = 30;
const MAX_KEY_CHARS = 64;
const MAX_VALUE_CHARS = 5_000;
const MAX_SUBJECT_CHARS = 150;

// Mirrors the accept="" lists on the two upload forms (/register :239,
// /warranty-claim :315). Anything else is refused rather than forwarded — without
// this the route will mail an arbitrary file type straight to the support inbox.
const ALLOWED_ATTACHMENT_EXTS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "pdf"]);

// In-memory rate limit. Best-effort by design: serverless instances don't share
// memory, so the real ceiling is per-instance rather than global, and a cold start
// resets it. It stops the trivial "loop curl in a shell" case and is the fallback
// when no shared store is configured; the durable, cross-instance ceiling is the
// Upstash-backed limiter below (FB-07).
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// Prunes every bucket on the way through, so the map can't grow unbounded on a
// long-lived instance. Callers that are already over the limit are not recorded
// again — a flood shouldn't extend its own ban window indefinitely.
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [key, times] of hits) {
    const kept = times.filter((t) => t > cutoff);
    if (kept.length) hits.set(key, kept);
    else hits.delete(key);
  }
  const times = hits.get(ip) ?? [];
  if (times.length >= RATE_LIMIT_MAX) return true;
  times.push(now);
  hits.set(ip, times);
  return false;
}

// Durable, cross-instance rate limit backed by an Upstash Redis REST store (FB-07).
// The in-memory limiter above only bounds one warm instance, so a flood spread across
// instances — or one that keeps hitting cold starts — walks past it. A shared store is
// the only way to enforce a global ceiling on stateless serverless. This talks to the
// REST API directly (no SDK dependency), the same shape as verifyTurnstile below.
//
// Accepts the Upstash-native names OR Vercel KV's, so it works however the store gets
// provisioned. Unset ⇒ durableRateLimited returns null and we fall back to the
// in-memory limiter, so local dev and any unprovisioned environment keep working.
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// One INCR that arms the window's expiry only on the first hit, as a single atomic
// script — so two concurrent first requests can't both skip PEXPIRE and leak a key
// that never dies. Returns the current count for the window.
const RATE_LIMIT_LUA =
  "local c = redis.call('INCR', KEYS[1]) " +
  "if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end " +
  "return c";

// true = limited, false = allowed, null = store not configured or unreachable. Fails
// OPEN (returns null → caller uses the in-memory limiter): a limiter outage must never
// take the contact form down. This is the opposite trade to Turnstile, which fails
// closed because it is the gate itself, not a throttle.
async function durableRateLimited(ip: string): Promise<boolean | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    // Upstash REST: POST the command as a JSON array [cmd, ...args] to the base URL.
    const res = await fetch(REDIS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", RATE_LIMIT_LUA, "1", `rl:contact:${ip}`, String(RATE_LIMIT_WINDOW_MS)]),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown; error?: string };
    if (typeof data.result !== "number") return null;
    return data.result > RATE_LIMIT_MAX;
  } catch {
    return null;
  }
}

// Prefer the durable store; fall back to the per-instance limiter when it isn't
// configured or is unreachable.
async function isRateLimited(ip: string): Promise<boolean> {
  const durable = await durableRateLimited(ip);
  if (durable !== null) return durable;
  return rateLimited(ip);
}

// Cloudflare Turnstile (FB-07) — the durable fix for the bypassable honeypot.
//
// When TURNSTILE_SECRET_KEY is UNSET, verification is skipped entirely so local dev
// and any environment without the key keeps working. That means a production deploy
// missing this variable silently loses CAPTCHA protection — confirm it is set in
// Vercel, alongside NEXT_PUBLIC_TURNSTILE_SITE_KEY for the widget.
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Fails CLOSED: a network error reaching Cloudflare rejects the submission rather than
// waving it through. A Cloudflare outage therefore blocks the forms, which is the
// deliberate trade — the alternative is an attacker-visible way to skip the check.
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true;
  if (!token || typeof token !== "string") return false;
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// Strips control characters (incl. CR/LF) so nothing user-supplied can smuggle
// structure into the mail headers, then caps the length.
const sanitizeLine = (s: string, max: number) =>
  s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const prettyLabel = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Distinguishes "no attachment was sent" (undefined) from "one was sent and it is not
// acceptable" (this sentinel). The old code collapsed both to undefined, so an oversized
// receipt was dropped silently and support received a claim with no evidence attached.
const INVALID_ATTACHMENT = Symbol("invalid-attachment");

type BuiltAttachment = { filename: string; content: Buffer }[] | undefined | typeof INVALID_ATTACHMENT;

function buildAttachment(att: Payload["attachment"]): BuiltAttachment {
  if (!att?.filename && !att?.contentBase64) return undefined;
  if (!att?.filename || !att?.contentBase64) return INVALID_ATTACHMENT;

  // Flatten any path so a crafted name can't imply a directory to a downstream client.
  const filename = sanitizeLine(att.filename.replace(/[\\/]+/g, "_"), 120);
  const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "";
  if (!ALLOWED_ATTACHMENT_EXTS.has(ext)) return INVALID_ATTACHMENT;

  const b64 = att.contentBase64.trim();
  if (b64.length === 0 || b64.length > MAX_ATTACHMENT_BASE64) return INVALID_ATTACHMENT;
  // The upload helpers strip the data: prefix before sending, so the body must be
  // plain base64. Anything else is malformed and would decode to garbage.
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) return INVALID_ATTACHMENT;

  return [{ filename, content: Buffer.from(b64, "base64") }];
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  const ip = clientIp(req);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "This form isn’t configured yet. Please email support@finevuaustralia.com.au directly." },
      { status: 503 },
    );
  }

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this connection. Please try again shortly, or email support@finevuaustralia.com.au." },
      { status: 429 },
    );
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept and discard.
  if (payload.botcheck) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(payload.turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please complete the check and try again." },
      { status: 403 },
    );
  }

  const fields = payload.fields ?? {};
  const entries = Object.entries(fields);
  if (entries.length > MAX_FIELDS) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Values are truncated rather than rejected: a caller who pastes a wall of text
  // should still reach support, just not with an unbounded payload behind them.
  const rows = entries
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .map(([k, v]) => {
      const value = String(v).trim();
      return [
        prettyLabel(k.slice(0, MAX_KEY_CHARS)),
        value.length > MAX_VALUE_CHARS ? `${value.slice(0, MAX_VALUE_CHARS)} […truncated]` : value,
      ] as const;
    });

  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: "Please fill in the form before submitting." }, { status: 400 });
  }

  const attachments = buildAttachment(payload.attachment);
  if (attachments === INVALID_ATTACHMENT) {
    return NextResponse.json(
      { ok: false, error: "That file couldn’t be attached. Please upload a JPG, PNG, HEIC or PDF under 3 MB." },
      { status: 400 },
    );
  }

  const subject = sanitizeLine(payload.subject ?? "", MAX_SUBJECT_CHARS) || "FineVu website enquiry";
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1d1d1f;line-height:1.6">
    <h2 style="font-size:16px;margin:0 0 16px">${escapeHtml(subject)}</h2>
    <table style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#6b6b73;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
  </div>`;

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      replyTo: isEmail(payload.replyTo) ? payload.replyTo.trim() : undefined,
      text,
      html,
      attachments,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: "Couldn’t send your message right now. Please try again shortly." },
        { status: 502 },
      );
    }

    // Acknowledge to the submitter — but only now, after support actually has the
    // message. Sending it first would risk telling someone we received a submission we
    // then failed to deliver.
    //
    // A failure here is logged and swallowed: the support copy is what makes a submission
    // real, so a courtesy email that didn't send must never turn a successful submit into
    // an error the customer sees. Same trade as the Stripe webhook's confirmation email.
    //
    // Reaching this line means the honeypot, Turnstile and the rate limit have all passed,
    // which is what stops this being an open relay to any address a caller names.
    if (isEmail(payload.replyTo)) {
      const ack = await sendAutoReply({
        to: payload.replyTo.trim(),
        replyTo: BUSINESS.supportEmail,
        subject,
        rows,
      });
      if (!ack.ok) {
        console.error("[contact] submission delivered but the auto-reply failed", {
          subject,
          error: ack.error,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Couldn’t send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
