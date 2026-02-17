## Visual Regression Testing

**When to run VRT:**
After modifying any of these, run `pnpm test:vrt`:
- `*.vue` files in `layer/app/components/`, `layer/app/layouts/`, `layer/app/pages/`
- `*.css` files in `layer/app/assets/`
- Content config files that affect page structure (`shared/config/`)
- VRT module itself (`layer/modules/vrt/`)

**How to run:**
```bash
pnpm test:vrt          # Compare against baselines
pnpm test:vrt:update   # Update baselines (intentional changes only)
```

**Interpreting failures:**
- Diff images saved to `test/vrt/__screenshots__/__diff__/`
- Red pixels in diff = real visual changes
- If changes are intentional: run `pnpm test:vrt:update` to accept new baselines, then commit updated PNGs
- If changes are unintentional: fix the regression before committing

**How VRT works:**
- The layer ships a dev-only `/__vrt` route (bare layout, no header/footer/banner)
- Tests open a separate Playwright page, navigate to `/__vrt`, screenshot elements by `data-testid`
- Baselines live in `test/vrt/__screenshots__/` (committed to git)
- Current captures go to `test/vrt/__screenshots__/__current__/` (gitignored)
- Comparison uses pixelmatch with configurable threshold

**Before commit (visual changes):**
1. Tests pass (`pnpm test`)
2. Lint passes (`pnpm lint`)
3. VRT passes (`pnpm test:vrt`) OR baselines updated if changes are intentional
4. If new pages/sections: verify agent navigability

## Agent Navigability Standards

All pages must be navigable by AI agents via accessibility tree inspection.

**Required landmarks (auto-injected by layer):**
- `banner` — site header with navigation
- `main` — primary content area
- `contentinfo` — site footer
- `region` landmarks for each section (via SectionWrapper `aria-labelledby`)

**Heading hierarchy:**
- One `h1` per page
- `h2` for section headings
- `h3`+ for subsections
- No skipped levels (h1 → h3 without h2)

**Interactive elements:**
- All form inputs must have descriptive labels
- All buttons must have meaningful text (no icon-only without `aria-label`)
- Navigation links must have descriptive text
- No orphan click handlers (use `<button>` or add `role="button"`)

**Signal capture forms must be:**
- Discoverable via `data-testid` (e.g. `convert-form`, `convert-external`)
- Completable: fill inputs → submit → verify success state
- Accessible: proper `<form>`, `<label>`, and `<input>` semantics

**Verification with agent-browser:**
```bash
bash scripts/agent-smoke-test.sh   # Automated navigability check
```

Or manually:
```bash
agent-browser open http://localhost:3000
agent-browser snapshot           # Check landmarks + heading hierarchy
agent-browser snapshot -i        # Check interactive elements
agent-browser find role form     # Verify signal capture forms are discoverable
```
