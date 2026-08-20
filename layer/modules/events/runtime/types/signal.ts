/**
 * Signal envelope — ONE shape for everything a Foundry site captures.
 *
 * Analytics events and error/warning logs share this row. Rows land in a capped
 * server-side ring buffer and are pulled by an external consumer (Polaris) via
 * `GET /api/_signals/export`.
 */

export type SignalKind = 'event' | 'log'
export type SignalSeverity = 'error' | 'warning'
export type VisitorClass = 'human' | 'agent' | 'bot'

export interface SignalVisitor {
  anonId?: string
  /**
   * Stamped server-side from the request User-Agent at ingest/append time
   * (see `server/utils/visitor-class.ts`). Client-supplied values are never
   * trusted. Left unset only when no User-Agent was available to classify
   * (e.g. a Nitro error hook with no request context).
   */
  class?: VisitorClass
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
