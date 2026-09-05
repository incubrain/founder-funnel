import { describe, it, expect } from 'vitest'
import {
  isMcpRequest,
  extractMcpToolCalls,
} from '@incubrain/foundry/server/utils/mcp-request'

describe('isMcpRequest', () => {
  it('accepts a POST to the default /mcp route', () => {
    expect(isMcpRequest('POST', '/mcp')).toBe(true)
  })

  it('accepts a POST to a named /mcp/<handler> route', () => {
    expect(isMcpRequest('POST', '/mcp/docs')).toBe(true)
  })

  it('is case-insensitive on the method', () => {
    expect(isMcpRequest('post', '/mcp')).toBe(true)
  })

  it('keeps the query string out of the decision', () => {
    expect(isMcpRequest('POST', '/mcp?foo=bar')).toBe(true)
  })

  it('rejects a GET (the SSE stream / deeplink / badge routes)', () => {
    expect(isMcpRequest('GET', '/mcp')).toBe(false)
    expect(isMcpRequest('GET', '/mcp/deeplink')).toBe(false)
    expect(isMcpRequest('GET', '/mcp/badge.svg')).toBe(false)
  })

  it('rejects a DELETE (session termination)', () => {
    expect(isMcpRequest('DELETE', '/mcp')).toBe(false)
  })

  it('rejects unrelated routes', () => {
    expect(isMcpRequest('POST', '/api/v1/webhook')).toBe(false)
    expect(isMcpRequest('POST', '/api/_signals/ingest')).toBe(false)
    expect(isMcpRequest('POST', '/mcpx')).toBe(false)
  })
})

describe('extractMcpToolCalls', () => {
  it('extracts a single tools/call message', () => {
    const body = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list-pages', arguments: {} } }

    expect(extractMcpToolCalls(body)).toEqual([{ tool: 'list-pages', args: {} }])
  })

  it('carries the call arguments through untouched', () => {
    const body = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'get-page', arguments: { path: '/en/getting-started' } },
    }

    expect(extractMcpToolCalls(body)).toEqual([
      { tool: 'get-page', args: { path: '/en/getting-started' } },
    ])
  })

  it('defaults to an empty args object when arguments is missing', () => {
    const body = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list-pages' } }

    expect(extractMcpToolCalls(body)).toEqual([{ tool: 'list-pages', args: {} }])
  })

  it('extracts every tools/call in a batch, in order', () => {
    const body = [
      { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list-pages', arguments: {} } },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get-page', arguments: { path: '/a' } } },
    ]

    expect(extractMcpToolCalls(body)).toEqual([
      { tool: 'list-pages', args: {} },
      { tool: 'get-page', args: { path: '/a' } },
    ])
  })

  it('ignores non-tools/call methods in a batch (initialize, tools/list, notifications)', () => {
    const body = [
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } },
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { jsonrpc: '2.0', id: 2, method: 'tools/list' },
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'list-pages', arguments: {} } },
    ]

    expect(extractMcpToolCalls(body)).toEqual([{ tool: 'list-pages', args: {} }])
  })

  it('ignores a JSON-RPC response mixed into a batch', () => {
    const body = [
      { jsonrpc: '2.0', id: 1, result: { ok: true } },
      { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'list-pages', arguments: {} } },
    ]

    expect(extractMcpToolCalls(body)).toEqual([{ tool: 'list-pages', args: {} }])
  })

  it('returns nothing for a tools/call with a missing or blank name', () => {
    expect(extractMcpToolCalls({ method: 'tools/call', params: {} })).toEqual([])
    expect(extractMcpToolCalls({ method: 'tools/call', params: { name: '' } })).toEqual([])
    expect(extractMcpToolCalls({ method: 'tools/call', params: { name: 42 } })).toEqual([])
  })

  it('reduces a non-object arguments value to an empty object rather than throwing', () => {
    const body = { method: 'tools/call', params: { name: 'list-pages', arguments: 'not-an-object' } }

    expect(extractMcpToolCalls(body)).toEqual([{ tool: 'list-pages', args: {} }])
  })

  it('returns nothing for malformed or empty bodies', () => {
    expect(extractMcpToolCalls(null)).toEqual([])
    expect(extractMcpToolCalls(undefined)).toEqual([])
    expect(extractMcpToolCalls('not json')).toEqual([])
    expect(extractMcpToolCalls(42)).toEqual([])
    expect(extractMcpToolCalls([])).toEqual([])
    expect(extractMcpToolCalls([null, 'x', 42])).toEqual([])
  })

  it('caps the number of messages a single batch can contribute', () => {
    const body = Array.from({ length: 200 }, (_, i) => ({
      jsonrpc: '2.0',
      id: i,
      method: 'tools/call',
      params: { name: 'list-pages', arguments: {} },
    }))

    expect(extractMcpToolCalls(body).length).toBeLessThan(200)
  })
})
