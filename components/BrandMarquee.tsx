"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/config/site.config";

// Orange scrolling proof-point strip shown directly beneath the hero
export function BrandMarquee() {
  const { brands } = siteConfig.brandMarquee;
  // Triple for a seamless infinite scroll.
  const items = [...brands, ...brands, ...brands];

  return (
    <div
      className="relative w-full overflow-hidden bg-[var(--finevu-orange)] py-3.5"
      data-nav-theme="light"
    >
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: [0, "-33.333%"] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 24, ease: "linear" },
        }}
      >
        {items.map((brand, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <span className="text-white/95 tracking-[0.18em] uppercase text-[11px] md:text-xs font-mono">
              {brand.name}
            </span>
            <span className="mx-6 md:mx-9 text-white/55 text-xs">/</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
