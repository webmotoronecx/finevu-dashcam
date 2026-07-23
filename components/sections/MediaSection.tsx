"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const enterViewport = { once: true, margin: "-80px" };
const emptySubscribe = () => () => {};

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
   * Scroll-scrub the video instead of autoplaying it: we own `currentTime` and
   * write it from scroll progress, so the clip winds forward as the section
   * passes and rewinds when you scroll back.
   *
   * The source MUST be encoded with a keyframe on every frame or seeking
   * stutters — see the ScrollScrubVideo notes in CLAUDE.md:
   *   ffmpeg -i in.mp4 -an -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
   *     -pix_fmt yuv420p -movflags +faststart out_scrub.mp4
   */
  videoScrub?: boolean;
  /**
   * Scroll range the scrub maps over, as a `useScroll` offset pair.
   * Default ["start end", "end start"] — the clip spans the section's whole
   * travel across the viewport.
   */
  videoScrubOffset?: [string, string];
  /**
   * Where in the scroll range the clip reaches its **last frame**, 0..1
   * (default 1 = the very end). `0.8` finishes the scrub 80% through the
   * section's travel and then holds on the final frame for the last 20%.
   */
  videoScrubEnd?: number;
  /**
   * Scrub easing: how hard `currentTime` chases the scroll target each frame
   * (0..1). Lower = smoother but laggier. Matches ScrollScrubVideo's default.
   */
  videoScrubLerp?: number;
  /**
   * Banner mode: fixed height Tailwind classes, e.g. "h-[520px] md:h-[720px]".
   * When set, the media is cropped to cover. When omitted, the section uses
   * `aspectRatio` and scales the whole image without cropping.
   */
  heightClass?: string;
  /** CSS aspect-ratio for aspect mode, e.g. "825/451" (default matches the mock) */
  aspectRatio?: string;
  /**
   * Extra breathing room above the media, as Tailwind padding classes
   * (e.g. "pt-16 md:pt-0"). Unlike normal padding, this *grows* the section
   * height in aspect mode so a long title on mobile no longer overlaps the
   * image. The media still fills the padded area.
   */
  padTop?: string;
  /** Extra breathing room below the media — see `padTop`. */
  padBottom?: string;
  /**
   * Vertical position of the title/description block, as a Tailwind top-*
   * class (e.g. "top-[8%]", "top-1/4", "top-[120px]"). Overrides the default
   * (`top-[8%]` in aspect mode, `top-[14%]` in banner mode).
   */
  textTop?: string;
  /** Dark top-to-bottom legibility gradient over the media */
  scrim?: boolean;
  /** Full CSS `background` override for the `scrim` layer */
  scrimGradient?: string;
  /**
   * Top legibility gradient behind the title/description. Defaults to on for
   * `theme: "dark"`, off for light. Set explicitly to force either way.
   */
  topScrim?: boolean;
  /** Peak opacity of the default top gradient (ignored if `topScrimGradient` is set) */
  topScrimOpacity?: number;
  /** Height of the top gradient as a Tailwind class, e.g. "h-1/3" */
  topScrimHeight?: string;
  /** Full CSS `background` override for the top gradient */
  topScrimGradient?: string;
  /** Seconds before the title starts animating in (ignored when `textScrub`) */
  textDelay?: number;
  /** Seconds the title/description animation runs (ignored when `textScrub`) */
  textDuration?: number;
  /** Extra delay on the description, on top of `textDelay` */
  textStagger?: number;
  /**
   * Scroll-scrub the text instead of playing it once on enter: opacity/offset
   * are driven directly by scroll progress, so it reverses when scrolling back.
   */
  textScrub?: boolean;
  /**
   * Scroll range the scrub maps over, as a `useScroll` offset pair.
   * Default ["start end", "center center"] — fully in by the time the section
   * is centered.
   */
  textScrubOffset?: [string, string];
  /** Distance in px the text travels up as it animates in */
  textOffsetY?: number;
  /**
   * Fade the whole section up from black as it scrolls in, and back to black
   * as it scrolls out. Reverses with the scroll direction.
   */
  fade?: boolean;
  /**
   * How much of the section's scroll travel the fade occupies at each end,
   * 0–0.5 (0.25 = fully visible for the middle half).
   */
  fadeRange?: number;
  /** Colour the section fades to/from (default black) */
  fadeColor?: string;
  /**
   * Share of the scroll travel held at *full* colour (opacity 1) at each end
   * before the fade starts — so the section arrives as a solid block of
   * `fadeColor` and only then reveals. 0 = start fading immediately.
   */
  fadeHold?: number;
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
    videoScrub = false,
    videoScrubOffset = ["start end", "end start"],
    videoScrubEnd = 1,
    videoScrubLerp = 0.15,
    heightClass,
    aspectRatio = "825/451",
    padTop = "",
    padBottom = "",
    textTop,
    scrim = false,
    scrimGradient = "linear-gradient(180deg, rgba(8,8,12,0.72) 0%, rgba(8,8,12,0.15) 34%, rgba(8,8,12,0.2) 70%, rgba(8,8,12,0.85) 100%)",
    topScrim,
    topScrimOpacity = 0.7,
    topScrimHeight = "h-1/2",
    topScrimGradient,
    textDelay = 0,
    textDuration = 0.6,
    textStagger = 0.08,
    textScrub = false,
    textScrubOffset = ["start end", "center center"],
    textOffsetY = 24,
    fade = false,
    fadeRange = 0.25,
    fadeColor = "#000",
    fadeHold = 0.15,
    theme = "dark",
    className = "",
  } = data;
  // When padding is present in aspect mode we switch to `box-content` so the
  // padding adds to the section's height instead of eating into the locked
  // aspect-ratio box (which is what makes the extra space actually appear).
  const pad = `${padTop} ${padBottom}`.trim();
  const boxClass = pad && !heightClass ? "box-content" : "";
  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduce = mounted && prefersReduced;
  const dark = theme === "dark";
  const banner = Boolean(heightClass);
  const titleColor = dark ? "text-white" : "text-[#0b0b0c]";
  const descColor = dark ? (banner ? "text-white/60" : "text-white/80") : "text-[#5c6478]";
  // Guarantee legibility over varied media (same trick the Hero uses for video).
  const shadow = dark ? " [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]" : "";
  const showTopScrim = topScrim ?? dark;

  // Scrub mode: text opacity/offset are tied to scroll position over the
  // section. The description trails the title by `textStagger` worth of
  // progress so the two still feel staggered.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: textScrubOffset as never,
  });
  const lag = Math.min(Math.max(textStagger, 0), 0.5);
  const titleOpacity = useTransform(scrollYProgress, [0, 1 - lag], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1 - lag], [textOffsetY, 0]);
  const descOpacity = useTransform(scrollYProgress, [lag, 1], [0, 1]);
  const descY = useTransform(scrollYProgress, [lag, 1], [textOffsetY, 0]);

  // Fade mode: a solid overlay driven by the section's full scroll travel —
  // opaque as it enters, clear through the middle, opaque again as it leaves.
  const { scrollYProgress: fadeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"] as never,
  });
  // `hold` keeps the overlay fully opaque at each end, then `edge` is the
  // travel the fade itself takes. Both are clamped so the two ends can't
  // overlap (which would break the monotonic input range).
  const hold = Math.min(Math.max(fadeHold, 0), 0.45);
  const edge = Math.min(Math.max(fadeRange, 0.01), 0.5 - hold);
  const fadeOpacity = useTransform(
    fadeProgress,
    [0, hold, hold + edge, 1 - hold - edge, 1 - hold, 1],
    [1, 1, 0, 0, 1, 1],
  );

  // Video scrub: scroll progress drives `currentTime`. We never write it from the
  // scroll event directly — a rAF loop lerps toward the target so seeks stay smooth
  // and we don't queue them faster than the decoder drains. Mirrors ScrollScrubVideo.
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(0);
  const { scrollYProgress: videoProgress } = useScroll({
    target: sectionRef,
    offset: videoScrubOffset as never,
  });

  // Scroll progress → clip time. `videoScrubEnd` compresses the whole clip into
  // the leading part of the range; past it the target stays on the last frame.
  const scrubTime = useCallback(
    (p: number) => {
      const span = Math.min(Math.max(videoScrubEnd, 0.05), 1);
      return Math.min(p / span, 1) * (durationRef.current || 0);
    },
    [videoScrubEnd],
  );

  useMotionValueEvent(videoProgress, "change", (p) => {
    if (videoScrub) targetTimeRef.current = scrubTime(p);
  });

  useEffect(() => {
    if (!videoScrub || reduce) return;
    const v = videoRef.current;
    if (!v) return;

    v.pause(); // we own currentTime; never let it play on its own
    const onMeta = () => {
      durationRef.current = v.duration || 0;
      targetTimeRef.current = scrubTime(videoProgress.get());
    };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) onMeta();

    let cur = targetTimeRef.current;
    let raf = 0;
    const tick = () => {
      const target = targetTimeRef.current;
      cur += (target - cur) * videoScrubLerp;
      if (Math.abs(target - cur) < 0.001) cur = target;
      // Skip while a seek is still resolving; muted + playsInline lets us seek
      // without a user gesture on iOS.
      if (durationRef.current > 0 && !v.seeking && Math.abs(v.currentTime - cur) > 0.01) {
        try {
          v.currentTime = cur;
        } catch {
          /* seek can throw before the media is seekable — next frame retries */
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [videoScrub, reduce, videoProgress, videoScrubLerp, scrubTime]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: textOffsetY },
    whileInView: { opacity: 1, y: 0 },
    viewport: enterViewport,
    transition: { duration: textDuration, ease: "easeOut" as const, delay },
  });
  const titleAnim = textScrub
    ? { style: { opacity: titleOpacity, y: titleY } }
    : enter(textDelay);
  const descAnim = textScrub
    ? { style: { opacity: descOpacity, y: descY } }
    : enter(textDelay + textStagger);
  const topScrimBackground =
    topScrimGradient ??
    `linear-gradient(180deg, rgba(0,0,0,${topScrimOpacity}) 0%, rgba(0,0,0,0) 100%)`;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${banner ? heightClass : "min-h-[420px]"} ${boxClass} ${pad} ${className}`}
      style={banner ? undefined : { aspectRatio }}
      data-nav-theme={theme}
    >
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster ?? image}
          // Scrub mode owns playback: paused, seeked from scroll. Reduced motion
          // falls back to a still first frame rather than either behaviour.
          autoPlay={!videoScrub && !reduce}
          loop={!videoScrub && !reduce}
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
          style={{ background: scrimGradient }}
        />
      )}

      {/* Top legibility gradient behind the title/description (dark theme). */}
      {showTopScrim && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 ${topScrimHeight}`}
          style={{ background: topScrimBackground }}
        />
      )}

      <div
        className={`absolute inset-x-0 flex flex-col items-center px-6 text-center ${
          textTop ?? (banner ? "top-[14%]" : "top-[8%]")
        }`}
      >
        <motion.h2
          className={`${titleColor}${shadow} text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[42px]`}
          {...titleAnim}
        >
          {title}
        </motion.h2>
        <motion.p
          className={`${descColor}${shadow} mt-4 max-w-[640px] text-[15px] leading-[1.6] md:text-[18px]`}
          {...descAnim}
        >
          {description}
        </motion.p>
      </div>

      {/* Fade-to-black transition, above the media *and* the text. */}
      {fade && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: fadeColor, opacity: fadeOpacity }}
        />
      )}
    </section>
  );
}
