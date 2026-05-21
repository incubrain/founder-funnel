---
title: Render Landing
description: Content-driven page requesting the landing layout via frontmatter.
layout: landing
---

frontmatter-layout: this page asks for `layout: landing` in its frontmatter.

The catch-all should honor it (Nuxt reads `meta.layout` from the page's `definePageMeta`, not from content frontmatter — so this test is expected to FAIL until the layer wires the bridge).
