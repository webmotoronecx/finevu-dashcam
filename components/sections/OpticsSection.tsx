"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";

// "The Optics Behind the Image" pinned scroll-reveal; themeable and prop-driven so a second product can reuse it (needs <main> overflow-x-clip for the sticky pin)

const SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const emptySubscribe = () => () => {};

type Callout = { key: string; title: string; sub: string; items: string[] };
type LinePoint = { x1: number; y1: number; x2: number; y2: number };

const CALLOUTS: Callout[] = [
  {
    key: "front",
    title: "Front",
    sub: "UHD wide",
    items: ["SONY STARVIS IMX515", "8.5 MP sensor", "3840 × 2160 (4K UHD)", "136° field of view"],
  },
  {
    key: "core",
    title: "Core",
    sub: "Dual-core engine",
    items: ["Dual-core processor", "HDR auto night vision", "microSD up to 256 GB", "Format Free 2.0"],
  },
  {
    key: "rear",
    title: "Rear",
    sub: "Full-HD wide",
    items: ["2 MP CMOS sensor", "1920 × 1080 (Full HD)", "143° field of view", "23 g compact module"],
  },
];

/* Disjoint reveal windows over scrollYProgress — a..b fades the block, la..lb draws its line. */
const REVEAL = [
  { a: 0.1, b: 0.24, la: 0.12, lb: 0.28 },
  { a: 0.33, b: 0.47, la: 0.35, lb: 0.51 },
  { a: 0.56, b: 0.7, la: 0.58, lb: 0.74 },
];

/* Position of each callout over the full-bleed stage (GX4K cosmic composite). */
const OVERLAY_POS: Record<string, string> = {
  front: "left-[2%] top-[19%]",
  core: "left-[16%] bottom-[11%]",
  rear: "right-[2%] bottom-[8%]",
};

/* Connector-line endpoints in the stage's own 1920×1080 space (block → camera). */
const LINES: Record<string, LinePoint> = {
  front: { x1: 500, y1: 400, x2: 778, y2: 560 },
  core: { x1: 770, y1: 730, x2: 880, y2: 612 },
  rear: { x1: 1410, y1: 760, x2: 1298, y2: 748 },
};

// Theme tokens: dark (GX4K default) vs light (GX35)
type OpticsTheme = {
  nav: "dark" | "light";
  sectionBg: string;
  headTitle: string;
  headSub: string;
  calloutTitle: string;
  calloutSub: string;
  calloutLine: string;
  calloutItem: string;
  lineStops: { offset: string; color: string }[];
  scrim: string | null;
};

const THEMES: Record<"dark" | "light", OpticsTheme> = {
  dark: {
    nav: "dark",
    sectionBg: "",
    headTitle: "text-white",
    headSub: "text-[#c8ccd8]",
    calloutTitle: "text-[#f5f3f0]",
    calloutSub: "text-[#6e8fe6]",
    calloutLine: "linear-gradient(90deg, #ffffff 0%, #6e8fe6 55%, #4f2d74 100%)",
    calloutItem: "text-white",
    lineStops: [
      { offset: "0%", color: "#ffffff" },
      { offset: "55%", color: "#6e8fe6" },
      { offset: "100%", color: "#4f2d74" },
    ],
    // legibility scrims: darker at the top (title) and the callout corners
    scrim:
      "linear-gradient(180deg, rgba(8,8,12,0.72) 0%, rgba(8,8,12,0.12) 22%, rgba(8,8,12,0) 40%), linear-gradient(115deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 32%, rgba(0,0,0,0) 52%), linear-gradient(300deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0) 50%)",
  },
  light: {
    nav: "light",
    sectionBg: "bg-white",
    headTitle: "text-[#1d1d1f]",
    headSub: "text-[#6e6e73]",
    calloutTitle: "text-[#1d1d1f]",
    calloutSub: "text-[#f68428]",
    calloutLine: "linear-gradient(90deg, #ffb682 0%, #f68428 65%, #f68428 100%)",
    calloutItem: "text-[#1d1d1f]",
    lineStops: [
      { offset: "0%", color: "#d3d3da" },
      { offset: "100%", color: "#a9a9b4" },
    ],
    scrim: null,
  },
};

