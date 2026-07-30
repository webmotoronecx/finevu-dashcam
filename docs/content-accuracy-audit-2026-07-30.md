# Content-accuracy audit — 2026-07-30 (NON-MVP pages, full pass)

**Mode:** `full` · **Scope:** every route *outside* the eight-page MVP.

This is the first audit pass over the non-MVP surface. All previous audits
(2026-07-24, -25, -27) covered only the MVP eight; the pages below had never been
checked against `docs/content-sources/*`, `lib/data/warranty.ts` or
`lib/data/installation-terms.ts`.

**Pages read end to end this pass**

| Route | File | Gated? |
|---|---|---|
| `/services` | `app/services/page.tsx` | ✅ comingSoon |
| `/retailers` | `app/retailers/page.tsx` | ✅ comingSoon |
| `/become-a-retailer` | `app/become-a-retailer/page.tsx` | ✅ comingSoon |
| `/contact` | `app/contact/page.tsx` | ✅ comingSoon |
| `/faq` | `app/faq/page.tsx` | ✅ comingSoon |
| `/how-it-works` | `app/how-it-works/page.tsx` | ✅ comingSoon |
| `/learn` | `app/learn/page.tsx` | ✅ comingSoon |
| `/learn/[slug]` | `app/learn/[slug]/page.tsx` | ✅ (parent gated) |
| `/register` | `app/register/page.tsx` | ✅ comingSoon |
| `/warranty-claim` | `app/warranty-claim/page.tsx` | ✅ comingSoon |
| `/thank-you`, `/thank-you/[type]` | `app/thank-you/…` | ❌ **ungated** |
| `/fv-specialist` | `app/fv-specialist/page.tsx` | ❌ ungated on purpose (QR landing) |

**Data files read in full:** `lib/data/articles.ts` (5 articles), `lib/data/thank-you.ts`.
**Shared components read:** `components/LearnMoreLinks.tsx`, `components/ComingSoon.tsx`,
`components/LandingPageLayout.tsx`, `components/BusinessEnquiryForm.tsx`.

> **Gating is not a defence.** Every one of these pages is live on **staging**
> (`site.config.staging.ts` ungates everything), and `/thank-you/*` is ungated in
> **production** — a customer who submits any form lands on it today.

---

## Summary

