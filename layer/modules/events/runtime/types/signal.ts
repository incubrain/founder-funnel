/**
 * Signal envelope — ONE shape for everything a Foundry site captures.
 *
 * Analytics events and error/warning logs share this row. Rows land in a capped
 * server-side ring buffer and are pulled by an external consumer (Polaris) via
 * `GET /api/_signals/export`.
 */

import type { AiAgentPurpose } from '../../../../shared/ai-agents'

export type SignalKind = 'event' | 'log'
export type SignalSeverity = 'error' | 'warning'
export type VisitorClass = 'human' | 'agent' | 'bot'

/**
 * What an `agent`'s fetch is for. **Additive** to `class`, never a replacement:
 * `class` stays a stable three-value enum because external consumers (Polaris)
 * already group exported rows on it, and widening that enum would silently
 * reclassify historical traffic. A consumer that knows nothing about `subclass`
 * keeps working; one that does can split agent traffic by intent.
 *
 * Owned by the shared AI taxonomy (`layer/shared/ai-agents.ts`) — the same
 * grouping robots.txt is generated from.
 */
export type VisitorSubclass = AiAgentPurpose

export interface SignalVisitor {
  anonId?: string
  /**
   * Stamped server-side from the request User-Agent at ingest/append time
   * (see `server/utils/visitor-class.ts`). Client-supplied values are never
   * trusted. Left unset only when no User-Agent was available to classify
   * (e.g. a Nitro error hook with no request context).
   */
  class?: VisitorClass
  /**
   * Agent sub-class. Only ever set when `class === 'agent'` **and** the UA
   * matched a published token whose purpose is known — an agent recognised only
   * by a loose vendor substring (`AI_VENDOR_HINTS`) carries no subclass, because
   * the vendor does not tell you what the fetch was for.
   */
  subclass?: VisitorSubclass
}

export interface SignalRow {
  id: string
  /** Monotonic cursor. Assigned by the buffer on append. */
  seq: number
  ts: number
  site: string
  kind: SignalKind
  name: string
  severity?: SignalSeverity
  visitor?: SignalVisitor
  page?: string
  referrer?: string
  utm?: Record<string, string>
  /**
   * Review-session tag, from a `?polaris_review=<token>` query param on the
   * page the event was emitted from. Its own top-level field — never squatted
   * into `utm` — and deliberately NOT persisted: only rows emitted during that
   * one page load carry it, which is all an external reviewer needs to bind the
   * tag to a `visitor.anonId`. See `pageContext()` in `runtime/utils/signal.ts`.
   */
  review?: string
  data?: Record<string, unknown>
}

/** What callers hand to `appendSignal()` — the buffer fills in `seq`/`id`/`ts`/`site`. */
export type SignalInput
  = Omit<SignalRow, 'seq' | 'id' | 'ts' | 'site'>
    & Partial<Pick<SignalRow, 'id' | 'ts' | 'site'>>

export interface SignalExportResponse {
  rows: SignalRow[]
  cursor: number
  site: string
}
