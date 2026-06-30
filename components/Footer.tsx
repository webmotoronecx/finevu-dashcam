"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  const { contact } = siteConfig;

  return (
    <div className="relative overflow-hidden bg-black" data-nav-theme="dark">
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* CTA */}
        <div className="text-center pt-24 md:pt-32 pb-12">
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
            {contact.origin}. Backed by a {contact.warranty.toLowerCase()}.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/where-to-buy">
              <motion.button
                className="px-9 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white smooth-transition electric-glow font-semibold text-sm uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Retailer
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Footer panel, set over the product image */}
        <div className="pb-28">
          <footer className="rounded-[2rem] border border-white/10 px-8 md:px-12 lg:px-16 py-14 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-14 mb-10">
              {/* Brand */}
              <div className="space-y-5 md:col-span-2">
                <Logo className="h-8" />
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

              {/* Products */}
              <div>
                <h4 className="text-white mb-5 font-semibold text-sm">Dash Cams</h4>
                <ul className="space-y-3">
                  <li><Link href="/gx4k" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">GX4K - 4K 2CH</Link></li>
                  <li><Link href="/gx35" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">GX35 - 2K 2CH</Link></li>
                  <li><Link href="/how-it-works" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Features &amp; App</Link></li>
                  <li><Link href="/services" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Installation</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white mb-5 font-semibold text-sm">Company</h4>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">About FineVu</Link></li>
                  <li><Link href="/where-to-buy" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Where to Buy</Link></li>
                  <li><Link href="/learn" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Learn</Link></li>
                  <li><Link href="/contact" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Contact</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white mb-5 font-semibold text-sm">Support</h4>
                <ul className="space-y-3">
                  <li><Link href="/support" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Help &amp; Support</Link></li>
                  <li><Link href="/faq" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">FAQs</Link></li>
                  <li><Link href="/booking" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Book Installation</Link></li>
                  <li><span className="text-zinc-400 text-sm">{contact.warranty}</span></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-zinc-500 font-mono">© 2026 FINEVU. ALL RIGHTS RESERVED.</p>
              <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-wider">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Instagram</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Facebook</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">YouTube</a>
                <span className="text-zinc-700 hidden md:inline">|</span>
                <a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Privacy Policy</a>
                <a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
