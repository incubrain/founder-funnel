// Server-side page-visit capture, end to end (product-validator-m0f.3).
//
// The claim under test: a visitor that runs zero JavaScript still leaves a row
// in the signal stream. Everything else in the events module is client-driven,
// so this is the only place the claim can actually be proved — a unit test can
// check the filter rules but not that the middleware is mounted, that the row
// reaches the ring buffer, or that Polaris can pull it back out.
//
// Shape: boot the dev server, make plain GETs with crawler User-Agents (no
// browser, no JS), then read `/api/_signals/export` with the bearer token the
// external consumer would use.

import { fileURLToPath } from 'node:url'
import { describe, expect, it, beforeAll } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils/e2e'

const EXPORT_TOKEN = 'e2e-signal-export-token'

// Set before `setup()` so the spawned Nuxt process inherits it — the export
// endpoint answers 503, not 401, when the token is unconfigured.
process.env.NUXT_SIGNAL_EXPORT_TOKEN = EXPORT_TOKEN

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  browser: false,
  dev: true,
})

interface SignalRow {
  name: string
  page?: string
  visitor?: { class?: string, subclass?: string }
  data?: Record<string, unknown>
  env?: string
}

const testBase = () => useTestContext().url!

/** A plain GET with a crawler UA — no JS, exactly what a bot does. */
const crawl = (path: string, userAgent: string) =>
  fetch(new URL(path, testBase()), { headers: { 'user-agent': userAgent } })

async function exportRows(): Promise<SignalRow[]> {
  const res = await fetch(new URL('/api/_signals/export?limit=2000', testBase()), {
    headers: { authorization: `Bearer ${EXPORT_TOKEN}` },
  })
  expect(res.status, 'export endpoint should authorise the bearer token').toBe(200)
  const body = await res.json() as { rows: SignalRow[] }
  return body.rows
}

const GPT_BOT = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot'
const CHATGPT_USER = 'Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)'
const CLAUDE_SEARCH = 'Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +https://www.anthropic.com)'

describe('server-side page capture (product-validator-m0f.3)', () => {
  let rows: SignalRow[]

  beforeAll(async () => {
    // Pages a crawler would hit …
    await crawl('/render-default', GPT_BOT)
    await crawl('/render-hero', CHATGPT_USER)
    await crawl('/render-article', CLAUDE_SEARCH)
    // … an agent-native markdown fetch, which must ALSO produce a row
    // (product-validator-m0f.15) …
    await crawl('/render-article.md', CLAUDE_SEARCH)
    // … and traffic that must NOT produce a page-visit row.
    await crawl('/robots.txt', GPT_BOT)
    await crawl('/api/_health', GPT_BOT)

    rows = await exportRows()
  })

  it('captures a non-JS crawler GET that never runs the client bundle', () => {
    const hit = rows.find(r => r.name === 'page_request' && r.page === '/render-default')

    expect(
      hit,
      'a plain GPTBot GET left no row — the every-visit-is-signal claim is false for non-JS agents',
    ).toBeDefined()
    expect(hit!.visitor?.class).toBe('agent')
    expect(hit!.visitor?.subclass).toBe('training')
    expect(String(hit!.data?.userAgent)).toContain('GPTBot')
  })

  it('captures a `.md` document fetch and labels it markdown (product-validator-m0f.15)', () => {
    const hit = rows.find(r => r.name === 'page_request' && r.page === '/render-article.md')

    expect(
      hit,
      'a `.md` fetch left no row — agent-native document requests must count as page_request',
    ).toBeDefined()
    expect(hit!.data?.format).toBe('markdown')

    const htmlHit = rows.find(r => r.name === 'page_request' && r.page === '/render-article')
    expect(htmlHit!.data?.format).toBe('html')
  })

  it('stamps the sub-class from the request UA (product-validator-m0f.2)', () => {
    const subclassFor = (page: string) =>
      rows.find(r => r.name === 'page_request' && r.page === page)?.visitor?.subclass

    expect(subclassFor('/render-hero')).toBe('live-user-fetch')
    expect(subclassFor('/render-article')).toBe('search')
  })

  it('uses `page_request`, never `ui.page`, for the server-side row', () => {
    // The names are deliberately distinct so a consumer can dedupe: `ui.page`
    // is client-only and also fires on SPA route changes that make no request.
    const serverRows = rows.filter(r => r.name === 'page_request')
    expect(serverRows.length).toBeGreaterThan(0)

    // No JS ran in this suite at all, so nothing can have emitted `ui.page`.
    expect(rows.filter(r => r.name === 'ui.page')).toHaveLength(0)
  })

  it('does not capture assets or API routes', () => {
    const pages = rows.filter(r => r.name === 'page_request').map(r => r.page)

    expect(pages).not.toContain('/robots.txt')
    expect(pages).not.toContain('/api/_health')
    expect(pages.some(p => p?.startsWith('/api/'))).toBe(false)
    expect(pages.some(p => p?.startsWith('/_nuxt/'))).toBe(false)
  })

  it('emits exactly one row per document GET', async () => {
    const before = (await exportRows()).filter(
      r => r.name === 'page_request' && r.page === '/render-layout-default',
    ).length

    await crawl('/render-layout-default', GPT_BOT)

    const after = (await exportRows()).filter(
      r => r.name === 'page_request' && r.page === '/render-layout-default',
    ).length

    expect(after - before).toBe(1)
  })

  it('stamps env:"local" on every row under the dev-mode test server (polaris local-debug marker)', () => {
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every(r => r.env === 'local')).toBe(true)
  })
})
