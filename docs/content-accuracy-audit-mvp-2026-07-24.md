# Content Accuracy Audit — all eight MVP pages

**Date:** 2026-07-24
**Scope:** `/`, `/gx4k`, `/gx35`, `/installation`, `/warranty`, `/terms-of-service`,
`/support`, `/about` — plus the shared sources they read from
(`config/site.config.ts`, `lib/data/warranty.ts`, `lib/data/installation-terms.ts`).
**Source of truth:** the four scrapes in `finevu/data/` (`scraped-gx4k.html`,
`scraped-gx4k-specs.html`, `scraped-gx35.html`, `scraped-gx35-specs.html`), plus the
box-contents artwork those pages embed but do not express as text:

| Asset | URL |
|---|---|
| GX4K in-box | `https://en.finevu.com/assets/images/gx4k_tab_whatsInTheBox_1.png` |
| GX4K optional | `https://en.finevu.com/assets/images/gx4k_tab_whatsInTheBox_2.png` |
| GX35 in-box | `https://en.finevu.com/assets/images/GX35_basic_configuration.png` |
| GX35 optional | `https://en.finevu.com/assets/images/GX35_additional_options.png` |

> **Note on the four scrapes.** The `-specs` variants are the *same pages* as the
> non-`-specs` ones — diffing the extracted text shows only a nav-menu difference. So
> there are two source documents, not four. Everything in the "Specifications" tab was
> already present in the earlier scrapes; the new information in this pass came from the
> **box-contents images**, which are the only place FineVu states what ships in the box.

**Supersedes/extends:** `docs/content-accuracy-audit-2026-07-24.md` (which covered only
`/`, `/gx4k`, `/gx35`). Items already fixed there are not repeated. **Two findings below
reverse conclusions from that audit** — see #1 and #2.

---

## Summary

| # | Page(s) | Issue | Severity |
|---|---------|-------|----------|
| 1 | GX4K, GX35, Home, Support, Install | **Hardwire kit: resolved.** The included "Power Cable" *is* the hardwire cable. `boxItems` was right all along; the *installation page* has it backwards | 🔴 resolves open item D |
| 2 | GX35, GX4K | **GX35 GPS is external (antenna in the box).** The previous audit "fixed" this to "Built-in" — that fix was wrong | 🔴 regression |
| 3 | GX35 | `boxItems` omits the **Cradle** and the **GPS antenna** that FineVu ships | 🔴 |
| 4 | Support | GX35 described as "Compact **FHD** front & rear" — it's **QHD 2560×1440** | 🔴 |
| 5 | Install vs ToS | Page says "no payment to book, pay on the day"; the Terms say "payment is required at the time of booking" | 🔴 legal conflict |
| 6 | Home | Third-party review #2 (GX35) is not in any source document | 🟠 |
| 7 | GX4K | Spec row calls Wi-Fi "5 GHz" — it is dual-band 2.4 / 5 GHz | 🟡 |
| 8 | About | `LegalDisclaimers` renders all three disclaimers; its own comment says `limit={1}` | 🟡 |
| 9 | Install | `NT` is selectable in the state list, but the page says NT isn't serviced | 🟡 |
| 10 | Support | Firmware versions `v2.03` / `v1.14` have no source; all download links are `href="#"` | 🟡 |
| 11 | — | Carry-over unverified claims from the previous audit — still unverified | 🟡 |

✅ **Verified correct, no change:** the warranty periods, the ACL wording, the 3-year /
6-month split, the SGcarmart review label, and every product spec figure not listed above.

---

## 🔴 1. Hardwire kit — the open question is answered, and the site has it inverted

**This closes item D of the previous audit and open item 1 in `CLAUDE.md`.** No ops
decision is needed for `boxItems`; one *is* still needed on the installation page.

FineVu's own box artwork settles it:

**GX4K — Basic Configuration (in the box):** Front Camera · Rear Camera · Micro SD Card
& Adapter · **Power Cable** · Rear Cable · User Manual
**GX4K — Additional Options (sold separately):** **Cigarette lighter power cable** · USB
SD card reader · Micro SD card & adaptor

The item drawn as **"[ Power Cable ]"** is unmistakably a **hardwire loom**: three leads,
an inline fuse holder, and a ring/eyelet ground terminal, ending in the barrel jack. It
is *not* a 12 V plug. The cigarette-lighter cable appears **only** under Additional
Options. The GX35 artwork is identical in this respect.

Corroborating text in both scrapes, Absolute Parking Mode section:

> "Secure the right moment with **included** hardwire cable. \* Requires hardwire cable installation"

### What this means

- **`boxItems` in `app/gx4k/page.tsx:291` and `app/gx35/page.tsx:373` are correct as
  written.** The "Power Cable" entry *is* the hardwire kit. Do not add a separate
  "Hardwire Kit" line — that would imply two cables ship, which is wrong.
