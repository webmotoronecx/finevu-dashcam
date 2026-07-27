# Content-accuracy audit — 2026-07-27

**Mode:** `full` · **Scope:** all eight MVP pages (`/`, `/gx4k`, `/gx35`, `/installation`,
`/warranty`, `/terms-of-service`, `/support`, `/about`) plus `config/site.config.ts`,
`lib/data/warranty.ts`, `lib/data/installation-terms.ts` and the shared components that
render on every MVP page (`Footer`, `LearnMoreLinks`, `LegalDisclaimers`).

**Trigger:** the user updated `docs/content-sources/` (`general.txt`, `gx4k.txt`, `gx35.txt`
all edited 2026-07-27). Those edits changed the audit materially — see below.

Supersedes the 2026-07-25 pass. Change log: `docs/content-accuracy-changes.csv`.

---

## What changed in the sources — and what it resolves

Three things moved, and they close four long-standing blockers:

1. **The Hardwire Kit is now an IN THE BOX item in both product sources, with the
   `{!needs approval}` tag removed**, alongside a separate `Power Cable`. The
   ADDITIONAL OPTIONS sections are gone. → **CA-03 and CA-29 close; CA-01/CA-02 half-close.**
   This is **CLAUDE.md open item 1, resolved** — the seven site surfaces claiming
   "Includes Hardwire Kit & Power Cable" were right all along, and it was `boxItems` that
   was wrong. `boxItems` has since been corrected on both pages (though see CA-06/CA-31 —
   the correction dropped `Rear Cable`).
2. **`general.txt` no longer tags the postal address `{!needs approval}`.** → **CA-22 closes.**
3. **`general.txt` gained `== INSTALLATION SERVICE ==` and `== WORDING CONVENTIONS ==`**,
   recording the pay-upfront resolution and the credit-card rule. → **CA-08 and CA-32
   confirmed applied on every surface.**

The only `{!needs approval}` line left in the sources is
`Confirmed AU retail partners: (none)` — which still gates CA-33.

**Two findings also change status because of this**, from `Needs approval` to `Pending`:
the GX35 external-GPS items (**CA-04, CA-05**). The source states the external-antenna
reading in plain untagged text, `lib/data/warranty.ts` §4 independently warrants a
"Genuine FineVu external GPS accessory", and the GX35 box ships a GPS(2.5Φ) antenna. There
is nothing left to escalate.

---

## Summary

| # | Page(s) | Issue | Severity |
|---|---------|-------|----------|
| CA-04 | GX35 | Spec row still says "Built-in GPS"; the GX35 GPS is an included external antenna | High |
| CA-05 | GX35 / GX4K | `compareRows` GPS column + a whole "Built-in GPS" carousel card, same error, in both files | High |
| CA-06 | GX35 | `boxItems` still missing Cradle, Rear Cable and GPS antenna (3 of 9) | High |
| CA-31 | GX4K | `boxItems` gained the Hardwire Kit but lost Rear Cable (6 of 7) | High |
| CA-36 | Installation | Checkout takes card details and says "payment received" — nothing is charged or submitted | High |
| CA-35 | Installation vs Terms | "Confirmed instantly" contradicts Terms §4 | Medium |
| CA-37 | All pages | "Global leader in dash cam technology" ships in every page `<title>` — no source | Medium |
| CA-38 | All MVP pages | Primary CTA and every warranty-claim CTA land on gated Coming Soon routes | Medium |
| CA-34 | GX4K / GX35 | FVMA expanded as "Forward Vehicle Moving Alert"; source says "Front Vehicle Motion Alert" | Low |
| CA-01 / CA-02 | Installation | "Included power cable is a plug-in DIY setup" — cable termination still unverified | Medium |
| CA-41 | About vs Installation | "Nationwide" installer network vs metro-only + no NT | Medium |
| CA-40 | Support | Four unsourced technical assertions (12.0V cut-off, format interval, GPS lock, SSID) | Medium |
| CA-23 | Support | "Manufacturer's warranty" — the anchor says distributor voluntary warranty | Medium |
| CA-39 | config | Stale "pending ops" comment on disclaimer 3 | Low |
| CA-13 | Support | Unsourced firmware versions; Download Centre non-functional | Carry-over |
| CA-14 | GX4K / GX35 / About | Unsourced specs (processor, F/1.8, 256GB, 0.2%, 6m/9m) | Carry-over |
| CA-24 / CA-25 | Support | Support hours and 24-hour response SLA — no source | Carry-over |
| CA-26 | Home / About / GX35 / GX4K | "No.1 dash cam in Korea" — no source (now confirmed on four pages) | Carry-over |
| CA-27 | About / Home | 1992 / "Fine Digital Inc." / "FINEDIGITAL" / Gyeonggi-do — no source | Carry-over |
| CA-33 | Retailers (gated) | Named retailers + placeholder store addresses | Carry-over |

