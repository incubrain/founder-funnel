// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useCitations } from '@incubrain/foundry/modules/docs/runtime/composables/useCitations'

// Mock queryCollection using mockNuxtImport
mockNuxtImport('queryCollection', () => {
  return (_collection: string) => ({
    all: () =>
      Promise.resolve([
        {
          category: { id: 'test-category', label: 'Test Category' },
          sources: [
            {
              id: 'ref-1',
              title: 'Test Reference 1',
              author: 'Author One',
              date: '2024-01-01',
              url: 'https://example.com/1',
            },
            {
              id: 'ref-2',
              title: 'Test Reference 2',
              author: 'Author Two',
              date: '2024-02-01',
              pdf: '/pdfs/test-2.pdf',
              credibilityScore: 9,
            },
          ],
        },
      ]),
  })
})

describe('useCitations', () => {
  it('initializes with empty citations for a route', () => {
    const { citations } = useCitations()
    expect(citations.value).toEqual([])
  })

  it('adds citations correctly', () => {
    const { citations, addCitation } = useCitations()
    addCitation('ref-1')
    expect(citations.value).toContain('ref-1')

    // Should not add duplicate
    addCitation('ref-1')
    expect(citations.value.length).toBe(1)
  })

  it('gets citation index (1-based)', () => {
    const { addCitation, getCitationIndex } = useCitations()
    addCitation('ref-1')
    addCitation('ref-2')

    expect(getCitationIndex('ref-1').value).toBe(1)
    expect(getCitationIndex('ref-2').value).toBe(2)
    expect(getCitationIndex('ref-unknown').value).toBe(0)
  })

  it('flattens references from category data', async () => {
    const { allRefs } = useCitations()

    // Wait for useAsyncData to resolve
    await until(() => allRefs.value.length > 0).toBe(true)

    expect(allRefs.value.length).toBe(2)
    const ref1 = allRefs.value.find(r => r.id === 'ref-1')
    expect(ref1).toBeDefined()
    expect(ref1?.title).toBe('Test Reference 1')
    expect(ref1?.category.id).toBe('test-category')
  })

  it('validates citations and provides suggestions', async () => {
    const { validateCitation, allRefs } = useCitations()

    await until(() => allRefs.value.length > 0).toBe(true)

    const valid = validateCitation('ref-1')
    expect(valid.value.valid).toBe(true)

    const invalid = validateCitation('ref-11') // Close to ref-1
    expect(invalid.value.valid).toBe(false)
    expect(invalid.value.suggestions).toContain('ref-1')
    expect(invalid.value.message).toContain('Did you mean: ref-1')
  })
})

// Helper for waiting in tests
function until(condition: () => boolean) {
  return {
    toBe: async (val: boolean) => {
      const start = Date.now()
      while (condition() !== val && Date.now() - start < 2000) {
        await new Promise(r => setTimeout(r, 10))
      }
      expect(condition()).toBe(val)
    },
  }
}
