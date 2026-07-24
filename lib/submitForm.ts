// Posts website form submissions to Web3Forms, which emails them to the address
// tied to the access key. The access key is safe to expose in the browser (it
// only permits sending to that pre-configured recipient). Set it in the env var
// NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY (see .env.example).

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export type SubmitResult = { ok: true } | { ok: false; error: string };

type SubmitOptions = {
  subject: string;
  replyTo?: string;
};

export async function submitForm(
  fields: Record<string, string>,
  opts: SubmitOptions,
): Promise<SubmitResult> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[submitForm] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — form will not send.");
    }
    return {
      ok: false,
      error: "This form isn’t configured yet. Please email support@finevuaustralia.com directly.",
    };
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: "FineVu Australia website",
        subject: opts.subject,
        replyto: opts.replyTo,
        ...fields,
      }),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    if (data?.success) return { ok: true };
    return { ok: false, error: data?.message || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Couldn’t send right now. Please check your connection and try again." };
  }
}
