#!/usr/bin/env node
// End-to-end test for the /installation booking + payment flow (FB-01).
//
//   npm run test:booking            (dev server must be running on :3000)
//
// Drives the real routes against test-mode Stripe and the LIVE GHL calendar, because
// there is nothing else to drive — the site has no database and no test doubles. Every
// record it creates is deleted again in a finally block, including on failure.
//
// WHY A SIGNED SYNTHETIC WEBHOOK: a Checkout Session cannot be paid through the API, so
// card entry genuinely needs a browser. But the webhook payload is just signed JSON, so
// the handler can be driven directly — real signature verification, real GHL promotion,
// real email send. Everything except the card form. The manual browser pass in
// docs/fb-01-booking-payment-flow.md covers the rest.
//
// Consequence worth knowing: /api/booking/status reads the REAL session from Stripe, so
// after a synthetic event it still reports paid:false. That is asserted honestly rather
// than faked.

import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

// --- env ---------------------------------------------------------------------

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, GHL_API_KEY, GHL_LOCATION_ID, GHL_CALENDAR_ID } = process.env;

// Refuses to touch a live Stripe account. This script creates and expires sessions.
if (!STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
  console.error("REFUSING TO RUN: STRIPE_SECRET_KEY is not a sk_test_ key.");
  process.exit(1);
}
for (const [k, v] of Object.entries({ STRIPE_WEBHOOK_SECRET, GHL_API_KEY, GHL_LOCATION_ID, GHL_CALENDAR_ID })) {
  if (!v) { console.error(`REFUSING TO RUN: ${k} is not set.`); process.exit(1); }
}

// --- tiny harness ------------------------------------------------------------

const results = [];
let failures = 0;

function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  if (!pass) failures++;
  console.log(`  ${pass ? "✓" : "✗"} ${name}${detail ? `  — ${detail}` : ""}`);
}

const eq = (name, actual, expected) =>
  check(name, actual === expected, actual === expected ? "" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);

// --- API helpers -------------------------------------------------------------

const GHL = "https://services.leadconnectorhq.com";
const ghl = async (path, { method = "GET", version = "2021-04-15", body } = {}) => {
  const res = await fetch(`${GHL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      Version: version,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
};

const stripeApi = async (path, { method = "GET", form } = {}) => {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64")}`,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
};

/**
 * A real, paid, test-mode PaymentIntent carrying the appointment id — the same shape
 * createBookingSession produces via payment_intent_data.metadata.
 *
 * A Checkout Session cannot be paid through the API, but a PaymentIntent can, and the
 * PaymentIntent is the object the metadata actually rides on. So this reproduces the
 * exact hop FA-32 depends on without needing a browser.
 */
async function paidCharge(appointmentId) {
  const pi = await stripeApi("/payment_intents", {
    method: "POST",
    form: new URLSearchParams({
      amount: String(25000),
      currency: "aud",
      "payment_method_types[]": "card",
      payment_method: "pm_card_visa",
      confirm: "true",
      "metadata[appointmentId]": appointmentId,
    }).toString(),
  });
  const chargeId = pi.data?.latest_charge;
  const charge = chargeId ? (await stripeApi(`/charges/${chargeId}`)).data : null;
  return { pi: pi.data, charge };
}

const post = async (path, payload, ip = "10.0.0.1") => {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
    body: JSON.stringify(payload),
  });
  return { status: res.status, data: await res.json().catch(() => null) };
};

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, data: await res.json().catch(() => null) };
};

/**
 * Signs a payload exactly as Stripe does, so constructEvent in the route accepts it.
 * This is the whole trick that lets the webhook be tested without a browser.
 */
