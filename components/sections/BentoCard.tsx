"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Themed bento-grid tile shared by the gx4k (dark) and gx35 (light) feature grids.
 *
 * Two variants:
 *   - "image"       — full-bleed media (a `video`, else a photo, else a themed grey
 *                     placeholder) with a white title top and caption bottom. Overlay
 *                     text is white in both themes since it sits over a darkened image.
 *   - "displayText" — no media; a large left-aligned title with a body paragraph,
 *                     vertically centred on a plain panel (Figma "Storage" tile).
 *
 * A `video` plays muted/looped and is gated to the viewport (played while on-screen,
 * paused off-screen) so off-screen tiles don't decode — same approach as Carousel.tsx.
 * `img` doubles as the video poster. Theme is explicit (`theme="dark" | "light"`), not
 * inferred from `data-nav-theme`. `tile-hover`/`tile-hover-purple` are global classes.
 */

export type BentoCardTheme = "dark" | "light";
export type BentoCardVariant = "image" | "displayText" | "overlayLabel";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

// Only the tokens that actually differ between the two pages live here.
const THEME: Record<
  BentoCardTheme,
  {
    hover: string;
    border: string;
    radius: string;
    placeholder: string;
    scrim: string;
    /** "reasons"-grid tile: rounder, bottom-only scrim under a centered white label. */
    labelRadius: string;
    labelBorder: string;
    labelScrim: string;
    panel: string;
    panelTitle: string;
    panelCaption: string;
  }
> = {
  dark: {
    hover: "tile-hover-purple",
    border: "border-white/[0.06]",
    radius: "rounded-[22px]",
    placeholder: "bg-[#26262b]",
    scrim: "from-black/55 via-transparent to-black/70",
    labelRadius: "rounded-[32px]",
    labelBorder: "",
    labelScrim: "from-black/70 via-black/20 to-transparent",
    panel: "bg-[#0d0d0d]",
    panelTitle: "text-white",
    panelCaption: "text-white/55",
  },
  light: {
    hover: "tile-hover",
    border: "border-[#ececf0]",
    radius: "rounded-[24px]",
    placeholder: "bg-[#656565]",
    scrim: "from-black/45 via-transparent to-black/55",
    labelRadius: "rounded-[32px]",
    labelBorder: "border border-[#ececf0]",
    labelScrim: "from-black/45 via-black/10 to-transparent",
    panel: "bg-white",
    panelTitle: "text-[#1d1d1f]",
    panelCaption: "text-[#6E6E73]",
  },
};

export function BentoCard({
  theme = "dark",
  variant = "image",
  title,
  caption,
  img,
  video,
  sup,
  imgClass = "",
  className = "",
}: {
  theme?: BentoCardTheme;
  variant?: BentoCardVariant;
  title?: string;
  caption?: string;
  img?: string;
  /** `overlayLabel` only — footnote marker rendered as `[n]` after the label. */
  sup?: string;
  /** `overlayLabel` only — extra classes on the media element (e.g. "object-top"). */
  imgClass?: string;
  /** Banner video (public path or remote URL). Takes precedence over `img`; `img` is
   *  used as its poster. Plays muted/looped only while the tile is on-screen. */
  video?: string;
  className?: string;
}) {
  const t = THEME[theme];

  // Play the video only while the tile is in view; pause it off-screen so it doesn't
  // decode/playback needlessly (mirrors Carousel.tsx's IntersectionObserver).
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [video]);

  if (variant === "displayText") {
    return (
      <motion.div
        {...fadeUp}
        className={`relative flex flex-col justify-center overflow-hidden ${t.radius} px-8 py-10 md:px-12 ${className}`}
      >
        <h3 className={`text-[26px] md:text-[38px] font-semibold leading-[1.08] ${t.panelTitle}`}>
          {title}
        </h3>
        {caption && (
          <p className={`mt-5 max-w-[420px] text-[15px] md:text-[18px] leading-[1.55] ${t.panelCaption}`}>
            {caption}
          </p>
        )}
      </motion.div>
    );
  }

  // "More reasons to choose FineVu" tile: full-bleed media, bottom-only scrim, and a
  // single centered white label (optionally footnoted). Shared by both product pages.
  if (variant === "overlayLabel") {
    return (
      <motion.div
        {...fadeUp}
        className={`tile-hover relative overflow-hidden ${t.labelRadius} ${t.labelBorder} ${className}`}
      >
        {video || img ? (
          <>
            {video ? (
              <video
                ref={videoRef}
                src={video}
                poster={img}
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={title}
                className={`absolute inset-0 h-full w-full object-cover ${imgClass}`}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={title} className={`absolute inset-0 h-full w-full object-cover ${imgClass}`} />
            )}
            <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t ${t.labelScrim}`} />
          </>
        ) : (
          <div className={`absolute inset-0 ${t.placeholder}`} />
        )}
        <p className="absolute inset-x-0 bottom-6 px-4 text-center text-[16px] md:text-[22px] font-semibold text-white">
          {title}
          {sup && <sup className="ml-0.5 align-super text-[11px] font-medium md:text-[13px]">[{sup}]</sup>}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...fadeUp}
      className={`${t.hover} relative overflow-hidden border ${t.border} ${t.radius} ${className}`}
    >
      {video || img ? (
        <>
          {video ? (
            <video
              ref={videoRef}
              src={video}
              poster={img}
              loop
              muted
              playsInline
              preload="metadata"
              aria-label={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className={`absolute inset-0 bg-gradient-to-b ${t.scrim}`} />
        </>
      ) : (
        <div className={`absolute inset-0 ${t.placeholder}`} />
      )}
      <p className="absolute inset-x-0 top-5 px-4 text-center text-[15px] md:text-[18px] font-semibold text-white">
        {title}
      </p>
      <p className="absolute inset-x-0 bottom-5 px-4 text-center text-[13px] md:text-[15px] text-white/70">
        {caption}
      </p>
    </motion.div>
  );
}
