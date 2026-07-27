# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FineVu is a marketing/brochure site for a premium dash-cam brand (Australian distributor: AutoXtreme). It is a Next.js 16 App Router app (React 19, Tailwind CSS v4, `motion`/Framer Motion, shadcn-style Radix UI). No database or auth — nearly every page is static content plus client-side animation. The one server-side piece is `app/api/contact/route.ts`, which emails contact/enquiry form submissions via **Resend** (needs `RESEND_API_KEY`; see `.env.example`). Any remaining presentation-only forms just post to that route or do nothing.

## MVP scope

The launch MVP is **eight pages**. These are the only routes that should ship complete, polished content:

**Core four** (highest priority — richest content, most scrutiny):

- **Homepage** — `app/page.tsx` (`/`)
- **GX4K** — `app/gx4k/page.tsx` (`/gx4k`)
- **GX35** — `app/gx35/page.tsx` (`/gx35`)
- **Installation** — `app/installation/page.tsx` (`/installation`)

**Supporting four** (promoted to MVP 2026-07-24):

- **Warranty** — `app/warranty/page.tsx` (`/warranty`)
- **Terms of Service** — `app/terms-of-service/page.tsx` (`/terms-of-service`)
- **Support** — `app/support/page.tsx` (`/support`)
- **About** — `app/about/page.tsx` (`/about`)

All eight are already ungated (none appear in `comingSoon`). Note the supporting four
carry **legal and warranty commitments** — warranty periods, ACL wording, returns and
support terms — so they get the same content-accuracy scrutiny as the product pages.
All eight were audited in full on 2026-07-27
(`docs/content-accuracy-audit-2026-07-27.md`), along with `config/site.config.ts`,
`lib/data/warranty.ts` and `lib/data/installation-terms.ts`.

Every other route exists but is not part of the MVP. Non-MVP pages can be hidden behind the **Coming Soon gate**: add their path to `comingSoon: string[]` in `config/site.config.ts` and `ComingSoonGate` (wired in `app/layout.tsx`) renders the branded `ComingSoon` placeholder instead of the page. Preview a gated page's real content with `?showpage=true`. Prioritise the four MVP pages; treat the rest as secondary until they're promoted out of the coming-soon list.

## 🚩 Open items — remind the user before launch

**Raise these unprompted whenever launch, deployment, or content accuracy comes up.**
They are unresolved decisions, not tasks that can just be done.

1. **The booking checkout charges nothing and submits nothing.** `/installation` step 5
   collects a full card number, expiry and CVC, then step 6 tells the customer *"your
   payment of $250.00 AUD has been received"* with a paid reference — but `next()`
   (`app/installation/page.tsx:171-174`) just fakes a 900 ms delay and generates the
   reference client-side, and the imported `submitForm` helper is **never called**. There
   is no payment provider and no endpoint, while `installation-terms.ts` §5 makes
   payment-at-booking a contractual term. A customer can complete the wizard, believe they
   are booked and paid, and no record exists anywhere. Needs a real payment + booking
   backend, or the wizard must be visibly a demo. **CA-36.**
2. **The site's primary CTA is a dead end.** `/retailers` is in `comingSoon`, so
   "Find Retailer" — the header button on every page, the footer CTA band, and one of the
   three `LearnMoreLinks` tiles that ship on all eight MVP pages — renders the Coming Soon
   placeholder. Same for every `/support` CTA including **"Start a Warranty Claim"**
   (→ `/contact`). Decide between repointing the CTAs and promoting the routes; both are
   product calls, not edits. **CA-38.**
3. **Unverified specs still need a FineVu source:** processor ("Dual-core" /
   "Allwinner V536"), "F/1.8" aperture, "microSD up to 256 GB", "defects below 0.2%",
   and the "6-metre / 9-metre" cable lengths. None appear in the official spec sheets.
   Same class, added 2026-07-27: **"Global leader in dash cam technology"** ships in every
   page's `<title>` via `siteConfig.tagline` (CA-37); **"No.1 dash cam in Korea"** on four
   MVP pages, baked into the *artwork* so removing it means replacing images (CA-26); the
   **1992 / "Fine Digital Inc." / "FINEDIGITAL" / Gyeonggi-do** heritage (CA-27); and the
   `/support` **hours and 24-hour response SLA** (CA-24/25).
