// Per-client content config: nav, hero, CTAs and trust marquee (single source of truth)

// Staging overrides. site.config.staging.ts imports the SiteConfig *type* back from here,
// which is erased at compile time — so there is no runtime import cycle.
import { stagingOverrides } from "./site.config.staging";

export type NavLink = {
  href: string;
  label: string;
  /** Optional dropdown children (e.g. the Products menu) */
  children?: NavLink[];
};

export type BrandLogo = {
  name: string;
  url: string;
  /** Force white recolouring for non-white source logos */
  invert?: boolean;
};

export type Disclaimer = {
  title: string;
  body: string;
};

/**
 * Product-page sub-navigation: the second full-width row under the main nav on the
 * product pages. Presence of an entry for the current pathname is what switches
 * `Navigation` from the floating pill to the full-width block variant.
 */
export type ProductSubNav = {
  /** Left-hand label, e.g. "GX4K" */
  label: string;
  /** In-page links. `href: "#top"` is special-cased to scroll back to the page top. */
  links: NavLink[];
  cta: NavLink;
  /**
   * How far down the page the sub-nav docks, in viewport heights — i.e. how tall the hero
   * is. Tune it by eye per page: a pinned/scroll-scrubbed hero consumes several screens of
   * scroll before it releases, so this is not necessarily < 1. Defaults to 0.8.
   */
  dockAfterVh?: number;
};

export type FooterColumn = {
  heading: string;
  links: NavLink[];
};

export type SiteConfig = {
  /** Site metadata */
  name: string;
  tagline: string;
  description: string;

  /** Contact / distributor details */
  contact: {
    phone: string;
    distributor: string;
    distributorUrl: string;
    /** Title-case form, for link labels and headings: "3-Year Australian Warranty". */
    warranty: string;
    /**
     * Mid-sentence form of `warranty`, for running prose ("Backed by a …").
     *
     * It exists because `warranty.toLowerCase()` — what the footer used to do — also
     * lowercases "Australian", which is a proper noun and must keep its capital. Keep the
     * two in sync by hand when either changes. CP-11.
     */
    warrantyInline: string;
    origin: string;
  };

  /** Logo in /public */
  logo: {
    src: string;
    alt: string;
    heightClass: string; // e.g. "h-8"
  };

  /** Primary navigation links (desktop + mobile) */
  nav: NavLink[];

  /** Primary CTA (header button + hero primary) */
  primaryCta: NavLink;

  /** Secondary CTA (hero) */
  secondaryCta: NavLink;

  /**
   * Sub-nav rows keyed by pathname. A route with no entry keeps the default floating
   * pill navbar, so this map is also the switch for the full-width nav variant.
   */
  productSubNav: Record<string, ProductSubNav>;

  /** Hero section content */
  hero: {
    headline: string;
    sub: string;
    /** Image in /public (used as background) */
    backgroundImage: string;
    /** data-nav-theme signal for the Navigation scroll detector */
    theme: "dark" | "light";
  };

  /** Trust marquee — scrolling proof points */
  brandMarquee: {
    eyebrow: string;
    brands: BrandLogo[];
  };

  /**
   * Footer link columns and the social row in the bottom bar.
   *
   * Production ships a deliberately trimmed set, because most of the fuller footer's
   * links point at routes in `comingSoon`. Staging restores the full version via
   * `site.config.staging.ts` — see the note there.
   *
   * The two sets are INDEPENDENT, not subset/superset: production keeps /contact (which
   * IS gated) and omits "Features & App", so this can't be derived by filtering against
   * `comingSoon`. Promoting a route out of `comingSoon` does NOT move its footer link
   * here automatically; that's a manual edit, by design.
   *
   * `Footer` reads `columns.length` to pick its grid (2 or 3 columns only — see the GRID
   * lookup in components/Footer.tsx). An empty `social` omits the row and its separator.
   */
  footer: {
    columns: FooterColumn[];
    social: NavLink[];
  };

  /** Routes that render the Coming Soon placeholder instead of their content */
  comingSoon: string[];

  /**
   * Legal fine print, rendered by <LegalDisclaimers>.
   *
   * ORDER IS LOAD-BEARING. The sup="1|2|3" footnote markers on the BentoCard tiles
   * (gx4k, gx35) and the homepage `reasons` tiles reference these entries **by
   * position**: 1 = Warranty, 2 = SD Cards, 3 = Hardwire Kit. Reordering silently
   * breaks those references — there is no build or type error to catch it. Append
   * new entries at the end; never reorder.
   *
   * Numbering is rendered from <ol> order, so never hardcode "1." into a title.
   */
  disclaimers: Disclaimer[];
};

