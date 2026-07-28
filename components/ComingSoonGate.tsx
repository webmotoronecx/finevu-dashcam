"use client";

import { ComingSoon } from "@/components/ComingSoon";
import { siteConfig } from "@/config/site.config";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Router-aware wrapper placed around the page content in the root layout.
 * If the current route is listed in `siteConfig.comingSoon`, it renders the
 * <ComingSoon /> placeholder instead of the page. The global <Navigation />
 * lives outside this gate, so it always renders.
 *
 * Preview bypass: append `?showpage=true` to a gated route to reveal the real
 * page (for internal review of work-in-progress pages).
 */
export function ComingSoonGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Normalize a trailing slash (but keep the root "/").
  const path = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const gated = siteConfig.comingSoon.includes(path);

  // Read the bypass param client-side (not via useSearchParams) so gated routes
  // never ship real-page HTML in the static build and no Suspense boundary is
  // required. The page renders ComingSoon first, then swaps in after mount.
  const [bypass, setBypass] = useState(false);
  useEffect(() => {
    if (!gated) return;
    const params = new URLSearchParams(window.location.search);
    setBypass(params.get("showpage") === "true");
  }, [gated, pathname]);

  if (gated && !bypass) {
    return <ComingSoon />;
  }

  return <>{children}</>;
}