async function sendWebhook(eventType, object, { signed = true } = {}) {
  const body = JSON.stringify({
    id: `evt_e2e_${Date.now()}`,
    object: "event",
    type: eventType,
    data: { object },
  });
  const t = Math.floor(Date.now() / 1000);
  const signature = signed
    ? `t=${t},v1=${createHmac("sha256", STRIPE_WEBHOOK_SECRET).update(`${t}.${body}`).digest("hex")}`
    : "t=1,v1=deadbeef";

  const res = await fetch(`${BASE}/api/stripe/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Stripe-Signature": signature },
    body,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

const TAG = "ZZE2E";
// Phone must differ per customer: GHL's upsert matches on phone as well as email, so a
// shared number merges "different" customers into one contact — which quietly turns the
// slot-contention test into a reuse test that always passes.
const customer = (n = "") => ({
  name: `${TAG}${n} Probe`,
  phone: `+6140000090${n || 0}`,
  email: `zze2e${n}.probe@example.com`,
});

const payload = (slot, n = "") => ({
  model: "GX4K", street: "12 Test St", suburb: "Richmond", stateAu: "VIC", postcode: "3121",
  slot, make: "Toyota", vmodel: "HiLux", year: "2022", retailer: "E2E", notes: "automated test",
  // FA-26 — the route refuses to open a payable session without it.
  termsAcceptedAt: new Date().toISOString(),
  ...customer(n),
});

/**
 * Asks GHL directly rather than /api/booking/slots — that route caches for 30 seconds,
 * so it still advertises a slot we took a moment ago. The route's cache is correct
 * behaviour for customers; it is just useless as an assertion.
 */
const slotIsFree = async (slot) => {
  const now = Date.now();
  const { data } = await ghl(
    `/calendars/${GHL_CALENDAR_ID}/free-slots?startDate=${now}&endDate=${now + 28 * 86400000}` +
    `&timezone=Australia/Melbourne`,
  );
  const target = new Date(slot).getTime();
  return Object.entries(data ?? {})
    .filter(([k]) => /^\d{4}-\d{2}-\d{2}$/.test(k))
    .some(([, v]) => (v?.slots ?? []).some((s) => new Date(s).getTime() === target));
};

const created = { appointments: new Set(), sessions: new Set() };
/** Event ids present before we started — real bookings must not be reported as our litter. */
const preexisting = new Set();

const listEvents = async () => {
  const now = Date.now();
  const { data } = await ghl(
    `/calendars/events?locationId=${GHL_LOCATION_ID}&calendarId=${GHL_CALENDAR_ID}` +
    `&startTime=${now}&endTime=${now + 28 * 86400000}`,
  );
  return data?.events ?? [];
};

// --- the suite ---------------------------------------------------------------

async function run() {
  console.log(`\nFB-01 booking flow — ${BASE}\n`);

  for (const e of await listEvents()) preexisting.add(e.id);
  if (preexisting.size) console.log(`  (${preexisting.size} existing booking(s) on the calendar — left alone)\n`);

  // 1 — availability
  console.log("Availability");
  const slots = await get("/api/booking/slots");
  eq("slots endpoint returns 200", slots.status, 200);
  const day = (slots.data?.days ?? []).at(-1);
  const slot = day?.slots?.at(-1);
  check("availability is non-empty", Boolean(slot), slot ?? "no bookable slot found");
  if (!slot) return;

  // 2 — the hold
  console.log("\nHold");
  const first = await post("/api/booking/create", payload(slot), "10.1.0.1");
  eq("create returns 200", first.status, 200);
  check("returns a client secret", Boolean(first.data?.clientSecret));
  const appointmentId = first.data?.appointmentId;
  const sessionId = first.data?.sessionId;
  check("returns an appointment id", Boolean(appointmentId), appointmentId ?? "");
  if (appointmentId) created.appointments.add(appointmentId);
  if (sessionId) created.sessions.add(sessionId);
  if (!appointmentId || !sessionId) return;

  const held = await ghl(`/calendars/events/appointments/${appointmentId}`);
  const heldAppt = held.data?.appointment ?? {};
  eq("GHL appointment is held (status new)", heldAppt.appointmentStatus, "new");
  check("title carries the hold tag", String(heldAppt.title ?? "").includes(`[hold ${sessionId}]`), heldAppt.title ?? "");
  check("the slot is no longer offered", !(await slotIsFree(slot)));

  // FA-36. The "We Accept" strip on /installation is a promise, and without a pin Stripe
  // offers whatever the dashboard has enabled — which is invisible from the codebase and
  // drifts silently. Asserted against the REAL session, not the request we sent.
  const stripeSession = (await stripeApi(`/checkout/sessions/${sessionId}`)).data;
  eq("checkout offers exactly the methods the artwork promises", JSON.stringify(stripeSession?.payment_method_types), JSON.stringify(["card"]));

  // 3 — retry reuses
  console.log("\nRetry safety");
  const retry = await post("/api/booking/create", payload(slot), "10.1.0.2");
  eq("retry returns 200", retry.status, 200);
  eq("retry reuses the appointment", retry.data?.appointmentId, appointmentId);
  eq("retry reuses the session", retry.data?.sessionId, sessionId);
  eq("retry is flagged as reused", retry.data?.reused, true);

  // 4/5 — rejections
  console.log("\nRejections");
  const other = await post("/api/booking/create", { ...payload(slot, "2") }, "10.1.0.3");
  // If this ever succeeds it means two customers hold one slot — capture the id so
  // cleanup can remove it rather than leaving a double booking behind.
  if (other.data?.appointmentId) created.appointments.add(other.data.appointmentId);
  eq("another customer on the same slot is refused", other.status, 409);
  eq("  with reason slot_taken", other.data?.reason, "slot_taken");

  const nt = await post("/api/booking/create", { ...payload(slot), stateAu: "NT", postcode: "0800" }, "10.1.0.4");
  eq("NT postcode is refused", nt.status, 422);

  const bad = await post("/api/booking/create", { ...payload(slot), email: "nope" }, "10.1.0.5");
  eq("invalid email is refused", bad.status, 400);

  // FA-26. Same shape as a real booking minus the acceptance, so a pass can only mean the
  // terms gate fired — the one thing standing between $250 and an unagreed contract.
  const noTerms = await post("/api/booking/create", { ...payload(slot, "7"), termsAcceptedAt: "" }, "10.1.0.7");
  eq("booking without accepted terms is refused", noTerms.status, 422);
  eq("  with reason terms_required", noTerms.data?.reason, "terms_required");
  if (noTerms.data?.appointmentId) created.appointments.add(noTerms.data.appointmentId);

  // FA-06. Sent with an OTHERWISE VALID body on a free slot, so a pass can only mean the
  // honeypot fired — not that some other rule caught it.
  const honeypot = await post("/api/booking/create", { ...payload(slot, "6"), botcheck: "http://spam.example" }, "10.1.0.6");
  eq("honeypot submission is refused", honeypot.status, 400);
  check(
    "  and creates nothing",
    !honeypot.data?.appointmentId && !honeypot.data?.clientSecret,
    honeypot.data?.appointmentId ?? "",
  );
  if (honeypot.data?.appointmentId) created.appointments.add(honeypot.data.appointmentId);

  let limited = 0;
  for (let i = 0; i < 7; i++) {
    const r = await post("/api/booking/create", { model: "" }, "10.9.9.99");
    if (r.status === 429) limited++;
  }
  check("rate limiter kicks in", limited > 0, `${limited} of 7 requests were throttled`);

  // 6 — status before payment
  console.log("\nStatus before payment");
  const before = await get(`/api/booking/status?session_id=${sessionId}`);
  eq("status returns 200", before.status, 200);
  eq("reports unpaid (session was never actually paid)", before.data?.paid, false);
  eq("reports unconfirmed", before.data?.confirmed, false);

  // 9 — signature rejection, before any state changes
  console.log("\nWebhook signature");
  const unsigned = await fetch(`${BASE}/api/stripe/webhook`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
  });
  eq("unsigned payload is rejected", unsigned.status, 400);
  const missigned = await sendWebhook("checkout.session.completed", { id: sessionId }, { signed: false });
  eq("bad signature is rejected", missigned.status, 400);

  // 7 — completion promotes the booking
  console.log("\nCompletion");
  const sessionObject = {
    id: sessionId,
    object: "checkout_session",
    amount_total: 25000,
    currency: "aud",
    payment_status: "paid",
    customer_details: { email: customer().email },
    metadata: {
      appointmentId, contactId: "", model: "GX4K", slot,
      address: "12 Test St, Richmond, VIC, 3121",
      name: customer().name, email: customer().email, phone: customer().phone,
      vehicle: "Toyota HiLux 2022",
    },
  };
  const completed = await sendWebhook("checkout.session.completed", sessionObject);
  eq("webhook accepts a signed completion", completed.status, 200);

  const promoted = (await ghl(`/calendars/events/appointments/${appointmentId}`)).data?.appointment ?? {};
  eq("appointment is promoted to confirmed", promoted.appointmentStatus, "confirmed");
  check("hold tag is stripped from the title", !String(promoted.title ?? "").includes("[hold"), promoted.title ?? "");

  // 8 — replay
  console.log("\nIdempotency");
  const replay = await sendWebhook("checkout.session.completed", sessionObject);
  eq("replaying the same event still returns 200", replay.status, 200);
  const afterReplay = (await ghl(`/calendars/events/appointments/${appointmentId}`)).data?.appointment ?? {};
  eq("replay leaves the status unchanged", afterReplay.appointmentStatus, "confirmed");
  eq("replay leaves the title unchanged", afterReplay.title, promoted.title);

  // 11 — the soft-delete guard
  console.log("\nSoft-delete guard");
  await ghl(`/calendars/events/${appointmentId}`, { method: "DELETE" });
  const ghost = await sendWebhook("checkout.session.completed", sessionObject);
  eq("completion for a deleted appointment does not crash", ghost.status, 200);
  check("  (check the server log for 'PAID BUT THE HOLD IS GONE')", true);

  // 10 — expiry releases the hold
  console.log("\nExpiry");
  const second = await post("/api/booking/create", payload(slot, "3"), "10.2.0.1");
  const expiringId = second.data?.appointmentId;
  const expiringSession = second.data?.sessionId;
  check("a fresh hold was taken on the freed slot", Boolean(expiringId), expiringId ?? String(second.status));
  if (expiringId) {
    created.appointments.add(expiringId);
    created.sessions.add(expiringSession);
    const expired = await sendWebhook("checkout.session.expired", {
      id: expiringSession, object: "checkout_session", metadata: { appointmentId: expiringId },
    });
    eq("webhook accepts a signed expiry", expired.status, 200);
    const gone = (await ghl(`/calendars/events/appointments/${expiringId}`)).data?.appointment ?? {};
    // GHL soft-deletes: the record still resolves, carrying deleted: true.
    eq("the hold is deleted", gone.deleted, true);
  }

  // 13 — refunds (FA-32)
  //
  // The one part of this suite that does NOT rely purely on synthetic payloads, and
  // deliberately so. The fix rests on an assumption about Stripe itself — that a Charge
  // inherits its PaymentIntent's metadata — and a hand-built Charge object would assert
  // that assumption into existence rather than test it. So a real test-mode PaymentIntent
  // is created and confirmed with pm_card_visa, refunded through the API, and the REAL
  // refunded Charge is what gets signed and posted to the webhook.
  console.log("\nRefunds");

  const fresh = (await get("/api/booking/slots")).data?.days ?? [];
  const spare = fresh.flatMap((d) => d.slots ?? []).filter((s) => s !== slot);
  if (spare.length < 2) {
    check("two spare slots are available for the refund tests", false, `${spare.length} found`);
  } else {
    const [slotA, slotB] = [spare.at(-1), spare.at(-2)];

    // --- the inheritance assumption, tested against real Stripe -----------------
    const rHold = await post("/api/booking/create", payload(slotA, "4"), "10.3.0.1");
    const rid = rHold.data?.appointmentId;
    check("hold taken for the refund test", Boolean(rid), rid ?? String(rHold.status));
    if (rid) created.appointments.add(rid);
    if (rHold.data?.sessionId) created.sessions.add(rHold.data.sessionId);

    const { charge } = await paidCharge(rid ?? "");
    check("test-mode charge was created", Boolean(charge?.id), charge?.id ?? "none");
    // THE load-bearing assertion. If Stripe ever stops copying PaymentIntent metadata
    // onto the Charge, the whole FA-32 fix silently reverts to a no-op and this is the
    // only thing that would say so.
    eq("Charge INHERITS PaymentIntent metadata (FA-32)", charge?.metadata?.appointmentId, rid);

    // Promote it, so there is a confirmed booking for the refund to cancel.
    await sendWebhook("checkout.session.completed", {
      ...sessionObject, id: `cs_e2e_refund_${Date.now()}`, metadata: { ...sessionObject.metadata, appointmentId: rid, slot: slotA },
    });

    // --- a partial refund must NOT cancel the job ------------------------------
    const partial = await sendWebhook("charge.refunded", {
      ...charge, object: "charge", amount: 25000, amount_refunded: 5000,
    });
    eq("partial refund is accepted", partial.status, 200);
    const afterPartial = (await ghl(`/calendars/events/appointments/${rid}`)).data?.appointment ?? {};
    eq("  and leaves the booking confirmed", afterPartial.appointmentStatus, "confirmed");

    // --- a full refund cancels it, using the REAL refunded charge --------------
    await stripeApi("/refunds", { method: "POST", form: new URLSearchParams({ charge: charge.id }).toString() });
    const refunded = (await stripeApi(`/charges/${charge.id}`)).data;
    eq("Stripe reports the charge fully refunded", refunded?.amount_refunded, refunded?.amount);

    const full = await sendWebhook("charge.refunded", { ...refunded, object: "charge" });
    eq("full refund is accepted", full.status, 200);
    const afterFull = (await ghl(`/calendars/events/appointments/${rid}`)).data?.appointment ?? {};
    eq("  and CANCELS the booking", afterFull.appointmentStatus, "cancelled");
    // Cancelled, never deleted — installation-terms.ts promises refunds in several
    // scenarios, so the record has to survive for the audit trail.
    check("  and keeps the record (not deleted)", afterFull.deleted !== true, `deleted: ${afterFull.deleted}`);
    check("  and frees the slot", await slotIsFree(slotA));

    // --- replaying a refund is harmless ---------------------------------------
    const refundReplay = await sendWebhook("charge.refunded", { ...refunded, object: "charge" });
    eq("replaying the refund still returns 200", refundReplay.status, 200);

    // --- the pre-fix fallback path --------------------------------------------
    // Sessions created BEFORE payment_intent_data landed carry no metadata on the
    // Charge and never will, so the handler retrieves the PaymentIntent instead. This
    // strips the inherited copy to reproduce exactly that shape.
    const bHold = await post("/api/booking/create", payload(slotB, "5"), "10.3.0.2");
    const bid = bHold.data?.appointmentId;
    check("hold taken for the fallback test", Boolean(bid), bid ?? String(bHold.status));
    if (bid) created.appointments.add(bid);
    if (bHold.data?.sessionId) created.sessions.add(bHold.data.sessionId);

    if (bid) {
      const b = await paidCharge(bid);
      await sendWebhook("checkout.session.completed", {
        ...sessionObject, id: `cs_e2e_fallback_${Date.now()}`, metadata: { ...sessionObject.metadata, appointmentId: bid, slot: slotB },
      });
      await stripeApi("/refunds", { method: "POST", form: new URLSearchParams({ charge: b.charge.id }).toString() });
      const bRefunded = (await stripeApi(`/charges/${b.charge.id}`)).data;

      const viaFallback = await sendWebhook("charge.refunded", { ...bRefunded, object: "charge", metadata: {} });
      eq("refund with no Charge metadata is accepted", viaFallback.status, 200);
      const afterFallback = (await ghl(`/calendars/events/appointments/${bid}`)).data?.appointment ?? {};
      eq("  and still cancels, via the PaymentIntent fallback", afterFallback.appointmentStatus, "cancelled");
    }

    // --- nothing resolvable at all --------------------------------------------
    const orphan = await sendWebhook("charge.refunded", {
      id: "ch_e2e_orphan", object: "charge", amount: 25000, amount_refunded: 25000, metadata: {},
    });
    eq("a refund we cannot trace does not crash", orphan.status, 200);
    check("  (check the server log for 'REFUNDED BUT NO appointmentId')", true);
  }

  // 14 — the stale-hold sweep (piggybacked on /api/booking/slots)
  //
  // Uses a REAL expired Stripe session, not a synthetic one: the sweep's whole job is to
  // ask Stripe what actually happened, so faking the answer would test nothing. The hold is
  // taken normally, its session is expired through the API, and then /api/booking/slots is
  // polled — the same request a customer makes when they open step 3.
  console.log("\nStale-hold sweep");
  {
    const fresh2 = (await get("/api/booking/slots")).data?.days ?? [];
    const spare2 = fresh2.flatMap((d) => d.slots ?? []).filter((s) => s !== slot);
    const target = spare2.at(-1);
    check("a spare slot is available for the sweep test", Boolean(target), target ?? "none");

    if (target) {
      const abandoned = await post("/api/booking/create", payload(target, "8"), "10.4.0.1");
      const staleId = abandoned.data?.appointmentId;
      const staleSession = abandoned.data?.sessionId;
      check("hold taken, then abandoned", Boolean(staleId), staleId ?? String(abandoned.status));
      if (staleId) created.appointments.add(staleId);

      if (staleId && staleSession) {
        // Expire it at Stripe WITHOUT sending the webhook — this is precisely the state a
        // lost checkout.session.expired leaves behind, and what the sweep exists to catch.
        await stripeApi(`/checkout/sessions/${staleSession}/expire`, { method: "POST" });
        const expired = (await stripeApi(`/checkout/sessions/${staleSession}`)).data;
        eq("Stripe reports the session expired", expired?.status, "expired");

        const stillHeld = (await ghl(`/calendars/events/appointments/${staleId}`)).data?.appointment ?? {};
        eq("  and the hold is still on the calendar", stillHeld.appointmentStatus, "new");

        // The sweep self-throttles, so give it a moment and drive the customer-facing route.
        await new Promise((r) => setTimeout(r, 1200));
        const afterSweep = await get("/api/booking/slots");
        eq("availability still returns 200 with the sweep in front of it", afterSweep.status, 200);

        const gone = (await ghl(`/calendars/events/appointments/${staleId}`)).data?.appointment ?? {};
        // GHL soft-deletes, so a released hold still resolves, carrying deleted: true.
        check("the abandoned hold was reclaimed", gone.deleted === true, `deleted: ${gone.deleted}`);
        check("  and the slot is bookable again", await slotIsFree(target));
      }
    }
  }

  // 12 — email
  console.log("\nEmail");
  const redirect = process.env.BOOKING_EMAIL_REDIRECT_TO?.trim();
  check(
    "BOOKING_EMAIL_REDIRECT_TO is set",
    Boolean(redirect),
    redirect || "unset — the confirmation email went to the fake @example.com address and cannot have arrived",
  );
  console.log(
    "    Note: the send result is only visible in the dev-server log. Look for\n" +
    "    '[booking-confirmation] REDIRECTED' and either no error or the Resend rejection.",
  );
}

// --- cleanup -----------------------------------------------------------------

async function cleanup() {
  console.log("\nCleanup");
  for (const id of created.appointments) {
    const { status } = await ghl(`/calendars/events/${id}`, { method: "DELETE" });
    // 400 here just means a case in the suite already removed it.
    console.log(`  appointment ${id} → ${status === 200 ? "deleted" : "already gone"}`);
  }
  for (const id of created.sessions) {
    if (id) await stripeApi(`/checkout/sessions/${id}/expire`, { method: "POST" });
  }
  // Test CONTACTS are deliberately left in place.
  //
  // GHL only ever soft-deletes an appointment — it stays queryable with deleted: true.
  // Delete the contact it points at and the appointment is orphaned: GHL's Appointments
  // list surfaces it as status "Invalid", and it can no longer be removed through the UI
  // or the API ("the event id is invalid or it has already been deleted"). The result is
  // a permanent ghost row on a production calendar.
  //
  // So the order that seems tidy is the one that causes damage. Contacts are harmless
  // CRM records; delete them by hand in GHL only if no appointment ever referenced them.
  const seen = new Set();
  for (const q of [TAG, `${TAG}2`, `${TAG}3`]) {
    const { data } = await ghl(`/contacts/?locationId=${GHL_LOCATION_ID}&query=${q}&limit=20`, { version: "2021-07-28" });
    for (const c of data?.contacts ?? []) seen.add(`${c.id}  ${c.firstName ?? ""} ${c.lastName ?? ""}`.trim());
  }
  if (seen.size) {
    console.log(`  ${seen.size} test contact(s) left in place (deleting them would orphan their appointments):`);
    for (const c of seen) console.log(`     ${c}`);
  }
  const strays = (await listEvents()).filter((e) => !preexisting.has(e.id));
  if (strays.length === 0) {
    console.log("  no residue — the calendar is exactly as we found it");
  } else {
    console.log(`  ⚠️  ${strays.length} event(s) this run created are still present:`);
    for (const e of strays) console.log(`     ${e.id}  ${e.appointmentStatus}  ${e.title}`);
  }
}

try {
  await run();
} catch (err) {
  console.error("\nSUITE CRASHED:", err);
  failures++;
} finally {
  await cleanup();
}

console.log(`\n${results.length - failures}/${results.length} checks passed`);
if (failures) {
  console.log("\nFailed:");
  for (const r of results.filter((r) => !r.pass)) console.log(`  ✗ ${r.name}  ${r.detail}`);
}
console.log(
  "\nNot covered here — a Checkout Session cannot be paid via the API, so card entry,\n" +
  "3DS and the step-6 poll need the manual browser pass in\n" +
  "docs/fb-01-booking-payment-flow.md.\n",
);
process.exit(failures ? 1 : 0);
