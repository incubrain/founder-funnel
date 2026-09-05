import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { computeContentHash } from '../../utils/content-hash'
import { captureMcpToolCall } from '../../utils/mcp-signal'
import { inferSiteURL } from '../../../shared/utils/meta'

export default defineMcpTool({
  description: `Retrieves the full content and details of a specific documentation page.

WHEN TO USE: Use this tool when you know the EXACT path to a documentation page. Common use cases:
- User asks for a specific page: "Show me the getting started guide" → /en/getting-started/installation
- User asks about a known topic with a dedicated page
- You found a relevant path from list-pages and want the full content
- User references a specific section or guide they want to read

WHEN NOT TO USE: If you don't know the exact path and need to search/explore, use list-pages first.

WORKFLOW: This tool returns the complete page content including title, description, and full markdown. Use this when you need to provide detailed answers or code examples from specific documentation pages.
`,
  inputSchema: {
    path: z
      .string()
      .describe(
        'The page path from list-pages or provided by the user (e.g., /en/getting-started/installation)',
      ),
  },
  cache: '1h',
  handler: async ({ path }) => {
    const event = useEvent()
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : inferSiteURL()

    captureMcpToolCall('get-page', { path }, event)

    try {
      const page = await queryCollection(
        event,
        'pages' as keyof Collections,
      )
        .where('path', '=', path)
        .select('title' as 'id', 'path' as 'id', 'description' as 'id')
        .first()

      if (!page) {
        return errorResult(`Page not found: ${path}`)
      }

      const pageData = page as unknown as Record<string, string>

      const content = await $fetch<string>(`/raw${path}.md`, {
        baseURL: siteUrl,
      })

      const contentHash = computeContentHash(content)

      return jsonResult({
        title: pageData.title,
        path: pageData.path,
        description: pageData.description,
        content,
        contentHash,
        url: `${siteUrl}${pageData.path}`,
      })
    }
    catch (error: unknown) {
      return errorResult(`Failed to get page "${path}": ${error instanceof Error ? error.message : String(error)}`)
    }
  },
})
