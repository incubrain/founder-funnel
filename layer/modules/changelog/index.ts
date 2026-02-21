import {
  defineNuxtModule,
  addImports,
  addComponentsDir,
  createResolver,
} from '@nuxt/kit'
import type { ChangelogModuleOptions } from './runtime/types'

export default defineNuxtModule<ChangelogModuleOptions>({
  meta: {
    name: 'changelog',
    configKey: 'changelog',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    enabled: true,
  },

  setup(options, _nuxt) {
    if (!options.enabled) return

    const resolver = createResolver(import.meta.url)

    // Auto-import useChangelog composable
    addImports({
      name: 'useChangelog',
      from: resolver.resolve('./runtime/composables/useChangelog.ts'),
    })

    // Auto-register Changelog component
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      watch: true,
    })
  },
})

export type { ChangelogModuleOptions } from './runtime/types'
export { baseChangelogSchema } from './runtime/types'
