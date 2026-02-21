import {
  defineNuxtModule,
  addImports,
  addComponentsDir,
  addServerHandler,
  addServerPlugin,
  createResolver,
  extendPages,
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
    route: '/rss-feeds',
  },

  setup(options, nuxt) {
    if (!options.enabled) return

    const resolver = createResolver(import.meta.url)
    const feedsRoute = options.route || '/rss-feeds'

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

    // Inject the RSS feeds listing page
    extendPages((pages) => {
      pages.push({
        name: 'rss-feeds',
        path: feedsRoute,
        file: resolver.resolve('./runtime/pages/rss-feeds.vue'),
      })
    })

    // Expose feed config + page route to runtime
    nuxt.options.runtimeConfig.public.rss = {
      feeds: options.feeds || {},
      cacheTtl: options.cacheTtl || 3600,
      route: feedsRoute,
    }

    // Add prerender routes for each configured feed + the listing page
    const feeds = options.feeds || {}
    const prerenderRoutes = [
      feedsRoute,
      ...Object.keys(feeds).map(name => `/rss/${name}`),
    ]
    nuxt.options.nitro.prerender = nuxt.options.nitro.prerender || {}
    nuxt.options.nitro.prerender.routes = nuxt.options.nitro.prerender.routes || []
    nuxt.options.nitro.prerender.routes.push(...prerenderRoutes)
  },
})

export type { RSSModuleOptions, RSSFeedConfig, RSSHandler } from './runtime/types'
