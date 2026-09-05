import type { PageCollections } from '@nuxt/content'
import {
  useAppConfig,
  useLazyAsyncData,
  queryCollectionSearchSections,
} from '#imports'

/**
 * App-wide content search backing the `UContentSearch` command palette in app.vue.
 * Collections to index are driven by `appConfig.content.searchable`.
 */
export const useSearch = async () => {
  const appConfig = useAppConfig()
  const searchableCollections
    = appConfig.content?.searchable || ['pages']

  const { data: searchFiles } = useLazyAsyncData(
    'search_files',
    async () => {
      const sections = await Promise.all(
        searchableCollections.map((collection: string) =>
          queryCollectionSearchSections(collection as keyof PageCollections)
            .where('path', '<>', '/')
            .catch(() => []),
        ),
      )

      return sections.flat()
    },
    { server: false },
  )

  return {
    searchFiles,
  }
}
