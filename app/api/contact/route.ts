import { NextResponse } from "next/server";
import { Resend } from "resend";

// Server-side handler for website form submissions. Sends via Resend using the
// secret RESEND_API_KEY (never exposed to the browser). Recipient and sender are
// overridable via env; the sender must be on a domain verified in Resend once
// finevuaustralia.com.au is set up (until then Resend only allows onboarding@resend.dev).
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "support@finevuaustralia.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "FineVu Website <onboarding@resend.dev>";

type Payload = {
  subject?: string;
  replyTo?: string;
  botcheck?: string;
  fields?: Record<string, unknown>;
};

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const prettyLabel = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "This form isn’t configured yet. Please email support@finevuaustralia.com directly." },
      { status: 503 },
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

  const fields = payload.fields ?? {};
  const rows = Object.entries(fields)
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .map(([k, v]) => [prettyLabel(k), String(v)] as const);

  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: "Please fill in the form before submitting." }, { status: 400 });
  }

  const subject = payload.subject?.trim() || "FineVu website enquiry";
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
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: "Couldn’t send your message right now. Please try again shortly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Couldn’t send your message right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
