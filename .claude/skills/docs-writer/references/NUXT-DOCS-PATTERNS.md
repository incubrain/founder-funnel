# Nuxt Documentation Gold-Standard Patterns

Patterns extracted from the Nuxt docs repository (nuxt/nuxt/docs/). Follow these for professional documentation output.

## Contents

- [Page structure](#page-structure)
- [Writing conventions](#writing-conventions)
- [Cross-references](#cross-references)
- [Code examples](#code-examples)
- [Callout usage](#callout-usage)
- [Navigation structure](#navigation-structure)
- [Formatting conventions](#formatting-conventions)

## Page structure

Every documentation page follows this flow:

```
---
title: 'Page Title'
description: 'One-sentence summary.'
navigation:
  icon: i-lucide-icon-name
---

Intro paragraph(s) explaining the concept in plain terms.
No heading before this -- flows directly from title.

## Major Section

Content with code examples and explanations.

### Subsection

More specific details.

:read-more{to="/docs/related-topic"}
```

**Rules:**
1. No `# h1` in body -- title from frontmatter only
2. 1-3 intro paragraphs immediately after frontmatter (no heading)
3. `## h2` for major sections
4. `### h3` for subsections within h2
5. `:read-more` at end of sections for cross-references
6. Never skip heading levels

## Writing conventions

**Tone:**
- Second person ("you"): "You can extend..."
- Active voice: "Nuxt throws an error" not "An error is thrown"
- Direct and instructive: "Create a file and add..."
- No "simply", "just", "obviously" -- explicitly banned

**Formatting:**
- **Bold** for key term emphasis: "**creating your web application**"
- **Bold colon-labels** in lists: `- **Performance**: Users can get...`
- Inline code for file paths and references: `` `nuxt.config.ts` ``
- Link on first mention of a technical concept
- Paragraphs: 2-4 sentences max

**Avoid:**
- "This section describes..." (meta-commentary)
- "Note that" (just state the fact)
- Subjective words: "simply", "just", "obviously", "easily"

## Cross-references

**`:read-more` (primary mechanism):**
```md
:read-more{to="/docs/guide/concepts/rendering"}
:read-more{title="Custom title" to="/docs/guide/concepts/rendering"}
```

**`::read-more` (block, with description):**
```md
::read-more{to="/docs/api/configuration"}
Every option is described in the **Configuration Reference**.
::
```

**Inline links on first mention:**
```md
The [`nuxt.config.ts`](/docs/directory-structure/nuxt-config) file can override...
```

**Placement rules:**
- `:read-more` at **end of section** (after last paragraph/code block)
- Inline links on **first mention** of a concept
- External links use standard markdown: `[vue-router](https://router.vuejs.org)`

## Code examples

**Always include file labels:**
````md
```ts [nuxt.config.ts]
```vue [app/pages/index.vue]
```bash [Terminal]
```ini [.env]
````

**Inline code with language hints:**
```md
`ssr: false`{lang=ts}
`<NuxtLink>`{lang=vue}
```

**Code groups for alternatives (package managers, configs):**
````md
::code-group

```bash [pnpm]
pnpm add @nuxt/ui
```

```bash [npm]
npm install @nuxt/ui
```

::
````

**Directory structure convention:**
```
-| components/
---| base/
-----| Button.vue
```

Uses `-|` as root and `---|` for nesting.

**Diff markers in code:**
````md
```ts
pathPrefix: false, // [!code ++]
oldPath: true, // [!code --]
```
````

**TypeScript with twoslash:**
````md
```ts twoslash [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/content']
})
```
````

**Tables for parameters/options:**
```md
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | auto-gen | Unique key |
| `method` | `string` | `'GET'` | HTTP method |
```

## Callout usage

**Severity hierarchy (lowest to highest):**

1. `::tip` -- Helpful advice, shortcuts, recommendations
2. `::note` -- Supplementary info, neutral tone
3. `::callout` -- General-purpose edge-case info
4. `::important` -- Must-know to avoid problems
5. `::warning` -- Could break or cause unexpected behavior
6. `::caution` -- "Don't do this" examples (with `{icon="i-lucide-circle-x"}`)

**Usage patterns from Nuxt docs:**

```md
::tip{icon="i-lucide-circle-check"}
Well done! A browser window should automatically open.
::

::note
You don't have to use TypeScript to build with Nuxt.
::

::important
Check before using anything dependent on Nuxt plugins.
::

::warning
Never define `const state = ref()` outside of `<script setup>`.
::

::caution{icon="i-lucide-circle-x"}
Simply make sure the function returns a promise.
::
```

**Callouts with links:**
```md
::tip{icon="i-lucide-newspaper" to="https://example.com/article" target="_blank"}
Read the full guide on server components.
::

::warning{to="/docs/guide/caveats#known-issue"}
This pattern has known limitations.
::
```

## Navigation structure

**Numbered prefix system for sort order:**
```
docs/
  1.getting-started/
    01.introduction.md
    02.installation.md
  2.guide/
    1.concepts/
    2.best-practices/
  3.api/
```

Number prefix stripped from URL slug.

**`.navigation.yml` in each directory:**
```yaml
title: Get Started
titleTemplate: '%s - Get Started with Nuxt'
icon: i-lucide-rocket
```

**Index/landing pages:**
```yaml
---
title: 'Guide'
navigation: false
surround: false
---
```

Use `navigation: false` and `surround: false` on landing pages. These contain card grids linking to subsections.

## Formatting conventions

**Comparison tables:**
```md
| Feature | `runtimeConfig` | `app.config` |
|---------|-----------------|--------------|
| Client-side | Hydrated | Bundled |
| Env vars | Yes | No |
```

**Strikethrough for deprecated patterns:**
```md
| Config | Status |
|--------|--------|
| ~~`nitro.config.ts`~~ | Use `nitro` key in `nuxt.config` |
```

**TODO comments (for future improvements):**
```md
<!-- TODO: move to separate page when #14723 is resolved -->
```

**Images/diagrams from assets:**
```md
![Description of diagram](/assets/docs/concepts/rendering/ssr.svg)
```

**Video accordions (community content):**
```md
:video-accordion{title="Watch Alexander Lichter explain useState" videoId="mv0WcBABcIk"}
```

Always at end of section, never mid-paragraph.
