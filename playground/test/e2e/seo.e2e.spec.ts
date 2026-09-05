// FAQPage + Organization JSON-LD (product-validator-m0f.6).
//
// Both are emitted via @nuxtjs/seo's schema-org integration, from content
// models the layer already has — no new content format:
//   - FAQPage: `useFaqSchema()` (layer/app/composables/useFaqSchema.ts),
//     called by FaqAccordion.vue off the same items the accordion renders.
//   - Organization: `useOrganizationSchema()` (layer/app/composables/
//     useOrganizationSchema.ts), called by app.vue off `config/site.yml`'s
//     `business`/`socials` fields — emitted on every page.
//
// JSON-LD ships as a `<script type="application/ld+json">` tag, which is a
// script — the `renderedBody()` helper in rendering.e2e.spec.ts strips
// scripts, so this suite asserts on the raw SSR HTML instead.

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  browser: false,
  dev: true,
})

interface SchemaOrgNode {
  '@type': string | string[]
  [key: string]: unknown
}

function ldJsonBlocks(html: string): string[] {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
}

function hasType(node: SchemaOrgNode, type: string): boolean {
  return [node['@type']].flat().includes(type)
}

describe('FAQPage JSON-LD (product-validator-m0f.6)', () => {
  it('emits a FAQPage graph node with the accordion\'s Question content', async () => {
    const html = await $fetch<string>('/render-seo')
    const blocks = ldJsonBlocks(html)
    expect(blocks.length, 'expected at least one JSON-LD <script> tag in the SSR HTML').toBeGreaterThan(0)

    const graph: SchemaOrgNode[] = blocks.map(block => JSON.parse(block)).flatMap(doc => doc['@graph'] ?? [doc])

    const faqPage = graph.find(node => hasType(node, 'FAQPage'))
    expect(faqPage, 'no FAQPage node in the schema-org graph').toBeTruthy()

    const question = graph.find(node => hasType(node, 'Question')) as { name?: string, acceptedAnswer?: { text?: string } } | undefined
    expect(question?.name).toBe('Is this a fixture FAQ?')
    expect(question?.acceptedAnswer?.text).toContain('e2e suite')
  })
})

describe('Organization JSON-LD (product-validator-m0f.6)', () => {
  it('maps config/site.yml business + socials into an Organization graph node', async () => {
    const html = await $fetch<string>('/render-seo')
    const blocks = ldJsonBlocks(html)
    const graph: SchemaOrgNode[] = blocks.map(block => JSON.parse(block)).flatMap(doc => doc['@graph'] ?? [doc])

    const org = graph.find(node => hasType(node, 'Organization')) as { name?: string, legalName?: string, sameAs?: string[] } | undefined
    expect(org, 'no Organization node in the schema-org graph').toBeTruthy()
    expect(org?.name).toBe('Foundry Playground')
    expect(org?.legalName).toBe('Foundry Playground Ltd.')
    expect(org?.sameAs).toContain('https://github.com/incubrain/foundry')
  })
})
