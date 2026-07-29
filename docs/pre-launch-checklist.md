# Pre-launch checklist — FineVu Australia

**Living document.** Tick items off as they land, amend them as the site changes, add new
ones as they're found. Every item is written so it can be *observed* to be true or false —
the verification command or URL is on the item itself.

## How to read this

- 🔒 **Hard gate** — blocks a production deploy. Three of them: Security, Content
  accuracy, Search visibility. These mirror CLAUDE.md § "Going live".
- **[DECISION]** — needs a call from the user/business, not a dev fix.
- **[EXTERNAL]** — blocked on someone outside the project (FineVu, Resend, a domain, files
  we don't have yet).
- Status values: `PASS` / `FAIL` / `TODO` (not yet checked) / `N-A`, each with the date it
  was last verified. **If you change the code, re-verify and update the date.**

Content-accuracy issues live in `docs/content-accuracy-changes.csv` — that stays the
canonical tracker. This list points at it and does not duplicate its rows.

---

## 0. Snapshot

- Last full verification: **2026-07-29**, branch `staging`, working tree clean.
- Hard-gate items failing: **10** (4 security, 3 content, 3 SEO). Plus 5 dead-link
  findings (§9) and 1 legal (§10).
- Single highest-risk item: the installation checkout takes card details and confirms a
  payment that never happens (§2).

---

## 1. 🔒 Security & secrets

- [x] **No secrets in the repo.** No API key hardcoded anywhere in app code.
      `grep -rn "re_" app components lib config`
      *PASS — clean, verified 2026-07-29.*

- [ ] **`RESEND_API_KEY` set correctly in Vercel** — production env only, marked
      Sensitive, never prefixed `NEXT_PUBLIC_`.
      *TODO — needs checking in the Vercel dashboard, can't be verified from the repo.*

- [ ] **Rate limiting and/or CAPTCHA on the contact route.** Currently the only protection
      is a honeypot field (`payload.botcheck`, `app/api/contact/route.ts:50`), so the
      endpoint can be scripted to flood the support inbox and burn Resend quota.
      *FAIL — verified 2026-07-29. `to`/`from` are env-controlled, so it is at least not
      an open relay.*

- [ ] **Resend sender domain verified.** `finevuaustralia.com.au` verified in Resend and
      `CONTACT_FROM_EMAIL` moved off `onboarding@resend.dev`.
      *FAIL [EXTERNAL] — `app/api/contact/route.ts:9` still defaults to
      `FineVu Website <onboarding@resend.dev>`, verified 2026-07-29.*

- [ ] **Support address reconciled.** The route defaults to
      `support@finevuaustralia.com.au` (`route.ts:8`) but the `.env.example` comments say
      `support@finevuaustralia.com` (no `.au`). One of them is wrong and mail could be
      going nowhere.
      *FAIL — verified 2026-07-29.*

- [ ] **`npm audit` clean of high/critical**, then `npm run build` still clean.
      `npm audit`
      *FAIL [DECISION] — 8 vulnerabilities (7 high, 1 low) as of 2026-07-29: `postcss`
      (XSS + arbitrary file read via sourceMappingURL) and `sharp` (libvips CVEs), both
      reached through `next`. `npm audit fix --force` installs `next@16.2.12`, outside the
      stated dependency range — that's a framework upgrade, needs a call.*

- [ ] **Security headers set.** CSP where feasible, plus HSTS,
      `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
      *FAIL — `next.config.ts` `headers()` emits only `X-Robots-Tag`, verified 2026-07-29.*

- [ ] **Deploy is HTTPS-only**, HTTP redirects to HTTPS.
      `curl -sI http://<domain>/`
      *TODO — needs the live domain.*

---

## 2. 🔒 Content accuracy

- [ ] **No open rows in the change log.** `docs/content-accuracy-changes.csv` must have no
      `Pending` or `Needs approval` rows at launch.
      *FAIL — 29 Applied, **13 Needs approval**, 1 Pending, verified 2026-07-29.*

  Open IDs, tick individually:
  - [ ] **CA-01 / CA-02** [EXTERNAL] — `/installation` calls the in-box Power Cable "a
        simple plug-in DIY setup", which requires it to terminate in a 12V plug. The
        distributor tile shows a bare barrel jack. One photo of the AU retail cable
        settles it.
  - [ ] **CA-13** [EXTERNAL] — `/support` firmware versions are unsourced and the download
        links are dead. Same root cause as §2 firmware below.
  - [ ] **CA-14** [EXTERNAL] — unverified specs with no FineVu source: processor
        ("Dual-core" / "Allwinner V536"), "F/1.8" aperture, "microSD up to 256 GB",
        "defects below 0.2%", the "6-metre / 9-metre" cable lengths.
  - [ ] **CA-24 / CA-25** [EXTERNAL] — `/support` opening hours and the 24-hour response
        SLA have no source; FineVu Korea publishes different (US EST) hours.
  - [ ] **CA-26** [EXTERNAL] — "No.1 dash cam in Korea" on four MVP pages, **baked into
        the artwork**, so removing it means replacing images.
  - [ ] **CA-27** [EXTERNAL] — the 1992 / "Fine Digital Inc." / "FINEDIGITAL" /
        Gyeonggi-do heritage claims on `/about` and the homepage.
  - [ ] **CA-33** [DECISION] — `/retailers` content.
  - [ ] **CA-35** [DECISION] — `/installation` promises instant confirmation; Terms §4
        says otherwise. Soften the page or amend the terms.
  - [ ] **CA-36** [DECISION] — the fake checkout. See the dedicated item below.
  - [ ] **CA-37** [DECISION] — "Global leader in dash cam technology" ships in **every**
        page's `<title>` via `siteConfig.tagline` (`config/site.config.ts:98`). Unsourced
        market-leadership superlative.
  - [ ] **CA-38** [DECISION] — the primary CTA is a dead end. `/retailers` is gated, so
        "Find Retailer" (header on every page, footer CTA band, one of three
        `LearnMoreLinks` tiles) renders the Coming Soon placeholder. Same for `/support`
        CTAs including "Start a Warranty Claim". Either repoint the CTAs or promote the
        routes. Full link inventory in §9.
        *Correction to CLAUDE.md: `LearnMoreLinks` does **not** ship on all eight MVP
        pages — it renders only on `/` among the MVP set (plus contact, register,
        become-a-retailer, warranty-claim, all gated). The `Navigation` primary CTA is
        what puts a dead "Find Retailer" on every page.*
  - [ ] **CA-40** [EXTERNAL] — `/support` claims at `:94/:102/:106/:110`.

- [ ] **The installation checkout is real, or is visibly a demo.** `/installation` step 5
      collects a full card number, expiry and CVC; step 6 says *"your payment of $250.00
      AUD has been received"* with a paid reference. But `next()` just fakes a 900 ms delay
      and generates the reference client-side, and the imported `submitForm` helper is
      **never called** — `app/installation/page.tsx:7` imports it, nothing invokes it. No
      payment provider, no endpoint, no record anywhere. Meanwhile
      `lib/data/installation-terms.ts` §5 makes payment-at-booking a contractual term.
      *FAIL [DECISION] — verified 2026-07-29. Highest-severity item on this list.*

- [ ] **Firmware sections restored on both product pages.** Deliberately commented out
      2026-07-27 because the download files were wrong; a dash-cam product page without
      firmware downloads is a support gap.
      `app/gx35/page.tsx:896` and `app/gx4k/page.tsx:870`
      *FAIL [EXTERNAL] — still commented out, verified 2026-07-29. The `downloadTabs`
      arrays and the `FirmwareDownloads` imports are intentionally still in place;
      restoring is just uncommenting. **Do not "clean up" those arrays.** Settle together
      with CA-13.*

- [ ] **Image-optimisation approach chosen** — `next/image` (metered transformation quota
      on Vercel) vs. a `sharp` prebuild (static files). Cost/architecture call, needs the
      billing owner. See CLAUDE.md open item 5 and §7 below.
      *TODO [DECISION].*

- [x] **`app/gx35/page_bak.tsx` deleted.** Stale backup holding pre-fix values.
      *PASS — file no longer exists, verified 2026-07-29. CLAUDE.md open item 4 can be
      closed.*

---

## 3. 🔒 Search-engine visibility

- [x] **The three noindex enforcement points agree.** `robots` metadata in
      `app/layout.tsx:31`, `X-Robots-Tag` in `next.config.ts` `headers()`, and
      `app/robots.ts` — all keyed off `SITE_INDEXABLE === "true"`, all fail-safe to
      noindex, and robots.txt correctly still **allows** crawling (a crawler must fetch a
      page to see its noindex).
      *PASS as a mechanism — verified 2026-07-29.*

- [ ] **`SITE_INDEXABLE` set deliberately on the production project.** Unset or anything
      but `"true"` = hidden.
      `curl -sI https://<domain>/ | grep -i x-robots`
      *TODO [DECISION] — the launch call itself.*

- [ ] **`app/sitemap.ts` exists** before flipping to indexable. `app/robots.ts` already
      advertises `https://finevuaustralia.com.au/sitemap.xml` when indexable, so turning
      indexing on today points crawlers at a 404.
      *FAIL — file does not exist, verified 2026-07-29.*

- [ ] **Per-page `<title>` and `description`.** Only `terms-of-service`, `warranty` and
      `fv-specialist` export `metadata`; **15 of 18 page files are `"use client"`**, which
      forbids a `metadata` export. So the homepage, GX4K, GX35, Installation, Support and
      About all ship the *identical* root title from `app/layout.tsx:29`. Fix pattern: add
      a server `layout.tsx` per route that exports `metadata`, leaving the client page
      untouched.
      `grep -rln "export const metadata" app`
      *FAIL — verified 2026-07-29.*

- [ ] **`metadataBase`, canonical URLs, `openGraph` and `twitter` metadata.** None exist
      anywhere, so every social/Slack/WhatsApp share of the site renders bare — no title
      card, no image.
      *FAIL — verified 2026-07-29.*

- [ ] **Structured data** — `Organization` on the site, `Product` on GX4K/GX35.
      *TODO — none present.*

- [x] **Legacy URL redirect works.** `/where-to-buy` → `/retailers`, permanent.
      *PASS in config (`next.config.ts` `redirects()`) — re-verify on the live domain.*

---

## 4. Accessibility

- [x] **`<html lang="en">`** set. *PASS — `app/layout.tsx:47`.*

- [ ] **Reduced-motion respected across the board.** The site is motion-heavy. Partially
      handled already: three `@media (prefers-reduced-motion: reduce)` blocks in
      `app/globals.css` (:190, :288, :409) and `useReducedMotion()` in `BrandedNotice`,
      `ScrollHero`, `OpticsSection`, `ScrollScrubVideo`.
      *TODO — partial coverage confirmed 2026-07-29; needs a sweep of the remaining
      animated components (TiltCard, MagneticButton, ParallaxImage, AnimatedCounter,
      Carousel).*

- [ ] **Every image has a meaningful `alt`.** 61 `alt=` sites across 13 files. Needs a
      read-through for *quality*, not a count — decorative images should be `alt=""`.
      *TODO.*

- [ ] **Keyboard traversal.** Tab through the installation wizard end-to-end, the nav
      (including mobile menu), carousels, and the FAQ accordions. Visible focus ring
      everywhere; no keyboard traps; no focus lost on step change.
      *TODO.*

- [ ] **Colour contrast ≥ 4.5:1** for body text, ≥ 3:1 for large text and UI borders.
      Check brand orange on white and on the dark sections, and both `data-nav-theme`
      states of the navbar.
      *TODO.*

- [ ] **Forms are accessible.** Every input has an associated `<label>`, errors are
      announced (`aria-live` / `aria-describedby`), required fields marked. Covers
      contact, register, warranty-claim, become-a-retailer, services, and the installation
      wizard.
      *TODO.*

- [ ] **Heading order is sane per page** — single `h1`, no skipped levels. Note
      `learn/[slug]/page.tsx` injects `id`s into `<h3>` to build its TOC.
      *TODO.*

- [ ] **Tap targets ≥ 44px** on mobile. Known open items from the 2026-07-14 audit: the
      retailers carousel dots (<24px hit area), the nav logo link, product/service tab
      buttons.
      *FAIL — carried forward from `docs/responsiveness-audit-2026-07-14.md`.*

---

## 5. Responsiveness

- [ ] **Walk the eight MVP pages at 375 / 768 / 1024 / 1440 / 1920.**
      `/`, `/gx4k`, `/gx35`, `/installation`, `/warranty`, `/terms-of-service`,
      `/support`, `/about`.
      *TODO — last full pass 2026-07-14, several commits ago.*

- [ ] **No horizontal overflow at 320px.** `body { overflow-x: hidden }` in `globals.css`
      is a global guard currently masking two real overflows — `/contact` and `/support`
      card overflow at 320px. Fix at the root so the guard is only a safety net.
      *FAIL — carried forward from the 2026-07-14 audit.*

- [ ] **Prior responsiveness findings closed.** Re-check every item in
      `docs/responsiveness-audit-2026-07-14.md` § "Prioritised action list" (1 medium,
      2 low; no critical or high).
      *TODO.*

- [ ] **`ScrollScrubVideo` behaves on mobile.** See
      `docs/scrollscrubvideo-work-2026-07-26.md` for the rollout state. Used on
      `app/gx4k/page.tsx:503` and `app/gx35/page.tsx:519`.
      *TODO — the work is committed (tree clean 2026-07-29), but not re-verified on a
      real device.*

---

## 6. Browser & device compatibility

- [ ] **Chrome, Edge, Firefox, Safari (macOS)** on the four core pages.
      *Chromium verified 2026-07-14; **Safari/WebKit and Firefox/Gecko were reviewed by
      code only** — the audit explicitly does not claim a pass for them.*

- [ ] **iOS Safari** on a real device — specifically `ScrollScrubVideo` (`playsInline`,
      muted-autoplay policy, seek performance) and the `backdrop-filter` glass in
      `Navigation`.
      *TODO.*

- [ ] **Android Chrome** on a real device.
      *TODO.*

- [ ] **WebP renders everywhere** it's used; no broken tiles from
      `ImageWithFallback`'s error placeholder.
      *TODO.*

---

## 7. Performance & assets

- [ ] **`public/` payload cut down.** Currently **486 MB** — verified 2026-07-29, well past
      the ~201 MB recorded in CLAUDE.md. The site ships full-size originals to every
      device, including a 16 MB `public/gx4k/detail-starvis.png`.
      `du -sh public`
      *FAIL — biggest performance risk on the site.*

- [ ] **Responsive images shipped** (`srcset` / width variants / modern formats), once the
      §2 approach decision is made. `ImageWithFallback` already spreads `...rest`, so
      `srcSet`/`sizes` pass straight through.
      *TODO — blocked on the [DECISION] above.*

- [ ] **`components/sections/Carousel.tsx` images optimised.** It renders a plain `<img>`,
      so every carousel image on `/gx4k`, `/gx35` and `/installation` ships unoptimised
      regardless of which approach is chosen.
      *FAIL — verified 2026-07-29.*

- [ ] **Lighthouse run on the four core pages**, scores recorded here. Target: Performance
      ≥ 80 mobile, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
      *TODO.*

- [ ] **Fonts don't block render** — `next/font` is in use (`inter`, `geistMono` in
      `layout.tsx`); confirm no layout shift on first paint.
      *TODO.*

