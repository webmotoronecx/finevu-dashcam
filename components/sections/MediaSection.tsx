"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";

const enterViewport = { once: true, margin: "-80px" };
const replayViewport = { once: false, margin: "-80px" };
const emptySubscribe = () => () => {};

/**
 * Scrub stops are authored as percentages ("20%", 20) or 0..1 fractions (0.2)
 * — whichever reads better at the call site. A bare number above 1 can only
 * have been meant as a percentage, since 1 is the whole range.
 */
function toFraction(value: number | string, fallback: number) {
  const raw = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(raw)) return fallback;
  const percent = typeof value === "string" ? value.trim().endsWith("%") : raw > 1;
  return Math.min(Math.max(percent ? raw / 100 : raw, 0), 1);
}

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
  /**
   * Drift the image against the scroll so it moves slower than the page — the
   * classic parallax. The image is over-scaled taller than the section and slid
   * within it, so there's never a gap at either edge.
   *
   * `true` uses 15; a number is the strength as a percentage of the section
   * height (10 = subtle, 30 = pronounced). Images only — `video` ignores it.
   * Skipped under reduced motion.
   *
   * Note this is an over-scale + crop on top of the existing `object-cover`,
   * so it always trims some of the image — it makes a tall source *move*, it
   * doesn't reveal more of it.
   */
  imageParallax?: boolean | number;
  /**
   * Extra Tailwind classes on the media element itself (the `<video>` or
   * `<img>`), appended after the defaults so they win — e.g.
   * "object-[45%_50%]" to shift the crop, "object-contain", "scale-110",
   * "opacity-70", or a responsive pair like "object-right md:object-center".
   *
   * This is the media only; `className` styles the section around it.
   */
  mediaClass?: string;
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
   * Play the clip through **once** each time the section scrolls into view
   * instead of looping: it rewinds and plays on entry, and is paused/reset when
   * the section leaves. Ignored under `videoScrub` (that mode owns playback).
   */
  videoPlayOnce?: boolean;
  /**
   * Scroll range the scrub maps over, as a `useScroll` offset pair.
   * Default ["start end", "end start"] — the clip spans the section's whole
   * travel across the viewport.
   */
  videoScrubOffset?: [string, string];
  /**
   * Where in the scroll range the clip leaves its **first frame** and starts
   * winding (default 0 = immediately). `"20%"` holds the opening frame for the
   * first fifth of the section's travel, then begins the scrub.
   *
   * Accepts a percentage (`"20%"` or `20`) or a 0..1 fraction (`0.2`) —
   * anything above 1 is read as a percentage. Same for `videoScrubEnd`.
   */
  videoScrubStart?: number | string;
  /**
   * Where in the scroll range the clip reaches its **last frame**
   * (default 1 = the very end). `"80%"` finishes the scrub 80% through the
   * section's travel and then holds on the final frame for the last fifth.
   */
  videoScrubEnd?: number | string;
  /**
   * Scrub easing: how hard `currentTime` chases the scroll target each frame
   * (0..1). Lower = smoother but laggier. Matches ScrollScrubVideo's default.
   */
  videoScrubLerp?: number;
  /**
   * Pin the section: it sticks to the top of the viewport while the page keeps
   * scrolling past it, so a scrub runs (or a clip plays) without the media
   * moving. Implemented the only way sticky can work — the section becomes a
   * tall scroll track (`pinHeightVh`) wrapping a viewport-height sticky child,
   * so **the section is much taller than one screen** and pushes the rest of
   * the page down by that much.
   *
   * With `videoScrub` the pin length *is* the scrub length: the clip runs
   * exactly while the section is pinned, so `pinHeightVh` is the dial for how
   * much scrolling the video takes.
   */
  pin?: boolean;
  /**
   * How long the pin lasts, as a multiple of viewport height (default 200 =
   * two screens of scrolling held in place). Higher = slower scrub, more
   * scrolling before the page moves on. Only used when `pin` is set.
   */
  pinHeightVh?: number;
  /**
   * Size the section to the viewport: its height is `heightVh` percent of the
   * screen (100 = exactly one screenful), media cropped to cover. The section
   * scrolls past normally — nothing sticks. Use `pin` for the sticky version.
   *
   * Values above 100 make the section taller than the screen, which is what
   * you want to give `imageParallax` or `textScrub` more travel to work with.
   * Ignored when `pin` is set (the pin owns the height then). Takes precedence
   * over `aspectRatio`; `heightClass` still wins over both.
   */
  heightVh?: number;
  /**
   * `heightVh` override below 768px. A phone viewport is tall and narrow, so a
   * landscape image cropped to cover a full-height section shows only a thin
   * centre slice — usually you want less height there, not the same.
   *
   * A number is the mobile height in vh. `false` drops the fixed height on
   * phones entirely and falls back to `aspectRatio`, so the whole image shows
   * uncropped. Defaults to `heightVh` (same height everywhere).
   *
   * Also works **without** `heightVh` — then the section keeps its
   * `aspectRatio` on desktop and only takes a fixed height on phones.
   */
  heightVhMobile?: number | false;
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
   * Vertical placement of the title/description block. Horizontal centering is
   * fixed — this only controls how far down the media the text sits.
   *
   * Either a keyword — "top" (default), "middle", "bottom" — or any CSS length
   * for an exact offset: "10%", "120px", "6rem", "clamp(24px,8vw,140px)".
   * The offset is measured from the top edge unless `textAnchor` says otherwise.
   */
  textPosition?: "top" | "middle" | "bottom" | (string & {});
  /**
   * Which edge an exact `textPosition` offset is measured from (default "top").
   * Use "bottom" to pin the block a fixed distance up from the bottom, so it
   * stays put as the section's height changes. Ignored for the keywords.
   */
  textAnchor?: "top" | "bottom";
  /**
   * @deprecated Use `textPosition` instead. Vertical position as a Tailwind
   * top-* class (e.g. "top-[10%]"); still honoured, and wins over
   * `textPosition` when set.
   */
  textTop?: string;
  /**
   * Any CSS `background` for the section, painted **behind** the media — a
   * colour, a gradient, whatever: "#0b0b0c", "var(--brand-gradient)",
   * "radial-gradient(ellipse at 50% 40%, #0f1424 0%, #08080c 70%)".
   *
   * Mostly for media that doesn't fill its box: an `object-contain` video or a
   * transparent PNG shows this in the letterbox area instead of the page
   * background. `scrim` paints *over* the media; this paints under it.
   */
  background?: string;
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
  /** Distance in px the text travels as it animates in */
  textOffsetY?: number;
  /**
   * Which edge the title/description animate in from (default "bottom" —
   * they start below and rise into place). "top" starts them above and drops
   * them down. Applies to both the play-once and `textScrub` modes.
   */
  textFrom?: "bottom" | "top";
  /**
   * Replay the title/description entrance every time the section scrolls into
   * view, instead of playing it once and leaving it. Ignored under `textScrub`
   * (that mode already reverses with scroll by definition).
   */
  textReplay?: boolean;
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
    imageParallax = false,
    mediaClass = "",
    background,
    video,
    poster,
    videoScrub = false,
    videoPlayOnce = false,
    videoScrubOffset,
    videoScrubStart = 0,
    videoScrubEnd = 1,
    videoScrubLerp = 0.15,
    pin = false,
    pinHeightVh = 200,
    heightVh,
    heightVhMobile,
    heightClass,
    aspectRatio = "825/451",
    padTop = "",
    padBottom = "",
    textPosition = "top",
    textAnchor = "top",
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
    textFrom = "bottom",
    textReplay = false,
    fade = false,
    fadeRange = 0.25,
    fadeColor = "#000",
    fadeHold = 0.15,
    theme = "dark",
    className = "",
  } = data;
  // Viewport-height mode. `dvh` rather than `vh` so mobile browser chrome
  // collapsing doesn't leave a gap. The pin owns the height when it's on.
  const vh = !pin && typeof heightVh === "number" && heightVh > 0 ? heightVh : undefined;
  // `heightVhMobile` on its own: aspect mode on desktop, fixed height on phones.
  const mobileVhOnly =
    vh === undefined && !pin && !heightClass && typeof heightVhMobile === "number" && heightVhMobile > 0;
  // Both fixed-height modes crop to cover and share the banner text insets;
  // only aspect mode letterboxes the media to `aspectRatio`.
  const banner = Boolean(heightClass) || vh !== undefined;
  // When padding is present in aspect mode we switch to `box-content` so the
  // padding adds to the section's height instead of eating into the locked
  // aspect-ratio box (which is what makes the extra space actually appear).
  const pad = `${padTop} ${padBottom}`.trim();
  const boxClass = pad && !banner ? "box-content" : "";
  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduce = mounted && prefersReduced;
  const dark = theme === "dark";
  const titleColor = dark ? "text-white" : "text-[#0b0b0c]";
  const descColor = dark ? (banner ? "text-white/60" : "text-white/80") : "text-[#5c6478]";
  // Guarantee legibility over varied media (same trick the Hero uses for video).
  const shadow = dark ? " [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]" : "";
  const showTopScrim = topScrim ?? dark;
  // Vertical placement of the text block. The keywords resolve to classes —
  // written out in full, since Tailwind only sees class names that appear
  // literally — while any other value is an exact offset applied inline.
  // Top/bottom sit the same distance in from their edge (banner mode is
  // cropped, so it needs a bigger inset).
  const keyword = textPosition === "top" || textPosition === "middle" || textPosition === "bottom";
  const placement = !keyword
    ? ""
    : textPosition === "middle"
      ? "top-1/2 -translate-y-1/2"
      : textPosition === "bottom"
        ? banner
          ? "bottom-[14%]"
          : "bottom-[8%]"
        : banner
          ? "top-[14%]"
          : "top-[8%]";
  // Exact offsets bypass Tailwind entirely: any CSS length works, from either edge.
  const placementStyle =
    keyword || textTop
      ? undefined
      : textAnchor === "bottom"
        ? { bottom: textPosition }
        : { top: textPosition };
  // Signed travel: positive starts below and rises, negative starts above and drops.
  const fromY = textFrom === "top" ? -textOffsetY : textOffsetY;

  // Scrub mode: text opacity/offset are tied to scroll position over the
  // section. The description trails the title by `textStagger` worth of
  // progress so the two still feel staggered.
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: textScrubOffset as never,
  });
  const lag = Math.min(Math.max(textStagger, 0), 0.5);
  const titleOpacity = useTransform(scrollYProgress, [0, 1 - lag], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1 - lag], [fromY, 0]);
  const descOpacity = useTransform(scrollYProgress, [lag, 1], [0, 1]);
  const descY = useTransform(scrollYProgress, [lag, 1], [fromY, 0]);

  // Fade mode: a solid overlay driven by the section's full scroll travel —
  // opaque as it enters, clear through the middle, opaque again as it leaves.
  const { scrollYProgress: fadeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"] as never,
  });
  // Parallax: the image is over-scaled by `2 × drift` and slid by `drift` in
  // each direction over the same full travel, so the over-scale always outruns
  // the movement and no edge is ever exposed. The shift is expressed as a % of
  // the *image's* height (which is why the range is halved rather than `drift`)
  // — no measuring, and it survives resizes for free.
  const drift = imageParallax === true ? 15 : Number(imageParallax) || 0;
  const parallax = drift > 0 && !reduce && !video && Boolean(image);
  const imageY = useTransform(fadeProgress, [0, 1], [`-${drift / 2}%`, `${drift / 2}%`]);

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
  // Pinned sections scrub across the pin itself: progress 0 the moment the
  // sticky child locks to the top, 1 when the track runs out and it releases.
  // Unpinned, the clip spans the section's whole travel across the viewport.
  const scrubOffset =
    videoScrubOffset ?? (pin ? ["start start", "end end"] : ["start end", "end start"]);
  const { scrollYProgress: videoProgress } = useScroll({
    target: sectionRef,
    offset: scrubOffset as never,
  });

  // Scroll progress → clip time. The clip is squeezed into the
  // `videoScrubStart`..`videoScrubEnd` slice of the range: before the start it
  // holds frame one, after the end it holds the last frame. `from` is kept a
  // hair below `to` so the two can never cross and divide by zero.
  const from = toFraction(videoScrubStart, 0);
  const to = Math.max(toFraction(videoScrubEnd, 1), from + 0.05);
  const scrubTime = useCallback(
    (p: number) => {
      const progress = (p - from) / (to - from);
      return Math.min(Math.max(progress, 0), 1) * (durationRef.current || 0);
    },
    [from, to],
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

  // Play-once mode: rewind + play on every entry, pause + reset on exit, so the
  // clip runs start-to-finish each time the section scrolls in and never loops.
  const playOnce = videoPlayOnce && !videoScrub && !reduce;
  // Watch the frame, not the section: a pinned section's track is several
  // screens tall and enters view long before the media is actually on screen.
  const inView = useInView(pin ? frameRef : sectionRef, { margin: "-80px" });

  useEffect(() => {
    if (!playOnce) return;
    const v = videoRef.current;
    if (!v) return;

    if (inView) {
      v.currentTime = 0;
      // Autoplay can still be rejected (muted + playsInline usually satisfies it).
      void v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [playOnce, inView]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: fromY },
    whileInView: { opacity: 1, y: 0 },
    // `once: false` lets the animation reset when the section leaves the
    // viewport, so it replays on every entry instead of playing a single time.
    viewport: textReplay ? replayViewport : enterViewport,
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

  // Pin mode splits the section in two: the <section> becomes a tall scroll
  // track and a viewport-height sticky child holds the media. Unpinned, the
  // section itself is that frame — unchanged for every existing caller.
  // heightClass (a class) wins over heightVh, which wins over aspect mode.
  const useVh = vh !== undefined && !heightClass;
  // The height itself lives in `.media-vh` (globals.css) so a media query can
  // swap it on phones; we only hand it the values.
  // `min-h` is a floor, not the height: every child is absolutely positioned, so
  // if `.media-vh` ever fails to load the frame would otherwise collapse to 0.
  const vhClass = useVh
    ? `media-vh min-h-[420px]${heightVhMobile === false ? " media-vh-aspect" : ""}`
    : mobileVhOnly
      ? "media-vh-mobile"
      : "";
  const frameClass = pin
    ? `sticky top-0 w-full overflow-hidden ${heightClass ?? "h-[100dvh]"}`
    : `relative w-full overflow-hidden ${banner ? (heightClass ?? "") : "min-h-[420px]"} ${vhClass} ${boxClass} ${pad} ${className}`;
  const frameStyle = pin
    ? undefined
    : useVh
      ? ({
          "--ms-h": `${vh}dvh`,
          ...(typeof heightVhMobile === "number" ? { "--ms-h-mobile": `${heightVhMobile}dvh` } : {}),
          // Only read when `heightVhMobile` is false — the phone aspect fallback.
          ...(heightVhMobile === false ? { "--ms-aspect": aspectRatio } : {}),
        } as CSSProperties)
      : banner
        ? undefined
        : mobileVhOnly
          ? ({ aspectRatio, "--ms-h-mobile": `${heightVhMobile}dvh` } as CSSProperties)
          : { aspectRatio };

  const body = (
    <>
      {/* Under everything, so letterboxed or transparent media sits on it. */}
      {background && <div aria-hidden="true" className="absolute inset-0" style={{ background }} />}

      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster ?? image}
          // Scrub mode owns playback: paused, seeked from scroll. Play-once mode
          // is driven by the in-view effect below. Reduced motion falls back to
          // a still first frame rather than any of those behaviours.
          autoPlay={!videoScrub && !playOnce && !reduce}
          loop={!videoScrub && !playOnce && !reduce}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
         // className={`absolute inset-0 h-full w-full object-contain scale-200 translate-y-50   md:object-cover md:scale-100 ${mediaClass}`}

          className={`absolute inset-0 h-full w-full object-cover ${mediaClass}`}
        />
      ) : image && parallax ? (
        // Taller than the section and inset by the overhang, so the drift below
        // slides within the section instead of pulling an edge into view.
        <motion.div
          className="absolute inset-x-0 overflow-hidden"
          style={{ top: `-${drift}%`, height: `${100 + drift * 2}%`, y: imageY }}
        >
          <ImageWithFallback
            src={image}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            alt={imageAlt}
            className={`h-full w-full object-cover ${mediaClass}`}
          />
        </motion.div>
      ) : image ? (
        <ImageWithFallback
          src={image}
          srcSet={imageSrcSet}
          sizes={imageSizes}
          alt={imageAlt}
          className={`absolute inset-0 h-full w-full object-cover ${mediaClass}`}
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
          textTop ?? placement
        }`}
        style={placementStyle}
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
    </>
  );

  // Pinned: the section is the scroll track, and its height is what the pin
  // "spends" — `pinHeightVh` screens of scrolling pass while the sticky frame
  // stays put. Unpinned: the section is the frame.
  return pin ? (
    <section
      ref={sectionRef}
      className={`relative w-full ${className}`}
      style={{ height: `${pinHeightVh}vh` }}
      data-nav-theme={theme}
    >
      <div ref={frameRef} className={frameClass}>
        {body}
      </div>
    </section>
  ) : (
    <section ref={sectionRef} className={frameClass} style={frameStyle} data-nav-theme={theme}>
      {body}
    </section>
  );
}
