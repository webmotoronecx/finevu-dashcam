import { BrandedNotice } from "@/components/BrandedNotice";

/**
 * Branded placeholder shown in place of a page's content when its route is
 * listed in `siteConfig.comingSoon` (see components/ComingSoonGate.tsx).
 */
export function ComingSoon() {
  return (
    <BrandedNotice
      title="Coming Soon"
      sub="This page is on its way. Check back soon."
      cta={{ label: "Back to Home", href: "/" }}
    />
  );
}
