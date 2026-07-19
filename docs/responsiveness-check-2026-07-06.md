# Responsive & Cross-Browser Audit — FineVu (finevu-dashcam)

**Date:** 2026-07-06
**Platform:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Framer Motion
**Site under test:** http://localhost:3000 (local dev)
**Branch:** `main`
**Routes audited:** 13 (all `app/**/page.tsx`)

## Method & Coverage (verified vs. assumed)

- **Automated (headless Chromium / Blink — covers Chrome + Edge, same engine):** every route
  swept at **10 widths** — 320, 375, 390, 414, 768, 834, 1024, 1280, 1440, 1920 — measuring true
  horizontal scroll (`documentElement.scrollWidth − clientWidth`), element-level viewport overflow,
  broken/oversized images, sub-44px tap targets, sub-12px fonts, nav mode, console errors, and
  HTTP ≥400 responses. Screenshots captured at 390px and 1280px per route; key pages eyeballed.
- **Code review (WebKit / Gecko):** globals.css, layout, Navigation, and shared components reviewed
  for known Safari/Firefox pitfalls. **Not visually verified on real Safari/iOS or Firefox** — those
  engines can't be reliably headless-automated in this non-interactive session.

## Headline result

**Zero Critical, zero High, zero Medium issues found.** Across all 13 routes × 10 widths:
`docScroll = 0` everywhere (**no horizontal scroll bug anywhere**), **no broken images**, **no
console errors**, **no 404s**. The nav has one clean transition (hamburger ≤1024px → desktop
≥1280px). Remaining items are **Low-severity polish** plus **cross-engine items that need
real-device QA** before a "100%" claim can be made.

## Findings

| Page/Template | Device/Breakpoint | Browser | Issue | Severity | File/Location | Suggested Fix | Status |
|---|---|---|---|---|---|---|---|
| gx4k | all widths | Chromium | Off-screen carousel cards extend beyond the viewport | Info (by design) | `app/gx4k/page.tsx` `Carousel` | None — cards are intentionally parked off-screen and clipped; `docScroll=0` | Verified OK |
| learn/[slug] | all widths | Chromium | Full-bleed hero image bleeds 20–64px past the viewport | Info (by design) | `app/learn/[slug]/page.tsx` | None — clipped, no scroll leak | Verified OK |
| services | 320–1440 | Chromium | Decorative divider lines (`left-[-10%] right-[-10%]`) extend ~7–10px past the edge | Low (cosmetic) | `app/services/page.tsx` | Clip within a `max-w` wrapper or reduce inset; harmless (clipped) | Not fixed |
| All pages | mobile <768 | Chromium | Footer contact/nav text links ~17–20px tall (<44px AAA target) | Low | `components/Footer.tsx` | Add `py-1.5`/line-height to footer links (AA 24px met; AAA 44px not) | Not fixed |
| gx4k, services, how-it-works | mobile | Chromium | A few toggle/CTA buttons 40–42px tall (just under 44px) | Low | respective page files | Bump vertical padding to reach 44px min | Not fixed |
| how-it-works, services | mobile+ | Chromium | A handful of 9–11px labels/eyebrows | Low | page/section components | Raise smallest labels to ≥11–12px | Not fixed |
| gx4k hero, Optics section, about hero | iOS Safari | Safari (WebKit) | `h-screen`/`min-h-screen` used `100vh`; **no `dvh`/`svh`** → possible address-bar height jump | Low–Med | `app/gx4k/page.tsx:166,190`; `components/sections/OpticsSection.tsx:200`; `app/about/page.tsx:50` | Swapped to `h-[100dvh]` / `min-h-[100dvh]` | **FIXED** (Chromium-verified; iOS device QA still recommended) |
| Gradient headings, glass nav, form inputs | Safari & Firefox | WebKit/Gecko | Cross-engine prefixes | Info (already handled) | `app/globals.css` | `-webkit-background-clip:text`, `-webkit-backdrop-filter`, `-webkit-appearance:none`, `-webkit-text-size-adjust` all present ✓ | Verified by code review |

## Prioritized action list

