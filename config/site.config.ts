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
    warranty: string;
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
  description:
    "Premium 4K & 2K front and rear dash cams with SONY STARVIS image sensors. Engineered in Korea, backed by a 3-year Australian warranty.",

  contact: {
    phone: "1800 818 288",
    distributor: "AutoXtreme",
    distributorUrl: "https://autoxtreme.com.au",
    warranty: "3-Year Australian Warranty",
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

  // Routes here render the Coming Soon placeholder instead of their page content.
  // e.g. ["/services", "/about"]
  // This list is the PRODUCTION gate. Staging ungates everything via site.config.staging.ts.
  comingSoon: [

    "/become-a-retailer",
    "/contact",
    "/faq",
    "/how-it-works",
    "/learn",
    "/retailers",
    "/services",

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
