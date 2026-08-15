import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { cancelAppointment, confirmAppointment, getAppointment, releaseHold } from "@/lib/ghl";
import { sendBookingConfirmation } from "@/lib/email/bookingConfirmation";
import { invoiceUrl, stripe, stripeConfigured } from "@/lib/stripe";

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

        // Only after the booking is genuinely promoted — the email says "confirmed", so
        // it must not go out before that is true. Deliberately not awaited into the
        // failure path: a Resend outage must not 500 this handler and make Stripe replay
        // the whole delivery. A missing email is fixable by hand; re-running the
        // confirmation is noise.
        const meta = session.metadata ?? {};
        const sent = await sendBookingConfirmation({
          reference: appointmentId,
          email: meta.email ?? session.customer_details?.email ?? "",
          name: meta.name ?? "",
          phone: meta.phone ?? "",
          model: meta.model ?? "",
          slot: meta.slot ?? current.startTime,
          address: meta.address ?? current.address,
          vehicle: meta.vehicle ?? "",
          amountCents: session.amount_total ?? 0,
          invoiceUrl: await invoiceUrl(session.invoice),
        });
        if (!sent.ok) {
          console.error("[stripe/webhook] booking confirmed but confirmation email failed", {
            appointmentId, session: session.id, error: sent.error,
          });
        }
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
        const charge = event.data.object as Stripe.Charge;

        // charge.refunded fires on EVERY refund, including partial ones. A goodwill
        // refund of part of the fee must not cancel the whole job.
        if (charge.amount_refunded < charge.amount) break;

        // Primary path: metadata inherited from the PaymentIntent (see lib/stripe.ts).
        let refundedId = charge.metadata?.appointmentId;

        // Fallback for sessions created BEFORE payment_intent_data landed — those have no
        // PaymentIntent metadata and never will, so without this every in-flight booking
        // at cutover refunds into silence. Also covers a Charge that arrives without the
        // inherited copy for any other reason.
        if (!refundedId && charge.payment_intent) {
          const pi = await stripe().paymentIntents.retrieve(
            typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id,
          );
          refundedId = pi.metadata?.appointmentId;
        }

        if (!refundedId) {
          // Money is back with the customer but we cannot tell which slot to free. Same
          // class as a paid session with no appointmentId: a human has to reconcile it.
          console.error("[stripe/webhook] REFUNDED BUT NO appointmentId — free the slot by hand", {
            charge: charge.id,
            paymentIntent: typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id,
          });
          break;
        }

        // Read first, exactly as the completed branch does. cancelAppointment() throws on
        // a 404, and an appointment that staff already deleted — or that a retry already
        // cancelled — is the outcome we wanted; letting that 500 would make Stripe retry a
        // no-op for three days.
        const booking = await getAppointment(refundedId).catch(() => null);
        if (!booking || booking.deleted || booking.status === "cancelled") break;

        // Anything else is deliberately NOT swallowed. A failure here means the customer
        // has their money back and the calendar still shows them booked — the exact state
        // this case exists to prevent — so it throws to the outer catch, which 500s and
        // makes Stripe retry.
        await cancelAppointment(refundedId);
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
