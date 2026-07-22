import Link from "next/link";
import { CircleCheckBig, Settings, Headphones, ChevronRight } from "lucide-react";

// Sitewide bottom-banner quick-links strip; pass `exclude` (an href) to drop the current page's link

type Item = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
};

const ITEMS: Item[] = [
  { icon: CircleCheckBig, label: "Where to buy", href: "/retailers" },
  { icon: Settings, label: "Install", href: "/installation" },
  { icon: Headphones, label: "Support", href: "/support" },
];

export function LearnMoreLinks({ exclude, className = "" }: { exclude?: string; className?: string }) {
  const items = exclude ? ITEMS.filter((i) => i.href !== exclude) : ITEMS;
  return (
    <section className={`bg-[#f7f7f7] py-16 md:py-[70px] ${className}`} data-nav-theme="light">
      <div className="mx-auto flex max-w-[1000px] flex-wrap items-start justify-center gap-x-[clamp(48px,9vw,113px)] gap-y-12 px-6 text-center">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="w-[240px] max-w-full">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center text-[var(--finevu-orange)]">
                <Icon className="h-14 w-14" strokeWidth={1.4} />
              </div>
              <h3 className="text-[22px] font-semibold leading-[27.5px] text-[#191919]">{it.label}</h3>
              <Link
                href={it.href}
                className="mt-2 inline-flex items-center gap-1 text-[15.6px] font-medium text-[#5c6478] transition-colors hover:text-[var(--finevu-orange)]"
              >
                Learn More <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