4. **`app/gx35/page_bak.tsx`** is a stale backup holding *pre-fix* values (wrong GPS
   spec, etc.). Not routed so it doesn't ship, but it's a trap for anyone grepping the
   codebase. Recommend deleting.
5. **Image strategy needs triage — `next/image` vs. a `sharp` prebuild.** Unresolved,
   raise it before anyone starts the responsive-images work below. Established
   2026-07-26: `next/image` **already generates `srcSet` itself** — it omits `srcSet`
   from its props type for exactly that reason, and the current build proves it
   (`.next/server/app/installation.html` carries a real 640/828/1200/2048w set for
   `/installation/hero.webp`). So for the ~95 **local `/public`** refs it does the whole
   job the TODO describes — width variants, AVIF/WebP, no prebuild script, no manifest.
   The `images.remotePatterns` blocker is real but applies **only to the 13 remote
   Unsplash URLs**; that got over-generalized into "never use `next/image`," which is
   why local images ship full-size today. **The decision is a cost/architecture call, not
   a technical one:** `/_next/image` is a metered transformation quota on Vercel and a
   runtime request per image, versus static files from a `sharp` prebuild. Needs the
   user (billing owner) to choose. Related: `components/sections/Carousel.tsx` renders a
   plain `<img>`, so every carousel image on `/gx4k`, `/gx35` and `/installation` — incl.
   the 16 MB `detail-starvis.png` — currently ships unoptimized either way.
6. **Firmware sections are HIDDEN on both product pages — restore before launch.** The user
   deliberately commented them out on 2026-07-27 because the download files were not the
   correct ones. **They must go back once the real files are in hand** — a dash-cam product
   page without firmware downloads is a support gap, not a design choice.
   - `app/gx35/page.tsx:883` — `{/* <FirmwareDownloads tabs={downloadTabs} theme="light" … /> */}`
   - `app/gx4k/page.tsx:839` — `{/* <FirmwareDownloads tabs={downloadTabs} theme="dark" … /> */}`

   The `downloadTabs` arrays (`gx35:432`, `gx4k:339`) and the `FirmwareDownloads` import are
   **still in place**, so restoring is just uncommenting — but that also means TypeScript
   reports `downloadTabs` as unused in both files. **Do not "clean up" those arrays**; that
   would delete the restore path. Ask before touching them.

   Related: **CA-13** in `docs/content-accuracy-changes.csv` — firmware versions on
   `/support` are unsourced and its download links are dead. Same root cause (no correct
   files yet), so settle both together when the files arrive.

### ✅ Settled — do not re-open

**The Hardwire Kit is an in-box item.** Resolved 2026-07-27: `docs/content-sources/gx4k.txt`
and `gx35.txt` both list a **Hardwire Kit** *and* a separate **Power Cable** under
`IN THE BOX`, with the `{!needs approval}` tag removed and the `ADDITIONAL OPTIONS` sections
deleted. So the seven site surfaces claiming "Includes Hardwire Kit & Power Cable" were
right, and `boxItems` was the wrong side — both lists have since been corrected to match
their source exactly (GX4K 7 items, GX35 9 including Cradle and GPS Antenna). Do not revert
`boxItems` or disclaimer 3. **CA-03 / CA-06 / CA-29 / CA-31.**

One narrow question survives: `/installation` calls the included Power Cable *"a simple
plug-in DIY setup"*, which needs it to be self-powering — but the distributor tile shows a
bare barrel jack with **no cigarette-lighter plug**, and no source states the termination.
One photo of the AU retail cable settles it. **CA-01 / CA-02.**

