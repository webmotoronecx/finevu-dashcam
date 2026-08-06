"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile (FB-07). The honeypot in /api/contact only catches naive bots —
// a scripted POST that omits the botcheck field walks straight past it. This is the
// widget half; the token is verified server-side in app/api/contact/route.ts.
//
// NEXT_PUBLIC_ is correct here: the SITE key is designed to be public and is inlined
// into the client bundle at build time. The SECRET key is server-only and must never
// carry this prefix.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Whether a site key is configured. Forms use this to decide if a token is required. */
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// One shared promise so several forms on a page can't each append the script.
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile script failed to load"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Renders the Turnstile widget and hands the token back via `onToken`.
 *
 * Tokens are SINGLE-USE and expire after a few minutes, so a form that fails after
 * the server has already verified must reset the widget before the customer retries —
 * bump `resetKey` to do that. Without it the retry fails verification every time.
 */
export function Turnstile({ onToken, resetKey = 0 }: { onToken: (token: string) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Held in a ref so a parent re-render can't tear down and re-render the widget,
  // which would drop a token the customer has already solved for.
  const cb = useRef(onToken);
  // Assigned in an effect rather than during render — refs must not be written while
  // rendering. Runs after every render, so the ref always holds the latest callback.
  useEffect(() => {
    cb.current = onToken;
  });

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => cb.current(token),
          // Both clear the token so the form can't submit a stale one.
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      })
      .catch(() => {
        // Script blocked or offline. The token stays empty and the form reports the
        // failure on submit rather than silently posting something the server rejects.
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey === 0) return;
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      cb.current("");
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="mt-1" />;
}
