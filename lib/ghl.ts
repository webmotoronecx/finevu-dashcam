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
  /**
   * GHL SOFT-deletes: a removed appointment still answers GET with 200 and its original
   * status, carrying deleted: true. Callers that treat "it resolved" as "it exists" will
   * happily act on a booking that is gone — always check this.
   */
  deleted: boolean;
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
/**
 * A GHL response we did not get a 2xx from, carrying the STATUS as a field.
 *
 * The status used to live only inside the message string, and callers recovered it with
 * `String(err).includes(" 404")`. That reads a 404 out of any error whose body happens to
 * contain those characters, and — worse — gives a caller no way to tell "GHL answered, and
 * the thing is not there" apart from "GHL did not answer at all". Those two must not be
 * handled the same way anywhere money is involved.
 */
export class GhlError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "GhlError";
  }
}

const isNotFound = (err: unknown) =>
  err instanceof GhlError && (err.status === 404 || err.status === 400);

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
    throw new GhlError(
      `GHL ${init.method ?? "GET"} ${path} failed: ${res.status} ${detail.slice(0, 300)}`,
      res.status,
    );
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
    deleted: e.deleted === true,
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
      title: holdTitle(input.customerName),
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

type EventsResponse = { events?: Record<string, unknown>[] };

/**
 * Finds an existing HELD appointment for this contact at this exact time.
 *
 * Exists because our own hold blocks the slot: a retried or double-fired create would
 * see the slot as taken and tell the customer someone else booked it. Checking for our
 * own hold first turns that into a reuse instead of a false 409.
 *
 * Matching on contactId + instant + status "new" is deliberately narrow — it can only
 * ever return a hold belonging to the customer who is asking, and never a confirmed
 * booking. Instants are compared numerically because GHL may echo a different but
 * equivalent offset.
 */
export async function findHeldAppointment(contactId: string, startTime: string): Promise<Appointment | null> {
  const { calendarId, locationId } = config();
  const target = new Date(startTime).getTime();
  if (Number.isNaN(target)) return null;

  // A tight window around the slot keeps the response small; GHL wants epoch millis here.
  const data = await ghlFetch<EventsResponse>(
    `/calendars/events?locationId=${encodeURIComponent(locationId)}&calendarId=${encodeURIComponent(calendarId)}` +
      `&startTime=${target - 60_000}&endTime=${target + 60_000}`,
  );

  const match = (data.events ?? []).find((e) => {
    const status = typeof e.appointmentStatus === "string" ? e.appointmentStatus : e.appoinmentStatus;
    const start = typeof e.startTime === "string" ? new Date(e.startTime).getTime() : NaN;
    return e.contactId === contactId && status === "new" && start === target && e.deleted !== true;
  });

  return match ? toAppointment(match as AppointmentResponse) : null;
}

export async function getAppointment(appointmentId: string): Promise<Appointment> {
  return toAppointment(
    await ghlFetch<AppointmentResponse>(`/calendars/events/appointments/${encodeURIComponent(appointmentId)}`),
  );
}

/**
 * The appointment, or null ONLY because GHL said it is not there.
 *
 * Use this instead of `getAppointment(id).catch(() => null)` anywhere the answer decides
 * whether to give up. A bare catch turns a timeout, a 500 or an expired token into "it is
 * gone", and the caller then acts on a deletion that never happened — in the Stripe webhook
 * that meant returning 200 for a booking somebody had just paid for, so Stripe never
 * retried and the appointment was never confirmed.
 *
 * Anything that is not a 404/400 propagates, so a transient GHL failure stays a failure and
 * the caller can 500 and let Stripe deliver again.
 */
export async function findAppointment(appointmentId: string): Promise<Appointment | null> {
  try {
    return await getAppointment(appointmentId);
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

// --- Hold ↔ Stripe session link ---------------------------------------------
//
// The appointment title is the only writable field on an appointment that actually
// persists (`notes` is accepted and silently dropped), so it carries the Stripe session
// id while the booking is held.
//
// This exists because the session id must be RECOVERABLE. Stripe's idempotency keys
// cannot do the job: expires_at is derived from the current time, so a retry sends
// different parameters under the same key and is rejected — and it cannot be made
// deterministic either, because an expires_at anchored to when the hold was taken drops
// below Stripe's "at least 30 minutes from now" floor within two minutes. Without a
// recoverable id, every retry would mint a second payable session for one appointment.
//
// The tag is visible in the installers' calendar for at most the length of a hold:
// confirmAppointment() strips it as it promotes the booking.

const HOLD_TAG = /\s*\[hold (cs_[A-Za-z0-9_]+)\]$/;

export const holdTitle = (customerName: string, sessionId?: string) =>
  `${customerName} — FineVu installation${sessionId ? ` [hold ${sessionId}]` : ""}`;

/** The Stripe session id parked on a held appointment, if it has one yet. */
export const sessionIdFromTitle = (title: string): string | null => title.match(HOLD_TAG)?.[1] ?? null;

export async function setAppointmentTitle(appointmentId: string, title: string): Promise<Appointment> {
  return toAppointment(
    await ghlFetch<AppointmentResponse>(`/calendars/events/appointments/${encodeURIComponent(appointmentId)}`, {
      method: "PUT",
      body: { title, toNotify: false },
    }),
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

/**
 * Promotes a hold to a real booking. Called ONLY from the Stripe webhook.
 *
 * Also strips the "[hold cs_…]" tag from the title, so a confirmed booking reads cleanly
 * in the installers' calendar and the tag can never be mistaken for a live hold.
 */
export async function confirmAppointment(appointmentId: string): Promise<Appointment> {
  const confirmed = await setStatus(appointmentId, "confirmed");
  if (!sessionIdFromTitle(confirmed.title)) return confirmed;
  return setAppointmentTitle(appointmentId, confirmed.title.replace(HOLD_TAG, ""));
}

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
    // Was a substring match on the message; now the status itself. Same two codes — GHL
    // 400s an id it has already removed — but it can no longer be fooled by an error whose
    // body happens to contain "404".
    if (isNotFound(err)) return false;
    throw err;
  }
}
