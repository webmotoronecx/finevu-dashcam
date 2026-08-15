# Copy sweep — /installation — 2026-08-15

**Mode:** `full` · **Scope:** `/installation`

Every in-scope file read top to bottom. Prompted by the FA-02/FA-08/FA-26/FA-30/FA-36 fix
pass on this route, which introduced new customer-facing copy that had never been
proofread — including the terms-acceptance sentence, which is copy a customer is
contractually bound by.

Change log: `docs/copy-sweep-changes.csv` (**CP-37 … CP-41**).

---

## Coverage

| Surface | File | Range | Read in full |
|---|---|---|---|
| Booking wizard, hero, how-it-works, what's-included, service area, why-experts, FAQ | `app/installation/page.tsx` | 1–880 | ✅ |
| Coverage answers rendered by the postcode checker and step 2 | `lib/data/installation-coverage.ts` | 100–119 (`COVERAGE_MESSAGES`) | ✅ |

**Not swept, deliberately:** `LearnMoreLinks`, `LegalDisclaimers` (copy lives in
`siteConfig.disclaimers`) and `Footer` all render on this page but are **shared surfaces**
that ship on every route. Sweeping them from a single-route pass would open rows scoped to
the wrong page. They belong to a `full all` run.

---

## House-style decisions taken this pass

No `docs/house-style.md` exists. These were derived from the repo majority and are the
calls this sweep applied. **Promoted to `docs/house-style.md` on 2026-08-15**, so the next
sweep inherits them instead of re-deriving.

| Axis | Decision | Evidence |
|---|---|---|
| **Locale** | Australian — `-ise`, `-our`, `centre` | `authorised` (:54, :75), `centres` (:82). No `-ize` in prose; every `-iz` hit in this file is code (`size`, `resize-y`, `justify-center`) |
| **Product term** | **`dash cam`**, two words, lowercase in prose | Overwhelming repo majority; `dashcam` appears only in a handful of other files |
| **Step/UI labels** | Title Case is the local pattern and is internally consistent | `STEP_LABELS` = "Your Dash Cam", "Date & Time", "Your Details". **Not** flagged — consistency within the set outranks the global lowercase prose rule |
| **Storage units** | **Unspaced** — `128GB`, `64GB` | Repo majority 17 unspaced vs 4 spaced. ⚠️ The 4 spaced instances (`256 GB`) live on other pages and are a **site-wide inconsistency to settle in a `full all` pass** — out of scope here |
| **Serial comma** | **Omit** | 4 lists omit it, 1 uses it → CP-38 |
| **Ampersand in headings** | Acceptable — established pattern | `Date & Time`, `Parking mode & battery protection setup`. Consistent, not flagged |
| **Ranges** | En dash | `60–90 mins` (:49), `60–90 minutes` (:77) — already correct |
| **Apostrophes** | **Unsettled** — genuinely split on this page → CP-37 |

---

## Findings

### Punctuation

**CP-37 — two apostrophe styles render side by side.** `COVERAGE_MESSAGES` is uniformly
**curly** (`isn’t`, `couldn’t`, `we’ll` — 9 strings), and step 6 uses curly once
(`We’re confirming your appointment now`, :692). Everything else on the page is **straight**
or `&apos;`: the whole `FAQS` block (`it's with the vehicle on the day`, :75) and four JSX
strings (`That&apos;s a simple DIY setup`, :452).

The reader sees both **on one screen**: the postcode checker answers in curly, the FAQ
directly beneath it answers in straight.

On count alone this is a coin flip — roughly 10 curly against 10 straight on the rendered
surface. The tiebreaker is that one *source file* is already internally consistent, so
**curly is the cheaper target**: the `&apos;` entities each become a literal `’` and nothing
else changes.

**CP-38 — the page's only serial comma**, at :69: *"electrical faults, melted connectors, or
void warranties"*. Four other lists omit it (:64, :77, :81, :452). Optional, but must be
consistent.

### Consistency

**CP-39 — the consent checkbox names a document that does not exist.** :629 says *"the
installation terms of service"*; the page it links to is titled **"Installation Booking and
Payment Terms"** (`app/terms-of-service/page.tsx:14`).