- The seven sitewide "includes Hardwire Kit & Power Cable" claims are **substantively
  true but poorly worded** — it is one cable, not two. Consider rewording to
  "Includes Hardwire Power Cable" (homepage tile `app/page.tsx:118`, disclaimer 3 in
  `config/site.config.ts:173-176`, and the GX4K/GX35 tiles).
- **The installation page has it exactly backwards** and this is the one real error:

  `app/installation/page.tsx:76` (FAQ, "Why is hardwire the standard install?")
  ```
  current:  "If you only want recording while driving, the included power cable is a
             simple plug-in DIY setup, so there's no need to book an install for that."
  replace:  "If you only want recording while driving, a cigarette-lighter power cable
             (available separately) is a simple plug-in DIY setup, so there's no need to
             book an install for that."
  ```

  Same error at `app/installation/page.tsx:242`:
  ```
  current:  "Prefer plug-in power for driving-only recording? That's a simple DIY setup
             with the included power cable — no booking needed."
  replace:  "Prefer plug-in power for driving-only recording? That's a simple DIY setup
             with a separately available cigarette-lighter cable — no booking needed."
  ```

  As written the page tells customers the in-box cable is a plug-in accessory, which will
  produce support calls from people who open the box and find a fused loom with a ring
  terminal.

---

## 🔴 2. GX35 GPS is external — the previous audit's fix was wrong

Items #4 and #6 of `docs/content-accuracy-audit-2026-07-24.md` changed the GX35 GPS from
"External (included)" to "Built-in", reading the spec table's `GPS: O` as "built-in".
That reading does not hold up:

- **The GX35 box contains a GPS antenna.** The Basic Configuration artwork lists
  **`[ GPS(2.5Φ) ]`** — a puck antenna on a lead with a 2.5 mm plug. A product with a
  built-in receiver would not ship one.
- **The two spec sheets word the row differently.** GX4K says `GPS: Built-In`. GX35 says
  only `GPS: O` (i.e. "has GPS"), the same `O`/`X` notation used for Microphone, Speaker
  and Bluetooth on that page. GX4K's `Built-In` is deliberate wording the GX35 lacks.
- **GX4K has a whole feature section headed "BUILT-IN GPS — WITHOUT THE BURDEN OF
  PURCHASING ADDITIONAL EXTERNAL GPS." The GX35 page has no GPS feature section at all**,
  and "Built-in GPS" does not appear in its feature bullet list.
- `lib/data/warranty.ts:112` already warrants a **"Genuine FineVu external GPS
  accessory"** — written before the "fix", and consistent with an external antenna.

Three locations to revert:

`app/gx35/page.tsx:368`
```
current:  ["Connectivity", "Built-in Wi-Fi · Built-in GPS · FineVu Wi-Fi App"]
replace:  ["Connectivity", "Built-in Wi-Fi · External GPS antenna (included) · FineVu Wi-Fi App"]
```

`app/gx35/page.tsx:158` (carousel card title) and `app/gx4k/page.tsx:299` /
`app/gx35/page.tsx:389` (the duplicated `compareRows`, GPS row):
```
current:  ["GPS", "Built-in", "Built-in"]
replace:  ["GPS", "Built-in", "External antenna (included)"]
```

⚠ **Confirm with ops before applying.** This one rests on inference from artwork and
wording, not an explicit "external GPS" statement — and it reverses a change made
earlier today. If ops can get FineVu to state it plainly, do that first. GX4K's built-in
GPS is not in doubt either way.

---

## 🔴 3. GX35 `boxItems` is missing two items FineVu ships

`app/gx35/page.tsx:373-380`. Official Basic Configuration for the GX35 is **eight** items;
the site lists six. Missing: **Cradle** and the **GPS antenna**.

```
current:
  const boxItems = ["Front Camera", "Rear Camera", "Power Cable", "Rear Cable",
                    "User Manual", "MicroSD Card & Adapter"];
replace:
  const boxItems = ["Front Camera", "Rear Camera", "Cradle", "MicroSD Card & Adapter",
                    "Power Cable", "Rear Cable", "GPS Antenna", "User Manual"];
```

Note the GX4K box has **no** cradle and **no** GPS antenna — its six-item list is
complete and correct. The asymmetry is real, not an oversight.

Depends on #2: if ops rules the GX35 GPS is built-in after all, drop the GPS antenna
entry but still add the Cradle.

---

## 🔴 4. Support page calls the GX35 an FHD camera

`app/support/page.tsx:48`. The GX35 front camera is **QHD 2560×1440**. Every other page
says so, including the nav ("GX35 — 2K 2CH").

```
current:  line: "Compact FHD front & rear dash cam",
replace:  line: "Compact 2K QHD front & Full HD rear dash cam",
```