---

## Applied in this pass (2026-07-27, after the audit)

Eight of the nine `Pending` findings were fixed on the user's instruction and verified with
a clean `npm run build`:

| ID | File | Change |
|---|---|---|
| CA-04 | `app/gx35/page.tsx` | Connectivity spec row → "External GPS antenna (included)" |
| CA-05 | `app/gx35/page.tsx`, `app/gx4k/page.tsx` | Both `compareRows` GPS columns → "External antenna (included)"; the GX35 "Built-in GPS" carousel card rewritten to "GPS Included" |
| CA-06 | `app/gx35/page.tsx` | `boxItems` → all 9 source items (Cradle, Rear Cable, GPS Antenna restored) |
| CA-31 | `app/gx4k/page.tsx` | `boxItems` → all 7 source items (Rear Cable restored) |
| CA-34 | `app/gx4k/page.tsx`, `app/gx35/page.tsx` | "Forward Vehicle Moving Alert" → "Front Vehicle Motion Alert" |
| CA-23 | `app/support/page.tsx` | "manufacturer's warranty" → "our 3-year Australian warranty" |
| CA-41 | `app/about/page.tsx` | "nationwide network" → "growing network … across the metro areas" |
| CA-39 | `config/site.config.ts` | Stale "pending ops" comment replaced with the 2026-07-27 confirmation |

**CA-38 (dead-end CTAs) was deliberately not applied** — it needs a decision between
repointing the CTAs and promoting routes out of `comingSoon`, which is a product call.

Running totals: **27 Applied · 1 Pending (CA-38) · 13 Needs approval.**

---

## Findings

### CA-04 / CA-05 — GX35 GPS is external, three surfaces still say built-in

`gx35.txt:25-27` gives `GPS: O` (**not** "Built-In", which is what the GX4K sheet says),
notes the box ships a `GPS(2.5Φ) antenna`, and `gx35.txt:68` states there is **no built-in
GPS feature section** on the GX35 page at all. `lib/data/warranty.ts:112` corroborates:
a warranty line exists for a "Genuine FineVu external GPS accessory".

`app/gx35/page.tsx:384`

```
current:  ["Connectivity", "Built-in Wi-Fi · Built-in GPS · FineVu Wi-Fi App"],
replace:  ["Connectivity", "Built-in Wi-Fi · External GPS antenna (included) · FineVu Wi-Fi App"],
```

`app/gx35/page.tsx:406` **and** `app/gx4k/page.tsx:313` (`compareRows` is duplicated —
change both):

```
current:  ["GPS", "Built-in", "Built-in"],
replace:  ["GPS", "Built-in", "External antenna (included)"],
```

`app/gx35/page.tsx:157-161` is a whole carousel card asserting the feature; it needs a
rewrite, not a label swap:

```
current:  title: "Built-in GPS",
          body: "Records speed, location and route. Every clip stamped with exactly where and how fast you were going.",
replace:  title: "GPS Included",
          body: "The included GPS antenna stamps every clip with speed, location and route — and powers the speed-camera alerts.",
```

### CA-06 / CA-31 — box contents still incomplete on both pages

The Hardwire Kit was added to both lists after the source was updated, but the same edit
**dropped `Rear Cable`**, which both sources list and both pages previously had.

`app/gx4k/page.tsx:305` — source lists 7, page lists 6:

```
current:  const boxItems = ["Front Camera", "Rear Camera", "MicroSD Card & Adapter", "Power Cable", "Hardwire Kit", "User Manual"];
replace:  const boxItems = ["Front Camera", "Rear Camera", "MicroSD Card & Adapter", "Power Cable", "Hardwire Kit", "Rear Cable", "User Manual"];
```

`app/gx35/page.tsx:390-398` — source lists 9, page lists 6. Missing **Cradle**, **Rear
Cable** and **GPS antenna** (the last ties to CA-04: the page ships an antenna in the box
while telling the customer the GPS is built in):

