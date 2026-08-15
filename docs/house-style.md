# House style

The written conventions for copy a customer can read. `/copy-sweep` reads this file first
and follows it; anything not covered here it re-derives from the repo majority and reports.

Established 2026-08-15 from the `/installation` sweep (`docs/copy-sweep-2026-08-15.md`).
**Derived from what the repo already does — not imposed.** Where a rule below records a
majority, the minority instances are listed so they can be settled rather than forgotten.

> **Scope: prose only.** None of this applies to CSS classes, prop names, object keys,
> variable names, file paths, URLs, slugs, `id`/`href` anchors or developer comments. A
> string a user cannot read in a browser is out of scope.

> **Sources of truth outrank this file.** For product names, model numbers and feature
> names, `docs/content-sources/*.txt` wins — those are facts, not style. A casing
> disagreement with a source is a `CA-nn` finding, **even when the only difference is
> casing** (precedent: CA-79, `"Ai"` → `"AI"`).

---

## Locale — Australian English

`-ise`, `-our`, `centre`, `licence` (noun) / `license` (verb).

`authorised`, `centres`, `organisation`. No `-ize` appears in prose anywhere in the repo;
every `-iz` hit is code (`size`, `resize-y`, `justify-center`). **Never "fix" an
identifier** — `justify-center` and `bg-color` are correct as written.

## Product and domain terms

| Term | Form |
|---|---|
| **dash cam** | Two words, lowercase in prose. `dashcam` is wrong in copy |
| **FineVu**, **GX4K**, **GX35** | Exact casing, always |
| **Wi-Fi** | Hyphen, both caps |
| Initialisms | Caps: AI, GPS, HDR, LED, ADAS, UHD, QHD, GB, TB, PDF, API, URL, DIY, 2CH |

## Storage units — unspaced

`128GB`, `64GB`. Repo majority is 17 unspaced against 4 spaced.

> ⚠️ **Unsettled:** the 4 spaced instances are all `256 GB`, on pages outside the
> `/installation` sweep. They contradict this rule and should be settled in a `full all`
> pass. Note `256 GB` is *also* an unverified spec (CLAUDE.md open item 3), so check the
> source before changing the number as well as the spacing.

## Currency

Three forms, each with its own job. Recorded because usage was already near-correct by
context but nothing wrote the rule down, so it drifted (CP-40).

| Form | Use |
|---|---|
| `$250` | Marketing prose — "one flat rate of $250", "$250 flat" |
| `$250 AUD` | Where the currency has to be stated to an international reader — hero stats, the price badge |
| `$250.00 AUD` | Payment and receipt contexts only, where cents are conventional — order summary, confirmation, invoice lines |

**Do not flatten to one form.** Cents in marketing copy read as fussy; a bare `$250` on a
receipt reads as imprecise.

## Punctuation

- **Apostrophes: curly (`’`).** Not `'`, and not the `&apos;` entity — write the character.
  Settled 2026-08-15 (CP-37): `/installation` rendered curly and straight side by side, the
  postcode checker answering in one style and the FAQ beneath it in the other.
- **Serial comma: omit.** "hardwiring, configuration and testing", not "…, and testing".
- **Em dash (—)** for a parenthetical break, **en dash (–)** for ranges (`60–90 minutes`),
  hyphen for compounds.
- **No double spaces.** No space before `?` `!` `:` `;`.
- **Compound adjectives hyphenate before a noun** and not after: "built-in GPS", "24-hour
  response", "front-and-rear install", "off-street access", "4-digit postcode" — but "the
  GPS is built in".

## Headings, labels and buttons

**Consistency within a page outranks any global preference.**

- Section headings and body copy: **sentence case**.
- Wizard step labels and short UI labels: **Title Case is the established pattern** and is
  internally consistent — "Your Dash Cam", "Date & Time", "Your Details". Leave it.
- `&` is acceptable in headings and labels where it already appears ("Parking mode &
  battery protection setup"). Use "and" in body prose.

## Voice

**Contract.** The copy uses "we'll", "that's", "there's" throughout; an uncontracted "we
are" reads stiffer than the text around it (CP-41).

Validation and error messages are **imperative and specific**: "Enter your suburb.",
"Select a start time.", "Enter a 4-digit postcode." Not "This field is required."

---

## Legal, warranty and consent copy is read-only

Anything in warranty terms, installation terms, privacy notices or a consent control is
**flagged, never fixed** — a wording change there alters a commitment, and that is not a
copy-sweep decision. Open the row as `Needs approval` and leave the string alone.

Live example: **CP-39**, the `/installation` terms checkbox, which links to "the
installation terms of service" while the page it opens is titled "Installation Booking and
Payment Terms". Making the reference accurate still means rewording the sentence a customer
agrees to, so it waits for sign-off.
