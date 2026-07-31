---
description: Sweep user-visible copy for spelling, grammar, punctuation and house-style consistency; update the narrative doc + change-log CSV
argument-hint: "[full|semi] [route or 'all'] — e.g. 'full', 'full /gx35', 'semi', default: full all"
---

# /copy-sweep

Proofread the **words the customer actually reads** — spelling, grammar, punctuation,
capitalisation and house style — then update BOTH deliverables.

**Arguments:** `$ARGUMENTS` may contain a **mode** (`full` or `semi`) and/or a **scope**
(a route like `/gx35`, a component like `Footer`, or `all`), in any order. Missing pieces
take defaults: **mode `full`, scope `all`**.

**Per-page sweeps are the scope argument, not a mode.** `full /gx35` = read that one page
end to end. `full` alone = every surface in the table below. Both are "full" — the mode is
about *depth*, the scope is about *breadth*. Never answer a per-page request with a `semi`
pass over that page.

**Mode — a hard contract:**

- **`full`** (default): **Read every in-scope file top to bottom** and disposition every
  string a user can see. A file is not swept until you have read its prose, not grepped it.
  End with a **Coverage report**.
- **`semi`**: Incremental. Re-verify that all open (`Pending` / `Needs approval`) rows still
  reproduce at their cited `file:line`, then sweep only what `git` shows changed since the
  last pass, plus the explicit scope. State "PARTIAL PASS" up front and **list what was not
  re-read**. Never report a `semi` pass as full.

## ⚠️ This command is scoped to LANGUAGE, not facts

**It does not check whether a claim is true.** A perfectly spelled wrong spec is
`/content-audit`'s problem, not this one. If you notice a factual error while reading,
**do not open a `CP-nn` row for it** — mention it inline in the report's *Referred out*
section and let the user route it to `/content-audit`.

The dividing line, which has been got wrong before:

- A word disagreeing with **`docs/content-sources/*.txt`** — a feature name, a model
  number, a product term — is a **content-accuracy** finding (`CA-nn`), even when the only
  difference is casing. Precedent: **CA-79** ("Ai Heat Monitoring" → "AI Heat Monitoring").
- A word disagreeing with **English or with itself** — a typo, a comma splice, a heading
  that is Title Case on one page and sentence case on the next — is a **`CP-nn`** finding.

When a string is both, it belongs to `/content-audit`. Sources win.

## ⚠️ Prose only — do not audit code

The single biggest false-positive source. `text-center`, `colors`, `bg-color`,
`justify-center`, `behavior: "smooth"`, `/gx4k/captured-ai-heat.webp` are **identifiers,
CSS classes, props, keys and file paths**. They are not misspelled American English and
they are not house-style violations. Never flag:

- Tailwind class names and CSS custom properties (`text-center`, `--brand-color`).
- Prop names, object keys, type/enum members, variable names, function names.
- File paths, asset names, URLs, slugs, `id`/`href` anchors, `data-*` attributes.
- Imports, comments meant for developers, and anything inside `docs/`.

**Only these are in scope:** string literals rendered as text, `alt` text, `aria-label`,
`title`/`placeholder`, `metadata` (title/description), and the HTML strings in
`lib/data/articles.ts`. If a user cannot read it in a browser, it is out of scope.

## Scope — the surfaces (`all` = every row)

Re-derive each run; do not trust the list as fixed.

**Priority 1 — the eight MVP pages** (`CLAUDE.md` § MVP scope):
`app/page.tsx`, `app/gx4k/page.tsx`, `app/gx35/page.tsx`, `app/installation/page.tsx`,
`app/warranty/page.tsx`, `app/terms-of-service/page.tsx`, `app/support/page.tsx`,
`app/about/page.tsx`.

**Priority 2 — shared copy that ships on every page:**
`config/site.config.ts` (nav, CTAs, hero, disclaimers, trust marquee, footer),
`config/site.config.staging.ts`, `components/Navigation.tsx`, `components/Footer.tsx`,
`components/ComingSoon.tsx`, `components/LearnMoreLinks.tsx`,
`components/LandingPageLayout.tsx`.

**Priority 3 — long-form and remaining routes:**
`lib/data/articles.ts` (**the largest prose surface on the site by far** — five articles of
HTML strings; budget for it), `lib/data/warranty.ts`, `lib/data/installation-terms.ts`,
`lib/data/thank-you.ts`, then the non-MVP routes under `app/`.

Gated ≠ out of scope: `comingSoon` pages ship on staging and ungate at launch.

## House style (the standard this sweep enforces)

1. **Australian English.** `-ise` not `-ize` (organise, optimise, recognise), `colour`,
   `centre`, `licence` (noun) / `license` (verb), `tyre`, `metre` (distance) / `meter`
   (device), `programme`→`program` for software. **Exception: never "fix" code** — see the
   prose-only rule above.
2. **Brand and product terms.** `FineVu` (capital F, capital V, one word) — never
   "Finevu", "FineVU", "Fine Vu". `AutoXtreme`. Model names `GX4K` and `GX35` in caps.
3. **"dash cam" is two words** in prose — the current site is ~69 : 16 in favour of two
   words, so two words is the house form. `dashcam` is correct **only** inside identifiers,
   the repo name, domains and existing URLs. Never change a path.
4. **Initialisms are caps:** AI, GPS, HDR, LED, ADAS, FHD, QHD, SD, GB, TB, API, ACL, ABN.
5. **Sentence case for headings and buttons** unless the page's local pattern is clearly
   Title Case — consistency *within a page* outranks a global preference. Report the
   inconsistency, don't impose a new rule site-wide.
