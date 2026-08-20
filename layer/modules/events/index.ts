import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
  addServerHandler,
  addServerPlugin,
  addComponentsDir,
} from '@nuxt/kit'
import type { ModuleOptions } from './runtime/types/events'
import { DEFAULT_SIGNAL_CAPACITY } from './server/utils/signal-buffer'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'events',
    configKey: 'events',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    providers: ['console'], // Dev default
    webhook: {
      enabled: false,
    },
    signals: {
      enabled: true,
      capacity: DEFAULT_SIGNAL_CAPACITY,
      captureErrors: true,
    },
    debug: false,
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add core plugin (always)
    addPlugin({
      src: resolver.resolve('./runtime/plugins/events.client.ts'),
      mode: 'client',
    })

    // Register components
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      watch: true,
    })

    // Auto-import useEvents composable
    addImports({
      name: 'useEvents',
      from: resolver.resolve('./runtime/composables/useEvents.ts'),
    })

    addImports({
      name: 'useUserIdentity',
      from: resolver.resolve('./runtime/composables/useUserIdentity.ts'),
    })

    // Add selected provider plugins
    options.providers.forEach((provider) => {
      addPlugin({
        src: resolver.resolve(`./runtime/providers/${provider}.ts`),
        mode: 'client',
      })
    })

    // Always add webhook provider if webhook is enabled (client-side)
    // Actually, user should add 'webhook' to providers list if they want client-side triggering
    // But let's support it explicitly or implicit?
    // The previous logic had webhook handler specific for form_submitted.
    // Let's assume 'webhook' provider checks types internally.

    // Expose to runtime config
    nuxt.options.runtimeConfig.public.events = {
      debug: options.debug,
    }

    if (options.webhook.enabled) {
      addServerHandler({
        route: '/api/v1/webhook',
        method: 'post',
        handler: resolver.resolve('./server/handlers/webhook.post'),
      })
    }

    // === Signal capture (buffer + cursor export for external consumers) ===
    if (options.signals.enabled) {
      nuxt.options.runtimeConfig.signals = {
        capacity: options.signals.capacity,
      }

      addServerHandler({
        route: '/api/_signals/ingest',
        method: 'post',
        handler: resolver.resolve('./server/handlers/signals-ingest.post'),
      })

      addServerHandler({
        route: '/api/_signals/export',
        method: 'get',
        handler: resolver.resolve('./server/handlers/signals-export.get'),
      })

      // Client provider: every tracked event also becomes a signal row
      addPlugin({
        src: resolver.resolve('./runtime/providers/signal.ts'),
        mode: 'client',
      })

      if (options.signals.captureErrors) {
        addPlugin({
          src: resolver.resolve('./runtime/plugins/errors.client.ts'),
          mode: 'client',
        })
        addServerPlugin(resolver.resolve('./server/plugins/signal-errors'))
      }
    }
  },
})

// Export types
export type {
  ModuleOptions,
  EventPayload,
  TrackEventInput,
  AnalyticsProvider,
} from './runtime/types/events'

export type {
  SignalRow,
  SignalInput,
  SignalKind,
  SignalSeverity,
  SignalExportResponse,
} from './runtime/types/signal'
