# Forms audit — what's missing

**Date:** 2026-07-31 · **Scope:** all ten user-input surfaces, incl. the four gated in
production and the two dead components · **Deliverable:** report only, no code changed.

> **Second pass, same day — booking wizard only** (§6 below). `app/installation/page.tsx`
> was re-read end to end at the user's request. FA-01, FA-06, FA-08, FA-16, FA-17, FA-20,
> FA-21 and FA-22 all still reproduce at the cited lines. Nine further findings —
> **FA-23 … FA-31** — are new. Nothing else was re-read in that pass.
>
> **FA-24, FA-25, FA-27, FA-29 and FA-31 were then applied** (same day, at the user's
> request) and are marked `Applied` in the CSV; the §6 table below still describes them as
> found. FA-23, FA-26 and FA-28 are untouched — all three need a decision, not an edit.

Flat tracker: `docs/forms-audit-changes.csv` (one row per finding, same `FA-nn` IDs).
Every `file:line` below was read and verified.

---

## 1. Inventory

| # | Surface | Route | Defined at | Prod | Submits to |
|---|---------|-------|-----------|------|-----------|
| 1 | Contact form | `/contact` | `app/contact/page.tsx:66` | Gated | `/api/contact` |
| 2 | Product registration | `/register` | `app/register/page.tsx:51` | Gated | `/api/contact` + file |
| 3 | Warranty claim | `/warranty-claim` | `app/warranty-claim/page.tsx:135` | Gated | `/api/contact` + file |
| 4 | Retailer application | `/become-a-retailer` | `app/become-a-retailer/page.tsx:159` | Gated | `/api/contact` |
| 5 | Booking wizard (5 steps) | `/installation` | `app/installation/page.tsx:130` | **LIVE** | **nothing** |
| 6 | Postcode / area check | `/installation` | `app/installation/page.tsx:399` | **LIVE** | client-side JSON |
| 7 | Address autocomplete | `/installation` | `components/AddressAutocomplete.tsx:297` | **LIVE** | Google Places |
| 8 | Store-finder filters | `/retailers` | `app/retailers/page.tsx:128` | Gated | client-side filter |
| 9 | Business enquiry | — | `components/BusinessEnquiryForm.tsx:16` | Dead | **nothing (fake)** |
| 10 | `LandingPageLayout` `form` | — | `components/LandingPageLayout.tsx:27` | Dead | n/a |

Gates verified against `comingSoon` (`config/site.config.ts:264-276`); staging ungates all
(`site.config.staging.ts:20`). Shared plumbing: `lib/submitForm.ts:14` →
`app/api/contact/route.ts:34` (Resend). **Four of ten call it. One imports it and never
does. Five never touch the network.**

---

## 2. Critical — the user is actively misled

### FA-01 · The wizard takes card details and does nothing with them
`app/installation/page.tsx:176-182`

Step 5 collects card name, number, expiry and CVC (`:351-355`) under *"Your card is
charged today"* (`:345`) and *"A tax receipt is emailed to you as soon as payment clears"*
(`:357`). The button says **"Pay $250 AUD"** (`:381`). `next()` runs a 900 ms
`setTimeout`, generates a reference client-side, and redirects. `submitForm` is imported
at `:7` and **never called**. No charge, no record, no email.

Known as **CA-36**; this audit adds two things it doesn't cover:

- The fields carry `autoComplete="cc-name" / "cc-number" / "cc-exp" / "cc-csc"` — an
  explicit instruction to the browser and password manager to fill the user's **real
  stored card** into a form that discards it. **This is fixable today, independently of
  ever choosing a payment provider.**
- The wizard is not a `<form>`, so the card inputs sit outside any form context.

### FA-02 · Warranty evidence files are never sent
`app/warranty-claim/page.tsx:222`

Photos/video upload through a real multi-file zone (`:356-363`), then submit sends
`evidence.map(f => f.name).join(", ")` — **the filenames**. The API takes one attachment
(`route.ts:76-80`) and the receipt has that slot. Support gets `Evidence: IMG_4021.jpg`
and no image, on the form where that evidence *is* the claim.

### FA-03 · Oversized attachments are dropped, and the user is told it worked
`register:23`, `warranty-claim:24` vs `route.ts:20,78`

Client accepts **10 MB** and says so. Server caps base64 at **4 MB** — and base64 inflates
~33%, so the real ceiling is **~3 MB**. Over that, `route.ts:77-80` sends the email
**without the attachment and returns `{ok:true}`**. A routine 4 MB phone photo of a
receipt produces a claim with no proof of purchase and a success screen.

