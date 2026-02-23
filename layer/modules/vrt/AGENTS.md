# VRT Module — AI Agent Instructions

Visual regression testing using Playwright screenshots and pixelmatch comparison.

## File Map

```
layer/modules/vrt/
├── index.ts                          # Nuxt module (dev-only routes + layout)
├── shared/
│   ├── index.ts                      # Re-exports
│   ├── config.ts                     # Vitest config factory + Playwright commands
│   ├── helpers.ts                    # Browser-side test helpers
│   ├── global-setup.ts              # Dev server lifecycle management
│   └── commands.d.ts                 # TypeScript declarations
└── runtime/
    ├── layouts/
    │   └── vrt.vue                   # Bare layout (no header/footer/banner)
    └── pages/
        ├── vrt.vue                   # Homepage in bare layout
        └── vrt-page.vue             # Dynamic route for any page
```

## Key Architecture

### Dev-Only Bare Layout
Module only activates in dev mode. Creates `/__vrt` routes that render content without header/footer/banner for clean, isolated screenshots.

### Three-Layer System
1. **Module** (`index.ts`) — Registers routes and layout
2. **Config** (`config.ts`) — Vitest browser config with custom Playwright commands
3. **Helpers** (`helpers.ts`) — `screenshotAllSections()` and `screenshotByTestId()` utilities

### Screenshot + Compare Pipeline
```
screenshotAllSections()
  → Navigate to /__vrt page
  → Wait for hydration + network idle
  → Find elements by data-testid prefix (section-*)
  → Screenshot each element
  → Compare with pixelmatch (threshold: 0.2, maxDiffRatio: 0.01)
  → Save diffs to __diff__/ directory
```

### Baseline Management
- First run creates baselines in `test/vrt/__screenshots__/`
- Subsequent runs compare against baselines
- Diffs saved to `__diff__/` (gitignored)
- Update baselines: `pnpm test:vrt:update` or `VRT_UPDATE=1`

## How to Modify

### Add new VRT test
```typescript
import { screenshotAllSections, screenshotByTestId } from '@incubrain/foundry/modules/vrt/shared/helpers'

it('screenshots homepage sections', async () => {
  await screenshotAllSections()
})

it('screenshots specific element', async () => {
  await screenshotByTestId('convert-form', { pagePath: '/offers/mentorship' })
})
```

### Change thresholds
Pass to `createVrtConfig({ threshold: 0.15, maxDiffRatio: 0.005 })` or per-test: `screenshotAllSections({ threshold: 0.15 })`

### Modify bare layout
Edit `runtime/layouts/vrt.vue` — keep minimal, purpose is isolation.

## Commands

```bash
pnpm test:vrt           # Compare against baselines
pnpm test:vrt:update    # Update baselines (intentional changes only)
```
