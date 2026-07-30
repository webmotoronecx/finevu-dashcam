"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-bleed page hero: a `fill` background image, a dark top-to-bottom gradient
 * overlay, and a centered title with an optional subtitle. Canonical version is
 * the About page hero. `data-nav-theme="dark"` keeps the navbar in light-on-dark
 * mode while scrolled over it.
 *
 * Pass `background` instead of `image` for an image-less hero (e.g. the FAQ page's
 * brand gradient); the dark overlay is skipped in that case.
 */
export function PageHero({
  image,
  background,
  title,
  subtitle,
  actions,
  id,
  maxWidth = "max-w-[940px]",
  imagePosition,
}: {
  /** Background image path (public path). Omit when using `background`. */
  image?: string;
  /** CSS `background` shorthand for an image-less hero. Ignored when `image` is set. */
  background?: string;
  /** h1 content; pass JSX with `<br />` for line breaks. */
  title: ReactNode;
  /** Optional paragraph below the title. */
  subtitle?: ReactNode;
  /** Optional CTA row below the subtitle (buttons/links). */
  actions?: ReactNode;
  /** Optional section id (e.g. an anchor target). */
  id?: string;
  /** Tailwind max-width class for the inner container. */
  maxWidth?: string;
  /** CSS `object-position` for the background image (defaults to centred). */
  imagePosition?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden text-white"
      data-nav-theme="dark"
      style={!image && background ? { background } : undefined}
    >
      {image ? (
        <>
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
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(8,8,9,.5) 0%,rgba(8,8,9,.3) 45%,rgba(8,8,9,.55) 100%)",
            }}
          />
        </>
      ) : null}
      <div className={`relative z-10 mx-auto ${maxWidth} px-6  text-center pt-[100px] min-h-[480px] py-24 md:min-h-[640px] flex items-center justify-center`}>
        <div className="flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-[40px] font-semibold leading-[48px] tracking-[-0.5px] md:text-[64px] md:leading-[77px]"
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-6 max-w-[736px] text-[16px] leading-[1.55] tracking-[-0.44px] text-white/[0.88] md:text-[18px]"
          >
            {subtitle}
          </motion.p>
        ) : null}
        {actions ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-9 flex flex-wrap justify-center gap-3.5"
          >
            {actions}
          </motion.div>
        ) : null}
        </div>
      </div>
    </section>
  );
}
