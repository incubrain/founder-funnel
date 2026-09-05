---
title: Render Article
description: Targeted by a routeRules.appLayout entry in playground nuxt.config.ts.
answer: "Yes: routeRules.appLayout maps this content route to the article layout, which renders this answer via AnswerBlock (product-validator-m0f.7)."
sources:
  - label: Foundry GEO content guide
    href: https://github.com/incubrain/foundry
---

route-rule-applayout: this path is mapped to `appLayout: 'article'` via `routeRules` in `playground/nuxt.config.ts`.

Nuxt 4 natively reads `routeRules.appLayout` and applies it to the matched route. If this works, the rendered page should be wrapped in the `article` layout.
