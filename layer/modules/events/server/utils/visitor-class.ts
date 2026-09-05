import type { VisitorClass, VisitorSubclass } from '../../runtime/types/signal'
import { AI_AGENT_PURPOSE_GROUPS, AI_VENDOR_HINTS } from '../../../../shared/ai-agents'

/**
 * `visitor.class` / `visitor.subclass` classification — server-side only, from
 * the request User-Agent. Client-supplied values are never trusted (see
 * signals-ingest.post.ts, which overwrites them before append).
 *
 * The AI/agent side of the taxonomy lives in `shared/ai-agents.ts` — one list,
 * shared with the robots.txt policy in `modules/ai-robots.ts`, so a crawler can
 * never be "an agent" for analytics and unknown to robots.txt (or vice versa).
 * The *sub-class* comes from the same file's purpose grouping, so the split
 * robots.txt is generated from and the split the signal stream reports are the
 * same split by construction.
 *
 * Kept as a small hand-rolled matcher rather than pulling in `isbot`: this repo's
 * library-first rule was checked, but `isbot`'s single `isbot()` boolean doesn't
 * separate "classic crawler" from "AI agent" — let alone training from live
 * user fetch — and it isn't installed anywhere in this monorepo's lockfile. The
 * pattern lists below are short enough to stay readable; swap in `isbot` for the
 * classic-crawler branch later if its broader coverage turns out to matter.
 *
 * Two ordering rules, both load-bearing:
 *
 * 1. AI/agent patterns are checked before classic bot patterns, so a UA that
 *    matches both (e.g. `Claude-SearchBot`, which also matches `bot\b`) resolves
 *    to `agent`.
 * 2. Published tokens are matched **longest first**, so a token that contains a
 *    shorter one (`Applebot-Extended` over a future `Applebot`, `Ai2Bot-Dolma`
 *    over `AI2Bot`) wins and the more specific purpose is reported.
 */

const escapeRegExp = (token: string) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

interface AgentPattern {
  pattern: RegExp
  subclass?: VisitorSubclass
}

// Published tokens carry their purpose; longest token first so a specific token
// never loses to a shorter one it contains.
const PUBLISHED_AGENT_PATTERNS: AgentPattern[] = AI_AGENT_PURPOSE_GROUPS
  .flatMap(({ purpose, tokens }) => tokens.map(token => ({ token, purpose })))
  .sort((a, b) => b.token.length - a.token.length)
  .map(({ token, purpose }) => ({
    pattern: new RegExp(escapeRegExp(token), 'i'),
    subclass: purpose,
  }))

// Loose vendor substrings, checked only after every published token has missed.
// They prove "this is an AI agent" but say nothing about what the fetch was for,
// so they deliberately carry no subclass.
const VENDOR_AGENT_PATTERNS: AgentPattern[] = AI_VENDOR_HINTS
  .map(token => ({ pattern: new RegExp(escapeRegExp(token), 'i') }))

const AGENT_PATTERNS: AgentPattern[] = [
  ...PUBLISHED_AGENT_PATTERNS,
  ...VENDOR_AGENT_PATTERNS,
]

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

export interface VisitorClassification {
  class: VisitorClass
  /** Set only for `class: 'agent'` matched by a published token. */
  subclass?: VisitorSubclass
}

/**
 * Full classification of a request's visitor from its User-Agent. Pure function
 * — no I/O, no request access — so callers pass the header string they have.
 *
 * Missing/empty UA is treated as `bot`: a real browser always sends one, so its
 * absence points to a script or automated client rather than a human visitor.
 */
export function describeVisitor(
  userAgent: string | undefined | null,
): VisitorClassification {
  const ua = userAgent?.trim()
  if (!ua) return { class: 'bot' }

  const agent = AGENT_PATTERNS.find(({ pattern }) => pattern.test(ua))
  if (agent) return { class: 'agent', subclass: agent.subclass }

  if (BOT_PATTERNS.some(pattern => pattern.test(ua))) return { class: 'bot' }

  return { class: 'human' }
}

/**
 * `visitor.class` only. Kept as the primary entry point: most callers stamp one
 * field, and the three-value enum is what external consumers already group on.
 * Use `describeVisitor()` when the sub-class is wanted too.
 */
export function classifyVisitor(userAgent: string | undefined | null): VisitorClass {
  return describeVisitor(userAgent).class
}
