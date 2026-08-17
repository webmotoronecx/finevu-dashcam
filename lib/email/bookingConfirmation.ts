// The email a customer receives once an installation payment has actually cleared
// (FB-01, step 5). Sent from the Stripe webhook, never from the browser — so it can only
// go out for a payment Stripe has confirmed.
//
// It is BOTH the booking confirmation and the tax invoice. Doing it in one document is
// deliberate: a default Stripe receipt carries no ABN and no GST line, so it is not a
// valid Australian tax invoice, and /installation promises the customer one.

import { Resend } from "resend";
import { BUSINESS, abnIsPlaceholder, formatAud, gstComponentCents } from "@/lib/data/business";
import { BOOKING_TIMEZONE } from "@/lib/ghl";

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "FineVu Australia <onboarding@resend.dev>";

export type ConfirmationInput = {
  reference: string;
  email: string;
  name: string;
  phone: string;
  model: string;
  /** ISO start time with offset. */
  slot: string;
  address: string;
  vehicle: string;
  amountCents: number;
  /** Stripe's hosted invoice PDF, when invoice_creation produced one. */
  invoiceUrl?: string;
};

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function formatSlot(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: BOOKING_TIMEZONE,
  }).format(d);
}

export function renderBookingConfirmation(input: ConfirmationInput) {
  const gst = gstComponentCents(input.amountCents);
  const when = formatSlot(input.slot);

  const rows: [string, string][] = [
    ["Reference", input.reference],
    ["Dash cam", `${input.model} · Front + rear (2CH)`],
    ["Service", "Professional hardwire installation"],
    ["When", when],
    ["Where", input.address],
    ["Vehicle", input.vehicle],
    ["Contact", `${input.phone} · ${input.email}`],
  ];

  const money: [string, string][] = [
    ["Installation (incl. GST)", formatAud(input.amountCents)],
    ...(BUSINESS.gstRegistered ? ([["GST included", formatAud(gst)]] as [string, string][]) : []),
    ["Total paid", formatAud(input.amountCents)],
  ];

  // null marks a line to drop; "" is a real blank line and must survive, so this filters
  // on null rather than falsiness.
  const text = [
    `Your FineVu installation is confirmed.`,
    ``,
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ``,
    `TAX INVOICE`,
    `${BUSINESS.legalName} trading as ${BUSINESS.tradingAs}`,
    `ABN ${BUSINESS.abn}`,
    ...money.map(([k, v]) => `${k}: ${v}`),
    ``,
    input.invoiceUrl ? `Invoice: ${input.invoiceUrl}` : null,
    ``,
    `Please have your FineVu and all in-box accessories, including the hardwire kit,`,
    `with the vehicle. Your installer will call ahead on the day.`,
    ``,
    `Need to change your booking? Call ${BUSINESS.supportPhone} or email`,
    `${BUSINESS.supportEmail} at least 24 hours before your appointment.`,
    ``,
    `This address isn't monitored, so please don't reply to it.`,
  ].filter((line): line is string => line !== null).join("\n");

  const row = ([k, v]: [string, string]) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6e6e73;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
    `<td style="padding:6px 0;color:#1d1d1f;font-weight:500">${escapeHtml(v)}</td></tr>`;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1d1d1f">
  <h1 style="font-size:22px;margin:0 0 8px">Your installation is confirmed</h1>
  <p style="color:#6e6e73;line-height:1.6;margin:0 0 24px">
    Thanks ${escapeHtml(input.name.split(/\s+/)[0] || input.name)} — your payment has cleared and your appointment is locked in.
  </p>

  <table style="width:100%;border-collapse:collapse;font-size:14px;background:#f7f7f7;border-radius:12px;padding:8px">
    ${rows.map(row).join("")}
  </table>

  <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:.08em;color:#9c9ca3;margin:32px 0 4px">Tax invoice</h2>
  <p style="margin:0 0 12px;font-size:13px;color:#6e6e73">
    ${escapeHtml(BUSINESS.legalName)} trading as ${escapeHtml(BUSINESS.tradingAs)}<br>
    ABN ${escapeHtml(BUSINESS.abn)}
  </p>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${money.map(row).join("")}
  </table>
  ${input.invoiceUrl ? `<p style="margin:16px 0 0"><a href="${escapeHtml(input.invoiceUrl)}" style="color:#F26522">View or download your invoice</a></p>` : ""}

  <p style="color:#6e6e73;line-height:1.6;margin:32px 0 0;font-size:14px">
    Please have your FineVu and all in-box accessories, including the hardwire kit, with
    the vehicle. Your installer will call ahead on the day.
  </p>
  <p style="color:#6e6e73;line-height:1.6;margin:16px 0 0;font-size:14px">
    Need to change your booking? Call ${escapeHtml(BUSINESS.supportPhone)} or email
    <a href="mailto:${escapeHtml(BUSINESS.supportEmail)}" style="color:#F26522">${escapeHtml(BUSINESS.supportEmail)}</a>
    at least 24 hours before your appointment.
  </p>
  <p style="color:#9c9ca3;line-height:1.6;margin:24px 0 0;font-size:12px">
    This address isn’t monitored, so please don’t reply to it.
  </p>
</div>`;

  return { subject: `FineVu installation confirmed — ${when}`, text, html };
}

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the confirmation. Never throws — the caller is the Stripe webhook, and a failed
 * email must not turn into a 500 that makes Stripe retry the whole delivery. A lost email
 * is recoverable by hand; a retry storm against GHL is not.
 */
export async function sendBookingConfirmation(input: ConfirmationInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set" };

  // Loud on purpose. An invoice bearing 00 000 000 000 is not a valid tax invoice, and
  // this is the last point before it reaches a customer.
  if (abnIsPlaceholder()) {
    console.warn("[booking-confirmation] SENDING WITH PLACEHOLDER ABN — not a valid tax invoice");
  }

  let { subject, text, html } = renderBookingConfirmation(input);

  // Test-inbox redirect. Set BOOKING_EMAIL_REDIRECT_TO in .env.local to read the real
  // rendered email without it ever reaching a customer; unset it to go live. The
  // intended recipient is carried in the subject and a banner so a redirected message is
  // never ambiguous about who it was actually for.
  //
  // The old sandbox caveat here is obsolete: finevuaustralia.com.au was verified in Resend
  // on 2026-08-13, so a redirect can now point at any address rather than only the account
  // owner's. That makes leaving this set MORE dangerous, not less — it will now silently
  // deliver every customer's booking confirmation and tax invoice to one inbox instead of
  // failing loudly. It must be unset in production.
  const redirectTo = process.env.BOOKING_EMAIL_REDIRECT_TO?.trim();
  const to = redirectTo || input.email;
  if (redirectTo) {
    console.warn(`[booking-confirmation] REDIRECTED to ${redirectTo} — real recipient was ${input.email}`);
    subject = `[TEST → ${input.email}] ${subject}`;
    text = `*** TEST SEND — this email was addressed to ${input.email} and redirected here. ***\n\n${text}`;
    html =
      `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto 16px;padding:10px 14px;` +
      `background:#FFF4E5;border:1px solid #F26522;border-radius:8px;font-size:13px;color:#8a4b00">` +
      `<strong>Test send.</strong> Addressed to ${escapeHtml(input.email)} and redirected here.` +
      `</div>${html}`;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to,
      // NO Reply-To — customer confirmations are no-reply by design (confirmed 2026-08-17),
      // and support@ is on a domain with no MX, so the header only produced a Reply button
      // that bounces. See lib/email/formAutoReply.ts for the full note.
      subject,
      text,
      html,
    });
    if (error) return { ok: false, error: String(error.message ?? error) };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
