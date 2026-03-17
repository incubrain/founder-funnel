import { inject, type Ref } from 'vue'
import type { ContentNavigationItem, Collections } from '@nuxt/content'

/**
 * Centralized composable for content route resolution and path helpers.
 *
 * Most consumers should use `queryCollection('collectionName')` directly
 * (Nuxt Content provides full type safety). This composable handles:
 * - Route → collection mapping (which collection serves a given URL path)
 * - Internal path resolution (for markdown cross-links)
 * - Navigation metadata lookup (for link popovers)
 * - Routing constants (offers, success, sources paths)
 */
export const useContentConfig = () => {
  const appConfig = useAppConfig()

  /* -------------------------------------------------------------------------- */
  /*                          ROUTE → COLLECTION MAPPING                        */
  /* -------------------------------------------------------------------------- */

  /**
   * Get the route map from app.config.ts.
   * This is a simple { prefix: collectionName } object.
   * Sorted by prefix length descending for specificity.
   */
  const getRouteMap = (): Array<{ prefix: string, collection: keyof Collections }> => {
    const routeMap = appConfig.content?.routeMap as Record<string, string> | undefined
    if (!routeMap) return []

    return Object.entries(routeMap)
      .map(([prefix, collection]) => ({
        prefix,
        collection: collection as keyof Collections,
      }))
      .sort((a, b) => b.prefix.length - a.prefix.length)
  }

  /**
   * Determine which collection a route belongs to based on path prefix.
   *
   * @param path - The route path to match (e.g., '/darksky/intro')
   * @returns The collection key that should be queried
   */
  const getCollectionForRoute = (path: string): keyof Collections => {
    const routes = getRouteMap()

    const normalizedPath
      = path > '/' && path.endsWith('/') ? path.slice(0, -1) : path

    for (const { prefix, collection } of routes) {
      if (
        normalizedPath === prefix
        || normalizedPath.startsWith(`${prefix}/`)
      ) {
        return collection
      }
    }

    return 'pages' as keyof Collections
  }

  /* -------------------------------------------------------------------------- */
  /*                              PATH RESOLUTION                               */
  /* -------------------------------------------------------------------------- */

  const separatePathAndHash = (
    path: string,
  ): { path: string, hash: string } => {
    const hashIndex = path.indexOf('#')
    return hashIndex !== -1
      ? { path: path.slice(0, hashIndex), hash: path.slice(hashIndex) }
      : { path, hash: '' }
  }

  /**
   * Resolve an internal path to include the correct collection prefix.
   * Used by ProseA.vue for cross-document markdown links.
   *
   * @param path - The path to resolve
   * @param collection - Collection key for prefix lookup
   */
  const resolveInternalPath = (
    path: string,
    collection: keyof Collections = 'docs',
  ): string => {
    if (!path) return '/'

    const { path: pathWithoutHash, hash } = separatePathAndHash(path)

    const normalizedPath = pathWithoutHash.startsWith('/')
      ? pathWithoutHash
      : `/${pathWithoutHash}`

    // Check if path already matches any configured route prefix
    const routes = getRouteMap()
    for (const { prefix } of routes) {
      if (
        normalizedPath === prefix
        || normalizedPath.startsWith(`${prefix}/`)
      ) {
        return `${normalizedPath}${hash}`
      }
    }

    // Look up this collection's prefix from the route map
    const entry = routes.find(r => r.collection === (collection as string))
    const prefix = entry?.prefix || ''

    if (!prefix || prefix === '/') return `${normalizedPath}${hash}`

    return `${prefix}${normalizedPath}${hash}`
  }

  /* -------------------------------------------------------------------------- */
  /*                            NAVIGATION HELPERS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Flatten navigation tree for searching
   */
  const flattenNavigation = (
    items?: ContentNavigationItem[],
  ): ContentNavigationItem[] =>
    items?.flatMap(item =>
      item.children ? flattenNavigation(item.children) : [item],
    ) || []

  /**
   * Get page metadata from navigation by path.
   * Used by ProseA.vue for link popovers.
   */
  const getPageMetadata = (path: string) => {
    const navigationAll = inject<Ref<ContentNavigationItem[]>>('navigation_all')
    if (!navigationAll?.value) return null

    const { path: pathWithoutHash } = separatePathAndHash(path)
    const normalizedPath = pathWithoutHash.startsWith('/')
      ? pathWithoutHash
      : `/${pathWithoutHash}`

    const flatNav = flattenNavigation(navigationAll.value)
    const match = flatNav.find(item => item.path === normalizedPath)
    if (match) return match

    return flatNav.find(
      item =>
        item.path?.replace(/\/$/, '') === normalizedPath.replace(/\/$/, ''),
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                              ROUTING CONSTANTS                             */
  /* -------------------------------------------------------------------------- */

  const getRoutingPath = (key: string, fallback: string): string => {
    const routingConfig = appConfig.content?.routing as Record<string, string> | undefined
    return routingConfig?.[key] || fallback
  }

  const routing = {
    pagesBackLabel: (appConfig.content?.pagesBackLabel as string) || 'Back',
    offers: getRoutingPath('offers', '/offers'),
    success: getRoutingPath('success', '/success'),
    sources: getRoutingPath('sources', '/sources'),
    glossary: getRoutingPath('glossary', '/glossary'),
  }

  return {
    getCollectionForRoute,
    resolveInternalPath,
    flattenNavigation,
    getPageMetadata,
    getRoutingPath,
    routing,
  }
}
