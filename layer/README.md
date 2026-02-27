# @incubrain/foundry

A Nuxt layer for building validation landing pages and authority documentation sites. Forked from [Docus](https://docus.dev) by the Nuxt Content team.

## Installation

```bash
npm install @incubrain/foundry
```

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@incubrain/foundry']
})
```

## Features

- **Landing Pages** — Section-driven pages with signal capture (email, presales, bookings)
- **Documentation** — Authority docs with citations, glossary, bibliography, and MCP integration
- **Event Tracking** — Analytics-agnostic event system with webhook streaming and retry
- **RSS Feeds** — Config-driven feed generation from Nuxt Content collections
- **Changelog** — Timeline component for versioned entries with author resolution
- **Comments** — Dev-only documentation review system with text selection and element selection
- **Nuxt Content** — Markdown-first content with MDC component support
- **Nuxt UI** — Pre-styled components with Tailwind v4

## Quick Start

```bash
# Create a new project
npx create-foundry my-project
cd my-project
npm install
npm run dev
```

## Requirements

- Nuxt 4.x
- Node.js 22+

## Documentation

Full documentation: [foundry.incubrain.org](https://foundry.incubrain.org)

## Credits

Foundry's docs module is heavily inspired by [Docus](https://docus.dev) ([GitHub](https://github.com/nuxt-content/docus)), the documentation template by the Nuxt Content team. Docus provides a fully integrated documentation solution with Nuxt UI, MDC components, full-text search, and theming. Foundry builds on this foundation and adds signal capture, event tracking, and webhook streaming for demand validation.

**What changed from Docus:**
- Removed i18n — browser-native translation is improving rapidly with AI, and maintaining translations slows down shipping. Focus on writing great content in one language.
- Added glossary and citation system

For Docus-inherited features (MDC components, content collections, search, theming), the [Docus documentation](https://docus.dev/en) is an excellent reference alongside these docs.

## License

MIT
