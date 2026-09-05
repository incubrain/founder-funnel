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
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    // `singleFork` only pins every spec file to one OS process — Vitest can
    // still interleave multiple files' async `beforeAll` hooks inside that
    // process. Two files booting @nuxt/content's Nuxt fixture at once race
    // on the same `.data/content/contents.sqlite` and one loses with
    // "database is locked". Force strictly sequential file execution.
    fileParallelism: false,
  },
})