There are **no Critical or High actions**. Optional polish, in priority order:

1. **(Low–Med) iOS viewport units** — swap `h-screen`→`h-[100svh]` (and `min-h-screen`→`min-h-[100dvh]` on the about hero) for the pinned/full-height sections, then confirm on a real iPhone. Only matters on iOS Safari.
2. **(Low) Tap targets** — nudge the few 40–42px buttons and footer text links up to a 44px hit area.
3. **(Low) Smallest labels** — lift 9–10px labels to ≥11–12px.
4. **(Low, cosmetic) services divider lines** — optional, currently clipped cleanly.

## Platform-specific notes

- **Global CSS is well-built for cross-browser.** `app/globals.css` already ships the WebKit
  prefixes that usually bite (gradient text clip, backdrop-filter, input appearance, text-size-adjust,
  font-smoothing, tap-highlight) and a global `overflow-x:hidden` guard on `body` plus
  `max-width:100%` on `img/video/svg`. This is why `docScroll=0` held on every page.
- **Nav breakpoint is `xl` (1280px).** Tablets (768–1279px), including iPad landscape at 1024px,
  get the hamburger menu, not the desktop bar. Intentional, verified as a single clean transition —
  no broken in-between state.
- **`data-nav-theme` contrast system** works: the nav samples the section under it and themes the
  glass pill light/dark. No mis-themed sections observed in the sweep.

## Fix applied + re-verification (2026-07-06)

**Change made (iOS viewport units only, per direction):** the four full-height sections now use
dynamic viewport height instead of `100vh`:
- `app/gx4k/page.tsx` — reduced-motion hero `h-screen`→`h-[100dvh]`; pinned video `h-screen`→`h-[100dvh]`
- `components/sections/OpticsSection.tsx` — pinned stage `h-screen`→`h-[100dvh]`
- `app/about/page.tsx` — hero `min-h-screen`→`min-h-[100dvh]`

**Re-verified on two real Chromium browsers** (`npm run build` passes; `100dvh` present in compiled CSS):

| Browser | Version | Result |
|---|---|---|
| Chrome | 149.0.7827 | ✅ `docScroll=0` all pages/widths · `dvh` supported · about hero now = viewport (900=900) · gradient H1 renders (`-webkit-background-clip:text`, transparent fill) · hero video autoplays |
| Edge (Chromium) | 150.0.4078 | ✅ Identical pass — same results, mobile hero screenshot confirms `dvh` full-height fill |

No regressions: every previously-passing page still shows `docScroll=0`, no broken images, no errors.

**Safari (WebKit) automation — BLOCKED this session.** `safaridriver` is enabled and running, but
session creation returns: *"You must enable 'Allow remote automation' in the Developer section of
Safari Settings."* That toggle is GUI-only and can't be flipped non-interactively. To enable real
Safari WebDriver runs: Safari → Settings → Advanced → "Show features for web developers", then
Develop → check **"Allow Remote Automation"** (a one-time manual step in an interactive session).
Until then, WebKit is covered by **code review only** (all key `-webkit-` prefixes present in
`app/globals.css`; `dvh` is supported by Safari 15.4+).

## Final confirmation statement

**Verified:** All 13 routes are fully responsive with **no layout, overflow, image, or console
errors** on **Chrome 149 and Edge 150** (both Chromium) across 320–1920px. The iOS viewport-unit
fix is applied, builds clean, and is confirmed regression-free on both browsers.

**NOT verified (per task honesty requirement):** Real **Safari (macOS + iOS)** and **Firefox**
rendering was **not visually confirmed**. Safari automation was blocked by the GUI-only "Allow
Remote Automation" toggle; Firefox was not driven. WebKit/Gecko are covered by **code review only**
(risk assessed low — all key prefixes present, `dvh` supported in target versions).

**Therefore I am NOT claiming a 100% cross-browser pass, and have NOT committed or pushed anything.**
Recommended before sign-off: enable Safari Remote Automation (or QA on a real iPhone) and a quick
desktop Firefox check. The applied change is on `main`'s working tree only, awaiting your go-ahead.