**Applied 2026-08-07.** Both of the suggested fixes shipped. The client cap on
`register` and `warranty-claim` is now **3 MB** (matching the 4 MB base64 server ceiling)
and the UI advertises "up to 3 MB". And the server no longer drops silently:
`buildAttachment` rejects oversize, empty, disallowed-extension and malformed attachments,
and the handler returns a **400** (*"That file couldn't be attached… under 3 MB"*) instead
of `{ok:true}`. Verified end to end — an oversize base64 and a `.exe` both return 400,
while a valid image passes the gate.

---

## 3. High — security

### FA-04 · The server honeypot is unreachable dead code
`lib/submitForm.ts:22` vs `route.ts:51`

All four forms render a hidden `botcheck` and check it client-side. `submitForm` posts
`{ subject, replyTo, fields, attachment }` — **`botcheck` is not in it**, so
`route.ts:51` can never fire. The only defence is the client check, bypassed completely by
POSTing directly. It reads as protection in review and does nothing. **One-line fix.**

**Applied 2026-08-04.** `submitForm` now forwards `botcheck` in the POST body and all four
forms pass it, dropping their client-side short-circuit so `route.ts:51` is the single,
reachable enforcement point. Verified end to end: a filled honeypot returns 200 with no
send (a direct POST carrying `botcheck` is caught the same way); an empty one proceeds
normally.

### FA-05 · `/api/contact` has no rate limiting or input bounds
`route.ts:34-106`

No rate limit, CAPTCHA, CSRF/origin check, field allow-list, field-count or length cap.
`:54-56` emails whatever keys arrive. Escaping (`:27,65-71`) and env-controlled `to`/`from`
(`:8-9`) are correct — the gap is **volume, not injection**. Overlaps `CLAUDE.md` §1.

### FA-06 · The one live form has no bot protection
`app/installation/page.tsx:130-393` — no honeypot. Moot while it submits nothing; live the
moment FA-01 is resolved.

---

## 4. Medium / Low

| ID | Finding | Where | Impact |
|----|---------|-------|--------|
| **FA-07** | Thank-you copy promises a confirmation email; the API sends one email, to support only | `lib/data/thank-you.ts:34-42` | Every submitter told to reply to an email that doesn't exist. Content accuracy is a hard gate |
| **FA-08** | Three validation models: `/contact` browser-native (no `noValidate`), `/become-a-retailer` one combined message for 9 fields, wizard one hint line | `contact:99`, `retailer:175`, `installation:373` | `/contact` shows browser bubbles unlike any other form; retailer form won't say *which* field is empty |
| **FA-09** | No required markers, while the intro implies unmarked = required | `register:154,170-218` | 7 fields required by `submit()`; user finds out by submitting |
| **FA-12** | `.env.example` says `support@finevuaustralia.com`; code defaults to `...com.au` | `.env.example:11` vs `route.ts:8` | Deploy configured from the example sends customer mail nowhere |
| **FA-10** | No timeout if the success redirect stalls | `contact:90` + 3 others | Button stuck disabled on "Sending…". Redirect-not-inline-success is a *confirmed deliberate pattern*, not a defect |
| **FA-11** | Gate is an exact path match, so `/thank-you` is gated but `/thank-you/<slug>` isn't | `site.config.ts:275`, `ComingSoonGate.tsx:21` | Correct by accident. Prefix-matching the gate would send every success to Coming Soon |
| **FA-13** | `BusinessEnquiryForm` fakes submit via `setTimeout`, has **no error state at all** | `BusinessEnquiryForm.tsx:33-41` | Imported by nothing, but reads as finished — drop it on a page and you ship a second silent-discard form |
| **FA-14** | `LandingPageLayout` unused; `CLAUDE.md` says it drives most landing pages | `LandingPageLayout.tsx:27` | Documentation drift |

---

## 5. Accessibility

Every form is hand-rolled — `components/ui/` (which ships `form`, `input`, `label`,
`select`) is **used by none of them**, so nothing came for free.

| Form | Labels associated | `aria-invalid` | Announced | Focus on error |
|------|------------------|---------------|-----------|---------------|
| `/contact` | ✅ all | ❌ | ❌ | ❌ |
| `/register` | ⚠️ upload label orphaned | ❌ | ❌ | ❌ |
| `/warranty-claim` | ⚠️ upload label orphaned | ❌ | ❌ | ❌ |
| `/become-a-retailer` | ❌ **none of 9** | ❌ | ❌ | ❌ |
| `/installation` step 2 | ❌ 3 of 4 | ❌ | ❌ | ❌ |
| `/installation` steps 4–5 | ❌ **none of 12** | ❌ | ❌ | ❌ |

