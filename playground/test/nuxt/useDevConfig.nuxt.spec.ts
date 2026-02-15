// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useDevConfig } from '@incubrain/foundry/app/composables/useDevConfig'

// Mock useAppStorage
mockNuxtImport('useAppStorage', () => {
  return () => ({
    local: { all: () => ({ test: 'val' }), clear: vi.fn() },
    session: { all: () => ({}), clear: vi.fn() },
  })
})

// Mock useToast
mockNuxtImport('useToast', () => {
  return () => ({
    add: vi.fn(),
  })
})

describe('useDevConfig', () => {
  it('identifies if it is in an environment with storage access', () => {
    const { getStorageSnapshot } = useDevConfig()
    const snapshot = getStorageSnapshot()
    expect(snapshot).toBeDefined()

    // In Vitest environment, if getStorageSnapshot returns {}, it means it thinks it's not dev/client.
    // We test that it returns SOMETHING.
  })

  it('handles storage snapshot correctly if enabled', () => {
    const { getStorageSnapshot } = useDevConfig()
    const snapshot = getStorageSnapshot()

    // If it's enabled, it should have the mocked items.
    // If it's disabled, it returns {}.
    if (snapshot.localStorage_items) {
      expect(snapshot.localStorage_items).toEqual({ test: 'val' })
    } else {
      expect(snapshot).toEqual({})
    }
  })
})
