import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { computeContentHash } from '../../utils/content-hash'
import { inferSiteURL } from '../../../shared/utils/meta'

export default defineMcpTool({
  description: `Retrieves the full markdown content of a specific decision/changelog entry.

WHEN TO USE: Use this tool when you know the exact path to a decision entry (from list-decisions) and need the full content for review or analysis.

OUTPUT: Returns title, path, date, label, description, full markdown content, contentHash, and URL.`,
  inputSchema: {
    path: z.string().describe('The decision path from list-decisions (e.g., /decisions/01.template-first-launch)'),
  },
  cache: '1h',
  handler: async ({ path }) => {
    const event = useEvent()
    const log = useLogger(event)
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : inferSiteURL()

    log.set({ mcp: { tool: 'get-decision', path } })

    try {
      const entry = await queryCollection(event, 'pages' as keyof Collections)
        .where('path', '=', path)
        .select('title' as 'id', 'path' as 'id', 'description' as 'id', 'date' as 'id', 'label' as 'id')
        .first()

      if (!entry) {
        return errorResult('Decision not found')
      }

      const entryData = entry as unknown as Record<string, string>
      const content = await $fetch<string>(`/raw${path}.md`, { baseURL: siteUrl! })
      const contentHash = computeContentHash(content)

      return jsonResult({
        title: entryData.title,
        path: entryData.path,
        description: entryData.description,
        date: entryData.date,
        label: entryData.label,
        content,
        contentHash,
        url: `${siteUrl}${entryData.path}`,
      })
    }
    catch (error: unknown) {
      log.error(error instanceof Error ? error : new Error(String(error)), {
        step: 'mcp-get-decision',
        path,
      })
      return errorResult('Failed to get decision')
    }
  },
})
