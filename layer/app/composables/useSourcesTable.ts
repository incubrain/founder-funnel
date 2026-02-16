import type { BadgeProps } from '@nuxt/ui'

export interface LinkInfo {
  primary: string
  primaryIcon: string
  primaryLabel: string
  secondary?: string
  secondaryIcon?: string
  secondaryLabel?: string
}

/**
 * Determine link type (PDF vs web) and return appropriate icons/labels.
 */
export function getLinkInfo(source: Record<string, unknown>): LinkInfo | null {
  const url = source.url as string | undefined
  const pdf = source.pdf as string | undefined

  const hasUrl = !!url && !url.toLowerCase().endsWith('.pdf')
  const pdfLink = pdf || (url && url.toLowerCase().endsWith('.pdf') ? url : null)
  const webLink = hasUrl ? url : null

  if (pdfLink && webLink) {
    return {
      primary: pdfLink,
      secondary: webLink,
      primaryIcon: 'i-lucide-file-text',
      secondaryIcon: 'i-lucide-external-link',
      primaryLabel: 'PDF',
      secondaryLabel: 'Website',
    }
  }
  else if (pdfLink) {
    return {
      primary: pdfLink,
      primaryIcon: 'i-lucide-file-text',
      primaryLabel: 'View PDF',
    }
  }
  else if (webLink) {
    return {
      primary: webLink,
      primaryIcon: 'i-lucide-external-link',
      primaryLabel: 'Visit Website',
    }
  }

  return null
}

/**
 * Handles SourcesTable data transformation, filtering, and grouping config.
 *
 * Extracts business logic from SourcesTable.vue so the component
 * only handles rendering.
 */
export function useSourcesTable() {
  const route = useRoute()
  const { allCategoryRefs } = useCitations()
  const appConfig = useAppConfig()

  // Global search with URL sync
  const globalFilter = ref('')

  watch(
    () => route.query,
    (newQuery) => {
      if (newQuery) {
        nextTick(() => {
          globalFilter.value = String(newQuery.search ?? '')
        })
      }
    },
    { immediate: true },
  )

  // Flatten categories into a single sources array with category metadata
  const tableData = computed(() => {
    if (!allCategoryRefs.value) return []

    return allCategoryRefs.value.flatMap(categoryGroup =>
      categoryGroup.sources.map((source: Record<string, unknown>) => ({
        ...source,
        categoryId: categoryGroup.category.id,
        categoryLabel: categoryGroup.category.label,
      })),
    )
  })

  // Grouping state
  const grouping = ref(['categoryLabel'])
  const expanded = ref(true)

  // Affiliation color mapping
  const affiliationColor = computed<Record<string, BadgeProps['color']>>(() => ({
    government: 'primary',
    academic: 'secondary',
    media: 'neutral',
    ngo: 'warning',
    educational: 'info',
    industry: 'error',
    ...appConfig.ui?.docs?.affiliation?.colors,
  }))

  return {
    globalFilter,
    tableData,
    grouping,
    expanded,
    affiliationColor,
    getLinkInfo,
  }
}
