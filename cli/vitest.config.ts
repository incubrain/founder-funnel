import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'cli',
    environment: 'node',
    include: ['test/**/*.{test,spec}.ts'],
  },
})
