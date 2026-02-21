import type { H3Event } from 'h3'

/**
 * Handler function that generates RSS XML for a given collection.
 * Registered via module options or Nitro hooks.
 */
export type RSSHandler = (event: H3Event) => Promise<string>

export interface RSSItem {
  title: string
  link: string
  guid: string
  pubDate: string
  description?: string
  category?: string
  author?: string
}

export interface RSSChannel {
  title: string
  link: string
  description: string
  items: RSSItem[]
}

/**
 * Configuration for a single RSS feed.
 * Used in module options under `rss.feeds`.
 */
export interface RSSFeedConfig {
  /** Nuxt Content collection name to query */
  collection: string
  /** Feed title (defaults to `{businessName} {Collection}`) */
  title?: string
  /** Feed description */
  description?: string
  /** Base path for feed item links (e.g. '/blog') */
  basePath?: string
  /** Max items to include (default: 50) */
  limit?: number
  /** Content fields to select — mapped to RSS item fields */
  fields?: RSSFieldMapping
}

/**
 * Maps content collection fields to RSS item fields.
 * Keys are RSS item fields, values are collection field names.
 */
export interface RSSFieldMapping {
  /** Field name for item title (default: 'title') */
  title?: string
  /** Field name for item description (default: 'description') */
  description?: string
  /** Field name for item path/link (default: 'path') */
  path?: string
  /** Field name for item date (default: 'date') */
  date?: string
  /** Field name for item category (default: 'label') */
  category?: string
}

/** RSS module options for nuxt.config.ts */
export interface RSSModuleOptions {
  /** Enable/disable the RSS module (default: true) */
  enabled?: boolean
  /**
   * Named feed configurations.
   * Key = collection route slug (e.g. 'decisions' → /rss/decisions)
   */
  feeds?: Record<string, RSSFeedConfig>
  /** Cache-Control max-age in seconds (default: 3600) */
  cacheTtl?: number
}

export type RSSReaderType = 'feedly' | 'inoreader' | 'newsblur' | 'oldreader' | 'xml' | 'copy'

export interface RssFeedOptions {
  feedPath: string
  feedUrl?: string
  location: string
}

export interface RssAction {
  label: string
  icon: string
  click: () => void
}
