import { NextResponse } from "next/server";
import { COVERAGE_MESSAGES, isExcluded } from "@/lib/data/installation-coverage";
import {
  createHeldAppointment,
  findHeldAppointment,
  ghlConfigured,
  holdTitle,
  isSlotFree,
  releaseHold,
  sessionIdFromTitle,
  setAppointmentTitle,
  upsertContact,
} from "@/lib/ghl";
import { createBookingSession, reusableSession, stripeConfigured } from "@/lib/stripe";

// Takes the hold and opens the payment for /installation step 5 (FB-01).
//
// Runs when step 5 RENDERS, not when a pay button is clicked — embedded Checkout needs a
// session client secret before it can mount. So by the time the customer sees the card
// form, the slot is already reserved and the 30-minute clock is running.
//
// Order matters: contact → slot re-check → hold → session. The contact comes first so a
// blocked slot can be attributed — our own hold blocks it too, and a retry must reuse
// that rather than be told someone else took it. If Stripe fails, the hold is released
// again, because a held slot with no way to pay for it is worse than no hold.

export const dynamic = "force-dynamic";

type Payload = {
  model?: string; place?: string; street?: string; suburb?: string; stateAu?: string;
  postcode?: string; slot?: string; name?: string; phone?: string; email?: string;
  retailer?: string; make?: string; vmodel?: string; year?: string; notes?: string;
  botcheck?: string;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function bad(reason: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, reason, message }, { status });
}

// A blunt per-IP limiter. A hold blocks a real slot, so an unthrottled endpoint could
// take out the whole 28-day calendar with a loop — worse than the contact form's spam
// risk, since it denies service to genuine customers. In-memory means per-instance only;
// Turnstile + the Cloudflare WAF (FB-07) are still the real defence.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(req: Request) {
  if (!ghlConfigured() || !stripeConfigured()) {
    return bad("not_configured", "Online booking isn’t available right now. Please contact us to book.", 503);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return bad("rate_limited", "Too many booking attempts. Please wait a few minutes and try again.", 429);
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return bad("bad_request", "Malformed request.");
  }

  // Honeypot (FA-06). A hidden field no human ever sees, so anything in it is a script.
  // Rejected BEFORE the GHL contact upsert and the Stripe session — those are the two
  // calls that cost money and leave records, and the whole point is to not make them.
  //
  // Unlike /api/contact this does NOT fake a success: the wizard needs a client secret to
  // render, so there is no believable empty-success to return. The generic 400 is the same
  // shape a malformed body gets, which tells a prober nothing about why it was refused.
  //
  // Still bypassable by a script that simply omits the field — Turnstile is the durable
  // fix and is deliberately NOT added here yet; see FA-06 for why (it would fail every
  // run of scripts/e2e-booking.mjs, which cannot solve a challenge without a browser).
  if (str(body.botcheck)) return bad("bad_request", "Malformed request.");

  const model = str(body.model);
  const street = str(body.street);
  const suburb = str(body.suburb);
  const stateAu = str(body.stateAu);
  const postcode = str(body.postcode);
  const slot = str(body.slot);
  const name = str(body.name);
  const phone = str(body.phone);
  const email = str(body.email);
  const make = str(body.make);
  const vmodel = str(body.vmodel);

  // Mirrors the wizard's own step 1–4 validation. The client already checked all of this;
  // it is repeated because the client is not a trustworthy source and this route creates
  // real records and charges real money.
  if (!model) return bad("invalid", "Please select your FineVu model.");
  if (!street || !suburb || !stateAu || !/^\d{4}$/.test(postcode)) {
    return bad("invalid", "Please complete your address, including a 4-digit postcode.");
  }
  if (isExcluded(stateAu, postcode)) return bad("excluded", COVERAGE_MESSAGES.excludedBooking, 422);
  if (!slot || Number.isNaN(new Date(slot).getTime())) return bad("invalid", "Please select a start time.");
  if (!name) return bad("invalid", "Please enter your name.");
  if (!/^[\d\s+()-]{8,}$/.test(phone)) return bad("invalid", "Please enter a valid mobile number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("invalid", "Please enter a valid email address.");
  if (!make || !vmodel) return bad("invalid", "Please enter your vehicle make and model.");

  const address = [street, suburb, stateAu, postcode].filter(Boolean).join(", ");

  let createdAppointmentId: string | null = null;
  try {
    // Contact first, and deliberately before the slot check: identifying the customer is
    // what lets us tell "someone else took this slot" apart from "this is their own hold,
    // being asked for a second time". upsert is idempotent, so this is free to repeat.
    const contactId = await upsertContact({
      name, email, phone, address: street, city: suburb, state: stateAu, postalCode: postcode,
    });

    // The slot the wizard offered at step 3 may have gone while the customer filled in
    // step 4. Uncached, deliberately — this is the last moment we can catch it before
    // taking money.
    let appointmentId: string;
    if (await isSlotFree(slot)) {
      const appointment = await createHeldAppointment({
        contactId, startTime: slot, customerName: name, address,
      });
      appointmentId = appointment.id;
      createdAppointmentId = appointment.id;
    } else {
      // Not free — but our own hold blocks the slot too. A retry, a refresh, or React's
      // development double-render all land here legitimately, so reuse the customer's
      // existing hold rather than accusing them of losing their own slot.
      const mine = await findHeldAppointment(contactId, slot);
      if (!mine) {
        return NextResponse.json(
          {
            ok: false,
            reason: "slot_taken",
            message: "Sorry — that time was just booked by someone else. Please choose another.",
          },
          { status: 409 },
        );
      }
      appointmentId = mine.id;

      // The hold carries the id of the session it was created for. If that session is
      // still payable, hand back the same one — minting a second session for one held
      // slot would leave two live checkouts the customer could both pay.
      const priorId = sessionIdFromTitle(mine.title);
      const reusable = priorId ? await reusableSession(priorId) : null;
      if (reusable) {
        return NextResponse.json({
          ok: true,
          clientSecret: reusable.clientSecret,
          sessionId: reusable.sessionId,
          appointmentId,
          expiresAt: reusable.expiresAt,
          reused: true,
        });
      }
    }

    const session = await createBookingSession({
      appointmentId, contactId, model, slot, address, name, email, phone,
      vehicle: [make, vmodel, str(body.year)].filter(Boolean).join(" "),
      retailer: str(body.retailer) || undefined,
      notes: str(body.notes) || undefined,
    });

    // Park the session id on the hold so a retry can find it. Best-effort: failing here
    // costs us reuse on a retry, which is far better than failing a booking that already
    // has a payable session.
    await setAppointmentTitle(appointmentId, holdTitle(name, session.sessionId)).catch(() => {});

    return NextResponse.json({
      ok: true,
      clientSecret: session.clientSecret,
      sessionId: session.sessionId,
      appointmentId,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    // Stripe (or anything after the hold) failed. Hand the slot back rather than leaving
    // it blocked for 30 minutes against a session that will never be paid.
    if (createdAppointmentId) await releaseHold(createdAppointmentId).catch(() => {});
    console.error("[booking/create]", err);
    return bad("unavailable", "We couldn’t start your booking just now. Please try again.", 502);
  }
}
