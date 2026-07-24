"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Head } from "@/components/sections/Head";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// Default page shell width (GX4K). Override per-page via the `shellClass` prop.
const DEFAULT_SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";

export type CarouselTheme = "dark" | "light";

// Only the tokens that actually differ between the two product pages.
const THEME: Record<
  CarouselTheme,
  { title: string; body: string; note: string; sub: string; border: string; navBtn: string }
> = {
  dark: {
    title: "text-white",
    body: "text-[#a6a6a6]",
    note: "text-[#8f8f8f]",
    sub: "text-[#a6a6a6]",
    border: "border border-white/[0.06]",
    navBtn: "border-white/15 text-white/80 hover:text-white",
  },
  light: {
    title: "text-[#1D1D1F]",
    body: "text-[#6E6E73]",
    note: "text-[#9aa0ad]",
    sub: "text-[#6E6E73]",
    border: "",
    navBtn: "border-[#dcdce0] text-[#6E6E73] hover:text-[#1D1D1F]",
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export type Card = {
  title: string;
  body: string;
  img?: string;
  /** Responsive sources for `img`, e.g. "photo.jpg 1x, photo@2x.jpg 2x" */
  srcSet?: string;
  /** `sizes` hint, only needed when `srcSet` uses width (w) descriptors */
  sizes?: string;
  video?: string;
  note?: string;
};

/**
 * Draggable, snap-to-card horizontal carousel with prev/next controls.
 * Self-contained pointer-drag + measure/clamp logic. Reusable across product
 * pages; `shellClass` controls the heading/nav gutter width per page.
 */
export function Carousel({
  pre,
  grad,
  post,
  sub,
  cards,
  alignEnd,
  pinGutter,
  gutterRight,
  // Matches the Figma card frame; both product pages use it, so it's the default
  // rather than something every call site has to remember to pass.
  imgAspect = "1047 / 562",
  shellClass = DEFAULT_SHELL,
  bgImage,
  bgImageSrcSet,
  bgImageSizes,
  bgClassName = "",
  theme = "dark",
}: {
  pre?: string;
  grad?: string;
  post?: string;
  /** Optional subtitle under the heading. */
  sub?: string;
  cards: Card[];
  alignEnd?: boolean;
  pinGutter?: boolean;
  gutterRight?: boolean;
  imgAspect?: string;
  shellClass?: string;
  /** Full-section background image (public path or remote URL), behind everything */
  bgImage?: string;
  /** Responsive sources for `bgImage`, e.g. "bg.jpg 1x, bg@2x.jpg 2x" */
  bgImageSrcSet?: string;
  /** `sizes` hint, only needed when `bgImageSrcSet` uses width (w) descriptors */
  bgImageSizes?: string;
  /** Section background utility classes, e.g. a color or gradient ("bg-black") */
  bgClassName?: string;
  theme?: CarouselTheme;
}) {
  const t = THEME[theme];
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const [range, setRange] = useState({ min: 0, max: 0, step: 1 });
  const [gutter, setGutter] = useState(0);
  const [dragging, setDragging] = useState(false);
  // live gesture state (avoids stale-closure reads inside pointer handlers)
  const drag = useRef({ x: 0, tx: 0, active: false, min: 0, max: 0, step: 1 });

  // On mobile every carousel slides left; the desktop right-gutter mirror is off below md
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const rightGutter = !!gutterRight && !isMobile;

  // measure viewport/card and the clamped translate range for the current size
  const measure = useCallback(() => {
    const vp = vpRef.current;
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    if (!vp || !card) return null;
    const cardW = card.offsetWidth;
    const gap = 24;
    const step = cardW + gap;
    if (pinGutter) {
      // Fixed gutter: active card at a set spot; gutterRight mirrors it to the right
      const fullVw = document.documentElement.clientWidth;
      const g = Math.max(0, (fullVw - cardW) / 2);
      const span = (cards.length - 1) * step;
      setGutter(g);
      const r = rightGutter
        ? { min: fullVw - g - cardW - span, max: fullVw - g - cardW, step }
        : { min: -span, max: 0, step };
      setRange(r);
      return r;
    }
    const trackW = cards.length * cardW + (cards.length - 1) * gap;
    const vw = vp.clientWidth;
    const max = (vw - cardW) / 2; // first card centred → margin on the left
    const min = Math.min(max, (vw + cardW) / 2 - trackW); // last card → margin on the right
    const r = { min, max, step };
    setRange(r);
    return r;
  }, [cards.length, pinGutter, rightGutter]);

  const snap = useCallback((rawTx: number, r: { min: number; max: number; step: number }) => {
    const i = Math.round((r.max - rawTx) / r.step);
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    setTx(Math.max(r.min, Math.min(r.max, r.max - clamped * r.step)));
  }, [cards.length]);

  // Position on mount (rAF retry until laid out) and re-clamp on resize.
  const positioned = useRef(false);
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    let raf = 0;
    const init = () => {
      const r = measure();
      if (!r) {
        raf = requestAnimationFrame(init);
        return;
      }
      positioned.current = true;
      // right-gutter pins the FIRST card to the right edge, which is r.min
      setTx(alignEnd || (pinGutter && rightGutter) ? r.min : r.max);
    };
    raf = requestAnimationFrame(init);
    const ro = new ResizeObserver(() => {
      const r = measure();
      if (r && positioned.current) setTx((p) => Math.max(r.min, Math.min(r.max, p)));
    });
    ro.observe(vp);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure, alignEnd, pinGutter, rightGutter]);

  // Only play video cards while they're within the carousel viewport; pause the
  // rest so off-screen cards don't decode/playback needlessly (esp. on mobile).
  const videoKey = cards.map((c) => c.video ?? "").join("|");
  useEffect(() => {
    const root = vpRef.current;
    const vids = trackRef.current?.querySelectorAll<HTMLVideoElement>("video");
    if (!root || !vids || vids.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { root, threshold: 0.4 },
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [videoKey]);

  const stepBy = (d: number) => {
    const cur = Math.round((range.max - tx) / range.step);
    snap(range.max - (cur + d) * range.step, range);
  };

  const onDown = (e: React.PointerEvent) => {
    const r = measure() ?? range;
    drag.current = { x: e.clientX, tx, active: true, ...r };
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore — synthetic events / unsupported pointers */
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const raw = d.tx + (e.clientX - d.x);
    // rubber-band resistance past the clamped bounds
    const v = raw > d.max ? d.max + (raw - d.max) * 0.3 : raw < d.min ? d.min + (raw - d.min) * 0.3 : raw;
    setTx(v);
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    snap(tx, { min: drag.current.min, max: drag.current.max, step: drag.current.step });
  };

  const atStart = tx >= range.max - 1;
  const atEnd = tx <= range.min + 1;

  // Right-gutter renders the cards reversed so the featured card pins to the right.
  // The tx range in measure() is defined in that same mirrored space, so the arrows
  // keep the normal mapping — the left arrow advances into the cards peeking on the left.
  const displayCards = pinGutter && rightGutter ? [...cards].reverse() : cards;
  const goPrev = () => stepBy(-1);
  const goNext = () => stepBy(1);
  const prevOff = atStart;
  const nextOff = atEnd;

  return (
    <section data-nav-theme={theme} className={`relative py-16 md:py-24 ${bgClassName}`}>
      {bgImage && (
        <ImageWithFallback
          src={bgImage}
          srcSet={bgImageSrcSet}
          sizes={bgImageSizes}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className={`relative z-10 ${shellClass} mb-8 md:mb-12 text-center`}>
        <Head pre={pre} grad={grad} post={post} theme={theme} className="!text-[26px] md:!text-[38px]" />
        {sub && (
          <p className={`mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.6] md:text-[18px] ${t.sub}`}>
            {sub}
          </p>
        )}
      </div>
      <div
        ref={vpRef}
        className="relative z-10 overflow-hidden"
        style={{
          touchAction: "pan-y",
          marginLeft: pinGutter && !rightGutter ? gutter : undefined,
          marginRight: pinGutter && rightGutter ? gutter : undefined,
        }}
      >
        <div
          ref={trackRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={`flex select-none gap-6 pb-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translate3d(${tx}px,0,0)`,
            transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {displayCards.map((c) => (
            <motion.article
              key={c.title}
              data-card
              {...fadeUp}
              className="w-[80vw] shrink-0 md:w-[62vw] lg:w-[min(48vw,1040px)]"
            >
              {c.video || c.img ? (
                <div
                  className={`tile-scale relative overflow-hidden rounded-[22px] ${t.border}`}
                  style={{ aspectRatio: imgAspect }}
                >
                  {c.video ? (
                    <video
                      src={c.video}
                      poster={c.img}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={c.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.img}
                      srcSet={c.srcSet}
                      sizes={c.sizes}
                      alt={c.title}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              ) : (
                // placeholder until real imagery is supplied — Figma 113:3760 (#656565)
                <div className="rounded-[22px] bg-[#656565]" style={{ aspectRatio: imgAspect }} />
              )}
              <h3 className={`mt-6 text-[22px] md:text-2xl font-semibold ${t.title}`}>
                {c.title}
              </h3>
              <p className={`mt-3 max-w-[540px] text-[14px] md:text-[16px] leading-[1.6] ${t.body}`}>
                {c.body}
              </p>
              {c.note && (
                // per-card footnote — Figma 113:3785 (12px medium)
                <p className={`mt-3 max-w-[540px] text-[12px] font-medium leading-[1.6] ${t.note}`}>
                  {c.note}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
      {/* Nav row — pinGutter aligns the arrows to the featured card's right edge. */}
      <div
        className={`relative z-10 mt-2 flex items-center justify-end gap-3 ${pinGutter ? "" : shellClass}`}
        style={pinGutter ? { marginRight: gutter } : undefined}
      >
        <button
          onClick={goPrev}
          disabled={prevOff}
          aria-label="Previous"
          className={`cta-hover flex h-11 w-11 items-center justify-center rounded-full border ${t.navBtn} disabled:cursor-default disabled:opacity-30`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          disabled={nextOff}
          aria-label="Next"
          className={`cta-hover flex h-11 w-11 items-center justify-center rounded-full border ${t.navBtn} disabled:cursor-default disabled:opacity-30`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
