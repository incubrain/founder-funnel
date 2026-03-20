import type { PageCollections } from '@nuxt/content'

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
 * Handles:
 * - Route-based collection resolution (from app.config.ts)
 * - Page data fetching via useAsyncData
 * - Shared state for layouts/pages/components
 *
 * Usage:
 * ```ts
 * const { page, collection, context } = useContentPage();
 * ```
 */
export const useContentPage = () => {
  const route = useRoute()
  const { getCollectionForRoute } = useContentConfig()

  // Shared state (for components that need access without re-fetching)
  const context = useState<ContentPageContext | null>(
    'content-page',
    () => null,
  )

  // Dynamically determine collection based on route
  const collection = computed(
    () => getCollectionForRoute(route.path) as keyof PageCollections,
  )

  // Context is NOT cleared on route change — old content persists until
  // the new layout calls setContext() with fresh data. This prevents the
  // blank flash that occurred when context was eagerly nulled before the
  // new layout's async getPage() resolved.

  /**
   * Fetch page data for the current route.
   * Wraps useAsyncData with automatic collection resolution.
   */
  const getPage = () => {
    // strip trailing slash
    const path = computed(() =>
      route.path.endsWith('/') ? route.path.slice(0, -1) : route.path,
    )
    return useAsyncData(
      () => `page-${collection.value}-${path.value}`,
      () => {
        return queryCollection(collection.value).path(path.value).first()
      },
      {
        watch: [() => route.path, collection],
      },
    )
  }

  /**
   * Update the shared context (call after fetching page data).
   * Automatically extracts SEO fields from page.
   */
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
    /** Current collection (computed from route) */
    collection,

    /** Fetch page data for current route */
    getPage,

    /** Update shared context after fetching */
    setContext,

    /** Shared context state (read-only for components) */
    context,
  }
}
