"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion, useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";

// Brand accent gradient — identical to the active FeatureTabs pill so bars read on-brand.
const BAR_GRADIENT = "linear-gradient(90deg, #4f2d74 0%, #6284d8 100%)";

export type BarDatum = { label: string; value: number };

/**
 * Horizontal proportional bar graph: gradient pill bars whose length maps to `value`,
 * the number at the end of each bar and the label beneath it. Bare/embeddable — no
 * section chrome. Bars grow and numbers count up on scroll into view.
 */
export function BarGraph({
  data,
  max,
  suffix = "",
  animate = true,
  columns = 1,
  className = "",
}: {
  data: BarDatum[];
  /** Value that maps to a full-width bar. Defaults to the largest value in `data`. */
  max?: number;
  /** Unit shown after each number, e.g. "GB" or "%". */
  suffix?: string;
  /** Grow bars + count numbers up on scroll into view (default true). */
  animate?: boolean;
  /** Lay the bars out across this many columns (fills top-to-bottom). Default 1. */
  columns?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cap = max ?? Math.max(...data.map((d) => d.value), 1);
  const multi = columns > 1;
  // Column-major fill: each column fills top-to-bottom before the next. Rows are the
  // ceiling of items / columns so the last column can be short.
  const gridStyle: CSSProperties | undefined = multi
    ? {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${Math.ceil(data.length / columns)}, auto)`,
        gridAutoFlow: "column",
      }
    : undefined;

  return (
    <div
      ref={ref}
      className={`${multi ? "grid gap-x-4 gap-y-6" : "flex flex-col gap-3"} ${className}`}
      style={gridStyle}
    >
      {data.map((d, i) => {
        const pct = `${Math.min(100, (d.value / cap) * 100)}%`;
        return (
          <div key={d.label}>
            {/* Bar + value; the number hugs the end of each bar. The bar is capped so it
                never crowds the number gutter, keeping every value's proportion intact. */}
            <div className="flex items-center space-between">
              <motion.div
                className="h-2 min-w-[8px] max-w-[calc(100%-3.5rem)] rounded-full"
                style={{ background: BAR_GRADIENT }}
                initial={animate ? { width: 0 } : false}
                animate={{ width: animate ? (inView ? pct : 0) : pct }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="ml-3 shrink-0 text-[16px] font-semibold text-[#6284d8]">
                {animate ? <AnimatedCounter end={d.value} suffix={suffix} /> : `${d.value}${suffix}`}
              </span>
            </div>
            <p className="mt-0 text-[13px] md:text-[15px] text-white/70">{d.label}</p>
          </div>
        );
      })}
    </div>
  );
}
