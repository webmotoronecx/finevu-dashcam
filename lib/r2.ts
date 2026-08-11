import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
