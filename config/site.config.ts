/**
 * site.config.ts — per-client content configuration
 *
 * This is the single source of truth for all site content that varies per client:
 * navigation, hero copy, CTAs, brand logos, etc.
 *
 * To rebrand for another client:
 *   1. Fork this file
 *   2. Override tokens in app/globals.css (colors, fonts)
 *   3. Replace /public/brand/logo.svg
 *
 * No component code changes required.
 */

export type NavLink = {
  href: string;
  label: string;
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

  /** Brand marquee — logos of supported brands/partners */
  brandMarquee: {
    eyebrow: string;
    brands: BrandLogo[];
  };
};

export const siteConfig: SiteConfig = {
  name: "EV360",
  tagline: "360° EV battery health checks",
  description:
    "Complete battery assessments, delivered at your home, workplace, or our service centre.",

  logo: {
    src: "/brand/logo.svg",
    alt: "EV360",
    heightClass: "h-8",
  },

  nav: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/services", label: "Services" },
    { href: "/learn", label: "Learn" },
    { href: "/partners", label: "Partners" },
  ],

  primaryCta: { href: "/booking", label: "Check My EV" },
  secondaryCta: { href: "/how-it-works", label: "How It Works" },

  hero: {
    headline: "360° EV battery health checks. Starting from $199*",
    sub: "Complete battery assessments, delivered at your home, workplace, or our service centre.",
    backgroundImage: "/assets/a1d6942ee887e7e369119006a92beb2d4a36fb01.png",
    theme: "dark",
  },

  brandMarquee: {
    eyebrow: "Supporting all EV brands",
    brands: [
      { name: "Tesla", url: "https://cdn.simpleicons.org/tesla/ffffff" },
      { name: "BYD", url: "https://www.carlogos.org/logo/BYD-logo-2007-2560x1440.png", invert: true },
      { name: "MG", url: "https://cdn.simpleicons.org/mg/ffffff" },
      { name: "Hyundai", url: "https://cdn.simpleicons.org/hyundai/ffffff" },
      { name: "Kia", url: "https://cdn.simpleicons.org/kia/ffffff" },
      { name: "Nissan", url: "https://cdn.simpleicons.org/nissan/ffffff" },
      { name: "BMW", url: "https://cdn.simpleicons.org/bmw/ffffff" },
      { name: "Mercedes", url: "https://www.carlogos.org/logo/Mercedes-Benz-logo-2011-1920x1080.png", invert: true },
      { name: "Audi", url: "https://cdn.simpleicons.org/audi/ffffff" },
      { name: "Volkswagen", url: "https://cdn.simpleicons.org/volkswagen/ffffff" },
      { name: "Polestar", url: "https://cdn.simpleicons.org/polestar/ffffff" },
      { name: "Volvo", url: "https://cdn.simpleicons.org/volvo/ffffff" },
      { name: "Porsche", url: "https://cdn.simpleicons.org/porsche/ffffff" },
      { name: "Ford", url: "https://cdn.simpleicons.org/ford/ffffff" },
    ],
  },
};