For symmetry, `app/support/page.tsx:40` ("4K UHD front & FHD rear dash cam") is correct.

---

## 🔴 5. Installation page and the Terms disagree about when you pay

The installation page states **six times** that nothing is payable at booking:

- `app/installation/page.tsx:48` — hero stat: "No payment to book / Pay on the day"
- `:53` — "$250 flat — no payment required to reserve."
- `:79` — "There's no payment to book — your installer collects the $250 on the day"
- `:176` — "$250 flat — paid on the day"
- `:222` — "$250 AUD · Pay on the day"
- `:346` — "There's nothing to pay now"
- `:465` — "no payment to book, pay your installer on the day"

`lib/data/installation-terms.ts:135` (§5 Prices and payment) states the opposite:

> "**Payment is required at the time of booking** unless we expressly agree otherwise."

The rest of §5–6 and §12 is written throughout on the assumption of upfront payment —
card surcharges "disclosed before you complete payment", a merchant descriptor on "your
card or bank statement", and late-cancellation fees "deducted" from an amount already
paid with "any amount exceeding the applicable cancellation fee refunded." None of that
can happen if no money changes hands until the installer arrives. The `/terms-of-service`
metadata description likewise promises terms for when you "book **and pay** for" an
installation.

**This is the one finding that carries legal exposure** — the Terms are the binding
document and they contradict the pre-contractual representation on the booking page.
One of the two has to change, and it's a business decision, not an editorial one:

- **If pay-on-the-day is the real process:** amend §5 to say payment is collected on
  completion, and rework §12's cancellation-fee mechanics (which currently only work by
  deducting from a prepayment).
- **If payment at booking is the real process:** the installation page's seven
  reassurances all have to go, and the booking form needs a payment step it does not
  currently have.

Also note the booking form at `app/installation/page.tsx` never presents the Terms for
acceptance, while `installation-terms.ts:35` says "By submitting and paying for an
installation booking, you agree to these Terms." Add a link + acknowledgement to the
final step of the form.

---

## 🟠 6. Homepage review #2 has no source

`app/page.tsx:139-141`:

> "Really compact and the video recording was extremely clear. Value for money as well"
> — attributed to *FineVu GX35*, labelled "Review on SGcarmart"

The GX35 page carries exactly three SGcarmart reviews, none of which is this one:

- Donny Ang — "Crispy clear image. easy connection to phone for straight forward download."
- Baharudin Bin Selamat — "The camera, compact and it nicely on the front and rear."
- Kevin — "Clear video and easy to use! Will recommend to friends for installation."

Reviews #1 and #3 on the homepage **are** verbatim from the GX4K page (Kenneth Chuan and
Jian Yang Mok respectively) — those are fine. Replace #2 with a real one, e.g. Donny Ang's.

