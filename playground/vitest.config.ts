import { resolve } from 'node:path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    name: 'playground',
    environment: 'nuxt',
    globals: true,
    include: ['test/**/*.{test,spec}.ts'],
    environmentOptions: {
      nuxt: {
        rootDir: resolve(__dirname, './'),
        domEnvironment: 'happy-dom',
      },
    },
  },
})