/**
 * PRODUCTION config. Staging does not get its own copy of this file — it applies the
 * partial overrides in `config/site.config.staging.ts` on top, selected by the
 * NEXT_PUBLIC_SITE_ENV env var (see the export at the bottom of this file). Keep
 * `main` and `staging` byte-identical here so the two branches never conflict on it.
 */
const baseConfig: SiteConfig = {
  name: "FineVu",
  tagline: "Global leader in dash cam technology",
  // "SONY STARVIS front sensors", not "SONY STARVIS image sensors" — only the front
  // sensor is a STARVIS; both spec sheets give the rear as CMOS 2MP. Beside "front and
  // rear" the old wording read as both channels. CA-61.
  description:
    "Premium 4K & 2K dash cams with SONY STARVIS front sensors and Full HD rear cameras. Engineered in Korea, backed by a 3-year Australian warranty.",

  contact: {
    phone: "1800 818 288",
    distributor: "AutoXtreme",
    distributorUrl: "https://autoxtreme.com.au",
    warranty: "3-Year Australian Warranty",
    warrantyInline: "3-year Australian warranty",
    origin: "Made in Korea",
  },

  logo: {
    src: "/brand/logo.svg",
    alt: "FineVu",
    heightClass: "h-8",
  },

  nav: [
    {
      href: "/gx4k",
      label: "Products",
      children: [
        { href: "/gx4k", label: "GX4K — 4K 2CH" },
        { href: "/gx35", label: "GX35 — 2K 2CH" },
      ],
    },
    { href: "/installation", label: "Installation" },
    { href: "/retailers", label: "Retailers" },
    { href: "/support", label: "Support" },
  ],

  primaryCta: { href: "/retailers", label: "Find Retailer" },
  secondaryCta: { href: "/gx4k", label: "Explore the Range" },

  // The anchors here must exist on the page: `#specs` and `#compare` are on the
  // Full Specifications / FineVu Series Comparison sections of both product pages.
  productSubNav: {
    "/gx4k": {
      label: "GX4K",
      links: [
        { href: "#top", label: "Overview" },
        { href: "#specs", label: "Tech Specs" },
        { href: "#compare", label: "Compare" },
      ],
      cta: { href: "/retailers", label: "Find Retailer" },
      dockAfterVh: 1.9,
    },
    "/gx35": {
      label: "GX35",
      links: [
        { href: "#top", label: "Overview" },
        { href: "#specs", label: "Tech Specs" },
        { href: "#compare", label: "Compare" },
      ],
      cta: { href: "/retailers", label: "Find Retailer" },
      dockAfterVh: 1.9,
    },
  },

  hero: {
    headline: "Global leader in dash cam technology.",
    sub: "What if your dash camera could make your drive safer? 4K brilliance with unrivalled safety — front & rear cameras with SONY STARVIS image sensors.",
    backgroundImage: "/brand/finevu-hero.jpg",
    theme: "dark",
  },

  brandMarquee: {
    eyebrow: "Trusted by drivers worldwide — 4 million+ sold",
    brands: [
      { name: "SONY STARVIS", url: "" },
      { name: "TRUE 4K UHD", url: "" },
      { name: "MADE IN KOREA", url: "" },
      { name: "3-YEAR WARRANTY", url: "" },
      { name: "ADAS SAFETY", url: "" },
      { name: "BUILT-IN GPS & WI-FI", url: "" },
      { name: "24/7 PARKING MODE", url: "" },
      { name: "4 MILLION+ SOLD", url: "" },
    ],
  },

  // PRODUCTION footer — two columns, no social row. The fuller three-column version
  // lives in site.config.staging.ts.
  //
  // NOTE: /contact is still in `comingSoon` below, so that link renders the Coming Soon
  // placeholder in production. It's retained deliberately (it was in the trimmed footer
  // as shipped) and is part of the CA-38 gated-CTA decision, not an oversight.
  footer: {
    columns: [
      {
        heading: "Dash Cams",
        links: [
          { href: "/gx4k", label: "GX4K — 4K 2CH" },
          { href: "/gx35", label: "GX35 — 2K 2CH" },
          { href: "/installation", label: "Installation" },
        ],
      },
      {
        heading: "Company",
        links: [
          { href: "/about", label: "About FineVu" },
          { href: "/installation", label: "Book Installation" },
          { href: "/contact", label: "Contact" },
          { href: "/support", label: "Help & Support" },
          // Kept in sync with contact.warranty above by hand — a config object can't
          // reference its own fields while being defined.
          { href: "/warranty", label: "3-Year Australian Warranty" },
        ],
      },
    ],
    social: [],
  },

  // Routes here render the Coming Soon placeholder instead of their page content.
  // e.g. ["/how-it-works", "/about"]
  // This list is the PRODUCTION gate. Staging ungates everything via site.config.staging.ts.
  comingSoon: [

    "/become-a-retailer",
    "/contact",
    "/faq",
    "/how-it-works",
    "/learn",
    "/retailers",
    "/register",
    "/warranty-claim",
    "/thank-you"

  ],

  // Order is load-bearing — see the `disclaimers` docs on SiteConfig above.
  disclaimers: [
    {
      title: "Warranty",
      body:
        "3-Year Warranty applies to FineVu dash cam main units only, including front and rear cameras, for 36 months from the date of purchase. Genuine FineVu accessories are covered by a 6-month warranty. Proof of purchase required. Full warranty terms apply. Your rights under the Australian Consumer Law are not excluded.",
    },
    {
      title: "SD Cards",
      body:
        "GX35 includes a FineVu 64GB MicroSD Card and Adapter. GX4K includes a FineVu 128GB MicroSD Card and Adapter. Included MicroSD Cards and adapters are covered by a 6-month warranty.",
    },
    {
      // Confirmed 2026-07-27: docs/content-sources/{gx4k,gx35}.txt both list a Hardwire Kit
      // AND a separate Power Cable under IN THE BOX, untagged. This wording is correct.
      title: "Hardwire Kit & Power Cable",
      body:
        "GX35 and GX4K include a Hardwire Kit and Power Cable. Included Hardwire Kits and Power Cables are covered by a 6-month warranty.",
    },
  ],
};

/**
 * The config this build ships.
 *
 * Set NEXT_PUBLIC_SITE_ENV=staging in the staging Vercel project to layer
 * `stagingOverrides` on top; leave it unset in production. The check is fail-safe by
 * design — an unset var or a typo yields the gated production config, never an
 * accidentally ungated one (same convention as SITE_INDEXABLE).
 *
 * It must stay NEXT_PUBLIC_: ComingSoonGate and Navigation are client components, so a
 * server-only var would read as `undefined` in the browser bundle. Next inlines the
 * value at BUILD time, which is what we want — each Vercel project bakes in its own.
 *
 * The merge is SHALLOW. Overrides replace whole top-level fields.
 */
export const siteConfig: SiteConfig =
  process.env.NEXT_PUBLIC_SITE_ENV === "staging"
    ? { ...baseConfig, ...stagingOverrides }
    : baseConfig;
