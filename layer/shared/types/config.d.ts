import type { Collections } from '@nuxt/content'

/**
 * Collection type - matches Nuxt Content's collection types
 * - 'page': Markdown files with routes (routable)
 * - 'data': YAML/JSON data files (not routable)
 */
type CollectionType = 'page' | 'data'

/**
 * Collection config can be a string (collection name) or object with routing info
 */
type CollectionConfig
  = | keyof Collections
    | {
      name: keyof Collections
      type?: CollectionType
      prefix?: string
      backLabel?: string
    }

declare module 'nuxt/schema' {
  interface AppConfig {
    content: {
      // Keyed by collection name (pages, team, faq, config, navigation, ...).
      // Kept as an index type rather than fixed keys so consumers can add
      // their own collections without fighting the layer's type.
      collections: Record<string, CollectionConfig>
      routeMap?: Record<string, string>
      // Flat — sibling of `collections`, NOT nested under it. This is the
      // shape app.config.ts sets and useSearch/useNavigation read.
      // See product-validator-ebi.1.
      searchable?: string[]
      pagesBackLabel?: string
      pagesPrefix?: string
      defaultAuthor?: string
      routing: {
        sources?: string
        offers?: string
        success?: string
      }
    }
    seo: {
      titleTemplate: string
      title: string
      description: string
    }
    logo: {
      light: string
      dark: string
      alt: string
    }
    header: {
      title: string
    }
    socials: Record<string, string>
    toc: {
      title: string
      bottom: {
        title: string
        links: {
          icon: string
          label: string
          to: string
          target: string
        }[]
      }
    }
    github:
      | {
        owner: string
        name: string
        url: string
        branch: string
        rootDir?: string
      }
      | false
  }

  interface AppConfigInput {
    content?: {
      collections?: Record<string, unknown> & {
        site?: {
          foundingYear?: number
          legalName?: string
          socials?: Record<string, string>
        }
      }
      routeMap?: Record<string, string>
      // Flat — sibling of `collections`. See product-validator-ebi.1.
      searchable?: string[]
      pagesBackLabel?: string
      pagesPrefix?: string
      defaultAuthor?: string
      routing?: Record<string, string>
    }
    ui?: {
      [key: string]: unknown
    }
    foundry?: {
      version?: string
      url?: string
    }
    title?: string
    seo?: {
      titleTemplate?: string
      title?: string
      description?: string
    }
    header?: {
      title?: string
    }
    github?: {
      url?: string
      branch?: string
      rootDir?: string
    }
    toc?: {
      title?: string
    }
  }
}

export {}
