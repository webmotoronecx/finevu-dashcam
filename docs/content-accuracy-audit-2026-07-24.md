# Content Accuracy Audit — GX4K & GX35

**Date:** 2026-07-24
**Scope:** `app/gx4k/page.tsx`, `app/gx35/page.tsx`, `app/page.tsx` (homepage)
**Source of truth:** Official FineVu product pages, scraped to
`finevu/data/scraped-gx4k.html` and `finevu/data/scraped-gx35.html`
**Method:** Every spec/number/claim on the two product pages compared against the
official FineVu spec sheets. Line numbers reference the pages as of this date and
may drift as the files change.

---

## Summary

| # | Page | Issue | Status |
|---|------|-------|--------|
| 1 | GX4K | Hero calls rear cam "2K QHD" (it's Full HD) | ✅ fixed |
| 2 | GX4K | Rear module weight 23 g (should be 18 g) | ✅ fixed |
| 3 | GX4K | "Smart Time-Lapse" @10fps→30fps (GX4K is plain Time-Lapse, parking = 2fps) | ✅ fixed |
| 4 | GX4K | Comparison table: GX35 GPS "External" (it's built-in) | ✅ fixed |
| 5 | GX35 | Time-Lapse "up to 743 min" (should be 1,129 min) | ✅ fixed |
| 6 | GX35 | GPS listed "External" in specs & comparison (it's built-in) | ✅ fixed |
| 7 | GX35 | "Records at 10fps while parked" (parking = 2fps) | ✅ fixed |
| 8 | GX35 | Included card "64GB" vs official 128GB | ✅ confirmed correct — AU bundle ships 64GB, no change |
| 9 | GX35 | Rear cam "2.13 MP" (should be 2 MP) | ✅ fixed |
| A | Home | GX35 hero: "live view from anywhere in the world" (that's the GX35 **Cloud**, a different product) | ✅ fixed |
| B | Home | "automotive-IT specialist since 2009" — should be **1992** | ✅ fixed |
| C | Home | GX1000 review not verifiable → replaced with official GX4K review | ✅ fixed |
| D | GX4K + GX35 | "What's in the Box" omits the Hardwire Kit, contradicting the inclusion claims sitewide | ⏸ **OPEN** — escalated to higher ops, do not change yet |

Legend: ✅ = applied 2026-07-24 · ⚠ = needs a decision before changing · 🟡 = needs a source · ℹ = informational

> **Revert note:** the `current:` blocks below are the verbatim pre-fix text — paste
> them back to undo any single change. Line numbers may have drifted post-edit; anchor
> on the text, not the line number.

---

## 🔴 Factual errors (currently rendered)

### 1. GX4K hero — rear camera called "2K QHD"
`app/gx4k/page.tsx:47`. The GX4K rear camera is **Full HD 1920×1080**, not 2K QHD.
Every other part of the page has this right; only the hero subtitle is wrong.

```
current:  "4K UHD front. 2K QHD rear. Simultaneous. No compromises."
replace:  "4K UHD front. Full HD rear. Simultaneous. No compromises."
```

### 2. GX4K rear module weight — 23 g should be 18 g
Official GX4K rear = **18 g**. The 23 g figure is actually the *GX35's* rear weight.
Two locations:

`app/gx4k/page.tsx:278` (spec table)
```
current:  ["Rear camera", "2 MP CMOS · 1920 × 1080 (Full HD) · 143° FOV · 23 g module"]
replace:  ["Rear camera", "2 MP CMOS · 1920 × 1080 (Full HD) · 143° FOV · 18 g module"]
```

`app/gx4k/page.tsx:499` (optics callout)
```
current:  items: ["2 MP CMOS sensor", "1920 × 1080 (Full HD)", "143° field of view", "23 g compact module"]
replace:  items: ["2 MP CMOS sensor", "1920 × 1080 (Full HD)", "143° field of view", "18 g compact module"]
```

### 3. GX4K Time-Lapse card — mislabelled + wrong fps
`app/gx4k/page.tsx:105-107`. The GX4K's feature is plain **"Time-Lapse,"** not "Smart
Time-Lapse" (that's a GX35 feature). The impact→30fps behaviour is a GX35 spec, and
the official GX4K parking time-lapse rate is **2fps**, not 10fps. ("up to 743 min" is
correct for GX4K.)

```
current:
  title: "Smart Time-Lapse",
  body: "Records at 10fps while parked, then jumps to 30fps the instant something happens — up to 743 minutes of coverage without filling the card.",

replace:
  title: "Time-Lapse",
  body: "Compresses long parked hours into a lightweight time-lapse — up to 743 minutes of coverage without filling the card.",
```

### 4. GX4K comparison table — GX35 GPS shown as "External"
`app/gx4k/page.tsx:298`. Official GX35 spec shows **built-in GPS** (GPS: O).

```
current:  ["GPS", "Built-in", "External (included)"]
replace:  ["GPS", "Built-in", "Built-in"]
```

### 5 & 7. GX35 Time-Lapse card — wrong duration + wrong fps
`app/gx35/page.tsx:116`. Official GX35 duration is **up to 1,129 minutes** (743 is the
GX4K number — this card was copied from the GX4K page and not updated). The "10fps
while parked" is unsupported (parking options are 30/15/2fps). Impact→30fps *is*
correct for the GX35, so it's kept.

```
current:
  body: "Records at 10fps while parked, then jumps to 30fps the instant something happens — up to 743 minutes of coverage without filling the card.",

replace:
  body: "Records a lightweight time-lapse while parked, then jumps to full 30fps the instant an impact is detected — up to 1,129 minutes of coverage without filling the card.",
```

### 6. GX35 GPS — listed "External" (it's built-in)
Official GX35 spec shows **built-in GPS** (GPS: O). This also contradicts the page's own
carousel card at `:157`, which correctly says "Built-in GPS." Two locations:

`app/gx35/page.tsx:367` (spec table connectivity row)
```
current:  ["Connectivity", "Built-in Wi-Fi · External GPS · FineVu Wi-Fi App"]
replace:  ["Connectivity", "Built-in Wi-Fi · Built-in GPS · FineVu Wi-Fi App"]
```

`app/gx35/page.tsx:388` (comparison table)
```
current:  ["GPS", "Built-in", "External (included)"]
replace:  ["GPS", "Built-in", "Built-in"]
```

### 9. GX35 rear camera — "2.13 MP" should be "2 MP"
`app/gx35/page.tsx:361`. Official says **2 MP**.

```
current:  ["Rear camera", "2.13 MP CMOS · 1920 × 1080 (Full HD) · 143.2° FOV"]
replace:  ["Rear camera", "2 MP CMOS · 1920 × 1080 (Full HD) · 143.2° FOV"]
```

---

### A. Homepage GX35 hero — "live view from anywhere in the world"
`app/page.tsx:184`. This describes the **GX35 Cloud**, a separate product. The plain
GX35 has only built-in Wi-Fi with **local** in-app live view (no cloud/LTE). Also tidied
the eyebrow (`:182`) which read "GX35 2k · 2-Channel 2k QHD" (duplicated "2k").

```
current:
  eyebrow="FineVu GX35 2k · 2-Channel 2k QHD"
  ...
  sub="QHD 2K clarity in a camera smaller than a credit card - now with a live view of your car from anywhere in the world."

replace:
  eyebrow="FineVu GX35 · 2-Channel QHD"
  ...
  sub="QHD 2K clarity in a camera smaller than a credit card - with in-app live view straight from your phone."
```

### B. Homepage — "automotive-IT specialist since 2009"
`app/page.tsx:237`. FINEDIGITAL's own About page states "a leading provider of innovative
car electronics systems **since 1992**." 2009 was wrong.

```
current:  Built by FINEDIGITAL, an automotive-IT specialist since 2009, held to a standard the numbers prove.
replace:  Built by FINEDIGITAL, an automotive-IT specialist since 1992, held to a standard the numbers prove.
```

### C. Homepage — unverifiable GX1000 review
`app/page.tsx:143-145`. The third review card quoted a **GX1000** — a product not sold on
this site and not in the source data. Replaced with a genuine review from FineVu's own
GX4K page (matches `scraped-gx4k.html`, testimonial by Jian Yang Mok).

```
current:
  thumb: '/products/gx4k-studio.jpg', product: 'FineVu GX1000', tagline: 'Easy to navigate the app and program',
  body: 'I am very satisfied with my product GX1000. Great quality. Easy to navigate the app and program. Reliable brand with excellent after sales service. Best parts is able inform speed camera. Value for money.',

replace:
  thumb: '/products/gx4k-studio.jpg', product: 'FineVu GX4K', tagline: 'Would definitely recommend',
  body: 'Great product, excellent for my current usage. Will definitely recommend to all my friends and family. - Jian Yang Mok, Owner of BMW 420i',
```

### D. "What's in the Box" omits the Hardwire Kit — ⏸ OPEN, DO NOT CHANGE YET

> **Status 2026-07-24: escalated to higher ops. No code change applied.** The fix below
> was drafted and then reverted pending that decision. Both `boxItems` lists are
> currently unchanged (no "Hardwire Kit" entry). Revisit once ops confirms whether the
> AU box ships the kit.

`app/gx4k/page.tsx:290` and `app/gx35/page.tsx:373`. The kit is claimed as included in
**seven** places sitewide — homepage tile `:117` + disclaimer `:152`, GX4K tile `:669` +
warranty `:358`, GX35 tile `:649` + warranty `:440`, support `:83`, and repeatedly on the
installation page ("already in the box — nothing extra to source" `:51`) — but was absent
from both box-contents lists.

Confirmed included via the site's own product photography (`public/gx4k/cables.png`),
which shows the hardwire kit (fork/ring ground terminal, fused red/yellow leads) beside
the cigarette-lighter power cable. This matters because **parking mode requires the
hardwire kit**, and the $250 install booking is sold on everything arriving in the box.

```
current (gx4k:290):
  const boxItems = ["Front Camera", "Rear Camera", "MicroSD Card & Adapter", "Power Cable", "Rear Cable", "User Manual"];
replace:
  const boxItems = ["Front Camera", "Rear Camera", "MicroSD Card & Adapter", "Power Cable", "Hardwire Kit", "Rear Cable", "User Manual"];

current (gx35:373):  ... "Power Cable", "Rear Cable", ...
replace (gx35:373):  ... "Power Cable", "Hardwire Kit", "Rear Cable", ...
```

---

## ✅ Confirmed correct — no change

### 8. GX35 included MicroSD card — 64GB
`app/gx35/page.tsx:617`, warranty `:406`, GX4K page `:321`, homepage `:116`/`:151`.
The official Korean spec sheet lists a 128GB card, but **AutoXtreme's Australian bundle
ships 64GB with the GX35** (confirmed 2026-07-24). The site is correct as written — the
difference is a regional bundle, not an error. Leave as is.

---

## 🟡 Unverified claims (not found in the official data)

Not necessarily wrong, but nothing in the two spec sheets supports them. Need a source
before publishing:

- **Processor: "Dual-core" / "Allwinner V536"** — `gx4k:279,300,487`; `gx35:75,362,390`.
  The official spec sheets don't list a processor at all.
- **"microSD up to 256 GB"** — `gx4k:285`; `gx35:368`. Official only states a 128GB card
  is included + "SDXC compatible."
- **"F/1.8" aperture** — `gx4k:69,464`; `gx35:57,186,478`.
- **"defects below 0.2%" / "Built In-House"** — `gx4k:137`; `gx35:166`.
- **"6-metre cable … 9-metre available"** — `gx4k:261`; `gx35:203` (in hidden blocks).

---

## ℹ Informational — still worth a look

- **Review source label.** Homepage reviews (`page.tsx:133–146`) are labelled
  **"Review on SGcarmart"** (a Singapore marketplace). Two of the three now come from
  FineVu's own product pages, so the label may need changing to match the real source.
- **Reviewer attribution.** The review cards have no dedicated name field, so the new
  GX4K testimonial carries its attribution inline in the body text. Consider adding a
  proper reviewer/vehicle field if more real testimonials get added.
- **Singapore-plate testimonials on an AU site.** The official FineVu reviews reference
  Singapore vehicles. Fine as sourced quotes, but AU-market reviews would land better.

---

## ⚪ Hidden but wrong (disabled `{false && …}` blocks)

Not rendered today, but will ship wrong if the "Designed to Disappear" blocks are
re-enabled:

- **GX4K front unit "just 114g"** — `gx4k:256`. Official = **123 g**.
- **GX35 front unit "76g"** — `gx35:199`. Official = **57 g**.

---

## Notes

- Both pages already carry a self-flagged disclaimer under the spec tables ("confirm
  final figures against the official spec sheet before publishing" — `gx4k:687`,
  `gx35:670`). This audit is that pass.
- The comparison table (`compareRows`) is **duplicated** in both files, so the GPS fix
  (#4/#6) must be applied in **both** `gx4k/page.tsx:298` and `gx35/page.tsx:388`.
