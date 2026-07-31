// Canonical service-area data for the mobile installation network.
//
// This file is the ANCHOR for installation coverage, the same way lib/data/warranty.ts
// anchors the warranty and lib/data/installation-terms.ts anchors the Terms. Any page
// that describes where installation is available (/installation, /about, /services)
// must agree with this file rather than restating coverage in its own words — the two
// times a page drifted from it, CA-41 ("nationwide" on /about) and CA-45 (a Victoria-only
// workshop on /services), the page was wrong and this table was the reference.
//
// ── ONE dataset: public/installation/au-postcodes.json ───────────────────────
// 2,765 suburb-level rows, each with a per-postcode supported flag. As of 2026-07-31 this
// is the ONLY coverage data the site consults, for both the standalone postcode checker
// and the booking wizard. Both resolve through resolveCoverage() — keep it that way. If
// you add a third place that answers a coverage question, route it through here too.
//
// ⚠️ ANCHOR, NOT AUTHORITY — and the dataset has known defects. Recorded so nobody
// mistakes it for verified data (CA-78, FA-23, and {!needs approval} in
// docs/content-sources/general.txt § INSTALLATION SERVICE):
//
//   • The supported flags are NOT reliable point-in-polygon output, whatever the file's
//     own `note` says. Inner Sydney is a checkerboard: 2000 Sydney and 2009 Pyrmont are
//     serviced while 2007 Ultimo — physically between them — is not, as are 2010 Surry
//     Hills, 2011 Kings Cross and 2016 Redfern, each ringed by serviced postcodes. No
//     radius or polygon produces that. Generation failed per-postcode and wrote the
//     failures as 0, so an unknown number of "not serviced" answers are false negatives.
//   • 52 flagged-serviced postcodes are non-geographic (PO boxes, mail centres): 1314
//     Eastern Suburbs Mc, 1481 Hurstville Bc, 0200 Anu. Harmless — nobody types them.
//   • 7151 Casey (an Antarctic base) and 9999 North Pole are flagged serviced.
//   • The polygons came from installations.dashcamsrus.com.au; nobody has confirmed those
//     describe AutoXtreme's installer network.
//
// Narrowing coverage is the safe direction; do not widen it without a source.

// ── METRO_COVERAGE — COMMENTED OUT 2026-07-31, DO NOT DELETE ─────────────────
// The previous 19-range fallback table. Disabled by user decision so that au-postcodes.json
// is the single source of truth. Kept because it is the restore path if the JSON is ever
// withdrawn, and because it is the reference CA-41 (/about "nationwide") and CA-45
// (/services Victoria-only) were judged against.
//
// It was itself unsourced, and it agreed with the JSON on only 79.9% of the 2,700 non-NT
// postcodes: 106 postcodes it called metro the dataset calls unserviced, and 436 it called
// merely "regional" the dataset calls serviced. Per-range agreement ranged from 100%
// (Melbourne, Adelaide, Canberra, Ipswich) down to 44% (Wollongong) and 59% (Sunshine Coast).
//
// To restore: uncomment both blocks below and re-add the `if (!rows) return coverageMessage(pc)`
// line to resolveCoverage(). Do not "clean up" this comment — it is the only copy.
//
// /** Australian metro service areas: [postcodeFrom, postcodeTo, displayName]. */
// export const METRO_COVERAGE: readonly [number, number, string][] = [
//   [2000, 2249, "Sydney"], [2555, 2574, "Greater Sydney"], [2740, 2786, "Greater Sydney"],
//   [2500, 2530, "Wollongong"], [2250, 2330, "Newcastle & Central Coast"],
//   [2600, 2620, "Canberra"], [2900, 2920, "Canberra"], [3000, 3220, "Melbourne"],
//   [3214, 3227, "Geelong"], [3335, 3338, "Melbourne West"], [3750, 3810, "Melbourne outer"],
//   [4000, 4209, "Brisbane"], [4210, 4230, "the Gold Coast"], [4300, 4306, "Ipswich"],
//   [4500, 4521, "Moreton Bay"], [4550, 4580, "the Sunshine Coast"],
//   [5000, 5199, "Adelaide"], [6000, 6210, "Perth"], [7000, 7099, "Hobart"],
// ];
//
// /** Range-table fallback, used when the primary dataset was unavailable. */
// export function coverageMessage(pc: string): Coverage {
//   const n = parseInt(pc, 10);
//   if (isNaN(n)) return { msg: "", cls: "" };
//   if (pc.length === 4 && isExcludedPostcode(pc)) return { msg: COVERAGE_MESSAGES.excluded, cls: "err" };
//   for (const [lo, hi, name] of METRO_COVERAGE) {
//     if (n >= lo && n <= hi) return { msg: COVERAGE_MESSAGES.metro(name), cls: "ok" };
//   }
//   return { msg: COVERAGE_MESSAGES.regional, cls: "warn" };
// }

