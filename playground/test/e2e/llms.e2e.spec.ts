// llms.txt / llms-full.txt shipped by default (product-validator-m0f.9).
//
// `nuxt-llms` is a real layer dependency now (not an optional peer the
// consumer has to add), registered in layer/nuxt.config.ts and given sane
// domain/title/description defaults in layer/modules/config.ts — nuxt-llms
// silently skips registering its routes when `llms.domain` is falsy, which
// is why the playground (no `NUXT_PUBLIC_SITE_URL`, no `site.url`) is the
// right place to prove the zero-config fallback actually works.
//
// `@nuxt/content` auto-populates `llms.sections` from every page-type
// content collection as long as the consumer hasn't declared their own
// sections (see @nuxt/content's `features/llms` — `prepareContentSections`).

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  browser: false,
  dev: true,
})

describe('llms.txt ships with zero per-site config (product-validator-m0f.9)', () => {
  it('serves a non-empty /llms.txt', async () => {
    const body = await $fetch<string>('/llms.txt')
    expect(body.trim().length).toBeGreaterThan(0)
    expect(body).toContain('#')
  })

  it('serves a non-empty /llms-full.txt (sections auto-populated from the pages collection)', async () => {
    const body = await $fetch<string>('/llms-full.txt')
    expect(body.trim().length).toBeGreaterThan(0)
  })
})
