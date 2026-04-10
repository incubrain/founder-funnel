---
label: Testing
title: Testing Overview
description: Testing philosophy, available commands, and what to test.
---

Ship first, test what matters. Foundry's testing strategy focuses on:

1. **Accessibility** — Can AI agents and screen readers navigate? (Agent navigability)
2. **Core logic** — Do composables and server handlers work? (Unit tests)

Don't test everything. Test the things that, if broken, would stop signal capture.

## Commands

| Command | What It Does |
|---|---|
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | Nuxt TypeScript check |
| `pnpm verify` | `dev:prepare` + `lint` + `typecheck` |

## Before Committing

A good pre-commit check:

1. `pnpm lint` — Code style
2. `pnpm test` — Unit tests
3. If you added new pages/sections: verify agent navigability

## CI Pipeline

The GitHub Actions CI runs four jobs:

| Job | Trigger | What It Does |
|---|---|---|
| `quality` | All pushes | Install, prepare, lint, typecheck |
| `test` | All pushes | Unit tests via Vitest |
| `build` | After quality + test | Matrix build for foundry |
| `starter-build` | After quality + test | Verifies starter template builds standalone |

## What to Test

### Always Test
- Signal capture forms submit correctly
- Webhook delivery works for each platform
- Anti-spam scoring produces expected results

### Test When Changed
- Content rendering after schema changes
- Layout behavior after route rule changes

### Don't Test
- Nuxt UI component internals
- Third-party library behavior
- Content typos (that's what preview is for)

::card-group
  ::card{title="Agent Navigability" icon="i-lucide-accessibility" to="/docs/testing/agent-navigability"}
  Accessibility landmarks, heading hierarchy, and smoke tests.
  ::
::