**GX35 GPS is external.** The GX35 spec sheet says only `GPS: O` (the GX4K says "Built-In"),
the box ships a GPS(2.5Φ) antenna, and `lib/data/warranty.ts` §4 warrants a "Genuine FineVu
external GPS accessory". Both `compareRows` copies, the spec row and the carousel card were
corrected on 2026-07-27. The GX4K's "Built-in GPS" is correct and should stay.
**CA-04 / CA-05.**

## Going live — launch steps

Work top to bottom. **Steps 1–3 are hard gates: do not deploy to production until each
passes.** This is a public marketing site with a live email backend, so treat launch as
a gate, not a formality.

### 1. Security pass (hard gate)

- **Secrets:** `RESEND_API_KEY` (and any other secret) is set only in the host's
  environment (marked Sensitive in Vercel), **never** committed, **never** prefixed
  `NEXT_PUBLIC_`. Verify no keys are hardcoded (`grep -rn "re_" app`).
- **Contact route hardening (`app/api/contact/route.ts`):** add **rate limiting** and/or
  CAPTCHA — currently only a honeypot protects it, so it can be scripted to spam the
  support inbox and burn Resend quota. Keep `to`/`from` env-controlled (never
  user-supplied) so it can't become an open relay. Keep HTML-escaping on all input.
- **Resend sender domain:** `finevuaustralia.com.au` must be verified in Resend and
  `CONTACT_FROM_EMAIL` moved off `onboarding@resend.dev`.
- **Dependencies:** run `npm audit`, resolve high/critical findings, then re-run
  `npm run build` clean.
- **Headers/HTTPS:** confirm security headers (CSP where feasible, HSTS, etc.) and that
  the deploy is HTTPS-only.

### 2. Content accuracy (hard gate)

- All product specs verified against official FineVu data — see
  `docs/content-accuracy-audit-*.md` (latest: **2026-07-27**, a full pass over all eight
  MVP pages). **Don't launch with open `Pending` / `Needs approval` rows** in
  `docs/content-accuracy-changes.csv`, and settle the Open items listed above first.
- Remember AU-market figures may legitimately differ from the Korean spec sheet (e.g.
  the GX35 ships a **64GB** card here vs 128GB officially — that's correct, not a bug).

**Audit change log — keep it current.** Every time you run or update a content-accuracy
audit, you MUST also update the single canonical change log `docs/content-accuracy-changes.csv`
in the same pass — it's part of the audit, not a separate request.

It is a **living tracker**, not an append-only ledger: **one row per issue**, keyed by a
stable `ID` (`CA-01`, `CA-02`, …). Per-cell rules:

- **`Old value` is FROZEN** — the value as first found. Once written it never changes.
- **`New value`, `Why it changed`, `Status`** are editable — a later pass may refine the
  target/reasoning, and `Status` moves `Ready → Applied → Verified` as work happens.
- **`First found` is frozen; `Last updated`** = the date of the audit that last touched
  the row. Per-audit history lives in **git** (`git blame`/commits), not in extra rows.

Schema (exact column order): `ID, Page, Location, Old value, New value, Why it changed,
Status, First found, Last updated`. **`Status` is one of exactly three values** — the axis
is *decision authority* (can you + the user settle it, or must it go higher?):

- **`Applied`** — decided by us and the change is in the code.
- **`Pending`** — ours to decide, agreed, just not applied yet (the safe fixes).
- **`Needs approval`** — beyond our call: needs ops/legal/business, or a fact we don't have
  (absorbs the old "ops sign-off" / "business decision" / "needs source"). Anything a
  source file tags `{!needs approval}`, and anything depending on it, is `Needs approval`.

The *reason* something is `Needs approval` goes in the `Why` column, not the Status.

Upsert, don't blind-append: if a finding already has a row (match on `ID` / same
`Location` + issue), update its editable cells and bump `Last updated`; only add a new row
+ next `ID` for a genuinely new issue. When a fix is applied, set that row's `Status`.
One row per concrete old→new change (same edit across several lines = one row listing them).
The narrative still goes in `docs/content-accuracy-audit-*.md`; the CSV is the flat diff
view. Keep the two consistent.

