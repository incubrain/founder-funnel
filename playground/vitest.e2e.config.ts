import { defineConfig } from 'vitest/config'

// Separate config for E2E rendering tests.
// These boot a real Nitro dev server via @nuxt/test-utils `setup()`, so they
// must NOT run inside the `nuxt` test environment (which uses happy-dom and
// stubs server runtime). Kept out of `vitest.config.ts`'s `include` glob.
export default defineConfig({
  test: {
    name: 'playground-e2e',
    include: ['test/e2e/**/*.{test,spec}.ts'],
    // E2E boots Nuxt — needs a long startup budget.
    testTimeout: 120_000,
    hookTimeout: 180_000,
    pool: 'forks',
    // Spec files MUST run one at a time. Every `setup()` boots a Nuxt fixture
    // against the same `rootDir`, and two of those alive at once race on
    // @nuxt/content's SQLite database — the second loses with
    // `UNIQUE constraint failed: _content_info.__hash__` before a single
    // assertion runs. This replaces the old `poolOptions.forks.singleFork`,
    // which Vitest 4 removed and silently ignored, leaving the suite parallel.
    fileParallelism: false,
    maxWorkers: 1,
  },
})
