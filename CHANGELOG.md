# Changelog

All notable changes to this project will be documented in this file.

## [0.5.2] - 2026-02-16

### Added

- **Package exports** — `@incubrain/foundry/content.collections` export enables consumers to import content collection zod schemas directly instead of redefining them
- **evlog structured logging** — AI-friendly error context with `why`/`fix` fields, enrichment plugin (user agent + geo), tail sampling plugin, and browser transport
- **evlog drain scaffolding** — `createDrainPipeline()` for batching + retry; example drain in `examples/astronera/server/plugins/evlog-drain.ts`
- **CI pipeline** — Lint, typecheck, and build diagnostics for AI agent observability
- **Team collection** — `baseTeamSchema` in layer content collections

### Changed

- **Content collection schemas deduplicated** — Examples now import schemas from layer via `@incubrain/foundry/content.collections` instead of copy-pasting definitions
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
