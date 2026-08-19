import "server-only";

// Best-effort in-memory rate limit shared by the upload-signing and persistence routes
// (FB-04 / FB-05). Same caveat as the limiter in app/api/contact: serverless instances do
// not share memory, so the ceiling is per-instance and a cold start resets it. It is not
// the primary defence here — both routes write only to a private, lifecycle-purged bucket
// and upsert a GHL contact that dedupes by email — but it stops a trivial scripted flood.

type Bucket = { max: number; windowMs: number };

const hits = new Map<string, number[]>();

/** True when `key` has already hit `bucket.max` requests inside the window. Prunes on the
    way through so the map can't grow unbounded on a long-lived instance. */
export function rateLimited(key: string, bucket: Bucket): boolean {
  const now = Date.now();
  const cutoff = now - bucket.windowMs;
  for (const [k, times] of hits) {
    const kept = times.filter((t) => t > cutoff);
    if (kept.length) hits.set(k, kept);
    else hits.delete(k);
  }
  const times = hits.get(key) ?? [];
  if (times.length >= bucket.max) return true;
  times.push(now);
  hits.set(key, times);
  return false;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
