# Agent Skills Reference

External agent skills extend Claude Code's capabilities for specialized tasks. All skills are installed via `bash scripts/install-skills.sh`.

## When to Use Skills

**Development & Testing**
- **manage-mcp**: Setting up or troubleshooting MCP servers in Nuxt
- **vitest**: Writing unit tests, configuring coverage, test filtering
- **nuxt-ui**: Building UIs with @nuxt/ui v4 components and theming
- **nuxt**: Working with Nuxt apps, server routes, middleware, SSR
- **nuxt-content**: Working with Nuxt Content collections, MDC, queryCollection
- **vueuse-functions**: Finding VueUse composables to avoid custom implementations
- **vue-best-practices**: Any Vue.js work (strongly prefers Composition API + `<script setup>`)
- **pinia**: State management with Pinia stores
- **vue-testing-best-practices**: Vue component testing with Vitest + Vue Test Utils
- **agent-browser**: Browser automation, form filling, web scraping, testing web apps
- **web-design-guidelines**: Reviewing UI code for accessibility and Web Interface Guidelines compliance

**Design & UX**
- **frontend-design**: Creating landing pages, designing user interfaces, visual hierarchy
- **theme-factory**: Building design systems, creating color palettes, theming components

**Marketing & Content**
- **copywriting**: Writing landing page copy, CTAs, email capture forms, value propositions
- **marketing-psychology**: Crafting messaging that resonates with founders, positioning validation vs product

**Strategy & Debugging**
- **brainstorming**: Exploring validation approaches, ideating section layouts, feature prioritization
- **systematic-debugging**: Diagnosing complex issues, investigating root causes, troubleshooting

**Custom Skills (Tracked in Git)**
- **docs-writer**: Dark Sky Conservation policy documentation for Maharashtra government officials

## Skill Priority

1. **Check existing skills first** — Don't build custom solutions when a skill exists
2. **VueUse → Library → Custom** — Follow the hierarchy (see CLAUDE.md Critical Rules)
3. **Use skills proactively** — Don't wait to be asked; apply relevant skills when you see the pattern

## Installation

```bash
# Install or update all skills
bash scripts/install-skills.sh

# List installed skills
npx skills list --agent claude-code

# Update a specific skill
npx skills update skill-name --agent claude-code

# Remove a skill
npx skills remove skill-name
```

## Skill Manifest

See [`.claude/skills.json`](.claude/skills.json) for the complete skill registry.
