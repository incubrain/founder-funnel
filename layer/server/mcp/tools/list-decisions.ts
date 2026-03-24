import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { computeContentHash } from '../../utils/content-hash'
import { inferSiteURL } from '../../../shared/utils/meta'

export default defineMcpTool({
  description: `Lists all decision log / changelog entries with metadata and content hashes.

WHEN TO USE: Use this tool to explore a founder's decision history — what they changed, when, and why. Each entry represents a strategic decision with a version label, date, and description.

WORKFLOW: Returns a list of entries with paths. Use get-decision to retrieve the full markdown content of any specific entry.

OUTPUT: Returns title, path, date, label (version), description, contentHash (SHA-256 of raw markdown), and URL for each entry.`,
  inputSchema: {},
  cache: '1h',
  handler: async () => {
    const event = useEvent()
    const log = useLogger(event)
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : inferSiteURL()

    log.set({ mcp: { tool: 'list-decisions' } })

    try {
      const entries = await queryCollection(event, 'changelog' as keyof Collections)
        .select('title' as 'id', 'path' as 'id', 'description' as 'id', 'date' as 'id', 'label' as 'id')
        .order('date' as 'id', 'DESC' as never)
        .all()

      const results = await Promise.all(
        (entries as unknown as Record<string, string>[]).map(async (entry) => {
          let contentHash: string | null = null
          try {
            const raw = await $fetch<string>(`/raw${entry.path}.md`, { baseURL: siteUrl! })
            contentHash = computeContentHash(raw)
          }
          catch { /* hash unavailable */ }

          return {
            title: entry.title,
            path: entry.path,
            description: entry.description,
            date: entry.date,
            label: entry.label,
            contentHash,
            url: `${siteUrl}${entry.path}`,
          }
        }),
      )

      return jsonResult(results)
    }
    catch (error: unknown) {
      log.error(error instanceof Error ? error : new Error(String(error)), {
        step: 'mcp-list-decisions',
      })
      return errorResult('Failed to list decisions')
    }
  },
})
