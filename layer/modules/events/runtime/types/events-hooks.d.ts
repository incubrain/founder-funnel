// Kept out of events.ts: the module entry (index.ts) type-imports events.ts, which
// pulls it into the generated node tsconfig project, where a 'nuxt/app' augmentation
// fails (TS2664). This file is only picked up by the app project's runtime include.
import type { EventsHooks } from './events'

declare module 'nuxt/app' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RuntimeNuxtHooks extends EventsHooks {}
}
