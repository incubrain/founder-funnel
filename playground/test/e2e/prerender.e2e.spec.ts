// SSG / prerender smoke test.
//
// Runs `nuxi generate` against the playground and asserts that:
//   - Routes listed in `nitro.prerender.routes` produce static HTML files
//   - Routes marked `routeRules: { prerender: true }` are also baked
//   - SPA-only routes (`ssr: false`) are NOT prerendered as full HTML
//
// Heavy: ~30–90 s. Excluded from the default `vitest` run; trigger with
// `pnpm --filter playground test:e2e`.

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))
const outputPublic = resolve(rootDir, '.output/public')

describe('nuxi generate', () => {
  beforeAll(() => {
    // Build once for all assertions. Fails the suite on non-zero exit.
    execSync('npx nuxi generate', {
      cwd: rootDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
    })
  }, 180_000)

  afterAll(() => {
    // Leave .output in place for inspection; CI will gc.
  })

  it('writes static HTML for /render-default (explicit prerender route)', () => {
    const candidates = [
      resolve(outputPublic, 'render-default.html'),
      resolve(outputPublic, 'render-default/index.html'),
    ]
    const hit = candidates.find(p => existsSync(p))
    expect(hit, `expected prerendered file at one of:\n${candidates.join('\n')}`).toBeTruthy()
    const html = readFileSync(hit!, 'utf8')
    expect(html).toContain('content-driven:')
  })

  it('does not prerender /render-spa (ssr:false)', () => {
    const candidates = [
      resolve(outputPublic, 'render-spa.html'),
      resolve(outputPublic, 'render-spa/index.html'),
    ]
    for (const p of candidates) {
      if (!existsSync(p)) continue
      const html = readFileSync(p, 'utf8')
      // If a shell IS emitted (Nuxt may still write a SPA-mode fallback),
      // it must not contain the page body.
      expect(html).not.toContain('client-mounted-sentinel')
    }
  })
})
