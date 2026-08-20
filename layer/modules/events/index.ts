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

// Kept in sync with `DEFAULT_SIGNAL_CAPACITY` in ./server/utils/signal-buffer.ts.
// Not imported directly: that file is nitro-server-only (relies on h3/nitro
// auto-imports) and pulling it into this module-setup file drags it into the
// Nuxt "node" typecheck project, which doesn't have those globals.
const DEFAULT_SIGNAL_CAPACITY = 10_000

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'events',
    configKey: 'events',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
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

    // Expose to runtime config
    nuxt.options.runtimeConfig.public.events = {
      debug: options.debug,
    }

    // Form capture route — zod validation + anti-spam, then into the buffer.
    addServerHandler({
      route: '/api/v1/webhook',
      method: 'post',
      handler: resolver.resolve('./server/handlers/webhook.post'),
    })

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

      // The only provider: every tracked event becomes a signal row
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
} from './runtime/types/events'

export type {
  SignalRow,
  SignalInput,
  SignalKind,
  SignalSeverity,
  SignalExportResponse,
} from './runtime/types/signal'
