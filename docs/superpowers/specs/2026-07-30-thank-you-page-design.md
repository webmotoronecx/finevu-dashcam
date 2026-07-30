# Dynamic thank-you page — design

**Date:** 2026-07-30
**Status:** Designed, approved, **not implemented**. No code written.

## Problem

Five forms (`/contact`, `/register`, `/warranty-claim`, `/become-a-retailer`,
`/services`) each hand-roll their own post-submit success state: on `res.ok` they flip a
local `status` to `"done"` and swap the form node for a check-circle card. Five
near-identical cards, five copies of the copy, and **no URL** — so there is nothing for a
conversion goal to fire on.

The user wants a thank-you destination that adapts to which form the visitor came from.

## Why a page, not a component

Asked what was driving it, the user named four reasons: conversion tracking, richer
post-submit content, shareable/bookmarkable, and consistency across forms.

**Conversion tracking and shareability settle it.** A component cannot produce a URL, and
a URL is exactly what GA4 / Google Ads / Meta need to record a conversion against. So:
a real route, with a shared presentational component underneath it.

## Chosen shape — `/thank-you/[type]`

Static route segments, not a query param.

```
lib/data/thank-you.ts          ← single source of truth for the copy
app/thank-you/page.tsx         → /thank-you            (generic fallback)
app/thank-you/[type]/page.tsx  → /thank-you/contact, /thank-you/register, …
components/ThankYou.tsx        ← "use client", presentational only
```

Rejected alternatives:

- **`/thank-you?form=contact`** — needs `useSearchParams` (client component + Suspense
  boundary), and analytics goals match on *contains* rather than an exact path. Query
  params also get stripped or rewritten by some link shorteners and email clients.
- **A thank-you page per form** (`/contact/thank-you`, …) — five near-identical files,
  no shared source of truth for the copy, and nothing gained over `[type]`.

## Components

### `lib/data/thank-you.ts`

Owns all post-submit copy, the way `config/site.config.ts` owns the rest of the site's
content. Nothing user-facing is hardcoded in the components.

```ts
export type ThankYouVariant = {
  eyebrow: string;
  title: string;
  body: string;
  next: string[];                    // "what happens now" bullets
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export const thankYouVariants: Record<string, ThankYouVariant> = {
  contact, register, "warranty-claim", "become-a-retailer", services
};

export const genericThankYou: ThankYouVariant;
```

### `app/thank-you/[type]/page.tsx`

Server component.

- `generateStaticParams()` over `Object.keys(thankYouVariants)` — all five prerendered at
  build time, no client JS for routing, no Suspense boundary.
- `generateMetadata()` per variant.
- **`robots: { index: false }` is pinned on regardless of `SITE_INDEXABLE`.** Thank-you
  pages must never be indexed even after the site flips to indexable — an indexed
  thank-you page pollutes search results and lets cold organic traffic land on a
  conversion URL. This is the one place that deliberately does *not* follow the global
  visibility flag.
- Unknown slug → `notFound()`.

### `app/thank-you/page.tsx`

Renders `genericThankYou`, so the bare `/thank-you` URL is never a dead end.

### `components/ThankYou.tsx`

`"use client"` (uses `motion`). Purely presentational — takes a `ThankYouVariant` and
renders it. No data fetching, no branching on route.

**`data-nav-theme` on every full-width `<section>`.** Project convention (CLAUDE.md): the
navbar reads it via IntersectionObserver to pick white vs. dark text. Omit it and the
navbar renders wrong-contrast over the new page.

## Data flow

```
form submit → submitForm() → res.ok → router.push("/thank-you/<slug>")
                           → !res.ok → inline error, stay on page
```

The `status === "done"` card is removed from all five forms. **The error path is
unchanged** — a failed submit never navigates away, or the user loses everything they
typed.

## Decisions taken

**Stateless — the page echoes nothing back.** No "confirmation sent to you@example.com".
Passing the email through the URL puts PII into analytics logs and server access logs;
passing it through `sessionStorage` adds a client boundary to an otherwise fully static
page. Generic per-form copy only.

**All five forms migrate**, not just contact and register. Consistency was one of the
four stated reasons for the work; leaving three forms on inline cards preserves the
problem being solved.

**`/installation` is deliberately excluded.** Its wizard has its own step-6 confirmation,
and that step is the open item where the checkout **charges nothing and submits nothing**
(CA-36) while telling the customer their payment was received. Routing it through a
shared thank-you page would dress a fake payment confirmation up as a real one. It stays
as-is until CA-36 is resolved.

## Deferred — documented, not built

**Conversion-event gating.** The original design proposed firing the conversion only when
a "just submitted" flag is present in `sessionStorage`, so that cold direct hits on
`/thank-you/register` don't inflate the count. This was walked back: the site's only
analytics is **`@vercel/analytics`**, whose pageview fires automatically on route change
and **cannot be conditionally suppressed**. There is no custom conversion event to gate,
so the flag would be dead code today.

Build it when gtag / GA4 / Meta Pixel is added. At that point the pattern is: content
always renders (preserving shareability), conversion event fires only behind the flag
(preserving accuracy).

**Analytics prerequisite.** Vercel Analytics will count `/thank-you/register` as a
distinct path for free, which is enough for basic funnel counting. A real Ads or GA4
conversion goal needs gtag added separately — a prerequisite for the "conversion
tracking" reason, not a blocker for building the page.

## ⚠️ Open item for the user — all five source forms are gated

Every route this feature redirects *from* is currently in `comingSoon`
(`config/site.config.ts:157`):

```
/become-a-retailer   /contact   /faq   /how-it-works
/learn   /retailers   /services   /register   /warranty-claim
```

So in production none of these five forms is reachable, and none of the redirects can
fire. **This work is groundwork, not a live-path change**, until those routes are
promoted out of the gate. Staging ungates everything, so it is fully testable there.

Two consequences to settle before implementing:

1. **Does `/thank-you` itself go in `comingSoon`?** It must **not** be gated at the moment
   its source forms go live, or every successful submit lands on the Coming Soon
   placeholder. Simplest safe answer: leave it ungated from the start — an unlinked,
   noindexed thank-you page is harmless on its own.
2. **Is this the right time?** If the forms are gated because the launch scope doesn't
   include them, this may be worth sequencing behind the MVP work.

Related open item: `/support`'s "Start a Warranty Claim" CTA points at `/contact`, which
is gated — part of the broader dead-CTA problem (CA-38).

## Work items

1. `lib/data/thank-you.ts` — types, five variants, generic fallback.
2. `components/ThankYou.tsx` — presentational, `data-nav-theme` per section.
3. `app/thank-you/page.tsx` — generic.
4. `app/thank-you/[type]/page.tsx` — `generateStaticParams`, `generateMetadata` with
   `robots.index: false`, `notFound()` on unknown slug.
5. Five form call-sites — `router.push` on `res.ok`, delete the `status === "done"`
   block, leave the error path alone.
6. Verify with `npm run build` (no test suite) and walk each form in staging.
