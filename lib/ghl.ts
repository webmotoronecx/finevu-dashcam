// Server-only GHL (GoHighLevel) client. NEVER import this from a client component —
// GHL_API_KEY is a secret private-integration token and must not reach the browser.
// The booking wizard talks to /api/booking/* instead, which calls in here.
//
// Verified against the live FineVu Australia calendar on 2026-08-06: API v2 is on the
// plan, free-slots returns real availability, and GHL enforces weekends, minimum
// scheduling notice, the booking window and one-off date blocks server-side. That is
// why the wizard no longer computes any of those itself.
//
// The write path below was verified the same way on 2026-08-10 — see
// docs/fb-01-booking-payment-flow.md for the probe results. The load-bearing finding:
// an appointment created with appointmentStatus "new" KEEPS that status despite the
// calendar's autoConfirm: true, and still occupies the slot. That is what makes the
// hold-then-confirm booking flow (Option B) possible.

const API_BASE = "https://services.leadconnectorhq.com";
/** Calendars/events endpoints. */
const API_VERSION = "2021-04-15";
/** Contacts endpoints are versioned separately — using the calendar version 404s. */
const CONTACTS_VERSION = "2021-07-28";

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

/**
 * GHL's appointment statuses. We use exactly three:
 *   new       — our HELD state: slot reserved, payment not yet confirmed
 *   confirmed — paid, promoted by the Stripe webhook
 *   cancelled — cancelled after payment; keeps the record for the refund audit trail
 *
 * "new" is NOT private to us — it is also what GHL assigns to a booking created by hand
 * in its own UI. Never enumerate the calendar and delete by status; see releaseHold().
 */
export type AppointmentStatus = "new" | "confirmed" | "cancelled" | "showed" | "noshow" | "invalid";

export type Appointment = {
  id: string;
  contactId: string;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
  title: string;
  address: string;
};

export const ghlConfigured = () =>
  Boolean(process.env.GHL_API_KEY && process.env.GHL_CALENDAR_ID && process.env.GHL_LOCATION_ID);

function config() {
  const apiKey = process.env.GHL_API_KEY;
  const calendarId = process.env.GHL_CALENDAR_ID;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !calendarId || !locationId) throw new Error("GHL is not configured");
  return { apiKey, calendarId, locationId };
}

/**
 * Thin wrapper over the GHL REST API. Throws on any non-2xx with the response body
 * included — these calls sit behind a customer paying money, so a silent failure is far
 * worse than a noisy one. Callers decide how to degrade.
 */
