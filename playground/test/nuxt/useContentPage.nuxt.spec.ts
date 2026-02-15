// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useContentPage } from '@incubrain/foundry/app/composables/useContentPage'

// Mock queryCollection
mockNuxtImport('queryCollection', () => {
  return (collection: string) => ({
    path: (p: string) => ({
      first: () =>
        Promise.resolve({
          title: 'Mock Page',
          description: 'Mock Description',
          seo: { title: 'SEO Title' },
        }),
    }),
  })
})

describe('useContentPage', () => {
  it('resolves collection from route', () => {
    // Note: In tests, the default route might be '/'
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

  it('fetches page data', async () => {
    const { getPage } = useContentPage()
    const { data } = await getPage()

    expect(data.value).toBeDefined()
    expect(data.value.title).toBe('Mock Page')
  })
})
