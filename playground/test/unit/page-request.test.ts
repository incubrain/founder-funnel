import { describe, it, expect } from 'vitest'
import {
  isPageRequest,
  pageFromPath,
} from '@incubrain/foundry/modules/events/server/utils/page-request'

/** A bare crawler GET: no Sec-Fetch-Dest, wildcard Accept. */
const crawlerGet = (path: string) => ({
  method: 'GET',
  path,
  accept: '*/*',
})

/** A real browser navigating: Sec-Fetch-Dest is authoritative. */
const browserNavigation = (path: string) => ({
  method: 'GET',
  path,
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  secFetchDest: 'document',
})

describe('isPageRequest', () => {
  it('accepts a crawler GET for a page', () => {
    expect(isPageRequest(crawlerGet('/'))).toBe(true)
    expect(isPageRequest(crawlerGet('/pricing'))).toBe(true)
    expect(isPageRequest(crawlerGet('/docs/getting-started'))).toBe(true)
  })

  it('accepts a browser document navigation', () => {
    expect(isPageRequest(browserNavigation('/pricing'))).toBe(true)
  })

  it('accepts a GET with no Accept header at all', () => {
    expect(isPageRequest({ method: 'GET', path: '/pricing' })).toBe(true)
  })

  it('keeps the query string out of the decision', () => {
    expect(isPageRequest(crawlerGet('/pricing?utm_source=chatgpt'))).toBe(true)
  })

  it('accepts a prerendered .html page path', () => {
    expect(isPageRequest(crawlerGet('/about.html'))).toBe(true)
  })

  it('rejects anything that is not a GET', () => {
    for (const method of ['POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']) {
      expect(isPageRequest({ ...crawlerGet('/pricing'), method }), method).toBe(false)
    }
  })

  it('rejects API and internal routes', () => {
    const paths = [
      '/api/v1/webhook',
      '/api/_signals/export',
      '/api/_signals/ingest',
      '/api/_health',
      '/api/_foundry/content/page',
      '/_signals/export',
      '/_health',
      '/.well-known/security.txt',
      '/_vercel/insights/view',
    ]

    for (const path of paths) expect(isPageRequest(crawlerGet(path)), path).toBe(false)
  })

  it('rejects build-output and dev-server routes', () => {
    const paths = [
      '/_nuxt/entry.abc123.js',
      '/_nuxt/builds/meta/dev.json',
      '/__nuxt_island/Foo',
      '/_ipx/w_640/img/hero.png',
      '/_scripts/abc.js',
      '/@vite/client',
      '/@id/virtual:nuxt',
      '/@fs/Users/x/project/app.vue',
      '/node_modules/.vite/deps/vue.js',
    ]

    for (const path of paths) expect(isPageRequest(crawlerGet(path)), path).toBe(false)
  })

  it('rejects assets by extension', () => {
    const paths = [
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
      '/llms.txt',
      '/img/hero.png',
      '/styles/main.css',
      '/bundle.js.map',
      '/fonts/inter.woff2',
      '/feed.rss',
    ]

    for (const path of paths) expect(isPageRequest(crawlerGet(path)), path).toBe(false)
  })

  it('rejects non-document fetches from a real browser', () => {
    const dests = ['script', 'style', 'image', 'font', 'empty', 'manifest']

    for (const secFetchDest of dests) {
      expect(isPageRequest({ ...browserNavigation('/pricing'), secFetchDest }), secFetchDest)
        .toBe(false)
    }
  })

  it('accepts an iframe embed as a document', () => {
    expect(isPageRequest({ ...browserNavigation('/pricing'), secFetchDest: 'iframe' })).toBe(true)
  })

  it('rejects a data fetch that asks for JSON only', () => {
    expect(isPageRequest({ method: 'GET', path: '/pricing', accept: 'application/json' }))
      .toBe(false)
  })

  it('rejects prerender-build traffic', () => {
    expect(isPageRequest({ ...crawlerGet('/pricing'), prerender: true })).toBe(false)
  })
})

describe('pageFromPath', () => {
  it('strips the query string so `page` matches the client convention', () => {
    expect(pageFromPath('/pricing?utm_source=chatgpt&ref=x')).toBe('/pricing')
  })

  it('passes a bare path through', () => {
    expect(pageFromPath('/docs/getting-started')).toBe('/docs/getting-started')
    expect(pageFromPath('/')).toBe('/')
  })

  it('caps a pathological path at the ingest schema limit', () => {
    expect(pageFromPath(`/${'a'.repeat(900)}`)).toHaveLength(512)
  })
})
