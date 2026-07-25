# Shared Legal Disclaimers Component — Design

**Date:** 2026-07-24
**Status:** Approved, ready for implementation

## Problem

The warranty/legal fine print is duplicated across **five** pages. It is not merely
duplicated markup — the text itself has **drifted into three variants**, which matters
because this copy carries warranty terms and Australian Consumer Law commitments.

| Page | Local const | Data shape | Layout |
|---|---|---|---|
| `app/gx4k/page.tsx` | `warranty` | `[title, body][]` | `<ol list-decimal>`, dark, `bg-[#0f0f0f]` |
| `app/gx35/page.tsx` | `warranty` | `[title, body][]` | `<ol list-decimal>`, light, no bg |
| `app/page.tsx` | `disclaimers` | `{n, title, body}[]` | manual numbering, 13px, `bg-[#ededf0]` |
| `app/support/page.tsx` | `finePrint` | `["1. Warranty:", body][]` | `<ol grid>`, inline bold, `bg-white` |
| `app/installation/page.tsx` | `FINE_PRINT` | `["1. Warranty:", body][]` | `<ol grid>`, inline bold, `bg-[#f7f7f7]` |

Text divergence:

- **Product pages + homepage:** "3 Year Warranty applies to FineVu dash cam **main units
  only**, including front and rear cameras…" · "6 month warranty"
- **Support + installation:** "3-Year Warranty applies to FineVu dash cam **main unit
  cameras**, including front and rear cameras…" · "6-month warranty"
- The SD-card clause lists the models in **opposite order** between the two groups.

Consequence: the open hardwire-kit question (item D in
`docs/content-accuracy-audit-2026-07-24.md`) currently requires editing **five** files.

## Decisions

1. **Scope:** migrate all five pages.
2. **Canonical wording:** the product-page text ("main units only" — which explicitly
   *excludes* accessories from the 3-year term), with the hyphenation from
   support/installation ("3-Year", "6-month" are correct as compound adjectives).
3. **Styling:** unify to one look; each page keeps control of its own background.

## Constraint: numbering is load-bearing

`sup="1"`, `sup="2"`, `sup="3"` markers on the `BentoCard` tiles (`gx4k:662-669`,
`gx35:642-649`) and the homepage `reasons` tiles (`page.tsx:113-118`) are **footnote
references into this list by position**:

| sup | Tile | Disclaimer |
|---|---|---|
| 1 | "3 Year Warranty" | Warranty |
| 2 | "Includes … MicroSD Card" | SD Cards |
| 3 | "Includes Hardwire Kit & Power Cable" | Hardwire Kit & Power Cable |

**Array order must remain Warranty → SD Cards → Hardwire Kit.** Reordering silently
breaks these references with no type or build error. Numbering is therefore derived from
`<ol>` order and must never be hardcoded into the strings again (the
`"1. Warranty:"` pattern in support/installation is removed precisely because it makes
renumbering a prose edit).

## Design

### 1. Data — `config/site.config.ts`

Extends the existing `SiteConfig` schema, already the single source of truth for site
copy per `CLAUDE.md`.

```ts
/** Legal fine print, rendered by <LegalDisclaimers>.
 *  ORDER IS LOAD-BEARING — sup="1|2|3" footnote markers on bento tiles
 *  reference these entries by position. Append, don't reorder. */
disclaimers: { title: string; body: string }[];
```

Three entries in fixed order, using the canonical wording:

1. **Warranty** — "3-Year Warranty applies to FineVu dash cam main units only, including
   front and rear cameras, for 36 months from the date of purchase. Genuine FineVu
   accessories are covered by a 6-month warranty. Proof of purchase required. Full
   warranty terms apply. Your rights under the Australian Consumer Law are not excluded."
2. **SD Cards** — "GX35 includes a FineVu 64GB MicroSD Card and Adapter. GX4K includes a
   FineVu 128GB MicroSD Card and Adapter. Included MicroSD Cards and adapters are covered
   by a 6-month warranty."
3. **Hardwire Kit & Power Cable** — "GX35 and GX4K include a Hardwire Kit and Power Cable.
   Included Hardwire Kits and Power Cables are covered by a 6-month warranty."

> Entry 3 is subject to the unresolved ops question — see item D in the content-accuracy
> audit. Centralising it here is what makes that a one-line fix.

### 2. Component — `components/LegalDisclaimers.tsx`

```tsx
interface LegalDisclaimersProps {
  /** Text colour + data-nav-theme. Default "light". */
  theme?: "light" | "dark";
  /** Per-page background/spacing overrides, merged via cn(). */
  className?: string;
}
```

- Reads `siteConfig.disclaimers` directly; callers pass no data.
- Renders a full-width `<section>` that **must** set `data-nav-theme={theme}` — required
  by the navbar-contrast convention in `CLAUDE.md`, or the navbar renders wrong when
  scrolled over it.
- One `<ol className="list-decimal">`; title on its own line, body beneath — the layout
  already used by 3 of the 5 pages.
- Type scale: `text-[12px] font-medium leading-[18px]`.
- Text colour: dark → `#838383`; light → `#9aa0ad`.
- Server component (no hooks, no `"use client"` needed).
- **No default vertical padding.** Each page's spacing differs (`py-12 md:py-14`, `py-10`,
  `pb-16`), so padding is supplied entirely via `className`. The component owns only the
  inner container (`mx-auto max-w-[1220px] px-6`) and the list styling.

### 3. Call sites

```tsx
<LegalDisclaimers theme="dark"  className="bg-[#0f0f0f] py-12 md:py-14" />  // gx4k
<LegalDisclaimers theme="light" className="py-12 md:py-14" />               // gx35
<LegalDisclaimers theme="light" className="bg-[#ededf0] py-10" />           // home
<LegalDisclaimers theme="light" className="bg-white pb-16" />               // support
<LegalDisclaimers theme="light" className="bg-[#f7f7f7] pb-16" />           // installation
```

Delete the five local arrays and their `<section>` blocks.

## Accepted visual changes

- **Homepage:** fine print 13px → 12px; manual `{d.n}.` numbering becomes a real `<ol>`.
- **Support + installation:** inline `**1. Warranty:** body` becomes title-on-its-own-line.
- **GX4K + GX35:** effectively unchanged.

## Verification

No test suite exists, so per `CLAUDE.md`: `npm run build` must pass, then visually check
all five pages. Specifically confirm:

1. Fine print renders on all five pages with correct contrast per theme.
2. Numbering reads 1, 2, 3 and still matches the `sup` markers on the tiles.
3. The navbar contrasts correctly when scrolled over each disclaimer section
   (`data-nav-theme` wiring).

## Out of scope

- Resolving the hardwire-kit question (item D) — blocked on ops.
- Auditing `/warranty` and `/terms-of-service` page content, which state warranty terms
  in prose rather than via this list.
