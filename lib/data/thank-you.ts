// Post-submit copy for /thank-you and /thank-you/[type].
//
// Single source of truth for every form's confirmation message — the forms
// themselves render nothing on success, they just router.push() to the matching
// slug here. Add a variant and the route is generated automatically
// (generateStaticParams reads Object.keys of this record).
//
// ⚠️ COPY IS PLACEHOLDER — every variant currently carries the same approved
// design text. The per-variant structure is deliberately kept so each form can be
// given its own wording later without touching components/ThankYou.tsx.
//
// ── ACCURACY: RESOLVED 2026-08-14 by building the email, not by cutting the copy ──
// This text used to describe an email that was never sent: /api/contact delivered ONE
// message, to the support inbox, so "sent a confirmation to your email", "reply to the
// confirmation email" and "check your spam" were all false. The route now sends a
// submitter acknowledgement via lib/email/formAutoReply.ts (FA-07 / CA-70), so BODY and
// FOOTNOTE are true as written.
//
// ONE line had to change anyway: "reply to the confirmation email" stayed false, because
// finevuaustralia.com.au has NO MX RECORD — it can send but not receive, so a reply
// hard-bounces (`dig MX finevuaustralia.com.au` → empty, re-verified 2026-08-17). The
// bullet points at the phone number instead. Restore the reply wording ONLY once a mailbox
// exists (FB-08) and dig shows an MX; the sending domain being verified in Resend does NOT
// imply it can receive.
//
// The bullet does NOT say the inbox is unmonitored (removed 2026-08-17, at the user's
// direction). That is a tone call and it is safe: the copy no longer invites a reply
// anywhere, so nothing here promises something that would bounce. What it means is that the
// page carries no visible cue either — so if the reply wording is ever restored, restore it
// here AND in lib/email/formAutoReply.ts, which still tells the recipient not to reply.

export type ThankYouVariant = {
  eyebrow: string;
  title: string;
  body: string;
  /** "What happens next" bullets. */
  next: string[];
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Small print under the buttons. */
  footnote?: string;
};

const BODY = "We've received your submission and sent a confirmation to your email.";

const NEXT = [
  "We'll review your submission and be in touch if we need anything else.",
  "Questions? You can call us on 1800 818 288.",
];

const FOOTNOTE =
  "Can't see the email? Check your spam or junk folder — and add us to your contacts so you don't miss updates.";

const CTA = { label: "Back to home", href: "/" };
const SECONDARY_CTA = { label: "Visit support", href: "/support" };

/** Shared placeholder copy. `eyebrow` still varies — it drives each page's <title>. */
const base = (eyebrow: string): ThankYouVariant => ({
  eyebrow,
  title: "Thank you",
  body: BODY,
  next: NEXT,
  cta: CTA,
  secondaryCta: SECONDARY_CTA,
  footnote: FOOTNOTE,
});

export const genericThankYou: ThankYouVariant = base("Submission received");

export const thankYouVariants: Record<string, ThankYouVariant> = {
  contact: base("Message sent"),
  register: base("Product registered"),
  "warranty-claim": base("Claim submitted"),
  "become-a-retailer": base("Application received"),
  services: base("Booking request sent"),
  // NO "installation" variant, deliberately (FA-38). The booking wizard renders its own
  // step 6 from server state — a real reference, a real payment, and wording that upgrades
  // from "Payment received" to "Booking confirmed" once the webhook promotes the
  // appointment. It never navigates here, and the variant that used to sit here said
  // "Booking request sent" for a customer who had just paid $250. Leaving it in place kept
  // a reachable URL that contradicted the product, so /thank-you/installation now 404s.
};

export const thankYouSlugs = Object.keys(thankYouVariants);

// ---------------------------------------------------------------------------
// Per-submit overrides
//
// The heading and the paragraph under it can be overridden from the call site
// via ?title= / ?desc=, so one route can serve wording the variant defaults
// don't cover. Anything omitted or blank falls back to the variant.
//
// Only these two are overridable — the "what happens next" bullets, buttons and
// footnote always come from the variant, so a URL can't rewrite the whole page.
// ---------------------------------------------------------------------------

export const TITLE_PARAM = "title";
export const DESC_PARAM = "desc";

const MAX_TITLE = 80;
const MAX_DESC = 300;

/** Trim, collapse whitespace, drop control chars, cap length. Empty ⇒ undefined. */
function clean(value: string | string[] | undefined, max: number): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return undefined;
  const text = raw.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, max) : undefined;
}

/** Apply ?title= / ?desc= over a variant. Absent or blank params keep the defaults. */
export function withOverrides(
  variant: ThankYouVariant,
  searchParams: Record<string, string | string[] | undefined>,
): ThankYouVariant {
  const title = clean(searchParams[TITLE_PARAM], MAX_TITLE);
  const body = clean(searchParams[DESC_PARAM], MAX_DESC);
  if (!title && !body) return variant;
  return { ...variant, title: title ?? variant.title, body: body ?? variant.body };
}

/**
 * Build a thank-you URL with optional overrides, correctly encoded.
 *
 *   router.push(thankYouUrl("register"));
 *   router.push(thankYouUrl("register", { title: "You're registered" }));
 *   router.push(thankYouUrl("register", { title: "You're registered", desc: "We've saved your details." }));
 */
export function thankYouUrl(slug: string, overrides?: { title?: string; desc?: string }): string {
  const params = new URLSearchParams();
  if (overrides?.title?.trim()) params.set(TITLE_PARAM, overrides.title.trim());
  if (overrides?.desc?.trim()) params.set(DESC_PARAM, overrides.desc.trim());
  const query = params.toString();
  return query ? `/thank-you/${slug}?${query}` : `/thank-you/${slug}`;
}
