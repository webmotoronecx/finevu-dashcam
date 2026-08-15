# Forms remediation — 2026-08-15

Not an audit. This is the **fix pass** that closed out the booking wizard's open FA rows
from `docs/forms-audit-2026-08-13.md`, plus the two shared-form rows that fell out of the
same work. No new findings were sought; every row here already existed.

Flat diff: `docs/forms-audit-changes.csv`. Backend state: `docs/forms-backend-requirements.csv`
(FB-01). Flow narrative: `docs/fb-01-booking-payment-flow.md`.

**Verification for every item below:** `npx tsc --noEmit` clean, `npm run build` clean, no
lint findings on any touched file, and `npm run test:booking` against test-mode Stripe and
the live GHL calendar — finishing at **54/55**, the single failure being the pre-existing
`BOOKING_EMAIL_REDIRECT_TO` check, unrelated to any of this. Every run ended with *"no
residue — the calendar is exactly as we found it."*

---

## The one that mattered: FA-32, refunds

`charge.refunded` had never worked, and the way it failed is worth remembering.

Stripe metadata does **not** flow between object types. Session, PaymentIntent and Charge
each carry their own bag. `createBookingSession` wrote metadata only on the Session, so
when a Charge arrived, `charge.metadata.appointmentId` was `undefined`, the guard fell
through, and the handler returned `200`. Stripe's dashboard showed the webhook delivered
successfully — because it was. Nothing logged.

The consequence was not subtle: **refund a customer and the appointment stayed `confirmed`
in GHL.** An installer gets dispatched to a job already paid back, and the slot stays
blocked against real demand until someone notices by hand.

Fixed by setting `payment_intent_data: { metadata: { appointmentId } }`, which the Charge
inherits. Three things went in alongside it, none of them optional:

- **A PaymentIntent-retrieve fallback.** Sessions created before the fix carry no inherited
  metadata and never will, so without it every booking in flight at cutover would still
  refund into silence.
- **A partial-refund guard.** `charge.refunded` fires on *any* refund. Without
  `amount_refunded < amount` a goodwill refund of part of the fee would cancel the whole job.
- **Read-first, then throw.** `cancelAppointment` throws on a 404, so an unconditional throw
  would have had Stripe retrying a no-op for three days whenever staff had already deleted
  the appointment. Gone or already-cancelled breaks; anything else propagates and retries.

### Why the test is the interesting half

The fix rested on an assumption about Stripe itself — that a Charge inherits its
PaymentIntent's metadata — and every event in `e2e-booking.mjs` is hand-built JSON.
Asserting that assumption with a synthetic Charge would have proved nothing: it would
encode the belief, then confirm it.

So the refund section creates a **real test-mode PaymentIntent**, confirms it with
`pm_card_visa`, refunds it through the API, and posts the **actual refunded Charge** to the
webhook. A Checkout Session cannot be paid via the API, but a PaymentIntent can — and the
PaymentIntent is the object the metadata rides on, so this reproduces the exact hop without
a browser.

```
✓ Charge INHERITS PaymentIntent metadata (FA-32)
```

If Stripe ever stops copying that metadata, this one check is the only thing that would say
so.

---

## FA-35 — availability failed open

The second-most consequential row, and it looked cosmetic.

When `/api/booking/slots` answered `not_configured`, the wizard fell back to rendering every
future weekday as bookable from the nine hardcoded `SLOTS`, **presented identically to real
availability**. The *server's answer* decided whether to fabricate — so a production deploy
missing the GHL keys would quietly sell invented time slots to real customers.

The dev fallback is genuinely useful, so it survives; it is now gated on `NODE_ENV` rather
than on what the server said. Production shows the "we couldn't load available dates, call
1800 818 288" branch that already existed a few lines away.

---

## FA-26 — terms acceptance

`installation-terms.ts` §5 makes payment-at-booking a contractual term, and nothing in the
five steps linked those terms, asked for agreement, or mentioned privacy — while $250 was
charged against them. The strings `terms`, `consent`, `privacy` and `agree` did not appear
in the wizard at all.

Three decisions worth recording:

