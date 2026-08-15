# Copy sweep — the other seven MVP pages — 2026-08-15

**Mode:** `full` · **Scope:** the seven MVP routes not covered by
`docs/copy-sweep-2026-08-15.md`, plus the shared surfaces that ship on all eight.

Change log: `docs/copy-sweep-changes.csv` (**CP-42 … CP-56**).
House style: `docs/house-style.md`, written from the `/installation` pass and **tested for
the first time here** — see the caveat under CP-42, which contradicts it.

---

## Coverage

| Surface | File | Lines | Read in full |
|---|---|---|---|
| Homepage | `app/page.tsx` | 336 | ✅ |
| GX4K | `app/gx4k/page.tsx` | 880 | ✅ |
| GX35 | `app/gx35/page.tsx` | 873 | ✅ |
| About | `app/about/page.tsx` | 254 | ✅ |
| Support | `app/support/page.tsx` | 391 | ✅ |
| Warranty | `app/warranty/page.tsx` + `lib/data/warranty.ts` | 13 + 745 | ✅ |
| Terms of Service | `app/terms-of-service/page.tsx` + `lib/data/installation-terms.ts` | 19 + 896 | ✅ |
| Shared config | `config/site.config.ts` | 330 | ✅ |
| Shared components | `Navigation`, `Footer`, `LearnMoreLinks`, `LegalDisclaimers` | 842 | ✅ |
| Firmware content | `lib/data/firmware.ts` | 262 | ✅ |

The shared surfaces were **deliberately deferred** from the `/installation` pass, because
opening rows against copy that ships on every route from a single-route sweep would scope
them wrongly. They are in scope here.

---

## ⚠️ The house style's first real test — and it failed one axis

`docs/house-style.md` records **curly apostrophes**, settled from `/installation` alone.
Measured across the surfaces in this sweep, prose runs **31 straight against 16 curly** —
so site-wide, the rule contradicts the majority.

The split is **by file, not at random**:

| Uniformly **curly** | Uniformly **straight** |
|---|---|
| `/support`, `lib/data/warranty.ts`, `lib/data/installation-terms.ts` | Homepage, GX4K, GX35, About, `site.config.ts`, shared components |

**CP-42 keeps curly**, on the grounds that it is typographically correct and that the files
least likely to be casually edited — the legal data files and `/support` — already use it.
But that is a judgement call standing against a head count, and it means normalising **31
strings** rather than fixing a typo. **Confirm before applying.**

This is exactly what a house-style file is for: the decision is now visible and arguable
instead of being re-litigated silently on every future edit.

---

## Findings

### Mechanical, high confidence

| Row | Class | What |
|---|---|---|
| **CP-43** | Capitalisation | `MicroSD` → `microSD`, 9 prose instances. **Not a CA finding** — `docs/content-sources/*.txt` are themselves inconsistent (`Micro SD` ×2, `MicroSD` ×4, `microSD` ×2), so there is no source form to disagree with and it falls to the repo majority (17 vs 11) |
| **CP-44** | House style | Megapixels written both ways *on the same page* — `8.5 MP` in the spec table, `8.5MP` in the compare table beside it. 8 spaced against 19 unspaced. Note this does **not** contradict `96.5 mm` / `123 g` on the same pages, which are correctly spaced — `MP` and `GB` behave as spec tokens, `mm` and `g` as measurements |
| **CP-45** | House style | `2.4 / 5 GHz` at `gx4k:339` — the only spaced GHz on the site |
| **CP-46** | Spelling | `nighttime` → `night-time`. US form on a site that is Australian English throughout, in a sentence that already hyphenates `low-light` |
| **CP-47** | Punctuation | Six serial commas on the two product pages, against the omit rule settled as CP-38 |
| **CP-54** | Punctuation | `Mon–Sun, 8:00 AM – 8:00 PM AEST` — one string, two treatments of a range: unspaced en dash for days, spaced for times |

### Grammar

**CP-49 — a sentence fragment on the homepage**, at `:247`:

> Built by FINEDIGITAL, an automotive-IT specialist since 1992, held to a standard the
> numbers prove.

Two participial phrases with nothing to attach to — no subject, no finite verb. (The
FINEDIGITAL/1992 claim itself is unsourced and already tracked as **CA-27**; fix the grammar
without treating the facts as settled.)

**CP-48** — `Includes 64GB & 128GB MicroSD Card`, singular for two capacities.

**CP-55 — an ambiguous referent in a safety warning**, `lib/data/firmware.ts:42`:

