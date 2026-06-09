"use client";

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from "motion/react";
import Link from "next/link";
const logoSvg = '/brand/logo.svg';

export function Footer() {
  return (
    <div className="relative pb-16 bg-black overflow-hidden" data-nav-theme="dark">
      {/* Background Image for entire section including bottom padding */}
      <div className="absolute inset-0">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1739167378790-836fc651869c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBzdW5zZXQlMjByb2FkfGVufDF8fHx8MTc2NDEyNzIwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Electric vehicle on scenic road"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>
      
      {/* CTA Background Section */}
      <section className="relative py-64 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1739167378790-836fc651869c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBzdW5zZXQlMjByb2FkfGVufDF8fHx8MTc2NDEyNzIwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Electric vehicle on scenic road"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        {/* CTA Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to check your EV?
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg text-white/90 mx-auto leading-relaxed mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            EV checks from <span className="font-mono text-white">$199</span>
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/booking">
              <motion.button 
                className="px-8 py-3 rounded-full bg-[var(--brand-primary)] text-white smooth-transition electric-glow font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Battery Check
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button 
                className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 smooth-transition font-medium hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Services
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Rounded Footer Container - Overlays CTA */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-20 -mt-48">
        <footer className="bg-black/60 backdrop-blur-xl rounded-[2rem] p-16 lg:p-24 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
            {/* Brand */}
            <div className="space-y-6">
              <img src={logoSvg} alt="EV360 Logo" className="h-8" />
              <p className="text-zinc-500 leading-relaxed text-sm">
                Australia's benchmark for EV battery health transparency.
              </p>
              
            </div>
            {/* Locations */}
            <div>
              <h4 className="text-white mb-6 font-medium">Locations</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-zinc-400 mb-2 font-mono text-xs uppercase tracking-wider">Victoria</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    6/174-186 Atlantic Dr<br />
                    Keysborough VIC 3173
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 mb-2 font-mono text-xs uppercase tracking-wider">Queensland</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    2/39 Ellison Rd<br />
                    Geebung QLD 4034
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white mb-6 font-medium">Services</h4>
              <ul className="space-y-4">
                <li><Link href="/services" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Battery Health Testing</Link></li>
                <li><Link href="/services" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Full EV Diagnostics</Link></li>
                <li><Link href="/services" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Mobile Service</Link></li>
                <li><Link href="/services" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Diagnostic Centre</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white mb-6 font-medium">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">About</Link></li>
                <li><Link href="/stories" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Customer Stories</Link></li>
                <li><Link href="/partners" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Partners</Link></li>
                <li><a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Careers</a></li>
                <li><Link href="/contact" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white mb-6 font-medium">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/learn" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">EV Education Hub</Link></li>
                <li><Link href="/battery-guide" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Battery Health Guide</Link></li>
                <li><Link href="/faq" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">FAQ</Link></li>
                <li><Link href="/support" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)] text-sm">Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600 font-mono">© 2025 EV360. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-wider">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)]">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)]">Facebook</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)]">LinkedIn</a>
              <span className="text-zinc-800 hidden md:inline">|</span>
              <a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)]">Privacy Policy</a>
              <a href="#" className="text-zinc-400 smooth-transition hover:text-[var(--brand-primary)]">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}