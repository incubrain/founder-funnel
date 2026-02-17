import {
  defineNuxtModule,
  createResolver,
  extendPages,
  addLayout,
} from '@nuxt/kit'

export interface VrtModuleOptions {
  enabled: boolean
  route: string
}

export default defineNuxtModule<VrtModuleOptions>({
  meta: {
    name: 'vrt',
    configKey: 'vrt',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    enabled: true,
    route: '/__vrt',
  },

  setup(options, nuxt) {
    // Only register in development mode
    if (!nuxt.options.dev || !options.enabled) return

    const resolver = createResolver(import.meta.url)

    // Bare layout — no header, footer, or banner
    addLayout({
      src: resolver.resolve('./runtime/layouts/vrt.vue'),
      filename: 'layouts/vrt.vue',
    })

    // Register VRT routes
    extendPages((pages) => {
      // /__vrt — renders homepage content in bare layout
      pages.push({
        name: 'vrt',
        path: options.route,
        file: resolver.resolve('./runtime/pages/vrt.vue'),
        meta: {
          layout: 'vrt',
          header: false,
          footer: false,
          banner: false,
        },
      })

      // /__vrt/:path — renders any content page in bare layout
      pages.push({
        name: 'vrt-page',
        path: `${options.route}/:path(.*)`,
        file: resolver.resolve('./runtime/pages/vrt-page.vue'),
        meta: {
          layout: 'vrt',
          header: false,
          footer: false,
          banner: false,
        },
      })
    })
  },
})
