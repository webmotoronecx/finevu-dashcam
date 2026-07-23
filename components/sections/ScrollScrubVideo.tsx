"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Scroll-scrubbed video background section.
 *
 * The section is a tall track; an inner sticky stage pins a full-bleed <video> while
 * scroll progress *scrubs* the video's `currentTime` (we own playback — the video is
 * paused, never autoplayed/looped). Two kinds of overlay ride on top, each revealed on
 * its own scroll window:
 *   - `beats`    — centered headline moments (like ScrollHero).
 *   - `callouts` — positioned annotation blocks (title · sub · divider · spec list) with
 *                  optional gradient connector lines pointing at the product, exactly like
 *                  components/sections/OpticsSection.tsx. Stacks vertically below `lg`.
 *
 * Why no GSAP: the cost of scrubbing is the browser *seeking/decoding* video frames, not
 * the animation library — a library would just set `currentTime` like we do here. For
 * smooth seeks the source MP4 must be encoded with dense keyframes, e.g.:
 *   ffmpeg -i in.mov -an -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
 *     -pix_fmt yuv420p -crf 20 -movflags +faststart out.mp4
 */

export type ScrubBeat = {
  /** Scroll-progress window (0..1) over which this beat is visible. */
  start: number;
  end: number;
  kicker?: string;
  headline: string;
  sub?: string;
};

export type ScrubCallout = {
  key: string;
  /** Big label, e.g. "Front". */
  title: string;
  /** Small sub-label under the title, e.g. "UHD wide". */
  sub?: string;
  /** Spec lines listed under the divider. */
  items: string[];
  /** Scroll-progress window (0..1) over which the block fades in. */
  start: number;
  end: number;
  /** Anchor on the lg+ stage as Tailwind position classes, e.g. "left-[2%] top-[19%]". */
  pos: string;
  /** Entrance slide direction as the block fades in (default "bottom" → slides up). */
  from?: "bottom" | "left" | "right";
  /** Optional segmented connector, in `stageViewBox` coordinate space. `points` are the
   *  polyline vertices [x,y] (e.g. a horizontal lead-in then a bend toward the product).
   *  `start`/`end` default to the block's window; the connector draws itself over that range. */
  line?: { points: [number, number][]; start?: number; end?: number };
};

// Beat text tokens (kept light so it reads over video) — matches ScrollHero.
const KICKER_GRAD = "linear-gradient(90deg, #b3c4f5, #cbb0ee)";
const HEAD_GRAD = "linear-gradient(120deg, #ffffff 0%, #d0dafb 46%, #c1abec 100%)";
const HEAD_SHADOW = "drop-shadow(0 2px 18px rgba(0,0,0,0.55))";
const TEXT_SHADOW = "0 1px 12px rgba(0,0,0,0.8)";

// Callout tokens — mirrors OpticsSection's dark theme.
const CO_TITLE = "text-[#f5f3f0]";
const CO_SUB = "text-[#6e8fe6]";
const CO_DIVIDER = "linear-gradient(90deg, #ffffff 0%, #6e8fe6 55%, #4f2d74 100%)";
const CO_LINE_STOPS = [
  { offset: "0%", color: "#ffffff" },
  { offset: "55%", color: "#6e8fe6" },
  { offset: "100%", color: "#4f2d74" },
];

const emptySubscribe = () => () => {};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Scroll → video time. Default is linear (0→duration). With `reverseAt` set, it's a
// triangle: play forward reaching the last frame exactly at p=reverseAt, then reverse
// back to frame 0 by p=1 — the clip winds forward then rewinds to its initial state.
function scrubTime(p: number, duration: number, reverseAt?: number) {
  if (!reverseAt || reverseAt <= 0 || reverseAt >= 1) return p * duration;
  return p <= reverseAt
    ? (p / reverseAt) * duration
    : (1 - (p - reverseAt) / (1 - reverseAt)) * duration;
}

/** Section title + description — mirrors OpticsSection's OpticsHead, legible over video. */
function ScrubHead({ head, className = "" }: { head: SectionHead; className?: string }) {
  return (
    <div className={`pointer-events-auto mx-auto max-w-[720px] text-center ${className}`}>
      <h2 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[42px]" style={{ filter: HEAD_SHADOW }}>
        {head.title}
      </h2>
      {head.subtitle && (
        <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.6] text-[#c8ccd8] md:text-[18px]" style={{ textShadow: TEXT_SHADOW }}>
          {head.subtitle}
        </p>
      )}
    </div>
  );
}

export type SectionHead = { title: string; subtitle?: string };

// How hard the video time chases the scroll target each frame (0..1). Lower = smoother
// but laggier; this makes even cheap encodes look fluid and avoids seek-spam jank.
const LERP = 0.15;

