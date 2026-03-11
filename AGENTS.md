# IncuBrain Foundry

A validation tool for technical founders — captures signal (email, presales, bookings) to prove demand before building product.

## Quick Start

```bash
pnpm dev:ff          # Founder Funnel dev server
pnpm dev:ae          # Astronera dev server
pnpm dev:web         # Starter web dev server
pnpm dev:docs        # Starter docs dev server
pnpm build:ae        # Production build (astronera)
pnpm lint            # ESLint check
pnpm lint:fix        # ESLint autofix
pnpm test            # Run tests
pnpm typecheck       # Nuxt typecheck (layer)
pnpm verify          # dev:prepare + lint + typecheck
```

## Critical Rules

1. **Never add features that don't capture signal.** If it doesn't help founders validate faster, reject it.
2. **Never build custom when VueUse/library exists.** Priority: VueUse → library → custom (last resort). Check composables.vueuse.org first.
3. **Validation ≠ Product.** Email sequences, auth, payment processing, gated content are product features — out of scope.
4. **Complexity budget:** max 50 lines per component, max 5 props, max 2 abstraction layers, max 3 nesting levels.
5. **Content in YAML/Markdown, not hardcoded.** Customers edit content files, not code.
6. **Ship first, optimize later.** Ship working → measure → optimize what data proves necessary.

## Architecture

**In scope:** Landing pages (section-driven), signal capture (email/presales/bookings), event tracking (analytics-agnostic), webhook streaming.

**Out of scope:** Email sequences, authentication, payment processing, databases. Use external tools for these.

**Key patterns:**
- Event-driven: action → `useEvents()` → handler → provider. Swap analytics without changing event code. See `modules/events/*`.
- Webhook streaming: capture → encrypt → webhook → destination. No storage needed. See `modules/events/server/handlers/webhook.ts`.
- SSR: Nuxt 4, use `import.meta.client` guards for client-only APIs or `.client.ts|.server.ts` file naming.

## File Locations

```bash
layer/                         → Nuxt layer (core reusable code)
layer/modules/                 → Feature modules (events, comments, rss, changelog, docs)
examples/foundry/              → Founder Funnel example app
examples/astronera/            → Astronera example app
examples/starter/              → Starter template
shared/config/                 → Configuration files
shared/types/                  → TypeScript types
deploy/                        → Dockerfiles and deployment configs
.agents/rules/                 → Agent rule files (symlinked from .claude/rules/)
.agents/skills/                → External skills (gitignored, install with scripts/install-skills.sh)
.agents/vibekanban-configs.md  → VibeKanban agent configurations (6 roles)
.claude/agents/                → Claude Code sub-agent definitions
.claude/scripts/               → Utility scripts for agents
skills/                        → Custom skills (committed to git)
```

## Common Tasks

- **Add new section:** Copy existing section component, edit `content/*.yml`
- **Change validation path:** Edit `app/components/convert/*`
- **Add event tracking:** Use `useEvents()` composable
- **Deploy:** Standard Node.js/Docker — Dockerfile + `vercel.json` included
- **Visual UI review:** Use the `visual-tester` skill or `browser-tester` sub-agent. See [Visual Testing](#visual-testing) below

## Before You Code

1. Does VueUse solve this? (composables.vueuse.org)
2. Does an existing component handle this?
3. Is this solving a real or imagined problem?
4. Will this capture signal faster?

If all answers are "No" → don't build it.

## Rules

Detailed rules are in `.agents/rules/` (symlinked at `.claude/rules/`):
- @.agents/rules/architecture.md — System boundaries and integration points
- @.agents/rules/conventions.md — Naming, component rules, code patterns
- @.agents/rules/decisions.md — Boundary decisions and decision framework
- @.agents/rules/anti-patterns.md — What to never do, red flags, values filter

## Module Guides

Each module has its own AGENTS.md with detailed architecture, file maps, and modification guides. Read the relevant module guide when working on that module:

- @layer/modules/events/AGENTS.md — Event tracking and webhook streaming
- @layer/modules/comments/AGENTS.md — Documentation review system (dev-only)
- @layer/modules/rss/AGENTS.md — RSS feed generation
- @layer/modules/changelog/AGENTS.md — Changelog generation
- @layer/modules/docs/AGENTS.md — Documentation utilities

## Skills

External agent skills extend capabilities for specialized tasks. Skills are installed to `.agents/skills/` (gitignored). After cloning, run `bash scripts/install-skills.sh` to install them.

**When to use skills:**
- **Development**: nuxt, nuxt-ui, nuxt-content, vue-best-practices, vitest, vueuse-functions, pinia
- **Design**: frontend-design, theme-factory, web-design-guidelines
- **Marketing**: copywriting, marketing-psychology
- **Strategy**: brainstorming, systematic-debugging
- **Tools**: agent-browser, manage-mcp
- **Visual Testing**: visual-tester (uses agent-browser for UI/UX bug detection)
- **Custom** (in `skills/`): docs-writer, visual-tester

**Skill priority:** Check skills first → VueUse → Library → Custom (last resort)

**Commands:**
```bash
bash scripts/install-skills.sh          # Install or update all skills
npx skills list --agent claude-code     # List installed skills
npx skills update skill-name            # Update a specific skill
```

## Visual Testing

Use the `browser-tester` sub-agent or `visual-tester` skill to detect UI/UX bugs via annotated screenshots. The dev server must be running first (`pnpm dev:ae`, `pnpm dev:ff`, etc.).

**When to use:**
- After implementing UI changes — verify layout, spacing, and styling
- Before merging — catch visual regressions
- When investigating reported visual bugs — capture evidence with screenshots

**Quick start:**
```bash
# One-command review (wrapper script)
bash .claude/scripts/visual-review.sh http://localhost:3000 [optional-selector]

# Manual workflow
npx agent-browser open http://localhost:3000
npx agent-browser wait --load networkidle
npx agent-browser screenshot --annotate --full
npx agent-browser close
```

**Sub-agents:** `.claude/agents/browser-tester.md` defines the Browser Visual Tester — use via VibeKanban's Browser Tester config or as a Claude Code sub-agent for visual review tasks.

**Observability:** Every `agent-browser` command is logged to `.claude/visual-test-log.md` (gitignored) via a PostToolUse hook. Check this file to audit what commands were run during a visual review session.

**`data-testid` selectors** for scoped reviews:
```bash
npx agent-browser snapshot -i -s "[data-testid='section-hero']"
npx agent-browser snapshot -i -s "[data-testid='convert-form']"
```
