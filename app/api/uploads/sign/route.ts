import { NextResponse } from "next/server";
import { presignUpload, r2UploadsConfigured } from "@/lib/r2";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

// Mints presigned PUT URLs so the browser can upload registration receipts and
// warranty-claim evidence straight to the private R2 uploads bucket (FB-04 / FB-05),
// bypassing Vercel's ~4.5 MB request-body limit. One short-lived URL per file, all keyed
// under pending/<uploadId>/…; app/api/persist promotes them to a permanent path when the
// form is actually submitted, and the bucket's lifecycle rule sweeps whatever is abandoned.
//
// NOT Turnstile-gated, deliberately: the form carries ONE single-use Turnstile token and it
// is spent on the email submission (/api/contact), which stays unchanged. This route is
// rate-limited instead, and only ever writes to a private, lifecycle-purged bucket, so its
// abuse value is low.

const FORMS = new Set(["warranty-claim", "register"]);

// Validated by EXTENSION, mirroring /api/contact — browsers report HEIC's MIME type
// inconsistently (often empty), so the filename is the reliable signal.
const ALLOWED_EXTS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "pdf"]);

const MAX_FILES = 20;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_TOTAL_BYTES = 150 * 1024 * 1024;

const RATE_LIMIT = { max: 20, windowMs: 10 * 60 * 1000 };

type IncomingFile = { name?: unknown; type?: unknown; size?: unknown };
type Payload = { form?: unknown; files?: unknown };

const extOf = (name: string) => (name.includes(".") ? name.split(".").pop()!.toLowerCase() : "");

// Flatten any path and strip anything outside a safe set, so a crafted name can't imply a
// directory or need escaping once it becomes part of an R2 key.
const safeName = (name: string) =>
  name
    .replace(/[\\/]+/g, "_")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 100) || "file";

export async function POST(req: Request) {
  if (!r2UploadsConfigured()) {
    // Fail-safe: no bucket configured ⇒ the client falls back to email-only.
    return NextResponse.json({ ok: false, error: "Uploads are not configured." }, { status: 503 });
  }

  const ip = clientIp(req);
  if (await isRateLimited(`sign:${ip}`, RATE_LIMIT)) {
    return NextResponse.json({ ok: false, error: "Too many uploads. Please try again shortly." }, { status: 429 });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const form = String(payload.form ?? "");
  if (!FORMS.has(form)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const rawFiles = Array.isArray(payload.files) ? (payload.files as IncomingFile[]) : [];
  if (rawFiles.length === 0 || rawFiles.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  let total = 0;
  // `size` is carried through to presignUpload and SIGNED into the URL, which is what makes
  // the caps below binding — see the note on presignUpload. Validate it here, then hand the
  // same number to the signer; never re-read it from the request afterwards.
  const validated: { name: string; type: string; size: number }[] = [];
  for (const f of rawFiles) {
    const name = typeof f.name === "string" ? f.name : "";
    const size = typeof f.size === "number" ? f.size : NaN;
    const type = typeof f.type === "string" && f.type ? f.type : "application/octet-stream";
    if (!name || !ALLOWED_EXTS.has(extOf(name))) {
      return NextResponse.json({ ok: false, error: "That file type isn’t supported." }, { status: 400 });
    }
    if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_BYTES) {
      return NextResponse.json({ ok: false, error: "That file is too large." }, { status: 400 });
    }
    total += size;
    validated.push({ name, type, size });
  }
  if (total > MAX_TOTAL_BYTES) {
    return NextResponse.json({ ok: false, error: "Those files are too large together." }, { status: 400 });
  }

  const uploadId = crypto.randomUUID();
  try {
    const files = await Promise.all(
      validated.map(async (f, i) => {
        // Number the key so the folder stays in the order the customer chose.
        const key = `pending/${uploadId}/${String(i + 1).padStart(2, "0")}_${safeName(f.name)}`;
        const url = await presignUpload(key, f.type, f.size);
        return { key, url, name: f.name };
      }),
    );
    return NextResponse.json({ ok: true, uploadId, files });
  } catch {
    return NextResponse.json({ ok: false, error: "Couldn’t prepare the upload. Please try again." }, { status: 502 });
  }
}
