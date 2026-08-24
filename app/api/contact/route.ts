import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BUSINESS } from "@/lib/data/business";
import { sendAutoReply } from "@/lib/email/formAutoReply";
import { sendToGhlWorkflow } from "@/lib/ghlWebhook";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

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
  /** Which form this is, for CRM routing (FB-06). Matched against the allowlist in
      lib/ghlWebhook.ts — it names a form, never a URL or a field. Unknown values are
      ignored, so a caller cannot invent a destination. */
  formType?: string;
  fields?: Record<string, unknown>;
  /** Legacy single-attachment slot. /register still sends this shape. */
  attachment?: { filename?: string; contentBase64?: string };
  /** Multiple attachments (FA-02) — /warranty-claim sends the receipt plus its evidence. */
  attachments?: { filename?: string; contentBase64?: string }[];
};

// Guard against Vercel's ~4.5 MB request-body limit (base64 inflates ~1/3).
const MAX_ATTACHMENT_BASE64 = 4 * 1024 * 1024;
// Caps on the WHOLE email, not just one file (FA-02). Per-file limits alone would let a
// warranty claim carry a receipt plus five 3 MB photos and blow past what Resend accepts,
// which fails the send outright — and on this form the send IS the record.
const MAX_ATTACHMENT_COUNT = 6;
const MAX_TOTAL_ATTACHMENT_BASE64 = 12 * 1024 * 1024;

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

// Abuse ceiling for the email route (FB-07). isRateLimited prefers the durable Upstash
// store and falls back to the in-memory limiter — both now live in lib/rateLimit.ts, shared
// with the upload routes so there is ONE implementation of the cross-instance cap. The
// Redis key stays `rl:contact:<ip>` (isRateLimited prefixes `rl:`), so the ceiling is
// unchanged from the inline version this replaced.
const CONTACT_RATE_LIMIT = { max: 8, windowMs: 10 * 60 * 1000 };

// Cloudflare Turnstile (FB-07) — the durable fix for the bypassable honeypot.
//
// FAILS CLOSED IN PRODUCTION when TURNSTILE_SECRET_KEY is missing (FA-34). It used to
// return true and wave the submission through, which is the right call for local dev and
// the wrong one everywhere else: there was no error, no log line and no UI difference, so
// the launch security gate could be signed off on a deploy that had no CAPTCHA at all.
// "The forms still work" was not evidence it was on.
//
// The skip now depends on the ENVIRONMENT rather than on whether someone remembered the
// variable, which is the same shape as the availability fix in FA-35: a fallback that is
// genuinely useful in dev must never be reachable by forgetting something in production.
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Distinguishes "the visitor failed the check" from "this deploy cannot run the check". */
type TurnstileResult = "ok" | "failed" | "misconfigured";

// Fails CLOSED on a network error too: reaching Cloudflare and not getting an answer
// rejects the submission rather than waving it through. A Cloudflare outage therefore
// blocks the forms, which is the deliberate trade — the alternative is an
// attacker-visible way to skip the check.
async function verifyTurnstile(token: string | undefined, ip: string): Promise<TurnstileResult> {
  if (!TURNSTILE_SECRET) {
    // Local dev and preview environments without the key stay walkable.
    if (process.env.NODE_ENV !== "production") return "ok";
    // Production. Loud, because this is a silent security hole otherwise, and the caller
    // tells the customer to phone instead of asking them to retry a check that cannot
    // render — NEXT_PUBLIC_TURNSTILE_SITE_KEY is almost certainly missing too, since the
    // two are set together.
    console.error(
      "[contact] TURNSTILE_SECRET_KEY is not set in production — refusing every submission. " +
      "Set it and NEXT_PUBLIC_TURNSTILE_SITE_KEY together, then redeploy (the public key is inlined at build time).",
    );
    return "misconfigured";
  }
  if (!token || typeof token !== "string") return "failed";
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true ? "ok" : "failed";
  } catch {
    return "failed";
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

type OneAttachment = { filename: string; content: Buffer };
type BuiltAttachment = OneAttachment[] | undefined | typeof INVALID_ATTACHMENT;

/** Validates a single file. Returns null when it is not acceptable. */
function buildOne(att: { filename?: string; contentBase64?: string }): OneAttachment | null {
  if (!att?.filename || !att?.contentBase64) return null;

  // Flatten any path so a crafted name can't imply a directory to a downstream client.
  const filename = sanitizeLine(att.filename.replace(/[\\/]+/g, "_"), 120);
  const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "";
  if (!ALLOWED_ATTACHMENT_EXTS.has(ext)) return null;

  const b64 = att.contentBase64.trim();
  if (b64.length === 0 || b64.length > MAX_ATTACHMENT_BASE64) return null;
  // The upload helpers strip the data: prefix before sending, so the body must be
  // plain base64. Anything else is malformed and would decode to garbage.
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) return null;

  return { filename, content: Buffer.from(b64, "base64") };
}

