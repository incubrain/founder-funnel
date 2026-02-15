// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useGlossary } from '@incubrain/foundry/app/composables/useGlossary'

// Mock queryCollection
mockNuxtImport('queryCollection', () => {
  return (collection: string) => ({
    all: () =>
      Promise.resolve([
        {
          category: { id: 'test-cat', label: 'Test Category', color: 'info' },
          terms: [
            { id: 'term-1', term: 'Test Term 1', definition: 'Def 1' },
            { id: 'term-2', term: 'Test Term 2', definition: 'Def 2' },
          ],
        },
      ]),
  })
})

describe('useGlossary', () => {
  it('flvattens terms and maps categories', async () => {
    const { allTerms, allTermsWithCategory } = useGlossary()

    await until(() => allTerms.value.length > 0).toBe(true)

    expect(allTerms.value.length).toBe(2)
    expect(allTermsWithCategory.value[0].category).toBe('test-cat')
    expect(allTermsWithCategory.value[0].categoryLabel).toBe('Test Category')
  })

  it('gets a specific term by ID', async () => {
    const { getTerm, allTerms } = useGlossary()

    await until(() => allTerms.value.length > 0).toBe(true)

    const term = getTerm('term-1')
    expect(term.value).toBeDefined()
    expect(term.value?.term).toBe('Test Term 1')
  })

  it('resolves glossary path with search param', () => {
    const { resolveGlossaryPath } = useGlossary()
    // Default prefix is /glossary unless configured otherwise
    expect(resolveGlossaryPath('term-1')).toBe('/glossary?search=term-1')
  })
})

// Helper for waiting in tests
function until(condition: () => boolean) {
  return {
    toBe: async (val: any) => {
      const start = Date.now()
      while (condition() !== val && Date.now() - start < 2000) {
        await new Promise((r) => setTimeout(r, 10))
      }
      expect(condition()).toBe(val)
    },
  }
}
