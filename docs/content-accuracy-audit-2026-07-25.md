# Content Accuracy Audit — 2026-07-25

**Trigger:** `/content-audit` after an edit to a source of truth
(`docs/content-sources/gx35.txt`).
**Scope:** all eight MVP pages, re-verified against the canonical sources
(`docs/content-sources/gx4k.txt`, `gx35.txt`).
**Supersedes:** `docs/content-accuracy-audit-mvp-2026-07-24.md`. Findings map 1:1 to the
`CA-xx` IDs in `docs/content-accuracy-changes.csv`.

## What changed this pass

The GX35 source of truth's **IN THE BOX** list was edited to assert a **separate
`Hardwire Kit`** item *in addition to* `Power Cable`, and tagged it **`{!needs approval}`**.
Convention applied: **`{!needs approval}` ⇒ any site claim depending on that line is held at
`Needs ops sign-off`, never `Ready`.**

This reopens the hardwire cluster. The 2026-07-24 pass had *resolved* the long-standing
open question the other way — that the in-box "Power Cable" **is** the hardwire loom and
there is only **one** cable (so `boxItems` was correct and the sitewide "Hardwire Kit &
Power Cable" wording was one-cable-worded-as-two). The edited source now posits **two**
separate items. Until ops signs off on the `{!needs approval}` line, the site's hardwire
wording cannot be called right *or* wrong — so **CA-01, CA-02, CA-03, CA-06** are now all
`Needs ops sign-off`. Nothing else changed; all other findings still reproduce verbatim.

## Summary

| CA | Page(s) | Issue | Status |
|----|---------|-------|--------|
| CA-01 | Installation | `:76` calls the in-box power cable a "plug-in DIY setup" | ⏸ Needs ops sign-off *(was Ready)* |
| CA-02 | Installation | `:242` same inversion | ⏸ Needs ops sign-off *(was Ready)* |
| CA-03 | Home/GX4K/GX35/config | "Includes Hardwire Kit & Power Cable" wording | ⏸ Needs ops sign-off *(was Optional)* |
| CA-04 | GX35 | GPS shown "Built-in"; source says external antenna | ⏸ Needs ops sign-off |
| CA-05 | GX35/GX4K | `compareRows` GPS row (duplicated in both files) | ⏸ Needs ops sign-off |
| CA-06 | GX35 | `boxItems` missing Cradle + GPS antenna (+ Hardwire Kit pending) | ⏸ Needs ops sign-off |
| CA-07 | Support | GX35 called "FHD" — it's QHD 2560×1440 | ✅ Ready |
| CA-08 | Install vs ToS | "pay on the day" vs "payment at booking" | 🔴 Business decision |
| CA-09 | Home | Review #2 (GX35) not in any source | ✅ Ready |
| CA-10 | GX4K | Wi-Fi spec row says "5 GHz"; it's dual-band | ✅ Ready |
| CA-11 | About | `LegalDisclaimers` renders all 3; should be `limit={1}` | ✅ Ready |
| CA-12 | Install | `NT` selectable but not serviced | ✅ Ready |
| CA-13 | Support | Firmware versions unsourced; download links dead | 🟡 Needs source |
| CA-14 | GX4K/GX35/About | Carry-over unverified spec claims | 🟡 Needs source |
| CA-15 | GX4K/GX35 | Wrong weights in hidden blocks | ✅ Ready |

Split: **6 Ready · 6 Needs ops sign-off · 1 Business decision · 2 Needs source.**

---

## ⏸ CA-01 / CA-02 — installation page hardwire wording (held)

`app/installation/page.tsx:76` and `:242` describe the *included* power cable as a "simple
plug-in DIY setup." Under the 2026-07-24 reading (one cable = hardwire loom) this was
backwards and `Ready` to fix. The edited GX35 source now lists a **separate Power Cable
alongside a Hardwire Kit**, so it is no longer certain what the in-box "Power Cable" is —
if it is genuinely a distinct plug-in cable, the page may be correct as written.

**Held at `Needs ops sign-off`** pending the `{!needs approval}` decision (CA-06). The
proposed reword (→ "a cigarette-lighter power cable, available separately") stands as the
fix *if* ops confirms one-cable; do not apply until then. Note `:77` also states "the
hardwire kit already included in your box," which the edited source now supports (pending
approval).

## ⏸ CA-03 — "Includes Hardwire Kit & Power Cable" (held)

`app/page.tsx:118`, `config/site.config.ts:173-176`, and the product tiles. Previously an
`Optional` reword to "Includes Hardwire **Power Cable**" (one cable). The edited source
would make the existing two-item wording **correct**. Now contingent on CA-06:

- Ops approves separate Hardwire Kit → **no change**, wording is right.
- Ops confirms one cable → apply the reword.

## ⏸ CA-04 / CA-05 — GX35 GPS is external (unchanged this pass)

Source `gx35.txt` SPECS: `GPS: O` (not "Built-In" as GX4K), and the box ships a
`GPS(2.5Φ) antenna`. Site shows "Built-in" in the spec row (`:368`), the carousel
(`:158`) and both duplicated `compareRows` (`gx4k:299` / `gx35:389`). Still
`Needs ops sign-off` — rests on box artwork + wording, and reverses an earlier change.
Proposed values unchanged from 2026-07-24 (see CSV CA-04/CA-05).

## ⏸ CA-06 — GX35 `boxItems` incomplete (updated target)

`app/gx35/page.tsx:374-381` lists **6** items. Source now lists **9**: adds **Cradle** and
**GPS antenna** (both firmly in the artwork) plus the **Hardwire Kit `{!needs approval}`**.
Apply Cradle + GPS antenna once GPS is confirmed (CA-04); add Hardwire Kit **only** if ops
approves the separate item. Target list now:
`Front Camera, Rear Camera, Cradle, MicroSD Card & Adapter, Hardwire Kit, Power Cable,
Rear Cable, GPS Antenna, User Manual`.

## ✅ CA-07 — Support page calls GX35 "FHD"

`app/support/page.tsx:48` — `line: "Compact FHD front & rear dash cam"`. Source: QHD
2560×1440. → `"Compact 2K QHD front & Full HD rear dash cam"`. (`:40` GX4K line is correct.)

## 🔴 CA-08 — installation page vs Terms on payment

`app/installation/page.tsx` states "no payment to book / pay on the day" at `:48, :53, :79,
:222, :346, :465`; `lib/data/installation-terms.ts:135` says "Payment is required at the
time of booking," and §12's cancellation mechanics only work against a prepayment. Business
decision — the Terms bind, the page is the pre-contractual representation. Also `:35` says
submitting the form constitutes agreement, but the booking form never surfaces the Terms.

## ✅ CA-09 — homepage review #2 unsourced

`app/page.tsx:139-141` — "Really compact and the video recording was extremely clear. Value
for money as well" (FineVu GX35). Not among the three real GX35 SGcarmart reviews in
`gx35.txt`. Reviews #1/#3 do match source. Replace with a real one (e.g. Donny Ang).

## ✅ CA-10 — GX4K Wi-Fi is dual-band

