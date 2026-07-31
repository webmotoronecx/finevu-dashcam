# Forms audit — what's missing

**Date:** 2026-07-31 · **Scope:** all ten user-input surfaces, incl. the four gated in
production and the two dead components · **Deliverable:** report only, no code changed.

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

---

## 3. High — security

### FA-04 · The server honeypot is unreachable dead code
`lib/submitForm.ts:22` vs `route.ts:51`

All four forms render a hidden `botcheck` and check it client-side. `submitForm` posts
`{ subject, replyTo, fields, attachment }` — **`botcheck` is not in it**, so
`route.ts:51` can never fire. The only defence is the client check, bypassed completely by
POSTing directly. It reads as protection in review and does nothing. **One-line fix.**

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

## 6. Summary

**Blocks launch** — FA-01 (wizard/card), FA-02 (evidence lost), FA-03 (attachments
dropped), FA-04 (honeypot dead), FA-05 (no rate limiting), FA-07 (phantom email),
FA-12 (wrong recipient domain).

**Should fix, not blocking** — FA-08, FA-09, FA-11, FA-13, FA-14, and the a11y set, of
which **FA-15** and **FA-16** are the two that actually block users.

**Not ours to settle** — whether `/installation` gets a real payment + booking backend or
is visibly marked a demo (**CA-36**, everything else about that wizard is downstream);
whether submitters get an auto-reply or the copy is reworded (**FA-07**); whether warranty
evidence is attached properly or the UI redirects people to email (**FA-02**).