| ID | Gap | Where |
|----|-----|-------|
| **FA-15** | No `htmlFor`/`id` on any of 9 fields — nine unlabelled boxes, labels don't focus | `become-a-retailer:213-260` |
| **FA-16** | Steps 4–5 **placeholder-only** across 12 fields incl. all four payment inputs; placeholders vanish on focus. Live in prod | `installation:324-338,351-355` |
| **FA-17** | Suburb/State/Postcode unlabelled (Street at `:266` is wired correctly) | `installation:286-288` |
| **FA-18** | Upload-zone labels orphaned — zone is a `div role="button"` | `register:222`, `warranty-claim:317` |
| **FA-19** | No `aria-invalid`, no `aria-describedby` linking errors to fields | all forms |
| **FA-20** | No live region — submit failures appear silently | all forms |
| **FA-21** | No focus management; wizard scrolls on step change but doesn't move focus | `installation:142,174` + all |
| **FA-22** | Step indicator visual-only, no `aria-current` | `installation:208-221` |

**The capability is already in the codebase and just wasn't applied consistently:**
`AddressAutocomplete:313-339` is a properly built combobox (`aria-expanded`,
`aria-controls`, `aria-activedescendant`, `role="listbox"/"option"`), the upload zones are
keyboard-operable (`warranty-claim:95-100`), and the postcode checker three hundred lines
from the unlabelled payment fields uses `aria-label` correctly (`installation:432`).

---

## 6. Booking wizard — deep pass (`app/installation/page.tsx`, read in full)

The wizard is the **only form live in production** and the only one that asks for money.
Below is what the first pass didn't reach. Everything is verified by reading the file;
`au-postcodes.json` figures come from counting the dataset against the wizard's own table.

### FA-23 · Two coverage answers on the same page, and the paying one is the wrong one
`installation/page.tsx:145-151` and `:89-101` vs `:417-427`

The postcode checker (§ *Installers near you*) answers from
`public/installation/au-postcodes.json` — 2,765 rows, each with a supported flag. The
**wizard never loads that file.** `validate(2)` hard-blocks only NT (`:150`) and otherwise
accepts any 4-digit postcode, falling back to a hardcoded 19-range metro table at `:93-98`.

Counting one against the other:

| | Count | Example |
|---|---|---|
| Non-NT postcodes the checker calls unserviced that the wizard will still take payment for | **1,297** | 4870 Cairns |
| …of those, ones the wizard's own table calls metro | **106** | 2010 Surry Hills, 2011 Kings Cross |
| Postcodes the wizard calls "regional, we'll confirm" that the checker calls serviced | **437** | 3350 Redan |

So a Surry Hills customer is told *"Sorry, we don't service Surry Hills yet"* by the
checker and *"Great news — certified installers service Sydney"* by the booking flow, then
pays. Which dataset is right is an ops question; that they disagree is not.

**Resolved 2026-07-31.** Both surfaces now answer through a single `resolveCoverage()` in
`lib/data/installation-coverage.ts`, which reads the JSON dataset. The wizard prefetches
the rows on mount so step-2 validation stays synchronous, and the 19-range table survives
only as a fallback for when that fetch fails. Surry Hills now reads *"We don't have a
certified installer in Surry Hills, NSW yet"* in the wizard.

**The JSON is now the single source of truth** — `METRO_COVERAGE` is commented out (kept in
the file as the restore path). With no fallback left, a failed fetch resolves to a
non-committal *"we'll confirm within one business day"*, never a refusal.

Cross-checking the two before disabling the ranges: they agreed on **79.9%** of the 2,700
non-NT postcodes — 106 the ranges called metro the dataset calls unserviced, 436 the ranges
called merely regional the dataset calls serviced. Per-range agreement ran from 100%
(Melbourne, Adelaide, Canberra, Ipswich) down to **44% Wollongong** and **59% Sunshine Coast**.

⚠️ **Correction to an earlier draft of this section, which said the JSON "was the side that
turned out to be right".** That is not supportable. Its metro flags are demonstrably broken:

```
2000 Sydney    SERVICED     2010 Surry Hills  not serviced
2007 Ultimo    not serviced 2016 Redfern      not serviced
2009 Pyrmont   SERVICED     2017 Zetland      SERVICED
```

Ultimo sits physically between Sydney and Pyrmont; Redfern is ringed by serviced postcodes.
No radius or polygon produces that, so generation failed per-postcode and wrote the failures
as `0`. An unknown number of *"not serviced"* answers are **false negatives** — customers
turned away from areas we probably do service. Also flagged serviced: `7151 Casey` (an
Antarctic base) and `9999 North Pole`.

So FA-23's defect — *two answers* — is fixed. The remaining problem is that the surviving
answer is unreliable, which is CA-78's territory, not this row's. Three things block it, and
none are ours:

- **Non-blocking was a deliberate choice.** An unserviced postcode warns and lets the
  customer continue, so no revenue path closed. Hard-blocking is the stricter option and an
  ops call — and given the false negatives above, blocking today would be actively wrong.
- **Provenance.** The flags came from `installations.dashcamsrus.com.au` polygons; AutoXtreme
  must confirm those describe their installer network.
- **The file cannot be regenerated.** `scripts/build-au-postcodes.py`, named in its own
  `note`, does not exist in this repo.

### FA-26 · A paid checkout with nothing agreed to
`:342-358`

Five steps collect name, address, phone, email and full card details and charge $250 —
with **no consent checkbox, no terms link and no privacy notice anywhere in the flow.**
`lib/data/installation-terms.ts` §5 makes payment-at-booking a contractual term, but
`installationTerms` is imported by exactly one file, `app/terms-of-service/page.tsx`, and
nothing on `/installation` links to it. Legal call, not ours.

### FA-28 · The thank-you page contradicts the button that got you there
`:181` → `lib/data/thank-you.ts:32,67`

The button reads **"Pay $250 AUD"**; the destination reads *"We've received your submission
and sent a confirmation to your email"*, with no reference, no amount and no receipt. This
is not the same defect as FA-07 — for the other four forms support does receive an email,
so only the *confirmation-to-submitter* half is false. Here the submission itself is
phantom, immediately after the user was told their card was charged. The step-6 block
(`:361-371`, now unreachable by design, see the comment at `:177-180`) at least showed the
reference and the paid summary; the redirect shows less.

### The rest

| ID | Finding | Where | Impact |
|----|---------|-------|--------|
| **FA-24** | The step-2 coverage message is dead code — `validate(2)` sets the hint, `next()` clears it on the same tick | `:151` vs `:174` | The `ok`/`warn` strings at `:99-100` can never render in the wizard; only error branches display |
| **FA-25** | Not a `<form>` — no form element, no `onSubmit`, so Enter does nothing in any of 12 text inputs | `:202-384` | Type a card number, press Enter, nothing happens. The postcode checker 50 lines below handles Enter correctly (`:432`) |
| **FA-27** | `retailer` and `notes` have no destination in **any** code path — absent from `summaryRows()` and `confirmRows()` too | `:329,338` vs `:186-199` | "Apartment parking access" is dropped even by the on-page summary, independently of FA-01 |
| **FA-29** | The four button-grid selectors convey selection visually only — no `role="radio"`/`aria-checked`, no `aria-pressed`, no group label | `:235`, `:255`, `:303`, `:313` | Screen reader hears "GX4K button" with no selected state. Distinct from FA-16, which covers the text fields |
| **FA-30** | No availability model: nine slots offered on every weekday, fixed 28-day window with no navigation, `today` memoised at mount | `:111-124`, `:311-315` | Every slot always looks free; nothing bookable past four weeks; a page left open overnight offers a stale day split |
| **FA-31** | `setProcessing(false)` runs before `router.push`, re-enabling the pay button mid-navigation | `:181` | Harmless now; a double-charge path the moment a provider is wired |

**Verified still correct in the wizard, for the record:** Back preserves all state
(`:184`); step 2's Street field is the one properly labelled input on the page (`:266-268`)
and `AddressAutocomplete` is a correctly built combobox; postcode and year inputs strip
non-digits and cap length (`:288,335`); card expiry is checked against the current month
(`:164-167`); disabled calendar days are genuinely `disabled`, so they're skipped by Tab.

---

## 7. Summary

**Blocks launch** — FA-01 (wizard/card), FA-02 (evidence lost), ~~FA-03 (attachments
dropped)~~ *(fixed 2026-08-07)*, ~~FA-04 (honeypot dead)~~ *(fixed 2026-08-04)*, FA-05 (no rate limiting), FA-07 (phantom email),
FA-12 (wrong recipient domain), **FA-23** (contradictory coverage), **FA-26** (no terms
acceptance at checkout), **FA-28** (thank-you copy contradicts the pay button).

**Should fix, not blocking** — FA-08, FA-09, FA-11, FA-13, FA-14, FA-24, FA-25, FA-27,
FA-30, FA-31, and the a11y set, of which **FA-15**, **FA-16** and **FA-29** are the ones
that actually block users.

**Not ours to settle** — whether `/installation` gets a real payment + booking backend or
is visibly marked a demo (**CA-36**, everything else about that wizard is downstream);
which coverage dataset is authoritative (**FA-23**); whether a terms checkbox is required
before payment (**FA-26**, legal); whether submitters get an auto-reply or the copy is
reworded (**FA-07** / **FA-28**); whether warranty evidence is attached properly or the UI
redirects people to email (**FA-02**).
