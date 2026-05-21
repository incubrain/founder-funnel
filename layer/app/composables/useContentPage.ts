import type { PageCollections } from '@nuxt/content'

/**
 * Minimal shape of a Nuxt Content document as the layer reads it. Real
 * documents have arbitrary frontmatter keys; we list the ones layouts
 * touch and intersect with Record<string, unknown> for the rest.
 */
export type ContentDoc = {
  title?: string
  description?: string
  hero?: boolean
  label?: string
  date?: string
  image?: string
  path?: string
  seo?: { title?: string, description?: string }
} & Record<string, unknown>

export interface ContentPageContext {
  /** Which content collection produced this page */
  collection: string

  /** The actual page document (Nuxt Content item) */
  page: unknown | null

  /** Optional navigation tree (docs sidebar, etc.) */
  navigation?: unknown

  /** Optional prev/next surround data */
  surround?: unknown

  /** Optional SEO overrides */
  seo?: {
    title?: string
    description?: string
  }

  /** Arbitrary extra metadata (edit links, flags, etc.) */
  meta?: Record<string, unknown>
}

/**
 * Unified content page composable.
 *
 * All content fetching goes through Foundry's server endpoints
 * (/api/_foundry/content/*) which talk to the SQLite DB directly. We do NOT
 * use the auto-imported `queryCollection` here — its SSR path goes through
 * an internal HTTP roundtrip that breaks under our pinned h3@1 + content@3.13
 * (see `layer/server/utils/content-query.ts` for the bug detail).
 *
 * Going through our own endpoint also gives us a single observable boundary
 * for caching, auth, and rate-limiting later, and removes a layer of
 * environment-conditional code (no `import.meta.server` branching here).
 */
export const useContentPage = () => {
  const route = useRoute()
  const { getCollectionForRoute } = useContentConfig()

  const context = useState<ContentPageContext | null>(
    'content-page',
    () => null,
  )

  const collection = computed(
    () => getCollectionForRoute(route.path) as keyof PageCollections,
  )

  /**
   * Fetch page data for the current route via Foundry's content endpoint.
   */
  const getPage = () => {
    // Preserve root '/' (don't strip its trailing slash into an empty path).
    const path = computed(() => {
      if (route.path === '/') return '/'
      return route.path.endsWith('/')
        ? route.path.slice(0, -1)
        : route.path
    })
    return useFetch<ContentDoc | null>('/api/_foundry/content/page', {
      key: `page-${collection.value}-${path.value}`,
      // Getters keep the query reactive without an unsafe cast through the
      // useFetch query type.
      query: { collection: () => collection.value, path },
      watch: [() => route.path, collection],
    })
  }

  const setContext = (
    page: Record<string, unknown> | null,
    extras?: Partial<Omit<ContentPageContext, 'collection' | 'page' | 'seo'>>,
  ) => {
    if (!page) {
      context.value = null
      return
    }

    const seo = page.seo as Record<string, string> | undefined
    context.value = {
      collection: collection.value,
      page,
      seo: {
        title: seo?.title || (page.title as string),
        description: seo?.description || (page.description as string),
      },
      ...extras,
    }
  }

  return {
    collection,
    getPage,
    setContext,
    context,
  }
}
