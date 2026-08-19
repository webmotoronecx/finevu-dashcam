import "server-only";

import { CRM_SOURCE, type CrmChannel } from "@/lib/crmLabels";

/* Form → GHL, via a workflow inbound webhook (FB-06).
 *
 * SERVER ONLY. The webhook URL is an unauthenticated write endpoint — anyone holding it can
 * create contacts in the CRM — so it is a secret, and `import "server-only"` makes an
 * accidental import from a client component a build error rather than a leak.
 *
 * ── Why this lives behind /api/contact ──────────────────────────────────────────────────
 * The POST is made SERVER-SIDE, from inside the /api/contact handler, after the support
 * email has gone out. Posting to the workflow URL from the browser would be less code and
 * strictly worse: the URL would be in the client bundle for anyone to read, and the request
 * would skip every protection the route has — the honeypot, Turnstile, the per-IP rate
 * limit and the field caps. That turns a public form into an open write endpoint on the
 * CRM. Routing through /api/contact means a lead can only be created by a caller who has
 * already cleared all four.
 *
 * This is the pattern any other form should follow. If a form is wired straight from the
 * browser to a workflow URL, that is the bug to fix, not a style difference.
 *
 * ── Why an allowlist per form ───────────────────────────────────────────────────────────
 * /api/contact still has no field-name allowlist (FA-05), so a caller can invent field
 * names. Mailing an odd label to support is untidy; writing one into the CRM is worse,
 * because it is a record someone later has to find and delete. `fields` below is therefore
 * the exact set forwarded for each form — anything else the caller sends is dropped.
 *
 * ── Failure contract ────────────────────────────────────────────────────────────────────
 * Best effort, and NEVER throws. The support email is the record; this is the pipeline copy.
 * A GHL outage must not fail a submission the customer has already completed and that
 * support has already received — the same trade as sendAutoReply and sendBookingConfirmation.
 */

/** How long to wait on the workflow endpoint before giving up. */
const WEBHOOK_TIMEOUT_MS = 5_000;

type FormWebhook = {
  /** Env var holding this form's workflow URL. Each GHL workflow has its own. */
  env: string;
  /** Which website surface this is, for the Source written onto the contact. */
  channel: CrmChannel;
  /** Exactly the field keys forwarded to GHL. Anything else the caller sends is dropped. */
  fields: readonly string[];
};

/**
 * The forms allowed to reach GHL, keyed by the `formType` the client sends.
 *
 * `formType` is matched against THIS map and nothing else. The caller never supplies a URL
 * or a field name — it picks one of these keys or it is ignored.
 *
 * Adding a form is an entry here plus its env var. /register is deliberately absent: it is
 * being wired separately, and adding a second entry blind would guess at both its field
 * names and its workflow.
 */
const FORM_WEBHOOKS: Record<string, FormWebhook> = {
  retailer: {
    env: "GHL_WEBHOOK_RETAILER_URL",
    channel: "retailer",
    fields: [
      "business_name",
      "abn",
      "business_type",
      "contact_name",
      "email",
      "phone",
      "state",
      "website",
      "message",
    ],
  },
};

/** Whether `formType` names a form we forward at all. Does not check configuration. */
export const isKnownFormType = (formType: string): boolean => formType in FORM_WEBHOOKS;

export type WebhookResult =
  | { ok: true }
  | { ok: false; skipped: true }
  | { ok: false; skipped?: false; error: string };

/**
 * Forward one submission to its GHL workflow.
 *
 * Returns rather than throws, and the caller must not fail the request on a bad result.
 * An unset URL is a SKIP, not an error: it is the fail-safe and the kill switch at once —
 * unset the var and leads stop flowing to GHL while the forms keep working exactly as they
 * did before, which is also what keeps local dev from writing to the live CRM.
 */
export async function sendToGhlWorkflow(
  formType: string,
  fields: Record<string, string>,
): Promise<WebhookResult> {
  const spec = FORM_WEBHOOKS[formType];
  if (!spec) return { ok: false, skipped: true };

  const url = process.env[spec.env];
  if (!url) return { ok: false, skipped: true };

  // Only the declared fields, and only the ones actually filled in.
  const payload: Record<string, string> = {};
  for (const key of spec.fields) {
    const value = fields[key];
    if (typeof value === "string" && value.trim()) payload[key] = value.trim();
  }
  if (Object.keys(payload).length === 0) return { ok: false, skipped: true };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      /* `source` is sent on every lead so a bad run is one filter and a bulk delete in GHL
         rather than manual cleanup. It is the only meaningful mitigation for the fact that
         this path is reachable by anyone who gets past Turnstile.

         It comes from lib/crmLabels.ts, shared with the booking path's REST upsert, so the
         two cannot drift into two spellings of the same idea.

         NOTE the TAG is not sent here. This posts to a workflow, and the contact does not
         exist until that workflow's Create/Update Contact action has run — so tagging is an
         "Add Contact Tag" action INSIDE the workflow, placed after it. CRM_TAG.retailer is
         the string that action must use; nothing in the build can check that it matches. */
      body: JSON.stringify({ ...payload, form_type: formType, source: CRM_SOURCE[spec.channel] }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, error: `GHL workflow returned ${res.status}` };
    return { ok: true };
  } catch (err) {
    // Includes the timeout abort. Never rethrown — see the failure contract above.
    return { ok: false, error: String(err) };
  }
}
