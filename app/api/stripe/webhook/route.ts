import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { cancelAppointment, confirmAppointment, getAppointment, releaseHold } from "@/lib/ghl";
import { stripe, stripeConfigured } from "@/lib/stripe";

// The only thing that turns a held slot into a real booking (FB-01).
//
// The browser is NOT the source of truth. Stripe's onComplete fires in a tab that can be
// closed, backgrounded or lose its network mid-redirect, so the wizard is allowed to say
// "payment received" and nothing more. This route is what says "booked".
//
// Everything here must be idempotent: Stripe retries a failed delivery for up to three
// days, and both handlers can legitimately arrive twice.

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  // Must be the RAW body — parsing it first would change the bytes the signature covers.
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    // An unverified payload is the one thing that could confirm a booking nobody paid
    // for, so this is a hard reject rather than anything cleverer.
    console.error("[stripe/webhook] signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const appointmentId = session.metadata?.appointmentId;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        if (!appointmentId) {
          // Paid, but we cannot tell which booking. Never silently swallow this: the
          // money is real and a human has to reconcile it.
          console.error("[stripe/webhook] paid session carries no appointmentId", session.id);
          break;
        }
        // Re-reading first keeps a retry from thrashing GHL, and surfaces the case where
        // the hold was swept before payment landed.
        // GHL soft-deletes, so a swept hold still resolves here with deleted: true.
        // Treating that as "found" would confirm a booking that no longer exists.
        const found = await getAppointment(appointmentId).catch(() => null);
        const current = found && !found.deleted ? found : null;
        if (!current) {
          console.error(
            "[stripe/webhook] PAID BUT THE HOLD IS GONE — refund or rebook by hand",
            { session: session.id, appointmentId },
          );
          break;
        }
        if (current.status === "confirmed") break; // already handled; a retry
        await confirmAppointment(appointmentId);
        break;
      }

      case "checkout.session.expired": {
        // The customer never paid. Hand the slot back.
        //
        // This is the Stripe → GHL direction on purpose: the id comes from the session we
        // created, so we can only ever delete an appointment of our own. Sweeping GHL for
        // status "new" would also match bookings staff entered by hand in its UI.
        if (appointmentId) await releaseHold(appointmentId);
        break;
      }

      case "charge.refunded": {
        // Cancelled rather than deleted — the terms promise refunds in several scenarios,
        // so the record has to survive for the audit trail.
        const refundedId = (event.data.object as Stripe.Charge).metadata?.appointmentId;
        if (refundedId) await cancelAppointment(refundedId).catch(() => {});
        break;
      }
    }
  } catch (err) {
    // A 5xx makes Stripe retry, which is what we want for a transient GHL failure.
    console.error("[stripe/webhook] handler failed", event.type, err);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