/**
 * Builds every attachment on the request (FA-02).
 *
 * Accepts the legacy single `attachment` and the plural `attachments` together, because
 * /register still sends the singular shape and /warranty-claim sends a receipt plus its
 * evidence files.
 *
 * Rejects the WHOLE submission if any one file is unacceptable, rather than sending what
 * survived. Silently dropping a file is the exact failure FA-02 and FA-03 were both raised
 * for: support gets a claim that names evidence nobody attached, and the customer sees a
 * success screen.
 */
function buildAttachments(payload: Payload): BuiltAttachment {
  const raw = [
    ...(payload.attachment ? [payload.attachment] : []),
    ...(Array.isArray(payload.attachments) ? payload.attachments : []),
  ];
  if (raw.length === 0) return undefined;
  if (raw.length > MAX_ATTACHMENT_COUNT) return INVALID_ATTACHMENT;

  const built: OneAttachment[] = [];
  let totalB64 = 0;
  for (const att of raw) {
    const one = buildOne(att);
    if (!one) return INVALID_ATTACHMENT;
    totalB64 += att.contentBase64!.trim().length;
    if (totalB64 > MAX_TOTAL_ATTACHMENT_BASE64) return INVALID_ATTACHMENT;
    built.push(one);
  }
  return built;
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

  if (await isRateLimited(`contact:${ip}`, CONTACT_RATE_LIMIT)) {
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

  const turnstile = await verifyTurnstile(payload.turnstileToken, ip);
  if (turnstile === "misconfigured") {
    // 503, not 403: the visitor did nothing wrong and there is no check for them to
    // complete. Telling them to "try the check again" would be a dead end, so the message
    // routes them to a channel that works while someone fixes the deploy.
    return NextResponse.json(
      { ok: false, error: "We can't accept form submissions right now. Please call 1800 818 288 or email support@finevuaustralia.com.au." },
      { status: 503 },
    );
  }
  if (turnstile === "failed") {
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

  /* The same values as `rows`, but keyed by the ORIGINAL field name instead of the
     prettified label: GHL maps on stable keys, and prettyLabel exists for humans reading an
     email. Truncated by the same caps, so the CRM can never be sent more than support was. */
  const crmFields: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (typeof v !== "string" || !v.trim()) continue;
    const value = v.trim();
    crmFields[k.slice(0, MAX_KEY_CHARS)] = value.slice(0, MAX_VALUE_CHARS);
  }

  const attachments = buildAttachments(payload);
  if (attachments === INVALID_ATTACHMENT) {
    return NextResponse.json(
      { ok: false, error: "One of those files couldn’t be attached. Please upload JPG, PNG, HEIC or PDF files under 3 MB each, up to 6 in total." },
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

  /* CRM copy (FB-06), started BEFORE the email and awaited after, so the two run
     concurrently.

     It used to run last, which meant a Resend outage lost the lead entirely: the route
     returned 502 and never reached this call, so support had nothing AND the CRM had
     nothing. Firing them in parallel makes the two paths independent — email trouble no
     longer costs a lead, and the response is no slower than the slower of the two.

     THIS CHANGES WHAT A FAILED SUBMISSION MEANS, deliberately. A lead can now exist in GHL
     for a submission the customer was told had failed. That is the right way round: a
     retry is harmless because the GHL action matches on email and updates the same contact
     rather than creating a second, so the worst case is a contact nobody has emailed about
     yet — against the old worst case of losing the application outright.

     The response is still gated on the SUPPORT EMAIL alone. It is the record, so ok:true
     must keep meaning "support has this", never "the CRM has this".

     Awaited before every return, including the error paths. A promise still in flight when
     the response is sent can be killed by the platform mid-request, which would drop the
     lead exactly when the email had already failed. */
  const crmCopy =
    typeof payload.formType === "string" ? sendToGhlWorkflow(payload.formType, crmFields) : null;

  // Guarded so the several return paths can each call it without risking a duplicate log
  // line — awaiting the same promise twice is harmless, logging the same failure twice is
  // just noise in an incident.
  let crmSettled = false;
  async function settleCrmCopy() {
    if (!crmCopy || crmSettled) return;
    crmSettled = true;
    const crm = await crmCopy;
    if (!crm.ok && "error" in crm) {
      console.error("[contact] CRM copy failed", { formType: payload.formType, error: crm.error });
    }
  }

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
      // The lead may still have reached GHL — see settleCrmCopy. The customer is told the
      // send failed regardless, because support is the record and support has nothing.
      await settleCrmCopy();
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

    /* Started before the email, collected here. Best-effort either way: a GHL outage must
       never fail a submission support has already received.

       This runs at all only because the honeypot, Turnstile and the rate limit have already
       passed — which is exactly why the POST is made here and not from the browser. A
       workflow URL in the client bundle would be an unauthenticated write endpoint on the
       CRM, reachable without any of the three. */
    await settleCrmCopy();

    return NextResponse.json({ ok: true });
  } catch {
    // Resend threw rather than returning an error. Collect the CRM copy here too, or the
    // request ends with it still in flight and the platform is free to kill it.
    await settleCrmCopy();
    return NextResponse.json(
      { ok: false, error: "Couldn’t send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
