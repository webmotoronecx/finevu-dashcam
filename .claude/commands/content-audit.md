---
description: Audit MVP pages against the sources of truth; update the narrative doc + change-log CSV
argument-hint: "[full|semi] [page/model or 'all'] — e.g. 'full', 'semi /gx35', default: full all"
---

# /content-audit

Run a content-accuracy audit of the FineVu site against the canonical sources of truth,
then update BOTH deliverables. This is the standard flow: the user edits a source of truth,
then runs this command.

**Arguments:** `$ARGUMENTS` may contain a **mode** (`full` or `semi`) and/or a **scope**
(a page path like `/gx35`, a model like `gx4k`, or `all`), in any order. Missing pieces
take defaults: **mode `full`, scope `all`**.

**Scope** — which pages. `all` = the eight MVP pages: `/`, `/gx4k`, `/gx35`,
`/installation`, `/warranty`, `/terms-of-service`, `/support`, `/about`.

**Mode — how thoroughly. This is a hard contract, not a suggestion:**

- **`full`** (default): **Read every in-scope page and data file top to bottom** and
  disposition **every claim** on it — specs, contact details, warranty/terms wording,
  testimonials, support hours, download links, marketing stats, disclaimers. A page is NOT
  "audited" until every claim is either matched to an anchor, flagged, or explicitly noted
  as having no source. Do not lean on prior findings or grep alone — those find only what
  you already know to look for. End with a **Coverage report** (see Finish).
- **`semi`**: Incremental. Re-verify that all currently-open findings (`Pending` /
  `Needs approval`) still reproduce, then audit only **what changed since the last pass** —
  edited `content-sources/*` files, anchors, and pages touched per `git` — plus the explicit
  scope. Faster, but partial. You MUST state up front that it is a partial pass and **list
  what was NOT re-read**, so "audited" is never ambiguous. Never report a `semi` pass as if
  it were full.

If unsure which mode the user meant, ask — do not silently run `semi` and call it done.

## Sources of truth (the ONLY authority for product facts)

- `docs/content-sources/gx4k.txt`
- `docs/content-sources/gx35.txt`
- `docs/content-sources/general.txt` — brand-level contact facts (trading name, ABN,
  website, support email, phone, address). This is the canonical anchor for contact
  details: check every page/data file that states a contact detail (footer, support,
  contact, about, and the `lib/data/warranty.ts` / `installation-terms.ts` address & phone
  blocks) against it, and flag any that disagree. Honour `{!needs approval}` here exactly as
  in the product files.

Read these first. Do not audit against memory, the live site, or the raw scrapes —
these `.txt` files are canonical.

**The sources are READ-ONLY to this command. Never edit `content-sources/*.txt`** — not the
facts, not the structure, not the annotations — and **never clear a `{!needs approval}`
tag** on your own. Only the user changes a source of truth, and only on explicit
instruction. A line tagged `{!needs approval}` is provisional: hold every site claim that
depends on it at `Needs approval`, no matter how strong the evidence, until the user
removes the tag themselves. You may propose a source edit in chat and wait for a "yes."

Honour their sections:

- **SPECS** — compare field-by-field. Wording matters: GX4K "Built-In" GPS vs GX35 "O"
  is a real distinction, not a synonym.
- **IN THE BOX / ADDITIONAL OPTIONS** — the box lists are authoritative. Something in
  "ADDITIONAL OPTIONS" is sold separately and must NOT be described as included.
- **AU OVERRIDES** — the AU bundle legitimately differs from Korea (e.g. GX35 64GB card).
  When a site value matches an AU override, it is **correct** — do not flag it.
- **NOT IN SOURCE** — claims with no basis in official data. Flag each occurrence still on
  the site as `Needs approval` (its Why should say "no source").

## Pages & shared data to check