---

## 8. Functional & infrastructure

- [ ] **`npm run build` clean.** There is no test suite — this is the gate.
      *TODO — re-run immediately before deploy.*

- [ ] **`npm run lint` clean.**
      *TODO.*

- [ ] **`git diff main staging -- config/` is empty.** CLAUDE.md requires
      `site.config.ts` and `site.config.staging.ts` to be byte-identical on both branches —
      the environment decides what's gated, not the branch.
      *FAIL — verified 2026-07-29: `staging` has `/warranty-claim` in `comingSoon`, `main`
      does not. Resolved by merging staging → main.*

- [ ] **`staging` merged to `main`.** Staging is 3 commits ahead: `442a1f9` (replaced gx4k
      hero), `c7f6cab` (warranty claim page + register layout), `28a9f74` (staging
      variable). `main` is not ahead at all.
      *FAIL — verified 2026-07-29.*

- [ ] **Error boundary exists.** Neither `app/error.tsx` nor `app/global-error.tsx` exists,
      so any runtime error shows the unstyled default Next.js error page. Only
      `app/not-found.tsx` is present.
      *FAIL — verified 2026-07-29.*

- [ ] **404 page reachable and on-brand.** `app/not-found.tsx`.
      *TODO — verify on the deploy.*

- [ ] **Contact form submitted end-to-end on production**, mail confirmed landing in the
      support inbox. Repeat for register, warranty-claim, become-a-retailer and services —
      all five post through `lib/submitForm.ts` to `app/api/contact`.
      *TODO.*

