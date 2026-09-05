import type { VisitorClass } from '../../runtime/types/signal'
import { AI_AGENT_TOKENS, AI_VENDOR_HINTS } from '../../../../shared/ai-agents'

/**
 * `visitor.class` classification — server-side only, from the request User-Agent.
 * Client-supplied `visitor.class` is never trusted (see signals-ingest.post.ts,
 * which strips it before append).
 *
 * The AI/agent side of the taxonomy lives in `shared/ai-agents.ts` — one list,
 * shared with the robots.txt policy in `modules/ai-robots.ts`, so a crawler can
 * never be "an agent" for analytics and unknown to robots.txt (or vice versa).
 *
 * Kept as a small hand-rolled matcher rather than pulling in `isbot`: this repo's
 * library-first rule was checked, but `isbot`'s single `isbot()` boolean doesn't
 * separate "classic crawler" from "AI agent" — the split this task needs — and it
 * isn't installed anywhere in this monorepo's lockfile. The pattern lists below
 * are short enough to stay readable; swap in `isbot` for the classic-crawler
 * branch later if its broader coverage turns out to matter.
 *
 * Order matters: AI/agent patterns are checked before classic bot patterns, so a
 * UA that could match both (e.g. `Claude-SearchBot`, which also matches `bot\b`)
 * resolves to `agent`.
 */

const escapeRegExp = (token: string) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// AI agents, assistant fetchers, and automation/headless browsers, built from
// the shared taxonomy plus the loose vendor substrings it carries.
const AGENT_PATTERNS: RegExp[] = [...AI_AGENT_TOKENS, ...AI_VENDOR_HINTS]
  .map(token => new RegExp(escapeRegExp(token), 'i'))

// Classic search/scrape crawlers and non-browser HTTP clients (isbot-style).
const BOT_PATTERNS: RegExp[] = [
  /bot\b/i,
  /spider/i,
  /crawl(er)?/i,
  /slurp/i,
  /facebookexternalhit/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /scrapy/i,
  /node-fetch/i,
  /go-http-client/i,
  /postmanruntime/i,
  /axios\//i,
]

/**
 * Classify a request's visitor from its User-Agent header. Pure function — no
 * I/O, no request access — so callers pass the header string they already have.
 *
 * Missing/empty UA is treated as `bot`: a real browser always sends one, so its
 * absence points to a script or automated client rather than a human visitor.
 */
export function classifyVisitor(userAgent: string | undefined | null): VisitorClass {
  const ua = userAgent?.trim()
  if (!ua) return 'bot'

  if (AGENT_PATTERNS.some(pattern => pattern.test(ua))) return 'agent'
  if (BOT_PATTERNS.some(pattern => pattern.test(ua))) return 'bot'

  return 'human'
}
