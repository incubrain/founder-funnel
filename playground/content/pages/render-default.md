---
title: Render Default
description: Content-driven page with no layout hint.
---

content-driven: this page is served by the layer catch-all `[...slug].vue`.

No `layout:` frontmatter and no `routeRules.appLayout` — should fall through to Nuxt's `default` layout.
