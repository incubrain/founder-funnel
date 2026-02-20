#!/usr/bin/env bash
# Install or update external Claude Code skills from the manifest.
# Run from project root: bash scripts/install-skills.sh
set -euo pipefail

# Define all skills as repo:skill pairs
declare -a SKILLS=(
  # Development & Testing
  "https://github.com/nuxt-modules/mcp-toolkit:manage-mcp"
  "https://github.com/antfu/skills:vitest"
  "https://github.com/nuxt/ui:nuxt-ui"
  "https://github.com/antfu/skills:nuxt"
  "https://github.com/vueuse/skills:vueuse-functions"
  "https://github.com/antfu/skills:vue-best-practices"
  "https://github.com/antfu/skills:pinia"
  "https://github.com/vuejs-ai/skills:vue-testing-best-practices"
  "https://github.com/nuxt-content/nuxt-studio:nuxt-content"
  "https://github.com/vercel-labs/agent-browser:agent-browser"
  "https://github.com/vercel-labs/agent-skills:web-design-guidelines"

  # Design & UX
  "https://github.com/anthropics/skills:frontend-design"
  "https://github.com/anthropics/skills:theme-factory"

  # Marketing & Content
  "https://github.com/coreyhaines31/marketingskills:copywriting"
  "https://github.com/coreyhaines31/marketingskills:marketing-psychology"

  # Strategy & Debugging
  "https://github.com/obra/superpowers:brainstorming"
  "https://github.com/obra/superpowers:systematic-debugging"
)

echo "Checking installed skills..."
INSTALLED_SKILLS=$(npx skills list --agent claude-code 2>/dev/null || echo "")

echo "Processing ${#SKILLS[@]} skills..."
echo ""

for skill_entry in "${SKILLS[@]}"; do
  # Split repo:skill format
  IFS=':' read -r repo skill_name <<< "$skill_entry"

  # Check if skill is already installed
  if echo "$INSTALLED_SKILLS" | grep -q "$skill_name"; then
    echo "⟳ Updating: $skill_name"
    npx skills update "$skill_name" --yes --agent claude-code 2>/dev/null || {
      echo "  → Update failed, reinstalling..."
      npx skills add "$repo" --skill "$skill_name" --yes --agent claude-code
    }
  else
    echo "⊕ Installing: $skill_name"
    npx skills add "$repo" --skill "$skill_name" --yes --agent claude-code
  fi
done

echo ""
echo "✓ Done. Skills installed to .agents/skills/ and symlinked to .claude/skills/"
