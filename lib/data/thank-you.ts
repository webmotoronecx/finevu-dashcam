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
// ⚠️ ACCURACY, UNRESOLVED: this text says a confirmation email was sent, but
// app/api/contact/route.ts sends ONE email, to the support inbox — the submitter
// receives nothing. So "sent a confirmation to your email", "reply to the
// confirmation email" and "check your spam" describe an email that does not
// exist. Kept verbatim at the user's direction pending a decision: either add a
// submitter auto-reply in the API route, or reword these three lines. Must be
// settled before launch (content accuracy is a hard gate).

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
  "Reply to the confirmation email any time if you have questions.",
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
  // /installation's 6-step wizard. Its own step-6 confirmation is bypassed, but the
  // wizard still submits nothing and takes no payment (CA-36, awaiting ops). This copy
  // must therefore never claim a booking is locked in or that payment was received.
  installation: base("Booking request sent"),
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
