import { captureMcpRequest } from '../utils/mcp-request'

/**
 * Every `tools/call` JSON-RPC request reaching `/mcp` → one `mcp_tool_called`
 * row, independent of whether the tool's own response cache serves the call.
 *
 * Registered as Nitro middleware (this layer's own `server/middleware/`, auto
 * mounted — no module wrapper needed) so it sees the raw POST body *before*
 * `@nuxtjs/mcp-toolkit`'s cached tool handler ever runs. See
 * `server/utils/mcp-request.ts` for why that ordering is what fixes the
 * cache-window undercount. All the JSON-RPC parsing and the fire-and-forget
 * append live there; this file is only the mount point, same shape as the
 * events module's `server/middleware/page-request.ts`.
 */
export default defineEventHandler(async (event) => {
  await captureMcpRequest(event)
})
