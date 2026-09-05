import type { H3Event } from 'h3'
import { captureMcpToolCall } from './mcp-signal'

/**
 * MCP tool-call capture at the transport boundary.
 *
 * This is the fix for the gap documented in `mcp-signal.ts`: `defineMcpTool`'s
 * `cache` option (`@nuxtjs/mcp-toolkit`) wraps a tool's `handler` in Nitro's
 * `defineCachedFunction` *outside* the tool code, so a cache hit never runs the
 * handler body at all — including a `captureMcpToolCall()` call sitting inside
 * it. Parsing the JSON-RPC body here, in Nitro middleware that runs before the
 * cached tool handler is ever reached, makes a cache hit invisible to the
 * counter: this always sees the raw POST, cache hit or miss.
 *
 * Tool handlers under `server/mcp/tools/` no longer call `captureMcpToolCall()`
 * themselves — this is now the only call site, so a cache *miss* can't
 * double-count either (one row from here, not a second from the handler).
 */

/** Keep a pathological batch from writing an unbounded number of rows. */
const MAX_BATCH_MESSAGES = 50

export interface McpToolCall {
  tool: string
  args: Record<string, unknown>
}

/**
 * True for a POST to the MCP endpoint — the default `/mcp` route, or a named
 * `/mcp/<handler>` route (`@nuxtjs/mcp-toolkit`'s `ROUTES.CUSTOM_HANDLER`).
 * `/mcp/deeplink` and `/mcp/badge.svg` are GET-only, so the method check alone
 * already excludes them without needing to special-case the paths.
 *
 * Assumes the toolkit's default `mcp.route` (`/mcp`) — this layer doesn't
 * currently read a consumer's `mcp.route` override at runtime.
 */
export function isMcpRequest(method: string, path: string): boolean {
  if (method.toUpperCase() !== 'POST') return false
  const pathname = path.split('?')[0] || '/'
  return pathname === '/mcp' || pathname.startsWith('/mcp/')
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Pull every `tools/call` invocation out of a parsed JSON-RPC body — a single
 * message or a batch array, per the MCP Streamable HTTP transport spec.
 * Anything else (`initialize`, `tools/list`, notifications, responses,
 * malformed entries, a missing/blank tool name) is silently ignored: this only
 * ever counts calls that actually reached a tool handler.
 *
 * Pure and exported so the parsing rules are unit-testable without booting Nitro.
 */
export function extractMcpToolCalls(body: unknown): McpToolCall[] {
  const messages = Array.isArray(body) ? body : [body]
  const calls: McpToolCall[] = []

  for (const message of messages.slice(0, MAX_BATCH_MESSAGES)) {
    if (!isPlainObject(message)) continue
    if (message.method !== 'tools/call') continue

    const params = message.params
    if (!isPlainObject(params)) continue

    const { name } = params
    if (typeof name !== 'string' || !name) continue

    const args = isPlainObject(params.arguments) ? params.arguments : {}
    calls.push({ tool: name, args })
  }

  return calls
}

/**
 * Capture every tool call carried by one MCP POST.
 *
 * Fire-and-forget for the signal writes themselves, exactly like
 * `captureMcpToolCall()` in isolation. The body read has to be awaited — it's
 * the only way to know what was called — but h3 caches the parsed body once
 * read, so the real MCP handler downstream re-reads it for free rather than
 * paying for a second parse.
 */
export async function captureMcpRequest(event: H3Event): Promise<void> {
  if (!isMcpRequest(event.method, event.path)) return

  let body: unknown
  try {
    body = await readBody(event)
  }
  catch {
    // Malformed JSON — the real MCP handler produces the JSON-RPC parse error.
    return
  }

  for (const call of extractMcpToolCalls(body)) {
    captureMcpToolCall(call.tool, call.args, event)
  }
}
