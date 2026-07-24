"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Scroll-pinned video hero.
 *
 * The section is a tall track wrapping a sticky, viewport-height stage: a looping
 * autoplay video with a legibility scrim, over which a series of centered `beats`
 * (kicker · headline · sub) crossfade as you scroll. Extracted from the GX4K page so
 * both product pages can share it — the beats are a prop, not baked in.
 *
 * Unlike ScrollScrubVideo the clip just plays; scroll only drives the copy. Scroll
 * decides in/out of a beat's window, CSS animates the fade over `fadeMs`, so the
 * transition speed stays constant regardless of how long the track is.
 *
 * The stage is always light-on-dark — the copy sits over video in both themes.
 * `theme` picks the accent gradients only (purple/blue for GX4K, orange for GX35).
 */

export type HeroBeat = {
  /** Scroll-progress window (0..1) over which this beat is visible. */
  start: number;
  end: number;
  kicker: string;
  headline: string;
  sub?: string;
};

export type ScrollHeroTheme = "dark" | "light";

const HEAD_SHADOW = "drop-shadow(0 2px 18px rgba(0,0,0,0.55))";
const TEXT_SHADOW = "0 1px 12px rgba(0,0,0,0.8)";

// Accent gradients only — kept light-on-dark so the text reads over the video
// (no low-contrast dark stops in either theme).
const THEME: Record<ScrollHeroTheme, { kicker: string; headline: string; still: string }> = {
  dark: {
    kicker: "linear-gradient(90deg, #b3c4f5, #cbb0ee)",
    headline: "linear-gradient(120deg, #ffffff 0%, #d0dafb 46%, #c1abec 100%)",
    still: "radial-gradient(ellipse at 50% 40%, #0f1424 0%, #08080c 70%)",
  },
  light: {
    kicker: "linear-gradient(90deg, #ffd2ab, #f68428)",
    headline: "linear-gradient(120deg, #ffffff 0%, #ffe0c6 46%, #f9a45e 100%)",
    still: "radial-gradient(ellipse at 50% 40%, #2a1a10 0%, #08080c 70%)",
  },
};

const emptySubscribe = () => () => {};

export function ScrollHero({
  video,
  poster,
  beats,
  theme = "dark",
  // Colour the sticky stage fades into at its bottom edge — set it to whatever the
  // next section's background is so the hero never ends on a hard cut. Omit it and
  // no bottom fade is drawn at all (the video runs clean to the section edge).
  fadeTo,
  // Total scroll length as a multiple of the viewport height. Lower = the beats
  // arrive with less scrolling (e.g. 220 feels snappy, 380 is the cinematic default).
  heightVh = 220,
  // Crossfade duration in ms. The fade is time-based, not scroll-scrubbed, so the
  // transition stays smooth even when `heightVh` is short and you scroll past fast.
  fadeMs = 260,
}: {
  video: string;
  poster?: string;
  beats: HeroBeat[];
  theme?: ScrollHeroTheme;
  fadeTo?: string;
  heightVh?: number;
  fadeMs?: number;
}) {
  const t = THEME[theme];

  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const reduce = mounted && prefersReduced;

  const containerRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Native scroll drives the beat fades — instant, locked to the scrollbar.
  useEffect(() => {
    if (reduce) return;
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const scrollable = container.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -container.getBoundingClientRect().top / scrollable)) : 0;
      beats.forEach((beat, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        // Scroll only decides in/out of the window; CSS animates the crossfade
        // over `fadeMs`, so the transition speed is independent of scroll length.
        const active = p >= beat.start && p <= beat.end;
        el.style.opacity = active ? "1" : "0";
        el.style.transform = active ? "translateY(0)" : "translateY(20px)";
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [reduce, beats]);

  /* Reduced motion: static hero, first beat only, no pin */
  if (reduce) {
    const beat = beats[0];
    if (!beat) return null;
    return (
      <section
        data-nav-theme="dark"
        className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden"
        style={{ background: t.still }}
      >
        <div className="px-6 text-center">
          <p
            className="mb-3 bg-clip-text text-[11.5px] font-bold uppercase tracking-[0.28em] text-transparent"
            style={{ backgroundImage: t.kicker, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
          >
            {beat.kicker}
          </p>
          <h1
            className="bg-clip-text font-bold text-transparent"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              backgroundImage: t.headline,
              WebkitBackgroundClip: "text",
              filter: HEAD_SHADOW,
            }}
          >
            {beat.headline}
          </h1>
          {beat.sub && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/90" style={{ textShadow: TEXT_SHADOW }}>
              {beat.sub}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} data-nav-theme="dark" className="relative w-full" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <video src={video} poster={poster} autoPlay loop muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />
        {/* Legibility scrim plus a bottom fade into the next section */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 78% 58% at 50% 50%, rgba(6,7,11,0.62) 0%, rgba(6,7,11,0.34) 46%, rgba(6,7,11,0.06) 74%, transparent 100%)",
          }}
        />
        {fadeTo && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{ background: `linear-gradient(to bottom, transparent, ${fadeTo})` }}
          />
        )}

        {beats.map((beat, i) => (
          <div
            key={i}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: `opacity ${fadeMs}ms ease, transform ${fadeMs}ms ease`,
            }}
          >
            <p
              className="mb-3 bg-clip-text text-[11.5px] font-bold uppercase tracking-[0.28em] text-transparent"
              style={{ backgroundImage: t.kicker, WebkitBackgroundClip: "text", filter: HEAD_SHADOW }}
            >
              {beat.kicker}
            </p>
            {i === 0 ? (
              <h1
                className="bg-clip-text font-bold text-transparent"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  backgroundImage: t.headline,
                  WebkitBackgroundClip: "text",
                  filter: HEAD_SHADOW,
                }}
              >
                {beat.headline}
              </h1>
            ) : (
              <h2
                className="font-bold text-white"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: TEXT_SHADOW }}
              >
                {beat.headline}
              </h2>
            )}
            {beat.sub && (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90" style={{ textShadow: TEXT_SHADOW }}>
                {beat.sub}
              </p>
            )}
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
  );
}