/* One callout block — shared by the desktop overlay and the mobile stack. */
function CalloutCard({ data, t }: { data: Callout; t: OpticsTheme }) {
  return (
    <div className="w-[248px] xl:w-[300px]">
      <p className={`text-[28px] font-semibold leading-none xl:text-[34px] ${t.calloutTitle}`}>{data.title}</p>
      <p className={`mt-1.5 text-[12px] font-semibold tracking-wide xl:text-[13.6px] ${t.calloutSub}`}>{data.sub}</p>
      <div className="mt-3 h-px w-full" style={{ backgroundImage: t.calloutLine }} />
      <ul className="mt-3.5 space-y-1.5">
        {data.items.map((it) => (
          <li key={it} className={`text-[13px] font-medium xl:text-[14.4px] ${t.calloutItem}`}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

type OpticsHeadCopy = { title: string; subtitle: string };

const DEFAULT_HEAD: OpticsHeadCopy = {
  title: "The Optics Behind the Image.",
  subtitle:
    "Sony STARVIS IMX515. A precision-engineered 8.5-megapixel sensor paired with F/1.8 wide-aperture glass, made to perform when it matters most.",
};

function OpticsHead({ head, t, className = "" }: { head: OpticsHeadCopy; t: OpticsTheme; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className={`text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[42px] ${t.headTitle}`}>
        {head.title}
      </h2>
      <p className={`mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.6] md:text-[18px] ${t.headSub}`}>
        {head.subtitle}
      </p>
    </div>
  );
}

// Full-bleed stage media; a null/empty image renders the placeholder box
function StageMedia({ image }: { image: string | null }) {
  if (!image) return <div className="h-full w-full bg-[#656565]" />;
  return (
    <Image
      src={image}
      alt="FineVu front and rear cameras"
      fill
      sizes="100vw"
      className="object-cover"
    />
  );
}

export function OpticsSection({
  callouts = CALLOUTS,
  head = DEFAULT_HEAD,
  image = "/gx4k/optics.webp",
  theme = "dark",
  overlayPos = OVERLAY_POS,
  lines = LINES,
  stageAspect = "16/9",
  lineViewBox = "0 0 1920 1080",
}: {
  callouts?: Callout[];
  head?: OpticsHeadCopy;
  image?: string | null;
  theme?: "dark" | "light";
  overlayPos?: Record<string, string>;
  lines?: Record<string, LinePoint>;
  stageAspect?: string;
  lineViewBox?: string;
} = {}) {
  const t = THEMES[theme];

  // Gate reduced-motion behind mount so SSR and first client render match.
  const prefersReduced = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduce = mounted && prefersReduced;

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const lineLen = useRef<number[]>([]);

  const { scrollYProgress } = useScroll({
    // pinned desktop layouts scrub the callout/line reveal across the tall track; reduced-motion is static so it has no target
    target: reduce ? undefined : trackRef,
    offset: ["start start", "end end"],
  });

  // Write the reveal state straight to the DOM — instant, locked to the scrollbar.
  const paint = useCallback((p: number) => {
    REVEAL.forEach((r, i) => {
      const t = clamp((p - r.a) / (r.b - r.a), 0, 1);
      const card = cardRefs.current[i];
      if (card) {
        card.style.opacity = String(t);
        card.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`;
      }
      const line = lineRefs.current[i];
      if (line) {
        const tl = clamp((p - r.la) / (r.lb - r.la), 0, 1);
        line.style.strokeDashoffset = String((lineLen.current[i] || 0) * (1 - tl));
        line.style.opacity = tl > 0 ? "1" : "0";
      }
    });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", paint);

  useEffect(() => {
    if (reduce) return;
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const len = line.getTotalLength();
      lineLen.current[i] = len;
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
    });
    paint(scrollYProgress.get());
  }, [reduce, paint, scrollYProgress]);

  // Reduced motion: static, fully visible, no pin
  if (reduce) {
    return (
      <section data-nav-theme={t.nav} className={`py-16 md:py-24 ${t.sectionBg}`}>
        <div className={SHELL}>
          <OpticsHead head={head} t={t} />
          <div
            className="relative mt-10 w-full overflow-hidden rounded-[24px]"
            style={{ aspectRatio: stageAspect }}
          >
            <StageMedia image={image} />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {callouts.map((c) => (
              <CalloutCard key={c.key} data={c} t={t} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* image + scrims + connector lines + callouts — shared by both desktop stage wrappers */
  const stageInner = (
    <>
      <StageMedia image={image} />

      {/* legibility scrims — dark themes only */}
      {t.scrim && (
        <div className="pointer-events-none absolute inset-0" style={{ background: t.scrim }} />
      )}

      {/* connector lines — hidden while the stage is a placeholder */}
      {image && (
        <svg
          viewBox={lineViewBox}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="optics-line" x1="0" y1="0" x2="1" y2="1">
              {t.lineStops.map((s) => (
                <stop key={s.offset} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>
          {callouts.map((c, i) => {
            const ln = lines[c.key];
            if (!ln) return null;
            return (
              <line
                key={c.key}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                x1={ln.x1}
                y1={ln.y1}
                x2={ln.x2}
                y2={ln.y2}
                stroke="url(#optics-line)"
                strokeWidth={1.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ opacity: 0 }}
              />
            );
          })}
        </svg>
      )}

      {/* callout blocks, revealed imperatively */}
      {callouts.map((c, i) => (
        <div
          key={c.key}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className={`absolute ${overlayPos[c.key]} will-change-transform`}
          style={{ opacity: 0 }}
        >
          <CalloutCard data={c} t={t} />
        </div>
      ))}
    </>
  );

  return (
    <section data-nav-theme={t.nav} className={t.sectionBg}>
      {/* Mobile / tablet (< lg): image then stacked callouts */}
      <div className="py-16 md:py-24 lg:hidden">
        <div className={SHELL}>
          <OpticsHead head={head} t={t} />
          <div
            className="relative mt-10 w-full overflow-hidden rounded-[24px]"
            style={{ aspectRatio: stageAspect }}
          >
            <StageMedia image={image} />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {callouts.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <CalloutCard data={c} t={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop (>= lg): pinned scroll-reveal; only the stage sizing differs between GX4K and the light product photo */}
      <div ref={trackRef} className="relative hidden h-[360vh] lg:block">
        <div className={`sticky top-0 h-[100dvh] w-full overflow-hidden ${t.sectionBg}`}>
          <div
            className={`absolute inset-x-0 w-full -translate-y-1/2 ${
              // anchored a touch low for breathing room between the copy and the product photo
              theme === "light" ? "top-[57%]" : "top-1/2"
            }`}
            style={{ aspectRatio: stageAspect }}
          >
            {stageInner}
          </div>
          <OpticsHead head={head} t={t} className="absolute inset-x-0 top-[13%] px-6" />
        </div>
      </div>
    </section>
  );
}
