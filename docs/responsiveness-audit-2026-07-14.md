# Responsive & Cross-Browser Audit — FineVu (Next.js)

**Date:** 2026-07-14
**Platform:** Next.js 16 App Router / React 19 / Tailwind v4
**Scope:** All 14 routes (13 static + `learn/[slug]`)
**Mode:** Audit-first (no fixes applied, nothing committed)

## What was verified vs. assumed

| Browser engine | How tested | Confidence |
|---|---|---|
| **Chrome / Chromium** | Headless Chrome via CDP — real viewport resize + measurement at 320/360/375/390/414/768/1024/1280/1440/1920 | **Verified** |
| **Edge (Chromium)** | Same engine as Chrome; rendering covered by Chromium sweep | **Verified (rendering)** — Edge-only form-control chrome not device-tested |
| **Safari / WebKit (macOS + iOS)** | Code review only — no WebKit engine available in this environment | **Assumed** — needs real-device QA |
| **Firefox / Gecko** | Code review only — no Gecko engine available | **Assumed** — needs manual QA |

All 14 routes return HTTP 200.

## Method notes
- Horizontal overflow measured at the **document level** (`documentElement.scrollWidth` vs viewport), which correctly ignores content inside intended horizontal-scroll carousels (gx4k/gx35 "See Every Detail", retailers store carousel, home reviews rail).
- The site sets a global `body { overflow-x: hidden }` (globals.css:132) that hides horizontal overflow. The sweep was **re-run with that clip neutralised in-browser** to surface any masked overflow — results below are the true, un-masked picture.

---

## Findings

| Page/Template | Device/Breakpoint | Browser | Issue | Severity | File/Location | Suggested Fix | Status |
|---|---|---|---|---|---|---|---|
| /contact | Mobile 320px only | All | "How can we help" channel cards overflow the content box by ~10px (card min-content 306px vs 272px available). Clipped by global `overflow-x:hidden`, so no scrollbar appears — cards sit flush to the right edge. | Low | app/contact/page.tsx:214 | Reduce card padding on small screens (`p-6 sm:p-7`) and let the CTA wrap / trim its horizontal padding at <360px | Not fixed |
| /support | Mobile 320px only | All | Same shared channel-card pattern, same ~10px overflow. | Low | app/support/page.tsx:228 | Same as above | Not fixed |
| /retailers | Mobile (all widths) | All | Carousel navigation dots are 8×8px — well under the 24px minimum touch target; hard to tap accurately. | Medium | app/retailers/page.tsx (carousel dots) | Give dots a ≥24px hit area (padding/`::before`) while keeping the 8px visual dot | Not fixed |
| All pages | Mobile <768px | All | Nav logo link renders 41px tall (3px under the 44px guideline). | Low | components/Navigation.tsx | Add a little vertical padding to the logo `<a>` | Not fixed |
| /gx4k, /gx35, /services | Mobile <768px | All | Tab / filter buttons render ~40px tall (4px under 44px). | Low | respective pages | Bump to `min-h-[44px]` on mobile | Not fixed |
| All pages | Mobile <768px | All | Footer + inline text links (phone, email, "Learn More", "Contact us", "privacy policy") ~20px tall. These are **inline text links**, exempt from WCAG 2.5.8 target-size — noted for completeness. | Low (informational) | Footer / inline | Optional: increase line-height/padding | N/A |
| Global | All | Safari/iOS | `body { overflow-x: hidden }` masks root-cause overflow rather than fixing it. iOS Safari does not always honour body-level `overflow-x:hidden`, so the two 320px cases above could show a slight peek/rubber-band on a real iPhone. | Low (architectural) | app/globals.css:132 | Keep as safety net, but fix the two root causes so nothing is silently clipped | Not fixed |

### Cross-browser code review — hazards checked, all already handled ✓
No defects found in code review. The usual WebKit/Firefox/Edge pitfalls are already mitigated:

- **Gradient text** (`background-clip:text`): `-webkit-background-clip:text` present in globals.css and inline `WebkitBackgroundClip` on gx4k/gx35 headings. ✓
- **backdrop-filter / backdrop-blur**: Tailwind v4 (Lightning CSS) auto-emits `-webkit-backdrop-filter`; manual glass rule (globals.css:211-212) has both prefixes. ✓
- **Full-viewport heroes**: use `100dvh` (correct iOS dynamic-viewport fix); page wrappers use `min-h-screen` (min-height — safe, not the buggy fixed `height:100vh`). ✓
- **Sticky pin** (Optics / gx4k hero): parent is `overflow-x-clip` (not `overflow-x-hidden`), so `position:sticky` is not broken. ✓
- **Form controls**: `-webkit-appearance:none` on number/date inputs; contact select uses `appearance-none` + custom SVG chevron → consistent Safari/Edge styling. No `type=date`/`type=time` inputs that render inconsistently. ✓
- **Scrollbar hiding** (home reviews rail): tri-prefixed — `scrollbar-width:none` (FF), `-ms-overflow-style:none` (old Edge), `::-webkit-scrollbar` hidden (Safari/Chrome). ✓
- **Misc**: `-webkit-tap-highlight-color`, `-webkit-text-size-adjust`, font-smoothing, and a `prefers-reduced-motion` override for smooth scroll all present. ✓

### Functional / interaction checks
- **Mobile nav**: hamburger (`aria-label="Open menu"`) opens a dropdown panel (1 → 8 visible links), X to close. ✓
- **Forms** (contact/support/booking/services/become-a-retailer): stack to single column on mobile, full-width inputs, custom-styled select. ✓
- **Carousels**: contained/left-aligned tracks with arrows + dots; only the dot hit-area is undersized (above).
- **Nav theme detection** (`data-nav-theme`): light/dark contrast correct over sampled sections in the sweep screenshots. ✓

---

## Prioritised action list

**Critical:** none.
**High:** none.
**Medium:**
1. Enlarge the retailers carousel dot tap targets to ≥24px hit area.

**Low:**
2. Fix the /contact + /support 320px card overflow at the root (padding + CTA wrap) so it no longer relies on the global clip.
3. Nudge nav logo link and product/service tab buttons to ≥44px on mobile.

## Platform-specific notes
- `body{overflow-x:hidden}` in globals.css is a **global** guard — the two 320px overflows are the only things it is currently masking. Fixing them lets the guard stay purely as a safety net.
- Everything else is isolated to individual page sections; no shared-layout (layout.tsx / Navigation / Footer) responsive defects found.

## Final confirmation statement
**NOT 100% verified.** Verified clean on Chromium (= Chrome + Edge rendering) across all breakpoints except the minor items above. **Safari/WebKit and Firefox/Gecko were reviewed by code only** (no engine available here) and show no code-level defects, but must be confirmed on a real macOS Safari, iOS Safari, and Firefox before claiming a full pass. No commit/push performed.
