import type { GlossaryCollectionItem } from '@nuxt/content'

export const useGlossary = () => {
  const { collections } = useContentConfig()

  // Fetch glossary ONCE and cache globally
  const { data: glossaryData } = useAsyncData('glossary-all', () =>
    queryCollection(collections.glossary).all() as Promise<GlossaryCollectionItem[]>,
  )

  // Flatten all terms for easy lookup
  const allTerms = computed(() => {
    if (!glossaryData.value) return []
    return glossaryData.value.flatMap(file => file.terms || [])
  })

  // Terms with category metadata (for table display)
  const allTermsWithCategory = computed(() => {
    if (!glossaryData.value) return []
    return glossaryData.value.flatMap(file =>
      (file.terms || []).map(term => ({
        ...term,
        category: file.category.id,
        categoryLabel: file.category.label,
        categoryColor: file.category.color || 'neutral',
      })),
    )
  })

  // Category color map
  const categoryColors = computed<Record<string, string>>(() => {
    if (!glossaryData.value) return {}
    const colorMap: Record<string, string> = {}
    glossaryData.value.forEach((file) => {
      colorMap[file.category.id] = file.category.color || 'neutral'
    })
    return colorMap
  })

  /**
   * Get term data by ID (includes category metadata)
   */
  const getTerm = (termId: string) => {
    return computed(() =>
      allTermsWithCategory.value.find(t => t.id === termId.toLowerCase()),
    )
  }

  /**
   * Resolve a glossary path with search query.
   * Handles edge cases:
   * - Path already has prefix → returns as-is with search param
   * - termId with/without prefix → normalizes correctly
   */
  const resolveGlossaryPath = (termId: string): string => {
    const { getRoutingPath } = useContentConfig()
    const glossaryPage = getRoutingPath('glossary', '/glossary')
    return `${glossaryPage}?search=${termId.toLowerCase()}`
  }

  return {
    glossaryData,
    allTerms,
    allTermsWithCategory,
    categoryColors,
    getTerm,
    resolveGlossaryPath,
  }
}
