"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

/** The 3-stop scrim shared by the `overlay="gradient"` heroes. */
const GRADIENT_OVERLAY =
  "linear-gradient(180deg,rgba(8,8,9,.55) 0%,rgba(8,8,9,.35) 45%,rgba(8,8,9,.62) 100%)";

/**
 * Viewport-filling landing hero: a full-bleed background image, a dark scrim, a centered
 * title/subtitle/CTA column, and an optional bottom-pinned stats band spanning the full
 * width. `data-nav-theme="dark"` keeps the navbar in light-on-dark mode while scrolled
 * over it. Used by `/installation`, `/retailers` and `/become-a-retailer`.
 *
 * One of three hero shapes here, and deliberately not merged with the others:
 * `PageHero` is the compact banner on the content pages (single centered column, a
 * gradient overlay, fixed min-height), and `ScrollHero` is the scroll-pinned video hero
 * on the product pages. This one fills the viewport and has a second layout region (the
 * stats band) the banner has no room for. The type values below are deliberate and
 * differ slightly from `PageHero`'s — don't "normalize" them.
 */
export function FullscreenHero({
  image,
  title,
  subtitle,
  actions,
  stats,
  id,
  overlay = "flat",
  maxWidth = "max-w-[820px]",
  imagePosition,
}: {
  /** Background image path (public path). */
  image: string;
  /** h1 content; pass JSX with `<br />` for line breaks. */
  title: ReactNode;
  /** Optional paragraph below the title. */
  subtitle?: ReactNode;
  /** Optional CTA row below the subtitle (buttons/links). */
  actions?: ReactNode;
  /** Optional stats band pinned to the bottom; 2-up on mobile, 4-up from `sm`. Omit for a plain hero. */
  stats?: { value: string; label: string }[];
  /** Optional section id (e.g. an anchor target). */
  id?: string;
  /** Scrim over the image: a flat wash, or a darker-at-both-edges gradient. */
  overlay?: "flat" | "gradient";
  /** Tailwind max-width class for the inner text column. */
  maxWidth?: string;
  /** CSS `object-position` for the background image (defaults to centred). */
  imagePosition?: string;
}) {
  return (
    <section id={id} className="relative flex w-full aspect-[2160/960] min-h-screen items-center justify-center overflow-hidden text-center text-white" data-nav-theme="dark">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
      />
      <div
        className={`absolute inset-0 ${overlay === "flat" ? "bg-black/40" : ""}`}
        style={overlay === "gradient" ? { background: GRADIENT_OVERLAY } : undefined}
      />
      <div className={`relative z-10 mx-auto ${maxWidth} px-6`}>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[40px] font-semibold leading-[48px] tracking-[-0.8px] md:text-[64px] md:leading-[76px]">{title}</motion.h1>
        {subtitle ? (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="mx-auto mt-[26px] max-w-[774px] text-[16px] leading-[27px] tracking-[-0.44px] text-white md:text-[18px]">{subtitle}</motion.p>
        ) : null}
        {actions ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }} className="mt-9 flex flex-wrap justify-center gap-3.5">
            {actions}
          </motion.div>
        ) : null}
      </div>
      {stats?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="absolute inset-x-0 bottom-0 z-10"
        >
          <div className="mx-auto max-w-[1160px] px-6 pb-8 md:pb-12">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-6 text-left sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.value}>
                  <div className="text-[20px] font-semibold leading-tight text-white md:text-[22px]">{stat.value}</div>
                  <div className="mt-1 text-[13px] leading-snug text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
