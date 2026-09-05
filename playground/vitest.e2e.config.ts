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
    // Each `setup()` is expensive (boots a real Nuxt/Nitro server, some boot
    // a browser too) and specs share fixed resources (the content sqlite
    // db, dev-server ports) — run test FILES serially, not just within a
    // single fork. `poolOptions.forks.singleFork` was the Vitest 3 spelling
    // for this; Vitest 4 removed nested `poolOptions` in favor of the
    // top-level `fileParallelism` flag (nested `poolOptions` is silently
    // ignored under Vitest 4, which let e2e spec files race on the same
    // content database — see product-validator-m0f.10).
    pool: 'forks',
    fileParallelism: false,
  },
})
