// MCP tool-call signal capture, end to end (product-validator-m0f.13).
//
// The claim under test: every `tools/call` JSON-RPC request reaching `/mcp`
// leaves exactly one `mcp_tool_called` row — including a second, identical
// call inside a tool's own response cache window. Before this fix,
// `defineMcpTool`'s `cache` option wrapped the tool `handler` (and the
// `captureMcpToolCall()` call inside it) in Nitro's `defineCachedFunction`, so
// a cache hit silently skipped the append. Capture now happens in Nitro
// middleware that parses the raw JSON-RPC body before the cached tool handler
// ever runs, so a cache hit is invisible to the counter — that can only be
// proved by actually hitting a cached tool twice and reading the signal
// buffer back out, the way a unit test on the parsing rules alone cannot.
//
// Shape: boot the dev server, POST raw JSON-RPC `tools/call` requests
// straight to `/mcp`, then read `/api/_signals/export` with the bearer token
// an external consumer would use. The MCP Streamable HTTP transport runs in
// stateless mode here (this repo doesn't configure `mcp.sessions`), which
// accepts a self-contained `tools/call` request without a prior `initialize`
// handshake — see `@modelcontextprotocol/sdk`'s `WebStandardStreamableHTTPServerTransport`:
// session validation and the `Mcp-Protocol-Version` header are both skipped
// when `sessionIdGenerator` is unset.

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils/e2e'

const EXPORT_TOKEN = 'e2e-mcp-signal-export-token'

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
  visitor?: { class?: string, subclass?: string }
  data?: Record<string, unknown>
}

const testBase = () => useTestContext().url!

async function exportRows(): Promise<SignalRow[]> {
  const res = await fetch(new URL('/api/_signals/export?limit=2000', testBase()), {
    headers: { authorization: `Bearer ${EXPORT_TOKEN}` },
  })
  expect(res.status, 'export endpoint should authorise the bearer token').toBe(200)
  const body = await res.json() as { rows: SignalRow[] }
  return body.rows
}

let nextId = 1

/** One self-contained `tools/call` JSON-RPC POST — no session, no prior `initialize`. */
async function callTool(name: string, args: Record<string, unknown> = {}) {
  const res = await fetch(new URL('/mcp', testBase()), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // Streamable HTTP requires both content types in Accept, even in the
      // stateless/JSON-response mode this server runs in.
      'accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: nextId++,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  })
  expect(res.status, `tools/call "${name}" should reach the tool and succeed`).toBe(200)
  return res
}

async function rawMcpRequest(body: unknown) {
  return fetch(new URL('/mcp', testBase()), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify(body),
  })
}

const toolCallRows = (rows: SignalRow[], tool: string) =>
  rows.filter(r => r.name === 'mcp_tool_called' && r.data?.tool === tool)

describe('mcp tool-call signal capture (product-validator-m0f.13)', () => {
  it('emits one row per tools/call request', async () => {
    const before = toolCallRows(await exportRows(), 'what-changed').length

    await callTool('what-changed')

    const after = toolCallRows(await exportRows(), 'what-changed').length

    expect(after - before).toBe(1)
  })

  it('emits two rows for two identical calls inside a tool\'s cache window', async () => {
    // `list-pages` declares `cache: '1h'` — the second call below falls inside
    // that window and used to be swallowed because `captureMcpToolCall()` sat
    // inside `defineMcpTool`'s cached handler. It must now be counted exactly
    // like the first: this middleware sees the raw POST regardless of whether
    // the tool itself serves the call from cache.
    const before = toolCallRows(await exportRows(), 'list-pages').length

    await callTool('list-pages')
    await callTool('list-pages')

    const after = toolCallRows(await exportRows(), 'list-pages').length

    expect(after - before).toBe(2)
  })

  it('stamps visitor.class agent and keeps the raw tool name/args in data', async () => {
    const before = (await exportRows()).length

    await callTool('get-page', { path: '/does-not-exist' })

    const rows = await exportRows()
    const hit = rows.slice(before).find(r => r.name === 'mcp_tool_called' && r.data?.tool === 'get-page')

    expect(hit, 'no mcp_tool_called row was added for this call').toBeDefined()
    expect(hit!.visitor?.class).toBe('agent')
    expect(hit!.data?.args).toMatchObject({ path: '/does-not-exist' })
  })

  it('does not capture the tools/list handshake as a tool call', async () => {
    const before = (await exportRows()).length

    await rawMcpRequest({ jsonrpc: '2.0', id: nextId++, method: 'tools/list' })

    const after = await exportRows()
    expect(after.length).toBe(before)
  })
})
