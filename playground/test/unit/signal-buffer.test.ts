import { describe, it, expect } from 'vitest'
import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import {
  createSignalBuffer,
  DEFAULT_SIGNAL_CAPACITY,
  MAX_EXPORT_LIMIT,
} from '@incubrain/foundry/modules/events/server/utils/signal-buffer'
import type { SignalInput } from '@incubrain/foundry/modules/events/runtime/types/signal'

const makeBuffer = (capacity?: number) =>
  createSignalBuffer(createStorage({ driver: memoryDriver() }), { capacity })

const event = (name: string): SignalInput => ({
  kind: 'event',
  name,
  site: 'test-site',
})

describe('createSignalBuffer', () => {
  it('assigns monotonic seq numbers starting at 1', async () => {
    const buffer = makeBuffer()

    const first = await buffer.append(event('a'))
    const second = await buffer.append(event('b'))

    expect(first.seq).toBe(1)
    expect(second.seq).toBe(2)
  })

  it('fills in id and ts when omitted', async () => {
    const row = await makeBuffer().append(event('a'))

    expect(row.id).toBeTruthy()
    expect(row.ts).toBeGreaterThan(0)
  })

  it('preserves a caller-supplied id and ts', async () => {
    const row = await makeBuffer().append({ ...event('a'), id: 'fixed', ts: 42 })

    expect(row.id).toBe('fixed')
    expect(row.ts).toBe(42)
  })

  it('defaults to a 10_000 row capacity', () => {
    expect(makeBuffer().capacity).toBe(DEFAULT_SIGNAL_CAPACITY)
    expect(DEFAULT_SIGNAL_CAPACITY).toBe(10_000)
  })

  it('keeps only the newest rows once capacity is exceeded (wraparound)', async () => {
    const buffer = makeBuffer(3)
    for (const name of ['a', 'b', 'c', 'd', 'e']) await buffer.append(event(name))

    const { rows } = await buffer.read(0, 100)

    expect(rows.map(row => row.name)).toEqual(['c', 'd', 'e'])
    expect(rows.map(row => row.seq)).toEqual([3, 4, 5])
  })

  it('never rewinds seq after eviction', async () => {
    const buffer = makeBuffer(2)
    for (const name of ['a', 'b', 'c']) await buffer.append(event(name))

    const next = await buffer.append(event('d'))
    expect(next.seq).toBe(4)
  })
})

describe('signal buffer cursor semantics', () => {
  it('returns only rows after the cursor', async () => {
    const buffer = makeBuffer()
    for (const name of ['a', 'b', 'c']) await buffer.append(event(name))

    const { rows, cursor } = await buffer.read(1, 100)

    expect(rows.map(row => row.name)).toEqual(['b', 'c'])
    expect(cursor).toBe(3)
  })

  it('returns an empty page and a stable cursor when nothing is new', async () => {
    const buffer = makeBuffer()
    await buffer.append(event('a'))

    const { rows, cursor } = await buffer.read(1, 100)

    expect(rows).toEqual([])
    expect(cursor).toBe(1)
  })

  it('reads an empty buffer without throwing', async () => {
    const { rows, cursor } = await makeBuffer().read(0, 100)

    expect(rows).toEqual([])
    expect(cursor).toBe(0)
  })

  it('honours the limit and lets the cursor page forward', async () => {
    const buffer = makeBuffer()
    for (const name of ['a', 'b', 'c', 'd']) await buffer.append(event(name))

    const first = await buffer.read(0, 2)
    expect(first.rows.map(row => row.name)).toEqual(['a', 'b'])
    expect(first.cursor).toBe(2)

    const second = await buffer.read(first.cursor, 2)
    expect(second.rows.map(row => row.name)).toEqual(['c', 'd'])
    expect(second.cursor).toBe(4)
  })

  it('skips evicted rows when the consumer is far behind', async () => {
    const buffer = makeBuffer(2)
    for (const name of ['a', 'b', 'c', 'd']) await buffer.append(event(name))

    const { rows, cursor } = await buffer.read(0, 100)

    expect(rows.map(row => row.seq)).toEqual([3, 4])
    expect(cursor).toBe(4)
  })

  it('clamps the limit to the export maximum', async () => {
    const buffer = makeBuffer()
    for (let i = 0; i < 5; i++) await buffer.append(event(`e${i}`))

    const { rows } = await buffer.read(0, MAX_EXPORT_LIMIT + 5000)
    expect(rows).toHaveLength(5)
    expect(MAX_EXPORT_LIMIT).toBe(1000)
  })

  it('keeps seq monotonic under concurrent appends', async () => {
    const buffer = makeBuffer()

    await Promise.all(
      Array.from({ length: 20 }, (_, i) => buffer.append(event(`e${i}`))),
    )

    const { rows } = await buffer.read(0, 100)
    expect(rows.map(row => row.seq)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it('resumes seq from persisted storage state', async () => {
    const storage = createStorage({ driver: memoryDriver() })

    const first = createSignalBuffer(storage)
    await first.append(event('a'))
    await first.append(event('b'))

    const resumed = createSignalBuffer(storage)
    const row = await resumed.append(event('c'))

    expect(row.seq).toBe(3)
  })
})
