# Copy sweep — 2026-07-31

**Command:** `/copy-sweep full all` · **Mode:** `full` · **Scope:** `all`
**Findings:** 36 (`CP-01` … `CP-36`) — **33 `Applied`**, 3 `Needs approval`.
**Change log:** `docs/copy-sweep-changes.csv` (parsed clean: 10 columns, 36 rows, 0 malformed).

This is the first run of the sweep, so every row is new.

**Applied 2026-07-31 (same day, on the user's instruction).** The 33 `Pending` rows are in
the code; `npm run build` compiles clean and the rendered HTML was checked for the two
findings that could only be confirmed at runtime (CP-11, CP-18). The 3 `Needs approval`
rows are untouched by design. Two things changed during the fix and are worth reading:

- **CP-22 grew.** `components/Navigation.tsx:480,530` render **"Dash Cameras"** as visible
  menu headings — desktop dropdown and mobile menu. The sweep had only caught the
  `aria-label` on the same component, because those two files were swept by string
  extraction rather than read end to end (§ 1). They now read "Dash Cams". **This is direct
  evidence for closing the coverage gap** rather than treating it as cosmetic.
- **CP-24 was applied only in part**, deliberately — see its row in the CSV.

> **Scope reminder.** This sweep checks language, not facts. A correctly spelled wrong
> spec belongs to `/content-audit`; a dead link belongs to `/link-check`. Where a string
> disagrees with `docs/content-sources/*.txt` rather than with English, it is referred out
> (see § Referred out) instead of being given a `CP-nn`.

---

## 1. Coverage

| Surface | File | Read in full |
|---|---|:--:|
| Homepage | `app/page.tsx` | ✅ |
| GX4K | `app/gx4k/page.tsx` | ✅ |
| GX35 | `app/gx35/page.tsx` | ✅ |
| Installation | `app/installation/page.tsx` | ✅ |
| Support | `app/support/page.tsx` | ✅ |
| About | `app/about/page.tsx` | ✅ |
| Warranty | `app/warranty/page.tsx` + `lib/data/warranty.ts` | ✅ |
| Terms of Service | `app/terms-of-service/page.tsx` + `lib/data/installation-terms.ts` | ✅ |
| Site config (prod + staging) | `config/site.config.ts`, `config/site.config.staging.ts` | ✅ |
| Footer | `components/Footer.tsx` | ✅ |
| Learn more strip | `components/LearnMoreLinks.tsx` | ✅ |
| Coming Soon | `components/ComingSoon.tsx` | ✅ |
| App support card | `components/AppSupport.tsx` | ✅ |
| Thank-you copy | `lib/data/thank-you.ts` | ✅ |
| Installation coverage | `lib/data/installation-coverage.ts` | ✅ |
| Learn articles (5) | `lib/data/articles.ts` | ✅ |
| Contact | `app/contact/page.tsx` | ✅ |
| FAQ | `app/faq/page.tsx` | ✅ |
| Register | `app/register/page.tsx` | ✅ |
| Warranty claim | `app/warranty-claim/page.tsx` | ✅ |
| Retailers | `app/retailers/page.tsx` | ✅ |
| Become a retailer | `app/become-a-retailer/page.tsx` | ✅ |

**Read by string extraction, not end to end** — no findings, but not a full read:
`components/Navigation.tsx`, `components/LandingPageLayout.tsx`,
`components/PolicyDocument.tsx`, `components/BrandedNotice.tsx`, `app/learn/page.tsx`,
`app/learn/[slug]/page.tsx`, `app/fv-specialist/page.tsx`, `app/thank-you/**`,
`app/sticky-gate/page.tsx`. One finding (CP-22) does come from `Navigation.tsx`, via its
`aria-label`. The `components/sections/*` presentation components were not swept — they
carry almost no copy of their own (their text arrives as props from the pages, which were
read), but that assumption has not been verified line by line. **Next pass should close
these out** before this sweep is called complete site-wide.

Clean on inspection, no findings: `app/register/page.tsx`, `app/warranty-claim/page.tsx`,
`components/ComingSoon.tsx`, `components/LearnMoreLinks.tsx`,
`lib/data/installation-coverage.ts`. The two legal documents are clean and internally
consistent — their only issue is a cross-boundary term mismatch (CP-35).

---

## 2. Findings

### 2.1 The one that mattered most (fixed)

**CP-11 — the footer says "3-year australian warranty" on every page.**
`components/Footer.tsx:50` renders `{contact.warranty.toLowerCase()}`, and
`siteConfig.contact.warranty` is `"3-Year Australian Warranty"`. `.toLowerCase()` cannot
tell a style choice from a proper noun, so it flattens the nationality too. The result
sits in the footer CTA band directly under a 48px headline, on all eight MVP pages and
every other route.

It is also the only finding in this sweep that **cannot be fixed by editing the string** —
`contact.warranty` is reused as a footer link label and in the warranty page heading, where
it must stay title case. The fix belongs in the component: either lowercase only the first
word, or add a sentence-case variant to `SiteConfig`.

### 2.2 Referential errors — copy that points at nothing

These are the findings a spellchecker would never surface, and they cost a customer real time.

- **CP-30** — `/support` and `/faq` both tell the reader to get firmware "from the Download
  Centre". No section of either page is called that. On `/support` it is headed *"Select
  your dash camera"*; on `/faq` there is no downloads section at all. Pairs with **CA-13**
  (the download links are dead pending the correct files) — settle both together.
- **CP-31** — `/contact` promises "manuals, firmware and troubleshooting … below". The
  paragraph is copied verbatim from `/support:316`, where it is true. On `/contact` what
  follows is a phone card, an email card and a message form.
- **CP-33** — the app card's **"Requirements"** heading sits *below* the requirement line
  and labels the fine print instead. Anyone scanning for the iOS version requirement reads
  the download size.
- **CP-32** — the GX35 tab heading says **"Smaller Than a Business Card"** over body copy
  that says *credit* card, which is what the hero and the Discreet by Design section also
  say. Two different objects, one line apart.

### 2.3 Grammar

| ID | Where | Issue |
|---|---|---|
| CP-03 | Both product pages ×4 | "Insert the Micro SD card **into on** the device." |
| CP-04 | Both product pages ×4 | "Copy the downloaded firmware **on** the top-level root" → *to* |
| CP-05 | `articles.ts:30` | "More pixels **means**" → *mean* |
| CP-06 | `articles.ts:131,216` | Two comma splices, one in a highlighted call-out |
| CP-07 | Both product pages ×2 | "the card **used for** another device" — ambiguous |
| CP-08 | `articles.ts:164` | "low-frame recording" → *low-frame-rate* |
| CP-09 | GX4K, GX35, retailer page | "records 2,325 more hours **than standard parking mode**" — compares hours to a mode |
| CP-10 | `installation:155` | "3–4 digit CVC" → *3- or 4-digit* |

**CP-03, CP-04 and CP-07 sit in `firmwareSteps` / `speedCamSteps`, which are currently
unrendered** — `FirmwareDownloads` is commented out on both product pages (CLAUDE.md open
item 6). They ship the moment those sections are restored. Fix them now; do not treat the
arrays as dead code (CLAUDE.md is explicit that they must not be cleaned up).

### 2.4 Mechanical — capitalisation, punctuation, house style

| ID | Class | Issue | Occurrences |
|---|---|---|:--:|
| CP-01 | Spelling | "richer **color**" → *colour* (only US spelling in prose site-wide) | 2 |
| CP-02 | Spelling | "detailed **inquiry**" → *enquiry* | 2 |
| CP-12 | Caps | "What's in **The** Box?" | 2 |
| CP-13 | Caps | "Product Registration & Warranty Claims" — only Title Case h2 on `/support` | 1 |
| CP-14 | Caps | "<0.2% **D**efect rate across in-house production" | 1 |
| CP-15 | Caps | "AMEX" in alt text | 1 |
| CP-16 | Punct | Hyphen doing a dash's job — incl. footer "GX4K - 4K 2CH" vs nav "GX4K — 4K 2CH" | 6 |
| CP-17 | Punct | "No.1" → "No. 1" | 7 |
| CP-18 | Punct | "3 Year Warranty" → "3-Year Warranty" | 5 |
| CP-19 | Punct | `3840 x 2160` / `3840×2160` / `3840 × 2160` — three renderings | 11 |
| CP-20 | Punct | `...` where the rest of the site uses `…` | 1 |
| CP-21 | Punct | Single curly quotes around 'hybrid' | 2 |
| CP-22 | House | "dashcam" / "dash camera" in prose → *dash cam* | 13 |
| CP-23 | House | cutoff / cut-off / low voltage / low-voltage | 10 |
| CP-24 | House | microSD / MicroSD / Micro SD | 9 |
| CP-25 | House | "123g" vs "18 g module" on the same page | 5 |
| CP-26 | House | "9:00 AM" buttons under "from 9am to 5pm" copy | 2 |
| CP-27 | House | "FHD" vs "Full HD" on sibling cards | 2 |
| CP-28 | House | "V 1.1.77" | 1 |
| CP-29 | House | "1–2 business days" vs "one to two business days" | 3 |

Three of these contradict themselves **inside a single file**, which is what makes them
worth fixing rather than tolerating: `app/gx4k/page.tsx` writes the cut-off three ways in
170 lines (CP-23); the same file writes "18 g module" and "123g" (CP-25); and
`app/installation/page.tsx` states its opening hours in two formats three lines apart
(CP-26).

### 2.5 Needs approval (3)

- **CP-34 — FINEDIGITAL / Fine Digital Inc. / FineDigital.** Three spellings of the parent
  company on three pages. Not ours to normalise: the 1992 heritage claim is itself
  unsourced (**CA-27**), and if it resolves against the claim all three strings go rather
  than get aligned.
- **CP-35 — "dash camera" throughout the legal documents.** Both are internally consistent;
  the mismatch is only against the marketing site. **Probably won't-fix:** `warranty.ts:107`
  defines the warranted item as the "FineVu main dash camera unit", so rewording edits the
  scope of a warranty commitment. Recorded so it stays visible, not so it gets changed.
- **CP-36 — the SGcarmart testimonial** on the homepage ("Crispy clear image. easy
  connection … straight forward download"). Lower-case sentence start and a split
  compound — but it is a real customer's words, attributed on-page. Correcting it
  misquotes a third party. Recorded mainly so a later pass doesn't "fix" it reflexively.

---

## 3. House-style decisions taken this pass

Recorded so the next sweep inherits them instead of re-litigating. Each was decided by
majority usage in the existing copy, not by importing an outside style guide.

| Question | Decision | Basis |
|---|---|---|
| dash cam vs dashcam | **dash cam** (two words) in prose | 69 : 16 in existing copy |
| Filenames / URLs containing `dashcam` | **Untouched** | Not prose; renaming breaks refs |
| `x` vs `×` in dimensions | **`×`, spaced** | Matches both spec tables |
| Dash for parenthetical breaks | **Em dash `—`** | Dominant in existing copy |
| Headings and buttons | **Sentence case**, unless a page is uniformly Title Case | Per-page consistency outranks a global rule |
| "No." abbreviation | **`No. 1`** with a space | Standard AU/UK usage |
| Compound modifiers | Hyphenate before a noun (`3-Year Warranty`, `low-voltage cut-off`) | Matches `siteConfig.contact.warranty` |
| Ellipsis | **`…`** (single character) | Used everywhere but one placeholder |
| Product terms set solid | `4K`, `2K`, `5GHz`, `128GB` stay closed up | Deliberate product styling, not a unit pair |
| American spellings in code | **Never touched** | `text-center`, `colors`, `behavior` are identifiers |

Two questions are left **open** rather than decided, because both touch a source of truth:
**microSD casing** (CP-24 — the box list follows `content-sources`) and the **Fine Digital
spelling** (CP-34 — see CA-27).

---

## 4. Referred out

Noticed while reading; **not** given `CP-nn` rows.

| Observation | Goes to |
|---|---|
| `Sony STARVIS` vs `SONY STARVIS` — the sources write it `SONY`, so this is a source mismatch, not a style choice | `/content-audit` (same class as **CA-79**) |
| `lib/data/thank-you.ts` promises a confirmation email the API never sends | Already documented in-file; **CA** territory, unresolved by user direction |
| `app/retailers/page.tsx:67-84` — the 16 store records are placeholder data (invented phone numbers) | **CA-33** |
| `/installation` coverage promises rest on the unsourced 19-range table | **CA-78** |
| Every `/retailers` CTA renders the Coming Soon placeholder in production | **CA-38**, CLAUDE.md open item 2 |
| Dead firmware download links on `/support` | **CA-13** (pairs with CP-30) |

---

## 5. Summary

| Class | Count |
|---|:--:|
| Grammar | 8 |
| House style | 8 |
| Consistency | 7 |
| Punctuation | 6 |
| Capitalisation | 5 |
| Spelling | 2 |
| **Total** | **36** |

| Status | Count |
|---|:--:|
| `Applied` | 33 |
| `Needs approval` | 3 |
| `Pending` | 0 |

**All 33 are applied**; `npm run build` is clean. What remains open is the 3
`Needs approval` rows (CP-34 Fine Digital spelling, CP-35 "dash camera" in the legal
documents, CP-36 the verbatim customer testimonial) and the partial residue on CP-24.

**Not a launch gate.** Copy quality is not one of the three hard gates in CLAUDE.md, and
none of these findings blocked a deploy. CP-11 was the only one that would have been
genuinely embarrassing to ship.

**Next pass:** close the coverage gap in § 1. CP-22 proved it is not theoretical — two
visible nav headings were missed by string extraction and only surfaced during the fix.
