#!/usr/bin/env bash
# Dev server + Stripe webhook forwarder, for walking the /installation booking flow by
# hand. Run with:  npm run dev:booking
#
# Exists because the manual pass needs BOTH processes and it is easy to forget the second
# one: without `stripe listen`, a booking is created and paid but never promoted — the
# appointment sits as `new` with its hold tag forever and the slot stays blocked. That
# failure looks exactly like a bug in the code, so this makes it hard to get wrong.
set -uo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
FORWARD="localhost:${PORT}/api/stripe/webhook"

if ! command -v stripe >/dev/null 2>&1; then
  echo "✗ stripe CLI not found. Install it, or run 'npm run dev' and accept that"
  echo "  payments will not promote the booking (no webhook can reach localhost)."
  exit 1
fi

# next dev silently falls back to :3001 if :3000 is taken, which would leave the
# forwarder pointing at nothing.
if lsof -i ":${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "✗ port ${PORT} is already in use — stop the other dev server first."
  echo "  (otherwise Next falls back to another port and the webhook forwarder"
  echo "   would be pointing at the wrong one)"
  exit 1
fi

if ! grep -qE '^BOOKING_EMAIL_REDIRECT_TO=.+' .env.local 2>/dev/null; then
  echo "⚠ BOOKING_EMAIL_REDIRECT_TO is not set in .env.local — the confirmation email"
  echo "  will be addressed to the customer and cannot arrive. Set it to read the email."
  echo
fi

LISTEN_LOG="$(mktemp -t finevu-stripe-listen)"
stripe listen --forward-to "$FORWARD" >"$LISTEN_LOG" 2>&1 &
LISTEN_PID=$!

cleanup() {
  echo
  echo "Stopping webhook forwarder…"
  kill "$LISTEN_PID" 2>/dev/null
  wait "$LISTEN_PID" 2>/dev/null
  rm -f "$LISTEN_LOG"
}
trap cleanup EXIT INT TERM

# Give the CLI a moment to authenticate and print its signing secret.
for _ in $(seq 1 20); do grep -q "whsec_" "$LISTEN_LOG" && break; sleep 0.5; done

CLI_SECRET="$(grep -o 'whsec_[A-Za-z0-9]*' "$LISTEN_LOG" | head -1)"
ENV_SECRET="$(grep -E '^STRIPE_WEBHOOK_SECRET=' .env.local 2>/dev/null | cut -d= -f2- | tr -d '"'"'"' ')"

if [ -z "$CLI_SECRET" ]; then
  echo "⚠ stripe listen did not report a signing secret — check 'stripe login'."
  sed -n '1,5p' "$LISTEN_LOG"
elif [ "$CLI_SECRET" != "$ENV_SECRET" ]; then
  # Every webhook would 400 on signature verification, and the booking would never
  # be promoted. Worth stopping for — it is invisible otherwise.
  echo "✗ STRIPE_WEBHOOK_SECRET in .env.local does not match the one stripe listen is"
  echo "  signing with. Every webhook will be rejected. Update .env.local to:"
  echo "  STRIPE_WEBHOOK_SECRET=${CLI_SECRET}"
  exit 1
else
  echo "✓ webhook forwarder running, signing secret matches .env.local"
fi

cat <<INFO

  Walk the wizard at  http://localhost:${PORT}/installation

  Test cards          4242 4242 4242 4242   succeeds
                      4000 0027 6000 3184   3D Secure — must complete INSIDE the iframe
                      4000 0000 0000 0002   declined
                      (any future expiry, any CVC)

  Afterwards          npm run booking:clean    removes the test bookings it left behind

INFO

npm run dev
