import { NextResponse } from "next/server";

import { fileById } from "@/lib/data/firmware";
import { PRESIGN_TTL_SECONDS, presignDownload, r2Configured } from "@/lib/r2";

/* Firmware / manual downloads out of a PRIVATE Cloudflare R2 bucket.

   GET /api/firmware/<id>
     → 302 to a presigned R2 URL that expires in PRESIGN_TTL_SECONDS.

   Why a redirect and not a proxy: these files are ~73 MB. Streaming them through this
   function would bill every download as Vercel bandwidth, run against the function
   duration limit, and blow past the response size ceiling. Redirecting costs one tiny
   invocation and the bytes come straight off Cloudflare, where egress is free.

   Why an id and not a path: `fileById` resolves against the allowlist in
   lib/data/firmware.ts, so the object key never comes from the request. Accepting a
   caller-supplied key here would turn this into a read oracle for the entire private
   bucket — the exact thing making the bucket private was meant to prevent.

   This gives the downloads a same-origin, branded URL (finevuaustralia.com.au/api/...)
   without an R2 custom domain, which is currently blocked on moving the zone off
   BrandShelter nameservers. See CLAUDE.md open item 6. */

// Presigned URLs are per-request and time-limited; nothing here may be prerendered.
export const dynamic = "force-dynamic";
// The AWS SDK needs Node, not the edge runtime.
export const runtime = "nodejs";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const file = fileById(id);
    if (!file) {
        return NextResponse.json({ error: "No such download." }, { status: 404 });
    }

    /* Credentials are checked AFTER the lookup so a missing-config 503 is never confused
       with a bad id. If this fires in production the fix is env vars, not code. */
    if (!r2Configured()) {
        return NextResponse.json(
            { error: "Downloads are not configured." },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }

    try {
        const url = await presignDownload(file.key, file.filename ?? file.key.split("/").pop()!);

        /* no-store is LOAD-BEARING. Without it Vercel's CDN could cache this 302 and keep
           serving one signed URL after it has expired, so every later download would fail
           with an R2 auth error that looks nothing like a caching bug. */
        return NextResponse.redirect(url, {
            status: 302,
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        // Never surface the SDK message — it can carry the bucket name and endpoint.
        console.error(`[firmware] presign failed for id="${id}" key="${file.key}" (TTL ${PRESIGN_TTL_SECONDS}s):`, error);
        return NextResponse.json(
            { error: "Could not prepare that download." },
            { status: 502, headers: { "Cache-Control": "no-store" } },
        );
    }
}
