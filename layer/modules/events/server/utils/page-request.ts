import type { H3Event } from 'h3'
import { appendSignal } from './signal-buffer'
import { describeVisitor } from './visitor-class'

/**
 * Server-side page-visit capture — the ingest path for visitors that never run
 * our JavaScript.
 *
 * `ui.page` is emitted by `runtime/plugins/identity.client.ts`, so it only ever
 * exists for a client that booted Nuxt. GPTBot, ClaudeBot and PerplexityBot do a
 * plain GET, parse the HTML and leave: before this, the single most interesting
 * traffic on a Foundry site left no row at all, and the README's
 * every-visit-is-signal claim was false for exactly the visitors the
 * agentic-vs-human KPI (VISION.md) is about.
 *
 * ## `page_request` vs `ui.page` — do not sum them
 *
 * Deliberately a different `name`, not a second `ui.page`:
 *
 * - `page_request` — **one per document GET reaching the server.** Emitted for
 *   every visitor class, JS or not. It does *not* fire on a client-side route
 *   change, because no request is made.
 * - `ui.page` — **one per route the client actually rendered**, including SPA
 *   transitions that never touch the server. Only ever exists for `human`-ish
 *   traffic that runs JS.
 *
 * They measure different things and are never the same row, so a consumer picks
 * one rather than adding them: `ui.page` for "pages a real browser rendered",
 * `page_request` for "documents served", and `page_request` filtered on
 * `visitor.class` / `visitor.subclass` for the agent traffic split. A hard
 * navigation by a JS-capable human legitimately produces one of each — that is
 * two facts, not one fact counted twice.
 *
 * Volume is held down by the filters below rather than by dropping humans: only
 * real page GETs qualify, so a visit adds one row, against the ~60 the identity
 * stream already emits.
 */

/** `page` is capped to the same length the ingest schema allows. */
const MAX_PAGE = 512
const MAX_REFERRER = 512
const MAX_USER_AGENT = 512

/**
 * Route prefixes that are never a page visit. `/api/**` covers the layer's own
 * `_health`, `_signals` and `_foundry` endpoints; the bare forms are listed too
 * so a consuming site that mounts them at the root can't leak rows in.
 */
const IGNORED_PREFIXES = [
  '/api/',
  '/_nuxt/',
  '/_ipx/',
  '/_scripts/',
  '/_signals/',
  '/_health',
  '/_vercel/',
  '/.well-known/',
  '/@vite/',
  '/@id/',
  '/@fs/',
  '/node_modules/',
  '/__nuxt',
  '/__webpack',
]

/**
 * Anything with a file extension is an asset, not a page — favicon.ico,
 * robots.txt, sitemap.xml, *.js, *.css, *.png, *.map. `.html` is the exception:
 * a prerendered site serves real pages at `/about.html`.
 */
const ASSET_EXTENSION = /\.(?!html?$)[a-z0-9]{1,8}$/i

export interface PageRequestCandidate {
  method: string
  path: string
  /** `Accept` request header, if any. */
  accept?: string | null
  /** `Sec-Fetch-Dest`, when the client sends it. */
  secFetchDest?: string | null
  /** True while Nitro is crawling the site to prerender it. */
  prerender?: boolean
}

/**
 * Is this request a real page view worth a signal row?
 *
 * Pure and exported so the rules are unit-testable without booting Nitro.
 *
 * Rejects, in order:
 * 1. **Not a GET.** POSTs are captured by their own handlers; HEAD is a probe.
 * 2. **Prerender-build traffic.** `nuxi generate` crawls the whole site through
 *    the same middleware; those are our own build's fetches, not visitors.
 * 3. **Internal / framework routes** (`IGNORED_PREFIXES`).
 * 4. **Assets** — any path with a non-`.html` file extension.
 * 5. **Non-document fetches.** `Sec-Fetch-Dest` is authoritative when present
 *    (`document` / `iframe` pass, `script`/`image`/`empty` don't), which drops
 *    `$fetch` calls and prefetches from real browsers. When it's absent — the
 *    normal case for a crawler — an `Accept` header that names a type must name
 *    an HTML-ish one; a wildcard `Accept` and a missing `Accept` both pass,
 *    because that is what a bare crawler GET looks like.
 */
export function isPageRequest(candidate: PageRequestCandidate): boolean {
  const { method, path, accept, secFetchDest, prerender } = candidate

  if (method.toUpperCase() !== 'GET') return false
  if (prerender) return false

  const pathname = (path.split('?')[0] || '/').toLowerCase()

  if (IGNORED_PREFIXES.some(prefix => pathname.startsWith(prefix))) return false
  if (ASSET_EXTENSION.test(pathname)) return false

  if (secFetchDest) return secFetchDest === 'document' || secFetchDest === 'iframe'

  if (accept) {
    const wantsHtml = accept.includes('text/html')
      || accept.includes('application/xhtml')
      || accept.includes('*/*')
    if (!wantsHtml) return false
  }

  return true
}

/** Query string stripped: `page` matches `pageContext()` on the client, which reports `location.pathname`. */
export function pageFromPath(path: string): string {
  return (path.split('?')[0] || '/').slice(0, MAX_PAGE)
}

const truncate = (value: string | undefined, max: number) =>
  value ? value.slice(0, max) : undefined

/**
 * Append one `page_request` row for a document GET.
 *
 * Fire-and-forget, exactly like `captureMcpToolCall()`: signal capture must
 * never fail, slow, or change the response a visitor gets. A dropped row costs
 * a data point; a thrown one costs the page.
 */
export function capturePageRequest(event: H3Event): void {
  try {
    const userAgent = getHeader(event, 'user-agent')

    if (!isPageRequest({
      method: event.method,
      path: event.path,
      accept: getHeader(event, 'accept'),
      secFetchDest: getHeader(event, 'sec-fetch-dest'),
      prerender: isPrerenderRequest(event),
    })) return

    void appendSignal({
      kind: 'event',
      name: 'page_request',
      visitor: describeVisitor(userAgent),
      page: pageFromPath(event.path),
      referrer: truncate(getHeader(event, 'referer'), MAX_REFERRER),
      data: {
        userAgent: truncate(userAgent, MAX_USER_AGENT) ?? null,
      },
    }, event).catch(() => {
      // Buffer append failed — never surfaces to the visitor.
    })
  }
  catch {
    // Same for a synchronous throw (no storage mounted, no request context).
  }
}

/**
 * True while the request is Nitro prerendering the site rather than a visitor
 * fetching it. `import.meta.prerender` is the build-time flag; the header is set
 * by the prerenderer on each crawled route and covers the runtime case.
 */
function isPrerenderRequest(event: H3Event): boolean {
  if (import.meta.prerender) return true
  return getHeader(event, 'x-nitro-prerender') !== undefined
}