`app/gx4k/page.tsx:285` — "Built-in **5 GHz** Wi-Fi". Source: `Wi-Fi Built-In
(2.4GHz/5.0GHz)`. → "Built-in dual-band Wi-Fi (2.4 / 5 GHz)". Feature cards stay.

## ✅ CA-11 — About renders uncited disclaimers

`app/about/page.tsx:249` — `<LegalDisclaimers theme="light" />`; the page's own comment says
`limit={1}`. → add `limit={1}`.

## ✅ CA-12 — NT bookable but unserviced

`app/installation/page.tsx:37` includes `"NT"`; `:144` rejects NT / `08xx`,`09xx`
postcodes. Drop `"NT"` or disable it with the reason.

## 🟡 CA-13 — support downloads are placeholders

`app/support/page.tsx:42/:50` publish firmware `v2.03` / `v1.14` (no source) and every
download/guide link is `href="#"`. Get real versions/files or drop the version metadata.

## 🟡 CA-14 — carry-over unverified claims

Everything in the `NOT IN SOURCE` sections of both source files — processor
"Dual-core/Allwinner V536", "microSD up to 256GB", "F/1.8", "defects below 0.2%",
"6m/9m cable", "4M+ sold". None appear in the spec sheets or artwork.

## 🟡 CA-15 — wrong weights in hidden blocks

`gx4k:257` ("114g/23g") and `gx35:200` ("76g") inside disabled `{false && …}` blocks.
Source: GX4K 123g front / 18g rear; GX35 57g front / 23g rear. Wrong the moment the blocks
are re-enabled.

---

## ✅ Verified correct — no change

- **All GX4K spec figures** vs `gx4k.txt`: IMX515 8.5MP · 3840×2160 · 136°/143° · 18g rear ·
  30fps · +2,325 standby hrs · 743-min time-lapse · 128GB · 123g front.
- **All GX35 spec figures** vs `gx35.txt`: STARVIS 2 IMX675 5.12MP · 2560×1440 ·
  147.4°/143.2° · 23g rear · +13,950 standby hrs · 1,129-min Smart Time-Lapse · supercap.
- **GX35 64GB card** — matches the AU OVERRIDE in `gx35.txt`; correct, not a bug.
- **Warranty periods / ACL wording** (`lib/data/warranty.ts:107-113`,
  `config/site.config.ts`) — 3yr main / 6mo accessories; no drift.
- **SGcarmart review label** and reviews #1/#3 on the homepage — verbatim from source.

## Notes for whoever applies these

- `compareRows` is duplicated in `app/gx4k/page.tsx:293` and `app/gx35/page.tsx:383` — any
  GPS change (CA-05) goes in both.
- `app/gx35/page_bak.tsx` still holds pre-fix values; not routed. Recommend deleting.
- **The whole hardwire cluster (CA-01/02/03/06) is blocked on one decision:** does the AU
  retail box contain a *separate* Hardwire Kit and Power Cable, or one cable? Opening a real
  AU box settles it and unblocks four rows at once.

---

# Addendum — `/support` full pass (2026-07-25)

**Trigger:** `/content-audit full /support`.
**Scope:** `app/support/page.tsx` **only**, read end to end; every claim dispositioned
against `docs/content-sources/general.txt` (contact facts), `gx4k.txt` / `gx35.txt` (product
lines / storage), and the warranty anchor `lib/data/warranty.ts`. This is a **deeper,
single-page** pass than the all-8 sweep above — it re-verifies each support-page finding at
its current line and adds one new finding (**CA-25**). Line numbers shifted from the earlier
pass because a URL slot was added to `DownloadList`; the CSV `Location` cells were updated.

## Claim-by-claim disposition

**Contact channels (`channels`, :22–41)**
- `:27/:30` Phone `1800 818 288` (display + `tel:`) → matches `general.txt`. ✅
- `:28` Phone hours "Mon–Sun, 8:00 AM – 8:00 PM AEST" → no source. **CA-24, Needs approval.**
- `:36/:39` Email `support@finevuaustralia.com.au` (display + `mailto:`) → matches
  `general.txt`; the earlier `.com` variant is fixed. ✅ (**CA-17 Applied — verified**)
- `:37` "Response within 24 hours" → no source; outward-facing SLA. **NEW — CA-25,
  Needs approval.**

**Model hubs (`models`, :52–89)**
- `:56` GX4K "4K UHD front & FHD rear dash cam" → matches `gx4k.txt`. ✅
- `:74` GX35 "Compact 2K QHD front & Full HD rear dash cam" → matches `gx35.txt`
  (QHD 2560×1440). ✅ (**CA-07 Applied — verified**)
- `:59/:77` Firmware `v2.03` / `v1.14` → no source. `DownloadList` now takes an optional
  URL; with none supplied it renders **"Coming Soon"** and a non-navigating `href="#"`
  (`cursor-not-allowed`). Net effect: the dead-link UX is mitigated **and** the unsourced
  version strings are **not currently displayed** (meta shows only once a real URL exists).
  Still needs sourced versions + real files before going live. **CA-13, Needs approval (updated).**

**Troubleshooting accordion (`troubleshooting`, :91–116)** — general support guidance
(SD reformat cadence, Wi-Fi SSID `FINEVU_xxxx`, 12.0 V cutoff, ~5 min GPS lock, GMT offset).
No spec conflicts with the sources; all consistent with documented features. No findings.

**App strip (:356–382)** — "Change settings, view live footage and download clips over
Wi-Fi. Works with both GX4K and GX35" matches the Mobile App / Wi-Fi App claims. ✅ Note
(non-content): both buttons link to `/how-it-works`, which is in the `comingSoon` gate — a
UX dead-end at launch, not a content-accuracy issue.

**Registration & warranty panels (`regPanels`, :118–141)**
- `:132` "Every FineVu dash cam is covered by a **manufacturer's** warranty" → `warranty.ts`
  §1 frames it as a **voluntary warranty provided by Motor One Group** (distributor), not a
  manufacturer's warranty. **CA-23, Needs approval.**
- `:135` claim via model/serial/receipt → §12 ✅; `:136` "assess and repair or replace" →
  §6 ✅; `:137` "Return shipping included on approved claims" → §15 ✅; "keep your receipt"
  → §13 ✅.

**Legal disclaimers (`<LegalDisclaimers theme="light" />`, :450)** — renders **all three**
(no `limit`): warranty wording → matches `warranty.ts` ✅; SD cards (GX35 64GB / GX4K 128GB)
→ matches the AU override + `gx4k.txt` ✅; **disclaimer 3 "Hardwire Kit & Power Cable"** →
depends on the `{!needs approval}` GX35 line, so this held wording is **asserted on /support
too**. **CA-03, Needs approval** (Location updated to record the support-page render).

## Coverage report — `/support` (full)

- **Read in full:** `app/support/page.tsx` (only in-scope page). Cross-checked against
  `general.txt`, `gx4k.txt`, `gx35.txt`, `lib/data/warranty.ts`, `config/site.config.ts`
  (disclaimers) and `components/LegalDisclaimers.tsx` (to confirm all three render).
