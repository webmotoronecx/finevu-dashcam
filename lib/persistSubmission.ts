// Client helper: uploads a form's files straight to the private R2 bucket (via presigned
// PUT URLs) and records the submission on a GHL contact (FB-04 / FB-05). Best-effort by
// design — it runs ALONGSIDE the form email, and if anything here fails it resolves quietly
// so the customer's submission, which the email carries, is never blocked. Server side:
// app/api/uploads/sign and app/api/persist.

export type PersistForm = "warranty-claim" | "register";

// A file's Content-Type is signed into its presigned URL, so the PUT must send the SAME
// value. Browsers report HEIC (and some PDFs) with an empty type — fall back consistently.
const contentTypeOf = (file: File) => file.type || "application/octet-stream";

type SignedFile = { key: string; url: string; name: string };

async function uploadToR2(
  form: PersistForm,
  files: File[],
): Promise<{ uploadId: string; files: SignedFile[] } | null> {
  const signRes = await fetch("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form,
      files: files.map((f) => ({ name: f.name, type: contentTypeOf(f), size: f.size })),
    }),
  });
  if (!signRes.ok) return null;
  const data = (await signRes.json().catch(() => null)) as
    | { ok?: boolean; uploadId?: string; files?: SignedFile[] }
    | null;
  if (!data?.ok || !data.uploadId || !Array.isArray(data.files) || data.files.length !== files.length) {
    return null;
  }

  await Promise.all(
    files.map(async (file, i) => {
      const res = await fetch(data.files![i].url, {
        method: "PUT",
        headers: { "Content-Type": contentTypeOf(file) },
        body: file,
      });
      if (!res.ok) throw new Error("upload failed");
    }),
  );
  return { uploadId: data.uploadId, files: data.files };
}

/**
 * Uploads `files` to R2 and asks the server to persist the submission. Never throws:
 * a failure at any step (uploads not configured, R2 unreachable, CORS not set) resolves
 * silently, leaving the form email as the record of the submission.
 */
export async function persistSubmission(
  form: PersistForm,
  fields: Record<string, string>,
  files: File[],
): Promise<void> {
  try {
    let uploadId = "";
    let uploaded: { key: string }[] = [];
    if (files.length > 0) {
      const result = await uploadToR2(form, files);
      if (result === null) return; // upload failed — leave the email as the record
      uploadId = result.uploadId;
      uploaded = result.files.map((f) => ({ key: f.key }));
    }
    await fetch("/api/persist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, fields, uploadId, files: uploaded }),
    });
  } catch {
    // Best-effort: never block the submission on persistence.
  }
}
