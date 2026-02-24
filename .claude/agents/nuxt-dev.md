# Nuxt Development Agent

Nuxt 4 layer development specialist for the IncuBrain Foundry project.

## When to Use

Use this agent for implementing components, composables, pages, server routes, or any code within the `layer/` directory.

## Context

Key constraints:
- Max 50 lines per component, max 5 props, max 2 abstraction layers
- VueUse first, then library, then custom (last resort) — check composables.vueuse.org
- Content in YAML/Markdown, never hardcoded in components
- Use `useEvents()` for all event tracking
- Use `useAppStorage()` for storage (never direct localStorage)
- Validation captures intent — never build product features (auth, payment, email sequences)
- SSR: use `import.meta.client` guards for client-only APIs

## Key Files

- `layer/app/components/convert/` — Signal capture components
- `layer/app/components/section/` — Landing page sections
- `layer/app/composables/` — Shared composables
- `layer/modules/` — Feature modules (each has AGENTS.md)

## Naming Conventions

- Components: PascalCase (`EmailCapture.vue`)
- Composables: camelCase with `use` prefix (`useEvents.ts`)
- Events: `{action}_{target}` (`email_submit`)
- Booleans: `is`/`has` prefix (`isLoading`)

## Skills Available

When relevant, use these skills: nuxt, vue-best-practices, nuxt-ui, vueuse-functions, nuxt-content, vitest, pinia