- [ ] **Gating is correct in production.** Every route in `comingSoon` renders the
      placeholder; all eight MVP routes render real content. Current production gate:
      `/become-a-retailer`, `/contact`, `/faq`, `/how-it-works`, `/learn`, `/retailers`,
      `/services`, `/register`, `/warranty-claim`.
      *TODO. Note `/fv-specialist` is ungated **on purpose** (QR landing page) — that is
      not a bug, don't "fix" it.*

- [ ] **Staging stays hidden.** `NEXT_PUBLIC_SITE_ENV=staging` set on the staging project
      only, and staging keeps `SITE_INDEXABLE` unset so it never competes in search.
      *TODO.*

- [ ] **Custom domain, DNS and SSL live**; www → apex (or vice versa) settled.
      *TODO.*

- [ ] **Analytics reporting.** `@vercel/analytics` is wired at `app/layout.tsx:53` —
      confirm events arrive.
      *TODO.*

---

## 9. Dead links & assets

Full sweep run 2026-07-29 (`/link-check`, scope `all`): **162 unique asset refs, 45 internal
links, 11 anchors, 6 external URLs** checked.

- [x] **Broken image on an MVP page — FIXED.** `app/gx35/page.tsx:228` referenced
      `/gx35/dual-vision-mobile.png`, which did not exist, so mobile visitors to `/gx35`
      got the `ImageWithFallback` error placeholder on the "Dual vision. Zero compromise."
      section. The correct artwork was supplied 2026-07-29 and both images in that section
      were converted to WebP and repointed to
      `/gx35/dual-vision.webp` + `/gx35/dual-vision-mobile.webp`.
      *PASS — verified 2026-07-29, `npx tsc --noEmit` clean. 3.5 MB → 100 KB.*

