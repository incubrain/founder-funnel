// Bridges `routeRules: { '/foo': { appLayout: 'article' } }` from
// `nuxt.config.ts` into an actual layout swap. Nuxt 4 type-augments the
// `appLayout` field via auto-generated `nitro-layouts.d.ts`, but the runtime
// has no built-in handler — without this middleware, the field is silently
// ignored.
//
// Requires `experimental.appManifest` (Nuxt 4 default) so `getRouteRules`
// can look up the rule for the destination path on both server and client.
export default defineNuxtRouteMiddleware((to) => {
  // The `appLayout` field is type-augmented by Nuxt onto NitroRouteRules; we
  // keep the cast as `string | false | undefined` to stay decoupled from the
  // generated `LayoutKey` union, which isn't always exposed at this layer.
  const rules = getRouteRules({ path: to.path }) as {
    appLayout?: string | false
  }
  if (rules.appLayout === undefined) return
  // setPageLayout accepts the generated LayoutKey union; cast through unknown
  // to a string-or-false runtime value (validated by Nuxt at the call site).
  setPageLayout(rules.appLayout as Parameters<typeof setPageLayout>[0])
})
