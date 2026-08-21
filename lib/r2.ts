import "server-only";

import { CopyObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/* Cloudflare R2 access for the firmware / manual downloads.

   The bucket is PRIVATE — there is no public development URL and no custom domain (see
   CLAUDE.md open item 6). Downloads are served by app/api/firmware/[id], which mints a
   short-lived presigned URL with the helper below and 302s the browser at it.

   SERVER ONLY. `import "server-only"` above turns any accidental import from a client
   component into a build error rather than a leaked secret — every consumer of
   lib/data/firmware.ts is a client component, so that mistake is one careless import away.
   Never import this module from there; the two are deliberately separate. */

/** How long a signed download URL stays valid. Long enough to start a 73 MB download on
    a slow connection, short enough that a leaked URL is worthless within the hour.
    Only the START of the transfer is checked — an in-flight download is not cut off when
    the URL expires, so this does not need to cover the whole transfer. */
export const PRESIGN_TTL_SECONDS = 300;

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET;

/** True when all four credentials are present. The route 503s rather than throwing when
    they are not, so a half-configured environment degrades instead of erroring. */
export function r2Configured(): boolean {
    return Boolean(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY && BUCKET);
}

/* One client for the lifetime of the lambda. Built lazily so importing this module in an
   environment without credentials is harmless — only calling presignDownload() fails. */
let client: S3Client | null = null;

function getClient(): S3Client {
    if (!client) {
        client = new S3Client({
            // R2 is single-region and ignores this, but the SDK insists on a value.
            region: "auto",
            endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: ACCESS_KEY_ID as string,
                secretAccessKey: SECRET_ACCESS_KEY as string,
            },
        });
    }
    return client;
}

/**
 * A time-limited URL that downloads `key` from the firmware bucket.
 *
 * `filename` is baked into the signature as `response-content-disposition`, which R2
 * echoes back on the response. That is what actually forces a download and names the
 * file: the `download` attribute on an <a> is IGNORED cross-origin, and the redirect
 * target is a different origin, so the header is the only control we have.
 *
 * Treat the result as a bearer token — anyone holding it can download until it expires.
 */
export async function presignDownload(key: string, filename: string): Promise<string> {
    if (!r2Configured()) {
        throw new Error("R2 is not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET.");
    }

    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
        // Quotes matter: without them a filename containing a space is truncated at it.
        ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
    });

    return getSignedUrl(getClient(), command, { expiresIn: PRESIGN_TTL_SECONDS });
}

/* --- Uploads bucket (FB-04 / FB-05) ----------------------------------------

   A SECOND private bucket for customer form uploads — registration receipts and
   warranty-claim evidence — kept apart from the firmware bucket on purpose: this one needs
   WRITE access, while the firmware token stays Object-Read-only and scoped to its one bucket.
   Same account, so R2_ACCOUNT_ID is shared; the credentials below are the read+write token
   scoped to this one bucket.

   Unset ⇒ r2UploadsConfigured() is false and the sign/persist routes 503, so the forms fall
   back to their email-only behaviour. Provisioning is therefore a pure switch-on. */

const UPLOADS_BUCKET = process.env.R2_UPLOADS_BUCKET;
const UPLOADS_ACCESS_KEY_ID = process.env.R2_UPLOADS_ACCESS_KEY_ID;
const UPLOADS_SECRET_ACCESS_KEY = process.env.R2_UPLOADS_SECRET_ACCESS_KEY;

/** How long a presigned upload URL stays valid — long enough to start a large upload on a
    slow connection, short enough that a leaked URL is worthless within the hour. */
export const UPLOAD_PRESIGN_TTL_SECONDS = 600;

export function r2UploadsConfigured(): boolean {
    return Boolean(ACCOUNT_ID && UPLOADS_ACCESS_KEY_ID && UPLOADS_SECRET_ACCESS_KEY && UPLOADS_BUCKET);
}

let uploadsClient: S3Client | null = null;

function getUploadsClient(): S3Client {
    if (!uploadsClient) {
        uploadsClient = new S3Client({
            region: "auto",
            endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: UPLOADS_ACCESS_KEY_ID as string,
                secretAccessKey: UPLOADS_SECRET_ACCESS_KEY as string,
            },
        });
    }
    return uploadsClient;
}

/**
 * A presigned PUT URL the browser uploads one file to directly — bypassing the ~4.5 MB
 * Vercel request-body limit, which is the whole reason uploads go to R2 instead of riding
 * on the form email.
 *
 * `contentType` is signed in, so the browser's PUT must send the SAME Content-Type header
 * (the bucket's CORS policy must allow it). Callers validate the file first — a signed URL
 * is a capability, so nothing unvalidated should ever get one.
 *
 * `contentLength` is signed in for the SAME reason, and it is a security control rather than
 * a nicety. The size limits in app/api/uploads/sign are checked against a `size` the CLIENT
 * puts in the request body, so without this the caller could declare 1 byte and then PUT an
 * object of any size for the URL's whole TTL — 20 files per request, on a public endpoint,
 * writing storage that /api/persist can promote to a permanent prefix the `pending/`
 * lifecycle rule never sweeps. Signing the length makes R2 itself reject any PUT whose
 * Content-Length differs from the declared size, so the declaration becomes binding instead
 * of advisory. Browsers set Content-Length from the real File, so honest uploads are
 * unaffected; a lying client is rejected by R2 before a byte is stored.
 */
export async function presignUpload(key: string, contentType: string, contentLength: number): Promise<string> {
    if (!r2UploadsConfigured()) throw new Error("R2 uploads bucket is not configured");
    const command = new PutObjectCommand({
        Bucket: UPLOADS_BUCKET,
        Key: key,
        ContentType: contentType,
        ContentLength: contentLength,
    });
    return getSignedUrl(getUploadsClient(), command, {
        expiresIn: UPLOAD_PRESIGN_TTL_SECONDS,
        // Content-Length is not signed by default — getSignedUrl hoists unrecognised headers
        // to the query string unless they are named here, which would silently restore the
        // unbounded behaviour this parameter exists to prevent.
        signableHeaders: new Set(["content-length"]),
    });
}

/**
 * Server-side copy within the uploads bucket, used to promote a file from its temporary
 * `pending/<uploadId>/…` home to the permanent `claims/…` / `registrations/…` path once the
 * form is submitted. Anything left under `pending/` is swept by the bucket's lifecycle rule,
 * which is how uploads from abandoned forms get purged.
 *
 * Keys are restricted to a safe character set by the callers, so CopySource needs no
 * escaping.
 */
export async function copyObject(sourceKey: string, destinationKey: string): Promise<void> {
    if (!r2UploadsConfigured()) throw new Error("R2 uploads bucket is not configured");
    await getUploadsClient().send(
        new CopyObjectCommand({
            Bucket: UPLOADS_BUCKET,
            CopySource: `${UPLOADS_BUCKET}/${sourceKey}`,
            Key: destinationKey,
        }),
    );
}