- [x] **All internal routes resolve.** Every `href="/…"` has a matching `page.tsx`. No
      `href="#"` or `href=""` placeholders outside the download list below.
      *PASS — verified 2026-07-29.*

- [x] **All 11 anchors resolve.** `#book`, `#how`, `#register`, `#where`, `#why`,
      `#apply`, `#pricing`, `#included` all have matching `id=` on their target page.
      *PASS — verified 2026-07-29.*

- [ ] **Gated destinations (the CA-38 class).** Routes that exist but render Coming Soon
      in production, and what links at them:
      - `/retailers` ← `Navigation` primaryCta "Find Retailer" (**every page**),
        `components/Hero.tsx:93`, `Footer.tsx:42`, `LearnMoreLinks.tsx:18`,
        `how-it-works:410`, `learn:203`, `articles.ts:177`
      - `/contact` ← `Footer.tsx:101`, `support:199` and `:392`, `faq:179`,
        `services:446`, `become-a-retailer:422`
      - `/register` ← `support:128` ("Register Now"), `support:193`
      - `/warranty-claim` ← `support:140` (**"Start a Warranty Claim"**)
      - `/services` ← `Footer.tsx:91`
      - `/how-it-works` ← `support:374` ("Get the App")
      - `/learn` ← `how-it-works:356`
      *FAIL [DECISION] — tracked as CA-38. Note `/support` alone has four CTAs into gated
      routes, including the warranty claim entry point.*

