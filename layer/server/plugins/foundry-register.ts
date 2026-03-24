import { getRegisteredFeeds } from '../../modules/rss/server/utils/rss-registry'
import { inferSiteURL } from '../../shared/utils/meta'

const REGISTER_ENDPOINT = 'https://api.incubrain.org/v1/foundry/register'

export default defineNitroPlugin(async () => {
  // Never register in development
  if (import.meta.dev) return

  const config = useRuntimeConfig()

  if (!config.foundryRegister) {
    console.warn(
      '[foundry] Registration disabled. Set NUXT_FOUNDRY_REGISTER=true to register with the Incubrain mentorship network.',
    )
    return
  }

  const siteUrl = inferSiteURL()
  if (!siteUrl) {
    console.warn('[foundry] Cannot register: no site URL configured (NUXT_PUBLIC_SITE_URL)')
    return
  }

  const feeds = getRegisteredFeeds()

  try {
    await $fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      body: {
        siteUrl,
        mcpEndpoint: `${siteUrl}/_mcp/mcp`,
        siteName: config.public.siteName || '',
        feeds: feeds.map(name => ({ name, url: `${siteUrl}/rss/${name}` })),
        registeredAt: new Date().toISOString(),
      },
      timeout: 5000,
    })
    console.log(`[foundry] Registered with Incubrain network: ${siteUrl}`)
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[foundry] Registration failed (non-fatal): ${message}`)
  }
})
