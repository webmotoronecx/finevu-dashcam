// Reclaims held slots whose Stripe session never resulted in a payment (FB-01).
//
// WHY THIS EXISTS. `checkout.session.expired` is the only thing that hands an abandoned
// slot back, and it is a webhook — so it is lost whenever the event is not subscribed on
// the endpoint, the endpoint is unreachable, the signing secret is wrong, or Stripe's
// three-day retry window runs out. In every one of those cases the code is correct and the
// slot stays blocked anyway. This is the backstop that does not depend on delivery.
//
// It also covers the case `POST /api/booking/release` was meant to: a customer who changes
// their slot at step 5 leaves the old hold behind for its full 32 minutes, so one
// indecisive person can hold several slots at once.
//
// ── THE RULE THAT MATTERS ────────────────────────────────────────────────────────────
// NEVER delete on age. "Tagged and older than 35 minutes" is the obvious implementation
// and it is wrong: an abandoned checkout and a PAID booking whose webhook was lost look
// identical on the calendar, and only Stripe can tell them apart. Deleting by age would
// destroy a booking somebody paid for, in exactly the scenario this exists to rescue.
// Stripe is the authority; the clock is not.
//
// The other rule is the hold TAG. Status is not a safe selector — GHL gives an appointment
// a staff member typed into its own UI the same "new" as one of ours — so the sweep only
// ever touches titles carrying "[hold cs_…]", which only /api/booking/create writes.

import {
  confirmAppointment,
  ghlConfigured,
  listBookingWindowAppointments,
  releaseHold,
  sessionIdFromTitle,
} from "@/lib/ghl";
import { retrieveSession, stripeConfigured } from "@/lib/stripe";

/**
 * How long to leave a sweep alone after one runs.
 *
 * In-memory, so it is per serverless instance and several instances may each sweep once
 * inside the window. That is fine: the sweep is idempotent and cheap, and over-running only
 * costs a few Stripe reads. Under-running is the failure that matters.
 */
const SWEEP_INTERVAL_MS = 2 * 60 * 1000;

/**
 * Most holds to examine in one pass. A bound, not a target — in normal operation there are
 * zero or one. It exists so a calendar that has somehow accumulated a hundred stale holds
 * cannot turn a customer-facing availability request into a hundred Stripe round-trips.
 * The next pass picks up the remainder.
 */
const MAX_PER_PASS = 10;

let lastSweptAt = 0;

export type SweepResult = {
  scanned: number;
  released: number;
  /** Paid, but still sitting as a hold — the webhook never landed. Confirmed here. */
  recovered: number;
  skipped: number;
};

/**
 * Runs at most once every SWEEP_INTERVAL_MS. Returns null when it declined to run.
 *
 * NEVER THROWS. The caller is `/api/booking/slots`, a customer-facing read, and a sweep
 * failure must not turn "here are your available dates" into an error — the whole point is
 * that this is a backstop, so it degrades to doing nothing.
 */
export async function sweepStaleHolds(): Promise<SweepResult | null> {
  if (!ghlConfigured() || !stripeConfigured()) return null;

  const now = Date.now();
  if (now - lastSweptAt < SWEEP_INTERVAL_MS) return null;
  lastSweptAt = now;

  const result: SweepResult = { scanned: 0, released: 0, recovered: 0, skipped: 0 };

  try {
    const appointments = await listBookingWindowAppointments();

    // The tag is the security boundary. Everything downstream acts on ids that came from a
    // title only our own create route writes.
    const held = appointments
      .filter((a) => !a.deleted && a.status === "new")
      .map((a) => ({ appointment: a, sessionId: sessionIdFromTitle(a.title) }))
      .filter((h): h is { appointment: (typeof appointments)[number]; sessionId: string } => Boolean(h.sessionId))
      .slice(0, MAX_PER_PASS);

    for (const { appointment, sessionId } of held) {
      result.scanned++;
      try {
        const session = await retrieveSession(sessionId);

        if (session.status === "open") {
          // Still payable. The customer may be looking at the card form right now.
          result.skipped++;
          continue;
        }

        if (session.status === "complete") {
          // PAID, and still only held — the webhook never landed. Do NOT release this; the
          // customer's money is real. Confirm it so the installer is dispatched, and shout,
          // because no confirmation email was sent either and that part needs a human.
          console.error(
            "[booking/sweep] PAID BUT STILL HELD — webhook never landed. Confirmed here; send the confirmation email by hand",
            { appointmentId: appointment.id, session: sessionId },
          );
          await confirmAppointment(appointment.id);
          result.recovered++;
          continue;
        }

        // status === "expired" — the customer never paid. Hand the slot back.
        await releaseHold(appointment.id);
        result.released++;
      } catch (err) {
        // A session Stripe cannot find can never be paid, so the hold behind it is dead.
        // Anything else (a network blip, a rate limit) is left for the next pass — the
        // conservative choice, since leaving a slot held is recoverable and deleting a
        // booking is not.
        if (isMissingResource(err)) {
          console.warn("[booking/sweep] session not found, releasing its hold", {
            appointmentId: appointment.id,
            session: sessionId,
          });
          await releaseHold(appointment.id).catch(() => {});
          result.released++;
        } else {
          result.skipped++;
        }
      }
    }

    if (result.released || result.recovered) {
      console.info("[booking/sweep]", result);
    }
    return result;
  } catch (err) {
    // Listing the calendar failed, or something else did. Swallow it: availability still
    // has to render.
    console.error("[booking/sweep] pass failed", err);
    return result;
  }
}

/** Stripe's shape for "that id does not exist". */
function isMissingResource(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "resource_missing"
  );
}