async function ghlFetch<T>(
  path: string,
  init: { method?: string; body?: unknown; version?: string } = {},
): Promise<T> {
  const { apiKey } = config();
  const res = await fetch(`${API_BASE}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: init.version ?? API_VERSION,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    // Bookings are written and read at the moment of payment; a cached body here would
    // let two customers hold the same slot.
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GHL ${init.method ?? "GET"} ${path} failed: ${res.status} ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

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
  const { calendarId } = config();

  const now = Date.now();
  const data = await ghlFetch<FreeSlotsResponse>(
    `/calendars/${encodeURIComponent(calendarId)}/free-slots` +
      `?startDate=${now}&endDate=${now + days * 24 * 60 * 60 * 1000}` +
      `&timezone=${encodeURIComponent(BOOKING_TIMEZONE)}`,
  );

  return Object.entries(data)
    .filter(([key]) => isDateKey(key))
    .map(([date, value]) => {
      const slots = (value as { slots?: unknown })?.slots;
      return { date, slots: Array.isArray(slots) ? slots.filter((s): s is string => typeof s === "string") : [] };
    })
    .filter((d) => d.slots.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Is this exact start time still bookable?
 *
 * Deliberately re-queries GHL rather than trusting the 30-second cache in
 * /api/booking/slots. This runs at the moment we take a hold, and it is the check that
 * catches a slot claimed by someone else while the customer was filling in steps 3–4.
 *
 * Compares instants, not strings: GHL may return a different but equivalent offset
 * representation than the one the wizard echoed back to us.
 */
export async function isSlotFree(startTimeIso: string): Promise<boolean> {
  const target = new Date(startTimeIso).getTime();
  if (Number.isNaN(target)) return false;
  const days = await fetchFreeSlots();
  return days.some((d) => d.slots.some((s) => new Date(s).getTime() === target));
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

type UpsertContactResponse = { contact?: { id?: string } };

/**
 * Creates the customer, or returns the existing record if we already hold one.
 *
 * Uses /contacts/upsert rather than /contacts/ because a plain create 409s on a
 * duplicate email — and repeat customers are the normal case here: someone who
 * registered a product and later books an installation is the same person. Keeping them
 * on ONE contact record is the whole reason GHL was chosen over a database, since it is
 * what lets support find a serial number when a warranty claim arrives.
 */
export async function upsertContact(input: ContactInput): Promise<string> {
  const { locationId } = config();
  const [firstName, ...rest] = input.name.trim().split(/\s+/);

  const data = await ghlFetch<UpsertContactResponse>("/contacts/upsert", {
    method: "POST",
    version: CONTACTS_VERSION,
    body: {
      locationId,
      firstName: firstName || input.name,
      lastName: rest.join(" ") || undefined,
      name: input.name,
      email: input.email,
      phone: input.phone,
      address1: input.address,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: "AU",
      source: "Website — installation booking",
    },
  });

  const id = data.contact?.id;
  if (!id) throw new Error("GHL upsert returned no contact id");
  return id;
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

type AppointmentResponse = {
  event?: Record<string, unknown>;
  appointment?: Record<string, unknown>;
} & Record<string, unknown>;

function toAppointment(data: AppointmentResponse): Appointment {
  const e = (data.appointment ?? data.event ?? data) as Record<string, unknown>;
  const str = (k: string) => (typeof e[k] === "string" ? (e[k] as string) : "");
  const id = str("id");
  if (!id) throw new Error("GHL returned an appointment with no id");
  return {
    id,
    contactId: str("contactId"),
    // GHL ships both spellings; "appoinmentStatus" is their typo, present alongside the
    // correct one. Read the correct key first and fall back so neither breaks us.
    status: (str("appointmentStatus") || str("appoinmentStatus") || "new") as AppointmentStatus,
    startTime: str("startTime"),
    endTime: str("endTime"),
    title: str("title"),
    address: str("address"),
  };
}

export type HoldInput = {
  contactId: string;
  /** ISO start time with offset, taken verbatim from a free-slots response. */
  startTime: string;
  /** Shown as the calendar entry title — keep it readable for installers. */
  customerName: string;
  /** The install address. Persists on the appointment; installers read it off the calendar. */
  address: string;
};

/**
 * Reserves the slot WITHOUT confirming it, by creating the appointment as "new".
 *
 * The slot is genuinely blocked from this moment — the calendar is appointmentPerSlot: 1,
 * and a "new" appointment removes the time from free-slots. Only the Stripe webhook
 * promotes it via confirmAppointment().
 *
 * We do NOT write the Stripe session id here. The link is held on the Stripe side
 * (session.metadata.appointmentId), which means every delete we ever issue is driven by
 * an id Stripe handed us — see releaseHold().
 *
 * `notes` is not settable through this endpoint (it is accepted and silently dropped),
 * so anything installers must see goes in `title` or `address`.
 */
export async function createHeldAppointment(input: HoldInput): Promise<Appointment> {
  const { calendarId, locationId } = config();
  const data = await ghlFetch<AppointmentResponse>("/calendars/events/appointments", {
    method: "POST",
    body: {
      calendarId,
      locationId,
      contactId: input.contactId,
      startTime: input.startTime,
      title: `${input.customerName} — FineVu installation`,
      address: input.address,
      appointmentStatus: "new",
      // Suppress GHL's own customer mail. Our confirmation goes out via Resend from the
      // Stripe webhook, so it can only ever be sent once payment has actually cleared.
      toNotify: false,
      ignoreFreeSlotValidation: false,
    },
  });
  const appt = toAppointment(data);
  // GHL's CREATE response omits startTime/endTime (its GET returns both). Backfilling
  // the requested start keeps the returned object whole, so callers never have to know
  // that create and get disagree — and never have to re-fetch just to read it back.
  return appt.startTime ? appt : { ...appt, startTime: input.startTime };
}

export async function getAppointment(appointmentId: string): Promise<Appointment> {
  return toAppointment(
    await ghlFetch<AppointmentResponse>(`/calendars/events/appointments/${encodeURIComponent(appointmentId)}`),
  );
}

async function setStatus(appointmentId: string, status: AppointmentStatus): Promise<Appointment> {
  return toAppointment(
    await ghlFetch<AppointmentResponse>(`/calendars/events/appointments/${encodeURIComponent(appointmentId)}`, {
      method: "PUT",
      body: { appointmentStatus: status, toNotify: false },
    }),
  );
}

/** Promotes a hold to a real booking. Called ONLY from the Stripe webhook. */
export const confirmAppointment = (appointmentId: string) => setStatus(appointmentId, "confirmed");

/**
 * Cancels a booking the customer already paid for.
 *
 * Frees the slot but keeps the record, deliberately: installation-terms.ts promises
 * refunds in several scenarios, so the cancellation needs an audit trail. Use
 * releaseHold() instead for an unpaid hold, where there is nothing worth keeping.
 */
export const cancelAppointment = (appointmentId: string) => setStatus(appointmentId, "cancelled");

/**
 * Hard-deletes an unpaid hold so it leaves no trace on the installers' calendar.
 *
 * ⚠️ Only ever call this with an id that came back from a Stripe session's
 * metadata.appointmentId. Never enumerate the GHL calendar and delete by status: "new"
 * is also what GHL gives an appointment a staff member creates by hand in its own UI,
 * so a status-driven sweep would quietly destroy real bookings.
 *
 * Idempotent by design — GHL 4xxs on an id it has already removed, and a hold that is
 * already gone is the outcome we wanted, so that is swallowed rather than thrown.
 */
export async function releaseHold(appointmentId: string): Promise<boolean> {
  try {
    await ghlFetch(`/calendars/events/${encodeURIComponent(appointmentId)}`, { method: "DELETE" });
    return true;
  } catch (err) {
    const msg = String(err);
    if (msg.includes(" 404") || msg.includes(" 400")) return false;
    throw err;
  }
}
