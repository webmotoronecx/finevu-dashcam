// Posts website form submissions to our own /api/contact route, which sends the
// email server-side via Resend (using the secret RESEND_API_KEY — never exposed
// to the browser). See app/api/contact/route.ts and .env.example.

export type SubmitResult = { ok: true } | { ok: false; error: string };

type SubmitOptions = {
  subject: string;
  replyTo?: string;
};

export async function submitForm(
  fields: Record<string, string>,
  opts: SubmitOptions,
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: opts.subject, replyTo: opts.replyTo, fields }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: data?.error || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Couldn’t send right now. Please check your connection and try again." };
  }
}
