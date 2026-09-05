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
  if (!business?.name) return

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
