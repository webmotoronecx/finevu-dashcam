"use client";

import { useCallback, useEffect, useRef } from "react";

/* Behaviour shared by the four Resend-backed forms — /contact, /register,
   /warranty-claim and /become-a-retailer.

   These three fixes (FA-10, FA-44, FA-45) landed on /become-a-retailer first and were then
   rolled across the others. They live here rather than being pasted four times because the
   last time a rule was duplicated per-form it drifted: the upload caps ended up different in
   three files, all of them wrong against the platform limit. One copy, one place to change.

   The booking wizard (app/installation) is deliberately NOT a consumer. It is a five-step
   flow with its own Stripe-driven completion path, not a submit-and-redirect form, so the
   redirect-stall guard below has nothing to guard. */

/**
 * Whether a string could be a phone number at all.
 *
 * Deliberately permissive: it rejects junk, not non-Australian formats. AU mobile and
 * landline numbers pass with or without +61, spaces, dashes or brackets, and so do overseas
 * numbers — /become-a-retailer invites online retailers and /contact is a general enquiry
 * form, so an AU-only rule would reject valid submissions.
 *
 * Replaces `!value.trim()`, which accepted a single character on the field a wholesale
 * account or a warranty claim is followed up on (FA-45).
 */
export const isPhone = (v: string) => (v.match(/\d/g) ?? []).length >= 8;

/** Field keys paired with the DOM ids their inputs carry, in visual order. */
export type FieldFocusOrder = readonly (readonly [string, string])[];

/**
 * Move focus to the first invalid field after a failed submit (FA-44).
 *
 * Rendering the per-field messages is only half the job: every form already links its
 * message to its input with aria-describedby, but focus stayed on the submit button, so
 * nothing read it out. Moving focus is what makes those links audible — a keyboard or
 * screen-reader user was otherwise left with up to eleven fields and no route to the problem.
 *
 * `order` MUST match the visual field order, or focus jumps around the form.
 */
export function focusFirstInvalid(order: FieldFocusOrder, invalid: Record<string, boolean>): void {
  const first = order.find(([key]) => invalid[key]);
  if (first) document.getElementById(first[1])?.focus();
}

/** How long to wait for a success redirect before assuming it has stalled. */
export const REDIRECT_STALL_MS = 8000;

/**
 * What to show if the redirect never happens.
 *
 * MUST NOT invite a retry. By the time this renders the submission has already been
 * delivered — the guard is armed only on `res.ok` — so "please try again" would mail
 * support a duplicate of a claim or application it already has.
 *
 * `noun` is what the customer sent: "application", "registration", "claim", "message".
 */
export const stallMessage = (noun: string) =>
  `Your ${noun} was sent — this page just didn’t move on. There’s no need to send it again; we’ll be in touch.`;

/**
 * Guards against a success redirect that never completes (FA-10).
 *
 * All four forms deliberately hold their button in the sending state through `router.push`
 * so it can't be double-submitted. If the navigation stalls, that state is permanent and the
 * button reads "Sending…" forever with no way back.
 *
 * Returns an `arm` function to call right after `router.push`. A successful navigation
 * unmounts the form and the cleanup clears the timer, so the callback can only fire on a
 * genuine stall.
 */
export function useRedirectStallGuard(): (onStall: () => void) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return useCallback((onStall: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onStall, REDIRECT_STALL_MS);
  }, []);
}
