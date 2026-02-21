import type { RSSFeedConfig } from '../types'

interface RSSFeedInfo {
  /** Feed slug (key from config) */
  name: string
  /** Full URL to the RSS XML */
  url: string
  /** Feed title */
  title: string
  /** Feed description */
  description?: string
}

/**
 * Provides RSS feed metadata and the feeds page URL.
 * Used by ConvertRss button and the RSS feeds page.
 */
export function useRssFeed() {
  const config = useRuntimeConfig()
  const { trackEvent } = useEvents()

  const rssConfig = computed(() => (config.public as Record<string, unknown>).rss as {
    feeds: Record<string, RSSFeedConfig>
    route: string
  } | undefined)

  const feedsPageUrl = computed(() => rssConfig.value?.route || '/rss-feeds')

  const feeds = computed<RSSFeedInfo[]>(() => {
    const feedsMap = rssConfig.value?.feeds || {}
    return Object.entries(feedsMap).map(([name, feed]) => ({
      name,
      url: `${config.public.siteUrl}/rss/${name}`,
      title: feed.title || name.charAt(0).toUpperCase() + name.slice(1),
      description: feed.description,
    }))
  })

  const trackClick = (location: string) => {
    trackEvent({
      id: `offer_click_rss_${location}`,
      type: 'offer_click',
      target: 'rss_feeds_page',
    })
  }

  return {
    feeds,
    feedsPageUrl,
    trackClick,
  }
}
