/**
 * App config type augmentation.
 *
 * Extends Nuxt's AppConfigInput so that custom properties
 * (content, ui.docs, foundry, etc.) are recognized by the type system.
 */

export {}

declare module 'nuxt/schema' {
  interface AppConfigInput {
    content?: {
      collections?: Record<string, unknown> & {
        site?: {
          foundingYear?: number
          legalName?: string
          socials?: Record<string, string>
        }
        searchable?: string[]
      }
      defaultAuthor?: string
      routing?: Record<string, string>
    }
    ui?: {
      docs?: {
        affiliation?: {
          colors?: Record<string, string>
        }
      }
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
