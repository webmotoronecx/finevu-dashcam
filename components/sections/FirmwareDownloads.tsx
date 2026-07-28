"use client";

import { useState } from "react";
import { Download } from "lucide-react";

/* Firmware / downloads tabbed panel shared by the GX4K and GX35 product pages.
   Fully data-driven: the page passes a `tabs` array (each item carries its own
   name + content), and the component owns the tab state, theming, and the
   download CTA. Sets `data-nav-theme` from `theme` so the navbar-contrast
   convention travels with the section. */

const SHELL = "mx-auto w-full max-w-[1280px] px-6 lg:px-10";
const ORANGE = "#f68428";

type Theme = "dark" | "light";

export type FirmwareTab = {
    /** Tab label shown in the switcher. */
    name: string;
    /** Panel heading. */
    heading?: string;
    /** Intro paragraph rendered above steps/body. */
    intro?: string;
    /** Numbered instruction steps. */
    steps?: string[];
    /** Red warning line rendered below the steps. */
    warning?: string;
    /** Free-form themed body (alternative to `steps`). */
    body?: React.ReactNode;
    /** Download CTA label. Omit to hide the button for this tab. */
    downloadLabel?: string;
    /** Download CTA link. Defaults to /support. */
    downloadHref?: string;
};

const TOKENS: Record<Theme, {
    tabRow: string;
    tabIdle: string;
    panel: string;
    heading: string;
    body: string;
    steps: string;
}> = {
    dark: {
        tabRow: "border border-white/10",
        tabIdle: "text-zinc-400 hover:text-white",
        panel: "bg-white/[0.03]",
        heading: "text-white",
        body: "text-zinc-400",
        steps: "text-zinc-400",
    },
    light: {
        tabRow: "border border-[#e3e3e6] bg-[#eaeaea]",
        tabIdle: "text-[#6E6E73] hover:text-[#1D1D1F]",
        panel: "bg-[#eaeaea]",
        heading: "text-[#1D1D1F]",
        body: "text-[#6E6E73]",
        steps: "text-[#6E6E73]",
    },
};

export function FirmwareDownloads({
    tabs,
    theme = "dark",
    ariaLabel = "Downloads",
    className = "",
}: {
    /** Tabs to render — each with its own name and content. */
    tabs: FirmwareTab[];
    theme?: Theme;
    /** Accessible label for the tablist. */
    ariaLabel?: string;
    className?: string;
}) {
    const [active, setActive] = useState(0);
    const t = TOKENS[theme];
    const current = tabs[active];

    return (
        <section data-nav-theme={theme} className={`pb-16 md:pb-24 ${className}`}>
            <div className={`${SHELL} !max-w-[1050px] flex flex-col gap-10`}>
                {/* Tab switcher */}
                <div className={`flex w-full rounded-full p-1 ${t.tabRow}`} role="tablist" aria-label={ariaLabel}>
                    {tabs.map((item, i) => (
                        <button
                            key={item.name}
                            role="tab"
                            aria-selected={active === i}
                            onClick={() => setActive(i)}
                            className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                                active === i ? "text-white" : t.tabIdle
                            }`}
                            style={active === i ? { backgroundColor: ORANGE } : undefined}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Panel */}
                <div className={`w-full rounded-[32px] px-5 py-10 sm:px-10 md:rounded-[46px] md:px-14 md:py-16 ${t.panel}`} role="tabpanel">
                    {current.heading && (
                        <h3 className={`text-lg font-semibold ${t.heading}`}>{current.heading}</h3>
                    )}

                    {current.intro && (
                        <p className={`mt-4 text-[14px] leading-relaxed ${t.body}`}>{current.intro}</p>
                    )}

                    {current.steps && (
                        <ol className={`mt-4 list-decimal space-y-2.5 pl-5 text-[14px] leading-relaxed ${t.steps}`}>
                            {current.steps.map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                        </ol>
                    )}

                    {current.warning && (
                        <p className="mt-5 text-[13px] text-[#e5484d]">{current.warning}</p>
                    )}

                    {current.body && (
                        <div className={`mt-4 text-[14px] leading-relaxed ${t.body}`}>{current.body}</div>
                    )}

                    {current.downloadLabel && (
                        <a
                            href={current.downloadHref ?? "/support"}
                            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: ORANGE }}
                        >
                            <Download className="h-4 w-4" strokeWidth={2} />
                            {current.downloadLabel}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
