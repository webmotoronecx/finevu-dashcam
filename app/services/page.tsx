"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ServiceCard } from '@/components/ServiceCard';
import { TiltCard } from '@/components/TiltCard';
import { motion } from 'motion/react';
import {
  Wrench,
  Users,
  CheckCircle,
  PlugZap,
  ShieldCheck,
  Cable,
  PlayCircle,
  MapPin,
} from 'lucide-react';
import Link from "next/link";

// NOTE: No real product photography available — road/driving Unsplash shots
// and brand-gradient panels are used as placeholders throughout.

export default function Page() {
  // Indicative, illustrative pricing only — confirm at booking.
  const packages = [
    {
      name: "DIY Support",
      price: "From $0",
      duration: "Everything in the box",
      features: [
        "All cables and mounts included",
        "Step-by-step support videos",
        "Plug & play front cable",
        "Phone and email support",
        "Hardwire kit guidance",
      ],
      recommended: false,
    },
    {
      name: "Professional Install",
      price: "From $99",
      duration: "Mobile, at your location",
      features: [
        "One of 80+ experienced installers",
        "Clean, hidden wiring finish",
        "Front + rear camera fitted",
        "Hardwiring to unlock all ADAS features",
        "Comes to your home or office",
      ],
      recommended: true,
    },
    {
      name: "Fleet & Multi-vehicle",
      price: "From $89",
      duration: "Per vehicle, volume pricing",
      features: [
        "Bulk install across your fleet",
        "Consistent setup on every vehicle",
        "Flexible on-site scheduling",
        "Dedicated account contact",
        "Maximum reliability and uptime",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative pt-32 md:pt-40 pb-24 flex items-center justify-center overflow-hidden brand-gradient"
        data-nav-theme="dark"
      >
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--finevu-orange)]">
              Installation
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Install it your way
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Fit it yourself with everything in the box, or have an experienced installer
              come to you for a clean, hidden finish.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Paths */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Two ways to fit your FineVu
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Both get you protected — choose the path that suits you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* DIY */}
            <motion.div
              className="rounded-[2rem] p-10 lg:p-12 border border-zinc-200 bg-zinc-50 space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--finevu-light-grey)]">
                <Wrench className="w-8 h-8 text-[var(--finevu-orange)]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-3 tracking-tight">Do it yourself</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Everything you need is already in the box. With clear guidance and
                  support videos, most people are up and running in under an hour.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: CheckCircle, text: "All cables and mounts included" },
                  { icon: PlayCircle, text: "Clear guidance and support videos" },
                  { icon: PlugZap, text: "Plug & play front cable" },
                  { icon: Cable, text: "Hardwire rear cable for full coverage" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[var(--finevu-orange)] flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-700">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/support">
                <motion.button
                  className="px-6 py-3 rounded-full border border-zinc-300 font-medium hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)] smooth-transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See setup guides
                </motion.button>
              </Link>
            </motion.div>

            {/* Professional */}
            <motion.div
              className="rounded-[2rem] p-10 lg:p-12 border border-[var(--finevu-orange)] bg-white shadow-2xl space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--finevu-orange)]">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-3 tracking-tight">
                  Professional install
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  Our network of 80+ experienced installers comes to your home or office.
                  No messy wiring, maximum reliability — and it unlocks every ADAS feature.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: MapPin, text: "Comes to your home or office" },
                  { icon: CheckCircle, text: "Clean, hidden finish — no messy wiring" },
                  { icon: ShieldCheck, text: "Hardwiring unlocks all ADAS features" },
                  { icon: Users, text: "80+ experienced installers nationwide" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[var(--finevu-orange)] flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-700">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/booking">
                <motion.button
                  className="px-6 py-3 rounded-full bg-[var(--finevu-orange)] text-white font-medium electric-glow hover:opacity-90 smooth-transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Installation
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Install Packages */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Installation packages
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Pick the level of help you want. Prices below are indicative only — your
              installer will confirm the exact quote at booking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {packages.map((pkg, index) => (
              <ServiceCard key={index} {...pkg} delay={index * 0.2} />
            ))}
          </div>

          <p className="text-center text-sm text-zinc-500 mt-12">
            Indicative pricing only. Final cost depends on vehicle and install type.
          </p>
        </div>
      </section>

      {/* Why Hardwire callout */}
      <section className="py-24 brand-gradient text-white overflow-hidden" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-[var(--finevu-orange)] mb-4">
                Why hardwire?
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                Hardwiring unlocks the full FineVu
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                A hardwire install draws power directly from your car, so your FineVu keeps
                working even when the engine's off. It's what enables ADAS alerts and 24/7
                parking mode — and it gives you a tidy, hidden finish with no dangling cables.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Enables ADAS driver-assist alerts",
                  "Powers 24/7 parking mode",
                  "Clean, hidden wiring throughout",
                  "Reliable power without the cigarette socket",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <ShieldCheck className="w-5 h-5 text-[var(--finevu-orange)] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/booking">
                <motion.button
                  className="px-8 py-3 rounded-full bg-[var(--finevu-orange)] text-white font-medium hover:opacity-90 smooth-transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book a hardwire install
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[var(--finevu-orange)]/20 rounded-full blur-[100px] -z-10" />
              <TiltCard>
                {/* Placeholder driving image */}
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Car on a highway (placeholder)"
                  className="w-full max-w-md mx-auto rounded-[2rem] shadow-2xl object-cover"
                />
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Not sure which path is right for you?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Book an installer to come to you, or talk to our team and we'll point you in
              the right direction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/booking">
                <motion.button
                  className="px-8 py-3 rounded-full bg-[var(--finevu-orange)] text-white font-medium electric-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Installation
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-3 rounded-full border border-zinc-300 font-medium hover:border-[var(--finevu-orange)] hover:text-[var(--finevu-orange)] smooth-transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Talk to us
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