- **Claims with no backing source (each a `Needs approval` row):** support phone hours
  (CA-24), 24-hour email response (CA-25), firmware versions v2.03/v1.14 (CA-13), and the
  hardwire-kit inclusion carried by disclaimer 3 (CA-03).
- **Support findings this pass:** CA-03, CA-13, CA-23, CA-24 reproduce; **CA-25 is new**;
  CA-07 and CA-17 verified as correctly applied. Split: **2 Applied/verified · 5 Needs
  approval · 0 Pending.**
- **Not a content finding but launch-relevant:** `DownloadList`'s param type is
  `[string, string, string][]`, but `guides` is typed `[string, string][]` and `downloads`
  `[string, string, string?][]` — neither is assignable to the required 3-tuple, so
  `npm run build` (hard gate 4) may fail type-check. Flagged to the user separately.

---

# Addendum — `/about` full pass (2026-07-25)

**Trigger:** `/content-audit full /about`.
**Scope:** `app/about/page.tsx` **only**, read end to end; every claim dispositioned against
`docs/content-sources/general.txt` (contact/brand facts), `gx4k.txt` / `gx35.txt` (product +
NOT-IN-SOURCE lists), the warranty anchor `lib/data/warranty.ts`, and `config/site.config.ts`
(the `[1]` warranty disclaimer). Deeper single-page pass than the all-8 sweep above.

## Claim-by-claim disposition

**Hero (`:133–148`)**
- `:137` "Engineered in Korea. Trusted on Australian roads." → marketing framing. ✅
- `:144` "**Since 1992**, FineVu has been designing dash cams…" → the 1992 founding year has
  **no source** in any `content-sources` file. Also internally inconsistent with the story
  section, which says FineVu's parent has been "designing car technology since 1992, *long
  before dash cams were mainstream*" — i.e. **not** designing dash cams in 1992.
  **NEW — CA-27, Needs approval.**

**Stat cards (`stats`, :24–29)**
- `:25` "**No.1 Dash cam brand** by sales in Korea" → no source. **NEW — CA-26, Needs approval.**
- `:26` "3 Year Warranty `[1]`" → the `[1]` cites the warranty disclaimer, which matches
  `warranty.ts` (3yr / 36mo main + rear). ✅
- `:27` "Founded in **Gyeonggi-do, Korea**" → founding location has no source. **CA-27.**
- `:28` "**<0.2% Defect rate** across in-house production" → both the defect figure and the
  in-house-production claim are in the `NOT IN SOURCE` lists of `gx4k.txt`/`gx35.txt`.
  **CA-14, Needs approval.**

**Story split (`:150–163`)**
- `:158` "FineVu is the dash cam brand of **Fine Digital Inc.**, a South Korean electronics
  company that's been designing car technology **since 1992**" → parent company name and
  1992 both unsourced. **CA-27.**
- `:159` "keeping **defect rates below 0.2%**" → **CA-14**; "making FineVu the **No.1 selling
  dash cam brand in Korea**" → **CA-26**. (Single line, two separate unsourced claims.)

**Stats section head / What-we-build (`:166–218`)**
- "Small country. Big trust." / "three decades of dash cam engineering" → rests on the same
  unsourced 1992 heritage (**CA-27**); no separate figure.
- `:39` "Power Saving Parking Mode keeps watch … without draining the battery" → Power Saving
  Parking Mode is a documented feature (both spec sheets). ✅
- `:45` "Built in FineVu's own factories with strict in-house quality control" → the
  "Built In-House" claim is in `NOT IN SOURCE`. **CA-14.**

**Genuine-stock split (`:182–195`)**
- `:190` "distributed in Australia exclusively by **AutoXtreme**" → matches `general.txt`
  (Motor One Group, trading as AutoXtreme). ✅
- `:190` "sold only through authorised retailers like **JB Hi-Fi, Repco and Autobarn**" →
  the three named retailers have **no source**. **NEW — CA-28, Needs approval.**
- "correct AU firmware … local warranty support" / "certified installation network" →
  consistent with the warranty anchor and installation narrative. ✅

**Commitments (`commitments`, :49–66)**
- "3-Year Australian warranty … 36 months from the date of purchase, local warranty support,
  no shipping units back overseas" → matches `warranty.ts` §4 (main + rear = 3yr/36mo). ✅
- "Correct AU firmware … speed camera database", "Certified local installation … hardwires",
  "Australian-based phone and email support" → all consistent with other pages/anchors. ✅