- [ ] **Gate leak: article pages aren't gated.** `ComingSoonGate` matches with
      `comingSoon.includes(path)` — an exact string compare. `/learn` is gated but
      `/learn/4k-vs-2k-dash-cam` and the other four slugs are **not**, so the blog is live
      via direct URL and via the homepage `app/page.tsx:307` cards while its index shows
      Coming Soon.
      *FAIL — verified 2026-07-29. Fix is either prefix matching in the gate or gating the
      five slugs; a product call either way.*

- [ ] **Dead firmware/manual downloads.** `app/support/page.tsx:153` renders
      `href={url ? url : "#"}` — every item currently has no URL, so the whole list is
      non-navigating "Coming Soon" text styled as links.
      *FAIL [EXTERNAL] — tracked as CA-13, same root cause as the hidden firmware sections.*

- [ ] **External URLs.** `jbhifi.com.au`, `motoronegroup.com/privacy-policy/`,
      `autoxtreme.com.au` and the live domain all return **200**. `repco.com.au` and
      `autobarn.com.au` return **403 to both HEAD and a ranged GET with a browser UA** —
      that is bot-blocking, not a dead link, but it is **unverified**, not confirmed live.
      *TODO — open the two Repco/Autobarn links in a real browser once. Note the three
      named retailers are themselves unsourced (CA-33).*

