"use client";

import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

type BrandedNoticeProps = {
  /** Small uppercase label above the title, e.g. "Page not found" */
  eyebrow?: string;
  title: string;
  sub: string;
  cta: { label: string; href: string };
  logo?: boolean;
};

/**
 * Full-viewport branded message on a plain light background, followed by
 * <Footer />. Shared shell for the Coming Soon placeholder and the 404 page.
 * The global <Navigation /> sits above it via the layout; `data-nav-theme="light"`
 * keeps the navbar legible over the white field (per the CLAUDE.md convention).
 *
 * The one accent is the recording indicator above the title — the dash-cam's own
 * vernacular for "still running". Everything else stays quiet.
 */
export function BrandedNotice({ eyebrow, title, sub, cta, logo = true }: BrandedNoticeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-6 pt-54 pb-32 text-center"
        data-nav-theme="light"
      >
        {logo && (
          <motion.div {...fade} transition={{ duration: 0.6 }}>
            <Logo className="mx-auto  h-8" />
          </motion.div>
        )}

        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.03 }}
          className="mb-6 flex items-center gap-2.5"
        >
          {/* <motion.span
            aria-hidden
            className="h-[7px] w-[7px] rounded-full bg-[var(--brand-primary)]"
            animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          /> */}
          {eyebrow && (
            <span className="text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-[var(--muted-foreground)]">
              {eyebrow}
            </span>
          )}
        </motion.div>

        <motion.h1
          className="max-w-[14ch] text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-[var(--foreground)] sm:text-5xl lg:text-[64px]"
          {...fade}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-[42ch] text-[15px] leading-[26px] text-[var(--muted-foreground)] lg:text-base"
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {sub}
        </motion.p>

        <motion.div {...fade} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10">
          <Link
            href={cta.href}
            className="cta-hover inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] bg-transparent px-8 text-[13px] font-medium leading-none text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]"
          >
            {cta.label}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