Product facts live in `app/gx4k/page.tsx`, `app/gx35/page.tsx` (note `compareRows` is
**duplicated** in both — any change goes in both). Also read, as they carry claims:
`config/site.config.ts` (disclaimers, trust marquee), `app/support/page.tsx`,
`app/installation/page.tsx`, `app/about/page.tsx`, `app/page.tsx`,
`app/warranty/page.tsx`, `app/terms-of-service/page.tsx`.

**Warranty & terms — canonical anchors (there is no `.txt` for these on purpose).**
`lib/data/warranty.ts` and `lib/data/installation-terms.ts` ARE the canonical statement of
the warranty and installation-terms copy (see `docs/content-sources/README.txt`). Do not
expect a source-of-truth file for them and do not create one — a `.txt` copy would just
drift. Treat these two files as the anchor: check that every OTHER place asserting a
warranty/terms claim (homepage tile, product tiles, About, disclaimer 3 in
`site.config.ts`, support page) agrees with them, and flag any that disagree. This is a
CONSISTENCY check, not correctness — do not claim the terms themselves are verified against
an external legal source unless a `content-sources/legal-commitments.txt` exists to check
against.

Check for: spec mismatches, box-contents errors, included-vs-separate cable wording,
cross-page contradictions (e.g. installation page vs Terms on payment), unsourced
testimonials, and legal/warranty drift.

## Deliverable 1 — narrative

Write/update `docs/content-accuracy-audit-<today>.md` (YYYY-MM-DD). Keep the existing
format: a summary table (`# | Page(s) | Issue | Severity`), then one section per finding
with the exact `current:` / `replace:` block and file:line. End with a
"✅ Verified correct — no change needed" section. Note which prior findings a new pass
supersedes.

## Deliverable 2 — the change log (do NOT skip)

Update the single canonical CSV `docs/content-accuracy-changes.csv`. It is a **living
tracker** — one row per issue, keyed by a stable `ID` (`CA-01`, `CA-02`, …). Rules (also
pinned in CLAUDE.md §2):

- Exact columns: `ID, Page, Location, Old value, New value, Why it changed, Status,
  First found, Last updated`
- **`Old value` is FROZEN** — never edit it once written. `First found` is frozen too.
- **Editable:** `New value`, `Why it changed`, `Status`, `Last updated`.
- **Upsert, don't blind-append.** If the finding already has a row (match on `ID`, or same
  `Location` + issue), update its editable cells and set `Last updated` = today. Only add a
  NEW row with the next `ID` for a genuinely new issue.
- If a finding from a prior pass is now fixed on the page (no longer reproduces), set its
  `Status` to `Applied` rather than deleting the row.
- **`Status` is exactly one of three** (axis = who can decide it):
  - `Applied` — decided by us and in the code.
  - `Pending` — ours to decide, agreed, not applied yet.
  - `Needs approval` — beyond our call (ops/legal/business, or a fact we lack). Anything a
    source tags `{!needs approval}`, and anything depending on it, is `Needs approval`.
  The reason lives in the `Why` column, not the Status.
- One row per concrete old→new edit (same edit across several lines = one row listing them).
- CSV-quote any field containing a comma or quote. Per-audit history is git's job, not
  extra rows.

## Coverage report (required)

State plainly how much of the site this pass actually covered, so "audited" is never
ambiguous:

- **`full`**: list each in-scope page/data file **read in full** this pass, and call out any
  page you could NOT fully read. List every claim you found with **no backing source**
  (each becomes a `Needs approval` row). If any in-scope page was skipped, say so — the run
  is not complete until all in-scope pages are read end to end.
- **`semi`**: state "PARTIAL PASS" up front, list what was re-read (changed sources, git-
  touched pages, explicit scope) and **what was deliberately not re-read**. Recommend a
  `full` pass for anything untouched for a while.

## Finish

Summarize inline: mode run, how many findings, the split by Status (`Applied` / `Pending` /
`Needs approval`), and offer to apply the `Pending` ones. Do not apply code changes unless
asked. Never touch `boxItems` inference or GPS "external" wording without flagging it
`Needs approval` — those rest on box artwork.
