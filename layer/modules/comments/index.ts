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

    // html-to-image is dynamically imported in captureElementScreenshot —
    // Vite needs it pre-bundled so the bare specifier resolves at runtime
    nuxt.options.vite ??= {}
    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []
    nuxt.options.vite.optimizeDeps.include.push('html-to-image')

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

    addServerHandler({
      route: '/api/_comments/image/:id',
      method: 'get',
      handler: resolver.resolve('./server/handlers/comments.image.get'),
    })
  },
})
