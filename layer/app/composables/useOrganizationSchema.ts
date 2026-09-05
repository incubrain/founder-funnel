interface OrganizationSchemaBusiness {
  name?: string
  legalName?: string
  foundingYear?: number
  logo?: string
  mission?: string
}

/**
 * Emits Organization JSON-LD (schema.org) from the site's `config/site.yml`
 * content (the `business`/`socials` fields already authored there — no new
 * content format).
 *
 * Every field is optional here even though the content schema requires most
 * of them, because this also runs for consumers who haven't populated
 * `config/site.yml` yet (fresh layer install) — degrade by omitting the key,
 * never emit an empty string into the graph.
 *
 * Extracted out of app.vue to keep the root shell focused (matches the
 * useSocialLinks/useFormCapture extraction pattern).
 */
export function useOrganizationSchema(
  business: OrganizationSchemaBusiness | undefined,
  socials: Record<string, string> | undefined,
) {
  // No business identity (no `config/site.yml`, or one without `business`):
  // still contribute the site-level baseline rather than returning without
  // touching the graph at all. This composable is the layer's only
  // `useSchemaOrg` call on every page, so an early return left the layer
  // contributing nothing and made an empty `data-nuxt-schema-org` payload
  // possible instead of valid WebSite/WebPage output (product-validator-918).
  // Both nodes resolve to stable `#website` / `#webpage` @ids, so this merges
  // with @nuxtjs/seo's own defaults rather than duplicating them.
  if (!business?.name) {
    useSchemaOrg([defineWebSite({}), defineWebPage({})])
    return
  }

  const sameAs = Object.values(socials ?? {}).filter(Boolean)

  useSchemaOrg([
    defineOrganization({
      name: business.name,
      ...(business.legalName ? { legalName: business.legalName } : {}),
      ...(business.foundingYear ? { foundingDate: String(business.foundingYear) } : {}),
      ...(business.logo ? { logo: business.logo } : {}),
      ...(business.mission ? { description: business.mission } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    }),
  ])
}
