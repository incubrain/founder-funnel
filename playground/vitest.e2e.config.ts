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
    // Each `setup()` is expensive; keep specs single-threaded so they share.
    // `singleFork` alone only pins every file to one process — vitest still
    // schedules files' top-level `await setup()` concurrently within it by
    // default, which races multiple Nuxt dev-server boots against the same
    // @nuxt/content sqlite db file (playground rootDir is shared across all
    // e2e spec files) and intermittently throws `SQLITE_BUSY: database is
    // locked`. `fileParallelism: false` forces one file's suite to finish
    // before the next starts.
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    fileParallelism: false,
  },
})
