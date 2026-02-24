# RSS Module — AI Agent Instructions

Config-driven RSS feed generation from Nuxt Content collections.

## File Map

```
layer/modules/rss/
├── index.ts                          # Module setup (auto-imports, prerender routes)
├── README.md                         # User documentation
├── runtime/
│   ├── types.ts                      # RSSModuleOptions, RSSFeedConfig interfaces
│   ├── composables/
│   │   └── useRssFeed.ts             # Client: feed list, tracking
│   └── components/
│       ├── ConvertRss.vue            # RSS icon button (~30 lines)
│       └── RssFeedList.vue           # Feed listing with copy/view (~70 lines)
└── server/
    ├── routes/
    │   └── rss/[collection].ts       # GET /rss/:collection → XML
    ├── handlers/
    │   └── content-feed.ts           # Collection → RSS handler factory
    ├── utils/
    │   ├── rss-registry.ts           # In-memory handler registry
    │   └── rss-feed.ts               # RSS 2.0 XML builder
    └── plugins/
        └── rss-init.ts              # Register handlers at startup
```

## Key Architecture

### Config-Driven Feeds
Feeds configured in `nuxt.config.ts` → registered at startup → served as `/rss/:name`. Each feed maps to a Nuxt Content collection with field mapping.

### Registry Pattern
`registerRSSHandler(name, handler)` at startup. Route handler looks up from registry. Supports both config-driven and custom programmatic handlers.

### Field Mapping
Maps any content schema to RSS: `{ title: 'headline', date: 'publishedAt', description: 'summary' }`.

## How to Modify

### Add a new feed
Add to `nuxt.config.ts`:
```typescript
rss: { feeds: { blog: { collection: 'posts', title: 'Blog', basePath: '/blog', fields: { title: 'title', date: 'date' } } } }
```

### Add custom handler
Create `server/plugins/custom-feeds.ts`, call `registerRSSHandler('name', handler)`.

### Modify XML output
Edit `server/utils/rss-feed.ts` — `buildRSSFeed()` generates RSS 2.0 XML.

## Design Principles
- No database — feeds prerendered at build, cached 1 hour
- Content-first — customers configure feeds via YAML, not code
- Stateless — route handler is pure function
