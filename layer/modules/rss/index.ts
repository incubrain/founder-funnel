import {
  defineNuxtModule,
  addImports,
  addComponentsDir,
  addServerHandler,
  addServerPlugin,
  createResolver,
} from '@nuxt/kit'
import type { RSSModuleOptions } from './runtime/types'

export default defineNuxtModule<RSSModuleOptions>({
  meta: {
    name: 'rss',
    configKey: 'rss',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    enabled: true,
    feeds: {},
    cacheTtl: 3600,
  },

  setup(options, nuxt) {
    if (!options.enabled) return

    const resolver = createResolver(import.meta.url)

    // Auto-import useRssFeed composable
    addImports({
      name: 'useRssFeed',
      from: resolver.resolve('./runtime/composables/useRssFeed.ts'),
    })

    // Auto-register ConvertRss component
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      watch: true,
    })

    // Add the dynamic [collection] route handler
    addServerHandler({
      route: '/rss/:collection',
      handler: resolver.resolve('./server/routes/rss/[collection].ts'),
    })

    // Add server utils for auto-import in Nitro
    nuxt.options.nitro = nuxt.options.nitro || {}
    nuxt.options.nitro.imports = nuxt.options.nitro.imports || {}
    nuxt.options.nitro.imports.dirs = nuxt.options.nitro.imports.dirs || []
    nuxt.options.nitro.imports.dirs.push(resolver.resolve('./server/utils'))

    // Add Nitro plugin that registers feeds from config at startup
    addServerPlugin(resolver.resolve('./server/plugins/rss-init'))

    // Expose feed config to runtime (server-side reads this to register handlers)
    nuxt.options.runtimeConfig.public.rss = {
      feeds: options.feeds || {},
      cacheTtl: options.cacheTtl || 3600,
    }

    // Add prerender route for each configured feed
    const feeds = options.feeds || {}
    const prerenderRoutes = Object.keys(feeds).map(name => `/rss/${name}`)
    if (prerenderRoutes.length > 0) {
      nuxt.options.nitro.prerender = nuxt.options.nitro.prerender || {}
      nuxt.options.nitro.prerender.routes = nuxt.options.nitro.prerender.routes || []
      nuxt.options.nitro.prerender.routes.push(...prerenderRoutes)
    }
  },
})

export type { RSSModuleOptions, RSSFeedConfig, RSSHandler } from './runtime/types'
