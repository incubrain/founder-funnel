// Bridges `routeRules: { '/foo': { appLayout: 'article' } }` from
// `nuxt.config.ts` into an actual layout swap. Nuxt 4 type-augments the
// `appLayout` field via auto-generated `nitro-layouts.d.ts`, but the runtime
// has no built-in handler — without this middleware, the field is silently
// ignored. See bd:product-validator-5dk.
//
// Requires `experimental.appManifest` (Nuxt 4 default) so `getRouteRules`
// can look up the rule for the destination path on both server and client.
export default defineNuxtRouteMiddleware((to) => {
  const rules = getRouteRules({ path: to.path }) as {
    appLayout?: string | false
  }
  if (rules.appLayout === undefined) return
  setPageLayout(rules.appLayout as any)
})
