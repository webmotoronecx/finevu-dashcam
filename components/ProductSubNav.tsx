"use client";

import Link from "next/link";
import type { NavLink, ProductSubNav as ProductSubNavEntry } from "@/config/site.config";
import { glassBorderClass } from "@/components/navGlass";

// Per Figma: a black 25% scrim over a 15px blur. Darker and less blurred than the main
// navbar's glass (components/navGlass.ts), so the two rows read as separate surfaces.
// The light variant mirrors it for the light product page (/gx35), where dark-on-dark
// scrim would leave the zinc link colours unreadable.
const surface = (isDark: boolean): React.CSSProperties => ({
  background: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.55)",
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  transition: "background 250ms ease, border-color 250ms ease",
});

/**
 * The second full-width row on the product pages: product name, in-page links and the
 * gradient Find Retailer CTA. Purely presentational — the swipe-up / dock behaviour is
 * owned by <Navigation>, which renders this.
 */
export function ProductSubNav({
  entry,
  isDark,
}: {
  entry: ProductSubNavEntry;
  isDark: boolean;
}) {
  const linkClass = `text-[15px] tracking-[-0.3px] font-medium whitespace-nowrap transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2 ${
    isDark ? "text-white/75 hover:text-white" : "text-zinc-600 hover:text-zinc-950"
  }`;

  // "Back to the hero" — scroll the window rather than target an element, so nothing has
  // to be anchored onto <ScrollHero>. Shared by the `#top` link and the product label.
  const toTop = () => window.scrollTo({ top: 0 });

  const renderLink = (l: NavLink) =>
    l.href === "#top" ? (
      <button key={l.href} type="button" onClick={toTop} className={linkClass}>
        {l.label}
      </button>
    ) : (
      <a key={l.href} href={l.href} className={linkClass}>
        {l.label}
      </a>
    );

  return (
    <nav
      aria-label={`${entry.label} sections`}
      // `navigation-sub` is an unstyled hook for finding this row in devtools.
      className={`navigation-sub w-full  ${glassBorderClass(isDark)}`}
      style={surface(isDark)}
    >
      <div className="mx-auto flex h-[52px] max-w-[1400px] items-center gap-4 px-4 md:h-[56px] md:px-8">
        <button
          type="button"
          onClick={toTop}
          aria-label={`${entry.label} — back to top`}
          className={`cursor-pointer shrink-0 rounded-md text-[24px] font-bold tracking-[-0.3px] transition-transform ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2 ${
            isDark ? "text-white" : "text-zinc-950 "
          }`}
        >
          {entry.label}
        </button>

        {/* Desktop: links + gradient CTA, right-aligned */}
        <div className="ml-auto hidden xl:flex items-center gap-8">
          {entry.links.map(renderLink)}
          <Link
            href={entry.cta.href}
            className="cta-hover rounded-[6.5rem] px-9 py-2 text-[14px] font-semibold uppercase leading-[20px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--finevu-orange)] focus-visible:ring-offset-2"
            style={{ backgroundImage: "var(--brand-gradient-v2)" }}
          >
            {entry.cta.label}
          </Link>
        </div>

        {/* Mobile: scrollable link row, no CTA (the main nav already carries one) */}
        <div className="xl:hidden -mx-1 flex min-w-0 flex-1 items-center justify-end gap-6 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {entry.links.map(renderLink)}
        </div>
      </div>
    </nav>
  );
}
