import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'

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

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildRSSFeed(channel: RSSChannel, siteUrl: string): string {
  const rssItems = channel.items
    .map((item) => {
      const category = item.category
        ? `<category>${escapeXml(item.category)}</category>`
        : ''
      const author = item.author
        ? `<dc:creator>${escapeXml(item.author)}</dc:creator>`
        : ''
      const description = item.description
        ? `<description>${escapeXml(item.description)}</description>`
        : ''

      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${description}
      ${category}
      ${author}
    </item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${channel.link}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>en-us</language>
    <copyright>${new Date().getFullYear()} ${escapeXml(channel.title)}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${siteUrl}/favicon-96x96.png</url>
      <title>${escapeXml(channel.title)}</title>
      <link>${channel.link}</link>
      <width>96</width>
      <height>96</height>
    </image>
    <atom:link href="${siteUrl}/rss/${channel.title.toLowerCase().replace(/\s+/g, '-')}" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`
}

export async function getAuthorName(event: H3Event): Promise<string> {
  const log = useLogger(event)

  try {
    const founder = await queryCollection(event, 'team' as keyof Collections)
      .where('isFounder' as 'id', '=' as never, true as never)
      .first()

    const founderData = founder as Record<string, unknown> | null
    if (founderData?.givenName) {
      return `${founderData.givenName} ${founderData.surname}`
    }
  }
  catch (error: unknown) {
    log.error(error instanceof Error ? error : new Error(String(error)), {
      step: 'rss-author-lookup',
    })
  }

  const siteConfig = await queryCollection(event, 'config' as keyof Collections)
    .where('stem', '=', 'config/site')
    .first()
  const siteData = siteConfig as Record<string, unknown> | null
  return ((siteData?.business as Record<string, unknown> | undefined)?.name as string) || 'Team'
}

export async function getBusinessName(event: H3Event): Promise<string> {
  const siteConfig = await queryCollection(event, 'config' as keyof Collections)
    .where('stem', '=', 'config/site')
    .first()

  const siteData = siteConfig as Record<string, unknown> | null
  return ((siteData?.business as Record<string, unknown> | undefined)?.name as string) || 'Site'
}