| # | Page(s) | Issue | Severity |
|---|---|---|---|
| CA-44 | Services | Three price tiers ($200/$250/$300) vs the canonical **$250 flat, every vehicle** | 🔴 Critical |
| CA-45 | Services | Sold as a **workshop-only, Victoria-only** service; canonical model is **mobile, nationwide** | 🔴 Critical |
| CA-46 | Services | Different trading name, address and phone from `general.txt` | 🔴 Critical |
| CA-47 | Services | "Request a booking, we'll confirm" — no payment; Terms §5 require payment **at booking** | 🔴 Critical |
| CA-48 | Services | "One flat rate… no hidden charges" over three tiers, then a surcharge disclaimer | 🟠 Major |
| CA-49 | Services | "Independent installers" heading whose body says the work is done by *our team* | 🟡 Minor |
| CA-50 | Services | Grey `#656565` hero box and a fake map mock ship as finished design | 🟠 Major |
| CA-51 | Retailers | Internal build note visible to customers: "Sample stockist list shown for layout" | 🟠 Major |
| CA-52 | Retailers | Hero CTA reads "Book Retailers" (it scrolls to a store list) | 🟡 Minor |
| CA-53 | Become a retailer | GX4K credited with "HDR night vision" — HDR is a GX35 STARVIS 2 attribute | 🟠 Major |
| CA-54 | Become a retailer | "Up to 13,950 hrs parking standby" restates a *relative* source claim as absolute | 🟠 Major |
| CA-55 | Contact / Become a retailer | "privacy policy" links point at `/support`; the real policy is in the footer | 🟠 Major |
| CA-56 | Become a retailer | Wholesale/margin/POS/co-op/approval-time commitments with no source | 🟠 Major |
| CA-57 | FAQ | "The GX35 records Full HD front and rear" — it is **2K QHD** front | 🔴 Critical |
| CA-58 | FAQ / Warranty claim | "manufacturer's warranty"; the anchor calls it a **voluntary warranty** by Motor One Group | 🔴 Critical |
| CA-59 | FAQ | "Plenty of our authorised retailers offer installation" — no approved retailers exist | 🟠 Major |
| CA-60 | How it works | "GX4K — 4K front + **2K rear**"; the rear is 1920×1080 FHD | 🔴 Critical |
| CA-61 | How it works / Learn / Articles | "SONY STARVIS sensors **front and rear**" — both rears are CMOS 2MP | 🔴 Critical |
| CA-62 | How it works | "our **80+ mobile installers**" — no source, and contradicts `/services` | 🟠 Major |
| CA-63 | How it works / Articles | "Built-in GPS" stated for the whole range; the GX35's is **external** | 🟠 Major |
| CA-64 | How it works / Articles | ADAS invented: "FCWS", "Front Vehicle Start Alarm (FVSA)", "forward collision" | 🟠 Major |
| CA-65 | How it works | Speed-camera alert extended to "**red-light** cameras" | 🟡 Minor |
| CA-66 | How it works / Learn / Articles | "Made in Korea" — no source | 🟠 Major |
| CA-67 | Warranty claim | No link to `/warranty` anywhere on the claim page | 🟡 Minor |
| CA-68 | Register / Warranty claim | Serial-number location, app menu path and `FV4K-XXXXXXXX` format all unsourced | 🟠 Major |
| CA-69 | Register / FAQ | Promises "firmware update notifications"; no such service exists | 🟠 Major |
| CA-70 | Thank-you (all variants) | Tells every submitter a **confirmation email** was sent; none is | 🔴 Critical |
| CA-71 | Articles | "on the GX35 you get crisp **2K both ways**" — the rear is FHD | 🔴 Critical |
| CA-72 | Articles | Comparison table lists the GX35 sensor as "SONY STARVIS" (it is **STARVIS 2**) | 🟡 Minor |
| CA-73 | Learn | Legal/insurance article carries no general-information disclaimer (the FAQ does) | 🟠 Major |
| CA-74 | Learn | Fabricated byline: "FineVu Team — Dash Cam Specialist" | 🟡 Minor |

Also **upserted** (same issue, new surfaces found): **CA-14**, **CA-26**, **CA-27**,
**CA-33**, **CA-38**.

---

## `/services` — the page is a different business

`/services` and `/installation` describe two incompatible installation businesses. The
canonical facts live in `docs/content-sources/general.txt § INSTALLATION SERVICE` and
`lib/data/installation-terms.ts`. `/installation` matches them; `/services` does not, on
four separate axes.

### CA-44 — Price

`app/services/page.tsx:47-51`, rendered at `:339`

```
current:  { tier: "Hatchback / Sedan", price: "$200" },
          { tier: "SUV / Hatchback",   price: "$250" },
          { tier: "Prestige",          price: "$300" },
replace:  a single $250 AUD flat rate (GST included), every vehicle
```

`general.txt`: *"Price: $250 AUD flat, every vehicle, GST included."* `/installation`
charges $250 flat. `/services` also renders "SUV / **Hatchback**" as the second tier —
"Hatchback" appears twice, so a hatchback owner is quoted both $200 and $250.

### CA-45 — Service model

`app/services/page.tsx:68` · `:248` · `:458-460` · `:462` · `:496-498`

```
current:  "bring your dash cam, cables and memory card to our Clayton South workshop"
          "Book yours at our Clayton South workshop."
          badge "Victoria only" · "Outside Victoria? Currently workshop-only."
replace:  mobile install — the installer comes to the customer's home or workplace
```

`general.txt`: *"Service model: Mobile — installer comes to the customer's home or
workplace."* `/installation` sells exactly that, nationwide with a postcode checker.
`/services` sells a Victoria-only drop-off workshop. A customer reading both cannot tell
what they are buying.

### CA-46 — Contact identity

`app/services/page.tsx:458-460` · `:462`

```
current:  FineVu Dashcam Australia
          Unit 28 / 266 Osborne Ave, Clayton South VIC 3169
          (03) 9099 0983
canonical (general.txt § CONTACT):
          FineVu Australia (Motor One Group Pty Ltd, trading as AutoXtreme)
          Level 9, 3 Nexus Court, Mulgrave VIC 3170
          1800 818 288
```

