// Server-only GHL (GoHighLevel) client. NEVER import this from a client component —
// GHL_API_KEY is a secret private-integration token and must not reach the browser.
// The booking wizard talks to /api/booking/slots instead, which calls in here.
//
// Verified against the live FineVu Australia calendar on 2026-08-06: API v2 is on the
// plan, free-slots returns real availability, and GHL enforces weekends, minimum
// scheduling notice, the booking window and one-off date blocks server-side. That is
// why the wizard no longer computes any of those itself.

const API_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-04-15";

/** The zone every slot is expressed in. Matches the calendar's own timezone in GHL. */
export const BOOKING_TIMEZONE = "Australia/Melbourne";

/** How far ahead to ask for. GHL's own "date range" setting can cut this shorter. */
export const BOOKING_WINDOW_DAYS = 28;

export type DaySlots = {
  /** Local calendar date in the booking timezone, e.g. "2026-08-10". */
  date: string;
  /** Offered start times as ISO strings with offset, e.g. "2026-08-10T09:00:00+10:00". */
  slots: string[];
};

export const ghlConfigured = () => Boolean(process.env.GHL_API_KEY && process.env.GHL_CALENDAR_ID);

// GHL returns { "2026-08-10": { slots: [...] }, traceId: "..." } — a date-keyed object
// with one non-date key mixed in, so entries are filtered rather than trusted wholesale.
type FreeSlotsResponse = Record<string, { slots?: unknown } | unknown>;

const isDateKey = (k: string) => /^\d{4}-\d{2}-\d{2}$/.test(k);

/**
 * Fetches bookable start times for the next `days` days.
 *
 * Throws on a missing config or a non-200 from GHL — callers decide how to degrade,
 * because "not configured" (local dev) and "configured but failing" (production
 * incident) deserve different treatment in the UI.
 */
export async function fetchFreeSlots(days: number = BOOKING_WINDOW_DAYS): Promise<DaySlots[]> {
  const apiKey = process.env.GHL_API_KEY;
  const calendarId = process.env.GHL_CALENDAR_ID;
  if (!apiKey || !calendarId) throw new Error("GHL is not configured");

  const now = Date.now();
  const url =
    `${API_BASE}/calendars/${encodeURIComponent(calendarId)}/free-slots` +
    `?startDate=${now}&endDate=${now + days * 24 * 60 * 60 * 1000}` +
    `&timezone=${encodeURIComponent(BOOKING_TIMEZONE)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: API_VERSION,
      Accept: "application/json",
    },
    // Availability changes as bookings come in, so never serve a cached body here.
    // The route above this applies its own short TTL to keep request volume sane.
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`GHL free-slots failed: ${res.status}`);

  const data = (await res.json()) as FreeSlotsResponse;
  return Object.entries(data)
    .filter(([key]) => isDateKey(key))
    .map(([date, value]) => {
      const slots = (value as { slots?: unknown })?.slots;
      return { date, slots: Array.isArray(slots) ? slots.filter((s): s is string => typeof s === "string") : [] };
    })
    .filter((d) => d.slots.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}
