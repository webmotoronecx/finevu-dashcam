# StackedPanels — layered sticky section transitions

**Date:** 2026-07-30
**Status:** Component built. Verification gate **passed**. Not yet used by any page —
the first intended application (`/gx4k`) turned out to need a different technique; see
[Applied instead: the /gx4k cover transition](#applied-instead-the-gx4k-cover-transition).
**Component:** `components/sections/StackedPanels.tsx`

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

**Result (2026-08-02): PASSED — no change to `globals.css` needed.** Verified in Chrome at
1920×854 against a throwaway `/sticky-gate` route (since deleted):

- Panel 1 pinned at `top: 0` where an unsticky element would have been at −816px.
- All three panels `position: sticky`, `z-index: auto`.
- Navbar flipped `dark → light` as panels passed under it, with **no changes to
  `Navigation`** — `elementsFromPoint` resolves the visually-topmost stuck panel as
  predicted.

`body` is `overflow-x: hidden` and `html` is `visible`, so the browser's
overflow-propagation-to-viewport behaviour holds and sticky is unaffected. The
contingency below was therefore not needed, but is kept in case a future change
introduces a genuine `overflow` ancestor:

> If sticky ever breaks, the fix is one word — `overflow-x: clip`, which does not create
> a scroll container. There is in-house precedent with an explanatory comment at
> `app/globals.css:336`.

**Still unverified: Safari and iOS Safari.** Only Chrome was available. Re-check before
shipping any page that uses the component.

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

## Applied instead: the /gx4k cover transition

The component was built for the seam between **Discreet by Design** and **Designed to
Disappear** on `/gx4k`. Measuring both at 854px viewport showed neither can be a
`StackedPanel`:

| Section | Measured | Why it fails |
| --- | --- | --- |
| Discreet by Design | 2.5 viewports | Already a sticky pin (see below) |
| Designed to Disappear | 2.79 viewports | Violates the one-viewport contract |

**Discreet by Design was already an instance of this pattern.** `MediaSection` with
`pin: true` (`components/sections/MediaSection.tsx:841-851`) renders a `pinHeightVh`-tall
scroll track wrapping a `sticky top-0 h-[100dvh]` child — the same mechanism, hand-rolled,
with the video scrub reading `useScroll` off that track. Wrapping it in a 100svh panel
would have collapsed the track, destroyed the scrub runway and nested sticky in sticky.

**Designed to Disappear cannot be a panel at all.** It is a gradient band holding
`FeatureTabs` (1.21vh) plus the "Small in Size" gallery (1.58vh). Forcing 100svh makes
~64% of it permanently unreachable. Not fixable by tuning — the content does not fit one
screen.

**What shipped instead** is a pure-CSS cover transition that leaves both sections intact:
the band slides up over the still-pinned frame.

- **`components/sections/CoverTransition.tsx`** (new) — wraps the covering band and owns
  the offset. Pure CSS, no JS, no scroll listener.
- `mDiscreet` — `pinHeightVh` 250 → **350** to buy a cover window, with
  `videoScrubStart` 0.2 → **0.12** and `videoScrubEnd` re-derived so the video's timing
  *in scroll distance* is unchanged (30vh lead-in, 105vh scrub, exactly what 0.2/0.9
  bought across the old 150vh pinned window).

```tsx
<CoverTransition pinHeightVh={PIN_VH} start={0.54} theme="dark" style={{ background: … }}>
  …the band's content…
</CoverTransition>
```

**`start` is the tuning knob**, on the *same 0–1 pin scale* as the section above's
`exitFade.start`/`end` — that is the entire point of the shape. Set it between them and
the band covers while the frame is still dissolving; set it at `exitFade.end` and the
frame finishes fading before anything covers it. The component converts it to a distance:
`coverVh = (1 - start) × (pinHeightVh - 100)`, so at `start: 0.54` on a 350vh track that
is a 115vh pull. `pinHeightVh` is shared with `mDiscreet` via the page's `PIN_VH`
constant so the two cannot drift.

The value rides in as a `--cover-mt` custom property because a Tailwind arbitrary value
has to be a static string. Keeping it in the *class* (`lg:mt-(--cover-mt)`) rather than an
inline `marginTop` is what preserves the `lg:` scoping, which must match
`pinOnMobile: false` dropping the pin below `lg` (`MediaSection.tsx:461`) — overlapping an
unpinned section would just eat its content.

`relative` is load-bearing: the frame above is `sticky` (positioned), so an unpositioned
band would paint *under* it. As siblings with `z-index: auto`, document order then puts
the band on top — no `z-index` anywhere, same rule as `StackedPanels`.

**The band must have an opaque background** — same contract as a panel. A transparent one
lets the frame beneath show through and the cover reads as a rendering bug.

**Verified in Chrome at 1920×854:** video reaches full duration (10.27s) at progress
0.54, the exact point the band's top sits at the viewport edge; cover then runs
0 → 40% → 90% → 100%, completing as the pin releases. At 606px wide: `margin-top: 0px`
and no pinned track. `npm run build` clean.

### The exit transition (`exitFade`)

The cover alone wipes the outgoing section. To make it *recede* instead, `MediaSection`
gained an `exitFade` prop: over the same window the frame dissolves to `color` and scales
back to `scale`.

```ts
exitFade?: {
  start?: number;    // fraction of the pin window where the exit begins (default 0.5)
  end?: number;      // where it finishes (default 1 = pin release)
  color?: string;    // dissolve target, and the colour revealed as it scales back (#000)
  opacity?: number;  // opacity at full exit (default 0 = gone entirely)
  scale?: number;    // scale at full exit, 1 = no movement (default 0.94)
}
```

`start`/`end` are *positions* on the pin window; `opacity`/`scale` are the *values* the
frame lands on at `end`. `end` is floored at `start + 0.01` so the two can never meet and
divide by zero — the same guard `fade` uses for its `hold`/`edge` pair.

**Presence enables it** — pass the object to turn it on, omit it for none. There is no
separate boolean flag, and every field is optional, so a call site passes only what it
changes. `mDiscreet` currently sets `{ start: 0.54, color: "#000", scale: 0.7 }`.

- **`start` must equal `videoScrubEnd`** — the exit begins the instant the video
  finishes and the cover opens.
- The frame dissolves *out* over a track painted the same `color`, rather than a scrim
  fading *in* over the frame. One less node, and it lands on the same colour.
- `color` is one knob doing two jobs: the dissolve target *and* the track behind the
  frame, so it is also the border revealed as the frame scales back. At `scale: 0.7`
  that border is wide and very visible — worth remembering when changing either.
- Scoped by `exiting = Boolean(exitFade) && pinned`, so it is inert below `lg` for the
  same reason the cover offset is — no pin, nothing to recede.
- `prefers-reduced-motion` keeps the dissolve and drops the scale.

**Landing on full black.** `opacity: 0` + `color: "#000"` (both defaults) *is* a full fade
to black — at `end` the frame is gone and only the black track remains. If it doesn't look
that way, the cause is almost always `end`, not `opacity`: with the default `end: 1` the
ramp only completes at the pin release, by which point the covering band is already over
the top, so the fully-black state is never actually on screen. Pull `end` in to the point
the cover starts and the section is black *before* it is covered.

That is a three-number change, because the video scrub has to get out of the way first —
the frame can't dissolve while the clip is still playing in it:

```ts
videoScrubEnd: 0.42,
exitFade: { start: 0.42, end: 0.54, color: "#000", scale: 0.7 },
```

Video finishes at 0.42 → fade runs 0.42→0.54 (about 30vh of scrolling, brisk but workable
on a 250vh pin window) → fully black at 0.54, which is exactly when the band's leading edge
reaches the viewport bottom.

Worth deciding at the same time: once the section is already black when the band arrives,
the remaining 115vh of cover is black sliding over black, and the scale-back is invisible
too. If that is the intent, consider raising `CoverTransition`'s `start` or dropping
`scale`.

**Two traps worth keeping written down:**

1. It uses **its own `useScroll`** rather than reusing `videoProgress`, whose offset is
   overridable via `videoScrubOffset`. The exit must stay locked to the pin window.
2. **Opacity is written directly to the node** via `useMotionValueEvent`, not through
   `style`. On this element motion drives *transform* values reliably but not plain style
   properties: measured at several scroll positions, `scale` landed on its expected value
   to six decimals while `opacity` stayed pinned at `1` — through three different
   bindings (separate overlay element, frame `style`, and registering the value at mount
   via the static prop). Writing the DOM directly is what the video scrub in this file
   already does. **Don't "tidy" it back into `style`.**

**Verified in Chrome at 1920×910**, inline values against the expected ramp. First two
rows at `scale: 0.94`, third re-verified after the object refactor at `scale: 0.7`:

| pin | opacity (expected → actual) | scale (expected → actual) |
| --- | --- | --- |
| 0.464 | 1 → `1` | none → `none` |
| 0.838 | 0.352 → `0.352604` | 0.9611 → `0.961156` |
| 0.844 | 0.339 → `0.339226` | 0.8017 → `0.801768` |

Before `start` the frame is untouched and the video still scrubs (6.86s at pin 0.464).

**Recompute the `mDiscreet` numbers together if `pinHeightVh` ever changes** —
`videoScrubStart`, `videoScrubEnd`, `exitFade.start` and the band's `-mt` are one system.

**Still unverified for the exit transition:** mobile is reasoned, not observed — it is
gated on the same `pinned` flag confirmed false below `lg` for the cover, but a window
resize did not take on the attempt. Safari and iOS Safari remain unchecked throughout.

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
