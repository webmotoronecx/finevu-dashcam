"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  const { contact } = siteConfig;

  return (
    <div className="relative bg-[#656565]" data-nav-theme="dark">
      {/* CTA — image placeholder, solid #656565 box per Figma. Client to supply art. */}
      <section className="relative bg-[#656565] py-24 md:py-28 overflow-hidden">
        {/* CTA Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto uppercase"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ask more of your dash cam.
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-white/90 mx-auto leading-relaxed mb-12 text-center max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {contact.origin}. Backed by a {contact.warranty.toLowerCase()}.
          </motion.p>
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="#">
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
      </section>

      {/* Rounded dark footer card */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-20 py-12 md:py-16">
        <footer className="bg-[#161617] rounded-[2rem] p-16 lg:p-24 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
            {/* Brand */}
            <div className="space-y-6 md:col-span-2">
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
              <h4 className="text-white mb-6 font-semibold">Dash Cams</h4>
              <ul className="space-y-4">
                <li><Link href="/gx4k" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">GX4K — 4K 2CH</Link></li>
                <li><Link href="/gx35" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">GX35 — 2K 2CH</Link></li>
                <li><Link href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Features &amp; App</Link></li>
                <li><Link href="/services" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Installation</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white mb-6 font-semibold">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">About FineVu</Link></li>
                <li><Link href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Where to Buy</Link></li>
                <li><Link href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Learn</Link></li>
                <li><Link href="/contact" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white mb-6 font-semibold">Support</h4>
              <ul className="space-y-4">
                <li><Link href="/support" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Help &amp; Support</Link></li>
                <li><Link href="/faq" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">FAQs</Link></li>
                <li><Link href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)] text-sm">Book Installation</Link></li>
                <li><span className="text-zinc-400 text-sm">{contact.warranty}</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-500 font-mono">© 2026 FINEVU. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-wider">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Facebook</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">YouTube</a>
              <span className="text-zinc-800 hidden md:inline">|</span>
              <a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Privacy Policy</a>
              <a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--finevu-orange)]">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
