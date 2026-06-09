"use client";

import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { motion } from 'motion/react';
import { Camera, ShieldCheck, Layers, MapPin, MoveRight } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';
import Link from "next/link";

export default function Page() {
  // What FineVu stands for — the focused brand pillars.
  const values = [
    {
      icon: Camera,
      title: "Image quality first",
      description: "Every FineVu camera is built around SONY STARVIS image sensors, so number plates, signage and detail stay sharp in 4K and 2K — day or night."
    },
    {
      icon: ShieldCheck,
      title: "Safety and ADAS",
      description: "More than a recorder. Driver assistance alerts and 24/7 parking protection make FineVu a genuine safety system for your vehicle and the people in it."
    },
    {
      icon: Layers,
      title: "A focused range, no fluff",
      description: "We don't flood the market with confusing models. Two front and rear systems — GX4K and GX35 — each engineered to do its job exceptionally well."
    },
    {
      icon: MapPin,
      title: "Local Australian support",
      description: "Distributed in Australia by Auto Xtreme and backed by a 3-Year Australian Warranty, with a national network of mobile installers behind you."
    }
  ];

  // Stats band — AnimatedCounter where the value is numeric, plain text otherwise.
  const stats = [
    { value: 4, suffix: "M+", label: "Cameras sold worldwide" },
    { value: 3, suffix: "-Year", label: "Australian warranty" },
    { text: "SONY", sub: "STARVIS", label: "Image sensors" },
    { text: "Made in", sub: "Korea", label: "Engineered & manufactured" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />

      {/* Hero — brand gradient design layer (no real product photos) */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden brand-gradient pt-32 md:pt-40 pb-24"
        data-nav-theme="dark"
      >
        {/* Placeholder driving image used only as a subtle texture behind the gradient */}
        <motion.div
          className="absolute inset-0 opacity-25"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Placeholder image — road/driving Unsplash, not a product photo */}
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
            alt="Open road at dusk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 brand-gradient mix-blend-multiply" />
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 w-full">
          <motion.div
            className="space-y-8 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="finevu-capsule font-mono">About FineVu</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              Not just a dash cam.<br />A safety system.
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              FineVu is a global leader in dash cam technology, with more than 4 million cameras
              sold worldwide. Premium 4K and 2K front and rear systems, engineered and manufactured
              in Korea — and supported right here in Australia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/gx4k">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[var(--finevu-orange)] text-white smooth-transition electric-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore the range
                </motion.button>
              </Link>
              <Link href="/where-to-buy">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-white/40 text-white smooth-transition"
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.9)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Where to buy
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand story */}
      <section className="py-32 bg-white" data-nav-theme="light">
        <div className="max-w-4xl mx-auto px-8 lg:px-16">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono text-sm uppercase tracking-wider text-[var(--finevu-orange)]">
              Our story
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              A world-leading brand, built on detail
            </h2>
            <div className="space-y-6 text-lg text-zinc-700 leading-relaxed">
              <p>
                FineVu has spent years doing one thing exceptionally well: building dash cams that
                capture the moments that matter. More than 4 million drivers worldwide trust FineVu
                to protect them on the road — the kind of reliability and performance you expect from
                a world-leading brand.
              </p>
              <p>
                Every camera is engineered and manufactured in Korea, then built around premium
                SONY STARVIS image sensors for clarity that holds up in bright sun, heavy rain and
                low light. The result is footage you can actually rely on when it counts — clear plates,
                clear faces, clear evidence.
              </p>
              <p>
                In Australia, FineVu is distributed by Auto Xtreme. That means global technology
                leadership paired with local support, local stock and a 3-Year Australian Warranty.
                It's a premium product, backed the way a premium product should be.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats band — on the brand gradient */}
      <section className="py-28 brand-gradient-soft" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-6xl font-bold text-white mb-3 leading-none">
                  {typeof stat.value === "number" ? (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  ) : (
                    <span>
                      {stat.text}
                      <span className="text-[var(--finevu-orange)]"> {stat.sub}</span>
                    </span>
                  )}
                </div>
                <p className="text-white/70 font-mono text-xs uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What we stand for — values grid */}
      <section className="py-32 bg-zinc-50" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div
            className="max-w-2xl mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono text-sm uppercase tracking-wider text-[var(--finevu-orange)] mb-4">
              What we stand for
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Four things we never compromise on
            </h2>
            <p className="text-xl text-zinc-600">
              The principles behind every FineVu camera.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="flex gap-6 bg-white rounded-[2rem] p-8 border border-zinc-200"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-[var(--finevu-orange)]/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-8 h-8 text-[var(--finevu-orange)]" />
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{value.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust marks strip */}
      <section className="py-20 bg-white" data-nav-theme="light">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
            {["Made in Korea", "3-Year Australian Warranty", "4 million+ sold worldwide", "SONY STARVIS sensors"].map((mark) => (
              <span
                key={mark}
                className="font-mono text-xs uppercase tracking-wider text-zinc-500"
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — explore the range / where to buy */}
      <section className="py-32 brand-gradient" data-nav-theme="dark">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Ready to see what FineVu captures?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Compare the 4K GX4K and the 2K GX35, or find your nearest stockist.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/gx4k">
                <motion.button
                  className="px-6 py-2.5 rounded-full bg-[var(--finevu-orange)] text-white smooth-transition electric-glow inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore GX4K <MoveRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/gx35">
                <motion.button
                  className="px-6 py-2.5 rounded-full border-2 border-white/40 text-white smooth-transition"
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.9)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore GX35
                </motion.button>
              </Link>
              <Link href="/where-to-buy">
                <motion.button
                  className="px-6 py-2.5 rounded-full text-white/80 underline underline-offset-4 smooth-transition"
                  whileHover={{ scale: 1.05, color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Where to buy
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
