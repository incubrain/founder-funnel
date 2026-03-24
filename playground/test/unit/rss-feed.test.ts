import { describe, it, expect } from 'vitest'
import { escapeXml, buildRSSFeed } from '@incubrain/foundry/modules/rss/server/utils/rss-feed'
import type { RSSChannel } from '@incubrain/foundry/modules/rss/runtime/types'

describe('escapeXml', () => {
  it('should escape ampersands', () => {
    expect(escapeXml('A & B')).toBe('A &amp; B')
  })

  it('should escape angle brackets', () => {
    expect(escapeXml('<script>')).toBe('&lt;script&gt;')
  })

  it('should escape quotes', () => {
    expect(escapeXml('"hello" & \'world\'')).toBe('&quot;hello&quot; &amp; &apos;world&apos;')
  })

  it('should handle strings with no special characters', () => {
    expect(escapeXml('plain text')).toBe('plain text')
  })

  it('should handle empty string', () => {
    expect(escapeXml('')).toBe('')
  })
})

describe('buildRSSFeed', () => {
  const siteUrl = 'https://example.com'

  const makeChannel = (items: RSSChannel['items'] = []): RSSChannel => ({
    title: 'Test Feed',
    link: `${siteUrl}/feed`,
    description: 'A test RSS feed',
    items,
  })

  it('should produce valid XML with correct root element', () => {
    const xml = buildRSSFeed(makeChannel(), siteUrl)
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('</rss>')
  })

  it('should include channel metadata', () => {
    const xml = buildRSSFeed(makeChannel(), siteUrl)
    expect(xml).toContain('<title>Test Feed</title>')
    expect(xml).toContain(`<link>${siteUrl}/feed</link>`)
    expect(xml).toContain('<description>A test RSS feed</description>')
  })

  it('should render items with required fields', () => {
    const items = [{
      title: 'Decision 1',
      link: `${siteUrl}/decisions/1`,
      guid: `${siteUrl}/decisions/1`,
      pubDate: new Date('2026-01-15').toUTCString(),
    }]
    const xml = buildRSSFeed(makeChannel(items), siteUrl)
    expect(xml).toContain('<title>Decision 1</title>')
    expect(xml).toContain(`<link>${siteUrl}/decisions/1</link>`)
    expect(xml).toContain('<pubDate>')
  })

  it('should include optional fields when present', () => {
    const items = [{
      title: 'Decision 2',
      link: `${siteUrl}/decisions/2`,
      guid: `${siteUrl}/decisions/2`,
      pubDate: new Date().toUTCString(),
      category: 'Architecture',
      author: 'Jane Doe',
      description: 'Switched to microservices',
    }]
    const xml = buildRSSFeed(makeChannel(items), siteUrl)
    expect(xml).toContain('<category>Architecture</category>')
    expect(xml).toContain('<dc:creator>Jane Doe</dc:creator>')
    expect(xml).toContain('<description>Switched to microservices</description>')
  })

  it('should escape special characters in content', () => {
    const items = [{
      title: 'A & B <Decision>',
      link: `${siteUrl}/decisions/3`,
      guid: `${siteUrl}/decisions/3`,
      pubDate: new Date().toUTCString(),
    }]
    const xml = buildRSSFeed(makeChannel(items), siteUrl)
    expect(xml).toContain('A &amp; B &lt;Decision&gt;')
  })

  it('should handle empty items array', () => {
    const xml = buildRSSFeed(makeChannel([]), siteUrl)
    expect(xml).toContain('<channel>')
    expect(xml).not.toContain('<item>')
  })

  it('should include atom self-link', () => {
    const xml = buildRSSFeed(makeChannel(), siteUrl)
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"')
    expect(xml).toContain('rel="self"')
  })
})