- [ ] **86 unreferenced files in `public/`.** Informational — many are legitimate
      (`*_orig.*` masters, `*_denoise.*` intermediates, art staged before wiring). **Two
      known false positives**: the three `common/icon-*.svg` files *are* used, imported as
      React components via SVGR in `LearnMoreLinks.tsx:3-5`, which a string-path grep can't
      see. Do not bulk-delete; this list feeds the §7 payload work, not a purge.
      *TODO — triage alongside the image-optimisation decision.*

- [x] **Commented-out ref is not shipped.** `/gx4k/detail-angle.webp` (missing on disk) is
      referenced only inside a commented-out block at `app/gx4k/page.tsx:672`.
      *N-A — no user impact, but it will 404 the moment that block is uncommented.*

---

## 10. Legal

- [ ] **Warranty and terms signed off.** Warranty periods, ACL wording, returns and
      support terms carry real commitments and ship on four MVP pages. Sources:
      `lib/data/warranty.ts`, `lib/data/installation-terms.ts`.
      *TODO — needs a human sign-off, not a code check.*

- [ ] **Privacy policy links point somewhere real.** Currently inconsistent:
      `components/Footer.tsx:113` links out to
      `https://motoronegroup.com/privacy-policy/`, but `app/contact/page.tsx:188` and
      `app/become-a-retailer/page.tsx:276` both link the words "privacy policy" to
      **`/support`**. There is no `/privacy` route. Forms collect names, emails, phone
      numbers and addresses, and `installation-terms.ts` references "our Privacy Policy"
      in four places.
      *FAIL — verified 2026-07-29. Either add a real privacy page or repoint all links to
      the Motor One policy.*

- [ ] **Payment terms match reality.** `installation-terms.ts` §5 makes payment-at-booking
      contractual while no payment is taken. Resolves with CA-36.
      *FAIL [DECISION].*
