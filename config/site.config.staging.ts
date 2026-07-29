// Staging-only deviations from the production config in ./site.config.ts.
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
};