```
current:  ["Front Camera", "Rear Camera", "MicroSD Card & Adapter", "Power Cable", "Hardwire Kit", "User Manual"]
replace:  ["Front Camera", "Rear Camera", "Cradle", "MicroSD Card & Adapter", "Hardwire Kit", "Power Cable", "Rear Cable", "GPS Antenna", "User Manual"]
```

The grid is `grid-cols-2 sm:grid-cols-3`, so 7 and 9 items both lay out cleanly.

### CA-36 — the booking checkout charges nothing and submits nothing (High)

`app/installation/page.tsx:171-174` — `next()` on the final step fakes a 900 ms delay,
generates a random reference client-side and advances to a confirmation screen. The
imported `submitForm` helper (`:7`) is **never called**. There is no payment provider and
no endpoint.

Meanwhile the page tells the customer, at `:356-358`:

> Booking confirmed — payment received … your payment of $250.00 AUD has been received and
> your installation is locked in. Your confirmation and tax receipt are on their way to
> your email…

…after collecting a full card number, expiry and CVC at `:343-347`. And
`installation-terms.ts:135` makes payment-at-booking a contractual term.

A customer can complete the wizard, believe they are booked and paid, and no record exists
anywhere. This needs a real payment provider and booking backend before launch, or the
wizard needs to be visibly a demo. Ops/build decision — flagged, not fixed.

### CA-35 — "confirmed instantly" contradicts Terms §4 (Medium)

`installation-terms.ts:98`: *"Submitting payment does not guarantee that an appointment has
been accepted until we send you a booking confirmation."* §4 also contemplates being unable
to accept a booking and refunding it — which only makes sense if acceptance is not instant.

The page promises the opposite three times: `:54` "your slot is confirmed instantly",
`:337` "your booking is confirmed instantly", `:356` "Booking confirmed — payment received".

Same shape as CA-08 (now resolved), and it needs the same treatment: an ops fact.
`general.txt == INSTALLATION SERVICE ==` records payment timing but not acceptance timing.
If acceptance really is instant, amend §4; if not, soften the page to "your slot is
reserved and we'll confirm by email".

### CA-37 — "Global leader in dash cam technology" in every page title (Medium)

`config/site.config.ts:88` feeds `app/layout.tsx:29`, so all eight MVP pages ship
`<title>FineVu — Global leader in dash cam technology</title>`. No content-sources file
supports any market-leadership claim, let alone a global one. It is the first thing a
search result or a browser tab shows. `siteConfig.hero.headline` (`:124`) carries the same
string but is not currently rendered.

### CA-38 — the primary CTA is a dead end on every MVP page (Medium)

`comingSoon` (`config/site.config.ts:146-156`) gates `/retailers`, `/contact`, `/faq`,
`/how-it-works`, `/learn`, `/services`, `/become-a-retailer`. Everything below points at
one of those:

- `siteConfig.primaryCta` → `/retailers` — the header button on **every** page (`:120`)
- `Footer` "Find Retailer" CTA band → `/retailers`, plus seven gated links in the columns
- `LearnMoreLinks` "Where to buy" → `/retailers` — ships on all eight MVP pages
- `/support`: "Contact support" (`:196`), "App Setup Guide" / "Get the App" (`:371`/`:376`),
  "Register Now" and **"Start a Warranty Claim"** (`:435`) → `/contact`, `/how-it-works`

A customer trying to lodge a warranty claim from the support page reaches a Coming Soon
placeholder. Not a factual defect, but it defeats the MVP's conversion paths.

### CA-34 — FVMA expanded wrongly on both product pages (Low)

Sources (`gx4k.txt:60`, `gx35.txt:71`): **Front Vehicle Motion Alert (FVMA)**.

`app/gx4k/page.tsx:120` and `app/gx35/page.tsx:136`:

```
current:  "Forward Vehicle Moving Alert (FVMA) and Lane Departure Warning (LDWS) keep you sharp, …"
replace:  "Front Vehicle Motion Alert (FVMA) and Lane Departure Warning (LDWS) keep you sharp, …"
```

Each page's own spec row already says "front vehicle motion alert" (`gx4k:298`,
`gx35:383`), so the page currently contradicts itself.

### CA-41 — "nationwide" installer network vs the installation page (Medium)

