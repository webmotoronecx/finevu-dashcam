# FeatureTabs mobile view — design

## Goal

Give `components/sections/FeatureTabs.tsx` a proper mobile layout. Two instances
on `app/gx4k/page.tsx` use it:

- **Designed to Disappear** — video banner + 4 wordy text tabs.
- **Memory Allocation** — `tabsPosition="top"`, tab content is a `<BarGraph />`,
  currently forced to `min-w-[970px]` which overflows (and is clipped by the
  page's `overflow-x-clip`) on phones.

## Problems on mobile today

1. Tab pill row uses `w-max max-w-full` with scrollbar-hiding classes but **no**
   `overflow-x-auto` — the 4 pills clip/overflow instead of behaving.
2. Banner ratio `1297/562` (~2.3:1) is a thin strip on a phone.
3. Memory Allocation is pinned to `min-w-[970px]`; the `BarGraph` card also has
   `p-14` (56px) gutters — both crush the layout on a narrow screen.

## Design

### 1. Tab selector — wrap on mobile, single pill on desktop
The pill container keeps `w-max max-w-full` but gains `flex-wrap` +
`md:flex-nowrap`, small padding, and a responsive radius
`rounded-[26px] md:rounded-full`. Below `md`, pills exceeding the container width
wrap onto centered rows; at `md+` they stay one pill. Removes the latent
overflow bug (we wrap, not scroll).

### 2. Banner media — taller on mobile
New optional prop `mobileBannerAspect` (default `"4/3"`). Desktop keeps
`bannerAspect` (`1297/562`). Implemented with two CSS custom properties and
Tailwind `aspect-[var(--…)] md:aspect-[var(--…)]` so the `md:` breakpoint
switches ratios — no JS. Applies to the video, image, and blank-placeholder
branches. Component-only tabs (e.g. `BarGraph`) render bare, unaffected.

### 3. Memory Allocation instance (`app/gx4k/page.tsx`)
- Remove `min-w-[970px]` from its `sectionClass` (`py-10 min-w-[970px]` → `py-10`).
  `BarGraph` fills whatever width it's given, so desktop still looks right inside
  the `max-w-[1280px]` shell.
- Reduce the `BarGraph` card padding `p-14` → `p-6 md:p-14` in all 4 tab entries.

## Out of scope
No changes to `BarGraph.tsx`, `disappearTabs`, or `Head`/copy (already responsive).

## Verification
`npm run build` (type/lint) + drive both gx4k sections at mobile widths in browser.
