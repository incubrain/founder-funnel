import type { RSSReaderType, RssFeedOptions, RssAction } from '../types'

/**
 * Handles RSS feed URL resolution, reader link generation,
 * and event tracking for RSS subscriptions.
 */
export function useRssFeed(options: RssFeedOptions) {
  const config = useRuntimeConfig()
  const { trackEvent } = useEvents()
  const { copy } = useClipboard()
  const toast = useToast()

  const feedUrl = computed(() => {
    if (options.feedUrl) return options.feedUrl
    return `${config.public.siteUrl}/rss/${options.feedPath}`
  })

  const trackRSSClick = (target: 'internal' | 'external', type: RSSReaderType) => {
    trackEvent({
      id: `offer_click_rss_${options.location}_${options.feedPath}_${type}`,
      type: 'offer_click',
      target: `rss_${target}`,
    })
  }

  const copyFeedUrl = async () => {
    await copy(feedUrl.value)
    trackRSSClick('internal', 'copy')

    toast.add({
      title: 'Feed URL Copied',
      description: 'Paste into your RSS reader',
      icon: 'i-lucide-check',
      color: 'success',
    })
  }

  const openReader = (url: string, type: RSSReaderType) => {
    trackRSSClick('external', type)
    window.open(url, '_blank')
  }

  const actions = computed<RssAction[]>(() => [
    {
      label: 'Copy Feed URL',
      icon: 'i-lucide-copy',
      click: copyFeedUrl,
    },
    {
      label: 'Open Feed',
      icon: 'i-lucide-external-link',
      click: () => {
        trackRSSClick('internal', 'xml')
        window.open(feedUrl.value, '_blank')
      },
    },
    {
      label: 'Feedly',
      icon: 'i-simple-icons-feedly',
      click: () => openReader(
        `https://feedly.com/i/subscription/feed/${encodeURIComponent(feedUrl.value)}`,
        'feedly',
      ),
    },
    {
      label: 'Inoreader',
      icon: 'i-simple-icons-inoreader',
      click: () => openReader(
        `https://www.inoreader.com/?add_feed=${encodeURIComponent(feedUrl.value)}`,
        'inoreader',
      ),
    },
    {
      label: 'NewsBlur',
      icon: 'i-lucide-newspaper',
      click: () => openReader(
        `https://www.newsblur.com/?url=${encodeURIComponent(feedUrl.value)}`,
        'newsblur',
      ),
    },
    {
      label: 'The Old Reader',
      icon: 'i-lucide-book-open',
      click: () => openReader(
        `https://theoldreader.com/feeds/subscribe?url=${encodeURIComponent(feedUrl.value)}`,
        'oldreader',
      ),
    },
  ])

  const handleSelect = (option: RssAction | null) => {
    if (option?.click) option.click()
  }

  return {
    feedUrl,
    actions,
    handleSelect,
  }
}