1. **It gates the mount of `BookingCheckout`, not the pay button.** Mounting is what takes
   the GHL hold and opens the Stripe session, so nothing is reserved and nothing is payable
   until the customer has agreed. No held slot behind an unaccepted contract, and no wasted
   holds from people who read the terms and stop.
2. **Acceptance is an ISO timestamp, not a boolean.** There is no database, so Checkout
   session metadata is the only durable record besides the GHL appointment. *When* they
   agreed is the provable part; a boolean proves nothing after the fact.
3. **The route re-validates independently** (`422 terms_required`). The client is not
   evidence, and `/api/booking/create` is reachable directly.

**This row still blocks launch, but for a legal answer rather than an edit.** The privacy
notice points at `motoronegroup.com/privacy-policy` — the same target the other forms use —
and nobody has confirmed that policy covers FineVu installation bookings, which collect a
home address, vehicle details and a payment. The site has no privacy page of its own.

---

## FA-36 — the "We Accept" strip was a promise nothing kept

The strip advertised Amex, Mastercard, Visa, Apple Pay, PayPal, Shop Pay and UnionPay. No
`payment_method_types` was set, so Stripe offered whatever the dashboard happened to have
enabled, which no code asserted. Shop Pay is a Shopify product and not a Stripe payment
method at all.

The account was **queried rather than assumed**. Enabled: `apple_pay, bancontact, blik,
card, eps, klarna, link, mb_way, pix, satispay, zip` — a Belgian, Polish, Austrian,
Portuguese and Brazilian set on an Australian mobile-installation booking, all inherited
from Stripe defaults. PayPal and UnionPay, both promised by the artwork, were **not enabled
at all**.

Now pinned to `payment_method_types: ["card"]`, which also carries Apple Pay and Google Pay
— wallet presentations of a card rather than separate entries — so the artwork can still
promise Apple Pay honestly. PayPal, Shop Pay and UnionPay were removed from
`we-accept.svg`; they were the last three tiles, so nothing needed repositioning and only
the canvas shrank (432 → 301, original right padding preserved). The file halved, 66 KB →
33 KB.

`e2e-booking.mjs` asserts `payment_method_types` on the **real retrieved session**, not on
the request we sent, so the promise and the checkout cannot drift apart again silently.

> **Open, deliberately:** Klarna, Zip and Link were excluded rather than overlooked.
> Offering BNPL on a $250 service is a business decision, not a Stripe default to inherit.
> Adding any method means updating the SVG and its alt text in the same commit.
>
> **Caveat:** that enabled-methods list came from the **test-mode** account. Live mode
> carries its own payment method configuration, worth checking when the live keys go in —
> though the pin makes the checkout behave the same either way.

---

## FA-08 / FA-15 / FA-19 — one validation model instead of three

The site had three. `/contact` relied on the browser (`required` plus native bubbles, which
are browser-styled, vanish on the next interaction and surface only the first failing
field). `/become-a-retailer` showed one combined *"Please complete the required fields
marked with \*"* across **nine** inputs. The wizard named one problem per Continue press.

All three now follow `/register` and `/warranty-claim`: a single pass collecting every
failure, an `invalid: Record<string, boolean>`, and a message under the control it belongs
to.

The wizard keeps its hint line, but only for what it is actually good at — the step-2
**coverage answer**, which is a statement about the address as a whole rather than about any
one input, and which is frequently not an error at all.

Two rows closed as side effects, and both are recorded that way rather than as separate
work:

- **FA-15** — the retailer form's nine fields gained the `htmlFor`/`id` pairs they never
  had, because the per-field errors needed ids to point at.
- **FA-19** — `aria-invalid` + `aria-describedby` across **all five** forms. This went
  slightly past the two reference forms, which had per-field errors but nothing connecting
  them to their controls, so a screen reader announced field and error as unrelated text.

Two details in that wiring are load-bearing:

- The **serial** fields on `/register` and `/warranty-claim` describe *both* their permanent
  helper line and the error, so the hint does not drop out of the accessible description the
  moment the field goes invalid.
