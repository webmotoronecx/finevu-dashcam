# Content-accuracy audit — 2026-08-05

**Mode:** `full` · **Scope:** `all` (the eight MVP pages + shared config and `lib/data` anchors)

Triggered by the user's edits to the sources of truth on 2026-08-04 / 2026-08-05:

- `docs/content-sources/general.txt` — retail distribution escalated ("no retail network
  exists yet"), the FineVu global dealer feed **deferred** and struck as evidence, the
  coverage approval retagged `{!needs approval — pending IT}`, and the social-media
  question decided in principle (AU accounts, not Korea HQ).
- `docs/content-sources/gx35.txt` — the `{!needs approval — iOS only}` tag **removed**
  from the Mobile App line.

Both product sources are otherwise unchanged since 2026-07-27. This pass supersedes
`content-accuracy-audit-2026-07-30.md` for the MVP set.

---

## ⚠️ Read this first — one source edit needs your confirmation

`docs/content-sources/gx35.txt:45` and `general.txt:198` no longer carry the
`{!needs approval}` tag on GX35-on-iOS. Per `content-sources/README.txt`, removing the tag
is what makes a line approved — **only you** can do it, and you did. So this pass treats
GX35 iOS support as approved and closes **CA-76**.

But the prose immediately under both lines still says the opposite:

- `gx35.txt:49-51` — "still needs Fine Digital to confirm before launch"
- `general.txt:200-210` — "That reasoning is a judgement call, NOT verification. Fine
  Digital must confirm before launch"

`general.txt:198` also ends in a dangling `— Android confirmed; iOS ` with the tag text
removed mid-line, which reads more like a manual deletion than a considered approval.

**Two possible intents, opposite outcomes.** I have not edited either file. Tell me which:

1. **Approval was intended** → CA-76 closes as it does in this pass; you may want to prune
   the now-stale "must confirm before launch" prose.
2. **The tag was removed by accident** → restore it in both files and CA-76 goes back to
   `Needs approval`; no site copy changes either way, because all four surfaces already
   state iOS + Android.

---

## Summary

| # | Page(s) | Issue | Severity |
|---|---------|-------|----------|
| 1 | Installation / About / Support (+ every page's header & footer CTA) | Site tells visitors to buy from authorised retailers; **no AU retail network exists** | **Critical** — CA-80 (new) |
| 2 | All eight MVP pages (footer ×2) + site metadata | "Made in Korea" ships site-wide with no source — an ACL country-of-origin claim | **Critical** — CA-66 (scope ↑) |
| 3 | Installation | Booking wizard still charges nothing and submits nothing; thank-you page then claims a submission was received | **Critical** — CA-36 |
| 4 | Installation | Coverage data now formally provisional — "PENDING IT", do not regenerate or patch | High — CA-78 |
| 5 | Retailers (gated) | Dealer feed **deferred** by ops; it is no longer evidence for or against anything | High — CA-33 |
| 6 | GX4K | HDR attributed to the GX4K on the product page; `gx4k.txt` has no HDR anywhere | High — CA-53 (scope ↑) |
| 7 | All pages (footer + meta description) | "SONY STARVIS image sensors" on a front-and-rear product; only the front sensor is STARVIS | High — CA-61 (reopened) |
| 8 | GX4K / GX35 | The "6-metre / 9-metre cable" claim now **ships** — its disabled block was re-enabled | High — CA-14 (scope ↑) |
| 9 | Installation | "Confirmed instantly" still contradicts Terms §4 | High — CA-35 |
| 10 | Thank-you (all forms) | Copy describes a confirmation email nobody sends; gating `/thank-you` doesn't cover the six live sub-routes | High — CA-70 |
| 11 | Footer (staging) | Social decided in principle — AU accounts, so the HQ URLs must be **replaced**, never promoted | Medium — CA-75 |
| 12 | GX35 | Rear sensor called "2.13MP" in one place, "2 MP" in two others | Medium — CA-81 (new) |
| 13 | GX4K / GX35 | "FineVu Player 2.0" — the source says "FineVu **PC** Player 2.0" | Low — CA-82 (new) |
| 14 | GX4K / GX35 | 16 memory-allocation percentage splits per page, no source | Medium — CA-83 (new) |
| 15 | GX35 | "A Minute of Motion" parked-recording behaviour, no source | Medium — CA-84 (new) |
| 16 | GX35 | "Quarterly" speed-camera updates — a GX4K-only source claim | Low — CA-85 (new) |
| 17 | Installation | Installer hours (9–5, Mon–Fri) stated with no source | Medium — CA-86 (new) |
| 18 | Support / GX35 / FAQ | GX35-on-iOS — approval tag removed, closing the row | Resolved — CA-76 |

Findings 1–17 sit alongside the still-open rows re-verified below (CA-01/02, CA-13,
CA-24/25, CA-26, CA-27, CA-37, CA-38, CA-40).

---

## 1 · CA-80 (NEW) — the site sells through a retail network that does not exist

`general.txt` § RETAIL DISTRIBUTION, updated 2026-08-04:

> **Named stockists: NONE — AND NO RETAIL NETWORK EXISTS YET.** […] AutoXtreme has no
> signed Australian retail partners at all; they still have to be found and onboarded.
> […] ⚠️ with zero stockists, even this generic phrase implies a retail network that does
> not exist. Any page telling a visitor they can buy FineVu at a retailer is currently
> unsupportable.

CA-28 generalised `/about` to "leading authorised retailers" and CA-33 covers the gated
`/retailers` page. Neither covers what actually ships today: **five MVP surfaces instruct
the customer to buy from a retailer**, and `/installation` makes it a prerequisite step.

`app/installation/page.tsx:57`
```
current: { n: "1.", title: "Purchase from an authorised retailer", body: "Buy the GX4K or GX35 from an authorised FineVu retailer. …" }
```

`app/installation/page.tsx:78`
```
current: "Yes. FineVu dash cams are sold through our authorised retailers rather than directly from FineVu, so installation is booked separately. …"
```

`app/about/page.tsx:190` · `:56` · `:223`
```
current: "…sold only through leading authorised retailers, so every unit you buy is genuine…"
current: "Units sold through authorised retailers ship with the right regional firmware…"
current: "What buying a FineVu through an authorised Australian retailer actually gets you."
```

`app/support/page.tsx:135`
```
current: "…no matter which authorised retailer you purchased from."
```

Note the compounding effect with **CA-38**: the primary CTA "Find Retailer"
(`config/site.config.ts:190`, `components/Footer.tsx:65`, the `/gx4k` and `/gx35` sub-nav
CTAs at `:203`/`:213`) and the "Where to buy" tile in `LearnMoreLinks` — which ships on
all eight MVP pages — all point at `/retailers`, which is gated. So the site tells the
customer to buy at a retailer, offers no way to find one, and there are none to find.

`lib/data/warranty.ts` §3/§12/§19 also condition warranty eligibility on purchase from
"an authorised Australian retailer". That wording is legally defensible as a condition and
is **not** flagged — but it is the same assumption, in the binding document.

**`replace:` is a business call, not an edit.** Either soften site-wide to
direct-from-distributor / enquiry copy, or accept the wording as forward-looking and
launch with it. → **Needs approval.**

---

## 2 · CA-66 (scope ↑) — "Made in Korea" ships on every page, twice

CA-66 was opened against `/how-it-works`, `/learn` and `lib/data/articles.ts` — all
non-MVP. It ships on **all eight MVP pages**, from config:

`config/site.config.ts:167` → rendered at `components/Footer.tsx:52` and `:81`
```
current: origin: "Made in Korea",
         → "Made in Korea. Backed by a 3-year Australian warranty."   (footer CTA band)
         → "…SONY STARVIS image sensors. Made in Korea, trusted by drivers worldwide."
```

And in the site description that `app/layout.tsx:30` puts in every page's `<meta>`:

`config/site.config.ts:159`
```
current: "Premium 4K & 2K front and rear dash cams with SONY STARVIS image sensors. Engineered in Korea, backed by a 3-year Australian warranty."
```

No content-source file states a manufacturing origin. As CA-66 already records, country of
origin is regulated under the ACL, so "soften it" is not available — it needs a real source
or it goes. → **Needs approval**, now at site-wide scope.

---

## 3 · CA-36 — the booking wizard, restated for its current shape

The wizard changed since 2026-07-27: `next()` (`app/installation/page.tsx:163-178`) now
redirects to `thankYouUrl("installation")` instead of rendering step 6, which is retained
but unreachable (`:367-377`). **Nothing else changed.** It still:

- collects a full card number, expiry and CVC (`:357-361`);
- tells the customer "Your card is charged today" (`:351`) and "A tax receipt is emailed
  to you as soon as payment clears" (`:363`);
- advertises seven payment methods (`/installation/we-accept.svg`, `:396`);
- imports `submitForm` at `:7` and **never calls it**;
- fakes a 900 ms delay and generates the reference client-side (`:176`).

New this pass: the destination it now redirects to says
`"We've received your submission and sent a confirmation to your email."`
(`lib/data/thank-you.ts:36`). Nothing was submitted and no email is sent, so the redirect
moved the false claim rather than removing it. The `installation` variant's own comment
(`thank-you.ts:70-73`) is correct that the copy must not claim payment was received — the
shared `base()` body claims a submission was received instead.

`installation-terms.ts` §5 still makes payment-at-booking a contractual term.
→ **Needs approval** (payment provider + booking backend, or mark the wizard a demo).

---

## 4 · CA-78 — coverage data is now formally "pending IT"

`general.txt` § INSTALLATION SERVICE, added 2026-08-05:

> **STATUS 2026-08-05 (ops): PENDING IT.** The real serviced-postcode list is coming from
> the internal IT team; until it lands, `au-postcodes.json` stays provisional and defect 1
> above is not worth chasing — the file will be replaced, not patched. Do not regenerate,
> hand-edit or widen the flags in the meantime.

Two consequences for the row:

1. The remediation changes. CA-78 previously asked for the flags to be regenerated and the
   missing `scripts/build-au-postcodes.py` rebuilt. Ops has now said **do neither** — wait
   for the IT list. The `New value` is updated accordingly.
2. **The dealer-feed counter-evidence is withdrawn.** CA-78's rationale leaned on the feed
   showing no SA/TAS/ACT presence against Adelaide/Hobart/Canberra being flagged serviced.
   `general.txt:70-73` now says that feed is deferred and "no longer evidence either way".
   Adelaide, Hobart and Canberra are still flagged serviced **with nothing behind it** —
   the concern stands, the corroboration does not.

The tag is now `{!needs approval — pending IT}`. NT exclusion is confirmed and unaffected.
→ stays **Needs approval**.

---

## 5 · CA-33 — the dealer feed is deferred and carries no weight

`general.txt:134-149`:

> **FineVu global dealer list — DEFERRED, do not reference (ops, 2026-08-05).** […] It is
> not a source of truth and carries no weight in an audit. Do not cite it as evidence for
> or against any AU retail claim.

The endpoint is retained in the source only so it can be re-pulled on request. This pass
therefore strikes it from CA-33's and CA-78's reasoning. Combined with the 2026-08-04
"no retail network exists" update, CA-33 is no longer "we're waiting on a list" — it is
work not yet started. `/retailers` remains gated and must not be promoted.
→ stays **Needs approval**.

---

## 6 · CA-53 (scope ↑) — HDR is a GX35 capability claimed on the GX4K

`gx35.txt:17` gives the GX35's sensor as `SONY STARVIS 2 IMX675 5.12MP (HDR)`.
`gx4k.txt` has **no** HDR spec row and no HDR feature claim. CA-53 flagged the GX4K tile on
`/become-a-retailer`; the GX4K product page makes the same claim twice, plus once in a
shared component:

`app/gx4k/page.tsx:72`
```
current: { title: "Auto Night Vision", caption: "AI-controlled, always-on HDR mode", … }
```
`app/gx4k/page.tsx:334`
```
current: ["Night vision", "HDR auto night vision (AI-controlled)"]
```
`components/sections/OpticsSection.tsx:28`
```
current: items: ["Dual-core processor", "HDR auto night vision", "microSD up to 256 GB", "Format Free 2.0"]
```
(`OpticsSection` is currently commented out on `/gx4k:533`, so it does not ship — recorded
so re-enabling it does not silently reintroduce the claim.)

→ **Needs approval** — no source either way, and it is a headline night-vision claim.

---

## 7 · CA-61 (reopened) — STARVIS on the rear channel, in config

CA-61 was applied on `/how-it-works`, `articles.ts` and `learn/[slug]`. Two surfaces that
ship on **every page** still carry it, and were out of that pass's scope:

`config/site.config.ts:159` (→ `<meta name="description">` on all eight MVP pages)
```
current: "Premium 4K & 2K front and rear dash cams with SONY STARVIS image sensors. …"
replace: "Premium 4K & 2K dash cams with SONY STARVIS front sensors and Full HD rear cameras. …"
```
`components/Footer.tsx:80-81` (footer, every page)
```
current: "Premium 4K & 2K front and rear dash cams with SONY STARVIS image sensors. {origin}, trusted by drivers worldwide."
replace: "Premium 4K & 2K dash cams with SONY STARVIS front sensors, front and rear recording. …"
```

Both spec sheets read `Image Sensor: Front: SONY STARVIS … | Rear: CMOS 2MP`. Sitting
directly beside "front and rear dash cams", "SONY STARVIS image sensors" reads as both.
Ours to fix against an explicit, untagged source → **Pending**.

---

## 8 · CA-14 (scope ↑) — the 6 m / 9 m cable claim now ships

The 2026-07-27 pass recorded the cable-length claim as sitting "inside disabled
`{false &&}` blocks, so not shipping today". Those blocks are gone: `disappearTabs` is now
rendered on both product pages — `/gx4k` via `CoverTransition` → `FeatureTabs` (`:675`) and
`/gx35` via `FeatureTabs` (`:666`).

`app/gx4k/page.tsx:313` · `app/gx35/page.tsx:208`
```
current: "A single 6-metre cable links the rear camera and powers it at the same time … A 9-metre cable is available for larger vehicles."
```

Both sources list the cable lengths under **NOT IN SOURCE**, and the 9-metre cable is also
an availability claim (nothing in either box list or in ADDITIONAL OPTIONS). Same row, but
it has moved from latent to shipping. Full refreshed CA-14 location list:

- **F/1.8** — `gx4k:71`, `gx4k:551`; `gx35:58`, `gx35:190`, `gx35:542`; `OpticsSection:132`
- **Dual-core** — `gx4k:333`, `gx4k:572-573`; `gx35:75-76`, `gx35:387`; `OpticsSection:27-28`
- **Allwinner V536** — `gx4k:355`; `gx35:76`, `gx35:417`
- **microSD up to 256 GB** — `gx4k:339`, `gx4k:573`; `gx35:76`, `gx35:393`; `OpticsSection:28`
- **defects below 0.2% / Built In-House** — `gx4k:141`; `gx35:170`; `about:28`, `about:159`
- **6 m / 9 m cable** — `gx4k:313`; `gx35:208` ← **now shipping**
- **4 million+ sold** — still MVP-safe: only `siteConfig.brandMarquee:226/235`, and
  `BrandMarquee` is rendered nowhere.

→ stays **Needs approval**.

---

## 9 · CA-35 — "confirmed instantly" vs Terms §4

`installation-terms.ts:98` — "Submitting payment does not guarantee that an appointment has
been accepted until we send you a booking confirmation." Two of the three original page
instances still reproduce; the third moved out of reach with the step-6 bypass.

`app/installation/page.tsx:58` — "$250 flat, paid at checkout — your slot is confirmed instantly."
`app/installation/page.tsx:351` — "Your card is charged today and your booking is confirmed instantly."
`app/installation/page.tsx:370` — step 6, now **unreachable** (kept for restore).

→ stays **Needs approval** (acceptance timing is an ops fact `general.txt` does not record).

---

## 10 · CA-70 — the thank-you copy, and a gate that doesn't gate

`lib/data/thank-you.ts:36/38-41/43-44` still tells every submitter a confirmation email was
sent, that they can reply to it, and to check their spam folder for it.
`app/api/contact/route.ts` sends exactly one email, to the support inbox.

New this pass: `/thank-you` has been added to `comingSoon` (`config/site.config.ts:284`),
but `ComingSoonGate` matches the pathname **exactly**
(`components/ComingSoonGate.tsx:22` — `siteConfig.comingSoon.includes(path)`). The six
routes forms actually redirect to — `/thank-you/contact`, `/thank-you/installation`,
`/thank-you/register`, `/thank-you/warranty-claim`, `/thank-you/become-a-retailer`,
`/thank-you/services` — are **not** gated. Only the bare parent, which no form uses, is.
So the gate changes nothing for a real submitter and the copy still ships.

→ stays **Needs approval**.

---

## 11 · CA-75 — social decided in principle

`general.txt:179-190`, added 2026-08-05:

> **DECIDED 2026-08-05 (ops):** FineVu Australia will get its OWN social accounts […] the
> site links AU accounts, NOT the Korean HQ ones. The three staging URLs above are
> placeholder-only and must NOT be promoted to production config; they should be
> **replaced** by the AU handles rather than approved.

The row's `New value` changes from "AU accounts, **or** an explicit decision to link
FineVu Global" to "AU accounts — the HQ option is closed". Production stays `social: []`;
`config/site.config.staging.ts:64-68` stays staging-only. The `{!needs approval}` tag
remains because the accounts do not exist yet. → stays **Needs approval**.

---

## 12 · CA-81 (NEW) — the GX35 rear sensor is 2.13MP in one place, 2 MP in two

`app/gx35/page.tsx:225`
```
current: "…paired with a 2.13MP CMOS sensor at the rear."
replace: "…paired with a 2MP CMOS sensor at the rear."
```
`gx35.txt:17` says `Rear: CMOS 2MP`. The same page says "2 MP CMOS" at `:82` (optics
callout) and `:386` (spec row), and `/gx4k:185` uses "2MP CMOS" for the identical rear
module. So the figure is both unsourced-precise and self-contradicting.
Ours to fix against an explicit source → **Pending**.

---

## 13 · CA-82 (NEW) — "FineVu Player 2.0" vs "FineVu PC Player 2.0"

`app/gx4k/page.tsx:166` · `app/gx35/page.tsx:151`
```
current: "Android and iOS, plus FineVu Player 2.0 on desktop."
replace: "Android and iOS, plus FineVu PC Player 2.0 on desktop."
```
Both sources give the product name as **FineVu PC Player 2.0** (`gx4k.txt:40`,
`gx35.txt:52`). Same class as CA-79 ("Ai" → "AI"): a named-product mismatch against the
source, not a style preference. → **Pending**.

---

## 14 · CA-83 (NEW) — memory-allocation percentages have no source

`app/gx4k/page.tsx:403-487` and `app/gx35/page.tsx:302-382` render four `BarGraph` tabs
each, asserting exact storage splits — e.g. Driving Priority = Driving 70 / Driving Event
10 / Parking Motion 15 / Parking Event 5. That is 16 specific figures per page, 32 in all,
shipping as a customer-facing feature explanation.

Both sources name the feature (`gx4k.txt:62` "Memory Allocation (Driving/Event/Parking
Priority, Driving Only)") but state **no percentages**. The feature name is fine; the
numbers are unsourced. → **Needs approval** (needs the manuals — same gap as CA-13/CA-40).

---

## 15 · CA-84 (NEW) — "A Minute of Motion"

`app/gx35/page.tsx:128-130`
```
current: { title: "A Minute of Motion", body: "Any movement caught while parked is saved as a full minute of footage, so nothing around your car goes unrecorded." }
```
`gx35.txt` § FEATURE CLAIMS describes the 20-second Absolute Parking capture (10 s before /
10 s after) and Smart Time-Lapse. There is no one-minute motion-recording claim anywhere in
either source. It also sits beside the correctly-sourced "20-Second Impact Capture" card
(`:113`), so the page states two different parked-event durations.
→ **Needs approval**.

---

## 16 · CA-85 (NEW) — "quarterly" speed-camera updates on the GX35

`app/gx35/page.tsx:143`
```
current: "Quarterly safety-camera database updates with voice and visual alerts. Fewer surprises, fewer tickets. Requires GPS reception."
```
"Database updated quarterly" appears in `gx4k.txt:61` only. `gx35.txt:77` says just
"Speed Camera Alert requires GPS reception". Probably the same database — but that is an
assumption, and it is the same cross-model generalisation CA-63 corrected for GPS.
The "Requires GPS reception" half is correctly sourced and stays. → **Needs approval**.

---

## 17 · CA-86 (NEW) — installer hours stated with no source

`app/installation/page.tsx:301`
```
current: "Installers are available hourly from 9:00 AM to 5:00 PM, Monday to Friday."
```
Backed by `SLOTS` (`:43`, nine hourly slots 9 AM–5 PM) and by `useCalendar()` (`:106`),
which disables every Saturday and Sunday. `general.txt` § INSTALLATION SERVICE records the
price, payment timing, service model, typical duration and reschedule window — but **no
operating hours**. Same class as CA-24 (support hours): a scheduling commitment a customer
books against. → **Needs approval**.

---

## ✅ Verified correct — no change needed

Re-verified against the sources this pass, at the line numbers given:

**Specs**
- GX4K front `SONY STARVIS IMX515 · 8.5 MP · 3840×2160 · 136°` (`gx4k:331`) and rear
  `2 MP CMOS · 1920×1080 · 143° · 18 g` (`:332`) — match `gx4k.txt:17-20,38`.
- GX35 front `SONY STARVIS 2 IMX675 · 5.12 MP · 2560×1440 · 147.4°` (`gx35:385`) and rear
  `2 MP CMOS · 1920×1080 · 143.2°` (`:386`) — match `gx35.txt:17-20`.
- Weights now **ship** (the disabled blocks were re-enabled) and are correct: GX4K
  "96.5 mm … 123 g … rear … 18 g" (`gx4k:308`), GX35 "74 mm … 57 g … rear … 23 g"
  (`gx35:203`). Closes the residual risk noted under CA-15.
- GX4K `Built-in dual-band Wi-Fi (2.4 / 5 GHz) · Built-in GPS` (`gx4k:338`) — CA-10 applied.
- GX35 `Built-in Wi-Fi · External GPS antenna (included) · FineVu Wi-Fi App` (`gx35:392`),
  carousel "GPS Included" (`gx35:161-164`), and both `compareRows` GPS rows
  (`gx4k:353`, `gx35:415`) — CA-04 / CA-05 applied, and correct against `gx35.txt:25-27`.
- Parking figures: GX4K "2,325 more hours" (`gx4k:100`), "743 minutes" (`:110`); GX35
  "13,950 more hours" (`gx35:109`), "1,129 minutes" (`:119`) — all in the sources'
  relative framing, the error CA-54 corrected elsewhere.
- FVMA expanded "Front Vehicle Motion Alert" on both pages (`gx4k:123`, `gx35:138`) —
  CA-34 applied.
- "AI Heat Monitoring" casing on both pages (`gx4k:73`, `gx35:60`) — CA-79 applied.
- 20-second capture (10 s before / 10 s after) on both pages — matches both sources.
- STARVIS 2 "30% less power" (`gx35:95`, `:542`) — `gx35.txt:68`.

**Box contents / disclaimers**
- `boxItems` — GX4K 6 items (`gx4k:345`), GX35 6 items (`gx35:400-407`). **Deliberately
  shorter than the sources** per the settled design decision (CA-42 / CA-43). Not a
  finding; recorded so the next pass does not "fix" it.
- Disclaimer 3 "Hardwire Kit and Power Cable" (`config:303-305`) and all seven surfaces
  asserting it — CA-03 / CA-29 applied and correct.
- SD-card disclaimer: GX35 64 GB / GX4K 128 GB (`config:298`) and the matching tiles
  (`gx35:736`, `gx4k:737`, `page:123`) — the 64 GB is the documented AU override.
- Credit-card size comparison on GX35 only (`gx35:44`, `:202-203`, `:276`, `page:194`),
  and **absent** from `/gx4k` — CA-32 applied, convention held.

**Contact / legal**
- `lib/data/warranty.ts` §1/§12/§25 and `lib/data/installation-terms.ts` §1/§26 — trading
  name, ABN, address, `1800 818 288` and `support@finevuaustralia.com.au` all byte-match
  `general.txt` § CONTACT. CA-16 / CA-20 / CA-21 / CA-22 applied.
- `/support` email display + mailto (`support:38/41`) — CA-17 applied.
- Warranty periods table (`warranty.ts:106-114`) — main unit and rear camera 3 years /
  36 months, all accessories 6 months — agrees with disclaimer 1 (`config:293`), the
  `/support` warranty panel (`support:135`, CA-23 applied) and `gx4k.txt:41` / `gx35.txt:53`.
- `/about` disclaimer `limit={1}` (`about:249`) — CA-11 applied.
- `/about` installer coverage "a growing network … across the metro areas" (`about:60`) —
  CA-41 applied; agrees with `installation-coverage.ts` and `/installation:498`.
- `/installation` pay-at-booking throughout (`:53`, `:58`, `:84`, `:452`) — CA-08 applied,
  matches Terms §5 and `general.txt`.
- NT exclusion stated at `:85` and `:504` and enforced at `:141` — CA-12 applied,
  confirmed fact, single anchor in `installation-coverage.ts`.
- 60–90 minute duration (`:52`, `:80`), $250 flat GST-inclusive, free reschedule with
  >24 h notice (`:86` vs Terms §14) — all match `general.txt` § INSTALLATION SERVICE.
- Homepage testimonials (`page:140-153`) — verbatim from `gx4k.txt:64-71` and
  `gx35.txt:79-85`; attribution "Review on SGcarmart" correct. CA-09 applied.
- The pre-publish note is gone from both spec sections — CA-30 applied.

**Still open, re-verified unchanged** (line numbers refreshed in the CSV): CA-01 / CA-02
(`installation:82`, `:248` — the plug-in-DIY power-cable claim), CA-13 (`support:61`,
`:79`, `:147-169`), CA-24 (`support:30`), CA-25 (`support:39`), CA-26, CA-27, CA-37
(`config:157`, `:219`), CA-38, CA-40 (`support:96/100/104/108`).

---

## Coverage report — `full`

**Read end to end this pass:**

| File | Lines |
|---|---|
| `app/page.tsx` | 336 |
| `app/gx4k/page.tsx` | 919 |
| `app/gx35/page.tsx` | 911 |
| `app/installation/page.tsx` | 543 |
| `app/warranty/page.tsx` | 13 |
| `app/terms-of-service/page.tsx` | 19 |
| `app/support/page.tsx` | 406 |
| `app/about/page.tsx` | 254 |
| `config/site.config.ts` | 327 |
| `config/site.config.staging.ts` | 70 |
| `lib/data/warranty.ts` | 745 |
| `lib/data/installation-terms.ts` | 896 |
| `lib/data/installation-coverage.ts` | 156 |
| `lib/data/thank-you.ts` | full |
| `components/AppSupport.tsx` | 216 |
| `components/Footer.tsx`, `LearnMoreLinks.tsx`, `LegalDisclaimers.tsx`, `ComingSoonGate.tsx` | full |
| `app/layout.tsx` (metadata) | full |
| All three `docs/content-sources/*.txt` + `README.txt` | full |

`/warranty` and `/terms-of-service` are 13- and 19-line shells; their entire content is the
two `lib/data` anchors, both read in full.

**Not read in full** (out of MVP scope, unchanged since the 2026-07-30 non-MVP pass):
`app/faq`, `app/how-it-works`, `app/services`, `app/retailers`, `app/become-a-retailer`,
`app/contact`, `app/register`, `app/warranty-claim`, `app/learn`, `lib/data/articles.ts`.
These were grep-checked for the claims tracked in CA-14, CA-26, CA-27, CA-33, CA-59 and
CA-66 only. `components/sections/OpticsSection.tsx` was read because it duplicates GX4K
callout copy.

**Claims found with no backing source** (each is a `Needs approval` row):

| Claim | Row |
|---|---|
| Buy from an authorised retailer (5 MVP surfaces) | CA-80 (new) |
| "Made in Korea" / "Engineered in Korea", site-wide | CA-66 |
| HDR on the GX4K | CA-53 |
| 6 m / 9 m cable lengths, now shipping | CA-14 |
| F/1.8, Dual-core, Allwinner V536, microSD 256 GB, <0.2% defects | CA-14 |
| Memory-allocation percentage splits (32 figures) | CA-83 (new) |
| GX35 "A Minute of Motion" | CA-84 (new) |
| GX35 quarterly speed-cam updates | CA-85 (new) |
| Installer hours 9–5 Mon–Fri | CA-86 (new) |
| Support hours / 24-hour response SLA | CA-24 / CA-25 |
| Troubleshooting figures (12.0 V, 1–2 months, 5 min GPS, SSID) | CA-40 |
| Firmware versions v2.03 / v1.14 | CA-13 |
| "No.1 in Korea" (artwork) | CA-26 |
| 1992 / Fine Digital / Gyeonggi-do | CA-27 |
| "Global leader in dash cam technology" (every `<title>`) | CA-37 |
| Power-cable plug-in DIY claim | CA-01 / CA-02 |

No in-scope page was skipped.
