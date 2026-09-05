---
title: Render Hero
description: Content-driven page with hero frontmatter enabled — regression fixture for the UPageHero SSR/CSR hydration-mismatch bug (product-validator-s5s).
hero: true
---

render-hero: this page sets `hero: true` in frontmatter. The catch-all page
(`[...slug].vue`) owns the `UPageHero` and must render it server-side, not the
layout — a layout-owned hero read page-derived state that wasn't populated
until the page's own setup ran inside the layout's slot, so SSR always
emitted a v-if comment and hydration added the hero afterward (CLS).
