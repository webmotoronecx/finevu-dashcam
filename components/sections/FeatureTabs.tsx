"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Head } from "@/components/sections/Head";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";

// Default page shell width (GX4K). Override per-page via the `shellClass` prop.
const DEFAULT_SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";
const BODY = "text-[15px] md:text-[18px] leading-[1.6] text-[#a6a6a6]";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export type FeatureTab = {
  title: string;
  body?: string;
  /** Custom content rendered in place of the banner media (e.g. a <BarGraph />).
   *  Takes precedence over `video`/`image` for this tab. */
  component?: ReactNode;
  /** Per-tab banner video (public path or remote URL). Takes precedence over `image`. */
  video?: string;
  /** Per-tab banner image; used when the tab has no `video`. */
  image?: string;
  /** Responsive sources for the tab `image` */
  imageSrcSet?: string;
  imageSizes?: string;
  /** Poster frame for the tab `video` (falls back to `image`). */
  poster?: string;
};

/**
 * A banner + inline tab selector; picking a tab swaps the copy beneath it.
 * Self-contained active-tab state. The banner is a placeholder unless
 * `bannerImage` is supplied.
 */
export function FeatureTabs({
  title,
  tabs,
  image,
  imageSrcSet,
  imageSizes,
  video,
  poster,
  bannerAspect = "1297/562",
  tabsPosition = "bottom",
  shellClass = DEFAULT_SHELL,
  contentClass = "",
  sectionClass = "",
}: {
  title?: string;
  tabs: FeatureTab[];
  /** Banner image (public path or remote URL); falls back to a grey placeholder */
  image?: string;
  /** Responsive sources for `image`, e.g. "b.jpg 1x, b@2x.jpg 2x" */
  imageSrcSet?: string;
  /** `sizes` hint, only needed when `imageSrcSet` uses width (w) descriptors */
  imageSizes?: string;
  /** Banner video (public path or remote URL). Takes precedence over the image. */
  video?: string;
  /** Poster frame for the banner video (falls back to `image`). */
  poster?: string;
  /** CSS aspect-ratio for the banner (default matches the Figma frame) */
  bannerAspect?: string;
  /** Tab row placement. "top" puts the tabs above the media (copy stays below it). */
  tabsPosition?: "top" | "bottom";
  shellClass?: string;
  /** Extra classes on the inner content container (tabs + banner + copy). Use to widen or
   *  narrow it independently of the title shell, e.g. "max-w-[720px]". */
  contentClass?: string;
  /** Extra classes on the outer <section> (e.g. background, custom padding). */
  sectionClass?: string;
}) {
  const [active, setActive] = useState(0);

  // Banner reflects the active tab's media, falling back to the section-level props.
  const t = tabs[active];
  const bVideo = t.video || video;
  const bImage = t.image || image;
  const bPoster = t.poster || poster;
  const bSrcSet = t.imageSrcSet || imageSrcSet;
  const bSizes = t.imageSizes || imageSizes;

  const tabsTop = tabsPosition === "top";

  // Banner — active tab's custom component > video > image > blank placeholder (Figma 110:2716).
  // A custom component renders bare (it controls its own sizing), keyed to re-run entrance
  // animations on tab change.
  const banner = t.component ? (
    <motion.div {...fadeUp} key={active} className="w-full">
      {t.component}
    </motion.div>
  ) : bVideo || bImage ? (
      <motion.div
        {...fadeUp}
        className="w-full overflow-hidden rounded-[32px]"
        style={{ aspectRatio: bannerAspect }}
      >
        {bVideo ? (
          <video
            // Remount on tab change so the new source loads and autoplays.
            key={bVideo}
            src={bVideo}
            poster={bPoster || bImage}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={t.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageWithFallback
            src={bImage}
            srcSet={bSrcSet}
            sizes={bSizes}
            alt={t.title}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>
    ) : (
      <motion.div
        {...fadeUp}
        className="w-full rounded-[32px] bg-[#656565]"
        style={{ aspectRatio: bannerAspect }}
      />
    );

  // Tab selector — single inline row; drag/scroll horizontally on mobile.
  // Top layout hugs the title (mb) instead of sitting below the banner (mt).
  const tabRow = (
    <div className={` ` + (tabsTop ? "mb-8" : "mt-8") }>
      <div className="bg-[#202020] rounded-full mx-auto flex w-max max-w-full gap-2  [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`cta-hover flex min-h-[44px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-semibold ${
              active === i ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={active === i ? { backgroundImage: "linear-gradient(90deg, #4f2d74 0%, #6284d8 100%)" } : undefined}
          >
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );

  // Active tab copy — omitted when the tab has no body (e.g. component-only tabs)
  const copy = tabs[active].body ? (
    <motion.p
      key={active}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`mx-auto mt-7 max-w-[660px] text-center ${BODY}`}
    >
      {tabs[active].body}
    </motion.p>
  ) : null;

  return (
    <section data-nav-theme="dark" className={` ${sectionClass}`}>
      <motion.div {...fadeUp} className={`${shellClass} mb-8 text-center md:mb-12`}>
        <Head pre={title} className="!text-[28px] md:!text-[42px]" />
      </motion.div>

      <div className={`${shellClass} ${contentClass}`}>
        {tabsTop ? (
          <>
            {tabRow}
            {banner}
            {copy}
          </>
        ) : (
          <>
            {banner}
            {tabRow}
            {copy}
          </>
        )}
      </div>
    </section>
  );
}
