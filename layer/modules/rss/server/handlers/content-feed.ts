import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import type { RSSFeedConfig, RSSItem } from '../../runtime/types'
import { buildRSSFeed, getAuthorName, getBusinessName } from '../utils/rss-feed'

/**
 * Creates an RSS handler from a feed config object.
 * This is the generic content-to-RSS pipeline that works with any Nuxt Content collection.
 */
export function createContentFeedHandler(feedName: string, config: RSSFeedConfig) {
  return async (event: H3Event): Promise<string> => {
    const siteConfig = getSiteConfig(event)
    const fields = config.fields || {}

    const authorName = await getAuthorName(event)
    const businessName = await getBusinessName(event)

    // Resolve base path from config or appConfig
    let basePath = config.basePath
    if (!basePath) {
      const appConfig = useAppConfig()
      const collectionConfig = (appConfig.content?.collections as Record<string, unknown> | undefined)?.[config.collection] as Record<string, unknown> | string | undefined
      basePath = typeof collectionConfig === 'object'
        ? (collectionConfig?.prefix as string) || `/${config.collection}`
        : `/${config.collection}`
    }

    // Build select fields list
    const titleField = fields.title || 'title'
    const descField = fields.description || 'description'
    const pathField = fields.path || 'path'
    const dateField = fields.date || 'date'
    const categoryField = fields.category || 'label'

    // Query the collection
    const entries = await queryCollection(event, config.collection as keyof Collections)
      .select(pathField as 'id', titleField as 'id', descField as 'id', dateField as 'id', categoryField as 'id')
      .order(dateField as 'id', 'DESC')
      .limit(config.limit || 50)
      .all()

    // Transform to RSS items
    const items: RSSItem[] = (entries as unknown as Record<string, string>[]).map(entry => ({
      title: entry[titleField] || '',
      link: `${siteConfig.url}${entry[pathField]}`,
      guid: `${siteConfig.url}${entry[pathField]}`,
      pubDate: entry[dateField] ? new Date(entry[dateField]).toUTCString() : new Date().toUTCString(),
      description: entry[descField] || '',
      category: entry[categoryField] || undefined,
      author: authorName,
    }))

    const feedTitle = config.title || `${businessName} ${feedName.charAt(0).toUpperCase() + feedName.slice(1)}`
    const feedDescription = config.description || `Latest ${feedName} from ${businessName}`

    return buildRSSFeed(
      {
        title: feedTitle,
        link: `${siteConfig.url}${basePath}`,
        description: feedDescription,
        items,
      },
      siteConfig.url,
    )
  }
}