/**
 * The Northern Territory is excluded from the installer network. Stated to the customer
 * in three places on /installation (the postcode checker, the map caption, and step 2 of
 * the booking wizard), so the rule lives here once.
 */
export const EXCLUDED_STATE = "NT";
const NT_POSTCODE = /^0[89]\d\d$/;

/** True if the postcode falls in the excluded Northern Territory range (0800–0999). */
export function isExcludedPostcode(pc: string): boolean {
  return NT_POSTCODE.test(pc);
}

/** True if this state/postcode pair is outside the installer network entirely. */
export function isExcluded(stateAu: string, pc: string): boolean {
  return stateAu === EXCLUDED_STATE || isExcludedPostcode(pc);
}

export const COVERAGE_MESSAGES = {
  excluded: "Installation isn’t currently available in the Northern Territory.",
  /** Wizard-validation variant — same fact, apologetic register for a blocked submit. */
  excludedBooking: "Sorry — installation isn’t currently available in the Northern Territory.",
  invalid: "Please enter a valid 4-digit Australian postcode.",
  unavailable: "Sorry, we couldn’t check availability just now — please try again.",
  /** Wizard variant of `unavailable`: never blocks, never promises. */
  unverified:
    "We couldn’t check your area just now — submit your booking and we’ll confirm availability within one business day.",
  serviced: (suburb: string, state: string) =>
    `Great — installation is available in ${suburb}, ${state}.`,
  notServiced: (suburb: string, state: string) =>
    `We don’t have a certified installer in ${suburb}, ${state} yet. You can still submit your booking and we’ll confirm availability within one business day.`,
  unknown:
    "Sorry, we don’t currently service that postcode. Submit a booking and we’ll confirm within one business day.",
  metro: (name: string) =>
    `Great news — certified installers service ${name}. Mobile installation is available in your area.`,
  regional:
    "You may be within our regional coverage. Submit your booking and we’ll confirm availability within one business day.",
} as const;

export type Coverage = { msg: string; cls: "ok" | "warn" | "err" | "" };

/** A row of the primary dataset: [postcode, suburb, state, supportedFlag]. */
export type PostcodeRow = [string, string, string, number];

let postcodeCache: PostcodeRow[] | null = null;

/**
 * Fetch (and memoise) the coverage dataset. Returns null if it can't be loaded. With
 * METRO_COVERAGE commented out there is nothing to fall back to, so null means "we cannot
 * answer" — never "not serviced". Callers must not turn a failed fetch into a refusal.
 */
export async function loadPostcodeRows(): Promise<PostcodeRow[] | null> {
  if (postcodeCache) return postcodeCache;
  try {
    const res = await fetch("/installation/au-postcodes.json");
    if (!res.ok) return null;
    const data = (await res.json()) as { rows: PostcodeRow[] };
    postcodeCache = data.rows;
    return postcodeCache;
  } catch {
    return null;
  }
}

/**
 * The single coverage answer, used by BOTH the standalone postcode checker and the booking
 * wizard's step-2 validation. `rows: null` means the dataset could not be loaded, which
 * resolves to a non-committal "we'll confirm" — not a refusal.
 *
 * `blocking` selects the register only, not the outcome: the checker is an information
 * widget, so an unserviced suburb reads as a flat "sorry", while the wizard must not
 * dead-end a customer mid-booking, so the same fact is phrased as a warning they can
 * proceed past. Neither variant blocks — only NT does, via isExcluded() in the caller.
 */
export function resolveCoverage(pc: string, rows: PostcodeRow[] | null, blocking = false): Coverage {
  if (!/^\d{4}$/.test(pc)) return { msg: COVERAGE_MESSAGES.invalid, cls: "err" };
  if (isExcludedPostcode(pc)) {
    return { msg: blocking ? COVERAGE_MESSAGES.excludedBooking : COVERAGE_MESSAGES.excluded, cls: "err" };
  }
  if (!rows) return { msg: COVERAGE_MESSAGES.unverified, cls: "warn" };
  const match = rows.find((r) => r[0] === pc);
  if (!match) return { msg: COVERAGE_MESSAGES.unknown, cls: "warn" };
  if (match[3]) return { msg: COVERAGE_MESSAGES.serviced(match[1], match[2]), cls: "ok" };
  return blocking
    ? { msg: COVERAGE_MESSAGES.notServiced(match[1], match[2]), cls: "warn" }
    : { msg: `Sorry, we don’t service ${match[1]}, ${match[2]} yet.`, cls: "err" };
}
