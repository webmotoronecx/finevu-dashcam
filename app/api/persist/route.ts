import { NextResponse } from "next/server";
import { copyObject, r2UploadsConfigured } from "@/lib/r2";
import { addContactNote, ghlConfigured, upsertContact } from "@/lib/ghl";
import { clientIp, isRateLimited } from "@/lib/rateLimit";
import type { CrmChannel } from "@/lib/crmLabels";

// Promotes an uploaded set of files to its permanent R2 home and records the submission on
// a GHL contact (FB-04 / FB-05). Runs ALONGSIDE — never instead of — the FA-02 form email,
// and carries NO file bytes (only the pending keys), so it never hits the Vercel body limit
// and captures even a claim too big to email.
//
// Best-effort by contract: the form email is the guaranteed artefact, so a failure here
// returns a body the client ignores rather than surfacing an error to the customer.

const FORMS = new Set(["warranty-claim", "register"]);
const RATE_LIMIT = { max: 20, windowMs: 10 * 60 * 1000 };

// Maps the form to its CRM channel; upsertContact applies the source + tag from
// lib/crmLabels.ts, so this route never spells either out itself.
const CHANNEL: Record<string, CrmChannel> = { "warranty-claim": "warranty-claim", register: "registration" };
const HEADING: Record<string, string> = {
  "warranty-claim": "FineVu warranty claim",
  register: "FineVu product registration",
};

type Payload = { form?: unknown; fields?: unknown; uploadId?: unknown; files?: unknown };

// Collapse whitespace (incl. the CR/LF/tabs that would otherwise break the note layout) and
// cap length — the fields are user-supplied and end up in a GHL note. The R2 key itself is
// built from the sign route's already-sanitized filenames, not from this.
const clean = (s: unknown, max = 2000) =>
  (typeof s === "string" ? s : "").replace(/\s+/g, " ").trim().slice(0, max);

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "customer";

const prettyLabel = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export async function POST(req: Request) {
  // Both back-ends must be present. Either unset ⇒ nothing to do; the email already carried
  // the submission, so this is a silent no-op rather than an error.
  if (!r2UploadsConfigured() || !ghlConfigured()) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  const ip = clientIp(req);
  if (await isRateLimited(`persist:${ip}`, RATE_LIMIT)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const form = String(payload.form ?? "");
  if (!FORMS.has(form)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const fields = (payload.fields && typeof payload.fields === "object" ? payload.fields : {}) as Record<string, unknown>;
  const email = clean(fields.email, 200);
  const name =
    `${clean(fields.first_name, 100)} ${clean(fields.last_name, 100)}`.trim() || clean(fields.name, 200) || "Unknown";
  if (!email) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Gather the pending keys. Every key MUST sit under THIS submission's pending/<uploadId>/
  // prefix, so the client can't ask us to copy an arbitrary object out of the bucket.
  const uploadId = clean(payload.uploadId, 100);
  const rawFiles = Array.isArray(payload.files) ? (payload.files as { key?: unknown }[]) : [];
  const pending: string[] = [];
  for (const f of rawFiles) {
    const key = typeof f.key === "string" ? f.key : "";
    if (uploadId && key.startsWith(`pending/${uploadId}/`) && /^[A-Za-z0-9._/-]+$/.test(key)) {
      pending.push(key);
    }
  }

  try {
    // Permanent, browsable home: claims|registrations / YYYY-MM / date_slug_short.
    const date = new Date().toISOString().slice(0, 10);
    const root = form === "warranty-claim" ? "claims" : "registrations";
    const folder = `${root}/${date.slice(0, 7)}/${date}_${slugify(name)}_${crypto.randomUUID().slice(0, 8)}`;

    const storedKeys: string[] = [];
    for (const key of pending) {
      const dest = `${folder}/${key.split("/").pop()}`;
      await copyObject(key, dest);
      storedKeys.push(dest);
    }

    const contactId = await upsertContact({ name, email, phone: clean(fields.phone, 60), channel: CHANNEL[form] });

    // A plain-text record of the submission plus where its files live in R2.
    const skip = new Set(["first_name", "last_name", "email", "phone", "name", "receipt", "evidence"]);
    const lines = Object.entries(fields)
      .filter(([k, v]) => !skip.has(k) && clean(v))
      .map(([k, v]) => `${prettyLabel(k)}: ${clean(v)}`);
    const fileLines = storedKeys.length
      ? ["", `Files (Cloudflare R2 · bucket ${process.env.R2_UPLOADS_BUCKET}):`, ...storedKeys.map((k) => `  ${k}`)]
      : ["", "No files uploaded."];
    const note = [`${HEADING[form]} — ${name} <${email}>`, "", ...lines, ...fileLines].join("\n");
    await addContactNote(contactId, note);

    return NextResponse.json({ ok: true, folder });
  } catch {
    // Swallowed on purpose — the email is the safety net. Surfacing this would fail a
    // submission that actually went through.
    return NextResponse.json({ ok: false, error: "persist_failed" });
  }
}
