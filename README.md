# FineVu Australia

Marketing site for the FineVu premium dash-cam range, run by the Australian
distributor **AutoXtreme**.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
`motion` (Framer Motion) · shadcn-style Radix UI · Resend.

There is no database and no auth. Nearly every page is static content plus
client-side animation. The only server-side piece is `app/api/contact/route.ts`,
which emails form submissions through Resend.

> **Working on this repo with Claude Code?** Read [`CLAUDE.md`](./CLAUDE.md)
> first — it carries the conventions, launch gates and open decisions that this
> README only summarises.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the keys you need (see below)
npm run dev                  # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `localhost:3000` |
| `npm run build` | Production build — **the only real verification step** (catches type + lint errors) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (flat config, `eslint-config-next`) |

**There is no test suite.** Verification = `npm run build` clean + driving the
page in a browser. The `docs/responsiveness-audit-*.md` files are manual QA
reports, not automated checks.

---

## Environment variables

Copy `.env.example` → `.env.local` locally, and set the same keys in Vercel
(Project → Settings → Environment Variables).

| Var | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | for the contact form | **Secret.** Never prefix `NEXT_PUBLIC_`; mark Sensitive in Vercel. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | for the install booking wizard | Address autocomplete. Restrict by HTTP referrer in Google Cloud. |
| `CONTACT_TO_EMAIL` | optional | Defaults to `support@finevuaustralia.com`. |
| `CONTACT_FROM_EMAIL` | optional | Must be on a Resend-verified domain (`onboarding@resend.dev` until then). |
| `SITE_INDEXABLE` | optional | `"true"` = indexable. Anything else (or unset) = **noindex**. Fail-safe by design. |

Without `RESEND_API_KEY` the site runs fine; the contact route just fails on
submit.

---

## Pages

The launch MVP is **eight routes** — these are the only ones that should ship
polished:

**Core four:** `/` · `/gx4k` · `/gx35` · `/installation`
**Supporting four:** `/warranty` · `/terms-of-service` · `/support` · `/about`

Everything else exists but sits behind the **Coming Soon gate**: any path listed
in `comingSoon` in `config/site.config.ts` renders the branded `ComingSoon`
placeholder instead of the page (`ComingSoonGate`, wired in `app/layout.tsx`).
Preview a gated page's real content with `?showpage=true`.

Currently gated: `/become-a-retailer`, `/contact`, `/faq`, `/how-it-works`,
`/learn`, `/retailers`, `/services`.

**`/fv-specialist` is ungated by design.** It's non-MVP but deliberately left
out of `comingSoon`, because it's the destination for a **scanned QR code** and
has to resolve publicly. Don't gate it, and don't treat it as a missing nav
entry — entry is by scan, not by navigation.

---

## Architecture

```
app/                     App Router pages + app/api/contact (Resend)
components/              Bespoke site sections & animations
components/ui/           Generated shadcn/Radix primitives — treat as vendored
components/sections/     Large page sections (incl. ScrollScrubVideo)
components/figma/        ImageWithFallback
config/site.config.ts    Single source of truth for nav, CTAs, hero copy,
                         contact details, disclaimers, the coming-soon list
lib/data/articles.ts     The entire "Learn" blog, as HTML strings
docs/                    Content-accuracy audits, responsiveness QA, source docs
public/                  ~550 MB of media (see "Known debt")
```

`config/site.config.ts` is typed (`SiteConfig`) and read by both
`app/layout.tsx` metadata and `Navigation`. **Edit content there rather than
hardcoding it in components.**

### Conventions that are easy to miss

1. **Every full-width `<section>` must set `data-nav-theme="dark" | "light"`.**
   `Navigation` uses an IntersectionObserver to read that attribute from the
   section under the header and swaps to white or dark text/glass. Miss it and
   the navbar renders with the wrong contrast.