Related: the three cards no longer carry the "- Name, Owner of ..." attribution the
source quotes have (the previous audit added it inline to #3; it has since been removed).
Attributed testimonials from a named marketplace should keep their attribution.

**Resolved from the previous audit:** the "Review on SGcarmart" label was flagged as
possibly wrong. It is **correct** — FineVu's own review sections on both product pages
are headed with the SGcarmart logo (`/assets/images/sgcarmart_logo.png`) and render
five-star ratings, matching the site's presentation.

---

## 🟡 7. GX4K Wi-Fi is dual-band, not 5 GHz

`app/gx4k/page.tsx:285`. Official: `Wi-Fi: Built-In (2.4GHz/5.0GHz)` for both models.

```
current:  ["Connectivity", "Built-in 5 GHz Wi-Fi · Built-in GPS"]
replace:  ["Connectivity", "Built-in dual-band Wi-Fi (2.4 / 5 GHz) · Built-in GPS"]
```

The "5GHz Wi-Fi" *feature cards* (`gx4k:167`, `gx35:153`) are fine — 5 GHz is genuinely
supported and it's the marketable half. Only the spec row should be complete.

---

## 🟡 8. About page renders disclaimers it doesn't cite

`app/about/page.tsx:246-249`. The comment says `limit={1}` — "this page only cites the
warranty ([1] on the trust card), not the SD-card or hardwire-kit claims" — but the prop
is absent, so all three render. The page makes neither the SD-card nor the hardwire
claim, so it currently prints two pieces of fine print with nothing to footnote, and adds
an eighth site location asserting hardwire-kit inclusion.

```
current:  <LegalDisclaimers theme="light" />
replace:  <LegalDisclaimers theme="light" limit={1} />
```

(Also fixes the stray indentation on that line.)

---

## 🟡 9. NT is bookable but not serviced

`app/installation/page.tsx:37` puts `"NT"` in the `STATES` dropdown, while `:82` (FAQ)
says "Installation is not currently available in the Northern Territory" and
`coverageMessage` at `:86` rejects `08xx`/`09xx` postcodes. A customer can pick NT in
step 2 and only discover the problem via the postcode field. Either drop `"NT"` from
`STATES` or disable it with the reason shown.

---

## 🟡 10. Support page downloads are placeholders

`app/support/page.tsx:42` and `:50` publish firmware versions **`v2.03`** (GX4K) and
**`v1.14`** (GX35). Neither appears in the source data, and FineVu's own pages put
firmware behind a "Manuals & Firmware" tab this scrape did not capture. Every link in
both `downloads` and `guides` is `href="#"`, so the whole Download Centre — the reason
most people visit a support page — is non-functional.

Get the real version strings and files from FineVu before launch, or remove the version
metadata so the page doesn't state a version it can't serve.

---

## 🟡 11. Carry-over: still unverified after this pass

Re-checked against both scrapes *and* the box artwork. Nothing new supports them:

- **Processor "Dual-core" / "Allwinner V536"** — `gx4k:280,301,506`; `gx35:76,363,391`.
  The spec sheets list no processor row at all, for either model.
- **"microSD up to 256 GB"** — `gx4k:286,506`; `gx35:369`. Official states only the
  bundled card (128 GB) plus "Class 10 or above, UHS-1 recommended, SDXC compatible."
- **"F/1.8" aperture** — `gx4k:70`; `gx35:58,187,504`. No aperture figure is published.
- **"defects below 0.2%" / "Built In-House"** — `gx4k:138`; `gx35:167`; `about:28,159`.
- **"6-metre / 9-metre" cable lengths** — `gx4k:261`; `gx35:203` (hidden blocks).
- **"4 million+ sold"** — `config/site.config.ts:131,140` (trust marquee). Not in source.

Still-live from the previous audit's "hidden but wrong" list — these ship wrong the
moment the `{false && …}` "Designed to Disappear" blocks are re-enabled:

- `gx4k:257` — front unit "just 114g" and rear "only 23g". Official GX4K: **123 g** front,
  **18 g** rear. Both numbers are wrong; the 23 g is the GX35's rear.
- `gx35:200` — front unit "76g". Official GX35: **57 g**. (Its "23g" rear is correct.)

---

## ✅ Verified correct — no change needed

Checked this pass and confirmed against source:

- **Warranty periods.** `lib/data/warranty.ts:107-113` — 3 years / 36 months on main and
  rear units, 6 months on MicroSD, hardwire kit, power cable, GPS accessory and other
  genuine accessories. Matches FineVu's `Warranty: 3-Years` and "The warranty period of
  the Micro SD card is 6 months." The disclaimer in `config/site.config.ts:161-164` says
  the same thing in the same terms. No drift between the two.
- **ACL wording.** The warranty and installation-terms documents consistently preserve
  statutory rights and don't purport to exclude consumer guarantees.
- **All GX4K spec figures**: IMX515 8.5 MP · 3840×2160 · 136°/143° · 18 g rear · 30 fps ·
  +2,325 standby hours · 98% power saving · 743-minute time-lapse · 128 GB card.
- **All GX35 spec figures**: STARVIS 2 IMX675 5.12 MP · 2560×1440 · 147.4°/143.2° · 23 g
  rear · +13,950 standby hours · 1,129-minute Smart Time-Lapse · 30% lower sensor power
  draw · 20-second Absolute Parking capture with 10-second pre-buffer · supercapacitor.
- **GX35's 64 GB card** (vs FineVu's 128 GB) — AU bundle difference, confirmed previously.
- **"Since 1992" / "over 30 years" / "No.1 in Korea"** — consistent with FINEDIGITAL's
  own materials and the "No.1 SALES DASHCAM IN KOREA" masthead on both source pages.
- **SGcarmart review label and 5-star display** — see #6.

---

## Notes for whoever applies these

- `compareRows` is still **duplicated verbatim** in `app/gx4k/page.tsx:293` and
  `app/gx35/page.tsx:383`. Any GPS change (#2) must be made in both.
- Both product pages still carry the self-flagged "confirm final figures against the
  official spec sheet before publishing" line (`gx4k:707`, `gx35:~690`). Once #1–#4 are
  settled that line can come out.
- `app/gx35/page_bak.tsx` is still present and still holds pre-fix values. It is not
  routed, but it will mislead anyone grepping. Recommend deleting.
- **AU-bundle caveat applies to #1 and #3.** The GX35's 64 GB card proved AutoXtreme's
  bundle can legitimately differ from the Korean one. The box artwork above is FineVu
  Korea's. Before publishing a box-contents list, someone should open an actual AU retail
  box — that is a five-minute check that makes items #1 and #3 certain rather than
  well-evidenced.
