import { describe, it, expect } from 'vitest'
import {
  assetKeyToContentPath,
  contentAssetKeys,
  normalizeContentPath,
  parseMarkdownRequest,
  prefersMarkdown,
} from '@incubrain/foundry/modules/markdown-rewrite/utils/negotiation'

// The raw-markdown surface (product-validator-m0f.8) has exactly two entry
// shapes. Everything else — assets, API routes, browsers — must fall through
// to the normal HTML pipeline. These assertions are that contract.

describe('prefersMarkdown', () => {
  it('accepts an explicit text/markdown request', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true)
    expect(prefersMarkdown('text/markdown, text/plain;q=0.5')).toBe(true)
    expect(prefersMarkdown('text/x-markdown')).toBe(true)
  })

  it('ignores a browser Accept header', () => {
    const browser
      = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8'
    expect(prefersMarkdown(browser)).toBe(false)
  })

  it('does not treat */* as a markdown request', () => {
    // curl's default. Negotiation requires naming the type you want.
    expect(prefersMarkdown('*/*')).toBe(false)
  })

  it('respects q-values when both types are named', () => {
    expect(prefersMarkdown('text/html;q=0.9, text/markdown;q=1.0')).toBe(true)
    expect(prefersMarkdown('text/html, text/markdown;q=0.5')).toBe(false)
    expect(prefersMarkdown('text/markdown;q=0')).toBe(false)
  })

  it('handles a missing header', () => {
    expect(prefersMarkdown(undefined)).toBe(false)
    expect(prefersMarkdown('')).toBe(false)
  })
})

describe('normalizeContentPath', () => {
  it('collapses index and trailing slashes to the content path', () => {
    expect(normalizeContentPath('/blog/post/')).toBe('/blog/post')
    expect(normalizeContentPath('/index')).toBe('/')
    expect(normalizeContentPath('/')).toBe('/')
    expect(normalizeContentPath('/blog/index')).toBe('/blog')
  })

  it('rejects traversal-shaped paths', () => {
    expect(normalizeContentPath('/../secrets')).toBeNull()
    expect(normalizeContentPath('blog/post')).toBeNull()
  })
})

describe('parseMarkdownRequest — .md suffix', () => {
  it('maps a suffixed route to its content path', () => {
    expect(parseMarkdownRequest('/blog/post.md')).toEqual({
      contentPath: '/blog/post',
      mode: 'suffix',
    })
  })

  it('maps the root and index forms', () => {
    expect(parseMarkdownRequest('/index.md')?.contentPath).toBe('/')
    expect(parseMarkdownRequest('/.md')?.contentPath).toBe('/')
  })

  it('accepts the /raw/<path>.md alias the MCP get-page tool uses', () => {
    expect(parseMarkdownRequest('/raw/blog/post.md')).toEqual({
      contentPath: '/blog/post',
      mode: 'suffix',
    })
  })

  it('drops the query string', () => {
    expect(parseMarkdownRequest('/blog/post.md?utm=x')?.contentPath).toBe('/blog/post')
  })

  it('never intercepts API or internal routes', () => {
    expect(parseMarkdownRequest('/api/_health.md')).toBeNull()
    expect(parseMarkdownRequest('/_nuxt/entry.md')).toBeNull()
    expect(parseMarkdownRequest('/__og-image__/x.md')).toBeNull()
    expect(parseMarkdownRequest('/rss/blog.md')).toBeNull()
  })
})

describe('parseMarkdownRequest — Accept negotiation', () => {
  it('claims a canonical content route asking for markdown', () => {
    expect(parseMarkdownRequest('/blog/post', 'text/markdown')).toEqual({
      contentPath: '/blog/post',
      mode: 'accept',
    })
    expect(parseMarkdownRequest('/', 'text/markdown')?.contentPath).toBe('/')
  })

  it('leaves HTML requests alone', () => {
    expect(parseMarkdownRequest('/blog/post', 'text/html,*/*;q=0.8')).toBeNull()
    expect(parseMarkdownRequest('/blog/post')).toBeNull()
  })

  it('never negotiates on an asset URL', () => {
    expect(parseMarkdownRequest('/logo.png', 'text/markdown')).toBeNull()
    expect(parseMarkdownRequest('/llms.txt', 'text/markdown')).toBeNull()
  })

  it('never negotiates on an API route', () => {
    expect(parseMarkdownRequest('/api/_signals/export', 'text/markdown')).toBeNull()
  })
})

describe('content path ↔ server-asset key', () => {
  it('offers both file and directory-index candidates', () => {
    expect(contentAssetKeys('/blog/post')).toEqual([
      'pages/blog/post.md',
      'pages/blog/post/index.md',
    ])
    expect(contentAssetKeys('/')).toEqual(['pages/index.md'])
  })

  it('inverts keys, stripping @nuxt/content ordering prefixes', () => {
    expect(assetKeyToContentPath('pages/blog/post.md')).toBe('/blog/post')
    expect(assetKeyToContentPath('pages/1.guide/2.install.md')).toBe('/guide/install')
    expect(assetKeyToContentPath('pages/index.md')).toBe('/')
    // unstorage hands back `:`-separated keys.
    expect(assetKeyToContentPath('pages:blog:post.md')).toBe('/blog/post')
  })

  it('ignores keys outside the pages collection', () => {
    expect(assetKeyToContentPath('faq/general.yml')).toBeNull()
    expect(assetKeyToContentPath('team/founder.yml')).toBeNull()
  })
})
