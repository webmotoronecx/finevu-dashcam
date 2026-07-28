"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Head } from "@/components/sections/Head";
import { motion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";

// Default page shell width (GX4K). Override per-page via the `shellClass` prop.
const DEFAULT_SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-8";

export type FeatureTabsTheme = "dark" | "light";

// Only the tokens that actually differ between the two product pages.
const THEME: Record<
  FeatureTabsTheme,
  { body: string; rail: string; pillActive: string; pillIdle: string; activePill: string }
> = {
  dark: {
    body: "text-[#a6a6a6]",
    rail: "bg-[#202020]",
    pillActive: "text-white",
    pillIdle: "text-zinc-500 hover:text-zinc-300",
    activePill: "linear-gradient(90deg, #4f2d74 0%, #6284d8 100%)",
  },
  light: {
    body: "text-[#6E6E73]",
    rail: "bg-[#e6e6e6]",
    pillActive: "text-white",
    pillIdle: "text-[#6b6b6b] hover:text-[#1D1D1F]",
    activePill: "linear-gradient(167deg, #ffb682 0%, #f68428 65%, #f68428 100%)",
  },
};

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
  /** When true, `component` floats over the banner media (bottom-center, inside the
   *  frame) instead of replacing it. Requires a `video`/`image` (or falls over the
   *  grey placeholder). */
  componentOverlay?: boolean;
  /** When true, the `component` container renders without the fade/slide-up entrance
   *  animation (applies to both bare-replace and overlay modes). */
  componentStatic?: boolean;
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
  mobileBannerAspect = "4/3",
  tabsPosition = "bottom",
  shellClass = DEFAULT_SHELL,
  contentClass = "",
  sectionClass = "",
  theme = "dark",
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
  /** Taller aspect-ratio used below `md` so the banner isn't a thin strip on phones. */
  mobileBannerAspect?: string;
  /** Tab row placement. "top" puts the tabs above the media (copy stays below it). */
  tabsPosition?: "top" | "bottom";
  shellClass?: string;
  /** Extra classes on the inner content container (tabs + banner + copy). Use to widen or
   *  narrow it independently of the title shell, e.g. "max-w-[720px]". */
  contentClass?: string;
  /** Extra classes on the outer <section> (e.g. background, custom padding). */
  sectionClass?: string;
  theme?: FeatureTabsTheme;
}) {
  const th = THEME[theme];
  const [active, setActive] = useState(0);

  // Banner reflects the active tab's media, falling back to the section-level props.
  const t = tabs[active];
  const bVideo = t.video || video;
  const bImage = t.image || image;
  const bPoster = t.poster || poster;
  const bSrcSet = t.imageSrcSet || imageSrcSet;
  const bSizes = t.imageSizes || imageSizes;

  const tabsTop = tabsPosition === "top";

  // Banner ratio: taller below `md`, wide at `md+`. Fed as CSS vars so the
  // `md:` breakpoint switches aspect-ratio without any JS.
  const bannerRatioVars = {
    "--ba-m": mobileBannerAspect,
    "--ba-d": bannerAspect,
  } as CSSProperties;

  // Overlay mode: `component` floats over the banner media instead of replacing it.
  const overlayMode = t.componentOverlay && t.component;

  // Entrance animation for the component/overlay container — opt out per tab via
  // `componentStatic` (keeps the tab-change remount but drops the fade/slide-up).
  const componentAnim = t.componentStatic ? {} : fadeUp;

  // Overlay element. Below `md` it sits in normal flow *beneath* the banner (the graph
  // would otherwise swallow the media on a phone); at `md+` it floats bottom-center over
  // the frame. Keyed to `active` so it re-runs its entrance animation on tab change
  // (mirrors the bare-component swap).
  const overlayEl = overlayMode ? (
    <motion.div
      {...componentAnim}
      key={active}
      className="relative z-10 mt-4 flex justify-center md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:p-4"
    >
      <div className="pointer-events-auto w-full max-w-full">{t.component}</div>
    </motion.div>
  ) : null;

  // Banner media — video > image > blank placeholder (Figma 110:2716).
  const media = bVideo || bImage ? (
    <motion.div
      {...fadeUp}
      className="relative w-full overflow-hidden rounded-[32px] aspect-[var(--ba-m)] md:aspect-[var(--ba-d)]"
      style={bannerRatioVars}
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
      className="relative w-full rounded-[32px] bg-[#656565] aspect-[var(--ba-m)] md:aspect-[var(--ba-d)]"
      style={bannerRatioVars}
    />
  );

  // Banner — a bare custom component replaces the media entirely (controls its own
  // sizing, keyed to re-run entrance animations on tab change). In overlay mode the
  // media renders normally and `overlayEl` stacks under it / floats over it per
  // breakpoint — the wrapper is the positioning context so the overlay can escape the
  // media box's `overflow-hidden` when it's in flow.
  const banner = t.component && !overlayMode ? (
    <motion.div {...componentAnim} key={active} className="w-full">
      {t.component}
    </motion.div>
  ) : overlayMode ? (
    <div className="relative w-full">
      {media}
      {overlayEl}
    </div>
  ) : (
    media
  );

  // Tab selector — pills wrap onto centered rows below `md`, collapse to a single
  // pill at `md+`. Top layout hugs the title (mb) instead of sitting below the banner (mt).
  const tabRow = (
    <div className={` ` + (tabsTop ? "mb-4 md:mb-8" : "mt-4 md:mt-8") }>
      <div className={`${th.rail} rounded-[26px] md:rounded-full mx-auto flex flex-wrap md:flex-nowrap justify-center w-full md:w-max max-w-full gap-2 p-1.5 md:p-0`}>
        {tabs.map((tb, i) => (
          <button
            key={tb.title}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`cta-hover flex min-h-[44px] grow md:grow-0 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-semibold ${
              active === i ? th.pillActive : th.pillIdle
            }`}
            style={active === i ? { backgroundImage: th.activePill } : undefined}
          >
            {tb.title}
          </button>
        ))}
      </div>
    </div>
  );

  // Active tab copy — omitted when no tab has a body (e.g. component-only tab sets).
  // Every body is stacked in a single grid cell so the block always reserves the height
  // of the *longest* one: swapping tabs cross-fades in place instead of resizing the
  // section and shunting everything below it up or down.
  const copy = tabs.some((tb) => tb.body) ? (
    <div className="mx-auto mt-7 grid max-w-[660px]">
      {tabs.map((tb, i) => (
        <motion.p
          key={tb.title}
          aria-hidden={i !== active}
          initial={false}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className={`col-start-1 row-start-1 text-center text-[15px] md:text-[18px] leading-[1.6] ${th.body} ${
            i === active ? "" : "pointer-events-none"
          }`}
        >
          {tb.body}
        </motion.p>
      ))}
    </div>
  ) : null;

  return (
    <section data-nav-theme={theme} className={` ${sectionClass}`}>
      <motion.div {...fadeUp} className={`${shellClass} mb-8 text-center md:mb-12`}>
        <Head pre={title} theme={theme} className="!text-[28px] md:!text-[42px]" />
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
