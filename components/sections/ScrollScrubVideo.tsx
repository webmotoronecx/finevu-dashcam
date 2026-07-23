"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";

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
  /** Where the block sits on the video frame, in `stageViewBox` units. Because the lg+ stage is
   *  sized to the video's object-cover rect, this point tracks the same spot on the footage at
   *  every viewport size. The block's own text stays at fixed px sizes. */
  at: [number, number];
  /** Which corner of the block lands on `at` (default "top-left"). */
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Entrance slide direction as the block fades in (default "bottom" → slides up). */
  from?: "bottom" | "left" | "right";
  /** Optional segmented connector, drawn block → product in `stageViewBox` coordinates.
   *
   *  The path always *starts* at the block: that first vertex is measured off the block's divider
   *  each layout (see `syncLines`) rather than authored, because the text is fixed-px while the
   *  frame scales — the two only stay flush if measured. `lead` is the x the horizontal underline
   *  runs out to (it inherits the measured y, so it is exactly horizontal); `points` are the
   *  remaining vertices, ending on the feature being annotated. `attachDx` nudges only that
   *  measured start along x (viewBox units, + right / − left) to trim or extend the underline
   *  without moving the block.
   *  `start`/`end` default to the block's window; the connector draws itself over that range. */
  line?: { lead?: number; attachDx?: number; points: [number, number][]; start?: number; end?: number };
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

/** Offset of `el` inside `ancestor`, walking the offsetParent chain. Deliberately not
 *  getBoundingClientRect: `paint` puts an entrance transform on the card mid-reveal, and
 *  offsetLeft/offsetTop ignore transforms — so this reads the block's resting position whenever
 *  it's measured. Returns null if the chain doesn't reach `ancestor` (e.g. display:none below lg). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return node === ancestor ? { left, top } : null;
}

/** Pin a callout's `align` corner to its `at` point on the frame. Deliberately uses the inset
 *  properties rather than a translate, so the element stays transform-free and `syncLines` can
 *  measure it with offsetLeft/offsetTop. */
function anchorStyle(c: ScrubCallout, vbW: number, vbH: number): CSSProperties {
  const [x, y] = c.at;
  const px = `${(x / vbW) * 100}%`;
  const py = `${(y / vbH) * 100}%`;
  const inv = (v: number) => `${100 - v}%`;
  const align = c.align ?? "top-left";
  return {
    ...(align.endsWith("right") ? { right: inv((x / vbW) * 100) } : { left: px }),
    ...(align.startsWith("bottom") ? { bottom: inv((y / vbH) * 100) } : { top: py }),
  };
}

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

// Height of the sticky stage at md+ — also the `H` in the object-cover width formula below, so the
// callout layer resolves to the video's exact rendered box. Keep the two in lockstep.
const STAGE_H = "100dvh";

/** One annotation block — shared by the pinned overlay and the mobile stack.
 *
 * `measureDivider` is only passed by the pinned overlay: there the connector's lead-in segment *is*
 * the divider, so the element is rendered as an invisible 1px spacer purely to be measured. In
 * normal flow (mobile stack / reduced motion) it keeps its painted gradient as before. */