### 3. Search-engine visibility (hard gate — decide deliberately)

Indexing is **off by default** and controlled by one env var, `SITE_INDEXABLE`:

- Unset / anything but `"true"` → **noindex** (fail-safe: a typo keeps the site hidden).
- `SITE_INDEXABLE=true` → indexable; also adds the sitemap line to `/robots.txt`.

Enforced in three places that **must stay in sync** — change one, change all:
`robots` metadata in `app/layout.tsx` (HTML), the `X-Robots-Tag` header in
`next.config.ts` (everything incl. images/API), and `app/robots.ts` (`/robots.txt`).

**Do not add `Disallow: /` to robots.txt while noindex is active.** It looks right and is
wrong: a crawler must be able to *fetch* a page to see its `noindex`. Blocking the fetch
lets Google index bare URLs found elsewhere ("No information is available for this page")
while never learning to drop them. Allowing the crawl is what makes noindex work.

**noindex ≠ private.** It only makes the site unlisted, and only for crawlers that honour
it (Google does; scrapers don't). Anyone with the URL can still view it. If the site must
be genuinely unreachable pre-launch, use **Vercel Deployment Protection** (password/SSO) —
that blocks at the network layer and is the only airtight option.

If launching noindex, add a **sitemap (`app/sitemap.ts`)** before flipping to indexable —
it doesn't exist yet.

### 4. Verify the deploy

```bash
npm run build                                   # must be clean
curl -sI https://<domain>/ | grep -i x-robots   # confirm the visibility state you intended
```

Then walk the four MVP pages (`/`, `/gx4k`, `/gx35`, `/installation`) in a browser, and
submit the contact form once to confirm mail actually lands in the support inbox.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (use this to catch type/lint errors — there is no test suite)
npm start        # serve the production build
npm run lint     # eslint (flat config, eslint-config-next)
```

There are **no tests**. Verification = `npm run build` + driving the page in the browser. The `docs/responsiveness-audit-*.md` files are manual QA reports, not automated checks.

## Architecture

- **`config/site.config.ts`** — single source of truth for nav links, CTAs, hero copy, contact/distributor details, and the trust marquee. `SiteConfig` is a typed schema; edit content here rather than hardcoding in components. `layout.tsx` metadata and `Navigation` both read from it.
- **`app/`** — App Router pages. Product pages (`gx4k`, `gx35`), audience/landing pages (`services`, `retailers`, `support`, `about`, etc.), and blog at `learn/` + dynamic `learn/[slug]`.
- **`lib/data/articles.ts`** — the entire "Learn" blog content lives here as an array of `Article` objects with **HTML strings** in `content`. `learn/[slug]/page.tsx` finds the article by slug, injects `id`s into `<h3>` tags to build a table of contents, and renders via `dangerouslySetInnerHTML` styled by `@tailwindcss/typography`.
- **`components/`** — top-level components are bespoke site sections/animations (Hero, Navigation, Footer, TiltCard, MagneticButton, ParallaxImage, AnimatedCounter, etc.). `components/ui/` is the generated shadcn/Radix primitive set — treat as vendored; prefer composing over editing.
- **`components/LandingPageLayout.tsx`** — reusable template driving most audience landing pages via props (title, benefits grid, optional `form`, optional `content`, FAQ).

### Two conventions that are easy to miss

1. **`data-nav-theme` drives the navbar color.** `Navigation` uses an IntersectionObserver to read the `data-nav-theme="dark" | "light"` attribute of whatever section is under the header, then swaps to white or dark text/glass. **Every full-width `<section>` must set `data-nav-theme`** or the navbar will render with the wrong contrast when scrolled over it.

2. **Use `ImageWithFallback` (`components/figma/ImageWithFallback.tsx`), not `next/image`.** This is a plain `<img>` with an SVG error placeholder. Many images are remote Unsplash URLs; `next.config.ts` does not configure `images.remotePatterns`, so `next/image` would reject them.

### `ScrollScrubVideo` — video encoding

`components/sections/ScrollScrubVideo.tsx` scrubs a background video by writing
`video.currentTime` from scroll progress. Smooth scrubbing depends entirely on
**keyframe density** — the seek cost is decoding, not the animation library (no
GSAP; we use `motion`'s `useScroll` + a rAF lerp). A normal web MP4 has ~1
keyframe per few seconds, so seeking lands on the nearest keyframe and stutters.

Re-encode any clip fed to `ScrollScrubVideo` so **every frame is a keyframe**:

```bash
ffmpeg -i input.mp4 -an \
  -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/<page>/<name>_scrub.mp4
```

- `-g 1 -keyint_min 1 -sc_threshold 0` → keyframe on every frame (exact seeks).
  This inflates file size (e.g. `hero_render.mp4` → `hero_render_scrub.mp4`,
  ~6.7MB); keep the clip short and drop `fps`/`scale` if it gets large.
- `-an` strips audio (video is `muted`), `+faststart` moves the moov atom up for
  progressive load, `-pix_fmt yuv420p` keeps it broadly decodable.
- Verify with `ffprobe -select_streams v -show_frames -show_entries frame=pict_type input.mp4 | grep -c 'pict_type=I'`
  — the I-frame count should equal the total frame count.
- Keep the un-scrubbed original around for any normal autoplay use; suffix the
  scrub build `_scrub.mp4` so it's obvious which is which.

## TODO / deferred work

### Responsive images (`srcset`) — not yet built

The site ships full-size originals to every device. `public/` is **~201 MB / 98
raster files**, including unoptimized PNGs like `public/gx4k/detail-starvis.png`
(**16 MB**) and several 5–6 MB graphics. There are ~41 image sites across ~13 files
(95 local `/public` refs + 13 remote Unsplash URLs). This payload — not the markup —
is the real problem; `srcset` only helps once smaller variants actually exist.

Groundwork already in place: **`ImageWithFallback` is a plain `<img>` that spreads
`...rest`**, so `srcSet`/`sizes` already pass straight through (see
`FeatureTabs`'s `imageSrcSet`/`imageSizes` props). We deliberately avoid `next/image`
(remote Unsplash + no `images.remotePatterns` + static prerender).

> ⚠️ **Read open item 5 first — that "avoid `next/image`" rule only holds for the 13
> remote Unsplash URLs.** For local `/public` images `next/image` already emits a real
> `srcSet` and would replace steps 1–2 below entirely. The prebuild plan is therefore
> *one of two options*, not the settled approach — the choice is unmade and needs the
> user. Don't start this work before it's triaged.

Recommended approach when picked up:
1. Add `sharp` and a **prebuild script** that generates width variants
   (e.g. 480/960/1440/1920) in **webp + avif** for `/public` rasters, plus a manifest
   mapping source path → variants. Fold in compression of the giant PNGs (the biggest
   single win).
2. A `ResponsiveImage` wrapper (or an extended `ImageWithFallback`) that reads the
   manifest and emits `<picture>` with `srcSet`/`sizes`. For the 13 **Unsplash** URLs,
   build the `srcSet` from `&w=`/`&q=`/`&fm=` params instead of generating files.
3. Roll out MVP-4 pages first (Homepage, GX4K, GX35, Installation), then the rest.

### Styling

- Tailwind v4 (CSS-first, `@import "tailwindcss"` in `app/globals.css` — no `tailwind.config.js`).
- Brand tokens are CSS variables in `globals.css`. Use `var(--brand-primary)` (FineVu orange, the only accent), `var(--brand-gradient)` (the 65° purple→blue hero gradient), and the semantic `--background`/`--foreground`/`--border` set. **Legacy aliases exist and are intentional**: `--electric-green` is remapped to brand orange, so older `text-[var(--electric-green)]` refs still render on-brand — don't "fix" them to a real green.
- `"use client"` is required on any component using `motion`, hooks, or `useParams`/`usePathname` (most components here).
- Path alias: `@/*` → repo root.
