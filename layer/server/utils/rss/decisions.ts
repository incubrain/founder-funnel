import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import {
  buildRSSFeed,
  getAuthorName,
  getBusinessName,
  type RSSItem,
} from './shared'

// Export as named function (not default export)
export async function generateDecisionsFeed(event: H3Event): Promise<string> {
  const siteConfig = getSiteConfig(event)

  const authorName = await getAuthorName(event)
  const businessName = await getBusinessName(event)

  // Get articles config from appConfig (with fallback)
  // Pages collection can be string or { name, prefix, backLabel }
  const appConfig = useAppConfig()
  const changelogConfig = appConfig.content?.collections?.changelog as Record<string, unknown> | string | undefined
  const changelogBasePath
    = typeof changelogConfig === 'object'
      ? (changelogConfig?.prefix as string) || '/changelog'
      : '/changelog'

  // Fetch articles
  const changelogs = await queryCollection(event, 'changelog' as keyof Collections)
    .select('path' as 'id', 'title' as 'id', 'description' as 'id', 'date' as 'id', 'label' as 'id')
    .order('date' as 'id', 'DESC')
    .limit(50)
    .all()

  // Transform to RSS items
  const items: RSSItem[] = (changelogs as unknown as Record<string, string>[]).map(d => ({
    title: d.title || '',
    link: `${siteConfig.url}${d.path}`,
    guid: `${siteConfig.url}${d.path}`,
    pubDate: d.date ? new Date(d.date).toUTCString() : new Date().toUTCString(),
    description: d.description || '',
    category: d.label || undefined,
    author: authorName,
  }))

  // Build RSS feed
  return buildRSSFeed(
    {
      title: `${businessName} Changelog`,
      link: `${siteConfig.url}${changelogBasePath}`,
      description: `Latest changelogs from ${businessName}`,
      items,
    },
    siteConfig.url,
  )
}