/** One annotation block — shared by the pinned overlay and the mobile stack. */
function CalloutBlock({ data }: { data: ScrubCallout }) {
  return (
    <div className="w-[248px] xl:w-[300px]">
      <p className={`text-[28px] font-semibold leading-none xl:text-[34px] ${CO_TITLE}`} style={{ filter: HEAD_SHADOW }}>
        {data.title}
      </p>
      {data.sub && (
        <p className={`mt-1.5 text-[12px] font-semibold tracking-wide xl:text-[13.6px] ${CO_SUB}`} style={{ textShadow: TEXT_SHADOW }}>
          {data.sub}
        </p>
      )}
      <div className="mt-3 h-px w-full md:hidden" style={{ backgroundImage: CO_DIVIDER }} />
      <ul className="mt-3.5 space-y-1.5">
        {data.items.map((it) => (
          <li key={it} className="text-[13px] font-medium text-white xl:text-[14.4px]" style={{ textShadow: TEXT_SHADOW }}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScrollScrubVideo({
  video,
  poster,
  head,
  beats = [],
  callouts = [],
  scrubLength = "300vh",
  reverseAt,
  reverseOnExit = false,
  mobileObjectPosition = "center",
  mobileScale = 1,
  stageViewBox = "0 0 1920 1080",
  stageMaxWidth = "1440px",
  sectionClass = "",
  overlayScrim = true,
}: {
  /** Video source (public path or remote URL). Encode with dense keyframes — see file header. */
  video: string;
  /** Poster / first-frame image; also the static image shown under reduced motion. */
  poster?: string;
  /** Optional section title + description, pinned near the top of the stage (like OpticsSection). */
  head?: SectionHead;
  /** Centered headline moments. */
  beats?: ScrubBeat[];
  /** Positioned annotation blocks with optional connector lines. */
  callouts?: ScrubCallout[];
  /** Height of the scroll track that drives the scrub (default "300vh"). */
  scrubLength?: string;
  /** Optional "transition end": scroll progress (0..1) at which the video finishes
   *  playing forward and starts reversing back to frame 0. Omit for the default
   *  forward-only linear scrub. Typical value 0.6–0.75. Composes with `reverseOnExit`
   *  — there it overrides the geometry-derived split so you can tune where the flip lands. */
  reverseAt?: number;
  /** Reverse *as the section releases*, not while pinned: the video plays forward over
   *  the whole pinned range, then rewinds to frame 0 during the exit — while the next
   *  section scrolls into view. On its own the split is derived from `scrubLength` (the
   *  pin lasts `(scrubLength − 100vh)` of the track); pass `reverseAt` too to override it. */
  reverseOnExit?: boolean;
  /** Mobile-only (< md) framing of the object-cover video. `mobileObjectPosition` is a
   *  CSS object-position (e.g. "center", "50% 40%") choosing which slice of the cropped
   *  frame shows; `mobileScale` zooms it (>1 tighter/more crop, <1 pulls back but reveals
   *  the section background around the video). Both reset to normal at md+. Note: cover
   *  can't un-crop the sides — for a full uncropped mobile frame, supply a portrait clip. */
  mobileObjectPosition?: string;
  mobileScale?: number;
  /** Coordinate space for `callout.line` endpoints (default the video's 1920×1080). */
  stageViewBox?: string;
  /** Max width of the centered stage the callouts anchor to, so they stay put (don't drift
   *  to the edges) on large/ultrawide screens. Its aspect ratio is derived from `stageViewBox`. */
  stageMaxWidth?: string;
  /** Extra classes on the outer <section>. */
  sectionClass?: string;
  /** Show the legibility scrim + bottom fade over the video (default true). */
  overlayScrim?: boolean;
}) {
  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduce = mounted && prefersReduced;

  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const lineLen = useRef<number[]>([]);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(0);

  // Stage aspect (from the viewBox) keeps the centered callout box proportional to the
  // line coordinate space, so blocks and connectors stay aligned at any width.
  const [, , vbW, vbH] = stageViewBox.split(/\s+/).map(Number);
  const stageAspect = vbW && vbH ? `${vbW} / ${vbH}` : "16 / 9";

  // Reverse-on-exit: the sticky stage is 100dvh, so the pin lasts `(trackVh − 100)` of
  // the track. Tracking the whole track (offset end→start) makes progress span the pin
  // *and* the exit; the pin fraction becomes the reverse split, so the video winds back
  // as the section slides away. Falls back to the manual `reverseAt` otherwise.
  const trackVh = parseFloat(scrubLength);
  const exitReverseAt =
    reverseOnExit && Number.isFinite(trackVh) && trackVh > 100 ? (trackVh - 100) / trackVh : undefined;
  // The split point: an explicit `reverseAt` always wins (so you can tune where the flip
  // happens); otherwise reverse-on-exit uses the geometry-derived release fraction.
  const effReverseAt = reverseAt ?? exitReverseAt;

  const { scrollYProgress } = useScroll({
    // Reduced motion is static, so it has no scroll target (see OpticsSection).
    target: reduce ? undefined : trackRef,
    // Reverse-on-exit needs progress to continue through the un-pin/exit, so track the
    // track's full travel (end at viewport start) rather than stopping at release.
    offset: reverseOnExit ? ["start start", "end start"] : ["start start", "end end"],
  });

  // Overlay reveals — written straight to the DOM, instant and locked to the scrollbar.
  const paint = useCallback(
    (rawP: number) => {
      // With `reverseAt`, drive overlays off the same triangle as the video (0→1→0) so
      // they fade in on the way forward and back out on the rewind. Without it, this is
      // the identity (scrubTime(p,1) === p) and overlays behave one-way as before.
      const p = scrubTime(rawP, 1, effReverseAt);
      const fade = 0.06;
      beats.forEach((beat, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        let opacity = 0;
        if (p >= beat.start && p <= beat.end) {
          if (p - beat.start < fade) opacity = (p - beat.start) / fade;
          else if (beat.end - p < fade) opacity = (beat.end - p) / fade;
          else opacity = 1;
          opacity = clamp(opacity, 0, 1);
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${20 * (1 - opacity)}px)`;
      });

      callouts.forEach((c, i) => {
        const t = clamp((p - c.start) / (c.end - c.start), 0, 1);
        const card = cardRefs.current[i];
        if (card) {
          // Slide in from the chosen edge (24px), easing to rest as it fades in.
          const off = (1 - t) * 24;
          const tx = c.from === "left" ? -off : c.from === "right" ? off : 0;
          const ty = c.from === "left" || c.from === "right" ? 0 : off;
          card.style.opacity = String(t);
          card.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
        const line = lineRefs.current[i];
        if (line && c.line) {
          const ls = c.line.start ?? c.start;
          const le = c.line.end ?? c.end;
          const tl = clamp((p - ls) / (le - ls), 0, 1);
          line.style.strokeDashoffset = String((lineLen.current[i] || 0) * (1 - tl));
          line.style.opacity = tl > 0 ? "1" : "0";
        }
      });
    },
    [beats, callouts, effReverseAt],
  );

  // Scroll → target video time + overlay repaint (does not touch currentTime directly;
  // the rAF loop below lerps toward the target so seeks stay smooth).
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    targetTimeRef.current = scrubTime(p, durationRef.current || 0, effReverseAt);
    paint(p); // paint uses raw p — beats/callouts fire on scroll position, not video time
  });

  // Prime connector-line dash geometry so it can "draw" on scroll (OpticsSection pattern).
  useEffect(() => {
    if (reduce) return;
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const len = line.getTotalLength();
      lineLen.current[i] = len;
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
      line.style.opacity = "0";
    });
    paint(scrollYProgress.get());
  }, [reduce, callouts, paint, scrollYProgress]);

  // Scrub loop: lerp video.currentTime toward the scroll target.
  useEffect(() => {
    if (reduce) return;
    const v = videoRef.current;
    if (!v) return;

    v.pause(); // we own currentTime; never let it autoplay
    const onMeta = () => {
      durationRef.current = v.duration || 0;
      targetTimeRef.current = scrubTime(scrollYProgress.get(), durationRef.current, effReverseAt);
    };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) onMeta();

    let cur = targetTimeRef.current;
    let raf = 0;
    const tick = () => {
      const target = targetTimeRef.current;
      cur += (target - cur) * LERP;
      if (Math.abs(target - cur) < 0.001) cur = target;
      // Skip while a seek is still resolving so we don't queue seeks faster than the
      // decoder drains; muted + playsInline lets us seek without a user gesture on iOS.
      if (durationRef.current > 0 && !v.seeking && Math.abs(v.currentTime - cur) > 0.01) {
        try {
          v.currentTime = cur;
        } catch {
          /* seek can throw before the media is seekable — ignore, next frame retries */
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [reduce, scrollYProgress, effReverseAt]);

  const beatText = (beat: ScrubBeat, centered = false) => (
    <>
      {beat.kicker && (
        <p
          className="mb-3 bg-clip-text text-[11.5px] font-bold uppercase tracking-[0.28em] text-transparent"
          style={{ backgroundImage: KICKER_GRAD, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
        >
          {beat.kicker}
        </p>
      )}
      <h2
        className="bg-clip-text font-bold text-transparent"
        style={{
          fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          backgroundImage: HEAD_GRAD,
          WebkitBackgroundClip: "text",
          filter: HEAD_SHADOW,
        }}
      >
        {beat.headline}
      </h2>
      {beat.sub && (
        <p className={`${centered ? "mx-auto " : ""}mt-5 max-w-xl text-lg leading-relaxed text-white/90`} style={{ textShadow: TEXT_SHADOW }}>
          {beat.sub}
        </p>
      )}
    </>
  );

  // Reduced motion: static poster, first beat (if any) + stacked callouts, no pin/scrub.
  if (reduce) {
    return (
      <section
        data-nav-theme="dark"
        className={`relative w-full overflow-hidden ${sectionClass}`}
        style={{ background: "radial-gradient(ellipse at 50% 40%, #0f1424 0%, #08080c 70%)" }}
      >
        {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1280px] flex-col justify-center gap-12 px-6 py-20">
          {head && <ScrubHead head={head} />}
          {beats[0] && <div className="text-center">{beatText(beats[0], true)}</div>}
          {callouts.length > 0 && (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {callouts.map((c) => (
                <CalloutBlock key={c.key} data={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <section ref={trackRef} data-nav-theme="dark" className={`relative w-full ${sectionClass}`} style={{ height: scrubLength }}>
        <div className="bg-black sticky top-0  h-[80dvh] md:h-[100dvh] w-full overflow-hidden flex  items-center ">
          <video
            ref={videoRef}
            src={video}
            poster={poster}
            muted
            playsInline
            preload="auto"
            // Stays object-cover; below md, `mobileObjectPosition` picks which slice of
            // the (cropped) frame shows and `mobileScale` zooms it. md+ resets to normal.
            className="absolute top-50 md:top-0 inset-0 w-full object-cover [object-position:var(--ssv-pos)] [transform:scale(var(--ssv-scale))] md:[object-position:center] md:[transform:none] h-[60dvh] md:h-full"
            style={{ ["--ssv-pos" as string]: mobileObjectPosition, ["--ssv-scale" as string]: mobileScale }}
          />

          {overlayScrim && (
            <>
              {/* Legibility scrim plus a bottom fade into the next section (matches ScrollHero). */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 78% 58% at 50% 50%, rgba(6,7,11,0.62) 0%, rgba(6,7,11,0.34) 46%, rgba(6,7,11,0.06) 74%, transparent 100%)" }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, #08080c)" }} />
            </>
          )}

          {/* Section title + description — pinned near the top, always visible (OpticsSection style). */}
          {head && (
            <div className="pointer-events-none absolute inset-x-0 top-[15%] px-6">
              <ScrubHead head={head} />
            </div>
          )}

          {/* Positioned callouts + connector lines — anchored to a centered, max-width stage so
              they stay put (don't drift to the edges) on large screens. lg+ only; mobile stacks below. */}
          {callouts.length > 0 && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[1200px] h-[600px] -translate-x-1/2 -translate-y-1/2 lg:block"
              style={{ maxWidth: stageMaxWidth, aspectRatio: stageAspect }}
            >
              <svg viewBox={stageViewBox} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="scrub-callout-line" x1="0" y1="0" x2="1" y2="1">
                    {CO_LINE_STOPS.map((s) => (
                      <stop key={s.offset} offset={s.offset} stopColor={s.color} />
                    ))}
                  </linearGradient>
                </defs>
                {callouts.map((c, i) =>
                  c.line ? (
                    <polyline
                      key={c.key}
                      ref={(el) => {
                        lineRefs.current[i] = el;
                      }}
                      points={c.line.points.map(([x, y]) => `${x},${y}`).join(" ")}
                      fill="none"
                      stroke="url(#scrub-callout-line)"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      style={{ opacity: 0 }}
                    />
                  ) : null,
                )}
              </svg>

              {callouts.map((c, i) => (
                <div
                  key={c.key}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`pointer-events-auto absolute ${c.pos} will-change-transform`}
                  style={{ opacity: 0 }}
                >
                  <CalloutBlock data={c} />
                </div>
              ))}
            </div>
          )}

          {beats.map((beat, i) => (
            <div
              key={i}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              style={{ opacity: 0, transform: "translateY(20px)" }}
            >
              {/* Text itself is selectable; the full-inset wrapper stays click-through. */}
              <div className="pointer-events-auto">{beatText(beat)}</div>
            </div>
          ))}

          {/* scroll hint */}
          <motion.div
            className="pointer-events-none absolute bottom-10 left-1/2 h-10 w-px -translate-x-1/2 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }}
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </section>

      {/* Mobile / tablet (< lg): callouts stacked in normal flow instead of positioned. */}
      {callouts.length > 0 && (
        <section data-nav-theme="dark" className="bg-[#08080c] py-16 lg:hidden">
          {/* Head is already shown pinned over the video at every breakpoint, so it's
              intentionally omitted here to avoid a duplicate heading on mobile. */}
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 sm:grid-cols-3">
            {callouts.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, x: c.from === "left" ? -24 : c.from === "right" ? 24 : 0, y: c.from === "left" || c.from === "right" ? 0 : 24 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <CalloutBlock data={c} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