`app/about/page.tsx:60`: *"A nationwide network of certified installers…"*

`/installation` is careful and specific: "major metropolitan areas with regional coverage
expanding monthly" (`:529`), a postcode checker that can answer "we don't currently service
that postcode" (`:418`), and "Installation is not currently available in the Northern
Territory" stated twice (`:81`, `:535`).

```
current:  "A nationwide network of certified installers hardwires your camera properly, for full-time parking protection done right."
replace:  "A growing network of certified installers across the metro areas, hardwiring your camera properly for full-time parking protection."
```

### CA-40 — unsourced technical assertions on /support (Medium)

Four concrete claims a customer will act on, none traceable to any source file:

- `:94` "Cards should be re-formatted every 1–2 months"
- `:102` "12.0V is typical for daily drivers" *(the risky one — a wrong cut-off can flatten
  a battery or silently stop parking-mode recording; `warranty.ts` §11 already disclaims
  battery outcomes)*
- `:106` "Allow up to 5 minutes for first GPS lock"
- `:98` camera SSID format `FINEVU_xxxx`

The user manuals would settle all four — the same gap that blocks CA-13.

### CA-23 — "manufacturer's warranty" on /support (Medium, now Pending)

`app/support/page.tsx:132` says every dash cam is covered by a **manufacturer's** warranty.
The canonical anchor, `lib/data/warranty.ts:10`, frames it as *"This voluntary warranty
against defects is provided in Australia by Motor One Group Pty Ltd"* — a distributor
warranty. Moved to `Pending` because this is consistency against our own anchor, but the
replacement wording should be confirmed since it is warranty-facing.

### CA-39 — stale "pending ops" comment (Low)

`config/site.config.ts:171-172` still says the Hardwire Kit inclusion is "pending
confirmation from ops". It isn't, as of today. Leaving it invites someone to re-open a
settled decision or revert disclaimer 3 to the wrong wording. Close **CLAUDE.md open
item 1** in the same pass.

### CA-01 / CA-02 — the "plug-in DIY power cable" claim is only half resolved

The sources now prove the in-box Power Cable is **not** the hardwire loom (they list both,
separately, untagged). That disproves the original inversion. But `/installation` claims
more than that — at `:78` and `:235` it says the included power cable is *"a simple plug-in
DIY setup, so there's no need to book an install for that."*

That requires the cable to be self-powering. The AU distributor's own product tile shows the
Power Cable as a plain coil ending in a **bare right-angle barrel jack — no cigarette-lighter
plug**, and a bare barrel jack cannot self-power. Neither source states the termination.

So these two stay `Needs approval`, on a much narrower question than before: **does the AU
retail Power Cable end in a 12V socket plug?** One photo settles it. If yes, the copy stands
as written; if no, both lines need the "available separately" reword.

### Carry-overs, unchanged

**CA-13** (firmware versions + dead Download Centre), **CA-14** (processor / F/1.8 /
256 GB / 0.2% / 6m-9m — all still listed under NOT IN SOURCE in both files), **CA-24**,
**CA-25**, **CA-26**, **CA-27**, **CA-33**. See the CSV for per-location detail.

Two notes on those:

- **CA-14, "4 million+ sold" does not ship.** It survives only in
  `siteConfig.brandMarquee` (`:131`, `:140`) — and `BrandMarquee` is rendered nowhere — plus
  `/learn` and `lib/data/articles.ts`, both gated. No MVP page carries it.
- **CA-26 is baked into artwork.** `/home/No.1_Banner.webp`, `/gx4k/no1.webp`,
  `/gx35/no1.webp`, `/about/trust-no1.webp`. Removing the claim means replacing images,
  not editing strings. Its footprint is four MVP pages, not three — the homepage bento
  tile (`app/page.tsx:121`) was missed by earlier passes.

---

## ✅ Verified correct — no change needed

**Product specs.** GX4K: IMX515 8.5 MP, 3840×2160, 136°/143°, rear 2 MP 1920×1080 18 g,
+2,325 parking hours at 98% less power, 743-minute time-lapse, 20-second impact capture,
quarterly speed-camera database, supercapacitor, low-voltage cut-off, AI heat monitoring,
Format Free 2.0, memory-allocation splits, built-in GPS (correct for GX4K), dual-band
Wi-Fi 2.4/5 GHz. GX35: IMX675 5.12 MP, 2560×1440, 147.4°/143.2°, rear 23 g, 30% lower
power than STARVIS 1, +13,950 parking hours, 1,129-minute Smart Time-Lapse, 74 mm / 57 g
front unit. Weights in both disabled "Designed to Disappear" blocks now match the sources.

