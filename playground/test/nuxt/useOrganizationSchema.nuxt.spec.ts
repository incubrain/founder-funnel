// @vitest-environment nuxt
//
// `useOrganizationSchema` is the layer's only `useSchemaOrg` call and it runs on
// every page from app.vue. Before product-validator-918 it returned early
// whenever `config/site.yml` was missing or carried no `business` block, so a
// consumer without business fields got NO layer contribution to the schema-org
// graph at all — the path that leaves an empty `data-nuxt-schema-org` payload
// instead of valid WebSite/WebPage output. These cases pin the degradation:
// a missing business identity must still emit the site-level baseline, never
// a silent no-op.
//
// The schema-org helpers are auto-imports, so they are mocked through
// `mockNuxtImport` (a plain `vi.stubGlobal` does not intercept them — the
// unimport transform rewrites them to real module imports).
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useOrganizationSchema } from '@incubrain/foundry/app/composables/useOrganizationSchema'

type Node = Record<string, unknown> & { '@type': string }

const { emitted } = vi.hoisted(() => ({ emitted: [] as Node[][] }))

mockNuxtImport('useSchemaOrg', () => (nodes: Node[]) => emitted.push(nodes))
mockNuxtImport('defineWebSite', () => (input: Record<string, unknown> = {}) => ({ '@type': 'WebSite', ...input }))
mockNuxtImport('defineWebPage', () => (input: Record<string, unknown> = {}) => ({ '@type': 'WebPage', ...input }))
mockNuxtImport('defineOrganization', () => (input: Record<string, unknown> = {}) => ({ '@type': 'Organization', ...input }))

const types = () => emitted.flat().map(node => node['@type'])

beforeEach(() => {
  emitted.length = 0
})

describe('useOrganizationSchema — no business config (product-validator-918)', () => {
  it('emits WebSite + WebPage when config/site.yml is absent entirely', () => {
    useOrganizationSchema(undefined, undefined)

    expect(emitted, 'the layer must still contribute to the schema-org graph').toHaveLength(1)
    expect(types()).toEqual(['WebSite', 'WebPage'])
  })

  it('emits WebSite + WebPage when business exists but has no name', () => {
    useOrganizationSchema({ legalName: 'No Name Ltd.' }, { x: 'https://x.com/foundry' })

    expect(types()).toEqual(['WebSite', 'WebPage'])
  })

  it('never emits an empty node list', () => {
    useOrganizationSchema(undefined, undefined)

    expect(emitted[0]!.length).toBeGreaterThan(0)
  })
})

describe('useOrganizationSchema — business config present', () => {
  it('maps business + socials onto an Organization node', () => {
    useOrganizationSchema(
      {
        name: 'Foundry Playground',
        legalName: 'Foundry Playground Ltd.',
        foundingYear: 2024,
        logo: '/favicon.ico',
        mission: 'Fixture site config.',
      },
      { github: 'https://github.com/incubrain/foundry', blank: '' },
    )

    expect(types()).toEqual(['Organization'])
    const org = emitted[0]![0]!
    expect(org.name).toBe('Foundry Playground')
    expect(org.legalName).toBe('Foundry Playground Ltd.')
    expect(org.foundingDate).toBe('2024')
    expect(org.description).toBe('Fixture site config.')
    expect(org.sameAs).toEqual(['https://github.com/incubrain/foundry'])
  })

  it('omits keys the site config does not set rather than emitting empty strings', () => {
    useOrganizationSchema({ name: 'Bare Co' }, undefined)

    expect(Object.keys(emitted[0]![0]!)).toEqual(['@type', 'name'])
  })
})
