// Per-client content config: nav, hero, CTAs and trust marquee (single source of truth)

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
};

export const siteConfig: SiteConfig = {
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
  comingSoon: [
    "/about", 
    "/become-a-retailer", 
    "/contact", 
    "/faq",
    "/how-it-works",
    "/learn",
    "/retailers",
    "/services",
    "/support"
  ],
};
