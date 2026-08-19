/* How website submissions are labelled in GHL.
 *
 * Everything the site sends to GHL becomes a Contact — GHL has one contacts table and no
 * concept of separate customer types. So a homeowner booking an installation and a business
 * applying for a wholesale account land side by side, and the ONLY thing telling them apart
 * is what is written here.
 *
 * ⚠️ THIS IS NOT COSMETIC. The visible problem is a mixed contact list; the real one is
 * automation crossfire. A campaign or workflow built against "all contacts" would send
 * consumer installation email to retailers and wholesale pricing to homeowners. Tags and
 * sources are what make it possible to target a Smart List instead — so treat these as the
 * segmentation boundary, and always target a tag, never everyone.
 *
 * Plain constants, no secrets, safe on either side of the network boundary.
 *
 * ⚠️ CHANGING A TAG VALUE ORPHANS EVERY CONTACT ALREADY CARRYING THE OLD ONE. GHL Smart
 * Lists match on the literal string, so a rename silently drops historical contacts out of
 * the view that is meant to contain them, with nothing to flag it. Renaming means
 * retagging in GHL as well as editing here.
 */

/** The website surfaces that create contacts. */
export type CrmChannel = "booking" | "retailer" | "registration" | "warranty-claim";

/**
 * The Source written onto the contact record.
 *
 * One convention across both paths. They used to disagree — the booking path hardcoded
 * "Website — installation booking" while the retailer webhook sent "FineVu website —
 * retailer" — which is fine until someone tries to group or report on Source and finds two
 * spellings of the same idea.
 */
export const CRM_SOURCE: Record<CrmChannel, string> = {
  booking: "FineVu website — installation booking",
  retailer: "FineVu website — retailer application",
  registration: "FineVu website — product registration",
  "warranty-claim": "FineVu website — warranty claim",
};

/**
 * The tag applied to the contact. Lowercase-hyphen, because GHL tags are case-insensitive
 * and a mixed convention reads as two tags in the UI even when it behaves as one.
 *
 * APPLIED IN TWO DIFFERENT PLACES, because the paths reach GHL differently:
 *  - `booking`, `registration`, `warranty-claim` — sent in the upsert payload by lib/ghl.ts,
 *                 since those paths call the REST API directly and there is no workflow.
 *  - `retailer` — applied by an "Add Contact Tag" action in the GHL workflow, because that
 *                 path posts to a workflow inbound webhook and the contact does not exist
 *                 until the workflow's own Create/Update Contact action has run.
 *
 * So the retailer value here is the STRING THE WORKFLOW MUST USE, not something this code
 * sends. Keep the two in step — nothing in the build can check it for you.
 */
export const CRM_TAG: Record<CrmChannel, string> = {
  booking: "installation-booking",
  retailer: "retailer-application",
  registration: "product-registration",
  "warranty-claim": "warranty-claim",
};