Three separate disagreements — trading name, address, phone — on the same block. This is
the CA-20/CA-21/CA-22 family, which was fixed everywhere else. **`Needs approval`:** we
cannot tell from here whether a Clayton South workshop actually exists as a second site.

### CA-47 — Payment

`app/services/page.tsx:54-70` (`steps`) · `:214` · `:218`

```
current:  "Request Booking" → "We'll review your request and follow up by phone or email
           to confirm availability" · "We'll confirm by email or phone"
```

`installation-terms.ts §5` and `general.txt` both make payment **due in full at the time of
booking, online at checkout — not pay-on-the-day**. This is the CA-08 contradiction
reproduced on a second page. (Note it is the mirror image of **CA-36**: `/installation`
takes card details and charges nothing; `/services` charges nothing and says so.)

### CA-48 — "Flat rate" that isn't

`app/services/page.tsx:325` vs `:47-51` and `:355-360`

```
current:  "One flat rate, everything included. No hidden charges."
          … three different prices …
          "OBD/hardwire components may incur a small additional cost depending on vehicle."
```

Two contradictions in one section: "one flat rate" over three tiers, and "no hidden
charges" immediately above a surcharge disclaimer.

### CA-49 — "Independent installers"

`app/services/page.tsx:496`

```
current:  { t: "Independent installers", d: "Work is carried out by our team at the
             Clayton South workshop." }
replace:  make the heading agree with the body (they are our team, not independents)
```

### CA-50 — Placeholder art shipping as design

`app/services/page.tsx:231-232` · `:479-493`

```
current:  {/* Image placeholder — solid #656565 box per Figma. Client to supply art. */}
          <div className="absolute inset-0 bg-[#656565]" />
          {/* Map placeholder — styled location mock per Figma. Client to supply embed. */}
```

The hero is a flat grey rectangle and the "map" is hand-drawn CSS lines with a pin — a
mock of a map of a location that may not exist (CA-46). Both need real assets before this
page can be ungated.

---

## `/retailers`

The page-level problem — three named retailers and 16 invented store records — is already
tracked as **CA-33** (`Needs approval`, reconfirmed today, still reproduces verbatim). Two
new findings sit on top of it.

### CA-51 — Internal build note visible to customers

`app/retailers/page.tsx:145`

```
current:  <span …>Sample stockist list shown for layout — connect your live retailer feed.</span>
replace:  remove
```

Same class as **CA-30** (the "confirm final figures before publishing" note that leaked onto
the product spec sections). It renders in the store-locator results bar, next to the live
"16 stores found" count — so the page simultaneously tells the customer the list is fake
and presents it as real, with tel: links and Google Maps directions.

### CA-52 — CTA label

`app/retailers/page.tsx:371`

```
current:  <a href="#where" …>Book Retailers</a>
replace:  "Where to Buy" / "Find a Store"
```

Nothing is booked; the anchor scrolls to the stockist tabs.

---

## `/become-a-retailer`

Correct and worth noting: the GX35 tile says **"External GPS included"** (`:83`) — the only
page outside the product pages that gets CA-04 right — and the 128GB / 64GB card split
(`:71`, `:83`) matches the source and the AU override.

### CA-53 — GX4K "HDR night vision"

`app/become-a-retailer/page.tsx:72`

```
current:  ["ADAS Plus, HDR night vision", " & parking mode"]   ← GX4K tile
```

`gx35.txt` lists HDR as a property of the GX35's STARVIS 2 IMX675. `gx4k.txt` contains no
HDR row and no HDR feature claim. **No source** for the GX4K.

### CA-54 — 13,950 hours restated as standby

`app/become-a-retailer/page.tsx:84`

```
current:  ["Up to 13,950 hrs", " parking standby with power saving"]
source:   "Consuming 98% less power, GX35 records 13,950 MORE hours than standard parking mode."
replace:  "13,950 more hours than standard parking mode"
```

The source figure is a *difference*, not a standby duration. As written the page claims
roughly 19 months of continuous parking standby.

### CA-55 — "privacy policy" points at `/support`

`app/become-a-retailer/page.tsx:267` and `app/contact/page.tsx:175`

