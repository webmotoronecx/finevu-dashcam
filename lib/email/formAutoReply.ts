// The acknowledgement a form submitter receives, sent from app/api/contact after the
// support copy has gone out (FA-07 / CA-70).
//
// It exists to make existing approved copy TRUE. lib/data/thank-you.ts already tells every
// submitter "we've sent a confirmation to your email", "reply to the confirmation email"
// and "check your spam" — three statements about a message that, until this shipped, was
// never sent. The alternative was watering that copy down; sending the email is the better
// half of the trade, and it only became possible once finevuaustralia.com.au was verified
// in Resend (2026-08-13). Before that the sandbox delivered to the account owner only.
//
// ⚠️ THIS MAKES /api/contact A MAIL AMPLIFICATION SURFACE. The recipient is whatever
// address the caller put in the form, so an unprotected route would let anyone send mail
// from our verified domain to a stranger — and burn the sending reputation the booking
// confirmation depends on. Turnstile and the rate limit are what keep that bounded, which
// is why FA-34 (Turnstile fails open when its key is unset) matters more now than it did.
// Never call this before the honeypot, CAPTCHA and rate-limit checks have all passed.
//
// ⚠️ THIS EMAIL IS NO-REPLY BY DESIGN. Settled 2026-08-17: customers receive confirmations
// from a no-reply address and cannot reply to them. The closing line says so and points at
// the phone number and /contact.
//
// It is therefore a product decision, not a limitation waiting on DNS — a mailbox appearing
// later does not license inviting replies. NO Reply-To header is set: it used to point at
// support@, which only rendered a Reply button that hard-bounces, since
// finevuaustralia.com.au has NO MX RECORD (`dig +short MX` → empty, re-verified
// 2026-08-17). A bounce reads to a customer as being ignored, and on a warranty claim that
// is the worst possible moment for it.
//
// Set CONTACT_FROM_EMAIL to an explicitly named noreply@ address so the From matches the
// policy — the fallback is still onboarding@resend.dev.
//
// ⚠️ None of this touches INBOUND. Mail sent TO support@ still cannot be delivered; FB-08.

import { Resend } from "resend";
import { BUSINESS } from "@/lib/data/business";

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "FineVu Australia <onboarding@resend.dev>";

/** Label/value pairs exactly as the support email renders them. */
export type AutoReplyInput = {
  /** Where to send it — must already be validated as an email by the caller. */
  to: string;
  /**
   * @deprecated Ignored since 2026-08-17 — customer confirmations are no-reply by design,
   * so sendAutoReply sets no Reply-To at all. Kept on the type so the callers that still
   * pass it do not break; delete it once they stop.
   */
  replyTo?: string;
  /** The support-email subject, used to work out which form this was. */
  subject: string;
  rows: readonly (readonly [string, string])[];
};

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Variant = { subject: string; heading: string; intro: string };

// Matched against the subject the form already sends, so no new field had to be threaded
// through submitForm and all four call sites. The prefixes are set in the page components
// (/contact :88, /register :141, /warranty-claim :230, /become-a-retailer :181) — if one of
// those is reworded, its entry here stops matching and the generic fallback is used, which
// is correct but less useful. Keep them in step.
const VARIANTS: readonly (readonly [string, Variant])[] = [
  [
    "FineVu warranty claim",
    {
      subject: "We've received your warranty claim — FineVu Australia",
      heading: "Your warranty claim has been received",
      intro:
        "Thanks for sending this through. Our technicians will review the details and your proof of purchase, and we'll be in touch about the next step.",
    },
  ],
  [
    "FineVu product registration",
    {
      subject: "Your FineVu product is registered — FineVu Australia",
      heading: "Your product registration has been received",
      intro:
        "Thanks for registering. Having your details on file means any future warranty claim can be handled faster.",
    },
  ],
  [
    "FineVu retailer application",
    {
      subject: "We've received your retailer application — FineVu Australia",
      heading: "Your retailer application has been received",
      intro:
        "Thanks for your interest in stocking FineVu. We'll review your application and be in touch about setting up a wholesale account.",
    },
  ],
  [
    "FineVu enquiry",
    {
      subject: "We've received your message — FineVu Australia",
      heading: "Thanks for getting in touch",
      intro:
        "We've received your message and our Australian support team will get back to you.",
    },
  ],
];

