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
    /** Files backing this tab (e.g. a manual per language, or several firmware builds).
        Rendered as a picker above the instructions: a <select> when there is more than
        one, then the selected file's version/date and a download button. Order matters —
        index 0 is treated as the latest.

        An EMPTY array HIDES the whole tab — that is how a tab says "this download exists
        but we don't have the file yet". Omit the prop entirely for a content-only tab,
        which always shows. If every tab is hidden the section renders nothing. */
    downloads?: DownloadFile[];
};

export type DownloadFile = {
    /** Option text in the picker, e.g. "GX4K Firmware". */
    label: string;
    /** Version and/or date shown under the picker, e.g. "V1.00.001 (2025-08-20)".
        Falls back to `label` when absent. */
    version?: string;
    href: string;
    /** Lowercase hex SHA-256 of the file, shown so a customer can verify the download.
        Omit to hide the checksum line entirely. */
    sha256?: string;
};

const TOKENS: Record<Theme, {
    tabRow: string;
    tabIdle: string;
    panel: string;
    heading: string;
    body: string;
    steps: string;
    select: string;
}> = {
    dark: {
        tabRow: "border border-white/10",
        tabIdle: "text-zinc-400 hover:text-white",
        panel: "bg-white/[0.03]",
        heading: "text-white",
        body: "text-zinc-400",
        steps: "text-zinc-400",
        select: "border-white/15 bg-white/[0.04] text-white",
    },
    light: {
        tabRow: "border border-[#e3e3e6] bg-[#eaeaea]",
        tabIdle: "text-[#6E6E73] hover:text-[#1D1D1F]",
        panel: "bg-[#eaeaea]",
        heading: "text-[#1D1D1F]",
        body: "text-[#6E6E73]",
        steps: "text-[#6E6E73]",
        select: "border-[#d5d5d8] bg-white text-[#1D1D1F]",
    },
};

/* File picker: choose a build, see its version/date, download it. The <select> only
   appears when there is a genuine choice — a single file renders just the version line
   and the button. Mounted with a key per tab so the selection resets when tabs change. */
function DownloadPicker({ files, theme }: { files: DownloadFile[]; theme: Theme }) {
    const [i, setI] = useState(0);
    const t = TOKENS[theme];
    const file = files[i] ?? files[0];

    // Empty lists are handled by the panel, which replaces the whole tab with "Coming soon".
    if (!file) return null;

    return (
        <div className="mb-8 flex flex-col items-start gap-4">
            {files.length > 1 && (
                <select
                    value={i}
                    onChange={(e) => setI(Number(e.target.value))}
                    aria-label="Select a file to download"
                    className={`min-h-[44px] w-full max-w-[320px] rounded-xl border px-4 py-2.5 text-[14px] font-medium outline-none transition-colors focus:border-[#f68428] ${t.select}`}
                >
                    {files.map((f, idx) => (
                        <option key={f.href} value={idx}>
                            {f.label}
                        </option>
                    ))}
                </select>
            )}

            <div>
                {/* Index 0 is the latest build, so only that one claims to be. */}
                <div className={`text-[14px] ${t.body}`}>{i === 0 ? "Latest Version/Date" : "Version/Date"}</div>
                <div className={`mt-1 text-[22px] font-semibold ${t.heading}`}>{file.version ?? file.label}</div>
                <a
                    href={file.href}
                    download
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#f68428] px-6 py-3 text-[14px] font-semibold uppercase tracking-wide text-[#f68428] transition-colors hover:bg-[#f68428] hover:text-white"
                >
                    <Download className="h-4 w-4" strokeWidth={2} />
                    Download
                </a>

                {/* Integrity check. Firmware is executable code for a device, so a corrupted
                    or substituted file can brick a camera — this lets a customer confirm the
                    bytes before flashing. `break-all` because a 64-char hex string has no
                    break opportunities and would otherwise overflow on mobile. */}
                {file.sha256 && (
                    <div className={`mt-4 max-w-[420px] text-[12px] leading-relaxed ${t.body}`}>
                        <span className="font-semibold uppercase tracking-wide">SHA-256</span>
                        <code className="mt-1 block break-all font-mono text-[11px]">{file.sha256}</code>
                    </div>
                )}
            </div>
        </div>
    );
}

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

    /* A tab that declares `downloads` but has no file yet is dropped from the switcher —
       an empty tab is worse than no tab. Tabs that omit `downloads` entirely are
       content-only and always show. */
    const visible = tabs.filter((tab) => tab.downloads === undefined || tab.downloads.length > 0);

    // Nothing downloadable at all — render no section rather than an empty shell.
    if (visible.length === 0) return null;

    // `active` can outrun the list if the data shrinks; clamp instead of crashing.
    const current = visible[Math.min(active, visible.length - 1)];

    return (
        <section data-nav-theme={theme} className={`pb-16 md:pb-24 ${className}`}>
            <div className={`${SHELL} !max-w-[1050px] flex flex-col gap-10`}>
                {/* One tab is not a choice — drop the pill bar and title the section instead.
                    Two or more, and the switcher earns its place. */}
                {visible.length === 1 ? (
                    <div className="text-center">
                    <h2 className={`text-[26px] font-semibold md:text-[32px] ${t.heading}`}>{current.name}</h2>
                    </div>
                ) : (
                    <div className={`flex w-full rounded-full p-1 ${t.tabRow}`} role="tablist" aria-label={ariaLabel}>
                        {visible.map((item, i) => (
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
                )}


                {/* Panel */}
                {/* Only a real switcher makes this a tabpanel; with a plain title it is just
                    a region, and claiming tabpanel without a tablist misleads screen readers. */}
                <div
                    className={`w-full rounded-[32px] px-5 py-10 sm:px-10 md:rounded-[46px] md:px-14 md:py-16 ${t.panel}`}
                    role={visible.length === 1 ? "region" : "tabpanel"}
                    aria-label={visible.length === 1 ? ariaLabel : undefined}
                >
                    {/* Picker sits above the instructions — pick the build first, read how to
                        install it second. Keyed by tab so switching tabs resets the selection. */}
                    {current.downloads && (
                        <div className="pb-6">
                            <DownloadPicker key={current.name} files={current.downloads} theme={theme} />
                        </div>
                    )}

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

                    {/* Legacy single CTA — `downloads` above supersedes it, but tabs that set
                        only downloadLabel still render their one button here. */}
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
