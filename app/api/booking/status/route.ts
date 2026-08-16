import { NextResponse } from "next/server";
import { getAppointment, ghlConfigured } from "@/lib/ghl";
import { retrieveSession, stripeConfigured } from "@/lib/stripe";

// What step 6 renders from. The wizard knows it paid; only the server knows whether the
// booking was actually confirmed.
//
// Deliberately reads BOTH sides. Stripe says whether the money cleared, GHL says whether
// the appointment was promoted — and they disagree for a few seconds every time, because
// the browser gets Stripe's onComplete at roughly the same moment the webhook fires. It
// is also the reconciliation path if the webhook is late or was missed entirely.

export const dynamic = "force-dynamic";

export type BookingStatus = {
  ok: boolean;
  /** paid = money cleared. confirmed = appointment promoted. Not the same instant. */
  paid: boolean;
  confirmed: boolean;
  reference?: string;
  slot?: string;
  reason?: string;
};

export async function GET(req: Request) {
  if (!stripeConfigured() || !ghlConfigured()) {
    return NextResponse.json({ ok: false, paid: false, confirmed: false, reason: "not_configured" }, { status: 503 });
  }

  const sessionId = new URL(req.url).searchParams.get("session_id");
  // Cheap shape check before spending a Stripe call on an obviously bogus id.
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ ok: false, paid: false, confirmed: false, reason: "bad_request" }, { status: 400 });
  }

  try {
    const session = await retrieveSession(sessionId);
    const paid = session.payment_status === "paid";
    const appointmentId = session.metadata?.appointmentId;

    if (!paid || !appointmentId) {
      return NextResponse.json({ ok: true, paid, confirmed: false, reference: appointmentId });
    }

    // Paid. Now ask GHL whether the webhook has landed yet.
    //
    // The bare catch is CORRECT here, and deliberately unlike the Stripe webhook, which was
    // changed to findAppointment for exactly the opposite reason (FA-41). This is a read for
    // display: if GHL is unreachable we answer confirmed:false, step 6 keeps saying "we're
    // confirming your appointment now", and that stays true. Nothing is decided, nothing is
    // discarded. In the webhook the same shape threw away a paid booking, because a 200
    // there tells Stripe never to deliver again.
    const appointment = await getAppointment(appointmentId).catch(() => null);

    return NextResponse.json({
      ok: true,
      paid: true,
      // `deleted` matters: GHL soft-deletes, so a swept hold still reports its old status.
      // Reporting a deleted appointment as confirmed would tell a customer they are booked
      // when the slot has already gone back on sale.
      confirmed: appointment?.status === "confirmed" && !appointment.deleted,
      reference: appointmentId,
      slot: appointment?.startTime || session.metadata?.slot,
    } satisfies BookingStatus);
  } catch (err) {
    console.error("[booking/status]", err);
    return NextResponse.json({ ok: false, paid: false, confirmed: false, reason: "unavailable" }, { status: 502 });
  }
}
