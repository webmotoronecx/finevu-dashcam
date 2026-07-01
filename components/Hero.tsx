"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import { Pause, Play } from "lucide-react";
import Link from "next/link";

type Slide = {
  eyebrow: string;
  title: string;
  sub: string;
  primary: { href: string; label: string };
};

// Hero carousel — product/feature focused slides.
const slides: Slide[] = [
  {
    eyebrow: "FINEVU GX4K · 2-CHANNEL UHD",
    title: "GX4K",
    sub: "The clearest view of the road you've ever recorded — front and rear.",
    primary: { href: "/gx4k", label: "Explore" },
  },
  {
    eyebrow: "FINEVU GX35 · 2-CHANNEL 2K",
    title: "GX35",
    sub: "Premium FineVu protection at a more accessible price — the same trusted engineering.",
    primary: { href: "/gx35", label: "Explore" },
  },
  {
    eyebrow: "ADAS · SAFETY SYSTEM",
    title: "Drive protected",
    sub: "Lane departure, forward-collision and parking surveillance — your co-pilot on every drive.",
    primary: { href: "/how-it-works", label: "Explore" },
  },
  {
    eyebrow: "24/7 · PARKING MODE",
    title: "Always watching",
    sub: "Smart Sense surveillance records impacts and motion, even when you're away.",
    primary: { href: "/how-it-works", label: "Explore" },
  },
];

const SLIDE_MS = 6000;

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_MS);
    return () => clearInterval(id);
  }, [paused, next, active]);

  const slide = slides[active];

  return (
    <section className="relative w-full px-4 md:px-8 lg:px-[5.5vw] pt-3 md:pt-4 pb-3 lg:pb-[1vw]" data-nav-theme="dark">
      <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] min-h-[80vh] lg:min-h-[max(580px,40vw)] flex items-center justify-center">
        {/* Image placeholder — solid #656565 box per Figma. Client to supply art. */}
        <div className="absolute inset-0 bg-[#656565]" />

        {/* Slide content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-8 lg:px-16 text-center pt-28 md:pt-24 pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-[var(--finevu-orange)] font-semibold text-xs md:text-sm tracking-[0.22em] uppercase mb-5">
                {slide.eyebrow}
              </p>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight leading-[1.02] mb-6">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed mb-10">
                {slide.sub}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={slide.primary.href} className="w-full sm:w-auto">
                  <motion.button
                    className="cta-hover w-full sm:w-auto px-10 py-3.5 rounded-full bg-[var(--finevu-orange)] text-white font-semibold text-sm uppercase tracking-wider smooth-transition"
                  >
                    {slide.primary.label}
                  </motion.button>
                </Link>
                <Link href="/where-to-buy" className="w-full sm:w-auto">
                  <motion.button
                    className="cta-hover w-full sm:w-auto px-10 py-3.5 rounded-full border border-white/40 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Find Retailer
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls */}
        <div className="absolute bottom-8 md:bottom-10 left-0 right-0 z-20 flex items-center justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group h-2 flex items-center"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-12 bg-[var(--finevu-orange)]"
                    : "w-12 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="ml-3 text-white/60 hover:text-white transition-colors"
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}
