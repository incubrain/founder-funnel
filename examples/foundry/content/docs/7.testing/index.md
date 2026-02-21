---
label: Testing
title: Testing Overview
description: Testing philosophy, available commands, and what to test.
---

Ship first, test what matters. Foundry's testing strategy focuses on:

1. **Visual correctness** — Do components look right? (VRT)
2. **Accessibility** — Can AI agents and screen readers navigate? (Agent navigability)
3. **Core logic** — Do composables and server handlers work? (Unit tests)

Don't test everything. Test the things that, if broken, would stop signal capture.

## Commands

| Command | What It Does |
|---|---|
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:vrt` | Visual regression tests (compare against baselines) |
| `pnpm test:vrt:update` | Update VRT baselines (accept intentional visual changes) |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | Nuxt TypeScript check |
| `pnpm verify` | `dev:prepare` + `lint` + `typecheck` |

## Before Committing

A good pre-commit check:

1. `pnpm lint` — Code style
2. `pnpm test` — Unit tests
3. If you changed visual components: `pnpm test:vrt`
4. If you added new pages/sections: verify agent navigability

## CI Pipeline

The GitHub Actions CI runs five jobs:

| Job | Trigger | What It Does |
|---|---|---|
| `quality` | All pushes | Install, prepare, lint, typecheck |
| `test` | All pushes | Unit tests via Vitest |
| `build` | After quality + test | Matrix build for astronera and foundry |
| `vrt` | PRs only | Visual regression tests (path-filtered) |
| `starter-build` | After quality + test | Verifies starter template builds standalone |

The VRT job uses update mode in CI to handle cross-platform font rendering differences.

## What to Test

### Always Test
- Signal capture forms submit correctly
- Webhook delivery works for each platform
- Anti-spam scoring produces expected results

### Test When Changed
- Visual appearance of components (VRT)
- Content rendering after schema changes
- Layout behavior after route rule changes

### Don't Test
- Nuxt UI component internals
- Third-party library behavior
- Content typos (that's what preview is for)

:read-more{title="Visual regression testing" to="/docs/testing/visual-regression"}
:read-more{title="Agent navigability" to="/docs/testing/agent-navigability"}

::card-group
  ::card{title="Visual Regression" icon="i-lucide-image" to="/docs/testing/visual-regression"}
  Screenshot comparison, baselines, and the VRT module.
  ::

  ::card{title="Agent Navigability" icon="i-lucide-accessibility" to="/docs/testing/agent-navigability"}
  Accessibility landmarks, heading hierarchy, and smoke tests.
  ::
::
