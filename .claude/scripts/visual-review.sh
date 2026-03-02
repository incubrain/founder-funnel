#!/bin/bash
# Visual review wrapper for agent-browser
# Usage: bash .claude/scripts/visual-review.sh <url> [selector]

URL="${1:?Usage: visual-review.sh <url> [selector]}"
SELECTOR="${2:-}"
SESSION="visual-$(date +%s)"

echo "Starting visual review: $URL (session: $SESSION)"

if [ -n "$SELECTOR" ]; then
  agent-browser --session "$SESSION" open "$URL" \
    && agent-browser --session "$SESSION" wait --load networkidle \
    && agent-browser --session "$SESSION" snapshot -i -s "$SELECTOR" \
    && agent-browser --session "$SESSION" screenshot --annotate
else
  agent-browser --session "$SESSION" open "$URL" \
    && agent-browser --session "$SESSION" wait --load networkidle \
    && agent-browser --session "$SESSION" screenshot --annotate
fi

echo "Session: $SESSION"
echo "Close when done: agent-browser --session $SESSION close"
