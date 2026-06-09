"use client";

import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { motion } from 'motion/react';
import {
  Wrench,
  Smartphone,
  Settings,
  ParkingCircle,
  ShieldCheck,
  AlertTriangle,
  Phone,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import Link from "next/link";

export default function Page() {
  const topics = [
    {
      icon: Wrench,
      title: "Installation guides",
      description:
        "Step-by-step DIY setup for your front + rear FineVu, or book a professional fit. Hardwiring, cable routing and best camera placement.",
      links: [
        { label: "Installation services", href: "/services" },
        { label: "Book a fit", href: "/booking" },
      ],
    },
    {
      icon: Smartphone,
      title: "FineVu app & pairing",
      description:
        "Connect over Wi-Fi, set up GPS, and view, save and share footage straight from your phone. Pair your GX4K or GX35 in minutes.",
      links: [
        { label: "GX4K", href: "/gx4k" },
        { label: "GX35", href: "/gx35" },
      ],
    },
    {
      icon: Settings,
      title: "Firmware & settings",
      description:
        "Keep your camera current with the latest firmware, adjust recording quality, loop length, time and date, and SONY STARVIS exposure.",
      links: [{ label: "How it works", href: "/how-it-works" }],
    },
    {
      icon: ParkingCircle,
      title: "Parking mode setup",
      description:
        "Enable motion and impact detection while parked. Set buffered recording, low-voltage cut-off, and protect your car around the clock.",
      links: [{ label: "Learn more", href: "/learn" }],
    },
    {
      icon: ShieldCheck,
      title: "Warranty & repairs",
      description:
        "Every FineVu comes with a 3-Year Australian Warranty. Lodge a claim or arrange a repair through Auto Xtreme on 1800 818 288.",
      links: [
        { label: "Call 1800 818 288", href: "tel:1800818288" },
        { label: "Contact us", href: "/contact" },
      ],
    },
    {
      icon: AlertTriangle,
      title: "Troubleshooting",
      description:
        "Not recording? App won't connect? SD card errors? Work through the common fixes, or reach the team for hands-on help.",
      links: [{ label: "Read the FAQ", href: "/faq" }],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />

      {/* Hero */}
      <section
        className="relative pt-32 md:pt-40 pb-24 overflow-hidden brand-gradient"
        data-nav-theme="dark"
      >
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--finevu-orange)]">
              FineVu Support
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              Help &amp; support.
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Everything you need to install, set up and get the most from your FineVu dash cam.
              Backed by Auto Xtreme and a 3-Year Australian Warranty.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <span className="finevu-capsule">Made in Korea</span>
              <span className="finevu-capsule">SONY STARVIS sensors</span>
              <span className="finevu-capsule">4 million+ sold worldwide</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help topics grid */}
      <section className="py-24 md:py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Browse help topics
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Pick a topic to get going, or jump straight to the team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={index}
                  className="p-8 rounded-[2rem] border border-zinc-200 transition-all hover:border-[var(--finevu-orange)] hover:shadow-lg space-y-5 h-full flex flex-col"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--finevu-orange)]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[var(--finevu-orange)]" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-zinc-900">{topic.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">{topic.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                    {topic.links.map((link, lIdx) =>
                      link.href.startsWith("/") ? (
                        <Link
                          key={lIdx}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-[var(--finevu-orange)] transition-colors"
                        >
                          {link.label}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <a
                          key={lIdx}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-[var(--finevu-orange)] transition-colors"
                        >
                          {link.label}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Talk to support band */}
      <section className="py-24 md:py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="rounded-[2rem] brand-gradient p-10 md:p-16 text-center overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--finevu-orange)] flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Talk to support
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Still stuck? Auto Xtreme, FineVu's Australian distributor, can help with setup,
              warranty and repairs. Call us during support hours, Mon–Fri 9:00 AM – 5:00 PM AEST.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:1800818288">
                <motion.button
                  className="px-8 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-lg transition-transform"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Call 1800 818 288
                </motion.button>
              </a>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-semibold text-lg transition-colors hover:border-white"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Send a message
                </motion.button>
              </Link>
            </div>
            <div className="pt-8">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-[var(--finevu-orange)] transition-colors"
              >
                <HelpCircle className="w-4 h-4" /> Prefer to read first? Check the FAQ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
