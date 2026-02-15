// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStorage } from '@incubrain/foundry/app/composables/useAppStorage'

describe('useAppStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('prefixes keys correctly', () => {
    const { getKey } = useAppStorage()
    expect(getKey('foo')).toBe('test-app_foo')
  })

  it('sets and gets from local storage', () => {
    const { local } = useAppStorage()
    local.set('foo', 'bar')
    expect(local.get('foo')).toBe('bar')
    expect(localStorage.getItem('test-app_foo')).toBe('bar')
  })

  it('clears prefixed items', () => {
    const { local } = useAppStorage()
    local.set('foo', 'bar')
    localStorage.setItem('other', 'baz')

    local.clear()

    expect(local.get('foo')).toBeNull()
    expect(localStorage.getItem('other')).toBe('baz')
  })
})
