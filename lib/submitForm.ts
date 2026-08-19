// Posts website form submissions to our own /api/contact route, which sends the
// email server-side via Resend (using the secret RESEND_API_KEY — never exposed
// to the browser). See app/api/contact/route.ts and .env.example.

export type SubmitResult = { ok: true } | { ok: false; error: string };

type SubmitOptions = {
  subject: string;
  replyTo?: string;
  /** Optional single file attachment (e.g. a receipt), base64-encoded. */
  attachment?: { filename: string; contentBase64: string };
  /**
   * Additional attachments (FA-02). /warranty-claim sends its evidence files here, on top
   * of the receipt in `attachment`. The route validates the two lists together against a
   * shared count and total-size cap, and rejects the whole submission if any file fails —
   * a partly-attached claim is worse than a refused one.
   */
  attachments?: { filename: string; contentBase64: string }[];
  /** Honeypot value, forwarded so the server-side check in route.ts can actually fire. */
  botcheck?: string;
  /** Cloudflare Turnstile token, verified server-side against TURNSTILE_SECRET_KEY (FB-07). */
  turnstileToken?: string;
  /**
   * Which form this is, so /api/contact can forward the lead to its GHL workflow (FB-06).
   *
   * It names a FORM, never a destination: the route matches it against the allowlist in
   * lib/ghlWebhook.ts, which owns both the workflow URL and the set of fields forwarded.
   * An unknown value is ignored. Omit it and the submission is email-only, exactly as before.
   */
  formType?: string;
};

export async function submitForm(
  fields: Record<string, string>,
  opts: SubmitOptions,
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: opts.subject,
        replyTo: opts.replyTo,
        fields,
        attachment: opts.attachment,
        attachments: opts.attachments,
        botcheck: opts.botcheck,
        turnstileToken: opts.turnstileToken,
        formType: opts.formType,
      }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: data?.error || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Couldn’t send right now. Please check your connection and try again." };
  }
}