**Box/SD claims.** "Includes 128GB MicroSD Card" (GX4K), "Includes 64GB MicroSD Card"
(GX35 — the AU override, correct), the homepage's combined "64GB & 128GB" tile, and
"Includes Hardwire Kit & Power Cable" on all seven surfaces.

**Credit-card rule (CA-32).** All four "smaller than a credit card" surfaces are GX35-only
(`app/page.tsx:189`, `gx35:44/200/279`). Confirmed **no** credit-card comparison appears
anywhere on `/gx4k`, where it would be a factual error (96.5 × 70.0 mm).

**Testimonials.** All three homepage reviews and both product pages' review copy are
verbatim from the SGcarmart sets in the sources.

**Contact details.** Phone `1800 818 288`, `support@finevuaustralia.com.au`,
`finevuaustralia.com.au`, ABN 31 097 188 219, `Level 9, 3 Nexus Court, Mulgrave VIC 3170`
— consistent across `warranty.ts` §1/§12/§25, `installation-terms.ts` §1/§26,
`site.config.ts:93`, `/support` and the footer, and all matching `general.txt`.

**Warranty/terms consistency.** Disclaimer 1 (3 years main units, 6 months accessories)
matches `warranty.ts` §4's table exactly. `/installation`'s pay-at-booking copy matches
§5; its ">24 hours, no fee to reschedule" FAQ matches §14. `/about`'s "36 months from the
date of purchase" and "no shipping units back overseas" match §4 and §15.
`/warranty` and `/terms-of-service` are thin wrappers that render the anchors directly —
no independent claims of their own beyond the two metadata descriptions, both accurate.

**Distribution wording.** "AutoXtreme, exclusive Australian distributor" and "leading
authorised retailers" are the approved forms and are used correctly; no shipping MVP page
names a retailer. AU spelling "authorised" throughout.

---

## Coverage report — FULL pass

Read end to end this pass:

| File | Lines | Result |
|---|---|---|
| `app/page.tsx` | 331 | ✅ full |
| `app/gx4k/page.tsx` | 851 | ✅ full |
| `app/gx35/page.tsx` | 895 | ✅ full |
| `app/installation/page.tsx` | 574 | ✅ full |
| `app/support/page.tsx` | 455 | ✅ full |
| `app/about/page.tsx` | 254 | ✅ full |
| `app/warranty/page.tsx` | 13 | ✅ full |
| `app/terms-of-service/page.tsx` | 19 | ✅ full |
| `config/site.config.ts` | 178 | ✅ full |
| `lib/data/warranty.ts` | 745 | ✅ full (anchor) |
| `lib/data/installation-terms.ts` | 896 | ✅ full (anchor) |
| `components/Footer.tsx`, `LearnMoreLinks.tsx`, `LegalDisclaimers.tsx` | — | ✅ full (render on all 8) |
| `app/layout.tsx` | 60 | ✅ metadata |

**No in-scope page was skipped.**

Claims found with **no backing source** this pass, each carried as a `Needs approval` row:
processor "Dual-core"/"Allwinner V536", "F/1.8", "microSD up to 256 GB", "defects below
0.2%" / "Built In-House", "6-metre / 9-metre" cables (CA-14); "No.1 dash cam in Korea"
(CA-26); 1992 / "Fine Digital Inc." / "FINEDIGITAL" / "Gyeonggi-do, Korea" (CA-27);
"Global leader in dash cam technology" (CA-37); support hours (CA-24); "Response within
24 hours" (CA-25); firmware v2.03 / v1.14 (CA-13); the four /support troubleshooting
assertions (CA-40); booking-acceptance timing (CA-35).

Not audited (out of scope, gated in `comingSoon`): `/contact`, `/faq`, `/how-it-works`,
`/learn` + `learn/[slug]`, `/retailers`, `/services`, `/become-a-retailer`.
`/fv-specialist` is ungated by design (QR landing page) and was not in scope.
`app/gx35/page_bak.tsx` was not audited — it is unrouted and holds pre-fix values;
CLAUDE.md open item 3 still recommends deleting it.