2. **Use `ImageWithFallback`, not `next/image`.** It's a plain `<img>` with an
   SVG error placeholder. Many images are remote Unsplash URLs and
   `next.config.ts` doesn't configure `images.remotePatterns`, so `next/image`
   would reject them. It spreads `...rest`, so `srcSet`/`sizes` pass through.

3. **`disclaimers` order in `site.config.ts` is load-bearing.** The `sup="1|2|3"`
   footnote markers on product/homepage tiles reference entries *by position*
   (1 = Warranty, 2 = SD Cards, 3 = Hardwire Kit). Reordering breaks them
   silently — no build or type error. Append only.

4. **`"use client"`** is required on anything using `motion`, hooks, or
   `usePathname`/`useParams` — which is most components here.

5. **Videos fed to `ScrollScrubVideo` must be re-encoded with a keyframe on
   every frame** (`-g 1 -keyint_min 1 -sc_threshold 0`), or scroll scrubbing
   stutters. Full recipe in `CLAUDE.md`.

### Styling

Tailwind v4, CSS-first — `@import "tailwindcss"` in `app/globals.css`, no
`tailwind.config.js`. Brand tokens are CSS variables: `var(--brand-primary)`
(FineVu orange, the only accent) and `var(--brand-gradient)` (the 65°
purple→blue hero gradient).

Legacy aliases are **intentional**: `--electric-green` is remapped to brand
orange, so old `text-[var(--electric-green)]` refs still render on-brand. Don't
"fix" them to a real green.

Path alias: `@/*` → repo root.

---

## Before you deploy

Launch is a gate, not a formality — this is a public site with a live email
backend. The full checklist is in [`CLAUDE.md`](./CLAUDE.md); the three hard
gates:

1. **Security** — no secrets committed (`grep -rn "re_" app`), rate limiting or
   CAPTCHA on `app/api/contact` (a honeypot is the only protection today),
   Resend sender domain verified, `npm audit` clean.
2. **Content accuracy** — every spec verified against the sources in
   `docs/content-sources/`. Don't launch with open items in
   `docs/content-accuracy-changes.csv`. **The four supporting MVP pages have not
   been audited yet.**
3. **Search visibility** — `SITE_INDEXABLE` decided deliberately. It's enforced
   in three places that must stay in sync: `robots` metadata in
   `app/layout.tsx`, the `X-Robots-Tag` header in `next.config.ts`, and
   `app/robots.ts`. Do **not** add `Disallow: /` while noindex is active — a
   crawler has to fetch the page to see the `noindex`. There is no
   `app/sitemap.ts` yet; add one before going indexable.

Verify after deploying:

```bash
npm run build
curl -sI https://<domain>/ | grep -i x-robots
```

Then walk the MVP pages in a browser and submit the contact form once to
confirm mail lands in the support inbox.

### Content audits

Narrative findings live in `docs/content-accuracy-audit-<date>.md`; the flat
diff view lives in the single canonical `docs/content-accuracy-changes.csv`.
That CSV is a **living tracker** — one row per issue keyed by a stable ID,
`Old value` frozen, `Status` one of `Applied` / `Pending` / `Needs approval`.
Update it in the same pass as any audit. Schema and rules: `CLAUDE.md`.

---

## Known debt

- **Media payload.** `public/` is ~550 MB, shipped full-size to every device.
  No responsive `srcset` pipeline exists yet — the plan (sharp prebuild script
  generating webp/avif width variants + a `ResponsiveImage` wrapper) is written
  up in `CLAUDE.md`. Compressing the largest PNGs is the single biggest win.
- **`app/gx35/page_bak.tsx`** is a stale backup holding pre-fix spec values.
  Not routed, so it doesn't ship — but it's a trap for anyone grepping. Should
  be deleted.
- **Open content decisions** (hardwire kit in "What's in the Box", several
  unverified specs) are tracked at the top of `CLAUDE.md` and need ops sign-off,
  not code.