function CalloutBlock({ data, measureDivider }: { data: ScrubCallout; measureDivider?: (el: HTMLDivElement | null) => void }) {
  const anchored = measureDivider !== undefined;
  return (
    <div className="w-full md:w-[248px] xl:w-[300px]">
      <p className={`text-[28px] font-semibold leading-none xl:text-[34px] ${CO_TITLE}`} style={{ filter: HEAD_SHADOW }}>
        {data.title}
      </p>
      {data.sub && (
        <p className={`mt-1.5 text-[12px] font-semibold tracking-wide xl:text-[13.6px] ${CO_SUB}`} style={{ textShadow: TEXT_SHADOW }}>
          {data.sub}
        </p>
      )}
      <div
        ref={measureDivider}
        className={`mt-3 h-px w-full ${anchored ? "" : ""}`}
        style={anchored ? undefined : { backgroundImage: CO_DIVIDER }}
      />
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
  startVisible = 1,
  holdLength = "0vh",
  reverseAt,
  reverseOnExit = false,
  mobileObjectPosition = "center",
  mobileScale = 1,
  stageViewBox = "0 0 1920 1080",
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
  /** How much of the viewport the section must fill before the scrub starts, 0..1.
   *  `1` (default) = the old behaviour: progress 0 the moment the section is pinned
   *  (its top at the top of the viewport). `0.5` starts scrubbing while the section is
   *  only half on screen, so the video is already moving as it slides up into the pin.
   *  Lowering it lengthens the total scroll travel by `(1 − startVisible) × 100vh`
   *  without changing `scrubLength`, so beats/callout windows keep their relative shape. */
  startVisible?: number;
  /** Extra scroll (e.g. "80vh") the section stays pinned *after* the scrub finishes, before it
   *  unsticks. Added on top of `scrubLength`; the scrub still completes over `scrubLength`, then
   *  everything holds on the last frame — video, beats and connectors all freeze — for this much
   *  scroll. With `reverseOnExit` the hold sits between the forward scrub and the rewind, so the
   *  final frame lands before the section starts sliding away. Default "0vh" (no hold). */
  holdLength?: string;
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
  /** Coordinate space for `callout.at` anchors and `callout.line` points. This **must** match the
   *  video's intrinsic pixel size — the callout layer is sized to the video's object-cover rect, so
   *  a mismatched aspect ratio skews every anchor and connector. Check with
   *  `ffprobe -show_entries stream=width,height <file>`; a mismatch warns in dev. */
  stageViewBox?: string;
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
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineLen = useRef<number[]>([]);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(0);

  // Stage aspect (from the viewBox) keeps the centered callout box proportional to the
  // line coordinate space, so blocks and connectors stay aligned at any width.
  const [, , vbW, vbH] = stageViewBox.split(/\s+/).map(Number);
  const stageAspect = vbW && vbH ? `${vbW} / ${vbH}` : "16 / 9";
  // The callout layer is the video's object-cover content box: for a container W×H and intrinsic
  // aspect A, cover renders it max(W, H·A) wide, centered. Expressed in CSS so it needs no JS and
  // can't fall out of sync with the video — see the stage div below.
  const stageWidth = vbW && vbH ? `max(100%, calc(${STAGE_H} * ${vbW} / ${vbH}))` : "100%";

  // How much viewport height is scrolled *before* the section pins, in vh. `startVisible: 1`
  // gives 0 (progress starts at the pin, as before); 0.5 gives 50 — half a viewport of
  // lead-in during which the section is sliding up and the video is already scrubbing.
  const leadVh = (1 - clamp(startVisible, 0, 1)) * 100;
  // Framer offset: "start <x>%" fires progress 0 when the section's top reaches x% down the
  // viewport. 100% ("end") = section just peeking in; 0% ("start") = fully pinned.
  const startOffset: `start ${number}%` = `start ${100 - leadVh}%`;

  // Reverse-on-exit: the sticky stage is 100dvh, so the pin lasts `(trackVh − 100)` of
  // the track. Tracking the whole track (offset end→start) makes progress span the lead-in,
  // the pin *and* the exit; the fraction up to release becomes the reverse split, so the
  // video winds back as the section slides away. Falls back to the manual `reverseAt` otherwise.
  const trackVh = parseFloat(scrubLength);
  const exitReverseAt =
    reverseOnExit && Number.isFinite(trackVh) && trackVh > 100
      ? (leadVh + trackVh - 100) / (leadVh + trackVh)
      : undefined;

  // End hold: extra track height that keeps the section pinned after the scrub is done.
  //
  // Rather than thread a second timeline through the scrub/beat/connector maths, we grow the
  // track and *remap* raw scroll progress back onto the no-hold timeline — so `effReverseAt`
  // above and every authored beat/callout window keep meaning exactly what they meant before.
  //
  // In vh along the track: `fwdVh` is the travel over which the video scrubs forward (lead-in +
  // pin), then `holdVh` of plateau, then whatever remains (the 100vh exit, only tracked when
  // `reverseOnExit`). `V` is the total travel the raw progress spans; `V − holdVh` is the
  // no-hold travel the remap targets.
  const holdVh = Math.max(0, parseFloat(holdLength) || 0);
  const fwdVh = leadVh + trackVh - 100;
  const totalVh = leadVh + trackVh + holdVh - (reverseOnExit ? 0 : 100);
  const hold =
    holdVh > 0 && Number.isFinite(fwdVh) && fwdVh > 0 && totalVh > holdVh
      ? {
          start: fwdVh / totalVh, // raw progress where the scrub is finished
          end: (fwdVh + holdVh) / totalVh, // raw progress where it resumes / releases
          at: fwdVh / (totalVh - holdVh), // the no-hold progress being held
        }
      : null;

  // Raw scroll progress → no-hold-timeline progress: rate up to the plateau, freeze across it,
  // rate again after. Identity when there's no hold.
  const unhold = useCallback(
    (p: number) => {
      if (!hold) return p;
      if (p <= hold.start) return hold.start > 0 ? (p / hold.start) * hold.at : hold.at;
      if (p <= hold.end) return hold.at;
      return hold.at + ((p - hold.end) / (1 - hold.end)) * (1 - hold.at);
    },
    [hold?.start, hold?.end, hold?.at], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // The split point: an explicit `reverseAt` always wins (so you can tune where the flip
  // happens); otherwise reverse-on-exit uses the geometry-derived release fraction.
  const effReverseAt = reverseAt ?? exitReverseAt;

  const { scrollYProgress } = useScroll({
    // Reduced motion is static, so it has no scroll target (see OpticsSection).
    target: reduce ? undefined : trackRef,
    // Reverse-on-exit needs progress to continue through the un-pin/exit, so track the
    // track's full travel (end at viewport start) rather than stopping at release.
    offset: reverseOnExit ? [startOffset, "end start"] : [startOffset, "end end"],
  });

  // Fade to black as the section releases. Its own timeline: 0 the moment the stage
  // unpins (section bottom at the viewport bottom), 1 when the section has fully left —
  // so the exit is always the last 100vh of travel regardless of `scrubLength`/`hold`.
  const { scrollYProgress: exitProgress } = useScroll({
    target: reduce ? undefined : trackRef,
    offset: ["end end", "end start"],
  });
  // Sit clear for the first slice of the release, then ramp to solid before the section
  // is gone, so the next section scrolls in from black rather than from a half-lit frame.
  const exitFade = useTransform(exitProgress, [0.1, 0.75], [0, 1]);

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
  useMotionValueEvent(scrollYProgress, "change", (raw) => {
    // Everything downstream runs on the no-hold timeline; the plateau is folded in here once.
    const p = unhold(raw);
    targetTimeRef.current = scrubTime(p, durationRef.current || 0, effReverseAt);
    paint(p); // paint uses scroll progress — beats/callouts fire on scroll position, not video time
  });

  // Attach each connector to its block, then prime the dash geometry so it can "draw" on scroll.
  //
  // The lead-in segment doubles as the block's underline, but the block's text is fixed-px while
  // the stage scales with the video — so the junction is only exact if measured. We read the
  // divider's box-offsets (not getBoundingClientRect: `paint` puts an entrance transform on the
  // card, and offsetLeft/Top ignore transforms), convert to viewBox units and prepend that as the
  // polyline's first vertex. Authors supply only the bend and the tip on the product.
  const syncLines = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    if (!sw || !sh) return;

    callouts.forEach((c, i) => {
      const line = lineRefs.current[i];
      if (!line || !c.line) return;

      const divider = dividerRefs.current[i];
      const offset = divider && offsetWithin(divider, stage);
      const pts = [...c.line.points];
      if (offset) {
        const width = divider.offsetWidth;
        // Attach on the edge *away* from the target, so the segment underlines the block before
        // running out to the product.
        const centre = ((offset.left + width / 2) / sw) * vbW;
        const toward = c.line.lead ?? c.line.points[0]?.[0] ?? centre;
        const ax = ((toward > centre ? offset.left : offset.left + width) / sw) * vbW + (c.line.attachDx ?? 0);
        const ay = (offset.top / sh) * vbH;
        if (c.line.lead !== undefined) pts.unshift([c.line.lead, ay]); // horizontal by construction
        pts.unshift([ax, ay]);
      }
      line.setAttribute("points", pts.map(([x, y]) => `${x},${y}`).join(" "));

      // `vector-effect: non-scaling-stroke` makes the browser resolve the *whole* stroke — dash
      // pattern included — in screen space, but getTotalLength() reports viewBox user units. Scale
      // the dash to px or the pattern no longer covers the path: under-long once the stage scales
      // past 1:1 (big screens), which renders the connector as a floating fragment.
      const len = line.getTotalLength() * (sw / vbW);
      lineLen.current[i] = len;
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
      line.style.opacity = "0";
    });
    paint(unhold(scrollYProgress.get()));
  }, [callouts, paint, scrollYProgress, unhold, vbW, vbH]);

  useEffect(() => {
    if (reduce) return;
    syncLines();
    // Webfonts change the block's height, which moves the divider — re-measure once they land.
    document.fonts?.ready.then(syncLines).catch(() => {});
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(syncLines);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [reduce, syncLines]);

  // Scrub loop: lerp video.currentTime toward the scroll target.
  useEffect(() => {
    if (reduce) return;
    const v = videoRef.current;
    if (!v) return;

    v.pause(); // we own currentTime; never let it autoplay
    const onMeta = () => {
      durationRef.current = v.duration || 0;
      targetTimeRef.current = scrubTime(unhold(scrollYProgress.get()), durationRef.current, effReverseAt);
      // The callout stage is the video's cover box, so a viewBox that doesn't match the real frame
      // silently skews every anchor and connector. Cheap guard — this exact mismatch shipped once.
      if (process.env.NODE_ENV !== "production" && v.videoWidth && (v.videoWidth !== vbW || v.videoHeight !== vbH)) {
        console.warn(
          `[ScrollScrubVideo] stageViewBox is ${vbW}×${vbH} but ${video} is ${v.videoWidth}×${v.videoHeight}. ` +
            `Callout anchors and connector lines will be skewed — pass stageViewBox="0 0 ${v.videoWidth} ${v.videoHeight}".`,
        );
      }
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
  }, [reduce, scrollYProgress, unhold, effReverseAt, video, vbW, vbH]);

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
      <section
        ref={trackRef}
        data-nav-theme="dark"
        className={`relative w-full ${sectionClass}`}
        // The hold is just extra track: the pin lasts as long as the section is taller than the
        // sticky stage, and `unhold` above keeps the scrub itself confined to `scrubLength`.
        style={{ height: hold ? `calc(${scrubLength} + ${holdLength})` : scrubLength }}
      >
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
            /* Legibility scrim (matches ScrollHero). */
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 78% 58% at 50% 50%, rgba(6,7,11,0.62) 0%, rgba(6,7,11,0.34) 46%, rgba(6,7,11,0.06) 74%, transparent 100%)" }}
            />
          )}

          {/* Bottom fade into the page background — always on, so the pinned stage never
              cuts off with a hard edge against the next section. */}
          {/* Mobile gets the softer multi-stop ramp in the page colour; md+ swaps to a
              straight fade to pure black. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 [background-image:linear-gradient(to_bottom,rgba(8,8,12,0)_0%,rgba(8,8,12,0.55)_45%,rgba(8,8,12,0.88)_75%,#08080c_100%)] md:[background-image:linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]"
          />

          {/* Section title + description — pinned near the top, always visible (OpticsSection style). */}
          {head && (
            <div className="pointer-events-none absolute inset-x-0 top-[15%] px-6">
              <ScrubHead head={head} />
            </div>
          )}

          {/* Positioned callouts + connector lines. The stage is sized to the video's *object-cover
              content box* — same centre, same aspect, same scale — so viewBox coordinates map 1:1
              onto the footage and every anchor tracks the product at any viewport size. lg+ only;
              mobile stacks below. */}
          {callouts.length > 0 && (
            <div
              ref={stageRef}
              className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
              style={{ width: stageWidth, aspectRatio: stageAspect }}
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
                // Two elements on purpose: the wrapper carries the frame anchor and stays
                // transform-free so `syncLines` can read exact box-offsets, while the inner card
                // takes the entrance opacity/translate written by `paint`.
                <div key={c.key} className="absolute" style={anchorStyle(c, vbW, vbH)}>
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="pointer-events-auto will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    <CalloutBlock
                      data={c}
                      measureDivider={(el) => {
                        dividerRefs.current[i] = el;
                      }}
                    />
                  </div>
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

          {/* Fade to black on exit — last layer, so it takes the video, callouts and
              beats down together as the section releases. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-black"
            style={{ opacity: exitFade }}
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
