import type { CSSProperties, ReactNode } from "react";

/**
 * Slides this section up over the **pinned `MediaSection` immediately above it**, so the
 * outgoing frame is covered rather than scrolled past. Pure CSS — a negative top margin,
 * no JS, no scroll listener. Pairs with that section's `exitFade`, which dissolves the
 * frame underneath while this rides over it.
 *
 * `relative` is load-bearing: the frame above is `sticky` (a positioned element), so an
 * unpositioned band would paint *under* it. As siblings with `z-index: auto`, document
 * order then puts this on top — no `z-index` anywhere, deliberately.
 *
 * **Give it an opaque background** (via `className` or `style`). A transparent band lets
 * the frame beneath show through and the cover reads as a rendering bug.
 *
 * See `docs/stacked-panels-2026-07-30.md`.
 */
export function CoverTransition({
    pinHeightVh,
    start,
    theme = "dark",
    className = "",
    style,
    children,
}: {
    /**
     * `pinHeightVh` of the pinned section above — needed to convert `start` into a
     * distance. The pin window is `pinHeightVh - 100`, because the sticky frame is one
     * viewport tall inside that track.
     */
    pinHeightVh: number;
    /**
     * Where this band's leading edge reaches the viewport bottom, as a fraction of the
     * pin window above (0 = the frame locks, 1 = it releases).
     *
     * **Same 0–1 scale as that section's `exitFade.start`/`end`**, which is the point:
     * set it between them and the band covers while the frame is still dissolving; set
     * it at `exitFade.end` and the frame finishes fading before anything covers it.
     */
    start: number;
    /** Feeds `data-nav-theme`. */
    theme?: "dark" | "light";
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}) {
    const pinWindowVh = Math.max(pinHeightVh - 100, 1);
    const coverVh = Math.round((1 - Math.min(Math.max(start, 0), 1)) * pinWindowVh);

    return (
        <div
            data-nav-theme={theme}
            // The offset rides in as a custom property because a Tailwind arbitrary value
            // has to be a static string. Keeping it in the *class* rather than an inline
            // `marginTop` is what preserves the `lg:` scoping — which matters because the
            // section above uses `pinOnMobile: false`, so below `lg` there is no pin and
            // overlapping an unpinned section would just eat its content.
            className={`relative lg:mt-(--cover-mt) ${className}`}
            style={{ "--cover-mt": `-${coverVh}vh`, ...style } as CSSProperties}
        >
            {children}
        </div>
    );
}
