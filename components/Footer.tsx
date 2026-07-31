"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site.config";

/**
 * Grid geometry per column count. Keyed off `footer.columns.length` so the two config
 * variants each render the layout they were designed at: production's 2 columns on a
 * 12-grid, staging's 3 on a 5-grid (brand ~40% wide).
 *
 * These MUST stay literal strings — Tailwind v4 scans source text, so a computed class
 * name like `md:col-span-${n}` would never be generated.
 */
const GRID = {
  2: { wrapper: "md:grid-cols-12", brand: "md:col-span-6", col: "md:col-span-3" },
  3: { wrapper: "md:grid-cols-5", brand: "md:col-span-2", col: "md:col-span-1" },
} as const;

const LINK_CLASS =
  "text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm";

export function Footer({ cta = true }: { cta?: boolean } = {}) {
  const { contact, footer } = siteConfig;
  const grid = GRID[footer.columns.length as keyof typeof GRID] ?? GRID[2];

  return (
    <div className="relative overflow-hidden bg-black" data-nav-theme="dark">
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* CTA */}
        {cta && (
        <div className="text-center pt-12 md:pt-32 pb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-5 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ask more of your dash cam.
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-white/85 mx-auto leading-relaxed mb-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {/* warrantyInline, not warranty.toLowerCase() — the latter also lowercased
                "Australian". See the note on `contact` in config/site.config.ts. CP-11. */}
            {contact.origin}. Backed by a {contact.warrantyInline}.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/retailers">
              <motion.button
                className="cta-hover px-9 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase leading-[20px]"
              >
                Find Retailer
              </motion.button>
            </Link>
          </motion.div>
        </div>
        )}

        {/* Footer panel, set over the product image */}
        <div className={`pb-28 ${cta ? "" : "pt-24 md:pt-32"}`}>
          <footer className="rounded-[2rem] border border-white/10 px-8 md:px-12 lg:px-16 py-14 lg:py-16">
            <div className={`grid grid-cols-1 ${grid.wrapper} gap-10 lg:gap-14 mb-10`}>
              {/* Brand */}
              <div className={`space-y-5 ${grid.brand}`}>
                <Logo variant="dark" className="h-8" />
                <p className="text-zinc-400 leading-relaxed text-sm max-w-xs">
                  Premium 4K &amp; 2K front and rear dash cams with SONY STARVIS image
                  sensors. {contact.origin}, trusted by drivers worldwide.
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-zinc-300">
                    Distributed in Australia by {contact.distributor}
                  </p>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-zinc-400 hover:text-[var(--finevu-orange)] transition-colors block"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={contact.distributorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-[var(--finevu-orange)] transition-colors block"
                  >
                    {contact.distributorUrl.replace("https://", "")}
                  </a>
                </div>
              </div>

              {/* Link columns — see `footer` in config/site.config.ts */}
              {footer.columns.map((column) => (
                <div key={column.heading} className={grid.col}>
                  <h4 className="text-white mb-5 font-semibold text-sm">{column.heading}</h4>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={`${column.heading}-${link.href}-${link.label}`}>
                        <Link href={link.href} className={LINK_CLASS}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-zinc-500 font-mono">© 2026 FINEVU. ALL RIGHTS RESERVED.</p>
              <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-wider">
                {footer.social.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]"
                  >
                    {link.label}
                  </a>
                ))}
                {/* Separator only makes sense with something to its left. */}
                {footer.social.length > 0 && (
                  <span className="text-zinc-700 hidden md:inline">|</span>
                )}
                <a href="https://motoronegroup.com/privacy-policy/" target="_blank" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Privacy Policy</a>
                <a href="/terms-of-service" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
