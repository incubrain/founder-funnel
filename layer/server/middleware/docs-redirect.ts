import { defineEventHandler, sendRedirect } from 'h3'
import { queryCollectionNavigation } from '@nuxt/content/server'

interface NavItem {
  path?: string
  body?: unknown
  children?: NavItem[]
}

/**
 * Redirects docs directory routes to the first child page.
 *
 * When navigating to a docs directory (e.g., /docs/getting-started)
 * that has a navigation.yml but no index.md, this middleware redirects
 * to the first child page in that directory.
 *
 * Example:
 * /docs/getting-started → /docs/getting-started/introduction
 *
 * This matches how Nuxt.com handles their docs navigation.
 */
export default defineEventHandler(async (event) => {
  const path = event.node.req.url

  // Only handle /docs paths
  if (!path?.startsWith('/docs/')) {
    return
  }

  // Skip if path has a file extension or ends with a specific file
  if (path.match(/\.\w+$/)) {
    return
  }

  try {
    // Try to fetch the navigation for the docs collection
    const navigation = await queryCollectionNavigation(event, 'docs')

    // Find the matching directory node
    const findNode = (items: NavItem[], targetPath: string): NavItem | null => {
      for (const item of items) {
        // Normalize paths for comparison (remove trailing slash)
        const itemPath = item.path?.replace(/\/$/, '')
        const normalizedTarget = targetPath.replace(/\/$/, '')

        if (itemPath === normalizedTarget) {
          return item
        }

        if (item.children) {
          const found = findNode(item.children, targetPath)
          if (found) return found
        }
      }
      return null
    }

    const node = findNode(navigation, path)

    // If we found a node with children but no body (no content file),
    // redirect to the first child
    if (node?.children?.length && node.children.length > 0 && !node.body) {
      const firstChild = node.children[0]
      if (firstChild?.path) {
        return sendRedirect(event, firstChild.path, 302)
      }
    }
  }
  catch (error) {
    // Fail silently - let the normal 404 handling take over
    console.debug('docs-redirect middleware:', error)
  }
})
