# Changelog Module — AI Agent Instructions

Timeline component for displaying versioned changelog entries from Nuxt Content collections.

## File Map

```
layer/modules/changelog/
├── index.ts                          # Module setup (auto-imports, component registration)
└── runtime/
    ├── types.ts                      # Zod schema (baseChangelogSchema) + config interfaces
    ├── composables/
    │   └── useChangelog.ts           # Data fetching, sorting, author resolution
    └── components/
        └── Changelog.vue             # Timeline UI (Nuxt UI UChangelogVersions)
```

## Key Architecture

### Content-First
Schema uses `@nuxt/content` with Zod validation. Fields: label, version, date, title, description, excerpt, image, author. Content stored as YAML frontmatter in markdown.

### Composable Pattern
`useChangelog()` handles all data logic: collection query, team member lookup for author resolution, sorting. Component only handles rendering.

### Author Resolution
Links entries to team collection via author slug → extracts name, avatar, GitHub link. Falls back to `appConfig.content.defaultAuthor`.

## How to Modify

### Add schema field
1. Add to `baseChangelogSchema` in `types.ts`
2. Update content files with new frontmatter field
3. Display in `Changelog.vue` template

### Change sorting
Pass `sortField` and `sortOrder` props: `<Changelog sortField="version" sortOrder="DESC" />`

### Use in markdown
```markdown
::changelog
::
```

### Use in Vue
```typescript
const { items, pending, getAuthorForItem } = useChangelog({ sortField: 'date', sortOrder: 'DESC' })
```