```
current:  <Link href="/support">privacy policy</Link>
replace:  https://motoronegroup.com/privacy-policy/  (already used by components/Footer.tsx:113)
```

Both forms take the submitter's consent to a "privacy policy" that resolves to the support
page. The real policy is already linked in the footer, so this is a one-line fix on each.
(`components/BusinessEnquiryForm.tsx:185` has the same sentence with **no link at all** —
that component is currently unused, see the coverage note below.)

### CA-56 — Trade commitments with no source

`app/become-a-retailer/page.tsx:92` · `:98-103` · `:118-123` · `:210` · `:340` · `:369`

Unsourced business commitments: *"usually within 1–2 business days"* (×3), wholesale
pricing and "healthy margins", "POS, display units & product assets", "co-op marketing
opportunities", "product training", *"with more models on the way"*. None of this is in
any content-source file; all of it is a promise to a trade partner. Needs the distributor
to confirm before the page can go live.

Also note: the hero and cards carry **"No.1 dash cam in Korea"** (`:39`, `:47`, `:284`),
**"<0.2% defect rate"** (`:41`, `:47`) and **"made in-house by FineDigital"** (`:47`).
These are existing findings — the rows for **CA-26**, **CA-14** and **CA-27** have been
extended to cover this page rather than duplicated. ("FineDigital" is also a fourth spelling
of the parent-company name; CA-27 already asks for one to be settled.)

---

## `/faq`

### CA-57 — GX35 resolution

`app/faq/page.tsx:20`

```
current:  "The GX35 records Full HD front and rear in a smaller, cheaper package…"
replace:  "The GX35 records 2K QHD (2560×1440) at the front and Full HD at the rear…"
```

This is **CA-07 all over again** — the same error that was found on `/support` and fixed
there. Worse here, because the sentence sits inside the head-to-head answer a buyer reads
to choose between the two models: it erases the GX35's entire resolution advantage and
makes the answer's own framing ("more detail… at a distance") misleading.

### CA-58 — "manufacturer's warranty"

`app/faq/page.tsx:85` · `:92` · `app/warranty-claim/page.tsx:398`

```
current:  "covered by a manufacturer's warranty against defects"
          "The manufacturer's warranty doesn't cover…"
          "Every FineVu dash cam is covered by a manufacturer's warranty…"
anchor:   lib/data/warranty.ts:10 — "This voluntary warranty against defects is provided
          in Australia by: [Motor One Group Pty Ltd]"
replace:  "voluntary warranty against defects" (the anchor's term, used ~30× in warranty.ts)
```

This is a consistency failure against the canonical warranty anchor, and it matters: it
names the wrong warrantor. Under `warranty.ts` the obligation is Motor One Group's, not the
Korean manufacturer's. **CA-23** fixed exactly this wording on `/support`; these three
instances were never caught because the pages were out of scope.

The rest of the warranty answers are consistent with the anchor and are ✅ verified: the ACL
paragraph at `:86` is a verbatim match for the statutory wording, the exclusion list at `:92`
tracks `warranty.ts §10`, and the "either of us can help / keep your receipt" answer at
`:98` matches §§ 14–16.

### CA-59 — Retailer-supplied installation

`app/faq/page.tsx:62`

```
current:  "Plenty of our authorised retailers offer installation."
```

`general.txt § RETAIL DISTRIBUTION`: **"Named stockists: NONE APPROVED"** — there is no
confirmed AU retail partner, so nothing is known about what they do or don't offer.
Installation is also AutoXtreme's own service on `/installation`. Same `{!needs approval}`
dependency as CA-33 / CA-28.

Also in the same answer: *"A basic install with the included power cable is straightforward
for most people"* — the unverified self-powering-cable claim held under **CA-01 / CA-02**.
Row CA-01's location list has been extended.

---

## `/how-it-works`

### CA-60 — GX4K rear resolution

`app/how-it-works/page.tsx:33`

```
current:  "GX4K — 4K front + 2K rear"
replace:  "GX4K — 4K front + Full HD rear"
```

`gx4k.txt`: *Resolution: Front 3840×2160 | **Rear 1920×1080 (Full HD)***. The next bullet
(`:34`, "GX35 — 2K front + Full HD rear") is correct, which makes the pair actively
confusing: as printed, the GX4K's rear is claimed to beat the GX35's.

