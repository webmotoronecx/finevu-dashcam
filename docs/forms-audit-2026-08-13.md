# Forms audit — 2026-08-13

**Mode:** `full` · **Scope:** `all` · Every in-scope file read end to end (see
[Coverage](#coverage-report)). Change log: `docs/forms-audit-changes.csv` (`FA-nn`).

> **Why this pass matters.** The previous audit (2026-07-31) described a booking wizard
> that charged nothing and submitted nothing. Between 2026-08-10 and 2026-08-11 that was
> replaced with a real Stripe + GHL booking backend, and Cloudflare Turnstile landed on the
> four email forms. **Neither tracker had been updated**, so nine rows were describing code
> that no longer exists — including two of the four "blocks launch" entries. This pass
> reconciles the log with what actually ships and adds eight findings the new code
> introduced.

---

## 1. Inventory

| Surface | Route | Defined at | Prod state | Submits to |
|---|---|---|---|---|
| Contact form | `/contact` | `app/contact/page.tsx:67-197` | **Gated** | `/api/contact` → Resend |
| Product registration | `/register` | `app/register/page.tsx:55-290` | **Gated** | `/api/contact` → Resend (1 attachment) |
| Warranty claim | `/warranty-claim` | `app/warranty-claim/page.tsx:139-389` | **Gated** | `/api/contact` → Resend (1 attachment) |
| Retailer application | `/become-a-retailer` | `app/become-a-retailer/page.tsx:142-269` | **Gated** | `/api/contact` → Resend |
| Booking wizard (5 steps) | `/installation` | `app/installation/page.tsx:210-562` | **Live** | `/api/booking/create` → GHL + Stripe |
| Embedded checkout | `/installation` step 5 | `components/booking/BookingCheckout.tsx` | **Live** | Stripe embedded Checkout (iframe) |
| Postcode / service-area check | `/installation` | `app/installation/page.tsx:564-589` | **Live** | Client-side, `au-postcodes.json` |
| Address autocomplete | `/installation` step 2 | `components/AddressAutocomplete.tsx` | **Live** | Google Places (new API) |
| Store-finder filters | `/retailers` | `app/retailers/page.tsx:128-138` | **Gated** | Client-side filter only |
| Firmware file picker | `/gx4k`, `/gx35`, `/support` | `components/sections/FirmwareDownloads.tsx:86-115` | **Live** | `/api/firmware/[id]` → R2 redirect |
| `BusinessEnquiryForm` | — | **deleted** | — | — (FA-13 closed) |
| `LandingPageLayout` `form` prop | — | **removed**, component imported by nothing | Dead | — (FA-14 closed) |

Shared plumbing: `lib/submitForm.ts`, `app/api/contact/route.ts`, `lib/data/thank-you.ts`,
`.env.example`, plus the FB-01 backend — `app/api/booking/{create,slots,status}`,
`app/api/stripe/webhook`, `lib/stripe.ts`, `lib/ghl.ts`, `lib/email/bookingConfirmation.ts`.

**All four email forms are gated in production; only the booking wizard is Live.** Gating
drives urgency, not inclusion — they ungate at launch, and `/installation` takes real money
today.

---

## 2. What changed since 2026-07-31

**Nine rows closed by work already shipped.** FA-01 (fake checkout), FA-23 (coverage split
brain), FA-24, FA-25, FA-27, FA-28 (phantom submission), FA-29, FA-31 — plus FA-13 and
FA-14 verified as genuinely gone. FA-05 dropped from High to Medium: rate limiting, CAPTCHA,
field-count and length caps all shipped, leaving only the origin check and field-name
allow-list.

**Landed alongside this pass** (commit `4cb2913`, Joffrey Getalada — this audit is rebased
on top of it): `/api/contact`'s rate limit is now **durable across serverless instances**,
backed by an Upstash Redis REST store with an atomic `INCR` + `PEXPIRE` Lua script and a
fallback to the in-memory limiter when unprovisioned. FA-05 is updated accordingly — the
cold-start reset it previously flagged no longer applies once a store is provisioned. That
commit also documented the Turnstile vars independently of FA-33; the two `.env.example`
blocks were reconciled into one during the rebase, and its `KV_REST_API_*` fallbacks — named
only in prose — were added as commented keys. **It does not change FA-34:** the Turnstile
absent-key path still fails open.

**Four previously-Applied rows re-verified as still holding**, since a row that silently
regresses is worse than one that was never closed: FA-03 (3 MB client cap matching the
server, and a loud 400 rather than a silent drop), FA-04 (`botcheck` forwarded, server
honeypot reachable at `route.ts:163`), FA-12 (`.env.example` uses
`support@finevuaustralia.com.au` throughout, matching `route.ts:8`) and FA-13/FA-14.

The headline: **step 5 no longer collects a card number in React state.** The `cc*` fields
were deleted rather than wired up, so the integration is PCI SAQ A. Payment confirmation
comes from `checkout.session.completed`, never the browser — step 6 says "Payment received"
and only upgrades to "Booking confirmed" once `/api/booking/status` confirms the appointment
was promoted (`app/installation/page.tsx:511-534`). That is the right shape, and the
soft-delete handling in `lib/ghl.ts` is a subtle trap handled correctly.

**One row escalated.** FA-26 (no terms acceptance at checkout) goes High → **Critical**. It
was theoretical when nothing was charged. It isn't now.

---

## 3. Critical

### FA-02 — Warranty evidence is still sent as filenames only

`app/warranty-claim/page.tsx:228` submits
`evidence.map((f) => f.name).join(", ")`, and `buildAttachment()`
(`app/api/contact/route.ts:113-129`) still accepts exactly one attachment — which the
receipt occupies. Unchanged since first found. On the one form where photographic evidence
*is* the substance of the claim, support receives a comma-separated list of filenames and no
images. **Blocks launch.**

### FA-26 — Nothing is agreed to before a real $250 charge · *escalated*

The strings `terms`, `consent`, `privacy` and `agree` do not appear anywhere in
`app/installation/page.tsx` or `components/booking/BookingCheckout.tsx`. Meanwhile
`lib/data/installation-terms.ts` §5 makes payment-at-booking a contractual term, and the
flow now collects name, address, phone and email and charges $250 through Stripe.

Two separate gaps, both live:

1. **No terms acceptance.** `installationTerms` is imported only by
   `app/terms-of-service/page.tsx` — the wizard neither links nor references it.
2. **No privacy notice.** `/contact` (`:183-194`) and `/become-a-retailer` (`:255-266`)
   both carry one. The form that collects the most personal data, and the only one that
   takes payment, carries none.

**Beyond our call — needs legal/ops. Blocks launch.**

---

## 4. High

### FA-32 — A refund never releases the booking *(new)*

`app/api/stripe/webhook/route.ts:106` reads:

```ts
const refundedId = (event.data.object as Stripe.Charge).metadata?.appointmentId;
```

But `createBookingSession` (`lib/stripe.ts:79-114`) sets `metadata` **only at the Checkout
Session level** and never passes `payment_intent_data.metadata`. Session metadata does not
propagate to the PaymentIntent or the Charge, so `Charge.metadata` is empty,
`refundedId` is always `undefined`, and `cancelAppointment` is never called.

**Failure:** refund a booking in Stripe → the GHL appointment stays `confirmed` → an
installer is dispatched to a customer who has already been refunded, and the slot stays
blocked. The handler's comment says it cancels rather than deletes "so the record survives
for the audit trail" — but nothing is cancelled at all.

Note `scripts/e2e-booking.mjs` signs synthetic events, so a handler that silently no-ops
still passes its checks. **Blocks launch.**

### FA-33 — Eight required env vars are missing from `.env.example` *(new)* · ✅ **FIXED 2026-08-13**

Referenced in code, absent from the file that exists to be the deploy checklist:

| Missing | Used by |
|---|---|
| `STRIPE_SECRET_KEY` | `lib/stripe.ts:28,33` |
| `STRIPE_WEBHOOK_SECRET` | `app/api/stripe/webhook/route.ts:19,31` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `components/booking/BookingCheckout.tsx:21` |
| `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_CALENDAR_ID` | `lib/ghl.ts` |
| `TURNSTILE_SECRET_KEY` | `app/api/contact/route.ts:76` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `components/Turnstile.tsx:12` |

All three subsystems fail **quietly**: booking returns a 503 the wizard renders as a soft
message, the calendar falls back to fabricated availability (FA-35), and Turnstile
verification is skipped entirely (FA-34). The R2 and Resend blocks in the same file are
documented meticulously — this is a gap, not a house style.

**Fixed 2026-08-13.** All eight are now documented, grouped into a Turnstile block and a
"Booking + payments (FB-01)" block, plus the optional `E2E_BASE_URL`. Each entry names the
subsystem that breaks without it, marks public-by-design keys apart from Sensitive ones, and
says the sets must be configured together. Both fail-open behaviours are called out where
someone setting up a deploy will read them — FA-34 under Turnstile ("do not treat *the forms
still work* as evidence it is on") and FA-35 under GHL. The `STRIPE_WEBHOOK_SECRET` note
records that the value differs between local and production, that a mismatch 400s every
delivery so payments succeed and nothing is ever confirmed, and lists the three events the
endpoint must subscribe to. The file header was rewritten to explain that `NEXT_PUBLIC_`
means inlined at build time and needing a redeploy.

Verified by diffing every `process.env` reference in `app`/`lib`/`components`/`scripts`/
`config` against the file: **23 used, 23 documented, no drift either way**, and
`NEXT_PUBLIC_` appears on only the three genuinely public keys.

> This closes the *documentation* gap only. **FA-34 and FA-35 remain open** — the fail-open
> behaviours themselves are unchanged, now documented rather than invisible.

### FA-34 — Turnstile fails open when the key is absent *(new)*

`app/api/contact/route.ts:82-83`:

```ts
async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) return true;
```

and `TURNSTILE_ENABLED` is `false` when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset
(`components/Turnstile.tsx:15`). With neither set, the CAPTCHA silently does not exist while
all four forms still submit successfully — no error, no log line, no UI difference.

The route's own comment documents this, and the deliberate **fail-closed** choice for
network errors (`:79-81`) shows the trade was considered. The gap is that the absent-key
case is indistinguishable from a working one, so the launch security gate can be signed off
on a deploy with no CAPTCHA. Compounded by FA-33, which makes the key easy to miss.
**Blocks launch.**

### FA-06 — Booking wizard still has no honeypot, and is no longer moot

The wizard has no `botcheck` field and `/api/booking/create` has no Turnstile check. Since
FA-01 was resolved this endpoint takes a **real hold on a real slot**. The per-IP limiter
(5 per 10 min, `create/route.ts:41-56`) is the only control and is in-memory and
per-instance, so a distributed caller can still take out the calendar. Not marked
launch-blocking solely because that limiter exists.

---

## 5. Medium / Low

| ID | Finding | Where | Impact |
|---|---|---|---|
| FA-35 | Availability fails **open** — `not_configured` renders every future weekday as bookable with nine hardcoded slots | `installation:169,221-223` | Missing GHL vars ⇒ a month of invented dates; customer discovers this only at step 5 |
| FA-36 | "We Accept" advertises Amex/MC/Visa/Apple Pay/PayPal/**Shop Pay**/UnionPay; no `payment_method_types` is set, and Shop Pay is not a Stripe method | `installation:556-559`, `stripe.ts:79-114` | Promise and checkout can drift; claim is baked into an SVG |
| FA-37 | `FileReader` failure silently drops the attachment while the fields still report the filename | `register:121-127`, `warranty-claim:205-212` | The remaining client-side path of the problem FA-03 was raised to fix |
| FA-05 | No CSRF/origin check, no field-name allow-list *(rate limiting now durable — see below)* | `contact/route.ts:138-176` | Route mails arbitrary caller-chosen field names; accepts cross-origin POSTs |
| FA-07 | Thank-you copy promises a confirmation email the API never sends | `thank-you.ts:32-44` | Four email forms only — the wizard's email is now real. **Blocks launch**, = CA-70 |
| FA-08 | Three incompatible validation models | `contact:107-111`, `retailer:155-158`, `installation:536` | `/contact` shows browser bubbles; retailer form won't say which field is empty |
| FA-09 | No required-field markers, while the intro implies unmarked = required | `register:163,179-231` | Seven required fields discoverable only by submitting |
| FA-15 | Nine fields with no `htmlFor` and no `id` | `become-a-retailer:202-247` | Screen reader announces nine unlabelled text boxes |
| FA-16 | Placeholder-only fields — **now 8, was 12** (card fields gone) | `installation:467-481` | Fields lose their identity on focus, one step before a real charge |
| FA-19 | No `aria-invalid`; errors not linked by `aria-describedby` | contact / register / warranty-claim | Errors heard only if navigated past |
| FA-20 | No live region on any error container | all five forms | Submit failures silent to assistive tech — now includes slot contention |
| FA-21 | No focus management on validation failure or step advance | register / warranty-claim / installation | Users not taken to the problem |
| FA-17 | Suburb/State/Postcode labels unwired (Street is correct) | `installation:400-402` | Three unlabelled fields on the address step |
| FA-18 | Upload-zone label orphaned — **partially fixed** | `register:231-233` outstanding | `/warranty-claim` zones now carry `aria-label`; `/register`'s has no accessible name |
| FA-22 | No `aria-current` on the step indicator | `installation:321-336` | 5-step progress not conveyed |
| FA-30 | No month navigation; `today` memoised — **half fixed** | `installation:118-138,149-174` | Real GHL slots now; a tab open past midnight keeps a stale grid |
| FA-10 | No timeout if the success redirect stalls | all four email forms | Button stuck on "Sending…" |
| FA-11 | Gate is an exact path match (undocumented) | `ComingSoonGate.tsx:20-22` | Correct by accident; adding `/thank-you/contact` would break every success redirect |
| FA-38 | Stale docs from the FB-01 build — orphaned `installation` thank-you variant, three stale comments, **CLAUDE.md open item 1** | `thank-you.ts:64-67` et al | Reviewer-facing: the pre-launch brief still describes a fake checkout |
| FA-39 | Step 6 states the amount twice | `installation:299,307` | Cosmetic duplication on the confirmation screen |

---

## 6. Accessibility matrix

| | Labels wired | `aria-invalid` | Errors linked | Live region | Focus mgmt | Keyboard |
|---|---|---|---|---|---|---|
| Contact | ✅ | ❌ | ❌ (native only) | ❌ | n/a (native) | ✅ |
| Registration | ✅ *(upload zone ❌)* | ❌ | ❌ | ❌ | ❌ | ✅ |
| Warranty claim | ✅ *(zone labelled, `<label>` orphaned)* | ❌ | ❌ | ❌ | ❌ | ✅ |
| Retailer application | ❌ **all 9** | ❌ | ❌ | ❌ | ❌ | ✅ |
| Booking wizard | ❌ **step 4 (8 fields)**, ❌ step 2 (3 of 4) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Postcode checker | ✅ `aria-label` | n/a | n/a | ❌ | n/a | ✅ Enter works |
| Address autocomplete | ✅ full combobox | n/a | n/a | n/a | ✅ | ✅ ↑↓/Enter/Esc |
| Store-finder filters | ✅ `aria-label` ×3 | n/a | n/a | n/a | n/a | ✅ |
| Firmware picker | ✅ `aria-label` | n/a | n/a | n/a | n/a | ✅ |

**`AddressAutocomplete` is the reference implementation** — `role="combobox"`,
`aria-expanded`, `aria-controls`, `aria-activedescendant`, a real `role="listbox"`, and
Enter swallowed while the dropdown is open so it can't submit the wizard mid-suggestion
(`:284-288`). The button grids in the wizard are now correct too (FA-29): `role="group"`
with labels and `aria-pressed` throughout, calendar cells carrying a full-date `aria-label`.

The gap is uniform and mechanical: **no form anywhere sets `aria-invalid`, links an error
with `aria-describedby`, uses a live region, or moves focus on failure.** Four rows
(FA-19/20/21 plus FA-15) would close most of it.

---

## 7. Summary

| | Count |
|---|---|
| Total findings | **39** (31 carried, 8 new) |
| Critical / High / Medium / Low | 4 / 7 / 17 / 11 |
| Applied / Pending / Needs approval | 14 / 22 / 3 |
| Blocks launch | **5** *(was 6 — FA-33 fixed in this pass)* |

### Blocks launch

| ID | Finding | Whose call |
|---|---|---|
| **FA-26** | No terms acceptance or privacy notice before a real $250 charge | Legal / ops |
| **FA-32** | `charge.refunded` never cancels the appointment | Ours — fix |
| **FA-34** | Turnstile fails open when the key is absent | Ours — fix |
| **FA-02** | Warranty evidence sent as filenames only | Ours — fix |
| **FA-07** | Thank-you copy promises an email that is never sent | Needs a decision (= CA-70) |

**Closed in this pass:** FA-33 — the eight undocumented env vars are now in `.env.example`,
verified against every `process.env` reference in the codebase.

### Should fix

FA-06 (wizard honeypot/Turnstile), FA-35 (availability fails open), FA-37 (silent attachment
drop), the accessibility cluster FA-15/16/19/20/21, and FA-38 — **rewrite CLAUDE.md open
item 1**, which still tells every reader the checkout charges nothing.

### Not ours to settle

FA-26 (legal), FA-07 (content decision), FA-36 (which payment methods are actually enabled
on the Stripe account). Also carried forward from the commit messages, outside this audit's
scope but launch-blocking for FB-01: **`BUSINESS_ABN` is still the placeholder
`00 000 000 000`**, `BOOKING_EMAIL_REDIRECT_TO` must be unset in production, and FB-08
(Resend domain verification) is unresolved.

### Cross-references

`CA-36` (booking charges nothing) is now **obsolete** — superseded by FA-01/FA-26/FA-32.
`CA-70` is the content-side twin of FA-07. `CA-78` records that the postcode dataset FA-23
consolidated onto is itself geometrically wrong. `/api/contact` hardening is CLAUDE.md §1.

---

## Coverage report

**Mode `full` — every in-scope file was read end to end this pass.**

Form surfaces: `app/contact/page.tsx` (291) · `app/register/page.tsx` (350) ·
`app/warranty-claim/page.tsx` (458) · `app/become-a-retailer/page.tsx` (408) ·
`app/installation/page.tsx` (705) · `components/booking/BookingCheckout.tsx` (131) ·
`components/AddressAutocomplete.tsx` (364) · `components/Turnstile.tsx` (100) ·
`app/retailers/page.tsx` (filter block) · `components/sections/FirmwareDownloads.tsx`
(picker block).

Shared plumbing: `lib/submitForm.ts` (41) · `app/api/contact/route.ts` (240) ·
`lib/data/thank-you.ts` (121) · `.env.example` (full, diffed against every `process.env`
reference in the codebase).

FB-01 backend: `app/api/booking/create/route.ts` (182) · `app/api/booking/status/route.ts`
(62) · `app/api/booking/slots/route.ts` (37) · `app/api/stripe/webhook/route.ts` (118) ·
`lib/stripe.ts` (157) · `lib/email/bookingConfirmation.ts` (176).

Confirmed absent/dead by grep: `components/BusinessEnquiryForm.tsx` (file does not exist),
`LandingPageLayout` `form` prop (removed; component imported by nothing).

**Read in part, not in full:** `lib/ghl.ts` (411) — its call sites were read end to end and
its contract verified from them, but the file itself was reviewed selectively. `app/retailers`
and `FirmwareDownloads` were read only at their input surfaces, which is their whole
form-relevant extent. **Not audited:** `components/ui/*` (vendored shadcn primitives, used by
none of the real forms — every form here is hand-rolled, which is why nothing comes for free).

**Nothing in scope was skipped.**
