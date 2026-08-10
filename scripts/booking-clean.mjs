#!/usr/bin/env node
// Lists — and optionally removes — bookings on the live GHL calendar.
//
//   npm run booking:clean          show what is there, change nothing
//   npm run booking:clean -- --yes delete them
//
// Manual testing leaves real appointments behind: reaching step 5 takes a hold whether or
// not you go on to pay, and without `stripe listen` running nothing ever releases it. Those
// holds occupy slots that real customers would otherwise be offered, so they have to go.
//
// Deliberately prints before it deletes and needs --yes to act, because this talks to the
// production calendar and cannot tell a test booking from a real one on its own.

import { readFileSync } from "node:fs";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}

const { GHL_API_KEY, GHL_LOCATION_ID, GHL_CALENDAR_ID } = process.env;
for (const [k, v] of Object.entries({ GHL_API_KEY, GHL_LOCATION_ID, GHL_CALENDAR_ID })) {
  if (!v) { console.error(`${k} is not set.`); process.exit(1); }
}

const apply = process.argv.includes("--yes");

const ghl = async (path, { method = "GET", version = "2021-04-15" } = {}) => {
  const res = await fetch(`https://services.leadconnectorhq.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${GHL_API_KEY}`, Version: version, Accept: "application/json" },
  });
  return { status: res.status, data: await res.json().catch(() => null) };
};

const now = Date.now();
const { data } = await ghl(
  `/calendars/events?locationId=${GHL_LOCATION_ID}&calendarId=${GHL_CALENDAR_ID}` +
  `&startTime=${now}&endTime=${now + 28 * 86400000}`,
);
const events = (data?.events ?? []).filter((e) => !e.deleted);

if (events.length === 0) {
  console.log("\nNo bookings on the calendar in the next 28 days.\n");
  process.exit(0);
}

console.log(`\n${events.length} booking(s) on the calendar:\n`);
for (const e of events) {
  // A hold tag means it never got paid for — those are always safe to remove.
  const held = String(e.title ?? "").includes("[hold ");
  console.log(`  ${e.startTime}  ${(e.appointmentStatus ?? "?").padEnd(9)} ${held ? "UNPAID HOLD" : "           "}  ${e.title}`);
  console.log(`  ${" ".repeat(25)} ${e.id}`);
}

if (!apply) {
  console.log("\nNothing deleted. Re-run with --yes to remove them:\n");
  console.log("  npm run booking:clean -- --yes\n");
  console.log("⚠ This is the production calendar. Check the list above for real customer");
  console.log("  bookings before deleting — this cannot tell them apart from test ones.\n");
  process.exit(0);
}

console.log("");
for (const e of events) {
  const { status } = await ghl(`/calendars/events/${e.id}`, { method: "DELETE" });
  console.log(`  ${e.id} → ${status === 200 ? "deleted" : `failed (${status})`}`);
}

const left = ((await ghl(
  `/calendars/events?locationId=${GHL_LOCATION_ID}&calendarId=${GHL_CALENDAR_ID}` +
  `&startTime=${now}&endTime=${now + 28 * 86400000}`,
)).data?.events ?? []).filter((e) => !e.deleted).length;
console.log(`\n${left} booking(s) remaining.\n`);