**Legal disclaimers (`:249`)** — `<LegalDisclaimers theme="light" limit={1}` />` — matches
the page's own comment; renders only the warranty disclaimer that `[1]` cites, not the
SD-card or hardwire-kit disclaimers. **CA-11 verified Applied.**

## Coverage report — `/about` (full)

- **Read in full:** `app/about/page.tsx` (the only in-scope page). Cross-checked against
  `general.txt`, `gx4k.txt`, `gx35.txt`, `lib/data/warranty.ts`, and `config/site.config.ts`
  (the `[1]` warranty disclaimer). No in-scope page was skipped.
- **Claims with no backing source (each a `Needs approval` row):**
  - "No.1 dash cam brand by sales in Korea" (stat card + story) — **CA-26 (new)**.
  - "Since 1992" / "Fine Digital Inc." / "Founded in Gyeonggi-do, Korea" — unsourced corporate
    heritage, **CA-27 (new)**; the 1992 line also contradicts the story section's wording.
  - "JB Hi-Fi, Repco and Autobarn" named retailers — **CA-28 (new)**.
  - "<0.2% defect rate" / "in-house production" — carry-over **CA-14** (About locations
    `:25`/`:28`/`:45`/`:159` reproduce).
- **Verified correct:** the `[1]` warranty stat, warranty commitments vs `warranty.ts`,
  AutoXtreme exclusive-distribution line vs `general.txt`, `LegalDisclaimers limit={1}`
  (**CA-11**).
- **Split for this page:** CA-11 Applied/verified · CA-14, CA-26, CA-27, CA-28 Needs approval
  (3 new). **0 Pending / 0 Applied-this-pass.**

---

# Addendum — `/installation` full pass (2026-07-25)

**Trigger:** `/content-audit full /installation`.
**Scope:** `app/installation/page.tsx` **only**, read end to end, dispositioned against the
**installation-terms anchor** `lib/data/installation-terms.ts` (read in full), the product
sources `gx4k.txt` / `gx35.txt` (models, storage, box contents, the `{!needs approval}`
Hardwire Kit line), `general.txt` (contact facts) and `config/site.config.ts` (disclaimer 3).
This is a deeper single-page pass than the all-8 sweep above.

## Claim-by-claim disposition

**Hero stats (`HERO_STATS`, :44–49) & hero copy (:434–435)**
- `$250 AUD` / "One price, every install", "Mobile service", "60–90 mins" → commercial /
  operational figures set by AutoXtreme; no source-of-truth file governs them and they are
  **internally consistent** across the page (`:53`, `:74`, `:75`, `:79`, `:222`, `:295`,
  `:465`). Out of source scope — not flagged. ✅ (consistency only)
- `:48` "**No payment to book** / Pay on the day" → **directly contradicts** the
  installation-terms anchor §5 (`:135`, "Payment is required at the time of booking").
  **CA-08, Needs approval (business decision).**
- Hero copy "records straight out of the box, but full-time parking protection means
  hardwiring it properly" → consistent with the product parking-mode claims. ✅

**Three steps (`THREE`, :51–55)**
- `:52` "The **hardwire kit and power cable are already in the box** — nothing extra to
  source." → asserts the Hardwire Kit as an in-box item; depends on the
  `{!needs approval}` line in `gx4k.txt`/`gx35.txt`. **NEW — CA-29, Needs approval.**
- Steps otherwise (buy from authorised retailer, book online, installer comes to you) →
  consistent with the retail/mobile-service model. ✅

**Booking wizard (`BookingWizard`, :125–367)**
- `:222` badge "$250 AUD · **Pay on the day**", `:176` payload "$250 flat — paid on the day",
  `:465` intro "no payment to book, pay your installer on the day", `:346` "your installer
  collects the $250 flat rate on the day" → all the same payment-timing claim. **CA-08.**
- `:230` "with the **hardwire kit and power cable included in the box**", `:233` model
  buttons "128GB card & **hardwire kit included**" / "64GB card & **hardwire kit included**",
  `:346` "in-box accessories, **including the hardwire kit**" → Hardwire Kit inclusion,
  depends on `{!needs approval}`. **CA-29.**
- `:233` "**128GB** card" (GX4K) → matches `gx4k.txt`; "**64GB** card" (GX35) → matches the
  GX35 **AU override**. Both correct. ✅
- `:242` "simple DIY setup with the **included power cable**" → the plug-in-cable inversion.
  **CA-02, Needs approval** (held pending the same hardwire decision).
- `:37` `STATES` = `[VIC, NSW, QLD, SA, WA, TAS, ACT]` — **NT is not selectable**; the
  earlier CA-12 fix is in place. **CA-12 verified Applied.** (`:144` still rejects NT /
  `08xx`,`09xx` as a belt-and-braces guard.)

**What's included / Why experts (`INCLUDED` :57–64, `WHY` :66–70)** — service descriptions
(camera placement, concealed cabling, fuse-tap connection, parking-mode/voltage-cutoff
setup, app config, system test). Consistent with the anchor §7 "What is included". "Void
warranties … botched DIY" / "manufacturer warranty stay protected" refer to the **vehicle**
manufacturer's warranty (not FineVu's) — correct usage, not the CA-23 mischaracterisation.
No findings. ✅

**FAQs (`FAQS`, :72–82)**
- `:73` "sold through authorised retailers rather than directly from FineVu" → consistent. ✅
- `:74` "GX4K and GX35 … both … 2CH … same $250 flat" → both 2CH per sources. ✅
- `:77` "using the **hardwire kit already included in your box**" → Hardwire Kit inclusion,
  **CA-29**; "… the **included power cable** is a simple plug-in DIY setup" → **CA-01, Needs
  approval** (Location updated `:76`→`:77`, one-line drift).
- `:79` "no payment to book — your installer collects the $250 on the day" → **CA-08.**
- `:80` "not currently available in the Northern Territory" → matches `coverageMessage`
  (`:88`) and the `:531` note. ✅
- `:81` "call us at least 24 hours before … no fee to reschedule with notice" → consistent
  with anchor §14 (>24h notice = reschedule/refund, no fee). ✅

**Service-area section (:513–535)** — "growing national installer network … regional
coverage expanding monthly", postcode checker, `:531` NT exclusion → internally consistent;
no source conflict. ✅

**Legal disclaimers (`<LegalDisclaimers theme="light" />`, :565)** — no `limit`, renders
**all three**: warranty wording → matches `warranty.ts` ✅; SD cards (GX35 64GB / GX4K 128GB)
→ matches AU override + `gx4k.txt` ✅; **disclaimer 3 "Hardwire Kit & Power Cable"** → the
held `{!needs approval}` wording, so it is **asserted on /installation too**. Unlike About
(CA-11), all three disclaimers are topically relevant to this page, so rendering all three
is appropriate — but disclaimer 3 carries the held claim. **CA-03, Needs approval**
(Location updated to record the /installation render).

## Coverage report — `/installation` (full)

- **Read in full:** `app/installation/page.tsx` (only in-scope page) and its anchor
  `lib/data/installation-terms.ts`. Cross-checked against `gx4k.txt`, `gx35.txt`,
  `general.txt`, `config/site.config.ts` (disclaimers) and `lib/data/warranty.ts`. No
  in-scope page skipped.
- **Claims with no backing source / held (each a `Needs approval` row):** the hardwire-kit
  inclusion asserted five times on this page (**CA-29, new**); the "power cable is plug-in
  DIY" inversion (**CA-01, CA-02**); disclaimer 3 rendered here (**CA-03**); the
  payment-timing contradiction with the Terms (**CA-08**).
- **Verified correct:** GX4K 128GB / GX35 64GB in the model buttons; the 24-hour
  reschedule wording vs anchor §14; NT non-selectable (**CA-12 Applied**); the service
  descriptions vs anchor §7.
- **Not a source-governed claim (noted, not flagged):** the `$250` price, "60–90 mins"
  install time and "Mobile service" — commercial/operational figures with no source-of-truth
  file, internally consistent across the page.
- **Split for this page:** CA-12 Applied/verified · CA-01, CA-02, CA-03, CA-08, CA-29 Needs
  approval (**CA-29 new**). **0 Pending / 0 Applied-this-pass.**

---

# Addendum — `/warranty` full pass (2026-07-25)

**Trigger:** `/content-audit full /warranty`.
**Scope:** `app/warranty/page.tsx` + its renderer `components/PolicyDocument.tsx`, read end to
end. `/warranty` is a **thin wrapper**: `PolicyDocument` injects **no copy of its own** — it
renders the `title`/`meta` and the section blocks **verbatim** from the anchor
`lib/data/warranty.ts` (read in full in the /installation pass). So the page's whole content
surface = the warranty **anchor** + the page `<metadata>`. The anchor is canonical by design
(no `.txt` for it — see `README.txt`), so this pass is a **consistency + contact-fact** check,
not an external-legal-correctness check.

## Claim-by-claim disposition

**Page metadata (`:5–9`)**
- `title` "Warranty Policy | FineVu Australia" and `description` ("voluntary warranty periods,
  what is covered, how to make a claim, and your Australian Consumer Law rights") → accurately
  summarise the anchor's own framing (voluntary warranty + ACL). No standalone claim. ✅

**Contact facts in the anchor vs `general.txt`** (the one thing this command must cross-check)
- Email `support@finevuaustralia.com.au` — §1 (`:22`), §12 (`:382`), §25 (`:739`) → matches
  `general.txt`. **CA-16 verified Applied** (the old `finevudashcam` domain is gone).
- Website `finevuaustralia.com.au` — §1 (`:24`), §25 (`:741`) → matches. **CA-16 verified.**
- Phone `1800 818 288` — §1 (`:21`), §12 (`:384`), §25 (`:738`) → matches `general.txt`.
  **CA-20 verified Applied** (old `(03) 8809 2700` gone).
- Trading name / ABN — "Motor One Group Pty Ltd … Trading as AutoXtreme … Operating FineVu
  Australia", "ABN 31 097 188 219" (§1, §25) → matches `general.txt`. ✅
- Postal address `Level 9, 3 Nexus Court, Mulgrave VIC 3170` — §1, §12, §25; identical
  everywhere and matches `general.txt`, **but** `general.txt` tags it `{!needs approval}`, so
  it stays held-unverified. **CA-22, Needs approval** (consistency ✅, verification pending).

**Warranty periods table (§4, `:104–115`)** — main unit & rear camera 3yr/36mo; MicroSD,
hardwire kit, power cable, external GPS accessory, other accessories all 6mo. Cross-page
consistency:
- `config/site.config.ts` disclaimer "Warranty" (3yr main incl. front+rear / 6mo accessories)
  → matches. ✅
- About page commitment "3-Year Australian warranty … 36 months" → matches. ✅
- Homepage/product-tile warranty wording → 3yr main / 6mo accessories, no drift. ✅
- Note: the table's "Genuine FineVu **hardwire kit**" and "Genuine FineVu **external GPS
  accessory**" rows are *warranty-coverage scope* (they cover the item **if** you own it),
  **not** in-box-inclusion claims — so they do **not** depend on the `{!needs approval}`
  Hardwire Kit line, and the "external GPS accessory" wording actually **corroborates** the
  GX35 external-GPS reading (CA-04/CA-05). No finding.

**Warranty framing (§1)** — "voluntary warranty against defects provided in Australia by
Motor One Group Pty Ltd". The `/warranty` page states this **correctly**; the mismatch is on
`/support` (`:132` calls it a "manufacturer's warranty"), tracked as **CA-23** — not a
`/warranty` finding.

**Remaining anchor content** (§2 ACL notice, §3 products covered, §5–24 coverage/claims/
exclusions/liability/governing-law) — legal wording of the canonical anchor. No
`content-sources/legal-commitments.txt` exists, so this is **not** verified against external
law (per the command); internal cross-references are consistent (§1↔§25 contact blocks
identical; MicroSD 6mo in §4 matches §9's discussion). No findings.

## Coverage report — `/warranty` (full)

- **Read in full:** `app/warranty/page.tsx`, `components/PolicyDocument.tsx`, and the anchor
  `lib/data/warranty.ts`. Cross-checked against `general.txt` (contact), `config/site.config.ts`
  (warranty disclaimer) and the About/homepage warranty wording. No in-scope page skipped.
- **New findings:** **none.** `/warranty` is the cleanest MVP page audited so far — it renders
  the canonical anchor directly and every contact fact already reconciles to `general.txt`.
- **Verified correct/applied:** CA-16 (email+website domain), CA-20 (phone) — both confirmed
  fixed throughout the anchor; warranty-period consistency across config/About/tiles.
- **Held:** CA-22 — the postal address is consistent everywhere but carries the `general.txt`
  `{!needs approval}` tag, so it remains unverified until the registered address is confirmed.
- **Split for this page:** CA-16, CA-20 Applied/verified · CA-22 Needs approval. **0 new /
  0 Pending / 0 Applied-this-pass.**

---

# Addendum — `/terms-of-service` full pass (2026-07-25)

**Trigger:** `/content-audit full /terms-of-service`.
**Scope:** `app/terms-of-service/page.tsx` + its renderer `components/PolicyDocument.tsx`, read
end to end. Same thin-wrapper pattern as `/warranty`: `PolicyDocument` injects **no copy of its
own** and renders the `title`/`meta` + section blocks **verbatim** from the anchor
`lib/data/installation-terms.ts` (read in full in the /installation pass). So the page's whole
content surface = the installation-terms **anchor** + the page `<metadata>`. The anchor is
canonical by design, so this is a **consistency + contact-fact** check, not external-legal.

## Claim-by-claim disposition

**Page metadata (`:5–9`)**
- `title` "Installation Booking and Payment Terms | FineVu Australia" → matches the anchor
  title. ✅
- `description` "… when you **book and pay** for a FineVu product installation with AutoXtreme
  — bookings, payment, cancellations, warranties and your consumer rights" → accurately
  summarises the anchor, and (like anchor §5) states the **book-and-pay** model. This is the
  *pay-at-booking* pole of the **CA-08** contradiction with `/installation`'s "pay on the day"
  — consistent with the anchor, so not a new finding; reinforces the terms side of CA-08.

**Contact facts in the anchor vs `general.txt`**
- §26 Complaints — Email `support@finevuaustralia.com.au` (`:821`) → matches `general.txt`.
  **CA-16 verified Applied** (this is the `installation-terms.ts:821` location on that row).
- §26 — Telephone `1800 818 288` (`:820`) → matches `general.txt`. **CA-21 verified Applied**
  (old `(03) 8809 2700` gone).
- §1 (`:16–25`) & §26 (`:812–822`) — "Motor One Group Pty Ltd … Trading as AutoXtreme …
  Operating FineVu Australia", "ABN 31 097 188 219" → match `general.txt`. ✅
- Postal address `Level 9, 3 Nexus Court, Mulgrave VIC 3170` — §1 and §26, identical and
  matching `general.txt`, but held on the `{!needs approval}` tag. **CA-22, Needs approval.**
- No website line stated in this anchor — nothing to check. ✅

**Payment / booking model (§4–§6, §14–§15)**
- §5 (`:135`) "Payment is required at the time of booking" → the binding-terms side of the
  `/installation` contradiction. **CA-08, Needs approval (business decision)** — re-verified,
  still reproduces.
- §14 cancellations (>24h = reschedule/refund; <24h fee only if pre-disclosed; no-shows),
  §15 cancellations-by-us (refund, no fee) → internally consistent, and the >24h/no-fee
  wording matches the `/installation` FAQ `:81`. The cancellation/refund mechanics assume a
  payment was taken (supports the CA-08 concern that the page's "pay on the day" undercuts
  these terms). No new finding.

**Warranty reference (§18, `:557–564`)** — "Products supplied to consumers come with
guarantees that cannot be excluded under the Australian Consumer Law" and "Any FineVu
manufacturer **or distributor** warranty is provided in addition to your rights under the
ACL" → consistent with the `warranty.ts` framing (voluntary distributor warranty + ACL). The
"manufacturer or distributor" phrasing here is neutral/correct — **not** the CA-23
"manufacturer's warranty" mischaracterisation (that's a `/support` finding). ✅

**Remaining anchor content** (§2–§3 who-provides/eligibility, §7–§13 inclusions/vehicle/
location/access/damage/timing, §16–§30 additional-work/liability/privacy/refunds/complaints/
governing-law) — legal wording of the canonical anchor. No `content-sources/legal-commitments.txt`
exists, so **not** verified against external law (per the command); internal cross-references
are consistent (§1 ↔ §26 contact blocks; §7 inclusions ↔ /installation "What's included"
section). No findings.

## Coverage report — `/terms-of-service` (full)

- **Read in full:** `app/terms-of-service/page.tsx`, `components/PolicyDocument.tsx`, and the
  anchor `lib/data/installation-terms.ts` (all 30 sections). Cross-checked against `general.txt`
  (contact), the `/installation` page (payment model + inclusions + cancellation wording) and
  `warranty.ts` (§18 warranty reference). No in-scope page skipped.
- **New findings:** **none.** Like `/warranty`, this page renders a canonical anchor directly
  and every contact fact already reconciles to `general.txt`.
- **Verified correct/applied:** CA-16 (email `:821`), CA-21 (phone `:820`) — both confirmed
  fixed in the anchor; §14/§15 cancellation wording consistent with `/installation`.
- **Held / open:** CA-08 (§5 pay-at-booking vs `/installation` pay-on-the-day — the anchor is
  correct, the contradiction lives on the booking page); CA-22 (postal address on the
  `{!needs approval}` tag).
- **Split for this page:** CA-16, CA-21 Applied/verified · CA-08, CA-22 Needs approval.
  **0 new / 0 Pending / 0 Applied-this-pass.**

---

# Addendum — `/gx35` full pass (2026-07-25)

**Trigger:** `/content-audit full /gx35` — the highest-scrutiny page and the model whose source
(`gx35.txt`) was edited this cycle.
**Scope:** `app/gx35/page.tsx` read end to end (incl. disabled `{false && …}` and commented-out
`MediaSection` blocks), every claim dispositioned against `docs/content-sources/gx35.txt`; the
GX4K column of the duplicated `compareRows` cross-checked against `gx4k.txt`; disclaimers/box
against the AU override + `config/site.config.ts`.

## Summary (this page)

| CA | Location(s) | Issue | Status |
|----|-------------|-------|--------|
| CA-14 | :58/:76/:187/:363/:369/:391/:504 (+:167,:204) | Unsourced specs: F/1.8, Dual-core, Allwinner V536, microSD 256 GB, defects <0.2% / Built In-House, 6 m/9 m cable | ⏸ Needs approval |
| CA-04 | :368 | Spec row "Built-in GPS" — GX35 GPS is external antenna | ⏸ Needs approval |
| CA-05 | :158, :389 | "Built-in GPS" carousel card + `compareRows` GPS row | ⏸ Needs approval |
| CA-06 | :374–381 | `boxItems` lists 6; source lists 9 (missing Cradle + GPS antenna; Hardwire Kit pending) | ⏸ Needs approval |
| CA-03 | :644 + disclaimer 3 | "Includes Hardwire Kit & Power Cable" tile | ⏸ Needs approval |
| CA-26 | :631 | "No.1 Dash Cam in Korea" — no source (**new location added**) | ⏸ Needs approval |
| CA-30 | :696–699 | Public spec note "confirm final figures … before publishing" | ✅ Applied (removed from both spec sections) |
| CA-15 | :200 | Hidden-block weight now 57 g / 23 g | ✅ Verified Applied |

## Claim-by-claim disposition

**Hero + "Every detail" bento (`HERO_BEATS` :38–53, `featureTiles` :56–62)** — "2-Channel QHD",
"STARVIS 2", "2560×1440 front / Full HD rear / simultaneous", "Auto Night Vision / HDR",
"AI Heat Monitoring" → all match `gx35.txt`. ✅ **Except** `:58` "5.12MP **F/1.8**" → F/1.8 is
in `NOT IN SOURCE`. **CA-14.** ("147° / 143°" here is the rounded form of 147.4°/143.2° — the
exact figures are in the spec table; acceptable rounding, not a finding.)

**Optics callouts + head (`opticsCallouts` :65–84, head :501–505)**
- front: STARVIS 2 IMX675 · 5.12 MP · 2560×1440 · 147° → ✅
- core: "**Dual-core processor**", "**Allwinner V536 processor**", "**microSD up to 256 GB**" →
  all three in `NOT IN SOURCE`. **CA-14.** ("Format Free 2.0" ✅)
- rear: 2 MP CMOS · 1920×1080 · 143° · **23 g** → ✅ (23 g rear matches source)
- head `:504` "**F/1.8** wide-aperture glass" + "5.12-megapixel" + "30% less power" → F/1.8
  **CA-14**; the rest ✅.

**Carousels (`cSeeDetail` :86, `cParked` :104, `cSafer` :133, `cConnected` :146, `cBuilt` :164)**
- True 2K QHD, STARVIS 2 (30% less power), AI Auto Night Vision → ✅
- Power Saving Parking "98% less power, **13,950** more hours", 20-sec (10+10) capture,
  Smart Time-Lapse "**1,129** minutes", AI Heat Monitoring → ✅ (all match source figures)
- ADAS Plus FVMA + LDWS; Speed Camera "quarterly … requires GPS reception" → ✅
- FineVu App (live/download/settings/firmware, Android/iOS + Player 2.0), "5GHz Wi-Fi" dual-band
  → ✅
- `:158` "**Built-in GPS**" card ("Records speed, location and route") → GX35 GPS is `O`
  (external `GPS(2.5Φ) antenna`), and the source explicitly notes **no built-in-GPS feature
  section exists on GX35**. So this card is doubly off (wrong wording *and* presents GPS as a
  headline built-in feature). **CA-05** — held (rests on box artwork).
- `cBuilt` `:167` "**Built In-House** … defects below 0.2%" → both in `NOT IN SOURCE`. **CA-14.**
  Supercapacitor + low-voltage cut-off claims ✅.
- **Noted, not flagged:** `cParked` `:127` "A Minute of Motion … saved as a full minute" — the
  one-minute motion-clip duration isn't stated in `gx35.txt`; soft marketing, no source-of-truth
  governs it. Worth confirming but not elevated to a row.

**Disabled / commented blocks** — `disappearTabs` (rendered only inside `{false && …}` at :571)
and the two commented `MediaSection`s (`mDualVision` :510, `mDiscreet` :568) do **not** ship
today, but per the CA-15 convention they're audited: `:200` now reads "**57 g** … 23 g"
(**CA-15 verified Applied** — the old 76 g is gone); `:204` "single **6-metre** cable … **9-metre**
cable" → 6 m/9 m in `NOT IN SOURCE`, **CA-14** (currently non-rendering). `mDualVision`
copy is accurate. Memory-allocation BarGraph percentages (:281–358) are illustrative splits,
not sourced specs — noted, not flagged.

**Full Specifications (`specRows` :360–372)** — Front/Rear sensor, resolution, **147.4° / 143.2°**
(exact), night vision, recording modes, parking, ADAS, protection, safety DB → all ✅.
**Exceptions:** `:363` Processor "**Dual-core**" (**CA-14**); `:368` Connectivity "**Built-in
GPS**" (**CA-04**); `:369` Storage "microSD up to **256 GB**" (**CA-14**). Also `:696–699` ships a
**public** note — "Specifications compiled from FineVu published materials — confirm final
figures against the official GX35 spec sheet before publishing." An internal reminder leaked
onto the customer-facing page; it should come off before launch regardless of the CA-14
outcome. **NEW — CA-30, Pending** (ours to remove; the underlying specs it hedges are CA-14).

**What's in the Box (`boxItems` :374–381)** — lists **6** (Front, Rear, Power Cable, Rear Cable,
User Manual, MicroSD & Adapter). Source lists **9** — missing **Cradle** and **GPS antenna**
(both firmly in the artwork) plus the **Hardwire Kit `{!needs approval}`**. **CA-06** — held
(do not touch `boxItems` inference without approval).

**Series Comparison (`compareRows` :383–393, duplicated in `gx4k.txt`'s page)** — Front sensor,
resolution, rear, max video, FOV (rounded), parking standby (+2,325 / +13,950), warranty (3 yr)
→ ✅. **Exceptions:** `:389` GPS "Built-in | Built-in" — the **GX35** column is wrong (**CA-05**);
the GX4K column "Built-in" is correct. `:391` Processor "Allwinner V536 | Allwinner V536" →
`NOT IN SOURCE` in **both** columns (**CA-14**). *Any edit here must be mirrored in
`app/gx4k/page.tsx`.*

**"More reasons to choose FineVu" bento (:625–647)**
- `:631` "**No.1 Dash Cam in Korea**" → the market-rank claim with **no source** — same claim as
  the About-page occurrence. **CA-26** (Location extended to add `gx35:631`).
- `:637` "3 Year Warranty" `sup="1"` → matches warranty disclaimer ✅
- `:643` "Includes **64GB** MicroSD Card" `sup="2"` → matches the GX35 **AU override** ✅
- `:644` "Includes **Hardwire Kit & Power Cable**" `sup="3"` → the held hardwire wording.
  **CA-03.**

**Install band (:650–675)** — "records straight out of the box … hardwiring … certified
installers" → consistent with `/installation`. ✅
**Series comparison prose (:748–793)** — GX4K 4K/STARVIS, GX35 2K/"accessible price" → ✅.

**Firmware / Downloads (`downloadTabs` :415–436, rendered :816)** — generic firmware / speed-cam
step lists + a power-off warning; `downloadLabel`s are **commented out** (no live files) and the
User Manual tab reads "Coming soon". **No unsourced version strings are displayed and no dead
`href="#"`** (unlike the earlier `/support` state), so no CA-13-style finding here — but the
download centre is non-functional (placeholder), consistent with the site-wide "downloads not
live yet" state. Noted, not flagged.

**Legal disclaimers (`<LegalDisclaimers theme="light" />`, :822)** — no `limit`; the page cites
all three footnotes (`sup="1"` warranty, `sup="2"` SD, `sup="3"` hardwire on the bento tiles),
so rendering all three is **correct** here (unlike About/CA-11). Disclaimer 3 carries the held
hardwire wording → **CA-03**; disclaimers 1 (warranty) and 2 (64GB SD) ✅.

## Coverage report — `/gx35` (full)

- **Read in full:** `app/gx35/page.tsx` (every array + JSX block, including disabled/commented
  sections). Cross-checked against `gx35.txt`, `gx4k.txt` (compareRows GX4K column),
  `config/site.config.ts` (disclaimers), and the GX35 AU override.
- **Claims with no backing source (each a `Needs approval` row via CA-14 unless noted):** F/1.8
  (×3), Dual-core, Allwinner V536 (×2 incl. GX4K col), microSD 256 GB (×2), defects <0.2% /
  Built In-House, 6 m/9 m cable (disabled); "No.1 in Korea" (CA-26). Plus the leaked public
  spec-confirmation note (CA-30).
- **Held on box artwork:** GPS "Built-in" ×3 (CA-04 :368; CA-05 :158/:389); `boxItems`
  incomplete (CA-06); hardwire-kit inclusion (CA-03 :644 + disclaimer 3).
- **Verified correct:** every real GX35 spec figure (STARVIS 2 IMX675 5.12 MP · 2560×1440 ·
  147.4°/143.2° · 23 g rear · +13,950 hrs · 1,129-min Smart Time-Lapse · supercap), the 64 GB
  AU-override tile, the 3-yr warranty footnote, and CA-15 (weights now 57 g/23 g).
- **Split for this page:** CA-15 Applied/verified · CA-03, CA-04, CA-05, CA-06, CA-14, CA-26
  Needs approval · **CA-30 new (Pending)** · CA-26 gained a new location. **1 new / 1 Pending.**

---

# Addendum — `/gx4k` full pass (2026-07-25)

**Trigger:** `/content-audit full /gx4k` — the last MVP product page and the **other** home of
the duplicated `compareRows`.
**Scope:** `app/gx4k/page.tsx` read end to end (incl. the disabled `{false && …}` "Designed to
Disappear" band and the commented `cStorage` carousel), every claim dispositioned against
`docs/content-sources/gx4k.txt`; the GX35 column of `compareRows` cross-checked against
`gx35.txt`; disclaimers/box against `config/site.config.ts`.

## Summary (this page)

| CA | Location(s) | Issue | Status |
|----|-------------|-------|--------|
| CA-14 | :70/:280/:286/:301/:483/:506 (+:138,:262) | Unsourced specs: F/1.8 (×2), Dual-core (×2), Allwinner V536 (×2 cols), microSD 256 GB (×2), defects <0.2% / Built In-House, 6 m/9 m cable | ⏸ Needs approval |
| **CA-31** *(new)* | :291 | `boxItems` lists 6; GX4K source lists 7 — missing the Hardwire Kit `{!needs approval}` | ⏸ Needs approval |
| CA-05 | :299 | `compareRows` GPS row (GX35 column wrong; this is the GX4K-file copy) | ⏸ Needs approval |
| CA-03 | :655 + disclaimer 3 | "Includes Hardwire Kit & Power Cable" tile | ⏸ Needs approval |
| CA-26 | :643 | "No.1 Dash Cam in Korea" — no source (**new location added**) | ⏸ Needs approval |
| CA-30 | :706–709 | Public spec note "confirm final figures … before publishing" (**GX4K location added**) | 🟢 Pending |
| CA-10 | :285 | Wi-Fi spec now "dual-band (2.4 / 5 GHz)" | ✅ Verified Applied |
| CA-15 | :257 | Hidden-block weights now 123 g / 18 g | ✅ Verified Applied |

## Claim-by-claim disposition

**Hero + "Every detail" cards (`HERO_BEATS` :35–50, `detailCards` :68–74)** — "2-Channel UHD",
"4K Begins Here" (source tagline "FINEVU 4K BEGINS, GX4K"), "3840×2160 UHD", STARVIS IMX515
8.5 MP, Auto Night Vision/HDR, AI Heat Monitoring, "136°/143° FOV" (exact) → all match. ✅
**Except** `:70` "8.5MP · **F/1.8**" → F/1.8 in `NOT IN SOURCE`. **CA-14.**

**Optics scrub callouts + head (`ScrollScrubVideo` :470–530 — rendered)**
- head `:483` "STARVIS IMX515 … **F/1.8** wide-aperture glass" → F/1.8 **CA-14**; 8.5 MP ✅.
- front: IMX515 · 8.5 MP · 3840×2160 · 136° → ✅
- core `:506`: "**Dual-core processor**", "HDR auto night vision", "**microSD up to 256 GB**",
  "Format Free 2.0" → Dual-core + 256 GB **CA-14**; rest ✅.
- rear: 2 MP CMOS · 1920×1080 · 143° · **18 g** → ✅

**Carousels (`cSeeDetail`, `cParked`, `cSafer`, `cBuilt`, `cConnected`)** — True 4K, STARVIS
8.5 MP, AI Night Vision; Power Saving Parking "98% less power, **2,325** more hours", 20-sec
(10+10), Time-Lapse "**743** minutes", AI Heat; ADAS Plus FVMA+LDWS, Speed Camera "quarterly …
requires GPS"; FineVu App, "5GHz Wi-Fi" dual-band; **"Built-in GPS"** → all ✅.
> Note the GX4K "Built-in GPS" card (`:172`) is **correct** — `gx4k.txt` GPS is `Built-In`
> (this is the real GX4K-vs-GX35 distinction; only the GX35 "Built-in GPS" is wrong, CA-04/05).
**Except** `cBuilt` `:138` "**Built In-House** … defects below 0.2%" → both in `NOT IN SOURCE`.
**CA-14.**

**MediaSections (rendered: `mDualVision` :531, `mSecondEyes` :540, `mInYourHand` :587,
`mDiscreet` :593)** — STARVIS IMX515 8.5 MP + 2 MP rear, ADAS, app-in-hand, "screen-free
wedge-shaped body" → all ✅.

**Disabled / commented blocks** — `disappearTabs` (inside `{false && …}` at :596) and
`cStorage` (commented :549) don't ship, but per the CA-15 convention are audited: `:257`
"96.5mm … **123 g** … rear … **18 g**" → **CA-15 verified Applied** (old 114 g/23 g gone);
`:262` "single **6-metre** cable … **9-metre**" → 6 m/9 m `NOT IN SOURCE`, **CA-14** (currently
non-rendering). `cStorage` copy (Format Free 2.0 / Memory Allocation) is accurate.
Memory-allocation BarGraph percentages (:349–430) are illustrative — noted, not flagged.

**Full Specifications (`specRows` :277–289)** — Front/Rear (18 g rear), 136°/143°, night vision,
recording modes, parking (+2,325), ADAS, protection, safety DB → ✅.
- `:285` Connectivity "Built-in **dual-band Wi-Fi (2.4 / 5 GHz)** · Built-in GPS" →
  **CA-10 verified Applied** (was "5 GHz"); GPS Built-in is correct for GX4K. ✅
- `:280` Processor "**Dual-core**" (**CA-14**); `:286` Storage "microSD up to **256 GB**" (**CA-14**).
- `:706–709` ships the same **public** "confirm final figures … before publishing" note as
  GX35 → **CA-30** (Location extended to add `gx4k:706–709`).

**What's in the Box (`boxItems` :291)** — lists **6** (Front, Rear, MicroSD & Adapter, Power
Cable, Rear Cable, User Manual). `gx4k.txt` IN THE BOX lists **7** — the only missing item is
the **Hardwire Kit `{!needs approval}`** (GX4K has no Cradle/GPS antenna, so unlike GX35 that's
the sole gap). **NEW — CA-31, Needs approval** (held on the hardwire decision; do not touch
`boxItems` inference without approval).

**Series Comparison (`compareRows` :293–303 — duplicated with GX35)** — identical array; Front
sensor/resolution/rear/max-video/FOV/parking-standby/warranty all ✅. **Exceptions:** `:299`
GPS "Built-in | Built-in" — GX35 column wrong (**CA-05**, this is the `gx4k:299` location on
that row); `:301` Processor "Allwinner V536 | Allwinner V536" — both columns `NOT IN SOURCE`
(**CA-14**). *Mirror any edit in `app/gx35/page.tsx`.*

**"More reasons" bento (:642–656)**
- `:643` "**No.1 Dash Cam in Korea**" → unsourced market-rank claim. **CA-26** (Location extended
  to add `gx4k:643`).
- `:647` "3 Year Warranty" `sup="1"` → ✅; `:654` "Includes **128GB** MicroSD Card" `sup="2"` →
  matches `gx4k.txt` (no AU override for GX4K) ✅; `:655` "Includes **Hardwire Kit & Power
  Cable**" `sup="3"` → **CA-03**.

**Install band (:660–685) / comparison prose (:764–806)** — "records straight out of the box …
hardwiring …", GX4K 4K / GX35 2K → consistent. ✅
**Firmware / Downloads (`downloadTabs` :325–347, rendered :828)** — placeholder step lists,
`downloadLabel`s commented, "Coming soon" manual; no version strings, no dead links → noted,
not flagged (same state as GX35).
**Legal disclaimers (`:835`, no `limit`)** — all three footnotes cited on the page
(`sup="1/2/3"`), so rendering all three is correct; disclaimer 3 → **CA-03**. ✅
**"4 million+ sold"** (a GX4K `NOT IN SOURCE` item) → **not present** on `/gx4k` — does not
reproduce here. ✅

## Coverage report — `/gx4k` (full)

- **Read in full:** `app/gx4k/page.tsx` (every array + JSX block, incl. disabled/commented).
  Cross-checked against `gx4k.txt`, `gx35.txt` (compareRows GX35 column),
  `config/site.config.ts` (disclaimers).
- **Claims with no backing source:** F/1.8 (×2), Dual-core (×2), Allwinner V536 (×2 cols),
  microSD 256 GB (×2), defects <0.2% / Built In-House, 6 m/9 m cable (disabled) — all **CA-14**;
  "No.1 in Korea" (**CA-26**); the leaked public spec note (**CA-30**).
- **Held on box artwork / hardwire decision:** GPS compareRows (CA-05); `boxItems` missing the
  Hardwire Kit (**CA-31, new**); hardwire-kit tile + disclaimer 3 (CA-03).
- **Verified correct:** every real GX4K spec figure (IMX515 8.5 MP · 3840×2160 · 136°/143° ·
  18 g rear · 30 fps · +2,325 hrs · 743-min time-lapse · 128 GB · 123 g front), the GX4K
  "Built-in GPS" (genuinely built-in), the 128 GB SD tile, the 3-yr warranty footnote; **CA-10**
  (Wi-Fi dual-band) and **CA-15** (123 g/18 g) confirmed applied.
- **Split for this page:** CA-10, CA-15 Applied/verified · CA-03, CA-05, CA-14, CA-26, CA-30,
  **CA-31 (new)** open · CA-26 & CA-30 gained new locations. **1 new row / 0 Pending-this-page
  beyond CA-30.**

---

## Cycle status — all 8 MVP pages now fully audited (2026-07-25)

Every MVP page has had a dedicated `full` pass this cycle: `/support`, `/about`,
`/installation`, `/warranty`, `/terms-of-service`, `/gx35`, `/gx4k`, and `/` was covered in the
all-8 sweep at the top of this document (the homepage carries CA-03, CA-09, CA-14 — no
`/`-specific `full` addendum was requested, so a standalone homepage pass remains the one
outstanding deep-read if desired).
