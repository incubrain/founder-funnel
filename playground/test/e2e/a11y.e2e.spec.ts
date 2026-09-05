// axe-core accessibility gate for the playground's content-driven rendering
// routes (product-validator-m0f.10).
//
// Boots a real Nuxt dev server AND a real (headless) browser via
// @nuxt/test-utils `setup({ browser: true })` — the same harness pattern as
// `rendering.e2e.spec.ts`, just with a browser attached so axe-core can run
// against the *hydrated* DOM a real user/assistive-tech/browser-use agent
// would see, not just the raw SSR string.
//
// axe-core is injected directly into the page (via Playwright's
// `page.addScriptTag`) rather than pulling in `@axe-core/playwright` or a
// full `@playwright/test` runner — smallest new-dependency footprint that
// still exercises the real WCAG rule engine against a real DOM.
//
// Gate policy: fail on any `wcag2a` / `wcag2aa` violation. A route/rule pair
// may be excluded ONLY with an inline reason (see `KNOWN_EXCLUSIONS` below) —
// never silently. Excluded violations are still logged so a real regression
// (e.g. a NEW violation of an already-excluded rule, or a rule count that
// grows) stays visible in test output.

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import type { Page } from 'playwright-core'

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  browser: true,
  dev: true,
})

// Minimal shape of an axe-core violation — enough for reporting, not the
// full upstream type (keeps this file free of an axe-core type dependency).
interface AxeViolation {
  id: string
  impact: string | null
  description: string
  help: string
  helpUrl: string
  nodes: Array<{ target: string[], html: string, failureSummary?: string }>
}

interface AxeResults {
  violations: AxeViolation[]
}

const axeCorePath = fileURLToPath(import.meta.resolve('axe-core/axe.min.js'))

/** Inject axe-core into the page and run it, scoped to WCAG A/AA. */
async function runAxe(page: Page): Promise<AxeResults> {
  await page.addScriptTag({ path: axeCorePath })
  return page.evaluate(async () => {
    // @ts-expect-error — axe is attached to `window` by the injected script.
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    })
  })
}

function formatViolation(v: AxeViolation): string {
  const targets = v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')
  return `  [${v.impact ?? 'unknown'}] ${v.id}: ${v.help} (${v.helpUrl})\n    nodes: ${targets}`
}

// Routes covered: the content-driven marketing/rendering pages an editor
// actually authors via `playground/content/pages/*.md` plus the one
// component-driven conversion fixture. `/render-citations` and
// `/render-seo` (named in the original task) do not exist as routes in this
// playground — there is nothing to gate until those fixtures are added.
//
// Per-route rule exclusions (empty by default). Add an entry ONLY with a
// reason — see the module doc comment above.
const ROUTES: Array<{ path: string, exclude?: Record<string, string> }> = [
  { path: '/render-default' },
  { path: '/render-hero' },
  { path: '/render-article' },
  { path: '/render-landing' },
  { path: '/render-convert' },
]

describe('accessibility (axe-core, wcag2a + wcag2aa)', () => {
  it.each(ROUTES)('$path has no un-excluded WCAG A/AA violations', async ({ path, exclude }) => {
    const page = await createPage(path)
    try {
      const results = await runAxe(page)
      const excluded = exclude ?? {}

      const unexpected = results.violations.filter(v => !(v.id in excluded))
      const expectedButAbsent = Object.keys(excluded).filter(
        id => !results.violations.some(v => v.id === id),
      )

      if (unexpected.length > 0) {
        console.error(
          `\n${path}: ${unexpected.length} un-excluded violation(s):\n${unexpected.map(formatViolation).join('\n')}`,
        )
      }
      if (results.violations.length > unexpected.length) {
        const excludedFound = results.violations.filter(v => v.id in excluded)
        console.warn(
          `\n${path}: ${excludedFound.length} excluded violation(s) still present (documented, not failing):\n${excludedFound.map(formatViolation).join('\n')}`,
        )
      }

      expect(
        unexpected,
        `${path}: unexpected axe violations (see console.error above for detail)`,
      ).toHaveLength(0)

      // Keep exclusions honest: an exclusion for a rule that no longer
      // triggers is stale and should be removed.
      expect(
        expectedButAbsent,
        `${path}: these excluded rule(s) no longer trigger — remove the stale exclusion: ${expectedButAbsent.join(', ')}`,
      ).toHaveLength(0)
    }
    finally {
      await page.close()
    }
  })
})
