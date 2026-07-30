// Staging-only deviations from the production config in ./site.config.ts.
//
// Two deviations today: nothing is gated, and the footer shows its full link set.
//
// Applied ONLY when NEXT_PUBLIC_SITE_ENV=staging (set it in the staging Vercel project,
// or in .env.local for a staging-shaped run of `npm run dev`). Anything not listed here
// is inherited from the base config, so content edits are only ever made in one place.
//
// The merge is SHALLOW (`{ ...base, ...stagingOverrides }`), so an override replaces a
// whole top-level field: writing `contact: { phone: "..." }` would drop every other
// `contact` key. Spread the base field if you ever need a partial override.
//
// This file is committed to BOTH branches and must stay identical on both — the whole
// point is that `main` and `staging` never diverge on config.

import type { SiteConfig } from "./site.config";

export const stagingOverrides: Partial<SiteConfig> = {
  // Nothing is gated on staging — every route is reviewable without ?showpage=true.
  comingSoon: [],

  // The FULL footer: three link columns plus the social row. Production ships a trimmed
  // two-column version (see `footer` in site.config.ts) because most of the links below
  // point at routes that ARE gated in production — /how-it-works, /retailers,
  // /become-a-retailer, /learn, /faq. On staging nothing is gated, so they all resolve.
  //
  // Restored from the pre-e972db7 footer, which dropped it "per the new design".
  footer: {
    columns: [
      {
        heading: "Dash Cams",
        links: [
          { href: "/gx4k", label: "GX4K - 4K 2CH" },
          { href: "/gx35", label: "GX35 - 2K 2CH" },
          { href: "/how-it-works", label: "Features & App" },
          { href: "/installation", label: "Installation" },
        ],
      },
      {
        heading: "Company",
        links: [
          { href: "/about", label: "About FineVu" },
          { href: "/retailers", label: "Where to Buy" },
          { href: "/become-a-retailer", label: "Become a Retailer" },
          { href: "/learn", label: "Learn" },
          { href: "/contact", label: "Contact" },
        ],
      },
      {
        heading: "Support",
        links: [
          { href: "/support", label: "Help & Support" },
          { href: "/faq", label: "FAQs" },
          { href: "/installation", label: "Book Installation" },
          { href: "/warranty", label: "3-Year Australian Warranty" },
        ],
      },
    ],
    // ⚠️ PLACEHOLDERS — bare domains, not FineVu accounts. Harmless here because this
    // file only ever applies to staging, which is noindex and internal. Real profile
    // URLs are a launch to-do; NEVER promote these to baseConfig as-is.
    social: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://facebook.com", label: "Facebook" },
      { href: "https://youtube.com", label: "YouTube" },
    ],
  },
};
