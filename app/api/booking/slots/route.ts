import { NextResponse } from "next/server";
import { BOOKING_TIMEZONE, type DaySlots, fetchFreeSlots, ghlConfigured } from "@/lib/ghl";

// Reads real installation availability from the GHL calendar for the /installation
// wizard's step 3. Exists as a route because GHL_API_KEY is secret and the wizard is a
// client component — the browser must never hold the token.

export const dynamic = "force-dynamic";

// A short shared cache. Several customers on step 3 at once would otherwise each hit
// GHL, and availability doesn't change fast enough to justify that. Kept well under the
// time it takes a customer to fill in step 4, so a slot taken elsewhere surfaces quickly.
const CACHE_TTL_MS = 30_000;
let cache: { at: number; days: DaySlots[] } | null = null;

export async function GET() {
  if (!ghlConfigured()) {
    // Local dev and any environment without the keys. Distinguished from a real failure
    // so the wizard can say "not configured" rather than showing a customer an error.
    return NextResponse.json({ ok: false, reason: "not_configured", timezone: BOOKING_TIMEZONE, days: [] }, { status: 200 });
  }

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json({ ok: true, timezone: BOOKING_TIMEZONE, days: cache.days });
  }

  try {
    const days = await fetchFreeSlots();
    cache = { at: Date.now(), days };
    return NextResponse.json({ ok: true, timezone: BOOKING_TIMEZONE, days });
  } catch {
    // Configured but unreachable — a genuine incident. Serve a stale cache if we have
    // one rather than emptying the calendar in front of a customer.
    if (cache) return NextResponse.json({ ok: true, stale: true, timezone: BOOKING_TIMEZONE, days: cache.days });
    return NextResponse.json({ ok: false, reason: "unavailable", timezone: BOOKING_TIMEZONE, days: [] }, { status: 503 });
  }
}
