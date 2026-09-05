import type { H3Event } from 'h3'
import { appendSignal } from '../../modules/events/server/utils/signal-buffer'

/**
 * MCP tool calls → the signal buffer.
 *
 * An agent calling `get-page` has read the site, decided which page it wants and
 * asked for it by name. That is the highest-intent traffic a Foundry site sees,
 * and until now it was the only traffic that left no row behind. Every tool in
 * `server/mcp/tools/` calls this so the agentic side of the human-vs-agent split
 * (VISION.md) is measured, not assumed.
 *
 * Deliberately fire-and-forget: signal capture must never fail, slow, or change
 * the result of a tool call.
 */

/** Keep one argument value from bloating a buffered row. */
const MAX_ARG_CHARS = 200

/** Ignore pathological arg objects rather than serialising them. */
const MAX_ARG_KEYS = 10

/**
 * Compact, log-safe rendering of the tool arguments: scalars stringified and
 * truncated, everything else reduced to its type. Enough to answer "what were
 * agents asking for", without copying page content into the buffer.
 */
export function summariseToolArgs(
  args: Record<string, unknown> = {},
): Record<string, string> {
  const summary: Record<string, string> = {}

  for (const [key, value] of Object.entries(args).slice(0, MAX_ARG_KEYS)) {
    if (value === undefined || value === null) continue

    const rendered = typeof value === 'object'
      ? (Array.isArray(value) ? `[array:${value.length}]` : '[object]')
      : String(value)

    summary[key] = rendered.length > MAX_ARG_CHARS
      ? `${rendered.slice(0, MAX_ARG_CHARS)}…`
      : rendered
  }

  return summary
}

/**
 * Append one `mcp_tool_called` event row.
 *
 * `visitor.class` is stamped `agent` rather than derived from the UA: MCP is an
 * agent-only transport, so the transport itself is the classification. MCP
 * clients also send wildly inconsistent User-Agents (or none), which
 * `classifyVisitor()` would read as `bot`. The raw UA is kept in `data` so the
 * consumer can still tell clients apart.
 *
 * Note: tools that declare a `cache` window only reach this on a cache miss, so
 * repeated identical calls inside the window are not counted separately.
 */
export function captureMcpToolCall(
  tool: string,
  args: Record<string, unknown> = {},
  event?: H3Event,
): void {
  try {
    void appendSignal({
      kind: 'event',
      name: 'mcp_tool_called',
      visitor: { class: 'agent' },
      data: {
        tool,
        args: summariseToolArgs(args),
        userAgent: event ? getHeader(event, 'user-agent') ?? null : null,
      },
    }, event).catch(() => {
      // Buffer append failed — a dropped row must not surface to the agent.
    })
  }
  catch {
    // Same for a synchronous throw (no storage mounted, no request context).
  }
}