### CA-61 — "SONY STARVIS front and rear"

`app/how-it-works/page.tsx:35` · `lib/data/articles.ts:34` · `:214` ·
`app/learn/[slug]/page.tsx:317`

```
current:  "SONY STARVIS sensors on both"
          "Both cameras use SONY STARVIS image sensors"
          "Because FineVu uses SONY STARVIS sensors front and rear…"
          "…both with SONY STARVIS, front & rear…"
replace:  STARVIS applies to the FRONT sensor only
```

Both spec sheets are unambiguous: *Image Sensor: Front SONY STARVIS … | **Rear: CMOS 2MP***.
No rear camera in the range uses a STARVIS sensor. The articles version is the most exposed
— `articles.ts:214` builds a whole paragraph on it ("the rear footage is genuinely usable,
not a grainy afterthought") and `learn/[slug]:317` repeats it in the sidebar CTA that ships
on every article page.

### CA-62 — "80+ mobile installers"

`app/how-it-works/page.tsx:47`

```
current:  "Book one of our 80+ mobile installers."
```

No installer count in any source. It also contradicts `/services`, which describes a single
Clayton South workshop (CA-45), and `/installation`, which never states a number.

### CA-63 — Built-in GPS across the range

`app/how-it-works/page.tsx:68` · `:112` · `lib/data/articles.ts:68`

```
current:  "Enable built-in GPS tracking" · "Built-in GPS & Wi-Fi" · table row "Wi-Fi & GPS app: Yes/Yes"
```

Settled in CA-04 / CA-05: the GX4K's GPS is "Built-In", the GX35's is an **external**
GPS(2.5Φ) antenna. These three surfaces still generalise the GX4K's wording to the whole
range. (The `/become-a-retailer` tile gets this right — use its wording.)

### CA-64 — Invented ADAS features

`app/how-it-works/page.tsx:98` · `lib/data/articles.ts:123` · `:124`

```
current:  "Lane departure and forward collision warnings"
          "<strong>Forward Collision Warning (FCWS):</strong> warns you when you are closing
           on the vehicle ahead too quickly."
          "<strong>Front Vehicle Start Alarm (FVSA):</strong> a gentle nudge when traffic
           ahead moves off…"
source:   ADAS PLUS = Front Vehicle Motion Alert (FVMA) + Lane Departure Warning (LDWS)
```

Neither source lists a forward-collision system. "FVSA" is an invented acronym for the
feature that FineVu calls **FVMA** — and the article's own description of it ("traffic ahead
moves off and you have not") is the correct description of FVMA, so only the name is wrong.
**CA-34** fixed the FVMA expansion on the product pages; these three were out of scope.

### CA-65 — Red-light cameras

`app/how-it-works/page.tsx:118`

```
current:  "Get a heads-up for fixed speed and red-light cameras as you approach them."
source:   "Speed Camera Alert: database updated quarterly, requires GPS reception"
```

Red-light cameras are not mentioned in either source.

### CA-66 — "Made in Korea"

`app/how-it-works/page.tsx:36` · `app/learn/page.tsx:213` · `lib/data/articles.ts:98` · `:259`

No manufacturing-origin statement exists in any content-source file. Related but distinct
from CA-27 (corporate heritage) — this is a country-of-origin claim, which in Australia is
regulated under the ACL's country-of-origin provisions, so it needs a real source rather
than a soften-or-remove.

`app/learn/page.tsx:213` and `articles.ts:98` also carry **"4 million+ sold worldwide"**,
which `gx4k.txt § NOT IN SOURCE` names explicitly. CA-14's location list has been extended
rather than a new row added.

---

## `/register` and `/warranty-claim`

Both forms are well built — real validation, honeypot, receipt attachment, and they post to
the live Resend route. The findings are copy, not plumbing.

### CA-67 — The warranty claim page never links the warranty

`app/warranty-claim/page.tsx:428`

The only outbound link in the "Before you claim" aside goes to `/support` as a
"troubleshooting guide". `/warranty` — the canonical document that governs the claim the
customer is about to make, including what's covered, the proof-of-purchase requirement and
the remedy discretion — is not linked anywhere on the page.

Also `:46`: *"We repair or replace your camera"* summarises `warranty.ts §6`, which is a
four-way discretion (repair / replace / equivalent replacement / another agreed remedy).
Not wrong, but a summary of a legal discretion should say "at our option".

### CA-68 — Unsourced device instructions

`app/register/page.tsx:210-211` · `:322-323` · `app/warranty-claim/page.tsx:305-306`

```
current:  placeholder "e.g. FV4K-XXXXXXXX"
          "Printed on the sticker on the back of your camera, and on the side of the box."
          "In the FineVu Wi-Fi app … under Settings → Device information."
```

Three device-specific facts — the serial format, its physical location, and an app menu
path — none of which appear in any source. Both forms make the serial **required**, so a
customer who can't find it where we say it is cannot submit.

### CA-69 — Firmware update notifications

`app/register/page.tsx:33` · `:263` · `app/faq/page.tsx:104`

```
current:  "Firmware update notifications for your model"
          "Email me firmware update notifications for my model. No marketing — just updates…"
          "Registered owners also get firmware update notifications for their model."
```

The registration form emails a single message to the support inbox and stores nothing.
There is no list, no scheduler and no sender. The checkbox is opt-in **by default**
(`useState(true)`), so every registrant is signed up to a service that doesn't exist.
Compounding it, **CA-13** has firmware versions on `/support` unsourced and every download
link dead — so even a manual fulfilment has nothing to send.

---

## `/thank-you` and `/thank-you/[type]` — ungated in production

### CA-70 — A confirmation email that is never sent

`lib/data/thank-you.ts:36` · `:38-41` · `:43-44`, rendered on all seven routes

```
current:  "We've received your submission and sent a confirmation to your email."
          "Reply to the confirmation email any time if you have questions."
          "Can't see the email? Check your spam or junk folder — and add us to your contacts…"
```

`app/api/contact/route.ts` sends **one** email, to the support inbox. The submitter receives
nothing. Three separate lines tell them otherwise, and the footnote actively sends them to
dig through a spam folder for a message that does not exist.

This is flagged in a comment at the top of `lib/data/thank-you.ts` as kept verbatim at the
user's direction pending a decision — but it had **no CSV row**, so it was invisible to the
launch gate. It has one now. Two ways out: add a submitter auto-reply in the API route, or
reword the three lines. Either is fine; shipping neither is not, because these routes are
**not gated** — `/thank-you/contact` is what a customer sees today.

Everything else in `thank-you.ts` is ✅ correct, including the deliberately careful
`installation` variant comment (never claims a booking is locked in or paid — the right call
given CA-36) and the `robots: { index: false }` pin on both routes.

---

## `/learn` and the article set

### CA-71 — "2K both ways"

`lib/data/articles.ts:214`

```
current:  "on the GX35 you get crisp 2K both ways"
replace:  "on the GX35, 2K up front with a Full HD rear channel"
```

`gx35.txt`: Rear 1920×1080. Same sentence as CA-61; the resolution error is separable from
the sensor error, so it is tracked separately.

### CA-72 — GX35 sensor in the comparison table

`lib/data/articles.ts:55`

```
current:  <td>SONY STARVIS</td>   ← GX35 column, same as the GX4K column
replace:  SONY STARVIS 2 (IMX675)
```

Understates the GX35 and flattens the one genuine sensor-generation difference between the
models — the article is a *buying guide* whose whole job is that comparison.

### CA-73 — Legal and insurance guidance with no disclaimer

`lib/data/articles.ts:224-265` (`dash-cam-laws-australia`)

The article makes categorical legal statements ("dash cams are legal in every Australian
state and territory", "there is no law against…", plus audio-recording and publication
guidance) and insurance advice, with no general-information disclaimer anywhere. `/faq`
carries exactly the right one at `app/faq/page.tsx:203-216` — including the ACL
non-exclusion paragraph — and the same article's subject matter is what that box was
written for. Reuse it.

### CA-74 — Fabricated byline

`app/learn/[slug]/page.tsx:195-196`, from `articles.ts` `author: "FineVu Team"`

```
current:  FineVu Team
          Dash Cam Specialist
```

Rendered with an avatar as a named author credential on all five articles, including the
legal/insurance one. Either drop the byline block or attribute to the company.

---

## ✅ Verified correct — no change needed

- **`/fv-specialist`** — a single `<video>` element and URL-param plumbing. No product,
  contact, legal or marketing claim anywhere on the page. Nothing to audit. (Ungated on
  purpose as a QR landing page; correctly excluded from `comingSoon`.)
- **Contact details** on `/contact` (`:28`, `:31`, `:37`, `:40`) — phone **1800 818 288**
  and **support@finevuaustralia.com.au**, display and `tel:`/`mailto:` targets, all match
  `general.txt`. The CA-17 / CA-18 domain error does not recur.
- **`/become-a-retailer`** — GX35 **"External GPS included"** (`:83`), 128GB/64GB card split
  (`:71`, `:83`), GX4K "True 4K front & Full HD rear" (`:68`), sensor part numbers IMX515 /
  IMX675 with MP and resolution (`:70`, `:82`), phone at `:403`, and the FAQ's 3-year /
  6-month warranty split (`:120`) — all match the sources and `warranty.ts §5`.
- **`/faq`** warranty answers other than the "manufacturer's" wording — ACL paragraph
  (`:86`), exclusions (`:92`), retailer-vs-us claim routing (`:98`) — consistent with
  `lib/data/warranty.ts`.
- **`/faq`** "Important information" box (`:203-216`) — correctly scoped, and its ACL
  non-exclusion sentence is the model the articles should copy (CA-73).
- **`/retailers`** — "3-year Australian warranty" (`:100`, `:368`) and AutoXtreme as
  "official Australian distributor" (`:99`, `:382`) are both correct per `general.txt` and
  `warranty.ts`. The problem with this page is *who* it names, not what it claims about them.
- **`lib/data/thank-you.ts`** — the `installation` variant's restraint (CA-36-aware) and the
  `noindex` pinning on both thank-you routes.
- **AU spelling** — "authorised" throughout the non-MVP set; no "authorized" found. CA-28's
  convention holds.

## ⚠️ Claims found with no backing source (each is a `Needs approval` row)

CA-46 (Clayton South workshop identity), CA-50 (art), CA-53 (GX4K HDR), CA-56 (all trade
terms), CA-59 (retailer-supplied installation), CA-62 (80+ installers), CA-65 (red-light
cameras), CA-66 (Made in Korea), CA-68 (serial format/location/app path), CA-69 (firmware
notification service), CA-70 (confirmation email — user-directed hold), CA-74 (byline).

## Coverage report

**Full pass. Every non-MVP route was read end to end**, plus `lib/data/articles.ts` and
`lib/data/thank-you.ts` in full. No in-scope page was skipped or sampled.

Two components were read and found to be **dead code** — not imported by any route:

- `components/LandingPageLayout.tsx` (209 lines) — the template CLAUDE.md describes as
  driving "most audience landing pages". Nothing imports it any more.
- `components/BusinessEnquiryForm.tsx` (185 lines) — carries the CA-55 sentence
  ("you agree to our privacy policy") with **no link at all**.

They are unaudited on purpose: they render nothing today, so they carry no live claim. Flagged
here only so nobody re-mounts them without an audit first. Recommend deleting both, alongside
`app/gx35/page_bak.tsx` (CLAUDE.md open item 4).

**Not in scope, unchanged:** the eight MVP pages, `config/site.config.ts`,
`lib/data/warranty.ts`, `lib/data/installation-terms.ts` — all last fully audited
**2026-07-27** (`docs/content-accuracy-audit-2026-07-27.md`). `warranty.ts`,
`installation-terms.ts` and `general.txt` were read this pass **as anchors**, to check the
non-MVP pages against; they were not re-audited as subjects.

## What this pass supersedes

Nothing. It is additive — the first coverage of these pages. Five existing rows were
**extended** (not superseded) with newly found surfaces: **CA-01** (FAQ's plug-in-cable
claim), **CA-14** (`/learn`, articles, `/become-a-retailer`), **CA-26** and **CA-27**
(`/become-a-retailer`), **CA-33** (reconfirmed, still reproduces), **CA-38** (gated-CTA
targets now also found on `/how-it-works`, `/faq`, `/learn` and inside article HTML).
