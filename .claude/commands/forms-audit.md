---
description: Audit every form surface for missing fields, wiring, states, a11y and security; update the narrative doc + change-log CSV
argument-hint: "[full|semi] [route/form or 'all'] — e.g. 'full', 'semi /installation', default: full all"
---

# /forms-audit

Audit every user-input surface on the FineVu site for **what is missing** — unwired
submits, dropped data, absent validation/error states, accessibility gaps and backend
holes — then update BOTH deliverables.

**Arguments:** `$ARGUMENTS` may contain a **mode** (`full` or `semi`) and/or a **scope**
(a route like `/installation`, a form name like `warranty-claim`, or `all`), in any order.
Missing pieces take defaults: **mode `full`, scope `all`**.

**Mode — a hard contract, not a suggestion:**

- **`full`** (default): **Read every in-scope form file top to bottom** and disposition
  every item on the checklist below for each surface. End with a **Coverage report**.
- **`semi`**: Incremental. Re-verify that all currently-open findings (`Pending` /
  `Needs approval`) still reproduce at their cited `file:line`, then audit only what `git`
  shows changed since the last pass, plus the explicit scope. You MUST state up front that
  it is a partial pass and **list what was NOT re-read**. Never report a `semi` pass as
  full.

If unsure which mode the user meant, ask.

## ⚠️ Method — grep cannot do this audit

**The findings are in what *isn't* there.** A missing `aria-invalid`, a handler that never
calls the API, an error state that has no code path — none of these can be grepped for,
because there is no string to match. **Read each in-scope file top to bottom.** Grep is
only for confirming a negative you already suspect (e.g. "is this component imported
anywhere?") or for sweeping the inventory.

This command **reports; it does not fix.** Do not apply code changes unless the user asks.

## Scope — the surfaces (`all` = every row)

Re-derive this list each run; do not trust it as fixed. Sweep for `<form`, `onSubmit`,
`useState` form objects, and `input`/`textarea`/`select` across `app/` and `components/`.

| Surface | Defined at |
|---|---|
| Contact form | `app/contact/page.tsx` |
| Product registration | `app/register/page.tsx` |
| Warranty claim | `app/warranty-claim/page.tsx` |
| Retailer application | `app/become-a-retailer/page.tsx` |
| Booking wizard (5 steps) | `app/installation/page.tsx` |
| Postcode / service-area check | `app/installation/page.tsx` |
| Address autocomplete | `components/AddressAutocomplete.tsx` |
| Store-finder filters | `app/retailers/page.tsx` |
| Business enquiry (dead) | `components/BusinessEnquiryForm.tsx` |
| `LandingPageLayout` `form` prop (dead) | `components/LandingPageLayout.tsx` |

Shared plumbing — **always in scope, at every mode**: `lib/submitForm.ts`,
`app/api/contact/route.ts`, `lib/data/thank-you.ts`, and `.env.example`.

**Three scope rules that are easy to get wrong:**

- **Gated ≠ out of scope.** Four forms sit in `comingSoon` (`config/site.config.ts`), but
  they ship on staging and ungate at launch. Audit them fully. Record the gate state —
  it drives urgency, not inclusion.
- **Dead components stay in scope.** `BusinessEnquiryForm` and `LandingPageLayout` are
  imported by nothing, but they read as production-ready. That is the finding.
- **`components/ui/*` is not a form.** Those are vendored shadcn primitives (`form`,
  `input`, `label`, `select`) used by **none** of the real forms. Don't audit them — but
  do note that every form is hand-rolled, which is why nothing comes for free.

## Per-surface checklist (disposition every line in `full` mode)

1. **Fields** — exact list; required vs optional; is required-ness *marked in the UI*?
2. **Submit wiring** — is there a handler? Does it actually call `submitForm`/an API, or
   fake it with `setTimeout`? Is `submitForm` imported but never called?
3. **Payload fidelity** — does everything the user entered actually reach the server?
   Check files especially: are they attached, or sent as filenames only?
4. **Limits** — client-side caps vs `MAX_ATTACHMENT_BASE64` in `route.ts`. Base64 inflates
   ~33%, so a 4 MB server cap is a ~3 MB real-file ceiling. **Does an over-cap file fail
   loudly, or get dropped while returning `ok:true`?**
5. **Validation** — per-field errors, one combined message, or browser-native? Is it
   consistent with the other forms?
6. **States** — loading, success, error. Is there a code path that can display a failure?
   Can the button get stuck disabled?
7. **Honeypot** — present client-side? And does `botcheck` actually reach the server?
8. **Accessibility** — every label associated (`htmlFor` + `id`); `aria-invalid`;
   errors linked via `aria-describedby`; a live region; focus moved to the first invalid
   field; keyboard operability of button-grid and drag-drop inputs.
9. **Copy accuracy** — does the UI promise something the backend doesn't do (a charge, a
   receipt, a confirmation email)? Cross-check `lib/data/thank-you.ts`.
