#!/usr/bin/env bash
# Install or update external Claude Code skills from the manifest.
# Run from project root: bash scripts/install-skills.sh
set -euo pipefail

# Log file to track update timestamps
UPDATE_LOG=".agents/skill-updates.log"
TWENTY_FOUR_HOURS=$((24 * 60 * 60))

# Create log file if it doesn't exist
mkdir -p "$(dirname "$UPDATE_LOG")"
touch "$UPDATE_LOG"

# Check if skill was updated in the past 24 hours
is_recently_updated() {
  local skill_name="$1"
  local current_time=$(date +%s)

  if grep -q "^$skill_name:" "$UPDATE_LOG" 2>/dev/null; then
    local last_update=$(grep "^$skill_name:" "$UPDATE_LOG" | tail -1 | cut -d':' -f2)
    local time_diff=$((current_time - last_update))

    if [ "$time_diff" -lt "$TWENTY_FOUR_HOURS" ]; then
      local hours_ago=$((time_diff / 3600))
      echo "  → Already updated ${hours_ago}h ago, skipping"
      return 0
    fi
  fi
  return 1
}

# Log successful update
log_update() {
  local skill_name="$1"
  local current_time=$(date +%s)
  echo "$skill_name:$current_time" >> "$UPDATE_LOG"
}

# Define all skills as repo:skill pairs
declare -a SKILLS=(
  # Development
  "https://github.com/nuxt-modules/mcp-toolkit:manage-mcp"
  "https://github.com/obra/superpowers:brainstorming"
  "https://github.com/nuxt/ui:nuxt-ui"
  "https://github.com/antfu/skills:nuxt"
  "https://github.com/vueuse/skills:vueuse-functions"
  "https://github.com/antfu/skills:vue-best-practices"
  "https://github.com/antfu/skills:pinia"
  "https://github.com/nuxt-content/nuxt-studio:nuxt-content"

  # Logging & Observability
  "https://github.com/HugoRCD/evlog:review-logging-patterns"
  "https://github.com/HugoRCD/evlog:create-evlog-adapter"
  "https://github.com/HugoRCD/evlog:create-evlog-enricher"

  # Design & UX
  "https://github.com/anthropics/skills:frontend-design"
  "https://github.com/anthropics/skills:theme-factory"
  "https://github.com/vercel-labs/agent-skills:web-design-guidelines"

  # Marketing & Content
  "https://github.com/coreyhaines31/marketingskills:copywriting"
  "https://github.com/coreyhaines31/marketingskills:marketing-psychology"

  # Testing & Debugging
  "https://github.com/vuejs-ai/skills:vue-testing-best-practices"
  "https://github.com/obra/superpowers:systematic-debugging"
  "https://github.com/antfu/skills:vitest"
  "https://github.com/vercel-labs/agent-browser:agent-browser"

  # Meta
  "https://github.com/anthropics/skills:skill-creator"
)

echo "Checking installed skills..."
INSTALLED_SKILLS=$(npx skills list --agent claude-code 2>/dev/null || echo "")

echo "Processing ${#SKILLS[@]} skills..."
echo ""

for skill_entry in "${SKILLS[@]}"; do
  # Split on last colon to separate repo URL from skill name
  repo="${skill_entry%:*}"
  skill_name="${skill_entry##*:}"

  # Check if skill is already installed
  if echo "$INSTALLED_SKILLS" | grep -q "$skill_name"; then
    # Skip update if done in past 24 hours
    if is_recently_updated "$skill_name"; then
      continue
    fi

    echo "⟳ Updating: $skill_name"
    if npx skills update "$skill_name" --yes --agent claude-code 2>/dev/null; then
      log_update "$skill_name"
    else
      echo "  → Update failed, reinstalling..."
      if npx skills add "$repo" --skill "$skill_name" --yes --agent claude-code; then
        log_update "$skill_name"
      fi
    fi
  else
    echo "⊕ Installing: $skill_name"
    if npx skills add "$repo" --skill "$skill_name" --yes --agent claude-code; then
      log_update "$skill_name"
    fi
  fi
done

echo ""
echo "✓ Done. Skills installed to .agents/skills/ and symlinked to .claude/skills/"
