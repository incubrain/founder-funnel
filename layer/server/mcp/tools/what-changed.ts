import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { computeContentHash } from '../../utils/content-hash'
import { inferSiteURL } from '../../../shared/utils/meta'

export default defineMcpTool({
  description: `Lightweight change detection tool for efficient polling. Returns content hashes for all docs and decision entries so a remote system can detect what changed without fetching full content.

WHEN TO USE: Use this tool to check which content has been modified. Compare returned contentHash values against previously stored hashes to identify changed documents. Then use get-page or get-decision to fetch only the changed items.

INPUT: Optional 'since' ISO timestamp to filter to recently modified items only.

OUTPUT: Returns path, collection name, contentHash (SHA-256), and modifiedAt for each content item.`,
  inputSchema: {
    since: z.string().optional().describe('ISO 8601 timestamp — only return items modified after this date'),
  },
  cache: '5m',
  handler: async ({ since }) => {
    const event = useEvent()
    const log = useLogger(event)
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : inferSiteURL()
    const sinceDate = since ? new Date(since) : null

    log.set({ mcp: { tool: 'what-changed', since } })

    try {
      const collections = ['pages'] as const

      const allItems = await Promise.all(
        collections.map(async (col) => {
          try {
            const items = await queryCollection(event, col as keyof Collections)
              .select('path' as 'id', 'date' as 'id')
              .all()

            const enriched = await Promise.all(
              (items as unknown as Record<string, string>[]).map(async (item) => {
                const modifiedAt = item.date || null
                if (sinceDate && modifiedAt && new Date(modifiedAt) < sinceDate) {
                  return null
                }

                let contentHash: string | null = null
                try {
                  const raw = await $fetch<string>(`/raw${item.path}.md`, { baseURL: siteUrl! })
                  contentHash = computeContentHash(raw)
                }
                catch { /* hash unavailable */ }

                return {
                  path: item.path,
                  collection: col,
                  contentHash,
                  modifiedAt,
                }
              }),
            )

            return enriched.filter(Boolean)
          }
          catch {
            return []
          }
        }),
      )

      const items = allItems.flat()

      return jsonResult({
        items,
        total: items.length,
        since: since || null,
      })
    }
    catch (error: unknown) {
      log.error(error instanceof Error ? error : new Error(String(error)), {
        step: 'mcp-what-changed',
        since,
      })
      return errorResult('Failed to check changes')
    }
  },
})