- The warranty-claim **UploadZone** takes `describedBy` but deliberately **not**
  `aria-invalid`: it is a `role="button"` drop target, and `aria-invalid` is unsupported on
  `button`. `eslint jsx-a11y/role-supports-aria-props` caught this correctly when it was
  first added. There is no form control there to mark either — the real `<input type="file">`
  is hidden — so the description carries the whole signal. Its only previous failure cue was
  a red border, which is colour-only.

**Still open and not covered by this:** FA-18 (orphaned upload-zone labels), FA-20 (no live
region for errors), FA-21 (no focus management on validation failure).

---

## FA-30 — half fixed, half declined

**The bug.** `useCalendarGrid` computed `today` inside a `useMemo` keyed on availability,
and availability is fetched exactly once at mount — so a tab left open overnight kept
yesterday's enabled/disabled split and went on offering a date that had already passed. A
new `useTodayKey()` re-reads the date at local midnight and feeds it in as a dependency. It
returns a date *key* rather than a `Date`, because a fresh `Date` object every render would
defeat the memo entirely.

**The month navigation, declined on the evidence.** `BOOKING_WINDOW_DAYS` is 28 and
`useCalendarGrid` already sizes the grid to the furthest day GHL returns. A "next month"
arrow therefore has nowhere to go — it could only page into empty space, advertising more
availability and delivering none, which is worse than no control at all.

What the row was really describing is a customer with no way to tell whether they are seeing
everything or just the first page. Step 3 now says so directly: *"Showing every date our
installers are free, through &lt;date&gt;"*, with the phone number for anything later.

> Worth revisiting if the GHL booking window is ever extended past what one grid can show —
> the arrow would then have somewhere real to go.

---

## Smaller rows

| Row | What changed |
|---|---|
| **FA-06** | Honeypot on `/api/booking/create`, checked before the GHL upsert and the Stripe session so a script never reaches the two calls that cost money. Returns a generic 400 rather than `/api/contact`'s fake success — the wizard needs a client secret to render, so there is no believable empty-success to return |
| **FA-16 / FA-17** | Eleven placeholder-only controls got real labels, ids and `autoComplete`. A placeholder is not a label: unreadable as an accessible name, and gone the moment you type, on the last screen before paying $250 |
| **FA-22** | `aria-current="step"` on the active indicator, and the step counter is now an `aria-live` region carrying the step label, so advancing is announced rather than only redrawn |
| **FA-38** | Deleted the orphaned `thankYouVariants.installation`, so `/thank-you/installation` 404s instead of telling a paid customer "Booking request sent". Refreshed two stale comments and replaced **CLAUDE.md open item 1**, which still claimed the checkout charges nothing and fakes the reference — untrue since 2026-08-10, and the first thing anyone reads |
| **FA-39** | Step 6 stated $250 twice; `confirmRows()` now replaces the Total row instead of appending beside it |

---

## Deliberately not done

**Turnstile on `/api/booking/create`.** The honeypot is bypassable by a script that simply
omits the field, so Turnstile is the durable fix — and `/api/booking/create` is the one
public endpoint that creates a real record and opens a payable session. It is not added
because verification would reject **every run of `e2e-booking.mjs`**, which cannot solve a
challenge without a browser. Adopting it needs a decision on using Cloudflare's test keys
(`1x0000000000000000000000000000000AA` always passes) for test runs. Recorded on FA-06.

---

## What still blocks a live booking

None of it is code.

| Item | Kind |
|---|---|
| `BUSINESS_ABN` is still `00 000 000 000`, so the invoice is not a valid Australian tax invoice — `sendBookingConfirmation` logs a warning on every send. `legalName` also needs checking against the ABR | Config |
| **FA-26** — confirm the Motor One privacy policy covers FineVu booking data, or give the site its own privacy page | Legal |
| **FA-40** — an unserviced postcode can still complete a booking and pay $250. Option (a), accept and refund by hand, is now genuinely viable since FA-32 makes a refund release the slot | Business decision |
| Live Stripe keys, and a production webhook endpoint with its own `whsec_` **subscribed to `charge.refunded`** — the FA-32 fix is inert without that event | Ops |
