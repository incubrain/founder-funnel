---
label: Content
title: Content Overview
description: Content-first philosophy, collection types, and how Nuxt Content powers Foundry.
---

All content in Foundry lives in the `content/` directory as Markdown and YAML files. Customers edit content — not code.

Foundry uses [Nuxt Content v3](https://content.nuxt.com){target="_blank"} with [Zod](https://zod.dev){target="_blank"}-validated schemas to ensure every content file matches the shape components expect.

## Content-First Philosophy

In Foundry, content drives everything. Pages, navigation, FAQ entries, team profiles, and site configuration are all defined in files — not hardcoded in components.

This means:
- Non-technical team members can edit YAML/Markdown without touching code
- Content changes hot-reload instantly in development
- Content is validated at build time against Zod schemas
- [Nuxt Studio](https://nuxt.studio){target="_blank"} can be used for visual editing

## Collections

Foundry uses [Nuxt Content collections](https://content.nuxt.com/docs/collections){target="_blank"} to organize content. There are two types:

### Page Collections (`type: 'page'`)

Page collections generate URL routes. Each Markdown file becomes a page.

| Collection | Source | URL Prefix | Purpose |
|---|---|---|---|
| `pages` | `content/pages/**/*.md` | `/` | General pages (landing, about, offers) |
| `docs` | `content/docs/**/*.md` | `/docs` | Documentation pages |
| `changelog` | `content/decisions/**/*.md` | `/decisions` | Decision log / changelog |

### Data Collections (`type: 'data'`)

Data collections are queried by components but don't generate routes.

| Collection | Source | Purpose |
|---|---|---|
| `config` | `content/config/site.yml` | Business info, socials |
| `navigation` | `content/config/navigation.yml` | Header, footer, banner |
| `faq` | `content/faq/*.yml` | FAQ entries |
| `team` | `content/team/*.yml` | Team member profiles |
| `references` | `content/references/*.yml` | Academic references (optional) |
| `glossary` | `content/glossary/*.yml` | Glossary terms (optional) |

## Schemas

Every collection has a Zod schema that validates content at build time. Schemas are defined in the layer and exported from `@incubrain/foundry/schemas`:

```ts [content.config.ts]
import { basePageSchema, baseFaqSchema } from '@incubrain/foundry/schemas'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/**/*.md', prefix: '/' },
      schema: basePageSchema,
    }),
    faq: defineCollection({
      type: 'data',
      source: { include: 'faq/*.yml' },
      schema: baseFaqSchema,
    }),
  },
})
```

If a content file doesn't match its schema, you'll get a clear build-time error. See the [Content Schemas Reference](/docs/reference/content-schemas) for every field.

## File Naming

Nuxt Content uses file names for ordering and path generation:

- **Numbered prefixes** control order: `1.introduction.md` comes before `2.quickstart.md`
- **The number is stripped** from the URL: `1.introduction.md` → `/docs/getting-started/introduction`
- **`index.md`** files become the directory root: `content/docs/index.md` → `/docs`
- **Nested directories** create nested paths: `content/docs/1.getting-started/1.intro.md` → `/docs/getting-started/intro`

See the [Nuxt Content documentation](https://content.nuxt.com/docs/getting-started/writing){target="_blank"} for full details on file naming and MDC syntax.

::card-group
  ::card{title="Pages" icon="i-lucide-file-text" to="/docs/content/pages"}
  Page collections, frontmatter, and layout assignment.
  ::

  ::card{title="Landing Pages" icon="i-lucide-layout" to="/docs/content/landing-pages"}
  MDC section syntax for building landing pages from Markdown.
  ::

  ::card{title="Offers & Success" icon="i-lucide-gift" to="/docs/content/offers"}
  Offer detail pages and post-conversion success pages.
  ::

  ::card{title="FAQ" icon="i-lucide-help-circle" to="/docs/content/faq"}
  FAQ entries in YAML with type filtering.
  ::

  ::card{title="Team" icon="i-lucide-users" to="/docs/content/team"}
  Team member profiles and the founder flag.
  ::

  ::card{title="Navigation" icon="i-lucide-menu" to="/docs/content/navigation"}
  Header, footer, and banner configuration.
  ::
::
