"use client";

import { Footer } from '@/components/Footer';
import { BusinessEnquiryForm } from '@/components/BusinessEnquiryForm';
import { ScrollProgress } from '@/components/ScrollProgress';
import { motion } from 'motion/react';
import { Phone, Globe, MapPin, Clock, ShieldCheck, HelpCircle, LifeBuoy, ArrowRight } from 'lucide-react';
import Link from "next/link";

export default function Page() {
  const contactCards = [
    {
      icon: Phone,
      title: "Call support",
      content: "1800 818 288",
      subtext: "Auto Xtreme — Australian distributor for FineVu",
      link: "tel:1800818288",
      external: false,
    },
    {
      icon: Globe,
      title: "Online",
      content: "autoxtreme.com.au",
      subtext: "Product details, stockists and support",
      link: "https://autoxtreme.com.au",
      external: true,
    },
    {
      icon: MapPin,
      title: "Where to buy",
      content: "Find a FineVu stockist",
      subtext: "Authorised dealers across Australia",
      link: "/where-to-buy",
      external: false,
    },
    {
      icon: Clock,
      title: "Support hours",
      content: "Mon–Fri, 9:00 AM – 5:00 PM AEST",
      subtext: "We reply to enquiries within one business day",
      link: null,
      external: false,
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
              Contact FineVu
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              Get in touch.
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Questions about a FineVu dash cam, installation or your warranty? FineVu is
              distributed in Australia by Auto Xtreme — reach the team below.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <span className="finevu-capsule">Made in Korea</span>
              <span className="finevu-capsule">3-Year Australian Warranty</span>
              <span className="finevu-capsule">4 million+ sold worldwide</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact details + form */}
      <section className="py-24 md:py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: contact detail cards */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Talk to the team
                </h2>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  Auto Xtreme handles FineVu sales, support and warranty in Australia. Call,
                  visit us online, or send a message and we'll get back to you.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactCards.map((item, index) => {
                  const Icon = item.icon;
                  const CardInner = (
                    <motion.div
                      className="p-7 rounded-[2rem] border border-zinc-200 transition-all hover:border-[var(--finevu-orange)] hover:shadow-lg space-y-4 h-full"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -6 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--finevu-orange)]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[var(--finevu-orange)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1 text-zinc-900">{item.title}</h3>
                        <p className="text-base text-zinc-800">{item.content}</p>
                        <p className="text-sm text-zinc-500 mt-1">{item.subtext}</p>
                      </div>
                    </motion.div>
                  );

                  if (!item.link) {
                    return <div key={index}>{CardInner}</div>;
                  }

                  return item.external ? (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {CardInner}
                    </a>
                  ) : item.link.startsWith("/") ? (
                    <Link key={index} href={item.link} className="block">
                      {CardInner}
                    </Link>
                  ) : (
                    <a key={index} href={item.link} className="block">
                      {CardInner}
                    </a>
                  );
                })}
              </div>

              {/* Trust + quick links */}
              <div className="rounded-[2rem] bg-zinc-50 border border-zinc-200 p-7 space-y-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-[var(--finevu-orange)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Every FineVu camera sold by Auto Xtreme is covered by a{" "}
                    <span className="font-semibold text-zinc-900">3-Year Australian Warranty</span>{" "}
                    and built with SONY STARVIS sensors.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-[var(--finevu-orange)] transition-colors"
                  >
                    <LifeBuoy className="w-4 h-4" /> Help &amp; support
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-[var(--finevu-orange)] transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" /> Read the FAQ
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right: enquiry form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <BusinessEnquiryForm
                type="Sales"
                title="Send us a message"
                subtitle="Tell us which model you're after — GX4K or GX35 — and how we can help. We'll reply within one business day."
                showCompany={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product pointer band */}
      <section className="py-24 md:py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Not sure which model?
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Compare our premium 4K and 2K front + rear dash cams, then talk to us about the
              right fit for your vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/gx4k">
                <motion.button
                  className="px-7 py-3 rounded-full bg-[var(--finevu-orange)] text-white font-semibold transition-transform"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Explore GX4K
                </motion.button>
              </Link>
              <Link href="/gx35">
                <motion.button
                  className="px-7 py-3 rounded-full border-2 border-zinc-300 font-semibold transition-colors hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)]"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Explore GX35
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
