import type { RSSModuleOptions } from '../../runtime/types'
import { registerRSSHandler } from '../utils/rss-registry'
import { createContentFeedHandler } from '../handlers/content-feed'

export default defineNitroPlugin(() => {
  // Read feeds config injected by the module into runtime config
  const config = useRuntimeConfig()
  const rssConfig = (config.public as Record<string, unknown>).rss as RSSModuleOptions | undefined

  if (!rssConfig?.feeds) return

  // Register a handler for each configured feed
  for (const [name, feedConfig] of Object.entries(rssConfig.feeds)) {
    registerRSSHandler(name, createContentFeedHandler(name, feedConfig))
  }
})
