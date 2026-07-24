"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion, useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";

export type BarGraphTheme = "dark" | "light";

// Brand accent gradient — identical to the active FeatureTabs pill so bars read on-brand.
const THEME: Record<
    BarGraphTheme,
    { bar: string; value: string; label: string; panelBg: string; panelBorder: string }
> = {
    dark: {
        bar: "linear-gradient(90deg, #4f2d74 0%, #6284d8 100%)",
        value: "text-[#6284d8]",
        label: "text-white/70",
        panelBg: "rgba(6, 6, 6, 0.7)",
        panelBorder: "1px solid rgba(0, 0, 0, 0.06)",
    },
    light: {
        bar: "linear-gradient(90deg, #ffb682 0%, #f68428 65%, #f68428 100%)",
        value: "text-[#f68428]",
        label: "text-[#6E6E73]",
        panelBg: "rgba(255, 255, 255, 0.7)",
        panelBorder: "1px solid #ececf0",
    },
};

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
    theme = "dark",
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
    theme?: BarGraphTheme;
}) {
    const t = THEME[theme];
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
    const glassStyle = {
        background: t.panelBg,
        border: t.panelBorder,

        backdropFilter: "blur(10px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        transition: "background 250ms ease, border-color 250ms ease",
    };
    return (
        <div style={glassStyle} className="mx-auto w-full max-w-[800px] rounded-[32px] p-4 md:px-10 md:py-8">
            <div ref={ref} className={`${multi ? "grid gap-x-4 gap-y-4" : "flex flex-col gap-3"} ${className}`} style={gridStyle}>
                {data.map((d, i) => {
                    const pct = `${Math.min(100, (d.value / cap) * 100)}%`;
                    return (
                        <div key={d.label}>
                            {/* Bar + value; the number hugs the end of each bar. The bar is capped so it
                never crowds the number gutter, keeping every value's proportion intact. */}
                            <div className="flex items-center space-between">
                                <motion.div
                                    className="h-2 min-w-[8px] max-w-[calc(100%-3.5rem)] rounded-full"
                                    style={{ background: t.bar }}
                                    initial={animate ? { width: 0 } : false}
                                    animate={{ width: animate ? (inView ? pct : 0) : pct }}
                                    transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <span className={`ml-3 shrink-0 text-[16px] font-semibold ${t.value}`}>
                                    {animate ? <AnimatedCounter end={d.value} suffix={suffix} /> : `${d.value}${suffix}`}
                                </span>
                            </div>
                            <p className={`mt-0 text-[13px] md:text-[15px] ${t.label}`}>{d.label}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
