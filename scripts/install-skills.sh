#!/usr/bin/env bash
# Install external Claude Code skills from the manifest.
# Run from project root: bash scripts/install-skills.sh
set -euo pipefail

echo "Installing external agent skills..."

npx skills add https://github.com/nuxt-modules/mcp-toolkit --skill manage-mcp --yes --agent claude-code
npx skills add https://github.com/antfu/skills --skill vitest --yes --agent claude-code
npx skills add https://github.com/nuxt/ui --skill nuxt-ui --yes --agent claude-code
npx skills add https://github.com/antfu/skills --skill nuxt --yes --agent claude-code
npx skills add https://github.com/vueuse/skills --skill vueuse-functions --yes --agent claude-code
npx skills add https://github.com/antfu/skills --skill vue-best-practices --yes --agent claude-code
npx skills add https://github.com/antfu/skills --skill pinia --yes --agent claude-code
npx skills add https://github.com/vuejs-ai/skills --skill vue-testing-best-practices --yes --agent claude-code
npx skills add https://github.com/nuxt-content/nuxt-studio --skill nuxt-content --yes --agent claude-code
npx skills add https://github.com/HugoRCD/evlog --skill review-logging-patterns --skill create-evlog-adapter --skill create-evlog-enricher --yes --agent claude-code
npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser --yes --agent claude-code
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines --yes --agent claude-code
npx skills add https://github.com/anthropics/skills --skill skill-creator --yes --agent claude-code

echo "Done. Skills installed to .agents/skills/ and symlinked to .claude/skills/"
