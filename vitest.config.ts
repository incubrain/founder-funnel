import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Global describe/it/expect
    projects: ['./playground'], // Auto-detect sub-configs
  },
})
