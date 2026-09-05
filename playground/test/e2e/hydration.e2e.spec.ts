// Hydration-mismatch regression guard (product-validator-740).
//
// UPageHeader in `layer/app/layouts/article.vue` used to pass its title via a
// bare-text `<template #title>{{ article?.title }}</template>` slot. Nuxt UI's
// own PageHeader.vue renders that slot as the *only* child of an `<h1>`
// (`<slot name="title">{{ props.title }}</slot>`) — a single dynamic text
// node with no wrapping element. Vue's SSR fast path for "element with one
// dynamic text child" and the client hydration walker can disagree about the
// node type at that position when the slot content crosses a Suspense
// boundary (the app root uses `<Suspense>`), producing:
//   [Vue warn]: Hydration node mismatch:
//   - rendered on server: <!---->
//   - expected on client: text node (v-txt)
//
// The fix: pass the title through the `:title` *prop* instead of a slot, so
// there is no caller-supplied slot function at all — PageHeader's own
// (single, consistently-compiled) fallback renders it identically on both
// passes. This test boots a real browser against a real SSR response and
// fails if any hydration-mismatch warning reaches the console on any
// layout-bearing route, so a regression here is caught immediately instead
// of silently reappearing.

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  browser: true,
  dev: true,
})

// One route per layout that Foundry ships, so a mismatch introduced in any
// layout (not just article) is caught here too.
const ROUTES = ['/render-article', '/render-default', '/render-landing']

describe('hydration (product-validator-740)', () => {
  it.each(ROUTES)('%s hydrates with no Vue hydration-mismatch warnings', async (route) => {
    const messages: string[] = []
    const page = await createPage(undefined, {})
    page.on('console', (msg) => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        messages.push(msg.text())
      }
    })
    page.on('pageerror', (err) => {
      messages.push(err.message)
    })

    await page.goto(url(route), { waitUntil: 'networkidle' })
    // Give Vue's post-hydration microtask queue a moment to flush any
    // deferred hydration-mismatch warnings.
    await page.waitForTimeout(500)

    const hydrationWarnings = messages.filter(m => /hydration/i.test(m))
    expect(
      hydrationWarnings,
      `${route} produced hydration-mismatch warnings:\n${hydrationWarnings.join('\n---\n')}`,
    ).toEqual([])
  }, 30_000)
})
