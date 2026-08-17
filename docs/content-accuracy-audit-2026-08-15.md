# Content accuracy — targeted reconciliation — 2026-08-15

**⚠️ NOT a full audit.** No page was re-read against `docs/content-sources/*`. This records
three `CA-nn` rows touched on 2026-08-15, so the narrative and
`docs/content-accuracy-changes.csv` do not drift apart — the project contract requires them
to stay consistent, and two of these rows changed as a *side effect* of forms work rather
than of an accuracy pass.

The last full pass remains **`docs/content-accuracy-audit-2026-08-05.md`**, and the full
sweep over all eight MVP pages remains **2026-07-27**. Nothing here supersedes either.

---

## CA-87 — new. The FAQ told customers to reply to an address that bounces

`app/installation/page.tsx:83`, the FAQ answer to *"Can I reschedule or cancel my
booking?"*, said:

> Of course. Plans change — **just reply to your confirmation email** or call us at least 24
> hours before your appointment…

`finevuaustralia.com.au` **has no MX record.** Verified directly:

```
$ dig +short MX finevuaustralia.com.au
(nothing)
$ dig +short MX send.finevuaustralia.com.au
10 feedback-smtp.ap-northeast-1.amazonses.com.
```

The only MX in the zone is on the `send.` subdomain and points at Amazon SES **feedback
handling for Resend's outbound mail**. It is not a mailbox and receives nothing from
customers.

So the page instructed a customer to do something that cannot work. A bounce reads as being
ignored, and this is specifically the **reschedule path** — where the alternative to
reaching us is a missed appointment and a $250 late-cancellation exposure.

**Now:** *"just call us on 1800 818 288 at least 24 hours before your appointment…"*

The phone was chosen over the support address deliberately: `support@finevuaustralia.com.au`
is on the same MX-less domain. `installation-terms.ts` §*Customer cancellations and
rescheduling* defers to *"contacting us using the details in your confirmation"*, and the
phone number is one of those details — so this stays consistent with the terms rather than
narrowing them.

**Provenance:** surfaced by the `/installation` copy sweep
(`docs/copy-sweep-2026-08-15.md`) and referred out as `CA` rather than `CP` — the sentence
was well-formed English making a false claim. It was the **last surviving instance**; the
same instruction had already been corrected in `lib/data/thank-you.ts` and
`lib/email/formAutoReply.ts` and this one was missed.

### What it uncovered — and how that was corrected

The absent MX also means `support@finevuaustralia.com.au` cannot receive mail, and every
contact enquiry, product registration, warranty claim and retailer application is delivered
to `CONTACT_TO_EMAIL`, which defaults to that address.

**This was first written up as a latent production defect — "no form has ever delivered
anything". That overstated it, and the user corrected it on 2026-08-17.** It is an
**expected development state**: the client's mailbox is provisioned at launch, and
`CONTACT_TO_EMAIL` exists precisely so submissions can be delivered somewhere readable
before it exists. In dev, pointing it at any working address is the intended workflow, not a
workaround.

What remains true and worth keeping:

- **At launch**, the mailbox and the MX record both have to be in place before the site can
  receive anything.
- **The launch check that proves it is the existing one** — submit a form once and confirm
  it arrives. It is the only step that tests inbound.
- **Being verified in Resend only proves the domain can *send*.** Verification says nothing
  about receiving, and the two are easy to conflate — which is the specific trap here.

Recorded on **FB-08**, which is a launch task, not a bug.

---

## CA-36 — closed. The wizard is real, and the row had been wrong for five days

The row described `/installation` step 5 as collecting card details while `next()` faked a
900 ms delay and generated the reference client-side, with the imported `submitForm` never
called.

**That stopped being true on 2026-08-10** when the FB-01 booking build landed. The row went
unrevised for five days, telling anyone reading the content-accuracy gate that the checkout
was a demo.

What actually ships: Stripe embedded Checkout at step 5, a real GHL calendar hold via
`/api/booking/create`, and `checkout.session.completed` promoting the appointment and
sending the confirmation and tax invoice. **Step 6 no longer asserts more than the server
knows** — it says "Payment received" and upgrades to "Booking confirmed" only once
`/api/booking/status` reports the webhook landed. The reference is the real GHL appointment
id. The unused `submitForm` import is gone.

Terms acceptance — the remaining content-accuracy gap on this row — was added the same day
as **FA-26**.

**Status → `Applied`.** What is still outstanding is not a content-accuracy question and
lives on FB-01: the placeholder `BUSINESS_ABN` makes the emailed tax invoice invalid, and
live Stripe keys plus a production webhook are unset.

---

## CA-35 — narrowed, not closed

The row cited three strings promising instant confirmation against Terms §4 (*"Submitting
payment does not guarantee that an appointment is accepted"*).

**Two no longer exist.** Step 6 was rebuilt and now reports state rather than promising an
outcome, for the reason given under CA-36.

**One survives:** `app/installation/page.tsx:55`, *"$250 flat, paid at checkout — your slot
is confirmed instantly."* That still contradicts §4.

Remains **`Needs approval`** — soften the line, or amend §4 if instant confirmation is
genuinely the process. Either way it is a business/legal call, not an edit.

---

## Referred in, still open

Raised by the same copy sweep, **not yet given `CA` rows** because each needs a source or a
decision this pass did not have:

| Location | Issue |
|---|---|
| `:81`, `:691`, `:692` | *"tax receipt"* — the system sends a **tax invoice**. Under AU GST rules these are different documents, and `installation-terms.ts` promises the invoice. Compounded by the placeholder ABN, which makes the invoice invalid anyway (FB-01) |
| `:540` | Placeholder *"e.g. JB Hi-Fi, Autobarn"* — names two specific retailers as examples. Added by the FA-16 label work; **nobody has confirmed either is an authorised FineVu retailer** |
| `:71` | The "premium finish" tile argues only from the **GX4K** on a page that books both models |

---

## Summary

| Row | Change | Status |
|---|---|---|
| **CA-87** | New — FAQ reply-to-email instruction corrected | `Applied` |
| **CA-36** | Closed — the booking wizard is real; row had been stale since 2026-08-10 | `Applied` |
| **CA-35** | Narrowed from three strings to one | `Needs approval` |

CSV verified: 9 columns, 87 rows, no malformed lines.
