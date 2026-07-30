# Thank-you page — the six forms

Last updated 2026-07-30.

Every form that posts to `/api/contact` redirects to `/thank-you/<slug>` on a successful
submit. Copy lives in `lib/data/thank-you.ts`; the card is `components/ThankYou.tsx`;
the routes are `app/thank-you/page.tsx` (generic) and `app/thank-you/[type]/page.tsx`.

## The six

| # | Form page | Slug | Thank-you URL | Email subject | In `comingSoon`? |
|---|-----------|------|---------------|---------------|------------------|
| 1 | `/contact` | `contact` | `/thank-you/contact` | `FineVu enquiry — …` | ✅ gated |
| 2 | `/register` | `register` | `/thank-you/register` | `FineVu product registration — …` | ✅ gated |
| 3 | `/warranty-claim` | `warranty-claim` | `/thank-you/warranty-claim` | `FineVu warranty claim — …` | ✅ gated |
| 4 | `/become-a-retailer` | `become-a-retailer` | `/thank-you/become-a-retailer` | `FineVu retailer application — …` | ✅ gated |
| 5 | `/services` | `services` | `/thank-you/services` | `FineVu installation booking request` | ✅ gated |
| 6 | `/installation` | `installation` | `/thank-you/installation` | **none — sends nothing** | ❌ live (MVP) |

**#6 is not like the others.** The `/installation` wizard sends no email at all: `submitForm`
is imported (`app/installation/page.tsx:7`) and never called, and `next()` fakes a 900 ms
delay then generates a client-side reference. Only the *destination* was rewired — the
wizard's logic is untouched pending ops sign-off on CA-36. It is also the only one of the
six that is **live in production**, since `/installation` is an MVP page.

Plus `/thank-you` itself — the generic fallback, so the bare URL is never a dead end.
It is **not** gated, and shouldn't be: gating it would send every successful submit to
the Coming Soon placeholder the moment the forms go live.

## Call sites

Each form pushes twice — once on the honeypot path (bots get the same page, so they
can't detect the difference) and once on `res.ok`.

| Form | Honeypot | Success |
|------|----------|---------|
| `/contact` | `app/contact/page.tsx:78` | `app/contact/page.tsx:92` |
| `/register` | `app/register/page.tsx:98` | `app/register/page.tsx:138` |
| `/warranty-claim` | `app/warranty-claim/page.tsx:179` | `app/warranty-claim/page.tsx:227` |
| `/become-a-retailer` | `app/become-a-retailer/page.tsx:169` | `app/become-a-retailer/page.tsx:199` |
| `/services` | `app/services/page.tsx:99` | `app/services/page.tsx:120` |
| `/installation` | n/a | `app/installation/page.tsx:177` (inside `next()`) |

The error path never navigates — a failed submit stays on the form so nothing typed is
lost.

## Overriding the heading and paragraph

`thankYouUrl()` from `lib/data/thank-you.ts`:

```tsx
router.push(thankYouUrl("register"));                                   // variant defaults
router.push(thankYouUrl("register", { title: "You're registered" }));   // title only
router.push(thankYouUrl("register", {
  title: "You're registered",
  desc: "We've saved your details against your FineVu dash cam.",
}));
```

Omitted, empty or whitespace-only values fall back to the variant, so either field can be
overridden alone. Raw `?title=` / `?desc=` works the same; the helper just encodes for you.

Only those two fields are overridable — the "what happens next" bullets, buttons and
footnote always come from the variant, so a URL can't rewrite the whole page. Input is
capped (80 chars title, 300 desc), control characters stripped, whitespace collapsed.

## Notes

- **Routes are dynamic (`ƒ`), not prerendered.** Reading `searchParams` forces
  per-request rendering. `generateStaticParams` still validates slugs — unknown ones 404.
- **`robots: { index: false }` is pinned on** regardless of `SITE_INDEXABLE`. A thank-you
  page must never be indexed.
- **`/installation` step 6 is now unreachable but intentionally kept**, not deleted, so
  ops can restore the original confirmation. Do not "clean up" that block or the
  now-unused `submitForm` import — both are the restore path. `ref` is still generated
  and no longer displayed anywhere.
  - Side effect, and an improvement: the old step 6 claimed *"your payment of $250.00 AUD
    has been received"* and *"your tax receipt is on its way"*. Redirecting away means
    that claim no longer ships. The wizard still collects a full card number at step 5
    and does nothing with it — unchanged, and still CA-36.
- **Forms 1–5 are gated**, so those redirects don't fire in production today; staging
  ungates everything. Form 6 (`/installation`) **is live**.
- **⚠️ Copy claims an email that isn't sent.** `app/api/contact/route.ts` sends one email,
  to the support inbox — the submitter receives nothing, so "sent a confirmation to your
  email", "reply to the confirmation email" and "check your spam" are inaccurate. Kept at
  the user's direction pending a decision: add a submitter auto-reply, or reword. Must be
  settled before launch (content accuracy is a hard gate).

Design rationale: `docs/superpowers/specs/2026-07-30-thank-you-page-design.md`.
