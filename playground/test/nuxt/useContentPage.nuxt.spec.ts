// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useContentPage } from '@incubrain/foundry/app/composables/useContentPage'

// `getPage` calls useFetch('/api/_foundry/content/page') after the
// architectural refactor that moved content fetching off the auto-imported
// client queryCollection (see bd: h3@1 + content@3.13 SSR crash). Mock the
// composable layer here so the unit suite verifies the wiring without
// booting a real Nitro server. End-to-end behavior is covered by
// playground/test/e2e/rendering.e2e.spec.ts.
mockNuxtImport('useFetch', () =>
  vi.fn(async () => ({
    data: { value: { title: 'Mock Page', description: 'Mock Description' } },
  })),
)

describe('useContentPage', () => {
  it('resolves collection from route', () => {
    const { collection } = useContentPage()
    expect(collection.value).toBe('pages')
  })

  it('sets and clears context', () => {
    const { context, setContext } = useContentPage()

    const mockPage = { title: 'Test', description: 'Desc' }
    setContext(mockPage)

    expect(context.value).toBeDefined()
    expect(context.value?.page).toEqual(mockPage)
    expect(context.value?.seo?.title).toBe('Test')

    setContext(null)
    expect(context.value).toBeNull()
  })

  it('fetches page data via the foundry content endpoint', async () => {
    const { getPage } = useContentPage()
    const result = await getPage()

    expect(result).toBeDefined()
    expect(result.data.value).toBeDefined()
    expect(result.data.value?.title).toBe('Mock Page')
  })
})
