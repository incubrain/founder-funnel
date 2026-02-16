import type { H3Event } from 'h3'
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
  const changelogConfig = appConfig.content?.collections?.changelog
  const changelogBasePath
    = typeof changelogConfig === 'object'
      ? changelogConfig?.prefix || '/changelog'
      : '/changelog'

  // Fetch articles
  const changelogs = await queryCollection(event, changelogConfig.name)
    .select('path', 'title', 'description', 'date', 'label')
    .order('date', 'DESC')
    .limit(50)
    .all()

  // Transform to RSS items
  const items: RSSItem[] = changelogs.map((d: Record<string, string>) => ({
    title: d.title,
    link: `${siteConfig.url}${d.path}`,
    guid: `${siteConfig.url}${d.path}`,
    pubDate: new Date(d.date).toUTCString(),
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