> Do not power off your dash cam until it begins continuous recording, **as it may cause**
> permanent damage to the dash cam.

The first `it` is the camera, the second is the act of powering off — so the sentence
literally says the camera causes its own damage. This is the warning attached to a firmware
update that can brick a device, which is the last place an ambiguous pronoun should survive.

### Accessibility copy

**CP-51 — two of four gallery images announce the wrong subject.** In `gx4k` `detailGallery`,
`rich-mic.webp` carries alt `"GX4K lens macro"` (duplicating the actual lens image) and
`rich-front.webp` carries `"FineVu machined body"` (duplicating the logo image). A
screen-reader user is told the page shows two lens macros and two machined bodies.

Alt text is copy, and this is the only finding in the sweep that makes the page *less
usable* rather than less tidy.

### Clarity

**CP-53 — `136°F · 143°R`** in the Field of View row of both compare tables. A degree symbol
immediately followed by `F` reads as Fahrenheit — and on pages that also discuss AI heat
monitoring and hot-climate parking, that is a plausible misread rather than a pedantic one.

**CP-52** — the same two ADAS features are Title Case as feature names and lowercase in the
spec table, where the `LDWS` expansion also loses the word "Warning". The source form is
`Lane Departure Warning (LDWS)`.

**CP-56** — `Speed Cam` / `Speed Camera` / `speed camera` for one feature. Flagged **with a
caveat**: the five `Speed Cam` instances are all in the firmware update steps, which read
like a transcription of FineVu's own procedure. Verify before rewriting — quoting a
manufacturer procedure is a different decision from fixing our own copy.

### Needs approval

**CP-50 — a customer review contains genuine errors**, `app/page.tsx:147`:

> Crispy clear image. **easy** connection to phone for **straight forward** download.

Lowercase after a full stop, and `straight forward` for `straightforward`. Both are real
mistakes — but this is attributed to a named third party (SGcarmart), and silently
rewriting a quotation misrepresents what the reviewer wrote. The options are verbatim,
`[sic]`, or an editorial note. **That is a policy decision about quoted material, not a
proofreading one.**

---

## Referred out — factual, NOT copy

No `CP` rows opened for these.

| Location | Issue | Status |
|---|---|---|
| `config/site.config.ts:223` | The hero sub still says **"front & rear cameras with SONY STARVIS image sensors"** — the *exact* claim CA-61 corrected in `description` two lines above, because only the front sensor is a STARVIS (both spec sheets give the rear as CMOS 2MP). The fix was applied to one field and not its neighbour | **New — worth raising promptly**, it is a spec claim on every page's metadata surface |
| `gx4k:72`, spec rows | `F/1.8` aperture, `Dual-core` / `Allwinner V536` processor, `microSD up to 256 GB` | CLAUDE.md open item 3 — unverified |
| `gx4k:142`, `about:159` | "defects below 0.2%" | Same |
| `app/page.tsx:121` | "No. 1 Dash Cam in Korea" | **CA-26** |
| `about:158` | Fine Digital Inc. / 1992 heritage | **CA-27** |
| `support:31`, `contact:29` | Support hours and the 24-hour response SLA | **CA-24 / CA-25** |
| `gx4k:101`, `:337` | "2,325 more hours" — more than *what* is not stated | New, minor |

## Observations — no row opened

- **Section-heading full stops are a deliberate device**, not an inconsistency: the product
  pages use them throughout ("Perfectly Compact.", "In Sharp QHD.", "Discreet by Design.").
  Recorded in `house-style.md` rather than flagged, since imposing a global rule would
  flatten an intentional voice.
- `gx4k` `detailGallery` has `ratio: " 527/562"` with a leading space — code, not copy.
- The brand marquee claims "4 million+ sold" twice, once as the eyebrow and once as a chip.

---

## Summary

| Class | Rows |
|---|---|
| Punctuation | 3 (CP-42, CP-47, CP-54) |
| Capitalisation | 2 (CP-43, CP-52) |
| House style | 2 (CP-44, CP-45) |
| Grammar | 3 (CP-48, CP-49, CP-55) |
| Consistency | 4 (CP-50, CP-51, CP-53, CP-56) |
| Spelling | 1 (CP-46) |

| Status | Rows |
|---|---|
| `Pending` | 14 |
| `Needs approval` | 1 (CP-50 — quoted material) |

**Referred out:** 7, of which the `site.config.ts:223` STARVIS claim is the one to act on
first.

CSV verified: 10 columns, 56 rows, no malformed lines.

**Nothing applied.** All eight MVP pages have now had a full copy sweep.
