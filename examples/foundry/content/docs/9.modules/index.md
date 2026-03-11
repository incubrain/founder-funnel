---
label: Modules
title: Modules Overview
description: Opt-in Nuxt modules that extend the Foundry layer with events, docs, RSS, changelog, and comments.
---

Foundry is built from opt-in Nuxt modules. Each module adds a specific capability and can be enabled or disabled in your `nuxt.config.ts`. Modules that ship with the layer are enabled by default — disable any you don't need.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],

  // Disable modules you don't need
  changelog: { enabled: false },
  docs: { enabled: false },
  // ...
})
```

::card-group
  ::card{title="Events" icon="i-lucide-activity" to="/docs/modules/events"}
  Analytics-agnostic event tracking, providers, webhooks, and anti-spam.
  ::

  ::card{title="Docs" icon="i-lucide-book-open" to="/docs/modules/docs"}
  Docs layout, search, citations, glossary, and bibliography.
  ::

  ::card{title="RSS" icon="i-lucide-rss" to="/docs/modules/rss"}
  Config-driven RSS 2.0 feed generation for any content collection.
  ::

  ::card{title="Changelog" icon="i-lucide-clock" to="/docs/modules/changelog"}
  Changelog timeline with team member lookups and author resolution.
  ::
::