const GENERIC: Variant = {
  subject: "We've received your submission — FineVu Australia",
  heading: "Thanks — we've got it",
  intro: "We've received your submission and someone from our team will be in touch.",
};

/**
 * Pick the wording for a form from its support-email subject.
 *
 * Deliberately no delivery-time promise in any variant. /support's hours and its 24-hour
 * response SLA are unsourced and unapproved (CA-24 / CA-25), so committing to one here
 * would ship an unverified claim into a customer's inbox — the exact class of problem the
 * content-accuracy gate exists to catch. "We'll be in touch" is true regardless.
 */
export function variantFor(subject: string): Variant {
  const found = VARIANTS.find(([prefix]) => subject.startsWith(prefix));
  return found ? found[1] : GENERIC;
}

export function renderAutoReply(input: AutoReplyInput): { subject: string; text: string; html: string } {
  const v = variantFor(input.subject);

  const text = [
    v.heading,
    "",
    v.intro,
    "",
    "A copy of what you sent is below for your records.",
    "",
    ...input.rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `This address isn't monitored, so please don't reply to it.`,
    `If you have questions, call ${BUSINESS.supportPhone} or use the contact form at ${BUSINESS.website}/contact.`,
    "",
    `${BUSINESS.tradingAs} — ${BUSINESS.website}`,
  ].join("\n");

  const row = ([label, value]: readonly [string, string]) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6e6e73;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>` +
    `<td style="padding:6px 0;color:#1d1d1f;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1d1d1f">
  <h1 style="font-size:22px;margin:0 0 8px">${escapeHtml(v.heading)}</h1>
  <p style="color:#6e6e73;line-height:1.6;margin:0 0 24px">${escapeHtml(v.intro)}</p>

  <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#9c9ca3;margin:0 0 8px">What you sent us</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;background:#f7f7f7;border-radius:12px;padding:8px">
    ${input.rows.map(row).join("")}
  </table>

  <p style="color:#6e6e73;line-height:1.6;margin:28px 0 0;font-size:14px">
    This address isn't monitored, so please don't reply to it. If you have questions, call
    <a href="tel:1800818288" style="color:#F26522">${escapeHtml(BUSINESS.supportPhone)}</a>
    or use the <a href="https://${escapeHtml(BUSINESS.website)}/contact" style="color:#F26522">contact form</a>.
  </p>
  <p style="color:#9c9ca3;line-height:1.6;margin:16px 0 0;font-size:12.5px">
    ${escapeHtml(BUSINESS.tradingAs)} — ${escapeHtml(BUSINESS.website)}
  </p>
</div>`;

  return { subject: v.subject, text, html };
}

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Send the acknowledgement. NEVER throws, and the caller must never fail a submission
 * because of it: the support copy is what makes a submission real, and this is a courtesy
 * on top. Same reasoning as sendBookingConfirmation in the Stripe webhook.
 */
export async function sendAutoReply(input: AutoReplyInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set" };

  const { subject, text, html } = renderAutoReply(input);
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: input.to,
      // NO Reply-To. Confirmed 2026-08-17: customer confirmations are no-reply by design.
      // It used to be set to support@, on the theory that the header would be correct the
      // day a mailbox existed — but that domain has no MX, so all it did was render a Reply
      // button in the customer's mail client that hard-bounces. With no Reply-To, a reply
      // goes to the From address instead, which should be an explicitly named noreply@
      // (set CONTACT_FROM_EMAIL — the fallback is still onboarding@resend.dev).
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
