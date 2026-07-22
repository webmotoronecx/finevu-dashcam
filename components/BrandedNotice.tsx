"use client";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { motion } from "motion/react";
import Link from "next/link";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

type BrandedNoticeProps = {
  /** Small uppercase label above the title, e.g. "404" */
  eyebrow?: string;
  title: string;
  sub: string;
  cta: { label: string; href: string };
  logo?: boolean;
};

/**
 * Full-viewport branded message on the hero gradient, followed by <Footer />.
 * Shared shell for the Coming Soon placeholder and the 404 page. The global
 * <Navigation /> sits above it via the layout; `data-nav-theme="dark"` keeps
 * the navbar legible over the gradient (per the CLAUDE.md convention).
 */
export function BrandedNotice({ eyebrow, title, sub, cta, logo = true }: BrandedNoticeProps) {
  return (
    <>
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ background: "var(--brand-gradient)" }}
        data-nav-theme="dark"
      >
        {logo && (
          <motion.div {...fade} transition={{ duration: 0.6 }}>
            <Logo variant="white" className="h-9 mb-10 mx-auto" />
          </motion.div>
        )}

        {eyebrow && (
          <motion.p
            className="text-white/70 font-bold text-[15.5px] leading-[17px] tracking-[0.28em] uppercase mb-4"
            {...fade}
            transition={{ duration: 0.6, delay: 0.03 }}
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          className="text-white font-bold uppercase text-5xl sm:text-6xl lg:text-[80px] leading-[1.04] tracking-[-0.01em]"
          {...fade}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-white/85 text-base lg:text-[18px] leading-[30px] max-w-[470px] mt-6"
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {sub}
        </motion.p>

        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10">
          <Link
            href={cta.href}
            className="cta-hover inline-flex items-center justify-center h-12 px-9 rounded-full text-[14px] font-semibold uppercase leading-[20px] border border-white/70 text-white bg-white/5 hover:bg-white/10"
          >
            {cta.label}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
