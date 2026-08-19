# FB-04 / FB-05 — Persist registrations & warranty claims to R2 + GHL

**Status:** Design — 2026-08-18. Awaiting R2 provisioning + review, then implementation.

This supersedes the stale opening premise of the FB-05 ticket ("support receives no
images at all"). That was fixed by **FA-02** on 2026-08-15 — evidence files are genuinely
attached to the claim email now. FB-05, and its twin **FB-04**, is now about
**persistence**: durable file storage plus a customer record support can look up.

## Problem

`/register` and `/warranty-claim` submissions exist **only as a support email** (FA-02
attaches the files). There is no durable storage, no claim id, and no record support can
look up — so a warranty claim cannot be tied back to the customer's registration.
`lib/r2.ts` can only *download* (firmware); neither form writes to R2 or GHL.

## Goals

- Store every registration receipt and warranty-evidence file durably in a **private R2
  bucket**, organised so support can browse one claim's files in a single folder.
- **Upsert each submission as a GHL contact.** A registration and a later claim from the
  same email land on the **same** contact — which is how support links a claim to its
  registration. (`upsertContact()` already works this way; see its docstring.)
- Support customers uploading **many** evidence files, bypassing the email/Vercel size cap.
- Leave the **FA-02 email working** — it becomes one artefact of several, not the only one.

## Non-goals

- No change to the file-picker UX, nor to the email formatting beyond an overflow note.
- **No public download route for evidence** (personal data) — see Security.
- No admin UI / authenticated download portal (noted as a follow-up).

## Decisions (locked 2026-08-18)

1. **Build FB-04 + FB-05 together** — they share the same two new pieces (an R2 *upload*
   path + GHL wiring), and FB-05's "link to registration" needs FB-04 to exist.
2. **Direct browser → R2 via presigned PUT** (bypasses Vercel's ~4.5 MB request-body cap),
   not a server-side upload that would inherit that cap.
3. **FA-02 email kept.** When a claim has more files than the email can carry, the email
   attaches what fits (its existing 4-file / 3 MB cap) and notes the rest ("plus N more
   files stored with the claim"). **All** files always go to R2 + GHL.
4. **One private uploads bucket** for both `claims/` and `registrations/`, separate from
   the read-only firmware bucket, with its own **read + write** token.
5. **Evidence retrieval for support:** via the GHL note (holds the keys/links) + the
   Cloudflare dashboard for now. An authenticated re-mint route is a follow-up.
6. **One `/api/persist` endpoint**, branching by form type.

## Infrastructure (Cloudflare — operator setup)

1. **Create a private bucket** — suggested name `finevu-uploads`. Do **not** enable the
   `r2.dev` public URL.
2. **Create an R2 API token** — **Object Read & Write**, applied to **only** that bucket
   (not account-wide). Yields `R2_UPLOADS_ACCESS_KEY_ID` + `R2_UPLOADS_SECRET_ACCESS_KEY`
   (secret shown once). `R2_ACCOUNT_ID` is the same as the firmware bucket. **Leave the
   firmware token Read-only.**
3. **CORS policy** on the bucket (so the browser can PUT directly):
   ```json
   [
     {
       "AllowedOrigins": [
         "https://finevuaustralia.com.au",
         "https://finevu-dashcam-staging.vercel.app",
         "http://localhost:3000"
       ],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
4. **Lifecycle rule** — prefix `pending/`, **delete after 1 day**. This is the orphan-purge
   for files uploaded from forms that were then abandoned.

## Storage layout

Keys are shaped so the Cloudflare dashboard (which renders `/` as folders) groups a whole
submission in one browsable folder, sorted by month:

```
claims/2026-08/2026-08-18_john-smith_a1b2c3/
    01_receipt.pdf
    02_front-damage.jpg
    03_side-damage.jpg
registrations/2026-08/2026-08-18_jane-doe_d4e5f6/
    receipt.pdf
```

- `claims/` vs `registrations/` → `YYYY-MM` → one folder per submission
  (`date_customer-slug_shortid`) → original filenames, numbered to preserve order.
- The `shortid` (from `crypto.randomUUID()`) keeps the path unguessable; the GHL note links
  straight to the folder, so a claim is trackable from R2 (browse by month) **or** GHL.
- **Upload staging:** files first land at `pending/<uploadId>/…`; on submit the server
  **copies** them to the permanent path above. Abandoned uploads never get copied and are
  swept by the lifecycle rule. (R2 lifecycle is age-based, so a dedicated `pending/` prefix
  is the clean way to purge only orphans without touching real claims.)

## Caps

- **R2 path:** up to **20 files, 25 MB each** (tunable) — this is what "a lot of files"
  needs.
- **Email (unchanged FA-02):** attaches up to 4 evidence files / 3 MB each; overflow noted.
- **Allowed types:** jpg, jpeg, png, webp, heic, heif, pdf — same as FA-02. Video is a
  possible follow-up now that R2 (not email) holds the bytes.

## Data flow

1. Customer fills the form and selects files.
2. Client `POST /api/uploads/sign` `{ form, files: [{ name, type, size }] }` → server
   validates form type, count, and each file's type/size → returns
   `{ uploadId, puts: [{ key, url }] }` (presigned PUT URLs under `pending/<uploadId>/…`).
3. Client PUTs each file straight to its R2 URL. (No Vercel cap on this path.)
4. Client `POST /api/persist` `{ form, fields, uploadId, files }` — **small payload, no
   base64**, so it never hits the body cap. Server validates, copies pending → permanent,
   `upsertContact()`, `addContactNote(fields + R2 keys/links)`, `addContactTags([...])`.
5. Client `POST /api/contact` for the FA-02 email exactly as today (attaches the subset,
   notes any overflow). **Independent of step 4** — a big claim can fail the email and
   still be captured in R2 + GHL.
6. Success is shown when the durable record (step 4) succeeds; the email is best-effort.

## Components

| File | Change |
|---|---|
| `lib/r2.ts` | + uploads-bucket client, `presignUpload()`, `copyObject()`, `r2UploadsConfigured()`. Firmware download path untouched. |
| `app/api/uploads/sign/route.ts` | **New.** Validates + mints presigned PUT URLs. Behind Turnstile + the rate limiter (new abuse surface). |
| `lib/ghl.ts` | + `addContactNote()`, `addContactTags()` (GHL v2, via existing `ghlFetch`); `upsertContact` gains a `source`. |
| `app/api/persist/route.ts` | **New.** Copy pending → permanent, upsert contact, write note + tags. Best-effort, logged. |
| `app/warranty-claim/page.tsx`, `app/register/page.tsx` | On submit: sign → PUT to R2 → persist → email. |
| `.env.example` | Document `R2_UPLOADS_*`. |

## Security

- Bucket **private**; **no public download route**. Evidence (receipts, damage photos) is
  personal data — unlike firmware, which is public-ish.
- Presigned PUT URLs: short TTL, content-type/length constrained.
- `sign` + `persist` routes: **Turnstile + rate limit**, and **server-side** type/size
  validation — never trust the client's declared sizes.
- Uploads token: read + write, scoped to the one bucket; never `NEXT_PUBLIC_`.
- Object ids unguessable (`crypto.randomUUID()`).

## Environment variables

`R2_ACCOUNT_ID` (existing), `R2_UPLOADS_BUCKET`, `R2_UPLOADS_ACCESS_KEY_ID`,
`R2_UPLOADS_SECRET_ACCESS_KEY` — set in **both** Vercel projects (Sensitive).

**Fail-safe:** when the `R2_UPLOADS_*` vars are unset, `/api/uploads/sign` returns 503 and
the client **falls back to email-only** (today's behaviour). So this ships safely before R2
is provisioned and degrades gracefully if a deploy is missing the creds — the same pattern
as Turnstile and the firmware flag.

## Verification

- `npm run build` clean (no test suite — verification is build + manual).
- Manual on staging once R2 is wired:
  - Claim with 2 photos → files under `claims/2026-08/…/`, a GHL contact with the note +
    tag appears, the FA-02 email still sends.
  - Claim with 15 photos → all 15 in R2, email attaches 4 and notes "11 more".
  - Abandon the form after uploading → the `pending/` objects are gone within a day.

## Open items / follow-ups

- **Authenticated evidence-download route** for support (deferred; this project has no admin
  auth yet). Until then, retrieval is via the GHL note + Cloudflare dashboard.
- Optionally **accept video** now that R2 can hold large files.
- **FB-08** still governs where the FA-02 email lands (client mailbox / MX not ready).

## Rollout

Env-gated: no R2 creds ⇒ email-only (today's behaviour). Wire **staging** first, verify the
three manual cases above, then production.
