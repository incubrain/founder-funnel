import { describe, it, expect } from 'vitest'
import { summariseToolArgs } from '@incubrain/foundry/server/utils/mcp-signal'

describe('summariseToolArgs', () => {
  it('renders scalar arguments as strings', () => {
    expect(summariseToolArgs({ path: '/en/getting-started', limit: 5, deep: true }))
      .toEqual({ path: '/en/getting-started', limit: '5', deep: 'true' })
  })

  it('returns an empty summary for a tool with no arguments', () => {
    expect(summariseToolArgs()).toEqual({})
    expect(summariseToolArgs({})).toEqual({})
  })

  it('drops null and undefined values rather than stringifying them', () => {
    expect(summariseToolArgs({ since: undefined, until: null, path: '/a' }))
      .toEqual({ path: '/a' })
  })

  it('reduces objects and arrays to a type marker, never their content', () => {
    const summary = summariseToolArgs({ filters: { a: 1 }, paths: ['/a', '/b'] })

    expect(summary.filters).toBe('[object]')
    expect(summary.paths).toBe('[array:2]')
  })

  it('truncates a long value so one call cannot bloat a buffered row', () => {
    const summary = summariseToolArgs({ path: 'x'.repeat(500) })

    expect(summary.path!.length).toBe(201)
    expect(summary.path!.endsWith('…')).toBe(true)
  })

  it('caps the number of keys it copies', () => {
    const args = Object.fromEntries(
      Array.from({ length: 25 }, (_, i) => [`k${i}`, i]),
    )

    expect(Object.keys(summariseToolArgs(args))).toHaveLength(10)
  })
})
