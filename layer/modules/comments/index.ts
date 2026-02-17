import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImports,
  addComponentsDir,
  addServerHandler,
} from '@nuxt/kit'

export interface CommentsModuleOptions {
  enabled: boolean
  logFile: string
}

export default defineNuxtModule<CommentsModuleOptions>({
  meta: {
    name: 'comments',
    configKey: 'comments',
    compatibility: { nuxt: '>=3.0.0' },
  },

  defaults: {
    enabled: true,
    logFile: '.comments/review.jsonl',
  },

  setup(options, nuxt) {
    if (!nuxt.options.dev || !options.enabled) return

    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig._comments = {
      logFile: options.logFile,
    }

    addImports({
      name: 'useDocComments',
      from: resolver.resolve('./runtime/composables/useDocComments'),
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      watch: true,
    })

    addPlugin({
      src: resolver.resolve('./runtime/plugins/comments.client'),
      mode: 'client',
    })

    addServerHandler({
      route: '/api/_comments',
      method: 'get',
      handler: resolver.resolve('./server/handlers/comments.get'),
    })

    addServerHandler({
      route: '/api/_comments',
      method: 'post',
      handler: resolver.resolve('./server/handlers/comments.post'),
    })
  },
})
