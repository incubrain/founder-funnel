# useContentConfig Simplification Research

**Date:** 2026-03-17
**File:** `layer/app/composables/useContentConfig.ts` (336 lines)
**Status:** Research complete

---

## 1. Current Usage Map

### Functions exported by `useContentConfig()`

| Function | Used In | Purpose |
|---|---|---|
| `collections` (object) | `ConvertInternal.vue`, `ConvertSocial.vue`, `article.vue`, `useChangelog.ts`, `useCitations.ts`, `useGlossary.ts`, `DocsAsideLeftBody.vue`, `Offer.vue` (x2 examples) | Pre-resolved collection name map (e.g., `collections.docs`, `collections.team`) — used as argument to `queryCollection()` |
| `routing` (object) | `ConvertInternal.vue`, `article.vue` | Pre-resolved routing paths (`pagesPrefix`, `pagesBackLabel`, `offers`, `success`, `sources`) |
| `getCollectionForRoute()` | `useContentPage.ts`, `ProseA.vue` | Map a route path to a collection name based on prefix matching |
| `resolveInternalPath()` | `ProseA.vue` | Resolve relative markdown links to full paths with collection prefix |
| `getPageMetadata()` | `ProseA.vue` | Look up navigation metadata for a path (for link popovers) |
| `getRoutingPath()` | `useGlossary.ts` | Get a routing path from `appConfig.content.routing` |
| `getCollectionName()` | Only via `collections` object internally | Extract collection name from app.config |
| `getCollectionPrefix()` | Only via `routing` object + `resolveInternalPath()` internally | Extract collection URL prefix from app.config |
| `getCollectionBackLabel()` | Only via `routing` object internally | Extract back-navigation label |
| `getSearchableCollections()` | Tests only (no production consumer found) | Return searchable collection list |
| `getRoutePatterns()` | Only internally (by `getCollectionForRoute` and `resolveInternalPath`) | Build sorted route patterns from collection configs |
| `flattenNavigation()` | Only internally (by `getPageMetadata`) | Flatten nav tree for search |

### Consumer Summary (production code only, excluding tests)

- **8 consumers** use `collections` — the dominant usage pattern
- **3 consumers** use `routing`
- **2 consumers** use `getCollectionForRoute`
- **1 consumer** uses `resolveInternalPath`, `getPageMetadata`, `getCollectionForRoute` together (`ProseA.vue`)
- **1 consumer** uses `getRoutingPath` (`useGlossary.ts`)

---

## 2. What Nuxt Content v3 Handles Natively

### Collection definition with prefix (content.config.ts)

Nuxt Content v3's `defineCollection()` already supports:

```ts
docs: defineCollection({
  type: 'page',
  source: {
    include: 'docs/**/*.md',
    prefix: '/docs',        // <-- .path prefix for page type
  },
  schema: basePageSchema,
})
```

The `prefix` in `CollectionSource` is described as: _".path prefix (only applies to 'page' type)"_. This means Nuxt Content **already generates the correct `path` field** on each document based on the configured prefix. For example, `content/docs/intro.md` with `prefix: '/darksky'` generates `path: '/darksky/intro'`.

### queryCollection().path() — native path resolution

```ts
queryCollection('docs').path(route.path).first()
```

This is the native way to find a document by its generated path. **The prefix is already baked into the `path` field** — no manual prefix resolution needed when querying.

### queryCollectionNavigation() — native navigation

Already used in the codebase. Generates navigation trees directly from collections. No custom logic needed.

### What Nuxt Content does NOT provide natively

