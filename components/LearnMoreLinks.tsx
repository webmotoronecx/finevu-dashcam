import Link from "next/link";
import { ChevronRight } from "lucide-react";
import IconCheck from '@/public/common/icon-check.svg';
import IconGear from '@/public/common/icon-gear.svg';
import IconHeadphones from '@/public/common/icon-headphones.svg';



// Sitewide bottom-banner quick-links strip; pass `exclude` (an href) to drop the current page's link

type Item = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  href: string;
};

const ITEMS: Item[] = [
  { icon: IconCheck, label: "Where to buy", href: "/retailers" },
  { icon: IconGear, label: "Install", href: "/installation" },
  { icon: IconHeadphones, label: "Support", href: "/support" },
];

export function LearnMoreLinks({
  exclude,
  className = "",    
  theme = "light",
}: {
  exclude?: string;
  className?: string;
  theme?: "light" | "dark";
}) {
  const items = exclude ? ITEMS.filter((i) => i.href !== exclude) : ITEMS;
  const dark = theme === "dark";
  const sectionBg = dark ? "bg-[#121214]" : "bg-[#f7f7f7]";
  const titleColor = dark ? "text-white" : "text-[#191919]";
  const linkColor = dark ? "text-white/70" : "text-[#5c6478]";
  return (
    <section className={`${sectionBg} py-16 md:py-[70px] ${className}`} data-nav-theme={theme}>
      <div className="mx-auto flex max-w-[1000px] flex-wrap items-start justify-center gap-x-[clamp(48px,9vw,113px)] gap-y-12 px-6 text-center">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="w-[240px] max-w-full">
              <div className="mx-auto mb-4 flex h-16 w-20 items-center justify-center text-[var(--finevu-orange)]">
                <Icon/>
              </div>
              <h3 className={`text-[22px] font-semibold leading-[27.5px] ${titleColor}`}>{it.label}</h3>
              <Link
                href={it.href}
                className={`mt-2 inline-flex items-center gap-1 text-[15.6px] font-medium ${linkColor} transition-colors hover:text-[var(--finevu-orange)]`}
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
