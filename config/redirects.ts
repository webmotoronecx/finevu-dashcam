/**
 * Central list of URL redirects — aliases and common mistypes that should land on the real
 * page instead of a 404 or the Coming Soon placeholder. Wired into next.config.ts via
 * `redirects()`, so these are proper server-side redirects handled BEFORE the page renders
 * or the Coming Soon gate runs. A mistyped URL costs a customer; this catches the likely
 * ones.
 *
 * ── Adding one ──────────────────────────────────────────────────────────────────────────
 * One entry: { source, destination, permanent }.
 *   - source       the mistyped / alias path a customer might land on. It MUST NOT match a
 *                  real page — a redirect SHADOWS any page at the same path, so aliasing a
 *                  real route would hide it. Real routes today:
 *                    / · /about · /become-a-retailer · /contact · /faq · /gx35 · /gx4k ·
 *                    /installation · /learn · /register · /retailers · /support ·
 *                    /terms-of-service · /warranty · /warranty-claim
 *                  Never point a `source` at one of those.
 *   - destination  where to send them. MUST be a real page from the list above.
 *   - permanent    true → 308 (browsers and Google cache it; correct for a stable alias).
 *                  Use false → 307 if the mapping might change later.
 *
 * ⚠️ /warranty is a REAL page (the warranty policy) and is deliberately NOT redirected to
 * /warranty-claim — that would hijack it. Claim aliases use /claim, /claims, etc. instead.
 */
export type SiteRedirect = { source: string; destination: string; permanent: boolean };

export const siteRedirects: SiteRedirect[] = [
  // ── Warranty claim → /warranty-claim ──────────────────────────────────────────────────
  { source: "/claim", destination: "/warranty-claim", permanent: true },
  { source: "/claims", destination: "/warranty-claim", permanent: true },
  { source: "/warranty-claims", destination: "/warranty-claim", permanent: true },
  { source: "/make-a-claim", destination: "/warranty-claim", permanent: true },
  { source: "/file-a-claim", destination: "/warranty-claim", permanent: true },

  // ── Contact → /contact ────────────────────────────────────────────────────────────────
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/contactus", destination: "/contact", permanent: true },
  { source: "/contacts", destination: "/contact", permanent: true },

  // ── Product registration → /register ──────────────────────────────────────────────────
  { source: "/registration", destination: "/register", permanent: true },
  { source: "/register-product", destination: "/register", permanent: true },
  { source: "/product-registration", destination: "/register", permanent: true },

  // ── Support → /support ────────────────────────────────────────────────────────────────
  { source: "/help", destination: "/support", permanent: true },
  { source: "/troubleshooting", destination: "/support", permanent: true },

  // ── Installation & booking → /installation ────────────────────────────────────────────
  { source: "/install", destination: "/installation", permanent: true },
  { source: "/book", destination: "/installation", permanent: true },
  { source: "/booking", destination: "/installation", permanent: true },
  { source: "/book-installation", destination: "/installation", permanent: true },

  // ── Retailers → /retailers  (note: /retailers is currently behind the Coming Soon gate) ─
  { source: "/where-to-buy", destination: "/retailers", permanent: true },
  { source: "/retailer", destination: "/retailers", permanent: true },
  { source: "/find-a-retailer", destination: "/retailers", permanent: true },
  { source: "/find-retailer", destination: "/retailers", permanent: true },
  { source: "/stockists", destination: "/retailers", permanent: true },

  // ── Become a retailer → /become-a-retailer ────────────────────────────────────────────
  { source: "/wholesale", destination: "/become-a-retailer", permanent: true },
  { source: "/retailer-application", destination: "/become-a-retailer", permanent: true },

  // ── Products ──────────────────────────────────────────────────────────────────────────
  { source: "/gx-4k", destination: "/gx4k", permanent: true },
  { source: "/gx-35", destination: "/gx35", permanent: true },

  // ── About & legal ─────────────────────────────────────────────────────────────────────
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/terms", destination: "/terms-of-service", permanent: true },
  { source: "/tos", destination: "/terms-of-service", permanent: true },
  { source: "/terms-and-conditions", destination: "/terms-of-service", permanent: true },
];
