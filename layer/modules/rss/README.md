# RSS Module

Config-driven RSS 2.0 feed generation for Nuxt Content collections.

## How It Works

The module registers a dynamic server route at `/rss/:collection`. At server startup, a Nitro plugin reads feed configs from `runtimeConfig.public.rss.feeds` and registers a content-to-RSS handler for each one. Feeds are automatically prerendered at build time.

Two auto-imported components are provided:

- **`ConvertRss`** — an RSS icon button linking to the feeds listing page
- **`RssFeedList`** — lists all configured feeds with copy-URL and view-XML actions

A composable (`useRssFeed`) exposes the feed list and page URL at runtime.

## Configuration

Feeds are configured at the **app level** in `nuxt.config.ts`, not in the layer:

```ts
// examples/yourapp/nuxt.config.ts
export default defineNuxtConfig({
  rss: {
    feeds: {
      blog: {
        collection: 'posts',
        title: 'My Blog',
        description: 'Latest posts',
        basePath: '/blog',
      },
      changelog: {
        collection: 'changelog',
        title: 'Changelog',
        basePath: '/changelog',
        limit: 25,
        fields: {
          title: 'title',
          description: 'summary',
          date: 'publishedAt',
          category: 'tag',
        },
      },
    },
    route: '/feeds',    // default: '/rss-feeds'
    cacheTtl: 7200,     // default: 3600
  },
})
```

Each key in `feeds` becomes a route: `blog` → `GET /rss/blog`.

## Module Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Enable/disable the module |
| `feeds` | `Record<string, RSSFeedConfig>` | `{}` | Named feed configurations |
| `cacheTtl` | `number` | `3600` | Cache-Control max-age (seconds) |
| `route` | `string` | `'/rss-feeds'` | Feeds listing page path (used by ConvertRss button) |

### RSSFeedConfig

| Field | Type | Default | Description |
|---|---|---|---|
| `collection` | `string` | *required* | Nuxt Content collection to query |
| `title` | `string` | `{businessName} {Key}` | Feed title |
| `description` | `string` | `Latest {key} from {businessName}` | Feed description |
| `basePath` | `string` | `/{collection}` | Base path for item links |
| `limit` | `number` | `50` | Max items |
| `fields` | `RSSFieldMapping` | See below | Collection field → RSS field mapping |

### RSSFieldMapping

| Field | Default | Maps to |
|---|---|---|
| `title` | `'title'` | `<title>` |
| `description` | `'description'` | `<description>` |
| `path` | `'path'` | `<link>`, `<guid>` |
| `date` | `'date'` | `<pubDate>` |
| `category` | `'label'` | `<category>` |

## Components

### ConvertRss

RSS icon button that links to the feeds page. Use alongside social icons.

```md
::convert-rss
---
location: hero
size: xl
variant: subtle
color: secondary
---
::
```

| Prop | Type | Default |
|---|---|---|
| `location` | `string` | *required* — used for event tracking |
| `size` | `ButtonProps['size']` | `'xl'` |
| `variant` | `ButtonProps['variant']` | `'subtle'` |
| `color` | `ButtonProps['color']` | `'secondary'` |

### RssFeedList

Lists all configured feeds with copy and view actions. Drop into any content page:

```md
::rss-feed-list
::
```

No props — reads feed config from runtime config automatically.

## Composable

### useRssFeed

Auto-imported. Returns feed metadata for use in custom components.

```ts
const { feeds, feedsPageUrl, trackClick } = useRssFeed()
```

| Return | Type | Description |
|---|---|---|
| `feeds` | `ComputedRef<RSSFeedInfo[]>` | Array of `{ name, url, title, description }` |
| `feedsPageUrl` | `ComputedRef<string>` | Route to the feeds listing page |
| `trackClick` | `(location: string) => void` | Fire an `offer_click` event |

## Feeds Page

The module does **not** inject a page. Create a content markdown file in your app:

```md
<!-- content/pages/rss-feeds.md -->
---
title: RSS Feeds
description: Subscribe to our content feeds.
---

::u-container
  ::rss-feed-list
  ::
::
```

Add a route rule for layout assignment:

```ts
routeRules: {
  '/rss-feeds': { appLayout: 'default' },
}
```

## Architecture

```
modules/rss/
├── index.ts                          # Module definition
├── runtime/
│   ├── types.ts                      # All type definitions
│   ├── composables/
│   │   └── useRssFeed.ts             # Client composable (auto-imported)
│   └── components/
│       ├── ConvertRss.vue            # RSS icon button
│       └── RssFeedList.vue           # Feed listing component
└── server/
    ├── routes/rss/[collection].ts    # Dynamic route handler
    ├── utils/
    │   ├── rss-registry.ts           # Handler registry (register/get)
    │   └── rss-feed.ts               # XML builder, author/business helpers
    ├── handlers/
    │   └── content-feed.ts           # Generic collection → RSS handler factory
    └── plugins/
        └── rss-init.ts               # Registers feeds from config at startup
```

### Request Flow

```
GET /rss/blog
  → server/routes/rss/[collection].ts
    → getRSSHandler('blog')              # from rss-registry.ts
      → content-feed handler             # registered by rss-init.ts plugin
        → queryCollection('posts')       # from Nuxt Content
        → buildRSSFeed(channel, siteUrl) # from rss-feed.ts
  → XML response (Content-Type: application/xml)
```

### Custom Handlers

For feeds that don't map to a simple collection query, register a handler programmatically in a Nitro plugin:

```ts
// server/plugins/custom-feeds.ts
import { registerRSSHandler } from '#imports'

export default defineNitroPlugin(() => {
  registerRSSHandler('custom', async (event) => {
    // Build XML however you want
    return '<?xml version="1.0"?>...'
  })
})
```

The `registerRSSHandler` and `getRSSHandler` utilities are auto-imported in the Nitro server context.
