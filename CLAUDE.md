# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FineVu is a marketing/brochure site for a premium dash-cam brand (Australian distributor: AutoXtreme). It is a Next.js 16 App Router app (React 19, Tailwind CSS v4, `motion`/Framer Motion, shadcn-style Radix UI). No backend, database, or auth — every page is static content plus client-side animation. Forms (e.g. `BusinessEnquiryForm`) are presentation-only.

## MVP scope

The launch MVP is **four pages**. These are the only routes that should ship complete, polished content:

- **Homepage** — `app/page.tsx` (`/`)
- **GX4K** — `app/gx4k/page.tsx` (`/gx4k`)
- **GX35** — `app/gx35/page.tsx` (`/gx35`)
- **Installation** — `app/installation/page.tsx` (`/installation`)

Every other route exists but is not part of the MVP. Non-MVP pages can be hidden behind the **Coming Soon gate**: add their path to `comingSoon: string[]` in `config/site.config.ts` and `ComingSoonGate` (wired in `app/layout.tsx`) renders the branded `ComingSoon` placeholder instead of the page. Preview a gated page's real content with `?showpage=true`. Prioritise the four MVP pages; treat the rest as secondary until they're promoted out of the coming-soon list.

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
