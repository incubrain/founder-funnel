---
title: Content
description: How content works in Foundry — pages, landing sections, offers, FAQ, team profiles, and navigation.
---

All content in Foundry lives in the `content/` directory as Markdown and YAML files. Customers edit content — not code.

Foundry uses [Nuxt Content v3](https://content.nuxt.com){target="_blank"} with [Zod](https://zod.dev){target="_blank"}-validated schemas to ensure every content file matches the shape components expect.

::card-group
  ::card{title="Overview" icon="i-lucide-eye" to="/docs/content/overview"}
  Content-first philosophy and how collections work.
  ::

  ::card{title="Pages" icon="i-lucide-file-text" to="/docs/content/pages"}
  Page collections, frontmatter, and layout assignment.
  ::

  ::card{title="Landing Pages" icon="i-lucide-layout" to="/docs/content/landing-pages"}
  MDC section syntax for building landing pages from Markdown.
  ::

  ::card{title="Offers & Success" icon="i-lucide-gift" to="/docs/content/offers"}
  Offer detail pages and post-conversion success pages.
  ::

  ::card{title="FAQ" icon="i-lucide-help-circle" to="/docs/content/faq"}
  FAQ entries in YAML with type filtering.
  ::

  ::card{title="Team" icon="i-lucide-users" to="/docs/content/team"}
  Team member profiles and the founder flag.
  ::

  ::card{title="Navigation" icon="i-lucide-menu" to="/docs/content/navigation"}
  Header, footer, and banner configuration.
  ::
::