1. **Route-to-collection mapping** — Given a route path like `/darksky/intro`, there is no built-in API to determine which collection to query. The developer must know which collection to pass to `queryCollection()`.
2. **Cross-collection path resolution** — Resolving a relative markdown link to a full path considering the current collection's prefix.
3. **Collection name aliasing** — Mapping `changelog` -> `decisions` (as done in Foundry's app.config).
4. **Navigation metadata lookup** — Looking up a specific page's title/description from the nav tree by path.
5. **Searchable collections list** — Filtering which collections participate in search.

---

## 3. What's Genuinely Custom (Must Keep)

### A. Route-to-Collection Resolution (~50 lines) — KEEP but simplify

`getCollectionForRoute()` + `getRoutePatterns()` is genuinely needed. Nuxt Content has no native "given this URL path, which collection should I query?" API. This is the core value of the composable — it powers `useContentPage()` which is the unified page-fetching mechanism.

**However**, the current implementation rebuilds patterns from `app.config.ts` on every call with complex type casting. This could be simplified to a static lookup table.

### B. Internal Path Resolution (~40 lines) — KEEP but simplify

`resolveInternalPath()` handles relative links in markdown (e.g., `[intro](intro.md)` needs to become `/darksky/intro`). This is needed for `ProseA.vue` to resolve cross-document links. Nuxt Content does not handle this.

### C. Navigation Metadata Lookup (~25 lines) — KEEP

`getPageMetadata()` + `flattenNavigation()` are used by `ProseA.vue` to show link popovers with title/description. No native equivalent.

### D. Static routing paths (offers, success, sources) — KEEP but move

The `routing` object provides UI-facing paths like `/offers`, `/success`. These are app-specific routing constants, not content collection logic. Could be a simpler config constant.

---

## 4. What's Duplicated / Eliminable

### A. Collection Name Map (`collections` object) — ELIMINATE (~20 lines)

The `collections` object (lines 290-300) resolves collection names like:
```ts
collections.docs  // → 'docs'
collections.team  // → 'team'
```

In every `content.config.ts` in the codebase, collections are defined with their literal names. The `getCollectionName()` indirection (which allows `app.config.ts` to alias names) is only used for **one case**: Foundry maps `changelog` -> `decisions`.

**Recommendation:** Instead of a runtime name-resolution layer, just name the collection `decisions` in Foundry's `content.config.ts` and query it directly. All 8 consumers currently do `queryCollection(collections.team)` — they could simply do `queryCollection('team')` directly with full type safety from Nuxt Content's generated types.

### B. Collection Prefix Duplication — ELIMINATE (~30 lines)

The `prefix` is configured in **two places**:
1. `content.config.ts` — `source: { prefix: '/docs' }` (Nuxt Content native)
2. `app.config.ts` — `docs: { prefix: '/docs' }` (custom, for `useContentConfig`)

This is a DX footgun: if you change the prefix in one place but not the other, routing breaks silently. The prefix in `content.config.ts` is the source of truth (it controls path generation). The `app.config.ts` copy is redundant.

### C. `getCollectionName()` / `getCollectionPrefix()` / `getCollectionBackLabel()` — ELIMINATE (~45 lines)

These are generic accessor functions that read from `app.config.ts` with fallback logic. They exist only to support the `collections`/`routing` convenience objects and `getRoutePatterns()`. If we eliminate the duplication, these become unnecessary.

### D. `getSearchableCollections()` — ELIMINATE (~5 lines)

No production consumer. Only referenced in tests.

---

## 5. Recommended Simplification Plan

### Phase 1: Eliminate collection name indirection (HIGH IMPACT)

**Current:** 8 components do `const { collections } = useContentConfig()` then `queryCollection(collections.docs)`

**Target:** Components use `queryCollection('docs')` directly (Nuxt Content auto-imports + types make this fully type-safe)

**Exception:** Foundry's `changelog` -> `decisions` alias. Fix by renaming the collection to `decisions` in Foundry's `content.config.ts`, or accept the one-off mapping.

**Lines saved:** ~70 (getCollectionName, collections object, all related types)

### Phase 2: Derive route-to-collection mapping from content.config.ts (MEDIUM IMPACT)

Instead of duplicating prefix config in `app.config.ts`, create a build-time module that reads `content.config.ts` definitions and generates the route pattern map automatically. The prefix is already defined there.

Alternatively, simplify to a static map in app.config:
```ts
// app.config.ts
content: {
  routeMap: {
    '/docs': 'docs',
    '/darksky': 'docs',
    '/decisions': 'decisions',
  },
  // ...
}
```

This replaces `getRoutePatterns()` (dynamic pattern building) with a simple object lookup — ~30 lines eliminated.

**Lines saved:** ~50 (getRoutePatterns, getCollectionPrefix, getCollectionForRoute simplified to lookup)

### Phase 3: Extract routing constants (LOW IMPACT)

Move `routing` paths (`offers`, `success`, `sources`, `pagesPrefix`, `pagesBackLabel`) to a simple typed config object, either in `app.config.ts` directly or a tiny composable. These are not content collection logic.

**Lines saved:** ~20

### Phase 4: Keep ProseA-specific logic as focused utility

`resolveInternalPath()`, `getPageMetadata()`, `flattenNavigation()` are only used by `ProseA.vue`. Consider moving them into a `useProseLinks()` composable scoped to that purpose, or keeping them in a slimmed-down `useContentConfig()`.

**Lines saved:** 0 (reorganization, not elimination)

---

## 6. Estimated Complexity Reduction

| Area | Current Lines | After Simplification | Saved |
|---|---|---|---|
| Collection name resolution | ~70 | 0 | 70 |
| Route pattern building | ~50 | ~15 (static map) | 35 |
| Prefix accessor functions | ~30 | 0 | 30 |
| Routing constants | ~20 | ~10 (simple object) | 10 |
| Path resolution (keep) | ~40 | ~40 | 0 |
| Navigation helpers (keep) | ~25 | ~25 | 0 |
| Types/interfaces | ~30 | ~10 | 20 |
| **Total** | **~336** | **~100-120** | **~215-235** |

**Estimated reduction: 65-70%** (from 336 lines to ~100-120 lines)

The remaining composable would contain:
1. A static route-to-collection map lookup (~15 lines)
2. `resolveInternalPath()` for ProseA link resolution (~40 lines)
3. `getPageMetadata()` + `flattenNavigation()` for ProseA popovers (~25 lines)
4. Routing constants object (~10 lines)
5. Types (~10 lines)

---

## 7. Key Risks

1. **Breaking change for examples:** Removing `collections` object requires updating 8+ consumer files. Low risk since all changes are mechanical (`collections.docs` -> `'docs'`).
2. **Foundry changelog alias:** The `changelog` -> `decisions` mapping needs to be handled at the `content.config.ts` level instead of runtime.
3. **Prefix sync issue persists** if Phase 2 is skipped — the dual-config (content.config.ts + app.config.ts) problem remains.
4. **Test updates:** The test file (`useContentConfig.nuxt.spec.ts`) tests functions that would be eliminated. Tests need updating to match new API.

---

## 8. Files Involved

- `/Users/mac/Development/incubrain/product-validator/layer/app/composables/useContentConfig.ts` — main target
- `/Users/mac/Development/incubrain/product-validator/layer/app/composables/useContentPage.ts` — primary consumer of `getCollectionForRoute`
- `/Users/mac/Development/incubrain/product-validator/layer/app/components/content/prose/ProseA.vue` — consumer of path resolution + metadata
- `/Users/mac/Development/incubrain/product-validator/layer/app/components/convert/Internal.vue` — consumer of `collections` + `routing`
- `/Users/mac/Development/incubrain/product-validator/layer/app/components/convert/Social.vue` — consumer of `collections`
- `/Users/mac/Development/incubrain/product-validator/layer/app/layouts/article.vue` — consumer of `routing`
- `/Users/mac/Development/incubrain/product-validator/layer/modules/changelog/runtime/composables/useChangelog.ts` — consumer of `collections`
- `/Users/mac/Development/incubrain/product-validator/layer/modules/docs/runtime/composables/useCitations.ts` — consumer of `collections`
- `/Users/mac/Development/incubrain/product-validator/layer/modules/docs/runtime/composables/useGlossary.ts` — consumer of `collections` + `getRoutingPath`
- `/Users/mac/Development/incubrain/product-validator/layer/modules/docs/runtime/components/DocsAsideLeftBody.vue` — consumer of `collections`
- `/Users/mac/Development/incubrain/product-validator/examples/foundry/app/components/section/Offer.vue` — consumer of `collections`
- `/Users/mac/Development/incubrain/product-validator/examples/incubrain/app/components/section/Offer.vue` — consumer of `collections`
- `/Users/mac/Development/incubrain/product-validator/layer/app/app.config.ts` — source of duplicated collection config
- `/Users/mac/Development/incubrain/product-validator/layer/content.config.ts` — source of truth for collection definitions
- `/Users/mac/Development/incubrain/product-validator/examples/astronera/content.config.ts` — example collection definitions
- `/Users/mac/Development/incubrain/product-validator/examples/foundry/content.config.ts` — example with changelog->decisions alias
- `/Users/mac/Development/incubrain/product-validator/playground/test/nuxt/useContentConfig.nuxt.spec.ts` — tests to update
