import "server-only";

// Rate limiting shared by the email route and the upload routes (FB-07 / FB-04 / FB-05).
//
// Two layers. The IN-MEMORY limiter is best-effort — serverless instances don't share
// memory, so its ceiling is per-instance and a cold start resets it; it only stops the
// trivial "loop curl in a shell" case. The DURABLE limiter backs onto an Upstash Redis REST
// store and holds a GLOBAL ceiling across instances, which is the only thing that actually
// bounds abuse once the site is live on many lambdas — without it a flood spread across
// instances (or one hitting cold starts) walks straight past the cap.
//
// isRateLimited prefers the durable store and falls back to in-memory when it is not
// configured or is unreachable, so local dev and any unprovisioned environment keep working.

export type Bucket = { max: number; windowMs: number };

// --- In-memory (best-effort, per-instance) ---------------------------------
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

// --- Durable (Upstash Redis REST, cross-instance) --------------------------
// Accepts the Upstash-native names OR Vercel KV's, so it works however the store is
// provisioned. Unset ⇒ durableRateLimited returns null and callers fall back to in-memory.
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// One INCR that arms the window's expiry only on the first hit, as a single atomic script —
// so two concurrent first requests can't both skip PEXPIRE and leak a key that never dies.
const RATE_LIMIT_LUA =
  "local c = redis.call('INCR', KEYS[1]) " +
  "if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end " +
  "return c";

// true = limited, false = allowed, null = store not configured or unreachable. Fails OPEN
// (null → caller uses the in-memory limiter): a limiter outage must never take a form down.
async function durableRateLimited(key: string, bucket: Bucket): Promise<boolean | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    // Upstash REST: POST the command as a JSON array [cmd, ...args] to the base URL.
    const res = await fetch(REDIS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", RATE_LIMIT_LUA, "1", `rl:${key}`, String(bucket.windowMs)]),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    if (typeof data.result !== "number") return null;
    return data.result > bucket.max;
  } catch {
    return null;
  }
}

/** Prefer the durable, cross-instance store; fall back to the per-instance limiter when it
    isn't configured or is unreachable. This is the reliable ceiling the upload routes and
    /api/contact both use. */
export async function isRateLimited(key: string, bucket: Bucket): Promise<boolean> {
  const durable = await durableRateLimited(key, bucket);
  if (durable !== null) return durable;
  return rateLimited(key, bucket);
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
