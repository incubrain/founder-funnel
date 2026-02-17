#!/usr/bin/env bash
# Agent navigability smoke test.
# Starts a dev server, opens the app in agent-browser, and validates
# that key landmarks and interactive elements are present.
#
# Usage:
#   bash scripts/agent-smoke-test.sh [port] [app]
#   bash scripts/agent-smoke-test.sh 3333 examples/foundry
set -euo pipefail

PORT="${1:-3333}"
APP_DIR="${2:-examples/foundry}"
URL="http://localhost:${PORT}"
PASS=0
FAIL=0
SERVER_PID=""

# --- Helpers ---

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    echo "[smoke] Stopping dev server (pid $SERVER_PID)"
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  agent-browser close 2>/dev/null || true
}
trap cleanup EXIT

check() {
  local description="$1"
  local pattern="$2"
  local snapshot="$3"

  if echo "$snapshot" | grep -qi "$pattern"; then
    echo "  ✓ $description"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $description (expected: $pattern)"
    FAIL=$((FAIL + 1))
  fi
}

# --- Preflight ---

if ! command -v agent-browser &>/dev/null; then
  echo "[smoke] agent-browser not found. Install it:"
  echo "  npm install -g agent-browser"
  echo "  # or: brew install agent-browser"
  exit 1
fi

# --- Start dev server ---

echo "[smoke] Starting dev server on port ${PORT}..."
npx nuxt dev "$APP_DIR" --port "$PORT" &>/dev/null &
SERVER_PID=$!

echo "[smoke] Waiting for server at ${URL}..."
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -q "200"; then
    echo "[smoke] Server ready (${i}s)"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "[smoke] Server failed to start within 60s"
    exit 1
  fi
  sleep 1
done

# --- Open and snapshot ---

echo "[smoke] Opening ${URL} in agent-browser..."
agent-browser open "$URL"
sleep 2

echo ""
echo "=== Accessibility Tree Audit ==="

SNAPSHOT=$(agent-browser snapshot 2>/dev/null || echo "")

if [ -z "$SNAPSHOT" ]; then
  echo "  ✗ Failed to get accessibility snapshot"
  FAIL=$((FAIL + 1))
else
  # Landmarks
  echo ""
  echo "Landmarks:"
  check "banner landmark present" "banner" "$SNAPSHOT"
  check "main landmark present" "main" "$SNAPSHOT"
  check "contentinfo landmark present" "contentinfo" "$SNAPSHOT"
  check "region landmarks present" "region" "$SNAPSHOT"

  # Heading hierarchy
  echo ""
  echo "Headings:"
  check "h1 heading present" "heading.*level.*1\|h1" "$SNAPSHOT"
  check "h2 headings present" "heading.*level.*2\|h2" "$SNAPSHOT"
fi

echo ""
echo "=== Interactive Elements Audit ==="

INTERACTIVE=$(agent-browser snapshot -i 2>/dev/null || echo "")

if [ -z "$INTERACTIVE" ]; then
  echo "  ✗ Failed to get interactive snapshot"
  FAIL=$((FAIL + 1))
else
  check "links present" "link" "$INTERACTIVE"
  check "buttons present" "button" "$INTERACTIVE"
fi

# --- Signal capture form check ---

echo ""
echo "=== Signal Capture Forms ==="

FORM_SNAPSHOT=$(agent-browser find role form 2>/dev/null || echo "")
if [ -n "$FORM_SNAPSHOT" ] && ! echo "$FORM_SNAPSHOT" | grep -qi "no.*found\|error"; then
  echo "  ✓ Signal capture form(s) discoverable"
  PASS=$((PASS + 1))
else
  echo "  ⚠ No forms found (may be expected for some pages)"
fi

# --- Results ---

echo ""
echo "=== Results ==="
TOTAL=$((PASS + FAIL))
echo "  ${PASS}/${TOTAL} checks passed"

if [ "$FAIL" -gt 0 ]; then
  echo "  ${FAIL} checks failed"
  exit 1
else
  echo "  All checks passed"
  exit 0
fi