6. **Numbers and units:** non-breaking-space-style spacing between value and unit
   (`64 GB`, `4 K` is wrong — `4K` is a product term), `$250.00 AUD` as already used,
   24-hour or am/pm consistently within a page.
7. **Punctuation:** no double spaces; straight vs curly quotes consistent within a file;
   em dash (—) for parenthetical breaks, en dash (–) for ranges, hyphen for compounds;
   serial comma optional but consistent; no space before `?`/`!`/`:`.
8. **Compound adjectives hyphenate before a noun** ("built-in GPS", "24-hour response",
   "high-temperature cut-off") and not after ("the GPS is built in").

Where the site is internally split (e.g. curly vs straight apostrophes), **pick the
majority form, say so in the report, and apply it consistently** rather than inventing a
new convention.

## Method

Read each in-scope file top to bottom. Grep is for **inventory and confirmation**, never
for discovery — a comma splice, a dangling modifier and a subject-verb disagreement have no
greppable signature. Useful confirmation sweeps once you suspect something:

```bash
# American -ize/-or spellings in prose (review each hit; most will be code)
grep -rnE '\b[A-Za-z]+(ize|ized|izing|ization|or)\b' --include='*.tsx' --include='*.ts' app components lib config
# brand casing
grep -rniE '\bfine ?vu\b' --include='*.tsx' --include='*.ts' app components lib config | grep -v 'FineVu'
# double spaces inside string literals, straight vs curly apostrophes
grep -rn "  " --include='*.tsx' app | grep -E '"[^"]*  '
grep -rnc "’" --include='*.tsx' app components; grep -rnc "'" --include='*.tsx' app components
```

**This command reports; it does not fix.** Apply nothing unless the user asks — then apply
and flip the rows to `Applied` in the same pass.

## Deliverable 1 — narrative

Write/update `docs/copy-sweep-<today>.md` (YYYY-MM-DD), matching the shape of the sibling
audits:

1. **Coverage table** — surface, `file:line` range, read in full? y/n.
2. **Findings by class** — Spelling · Grammar · Punctuation · Capitalisation · House style
   · Consistency. Short prose for anything with nuance, a table for the mechanical ones.
3. **House-style decisions taken this pass** — every majority-form call you made, so the
   next sweep inherits it instead of re-litigating.
4. **Referred out** — factual problems noticed while reading, routed to `/content-audit`
   (with the `CA-nn` if one exists), and dead links routed to `/link-check`.
5. **Summary** — counts by class and by `Status`.

Every finding carries a `file:line` and quotes the exact string. No inferred findings.

## Deliverable 2 — the change log (do NOT skip)

Update `docs/copy-sweep-changes.csv`. Living tracker, one row per finding, keyed by a
stable `ID` (`CP-01`, `CP-02`, …).

Exact columns:

```
ID, Class, Page, Location, Old value, New value, Why it changed, Status, First found, Last updated
```

- **FROZEN once written:** `ID`, `Old value`, `First found`.
- **Editable:** `Class`, `Page`, `Location`, `New value`, `Why it changed`, `Status`,
  `Last updated`.
- **Upsert, don't blind-append.** Existing finding (match on `ID`, or same `Location` +
  issue) → update editable cells, bump `Last updated`. New `ID` only for a genuinely new
  issue. Per-pass history lives in git, not in extra rows.
- One row per concrete old→new change. The **same** fix repeated across several files is
  **one row** listing every location (quote the field — it contains commas).
- `Class` is one of: `Spelling` · `Grammar` · `Punctuation` · `Capitalisation` ·
  `House style` · `Consistency`.
- **`Status` is exactly one of three** — same contract as the other two trackers:
  - `Applied` — decided by us and in the code.
  - `Pending` — ours to decide, agreed, not applied yet. **Most copy fixes are this.**
  - `Needs approval` — beyond our call. Rare here, but real: rewording anything in
    `lib/data/warranty.ts`, `lib/data/installation-terms.ts` or `/terms-of-service`
    touches **legal commitments**, and a "grammar fix" that changes what is promised is
    not ours to make. Flag, don't fix.

**CSV integrity — verify before finishing:**

```bash
python3 -c "
import csv; rows=list(csv.reader(open('docs/copy-sweep-changes.csv')))
h=len(rows[0]); bad=[r[0] for r in rows if len(r)!=h]
print('cols',h,'rows',len(rows)-1,'malformed:',bad or 'none')"
```

## Stay in your lane

- **Never write `CP-nn` rows into `docs/content-accuracy-changes.csv` or
  `docs/forms-audit-changes.csv`**, and never renumber across trackers. Three ID spaces,
  three files, no overlap.
- **Cross-reference, don't duplicate.** If a string is already tracked as `CA-nn`, cite it;
  do not open a copy row for the same string.
- **Legal copy is read-only to this command** unless the user explicitly approves the
  rewording — see `Needs approval` above.
- **Never edit `docs/content-sources/*.txt`.** They are user-owned sources of truth, and
  that holds even for an obvious typo in them: propose it in chat and wait.

## Coverage report (required)

- **`full`**: list every file **read end to end** this pass, and any you could not. The run
  is not complete until every in-scope file is read in full.
- **`semi`**: "PARTIAL PASS" up front; what was re-read, what was deliberately not.

## Finish

Summarize inline: mode and scope run, files covered, finding count split by `Class` and by
`Status`, and any house-style decisions taken. Confirm the CSV parsed clean and that report
and CSV agree. Then offer to apply the `Pending` fixes — **do not apply them unasked.**
