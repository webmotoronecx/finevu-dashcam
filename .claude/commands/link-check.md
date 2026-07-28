---
description: Sweep every link and asset reference for dead targets — missing routes, gated pages, 404 assets, placeholder hrefs, dead anchors, unreachable external URLs
argument-hint: "[all|mvp|<page path>] [--no-external] — e.g. 'mvp', '/gx35', 'all --no-external'"
allowed-tools: Bash, Read, Grep, Glob
---

# /link-check

Find every reference that goes nowhere. `/content-audit` verifies *claims* against sources of
truth and does **not** look at links — this is the other half of hard gate #2 in CLAUDE.md.

**Scope (`$ARGUMENTS`)** — `mvp` (default) = the eight MVP routes: `/`, `/gx4k`, `/gx35`,
`/installation`, `/warranty`, `/terms-of-service`, `/support`, `/about`. `all` = every file under
`app/`, `components/`, `config/`, `lib/`. A single path audits that page plus the shared
components it renders. `--no-external` skips network checks (offline, or you just want the fast pass).

**Why this can't be skipped as "the build would catch it":** `npm run build` and `tsc` see these
paths as **string literals**. A renamed image, a pruned PNG, or a route that never existed all
typecheck perfectly and 404 in the browser. Nothing else in this repo checks them.

## Step 1 — Collect every reference

Assets are referenced through several prop names here, not just `src` — `ImageWithFallback`,
`Carousel`, `MediaSection`, `ScrollScrubVideo`, `FeatureTabs` and `BentoCard` each have their own.
Miss one and the sweep silently under-reports:

```bash
# Asset paths (leading slash = public/), across every prop name in use
grep -rnoE '"(/[A-Za-z0-9_./-]+\.(png|jpg|jpeg|webp|avif|svg|mp4|webm|pdf|zip))"' \
  app components config lib | sort -u

# Internal links
grep -rnoE 'href="(/[A-Za-z0-9_./#-]*)"' app components config lib | sort -u

# External URLs
grep -rnoE 'href="https?://[^"]+"' app components config lib | sort -u

# Placeholders and empties — always findings
grep -rnE 'href="#"|href=""|href="#"' app components config lib
```

Also grep the props that take a path but aren't `href`/`src`: `image:`, `img:`, `video:`,
`mobileVideo:`, `poster=`, `imageSrcSet`, `icon:`, `file:`, `downloadUrl`. And note any
**dynamic** `href={...}` / `src={...}` — a template literal can't be resolved statically, so list
these separately as "needs manual check" rather than passing them silently.

## Step 2 — Resolve internal routes

A path `/foo` is live only if `app/foo/page.tsx` exists. Build the route list once and diff:

```bash
find app -name 'page.tsx' | sed -E 's#^app##; s#/page\.tsx$##; s#^$#/#' | sort
```

Dynamic segments (`app/learn/[slug]/page.tsx`) match any single segment — for `learn/*` verify the
slug exists in `lib/data/articles.ts` rather than assuming the route covers it.

## Step 3 — Check the Coming Soon gate (this repo's most common dead end)

A route can exist and still render the placeholder. Cross-reference every internal link against
`comingSoon` in `config/site.config.ts`:

```bash
grep -A25 'comingSoon' config/site.config.ts
```

Report these as **gated**, distinct from **missing** — the fix is a product decision (repoint the
CTA vs. promote the route), not a typo. This is the CA-38 class of finding; check whether an
existing row in `docs/content-accuracy-changes.csv` already covers it before reporting it as new.

Exception: `/fv-specialist` is deliberately ungated despite being non-MVP. Never flag it.

## Step 4 — Check assets exist on disk

Every collected asset path maps to `public/<path>`. Report each miss with the referencing
file:line:

```bash
# for each collected PATH:  test -f "public/$PATH" || echo "MISSING: $PATH"
```

Then the reverse, as a second list: files in `public/` that nothing references. Do **not** call
these deletable — many are legitimately unreferenced (`*_orig.*` masters, borrowed cross-page
assets, art staged before wiring). Report as "unreferenced", let the user judge.

## Step 5 — Check anchors

For every `href="#id"` or `href="/page#id"`, confirm an element with that `id` exists on the
target page. `learn/[slug]` generates its ToC ids by injecting them into `<h3>` tags at render
time — verify against the article HTML in `lib/data/articles.ts`, not against the JSX.

## Step 6 — Check external URLs (skip with `--no-external`)

```bash
curl -sSI -L --max-time 12 -o /dev/null -w '%{http_code} %{url_effective}\n' "$URL"
```

Report the status per URL. Two rules so the result is honest:

- **A `403`/`405` is not proof of a dead link** — plenty of sites block HEAD or non-browser UAs.
  Retry once with `-r 0-0` (ranged GET) before reporting; if it still fails, mark it
  **"unverified"**, not "broken".
- **Never follow a link that performs an action** (logout, unsubscribe, anything with a token).
  Report the URL and move on.

## Step 7 — Report

Group by severity, most severe first, each with `file:line` and the exact string:

1. **Broken asset** — referenced, not in `public/`. Ships a 404 / blank media.
2. **Missing route** — internal link with no `page.tsx`. Ships a 404.
3. **Placeholder** — `href="#"` / `href=""`. Looks live, does nothing.
4. **Gated** — route exists but is in `comingSoon`. The CA-38 class.
5. **Dead anchor** — `#id` with no matching element.
6. **External failure** — non-2xx/3xx after the retry, or "unverified".
7. **Needs manual check** — dynamic `href={}` / `src={}` that can't be resolved statically.
8. **Unreferenced in `public/`** — informational only.

Finish with counts per category and the total refs checked, so coverage is unambiguous. State
plainly if `--no-external` was used, or if any category was skipped.

**Do not fix anything unless asked.** A broken asset path is usually a one-word typo, but a gated
CTA is a product call — see CLAUDE.md open item 2. Offer the fixes, let the user choose.

**When findings are launch commitments** (a dead "Start a Warranty Claim", dead firmware
downloads), they belong in `docs/content-accuracy-changes.csv` as well — upsert per the rules in
CLAUDE.md §2, don't blind-append.
