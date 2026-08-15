// Server-only Stripe client for the /installation booking checkout (FB-01).
// NEVER import this from a client component — STRIPE_SECRET_KEY must not reach the
// browser. The wizard talks to /api/booking/* and receives only a session client secret,
// which is safe to hold client-side (it is scoped to that one Checkout session).
//
// Mode: Checkout with ui_mode "embedded_page" — Stripe's iframe mounts inside step 5 so
// the customer never leaves the wizard and its React state survives. See
// docs/fb-01-booking-payment-flow.md for why hosted Checkout and Elements were both
// rejected.

import Stripe from "stripe";

/** $250.00 AUD, in minor units. Server-side ONLY — never read an amount from a request. */
export const INSTALLATION_PRICE_CENTS = 25_000;
export const CURRENCY = "aud";

/**
 * How long a hold survives.
 *
 * Stripe's floor for a session is 30 minutes and it rejects anything under it, so this
 * carries two minutes of margin — computing exactly +30 puts the value on the boundary,
 * where any latency between building the request and Stripe reading it lands under.
 * The held GHL appointment must outlive the session that owns it, or a customer could
 * still be paying against a slot we already gave away.
 */
export const HOLD_TTL_MINUTES = 32;

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // apiVersion is deliberately left to the SDK's own pinned default. Pinning it here as
  // well means two places to update, and a mismatch fails at runtime rather than build.
  client ??= new Stripe(key);
  return client;
}

/**
 * Everything the confirmation email and the support team need, carried on the session.
 *
 * This is the ONLY durable copy of the booking details besides the GHL appointment — the
 * site has no database. Stripe allows 50 metadata keys at 500 characters each, which this
 * stays well inside; values are truncated rather than risking a rejected session.
 */
export type BookingMetadata = {
  appointmentId: string;
  contactId: string;
  model: string;
  slot: string;
  address: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  retailer?: string;
  notes?: string;
  /**
   * ISO timestamp of terms acceptance (FA-26). Rides on the session metadata because that
   * is the only durable record this site keeps besides the GHL appointment — there is no
   * database, so if it is not here, the proof that the customer agreed does not exist.
   */
  termsAcceptedAt: string;
};

const trim500 = (v: string) => (v.length > 500 ? `${v.slice(0, 497)}…` : v);

export type BookingSession = { sessionId: string; clientSecret: string; expiresAt: number };

/**
 * Creates the embedded Checkout session that charges the flat installation fee.
 *
 * Deliberately NOT idempotency-keyed. expires_at is derived from the current time, so a
 * retry sends different parameters under the same key and Stripe rejects it outright —
 * and anchoring expires_at to when the hold was taken is not an option either, since it
 * falls under Stripe's "at least 30 minutes from now" floor within two minutes. Reuse is
 * handled instead by parking the session id on the held appointment and retrieving it;
 * see sessionIdFromTitle() in lib/ghl.ts and /api/booking/create.
 */
export async function createBookingSession(meta: BookingMetadata): Promise<BookingSession> {
  const expiresAt = Math.floor(Date.now() / 1000) + HOLD_TTL_MINUTES * 60;

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    // "embedded_page" is what "embedded" was renamed to; this SDK's API version rejects
    // the old value outright. It is still the in-page iframe — nothing about the flow
    // changed, only the name.
    ui_mode: "embedded_page",
    // The wizard renders its own step 6 from server state, so Stripe must not navigate
    // anywhere on success — we handle completion in-page via onComplete.
    redirect_on_completion: "never",
    expires_at: expiresAt,
    customer_email: meta.email,
    // Surfaces in the Stripe dashboard so support can tie a payment to a booking.
    client_reference_id: meta.appointmentId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: INSTALLATION_PRICE_CENTS,
          product_data: {
            name: "FineVu professional installation",
            description: `Front + rear hardwire install — ${meta.model}`,
          },
        },
      },
    ],
    // Produces a real invoice document. A bare Stripe receipt is NOT an Australian tax
    // invoice (no ABN, no GST line) and /installation promises the customer one.
    // Completing that promise still needs the ABN configured on the Stripe account.
    invoice_creation: { enabled: true },
    // Stripe metadata does NOT flow between object types — Session, PaymentIntent and
    // Charge each carry their own bag. charge.refunded delivers a Charge, so without this
    // the refund handler reads an empty bag, silently does nothing, and a refunded
    // customer stays booked while an installer is dispatched (FA-32). A PaymentIntent's
    // metadata IS inherited by its Charge, which is why the id is planted here.
    // Only appointmentId — the refund path needs nothing else, and duplicating the whole
    // bag would double what a leaked key exposes.
    payment_intent_data: { metadata: { appointmentId: meta.appointmentId } },
    metadata: Object.fromEntries(
      Object.entries(meta)
        .filter(([, v]) => typeof v === "string" && v.length > 0)
        .map(([k, v]) => [k, trim500(v as string)]),
    ),
  });

  if (!session.client_secret) throw new Error("Stripe returned a session with no client_secret");
  return { sessionId: session.id, clientSecret: session.client_secret, expiresAt };
}

/**
 * The hosted URL of the invoice Stripe generated for a paid session, if there is one.
 *
 * A webhook payload carries `invoice` as a bare id rather than an expanded object, so it
 * has to be fetched. Returns undefined rather than throwing: the confirmation email
 * contains the full tax-invoice detail itself, so this link is a convenience and must
 * never be the reason a customer gets no email.
 */
export async function invoiceUrl(invoice: string | { id?: string } | null | undefined): Promise<string | undefined> {
  const id = typeof invoice === "string" ? invoice : invoice?.id;
  if (!id) return undefined;
  try {
    const inv = await stripe().invoices.retrieve(id);
    return inv.hosted_invoice_url ?? undefined;
  } catch {
    return undefined;
  }
}

export const retrieveSession = (sessionId: string) => stripe().checkout.sessions.retrieve(sessionId);

/**
 * The client secret of a session that is still payable, or null if it is gone.
 *
 * Lets a retried /api/booking/create hand back the SAME session rather than minting a
 * second payable one for the same held slot. A session that has expired or already been
 * paid returns null, so the caller creates a fresh one instead of resurrecting a dead
 * checkout.
 */
export async function reusableSession(sessionId: string): Promise<BookingSession | null> {
  try {
    const s = await retrieveSession(sessionId);
    if (s.status !== "open" || !s.client_secret) return null;
    return { sessionId: s.id, clientSecret: s.client_secret, expiresAt: s.expires_at };
  } catch {
    return null;
  }
}
