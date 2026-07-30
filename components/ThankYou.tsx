"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { ThankYouVariant } from "@/lib/data/thank-you";

// Presentational confirmation card for /thank-you and /thank-you/[type].
// All copy comes from lib/data/thank-you.ts — nothing user-facing is hardcoded here.

export function ThankYou({ variant }: { variant: ThankYouVariant }) {
  const { title, body, next, cta, secondaryCta, footnote } = variant;

  return (
    <section className="min-h-screen bg-[#f5f5f7]" data-nav-theme="light">
      <div className="mx-auto max-w-[720px] px-6 pb-24 pt-36 md:pb-32 md:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[16px] border border-[#e8e8ec] bg-white px-7 py-12 md:px-14 md:py-14"
        >
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#fdf1e6]">
              <Check className="h-7 w-7 text-[var(--finevu-orange)]" strokeWidth={2.5} />
            </div>
            <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111114] md:text-[38px]">
              {title}
            </h1>
            <p className="mx-auto mt-3 max-w-[420px] text-[16px] leading-[1.6] text-[#55555c]">{body}</p>
          </div>

          <hr className="my-9 border-0 border-t border-[#e8e8ec]" />

          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#55555c]">What happens next</h2>
          <ul className="mt-4 space-y-4">
            {next.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--finevu-orange)]" />
                <span className="text-[15px] leading-[1.55] text-[#111114]">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={cta.href}
              className="rounded-full bg-[var(--finevu-orange)] px-8 py-[15px] text-center text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
            >
              {cta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-full border border-[#d9d9df] bg-white px-8 py-[15px] text-center text-[13px] font-bold uppercase tracking-[0.06em] text-[#111114] transition-colors hover:border-[#111114]"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {footnote && (
            <p className="mx-auto mt-7 max-w-[520px] text-center text-[13px] leading-[1.6] text-[#8a8a92]">
              {footnote}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
