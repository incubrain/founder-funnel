---
title: Render Article
description: Targeted by a routeRules.appLayout entry in playground nuxt.config.ts.
---

route-rule-applayout: this path is mapped to `appLayout: 'article'` via `routeRules` in `playground/nuxt.config.ts`.

Nuxt 4 natively reads `routeRules.appLayout` and applies it to the matched route. If this works, the rendered page should be wrapped in the `article` layout.
