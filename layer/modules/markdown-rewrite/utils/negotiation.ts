/**
 * Raw-markdown request parsing.
 *
 * Pure functions only — no h3, no nitro, no filesystem. The Nitro middleware
 * in `../server/middleware/raw-markdown.ts` is the only consumer; keeping the
 * decision logic here is what makes it unit-testable outside a booted server.
 */

/** Nitro server-asset baseName the content directory is mounted under. */
export const CONTENT_ASSET_BASE = 'foundryContent'

/**
 * Directory (relative to `content/`) holding the `pages` collection, per the
 * layer's `content.config.ts` (`include: 'pages/**\/*.md'`, `prefix: '/'`).
 */
export const CONTENT_PAGES_DIR = 'pages'

/**
 * Prefixes the markdown surface must never touch: API routes, Nitro/Nuxt
 * internals (`/_nuxt`, `/__og-image__`, `/_ipx`), well-known probes, feeds.
 */
const RESERVED_PREFIXES = ['/api/', '/_', '/__', '/.well-known/', '/rss/']

export type MarkdownRequestMode = 'suffix' | 'accept'

export interface MarkdownRequest {
  /** Canonical content route the markdown belongs to (e.g. `/blog/post`). */
  contentPath: string
  mode: MarkdownRequestMode
}

/**
 * Normalises a URL path to the shape `@nuxt/content` stores in `path`:
 * no trailing slash, `/index` collapsed to `/`.
 * Returns `null` for anything traversal-shaped.
 */
export function normalizeContentPath(pathname: string): string | null {
  if (!pathname.startsWith('/') || pathname.includes('..') || pathname.includes('\0')) {
    return null
  }
  const trimmed = pathname.replace(/\/+$/, '')
  if (trimmed === '' || trimmed === '/index') return '/'
  return trimmed.replace(/\/index$/, '')
}

/**
 * Does this `Accept` header ask for markdown *in preference to* HTML?
 *
 * A browser sends `text/html,application/xhtml+xml,...,*\/*;q=0.8` — no
 * `text/markdown` token, so this is false and the HTML renderer keeps the
 * route. `*\/*` alone (curl's default) is deliberately not enough: content
 * negotiation here requires the client to name the type it wants.
 */
export function prefersMarkdown(accept: string | undefined | null): boolean {
  if (!accept) return false

  let markdown = -1
  let html = -1

  for (const part of accept.split(',')) {
    const [rawType, ...params] = part.split(';')
    const type = rawType?.trim().toLowerCase()
    if (!type) continue

    const qParam = params.find(p => p.trim().toLowerCase().startsWith('q='))
    const parsed = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1
    const quality = Number.isFinite(parsed) ? parsed : 1

    if (type === 'text/markdown' || type === 'text/x-markdown') {
      markdown = Math.max(markdown, quality)
    }
    else if (type === 'text/html') {
      html = Math.max(html, quality)
    }
  }

  return markdown > 0 && markdown >= html
}

/**
 * Classifies an incoming request as a raw-markdown request, or `null` when the
 * normal (HTML) pipeline owns it.
 *
 * Two access patterns, both live on every Node/Docker deployment:
 *   - `/blog/post.md`               → the `.md` suffix on a content route
 *   - `/blog/post` + `Accept: text/markdown` → content negotiation
 *
 * `/raw/<path>.md` is accepted as an alias of the first form: it is the shape
 * the Vercel edge rewrites and the MCP `get-page` tool already point at.
 */
export function parseMarkdownRequest(
  path: string,
  accept?: string | null,
): MarkdownRequest | null {
  const pathname = (path.split('?')[0] || '/')
  if (!pathname.startsWith('/')) return null
  if (RESERVED_PREFIXES.some(prefix => pathname.startsWith(prefix))) return null

  if (pathname.endsWith('.md')) {
    const base = pathname.slice(0, -'.md'.length)
    const unprefixed = base === '/raw' ? '/' : base.startsWith('/raw/') ? base.slice('/raw'.length) : base
    const contentPath = normalizeContentPath(unprefixed)
    return contentPath ? { contentPath, mode: 'suffix' } : null
  }

  // Never negotiate on an asset URL — `/logo.png` stays `/logo.png`.
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1)
  if (lastSegment.includes('.')) return null

  if (!prefersMarkdown(accept)) return null

  const contentPath = normalizeContentPath(pathname)
  return contentPath ? { contentPath, mode: 'accept' } : null
}

/**
 * The server-asset keys a content route's source file could live at, in
 * preference order (`/a/b` → `pages/a/b.md`, then `pages/a/b/index.md`).
 */
export function contentAssetKeys(contentPath: string, extension = 'md'): string[] {
  const relative = contentPath === '/' ? '' : contentPath.replace(/^\//, '')
  if (!relative) return [`${CONTENT_PAGES_DIR}/index.${extension}`]
  return [
    `${CONTENT_PAGES_DIR}/${relative}.${extension}`,
    `${CONTENT_PAGES_DIR}/${relative}/index.${extension}`,
  ]
}

/**
 * Inverse of {@link contentAssetKeys} for the cases the direct guess misses:
 * ordering prefixes (`1.intro.md`) are stripped from the URL by `@nuxt/content`
 * but kept in the file name. Accepts unstorage's `:`-separated keys too.
 */
export function assetKeyToContentPath(key: string, extension = 'md'): string | null {
  const normalized = key.replace(/:/g, '/')
  const suffix = `.${extension}`
  if (!normalized.startsWith(`${CONTENT_PAGES_DIR}/`) || !normalized.endsWith(suffix)) {
    return null
  }

  const relative = normalized.slice(CONTENT_PAGES_DIR.length + 1, -suffix.length)
  const segments = relative.split('/').map(segment => segment.replace(/^\d+\./, ''))
  if (segments[segments.length - 1] === 'index') segments.pop()

  return normalizeContentPath(`/${segments.join('/')}`)
}
