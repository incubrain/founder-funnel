# Docs Module — AI Agent Instructions

Documentation system with glossary, citations, bibliography, and full-text search.

## File Map

```
layer/modules/docs/
├── index.ts                          # Module setup (feature flags, component registration)
└── runtime/
    ├── types.ts                      # Zod schemas (baseReferencesSchema, baseGlossarySchema)
    ├── layouts/
    │   └── docs.vue                  # 3-column docs layout (nav | content | TOC)
    ├── components/
    │   ├── DocsAsideLeftTop.vue      # Left sidebar: search button
    │   ├── DocsAsideLeftBody.vue     # Left sidebar: navigation tree
    │   ├── DocsAsideRightBottom.vue  # Right sidebar: TOC extras
    │   ├── DocsPageHeaderLinks.vue   # Header: copy, MCP, AI send buttons
    │   ├── Bibliography.vue          # Citation list at page bottom
    │   ├── Cited.vue                 # Inline citation reference
    │   ├── Defn.vue                  # Glossary term with popover
    │   ├── GlossaryTable.vue         # Full glossary page table
    │   └── SourcesTable.vue          # References/sources table
    └── composables/
        ├── useCitations.ts           # Per-route citation state, fuzzy validation
        ├── useGlossary.ts            # Global glossary cache + term lookup
        ├── useSourcesTable.ts        # Source filtering, grouping, colors
        ├── useSearch.ts              # Full-text search across collections
        └── useSearchStub.ts          # No-op stub when search disabled
```

## Key Architecture

### Feature Flags
All features toggleable in `nuxt.config.ts`:
```typescript
docs: { enabled: true, glossary: true, citations: true, search: true }
```
When disabled, components aren't registered and stubs are used.

### Per-Route Citation State
`useCitations()` tracks cited IDs per page using `useState('citations-${route.path}')`. `Cited.vue` calls `addCitation()` during render; `Bibliography.vue` displays sorted list.

### Glossary Term Linking
`Defn.vue` wraps text with popover showing definition. Links to glossary page with `?search=termId`. Case-insensitive term lookup.

### Content Collections
Expects three collections: `docs` (pages), `glossary` (categories with terms), `references` (categories with sources).

## How to Modify

### Add citation feature
Use `useCitations()` composable. Validates IDs with Fuse.js fuzzy matching in dev mode.

### Extend references schema
1. Add field to Zod schema in `types.ts`
2. Update content collection data
3. Add column in `SourcesTable.vue`

### Use glossary in markdown
```markdown
:defn[term text]{#termId}
```

### Use citations in markdown
```markdown
:cited{#referenceId}
```

### Customize layout
Modify `docs.vue` — uses Nuxt UI's `UPage`, `UPageAside`, `UPageHeader`, `UPageBody`.

## Dependencies
- `@nuxt/content` — Collections for docs, glossary, references
- `@nuxt/ui` — Layout and UI components
- `fuse.js` — Fuzzy search for citation validation
- `@vueuse/core` — `useClipboard()` for copy actions
