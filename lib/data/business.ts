// Legal entity details for documents that have to name the seller — currently the
// booking confirmation / tax invoice sent after an installation payment (FB-01).
//
// Kept apart from config/site.config.ts on purpose: that file is marketing copy, this is
// the trading entity, and getting it wrong here is a compliance problem rather than a
// typo.

/**
 * ⚠️ PLACEHOLDER — NOT A REAL ABN. Must be replaced before the first live payment.
 *
 * For a sale over $82.50 including GST the ATO requires a tax invoice to carry the
 * seller's identity and ABN, and $250 is well over that. `/installation` promises the
 * customer a tax receipt and installation-terms.ts states prices include GST, so shipping
 * this placeholder would mean issuing invoices that are not valid tax invoices.
 *
 * Replace with the ABN of the entity that actually receives the money, and set the same
 * value on the Stripe account so Stripe's own invoice matches ours.
 */
export const ABN_PLACEHOLDER = "00 000 000 000";

export const BUSINESS = {
  /** Registered name of the entity taking payment. Verify against the ABR record. */
  legalName: "AutoXtreme Pty Ltd",
  tradingAs: "FineVu Australia",
  abn: process.env.BUSINESS_ABN || ABN_PLACEHOLDER,
  /**
   * Whether that entity is registered for GST — separate from holding an ABN, and
   * mandatory above $75k turnover. If it is NOT registered the invoice must not show a
   * GST line at all, so this drives the template rather than decorating it.
   */
  gstRegistered: process.env.BUSINESS_GST_REGISTERED !== "false",
  supportEmail: process.env.CONTACT_TO_EMAIL || "support@finevuaustralia.com.au",
  supportPhone: "1800 818 288",
  website: "finevuaustralia.com.au",
} as const;

/** True while the ABN is still the placeholder — used to flag invoices in dev/staging. */
export const abnIsPlaceholder = () => BUSINESS.abn === ABN_PLACEHOLDER;

/**
 * GST included in a GST-inclusive total, in cents: one eleventh, rounded to the cent.
 * Returns 0 when the entity is not GST-registered, since there is then no GST to show.
 */
export function gstComponentCents(totalCents: number): number {
  if (!BUSINESS.gstRegistered) return 0;
  return Math.round(totalCents / 11);
}

export const formatAud = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
