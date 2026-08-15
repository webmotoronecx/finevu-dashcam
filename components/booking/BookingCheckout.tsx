"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";

// Step 5 of the /installation wizard (FB-01). Mounts Stripe's embedded Checkout in place
// of the card fields the page used to collect itself.
//
// Nothing here ever touches a card number: the inputs live inside Stripe's iframe, on
// Stripe's origin. That is the whole point — it keeps the integration PCI SAQ A, and it
// is why the old ccNum/ccExp/ccCvc React state was deleted rather than wired up.
//
// The session is created when this component MOUNTS, not when a pay button is clicked,
// because embedded Checkout needs a client secret before it can render. Creating it also
// takes the hold on the slot, so the customer's time is reserved while they type.

// Module scope on purpose — loadStripe kicks off a network fetch and must not re-run on
// every render.
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export type BookingPayload = {
  model: string; street: string; suburb: string; stateAu: string; postcode: string;
  slot: string; name: string; phone: string; email: string;
  make: string; vmodel: string; year: string; retailer: string; notes: string;
  /**
   * Honeypot (FA-06). A hidden field a human never sees and never fills; anything in it
   * marks the request as scripted. /api/booking/create is the one public endpoint that
   * creates a real calendar record and opens a payable session, so it had no bot defence
   * at all beyond the per-IP limiter — every other form on the site carries this.
   */
  botcheck: string;
};

type Props = {
  payload: BookingPayload;
  /** Fires once payment has actually succeeded. */
  onPaid: (ref: { sessionId: string; appointmentId: string }) => void;
  /** The chosen slot went while they were filling in step 4 — send them back to pick again. */
  onSlotTaken: (message: string) => void;
};

type CreateResponse = {
  ok?: boolean; clientSecret?: string; sessionId?: string; appointmentId?: string;
  reason?: string; message?: string;
};

export function BookingCheckout({ payload, onPaid, onSlotTaken }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const booking = useRef<{ sessionId: string; appointmentId: string } | null>(null);
  // React runs effects twice in development. The route tolerates it — a repeat call
  // reuses the same hold and session — but there is no reason to spend the round trip.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!stripePromise) {
      setError("Online payment isn’t available right now. Please contact us to book.");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => null)) as CreateResponse | null;

        if (res.status === 409) {
          onSlotTaken(data?.message ?? "That time was just booked. Please choose another.");
          return;
        }
        if (!res.ok || !data?.ok || !data.clientSecret) {
          setError(data?.message ?? "We couldn’t start your booking just now. Please try again.");
          return;
        }

        booking.current = {
          sessionId: data.sessionId ?? "",
          appointmentId: data.appointmentId ?? "",
        };
        setClientSecret(data.clientSecret);
      } catch {
        setError("Couldn’t reach our booking system. Please check your connection and try again.");
      }
    })();
    // Deliberately mount-only: re-creating the session because a payload field changed
    // would abandon a hold the customer is already paying against.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stripe calls this only after the payment has succeeded. The booking is not confirmed
  // yet at this instant — the checkout.session.completed webhook is what promotes the
  // held appointment — so the wizard must not claim a confirmed booking off the back of
  // it, only a received payment.
  const handleComplete = useCallback(() => {
    if (booking.current) onPaid(booking.current);
  }, [onPaid]);

  if (error) {
    return (
      <p className="rounded-[12px] bg-[#FDF2F0] px-5 py-4 text-[.88rem] font-medium leading-[1.6] text-[#D93816]">
        {error}
      </p>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center gap-3 rounded-[12px] bg-[#f7f7f7] px-5 py-6 text-[.88rem] text-[#6e6e73]">
        <span className="size-4 animate-spin rounded-full border-2 border-[#e8e7e2] border-t-[var(--finevu-orange)]" />
        Reserving your time and preparing secure payment…
      </div>
    );
  }

  return (
    <div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete: handleComplete }}>
        <EmbeddedCheckout className="min-h-[320px]" />
      </EmbeddedCheckoutProvider>
      <p className="mt-[22px] flex items-start gap-2 text-[.78rem] text-[#9c9ca3]">
        <Lock className="mt-[3px] h-[13px] w-[13px] shrink-0 text-[var(--finevu-orange)]" />
        Your time slot is held while you pay. Card details go straight to our payment
        provider and never touch our servers. A tax receipt is emailed to you as soon as
        payment clears.
      </p>
    </div>
  );
}