10. **Destination** — where does success go, and is that route reachable in production?
    The gate is an **exact** path match (`ComingSoonGate.tsx`), so `/thank-you` being
    listed does not gate `/thank-you/<slug>`. Verify, don't assume.

## Cross-cutting checks (run once per pass)

- `/api/contact`: rate limiting, CAPTCHA, CSRF/origin check, field allow-list, field-count
  and length caps. Escaping and env-controlled `to`/`from` are already correct — the
  historical gap is **volume, not injection**.
- `lib/submitForm.ts`: does the POST body carry every field the route reads?
- `.env.example` vs `route.ts` defaults — they have drifted before on the support domain.
- Any form promising an email to the *submitter*: `route.ts` sends **one** email, to
  support.

## Deliverable 1 — narrative

Write/update `docs/forms-audit-<today>.md` (YYYY-MM-DD). Keep the established shape:

1. **Inventory table** — surface, route, `file:line`, prod state, submits-to.
2. **Critical** and **High** findings as short prose blocks (they carry nuance).
3. **Medium / Low** as a table — `ID | Finding | Where | Impact`.
4. **Accessibility** — a per-form matrix plus one row per discrete gap.
5. **Summary** — blocks launch / should fix / not ours to settle.

Optimise for browsing: tables over paragraphs, every claim carrying a `file:line`. Anything
not verified by reading the code is omitted or labelled an open question — **no inferred
findings**.

## Deliverable 2 — the change log (do NOT skip)

Update `docs/forms-audit-changes.csv`. Living tracker, one row per finding, keyed by a
stable `ID` (`FA-01`, `FA-02`, …).

Exact columns:

```
ID, Severity, Form, Prod state, Location, What's missing,
Expected behaviour, User impact, Status, Blocks launch, First found, Last updated
```

- **FROZEN — never edit once written:** `What's missing`, `Form`, `First found`, `ID`.
- **Editable:** `Severity`, `Prod state`, `Location`, `Expected behaviour`, `User impact`,
  `Status`, `Blocks launch`, `Last updated`.
- **Upsert, don't blind-append.** Existing finding (match on `ID`, or same `Location` +
  issue) → update editable cells, set `Last updated` = today. New `ID` only for a genuinely
  new issue. A finding that no longer reproduces becomes `Applied` — never delete the row.
- Vocabularies: `Severity` = Critical / High / Medium / Low · `Prod state` = Live / Gated /
  Dead / Shared / Mixed · `Blocks launch` = Yes / No.
- **`Status` is exactly one of three** (axis = who can decide it) — same contract as
  `content-accuracy-changes.csv`:
  - `Applied` — decided by us and in the code.
  - `Pending` — ours to decide, agreed, not applied yet.
  - `Needs approval` — beyond our call (ops/legal/business, or a fact we lack).

  The reason lives in `User impact`, not in the Status.
- **`Severity` and `Blocks launch` are independent.** A low-severity defect can be
  launch-blocking (a wrong recipient domain in `.env.example` sends customer mail nowhere).
  Set them separately; don't derive one from the other.

**CSV integrity — verify before finishing.** Quote any field containing a comma or quote.
Multi-location refs like `route.ts:20,78` contain commas and **must** be quoted; this has
silently added a 13th column before. Confirm with:

```bash
python3 -c "
import csv; rows=list(csv.reader(open('docs/forms-audit-changes.csv')))
h=len(rows[0]); bad=[r[0] for r in rows if len(r)!=h]
print('cols',h,'rows',len(rows)-1,'malformed:',bad or 'none')"
```

## Stay in your lane

- **Cross-reference, don't duplicate.** The booking wizard charging nothing is **CA-36**;
  the `/api/contact` hardening is `CLAUDE.md` §1. Reference those IDs — do not restate them
  as new findings under new numbers.
- **Never mix forms findings into `docs/content-accuracy-changes.csv`.** That tracker is
  scoped to content claims; adding `FA-nn` rows would corrupt the `CA-nn` ID space.
- **Report and CSV must agree** on IDs and on which findings block launch. Check both after
  writing.

## Coverage report (required)

- **`full`**: list every surface and shared file **read in full** this pass, and any you
  could not. If a surface was skipped, say so — the run is not complete until all in-scope
  files are read end to end.
- **`semi`**: state "PARTIAL PASS" up front; list what was re-read and **what was
  deliberately not**. Recommend a `full` pass for anything untouched for a while.

## Finish

Summarize inline: mode run, surfaces covered, finding count, the split by `Severity` and by
`Status`, and which findings block launch. Confirm the CSV parsed clean and that report and
CSV agree. Then offer to apply the `Pending` fixes — **do not apply them unasked.**
