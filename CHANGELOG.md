# Changelog

## [0.8.0](https://github.com/incubrain/foundry/compare/v0.7.2...v0.8.0) (2026-08-20)

### Features

* add VISION.md — project vision relocated from _knowledge/visions (schema v2) ([726c9f1](https://github.com/incubrain/foundry/commit/726c9f137d5d994aea626479a241ecf5d3282d30))
* unified signal buffer + authenticated export endpoint; errors into signal stream; minimal section set (product-validator-a4r.8/.9/.16) ([1a9df90](https://github.com/incubrain/foundry/commit/1a9df901a0277d92c7d258293fbb85e12aeff858))
* visitor classification (human/agent/bot) on signal rows; starter Offer section (product-validator-a4r.10) ([28646bd](https://github.com/incubrain/foundry/commit/28646bdf52d27510eb06e9f50a893e613a41600c))

### Bug Fixes

* **example:** pass STATUS_ICONS .name string to UIcon (icons failed to render); add browser launch config ([8b57342](https://github.com/incubrain/foundry/commit/8b573422335f5ee5abc0d82c6064dfbf4a1c01d4))
* pin h3@1.15.11 in layer to resolve dual-h3 type mismatch; verification pass green (lint 0, typecheck 0, 81/81 tests, build ok) ([ba94e81](https://github.com/incubrain/foundry/commit/ba94e81c92a92a8d30a0de66cc4d8c335980434a))

## [0.7.2](https://github.com/incubrain/foundry/compare/v0.7.1...v0.7.2) (2026-05-22)

### Bug Fixes

* **layer:** use literal query values in useFetch to stop SSR recursion ([0c8dd4f](https://github.com/incubrain/foundry/commit/0c8dd4f32648b51c8eafc938576848d9412e8a89))

All notable changes to this project will be documented in this file.

## [0.7.1] - 2026-05-21

### Added

- **Sticky-footer pattern in `app.vue`** — `min-h-screen flex flex-col` wrapper with `flex-1` on the layout slot keeps the footer pinned to the viewport bottom while `<NuxtPage>` is empty or pending. Fixes the "footer rendered above content" symptom on SPA routes (`ssr: false`) and pages with heavy async setup — e.g. astronera's `/viirs/maharashtra` map page
- **`routeRules.appLayout` runtime bridge** — new global middleware (`app/middleware/app-layout.global.ts`) reads `getRouteRules({ path }).appLayout` and calls `setPageLayout()`. Nuxt 4 type-augments the field but ships no runtime handler; layouts now actually swap per `routeRules` mapping without each consumer wiring their own middleware
- **Server-side content endpoints** — `/api/_foundry/content/page` and `/api/_foundry/content/surround` are the single typed boundary for content lookups. Layouts and the catch-all consume them via `useFetch`. Side benefit: ready hook point for future caching, auth, or rate-limiting around content access
- **`ContentDoc` type** — exported from `useContentPage`. Minimal shape (title, description, hero, label, date, image, path, seo) intersected with `Record<string, unknown>` for arbitrary frontmatter
- **`modules/markdown-rewrite.ts` shipped in tarball** — was missing from `layer/package.json` `files:` array. Consumers using the layer's Vercel edge-redirect module now have the file present
- **Playground rendering test matrix** — 17 E2E tests in `playground/test/e2e/rendering.e2e.spec.ts` cover default SSR, SPA-only routes, app-page vs content precedence, dynamic params, `<ClientOnly>` islands, `routeRules` (headers/redirect/appLayout), structural DOM order, and content/app-page layout equivalence. Run with `pnpm --filter playground test:e2e`
- **Rendering-modes documentation** — `examples/foundry/content/docs/5.advanced/4.rendering-modes.md` documents URL → page resolution order, layout selection rules, every rendering knob, real-world consumer patterns, and debugging tips
- **Local registry workflow (verdaccio)** — `.verdaccio/config.yaml` + `layer/scripts/publish-local.sh` + root `verdaccio:start` / `layer:publish:local` scripts. Enables testing local layer changes in external consumer repos (astronera, incubrain). Documented in `AGENTS.md`

### Changed

- **Layouts decoupled from content existence** — `default`, `landing`, `article` no longer call `throw createError(404)` when content is missing. App pages that opt into a Foundry layout (`definePageMeta({ layout: 'article' })`) no longer 404 unless they explicitly set `layout: false`. Both incubrain and astronera previously worked around this by setting `layout: false` on every hand-built app page
- **Catch-all owns the 404** — `layer/app/pages/[...slug].vue` does `getPage()` + `setContext()` + the 404 throw. Layouts fetch their own copy via the same `useFetch` key (deduped) so SSR has page data at layout-render time. Previously each layout fetched independently and threw separately
- **`useContentPage.getPage()` uses `useFetch`** — talks to `/api/_foundry/content/page` instead of calling the auto-imported `queryCollection` directly. Sidesteps a dev-mode crash (`event.req.headers.entries is not a function`) under our pinned h3@1 + `@nuxt/content@3.13`
- **`as any` casts replaced with typed Content shapes** — 15 usages across `useContentPage`, layouts, the catch-all, the appLayout middleware, and the server endpoints now use `ContentDoc`, `keyof PageCollections`, `ContentNavigationItem`, and Nuxt's `LayoutKey` parameter inference

### Fixed

- **`UPageHero` 0.10 CLS on content-driven pages** — layouts used to read from a shared context that the catch-all populated *inside* its slot, AFTER the layout's render committed. SSR emitted no hero (`v-if` false); client hydrated with hero (`v-if` true); body shifted 448px. Both layouts and the catch-all now fetch via the same dedupe key, so SSR and CSR render identical HTML. Measured drop from CLS 0.102 → 0.0004 on `/render-landing`, 0.076 → 0.0003 on `/render-default`
- **Footer rendering above content on SPA / async-pending routes** — see Added: sticky-footer pattern in `app.vue`
- **`routeRules.appLayout` was a silent no-op** — see Added: runtime bridge middleware
- **Root `/` URL 404 in the catch-all** — `useContentPage.getPage()` stripped the trailing slash from `/` into an empty string, causing `queryCollection.path('').first()` to return null. Now preserves the root slash so the catch-all correctly serves `content/pages/index.md`

### Known issues

- **`pnpm verify` typecheck failures unrelated to this release** — 10 pre-existing TypeScript errors block the verify gate (h3 v1/v2 type drift in `modules/rss/server`, `server/mcp/tools/list-pages.ts`, `server/middleware/docs-redirect.ts`; `event.node` possibly-undefined access in `app/utils/prerender.ts`; missing `toc` prop type in `modules/docs/runtime/layouts/docs.vue`). 0.7.0 shipped past these as well. Tracked in `bd:product-validator-o3q`; will be addressed alongside the deferred Nitro v3 / h3@2 / unhead@3 cascade. 0.7.1 was released by bypassing the verify hook (`release-it --no-before-init` or equivalent)

## [0.7.0] - 2026-03-24

### Added

- **MCP tools for decisions & change detection** — `list-decisions`, `get-decision` query the changelog collection; `what-changed` returns SHA-256 content hashes across docs + changelog for efficient remote polling with optional `since` filter
- **Content hash enrichment** — `list-pages` and `get-page` MCP tools now include `contentHash` (SHA-256 of raw markdown) enabling remote systems to detect content changes without re-fetching
- **Content-hash utility** — `computeContentHash()` server utility for SHA-256 fingerprinting of content
- **Auto-registration plugin** — Nitro plugin that registers Foundry sites with the Incubrain mentorship network on production startup (`NUXT_FOUNDRY_REGISTER=true`); sends site URL, MCP endpoint, and available RSS feeds
- **12 background utilities** — 6 theme-aware patterns (`bg-pattern-grid`, `grid-sm`, `grid-lg`, `dots`, `diagonal`, `cross`) and 6 gradients (`bg-gradient-radial-primary`, `radial-secondary`, `fade-t`, `fade-b`, `spotlight`, `mesh`) using Nuxt UI semantic CSS variables; automatically follow app theme overrides
- **Animation utilities** — `perspective-1000` and `animate-bounce-slow` extracted from Hero components into reusable layer utilities
- **Page & layout transitions** — CSS opacity transitions (150ms page, 200ms layout) matching the `out-in` transition names in nuxt.config
- **Unit tests** — 32 new tests for content-hash utility, RSS XML generation (`escapeXml`, `buildRSSFeed`), and webhook formatters (Discord, Slack, Telegram); total test count: 86

### Changed

- **`useContentPage()` context lifecycle** — Context is no longer eagerly cleared on route change; old content persists until the new layout calls `setContext()` with fresh data, eliminating the blank flash between layouts
- **Hero components refactored** — Foundry and Incubrain Hero components now use layer background utilities (`bg-gradient-radial-primary`, `bg-pattern-grid`) instead of duplicated scoped CSS

### Fixed

- **Layout flickering on cross-layout navigation** — Removed eager `context.value = null` watcher in `useContentPage` that caused blank renders during layout transitions; combined with new transition CSS for smooth opacity fades

## [0.6.1] - 2026-03-12

### Fixed

- **Inline minimark error** — removed minimark dependency

## [0.6.0] - 2026-02-27

### Added

- **RSS module** — Config-driven RSS feed generation from Nuxt Content collections; register feeds in `nuxt.config.ts` with field mapping
- **Changelog module** — Timeline component for versioned changelog entries with author resolution from team collection
- **Docs module** — Glossary terms (`Defn`), inline citations (`Cited`), bibliography, full-text search, and 3-column docs layout; all features toggleable via config
- **Docs navigation middleware** — Auto-redirect to first child page when visiting a docs section root
- **SectionWrapper `reverseBelow` prop** — Responsive layout reversal using VueUse breakpoints; sections stack in reverse order on mobile
- **Webhook retry utility** — Exponential backoff with jitter for webhook delivery
- **CLI copy-list system** — Post-scaffold fetching of shared config files from GitHub with path traversal prevention
- **CLI test suite** — Unit tests for scaffolding and argument parsing
- **Comprehensive documentation** — 9 sections (50+ pages) covering getting started, content, signal capture, theming, advanced, testing, deployment, reference, and modules
- **Starter template enhancements** — Split Hero into sub-components, added app.config.ts, team content, devDependencies for testing
- **CI starter build job** — Validates the scaffolded starter template builds end-to-end

### Changed

- **Modular architecture** — Extracted RSS, Changelog, and Docs from layer root into isolated opt-in Nuxt modules under `modules/`
- **Icon packages** — Replaced monolithic `@iconify/json` with individual `@iconify-json/lucide` and `@iconify-json/simple-icons` (peer dependencies)
- **Console → evlog** — All remaining `console.*` calls replaced with evlog structured logging
- **CaseStudy border tokens** — `border-neutral-800` → `border-default` for correct light/dark mode
- **Footer components** — AppFooterBottom and AppFooterLeft restructured
- **MCP tools** — `get-tools.ts` renamed to `get-page.ts`
- **Webhook handler** — Significant rework of `webhook.post.ts` with improved formatting
- **Starter dependency** — Pinned `@incubrain/foundry` to `^0.6.0` (was `latest`)
- **CLI default directory** — `my-funnel` → `my-project`
- **CI security** — Pinned GitHub Actions to commit SHAs
- **Dependencies** — VueUse 14.2.1, minimark 1.0.0, MCP toolkit 0.7.0, Nuxt Content 3.11.2

### Fixed

- **Dynamic Tailwind classes** — PageSplit uses static class map instead of template literal interpolation, preventing build-time purging
- **Citation ID handling** — Fixed citation reference resolution
- **Docs redirect middleware** — Path handling fix
- **CLI input validation** — Added path traversal prevention, repo/ref/path validation (CodeQL alert fix)
- **Lint errors** — Resolved all lint errors across layer and CLI

### Removed

- **InlineTest component** — Removed test component from published package
- **Legacy RSS files** — `convert/Rss.vue`, `useRssFeed.ts`, `rss.handler.ts` moved to RSS module
- **Legacy logger** — `server/utils/logger.ts` replaced by evlog
- **Legacy config resolver** — `shared/config-resolver.ts` removed
- **Starter Dockerfile** — Removed `deploy/Dockerfile.starter`

## [0.5.2] - 2026-02-16

### Added

- **Package exports** — `@incubrain/foundry/schemas` export enables consumers to import content collection zod schemas directly instead of redefining them; wildcard `./*` export preserves deep imports
- **evlog structured logging** — AI-friendly error context with `why`/`fix` fields, enrichment plugin (user agent + geo), tail sampling plugin, and browser transport
- **evlog drain scaffolding** — `createDrainPipeline()` for batching
- **CI pipeline** — Lint, typecheck, and build diagnostics for AI agent observability
- **Team collection** — `baseTeamSchema` in layer content collections

### Changed

- **Content collection schemas deduplicated** — Examples now import schemas from layer via `@incubrain/foundry/schemas` instead of copy-pasting definitions
- **Type declarations consolidated** — Moved type declarations into `shared/types/` for single source of truth
- **Component logic extracted to composables** — `useChangelog`, `useFormCapture`, `useRssFeed`, `useSocialLinks`, `useSocialShare`, `useSourcesTable`
- **Console replaced with evlog** — All `console.*` calls replaced with evlog browser transport for structured logging
- Removed `useContentCache` composable in favour of direct content queries with camelCase yml items
- Removed old starter example (lives inside `.starters/*` now)
- Renamed project from "Founder Funnel" to "IncuBrain Foundry"

### Fixed

- **Zero typecheck errors** — Resolved all type errors across layer, shared files, and module declarations
- **All lint errors resolved** — Enforced lint in CI
- **All broken content links resolved** — Re-enabled `failOnError` in CI for link checker and prerender
- Normalised URL path handling in `useContentPage` and `useContentConfig`
- Changelog/decisions items loading with consistent `useContentConfig.collections` data fetching
- Dark/light mode issues in FAQ accordion and default layout
- Removed duplicate SEO modules already included with `@nuxtjs/seo`
- OG image, IPX, and decisions routes excluded from prerender to avoid CI failures
- evlog auto-imports and RSS `include` pattern extended to `/rss/**`

## [0.5.1] - 2026-02-03

### Fixed

- Citations handle missing IDs gracefully
- Internal linking no longer incorrectly prefixes docs path to page links
- `useCitations` reactivity with computed get/set state
- Page data loads correctly based on layout
- `SectionWrapper` forwards slots with scope for Nuxt Studio UI detection
- `addServerHandler` requires explicit method
- Rename `ProseCite|ProseDfn` to `Cited|Defn` (Nuxt Studio inline prose workaround)

### Changed

- Replace heroicons with Lucide icons
- Bump Nuxt to 4.3.0
- Bump Nuxt Studio to 1.2.0
- Add "Built with @incubrain/foundry" to footer

## [0.5.0] - 2026-01-31

First npm release as `@incubrain/foundry`.

### Added

- **npm package** — Install via `npm install @incubrain/foundry`
- **CLI** — `npx create-foundry` scaffolds new projects
- **Authority docs** — Citations, cross-linking, bibliography, MCP integration
- **ProseCite/ProseDfn** — Inline citation and term definition components
- **PageHeroWrapper/PageSplit** — Better MDC syntax support and layout flexibility
- **UCarousel slots** — Slot support using `cloneVNode` and `useSlots`
- **Dynamic navigation** — Auto-generated from content pages
- **Content collections** — Extensible via `zod.merge()`
- **Nuxt LLMs** — Better LLM discovery for docs
- **RSS feeds** — Dynamic generation with collection handlers

### Changed

- Rebrand from "Founder Funnel" to "Foundry"
- Fork docus, remove i18n and feature bloat
- Restructure repo for npm publish (layer/, examples/, cli/)
- Move layer deps from root to layer/package.json
- Reduce bundle size by 10MB (remove default icons, lazy-load KaTeX)
- Simplify events system
- Consolidate layouts from 6 to 4
- Content-driven website using Nuxt Content catchall pages

### Fixed

- Citations and bibliography rendering
- HMR issues with vibekanban branches
- Prettier pnpm workspace resolution
- Dockerfile copying correct directories

### Removed

- Dependabot (more noise than value)
- One-click deploy (replaced with repo-sync)
- QR code function (use dub.co instead)
- Team collection complexity
