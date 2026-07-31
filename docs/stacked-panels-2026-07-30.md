# StackedPanels — layered sticky section transitions

**Date:** 2026-07-30
**Status:** Design approved, not yet implemented
**Component:** `components/sections/StackedPanels.tsx` (new)

## Goal

Sections that stack: as you scroll, the current full-viewport section holds in place
while the next one slides up *over* it. Reference:
[GSAP "Layered pinning with infinite looping"](https://demos.gsap.com/demo/infinite-looped-panels/).

Phase 1 ships the overlap only. Snapping and per-panel transition effects are
deliberately deferred (see [Phases](#phases)).

## Why not GSAP

The reference demo's overlap is four lines:

```js
panels.forEach((panel) => {
  ScrollTrigger.create({ trigger: panel, start: "top top", pin: true, pinSpacing: false });
});
```

`pin: true, pinSpacing: false` is ScrollTrigger reimplementing `position: sticky` with
`position: fixed` — the plugin predates broad sticky support. For full-viewport panels,
CSS `position: sticky; top: 0` produces the identical result.

Adopting GSAP would mean:

- ~70 KB gzipped (core + ScrollTrigger) on top of `motion`, which 27 files already import.
- A second scroll system: two independent rAF loops and two mental models, so anyone
  touching a scroll-driven section first has to work out which library it speaks.
- `position: fixed` pinning, which would put the navbar theming (below) at risk.

The rest of the reference demo — cloning panel 1 to the end, whole-page `snap()`, and a
non-passive `scroll` listener that `preventDefault()`s and teleports at the boundaries —
is the *infinite loop*. **That is explicitly out of scope.** It hijacks scroll and breaks
the scrollbar, deep links and back-button scroll restoration, which is unacceptable on a
marketing site whose job is letting people reach spec content.

**Decision: pure CSS, no new dependency.**

## Mechanism

Direct children of the container are each `position: sticky; top: 0; height: 100svh`.
Panel 1 sticks to the viewport; panel 2 arrives in normal flow and covers it; panel 2
then sticks and panel 3 covers it, and so on.

Later DOM siblings paint above earlier ones, so **no `z-index` is needed or wanted**.
All panels are positioned elements with `z-index: auto`, so document order alone
determines the stack. Introducing `z-index` on a panel would break this.

Panels stay in normal flow, so N panels produce N × 100svh of real document height.

## API

Two named exports, matching the `components/sections/` convention (named export,
`theme: "dark" | "light"` feeding `data-nav-theme`).

```tsx
<StackedPanels>
  <StackedPanel theme="dark" className="bg-black">
    <GX4KOpticsPanel />
  </StackedPanel>
  <StackedPanel theme="light" className="bg-white">…</StackedPanel>
  <StackedPanel theme="dark" className="bg-neutral-900">…</StackedPanel>
</StackedPanels>
```

- **`StackedPanels`** — wrapper `<div>`. Exists to be the shared parent, to supply
  `index`/`count` context, and (phase 2/3) to be the scroll-progress reference.
  Props: `children`, `className?`.
- **`StackedPanel`** — renders the `<section>`. Owns `sticky top-0 h-[100svh]` and
  `data-nav-theme`. Props: `theme`, `children`, `className?` (the panel background).

**Phase 1 is a server component — no `"use client"`.** It is the only file in
`components/sections/` that will not need it. Children may still be client components.
`"use client"` arrives only with phase 3.

### Explicit `<StackedPanel>`, not auto-wrapped children

`StackedPanels` does **not** wrap arbitrary children automatically. Auto-wrapping
requires cloning children to inject props, which breaks on fragments and mapped arrays
and makes `theme` implicit at the call site. The explicit child component is more
typing and is the chosen trade.

### `data-nav-theme` moves onto the panel

Every panel passes under the navbar in turn, so each declares its own theme.

`Navigation` samples the section under the header with
`document.elementsFromPoint(x, 40)` (`components/Navigation.tsx:107`) and walks up to the
nearest `[data-nav-theme]`. That is hit-testing, so it reads whatever is **visually
topmost** — stacked sticky panels resolve correctly with **no changes to `Navigation`**.
This is a specific advantage of sticky over a GSAP `position: fixed` pin.

### `index` / `count` context

`StackedPanels` provides each `StackedPanel` its zero-based `index` and the total
`count` via React context, **even though phase 1 does not read them**. Roughly six lines,
and it is the difference between phase 3 being additive and being a rewrite. See
[Phase 3](#phase-3--transition-effects).

## Hard contracts

The component cannot enforce these. They belong in the design doc and in a JSDoc block
on `StackedPanel`.

1. **Every panel must have an opaque background.** A transparent panel shows the stuck
   panel underneath and the effect reads as a rendering bug. This is the most common way
   the pattern is gotten wrong.
2. **Panels must be exactly one viewport tall — `height: 100svh`, never `min-height`.**
   A sticky element taller than the viewport sticks at `top: 0` immediately and its
   lower content can never be scrolled to; it is simply unreachable. "Does this content
   fit in one viewport?" therefore becomes a design constraint on anything placed in a
   panel. An escape hatch exists for taller panels (`top: calc(100svh - 100%)`,
   bottom-aligned sticky) — **out of scope for phase 1**, noted so it is not rediscovered
   as a bug.
3. **`100svh`, not `100vh`.** `svh` is the small-viewport unit, so panels are not clipped
   behind the mobile URL bar.

## Verification gate — do this first

**`app/globals.css:166` sets `overflow-x: hidden` on `body`.** An `overflow` ancestor is
the classic `position: sticky` killer. Modern browsers propagate body-level overflow up to
the viewport, which *should* leave sticky working — but that is not certain enough to
build on.

**Step 1 of implementation is a throwaway sticky `<div>`, verified in Chrome, Safari and
iOS Safari, before any component code is written.**

If it fails, the fix is one word — `overflow-x: clip`, which does not create a scroll
container. There is in-house precedent with an explanatory comment at
`app/globals.css:336`, so the change is consistent with the file and unlikely to be
reverted by someone tidying up.

## Known incompatibilities

**Do not place `ParallaxImage` — or any child measuring scroll via
`useScroll({ target: ref })` — inside a panel.** A stuck element's bounding rect stops
moving, so rect-derived scroll progress freezes at exactly the point the animation is
wanted. Same root cause as the phase 3 note below.

**No `prefers-reduced-motion` handling in phase 1, deliberately.** Nothing animates; the
panels are static and scrolling is the user's own input. Recorded here so the omission is
not read as an oversight and a no-op guard is not added. It becomes relevant in phase 3.

## What this preserves

Because panels stay in normal flow: the scrollbar, deep-link anchors and back-button
scroll restoration all behave normally, and `ScrollProgress` stays accurate. GSAP pinning
compromises several of these; the reference demo's boundary `preventDefault()` breaks the
rest.

## Phases

### Phase 1 — overlap (this spec)

`StackedPanels` + `StackedPanel`, pure CSS, server component, `index`/`count` context in
place but unused.

### Phase 2 — snap

`scroll-snap-type: y mandatory` plus `scroll-snap-align: start` per panel, behind a
`snap?: boolean` prop on `StackedPanels`. Purely additive; restructures nothing. Still
no GSAP.

**Open question for phase 2:** because panels sit in normal document flow, the scroll
container is the document — so `scroll-snap-type` has to go on `html`, not on the
`StackedPanels` wrapper. A component prop that reaches up and styles the root element is
awkward, and it makes snapping page-global rather than scoped to the panels. Resolve this
when phase 2 is picked up; it may argue for a page-level CSS class instead of a prop.
Also needs real testing on trackpads and iOS, where mandatory snap is easy to get wrong.

### Phase 3 — transition effects

Animating a panel as it is covered (fade, scale, blur).

**`useScroll({ target: panelRef })` will not work** — a stuck panel's rect stops moving,
so its progress freezes at the moment the animation is wanted.

**Instead: `StackedPanels` measures scroll progress once, on the container, and each panel
derives its own progress from that plus its `index`.** With `count` = N, panel `i` is being
covered across container progress `[i/N, (i+1)/N]`. One `useScroll`, one rAF loop, math per
panel — the same discipline `components/sections/ScrollScrubVideo.tsx` already uses. This
is what the phase 1 context exists to enable, and the phase where `"use client"` and
`prefers-reduced-motion` handling arrive.

## Verification

No test suite in this repo. Verification is `npm run build` plus driving the page in a
browser:

1. The sticky/`overflow-x` gate above, in Chrome, Safari and iOS Safari.
2. `npm run build` clean.
3. Scroll a page using the component and confirm the navbar theme flips correctly at each
   panel boundary.
4. Confirm the scrollbar, a deep-link anchor into a panel, and back-button scroll
   restoration all still behave.
