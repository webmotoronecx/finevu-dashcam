"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { BrandMarquee } from "./BrandMarquee";
import { siteConfig } from "@/config/site.config";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const { hero, primaryCta, secondaryCta } = siteConfig;

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
      data-nav-theme={hero.theme}
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(circle at center, var(--brand-primary) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-8 lg:px-16 text-center pt-28 md:pt-20 pb-32">
        <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            {hero.sub}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 md:pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          >
            <Link href={primaryCta.href} className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--brand-primary)] text-white font-medium smooth-transition hover:shadow-[0_0_30px_var(--electric-glow)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {primaryCta.label}
              </motion.button>
            </Link>
            <Link href={secondaryCta.href} className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
              >
                {secondaryCta.label}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Brand marquee at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BrandMarquee />
      </div>
    </section>
  );
}
