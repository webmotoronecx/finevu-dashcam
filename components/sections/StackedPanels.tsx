import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Layered sticky panels — each panel holds at the top of the viewport while the
 * next one slides up over it. See `docs/stacked-panels-2026-07-30.md`.
 *
 * This is deliberately CSS-only (`position: sticky`), not GSAP ScrollTrigger's
 * `pin: true, pinSpacing: false` — that pin *is* a reimplementation of sticky.
 * Panels stay in normal flow, so the scrollbar, deep links, back-button scroll
 * restoration and `ScrollProgress` all keep working.
 *
 * No `"use client"`: phase 1 renders on the server. Children may be client
 * components.
 */
export function StackedPanels({ children, className = "" }: { children: ReactNode; className?: string }) {
    const panels = Children.toArray(children).filter(isValidElement);

    return (
        <div className={className}>
            {panels.map((panel, index) =>
                // `index`/`count` are unused in phase 1 and exist for the phase 3
                // transition effects: a stuck panel's rect stops moving, so per-panel
                // progress must be derived from the container's progress plus the
                // index — never from `useScroll({ target: panelRef })`.
                cloneElement(panel as ReactElement<StackedPanelProps>, { index, count: panels.length }),
            )}
        </div>
    );
}

type StackedPanelProps = {
    /** Feeds `data-nav-theme`, which `Navigation` samples via `elementsFromPoint`. */
    theme: "dark" | "light";
    children: ReactNode;
    /**
     * The panel background. **Required in practice** — a transparent panel shows
     * the stuck panel underneath and reads as a rendering bug.
     */
    className?: string;
    /** Injected by `StackedPanels`. Do not pass by hand. */
    index?: number;
    /** Injected by `StackedPanels`. Do not pass by hand. */
    count?: number;
};

/**
 * One full-viewport panel.
 *
 * Contracts the component cannot enforce:
 * 1. Give it an opaque background via `className`.
 * 2. Its content must fit in one viewport. The height is exactly `100svh`, never
 *    `min-height` — a sticky element taller than the viewport sticks immediately
 *    and its lower content can never be scrolled to.
 * 3. Do not nest anything that measures scroll off its own rect
 *    (`ParallaxImage`, `MediaSection` with `pin`), because a stuck rect stops moving.
 *
 * No `z-index` here or on children: all panels are positioned with `z-index: auto`,
 * so document order alone stacks them. Adding `z-index` breaks that.
 */
export function StackedPanel({ theme, children, className = "" }: StackedPanelProps) {
    return (
        <section data-nav-theme={theme} className={`sticky top-0 h-[100svh] overflow-hidden ${className}`}>
            {children}
        </section>
    );
}
