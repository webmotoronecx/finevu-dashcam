"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export type MediaSectionData = {
  title: string;
  description: string;
  /** Background image — public path or remote URL. Optional when `video` is set. */
  image?: string;
  /** Responsive sources for `image`, e.g. "bg.jpg 1x, bg@2x.jpg 2x" */
  imageSrcSet?: string;
  /** `sizes` hint, only needed when `imageSrcSet` uses width (w) descriptors */
  imageSizes?: string;
  imageAlt?: string;
  /** Background video — public path or remote URL. Takes precedence over `image`. */
  video?: string;
  /** Poster frame for the video (falls back to `image`). */
  poster?: string;
  /**
   * Banner mode: fixed height Tailwind classes, e.g. "h-[520px] md:h-[720px]".
   * When set, the media is cropped to cover. When omitted, the section uses
   * `aspectRatio` and scales the whole image without cropping.
   */
  heightClass?: string;
  /** CSS aspect-ratio for aspect mode, e.g. "825/451" (default matches the mock) */
  aspectRatio?: string;
  /** Dark top-to-bottom legibility gradient over the media */
  scrim?: boolean;
  /** Drives text colour and the navbar contrast signal */
  theme?: "dark" | "light";
  className?: string;
};

/**
 * Full-bleed background media (image or video) with a centered title +
 * description overlaid near the top. Drop-in on any page.
 *
 * - Aspect mode (default): keeps the media's aspect ratio and scales it with the
 *   viewport (never cropped, except below the min-height floor on small phones).
 * - Banner mode (`heightClass`): fixed height, media cropped to cover — the
 *   full-width divider style.
 */
export function MediaSection({ data }: { data: MediaSectionData }) {
  const {
    title,
    description,
    image,
    imageSrcSet,
    imageSizes,
    imageAlt = "",
    video,
    poster,
    heightClass,
    aspectRatio = "825/451",
    scrim = false,
    theme = "dark",
    className = "",
  } = data;
  const dark = theme === "dark";
  const banner = Boolean(heightClass);
  const titleColor = dark ? "text-white" : "text-[#0b0b0c]";
  const descColor = dark ? (banner ? "text-white/60" : "text-white/80") : "text-[#5c6478]";
  // Guarantee legibility over varied media (same trick the Hero uses for video).
  const shadow = dark ? " [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]" : "";

  return (
    <section
      className={`relative w-full overflow-hidden ${banner ? heightClass : "min-h-[420px]"} ${className}`}
      style={banner ? undefined : { aspectRatio }}
      data-nav-theme={theme}
    >
      {video ? (
        <video
          src={video}
          poster={poster ?? image}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : image ? (
        <ImageWithFallback
          src={image}
          srcSet={imageSrcSet}
          sizes={imageSizes}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // No media supplied — solid panel keeps the divider usable.
        <div className="absolute inset-0 bg-[#26262b]" />
      )}

      {scrim && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,12,0.72) 0%, rgba(8,8,12,0.15) 34%, rgba(8,8,12,0.2) 70%, rgba(8,8,12,0.85) 100%)",
          }}
        />
      )}

      <div
        className={`absolute inset-x-0 flex flex-col items-center px-6 text-center ${
          banner ? "top-[14%]" : "top-[8%]"
        }`}
      >
        <motion.h2
          className={`${titleColor}${shadow} text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[42px]`}
          {...fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
        <motion.p
          className={`${descColor}${shadow} mt-4 max-w-[640px] text-[15px] leading-[1.6] md:text-[18px]`}
          {...fadeUp}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