> **`Needs approval`, not `Pending`.** This is the FA-26 acceptance sentence itself.
> Rewording consent copy touches what is being agreed to, even when the only intent is to
> make the reference accurate. Flagged, not fixed.

**CP-40 — three currency formats:** `$250` (×11), `$250 AUD` (×2), `$250.00 AUD` (×4). The
recommendation is **not** to flatten them — usage is already close to correct by context.
It is to *write the rule down*: bare in prose, `AUD` where currency needs stating to an
international reader, cents only in payment and receipt contexts.

### House style

**CP-41 — `we are` where the page contracts everywhere else.** :450 *"Select the FineVu
model we are fitting."* against *"We'll use these details"* (:576), *"we'll book you in"*
(:512), *"That's a simple DIY setup"* (:452). Introduced by the FA-08 validation work.

### Nothing found

Spelling · Grammar · Capitalisation — **clean**. No misspellings, no double spaces, no
agreement or tense errors, no dangling modifiers, no space-before-punctuation. Hyphenation
of compound adjectives is correct throughout (`fuse-tap`, `front-and-rear`, `off-street`,
`4-digit`, `plug-in`, `A-pillars`, `cut-off`). `Wi-Fi`, `ADAS`, `GPS`, `UHD`, `QHD`, `2CH`,
`DIY` all correctly capitalised.

---

## Referred out — factual, NOT copy

These are `CA-nn` territory. **No `CP` rows were opened for them.**

| Location | Issue | Route to |
|---|---|---|
| `:83` FAQ | *"just reply to your confirmation email or call us"* — **`finevuaustralia.com.au` has no MX record**, so a reply hard-bounces. The page instructs customers to do something that cannot work | **FIXED 2026-08-15 as CA-87** — now points at 1800 818 288, consistent with `installation-terms.ts` §"Customer cancellations and rescheduling", which defers to "the details in your confirmation". Chasing it down established that the domain cannot receive mail AT ALL — see FB-08 |
| `:81`, `:691`, `:692` | *"tax receipt"* — the system sends a **tax invoice**. Under AU GST rules these are different documents, and `installation-terms.ts` promises the invoice | `/content-accuracy` — new |
| `:55` | *"your slot is confirmed instantly"* vs Terms §4 | Already **CA-35** (narrowed 2026-08-15) |
| `:452` | *"a simple DIY setup with the included power cable"* | Already **CA-01 / CA-02** |
| `:540` | Placeholder *"e.g. JB Hi-Fi, Autobarn"* — names two specific retailers as examples. Introduced by the FA-16 label work; **nobody has confirmed either is an authorised FineVu retailer** | `/content-accuracy` — new |
| `:71` | The "premium finish" tile argues only from the **GX4K** on a page that books both models | `/content-accuracy` — minor |

## Observations — no row opened

- **`COVERAGE_MESSAGES.metro` and `.regional` are dead strings.** Nothing references them
  outside a commented-out legacy block. Not a copy finding (a user cannot read them), but
  they will mislead the next person editing coverage copy. Worth deleting.

---

## Summary

| Class | Rows |
|---|---|
| Punctuation | 2 (CP-37, CP-38) |
| Consistency | 2 (CP-39, CP-40) |
| House style | 1 (CP-41) |
| Spelling · Grammar · Capitalisation | 0 |

| Status | Rows |
|---|---|
| `Applied` | 4 — CP-37, CP-38, CP-40, CP-41, applied on request the same day |
| `Needs approval` | 1 (CP-39 — consent copy, left alone) |

**Applied 2026-08-15.** CP-37 converted the FAQS block and the four `&apos;` entities to
curly (comments untouched). CP-38 dropped the serial comma. CP-41 contracted "we are".
**CP-40 was applied as a rule, not as edits** — no currency string changed, because usage
was already correct by context; what was missing was the written convention.

All four decisions, plus the locale / product-term / unit / heading / voice calls derived
this pass, are now recorded in **`docs/house-style.md`**, which did not previously exist.
`/copy-sweep` reads that file first, so the next sweep inherits them instead of
re-deriving. Build and lint clean after the edits.

**Referred out:** 6 (2 new, 4 already tracked).

CSV verified: 10 columns, 41 rows, no malformed lines.
