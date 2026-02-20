# MDC Syntax Reference

Complete syntax specification for MDC (Markdown Components) used in Nuxt Content documentation files.

## Contents

- [Front matter](#front-matter)
- [Heading hierarchy](#heading-hierarchy)
- [Block components](#block-components)
- [Inline components](#inline-components)
- [Props passing](#props-passing)
- [Named slots](#named-slots)
- [Nesting](#nesting)
- [Span syntax](#span-syntax)
- [Inline attributes](#inline-attributes)
- [Variable binding](#variable-binding)
- [Code blocks](#code-blocks)
- [Edge cases](#edge-cases)

## Front matter

YAML front matter at the top of every `.md` file:

```yaml
---
title: 'Page Title'
description: 'One-sentence meta description'
navigation:
  icon: i-lucide-icon-name
---
```

**Required fields:**
- `title` -- Page title (serves as h1, never duplicate with `#` heading in body)
- `description` -- One-sentence summary for meta tags and search

**Optional fields:**
- `navigation.icon` -- Sidebar icon (Lucide or VS Code icon identifiers)
- `navigation: false` -- Hide from navigation (used on index/landing pages)
- `surround: false` -- Disable prev/next navigation links
- `titleTemplate` -- HTML title format: `'%s - My Docs'`
- `links` -- Source links array (API reference pages):
  ```yaml
  links:
    - label: Source
      icon: i-simple-icons-github
      to: https://github.com/org/repo/blob/main/path/to/file.ts
      size: xs
  ```

## Heading hierarchy

- **No `# h1` in body** -- `title` front matter serves as h1
- `## h2` for major sections
- `### h3` for subsections
- `#### h4` sparingly for deep sub-topics
- Never skip levels (no h2 -> h4 jump)
- Intro paragraphs come immediately after front matter, before first heading

## Block components

Defined with `::` (minimum 2 colons). Must contain closing `::`.

**Basic:**
```md
::card
Content of the card
::
```

**With inline props:**
```md
::alert{type="warning" icon="i-lucide-triangle-alert"}
Warning message with **markdown** support.
::
```

**With YAML props (for complex/many props):**
```md
::icon-card
---
icon: IconNuxt
title: Nuxt Architecture
description: Harness the full power of Nuxt.
---
::
```

**Auto-conversion rule:** When inline attributes exceed 80 characters or have 3+ attributes, use YAML props instead.

## Inline components

Single `:` prefix. Render inline within paragraphs.

**Basic:**
```md
A simple :inline-component in text.
```

**With label:**
```md
:badge[New Feature]
```

**With props:**
```md
:icon{name="i-lucide-moon"}
:read-more{to="/docs/guide/concepts"}
:read-more{title="Custom title" to="/docs/path"}
```

**With label and props:**
```md
:badge[v2.0]{color="success"}
```

## Props passing

Three methods for passing props to components:

### 1. Inline props `{}`

```md
::component{key="value" another="value2" booleanProp}
::
```

- String values: `key="value"` or `key='value'`
- Boolean (no value): `{no-border}` (stored as `"true"`)
- ID shorthand: `{#my-id}`
- Class shorthand: `{.text-red-500}` (chainable: `.class1.class2`)

### 2. YAML props `---`

```md
::component
---
icon: IconNuxt
title: Nuxt Architecture
items:
  - item1
  - item2
---
Content here
::
```

### 3. Bound/dynamic props `:`

Prefix prop name with `:` for JSON values:

```md
::dropdown{:items='["Nuxt", "Vue", "React"]'}
::\

::chart{:options='{"responsive": true}'}
::
```

Use single quotes for outer value so double quotes work for JSON inside.

## Named slots

Direct content into specific component slots using `#slotname`:

```md
::hero
Default slot content

#description
This renders inside the description slot.
::
```

**Explicit default slot:**
```md
::comp
#default
Explicitly in default slot.

#sidebar
Sidebar content.
::
```

**Slots with attributes:**
```md
::container
#header{class="bold"}
Header content
::
```

## Nesting

Increase colon count for each nesting level:

```md
::hero
  :::card
  Nested card content

    ::::inner
    Deeply nested
    ::::
  :::
::
```

Closing colons must match opening count. Each level adds 2 spaces indentation in serialized output.

## Span syntax

Square brackets create inline spans for styling text:

```md
Hello [World]{.bg-blue-500}!
[styled text]{#theid .aclass foo="bar"}
```

## Inline attributes

Apply to standard markdown elements:

```md
**bold**{.text-red-500}
_italic_{style="color: blue"}
`code`{lang="ts"}
[Link](url){.text-primary-500}
![Image](url){.rounded-lg}
```

## Variable binding

Bind front matter values in content:

```md
---
color: blue
---

The color is {{ $doc.color || 'red' }}.
```

## Code blocks

### Language and filename

````md
```ts [nuxt.config.ts]
export default defineNuxtConfig({})
```
````

### Inline code with language hint

```md
`ssr: false`{lang=ts}
`<NuxtLink>`{lang=vue}
```

### Line highlighting

````md
```ts {2,5-7}
// line 1
// line 2 - highlighted
// line 3
```
````

### Diff markers

````md
```ts
return ast // [!code ++]
return ast // [!code --]
```
````

### TypeScript twoslash

````md
```ts twoslash [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/content']
})
```
````

### Code groups (tabbed)

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

Tab labels come from `[brackets]` after language identifier.

### Code groups with sync

```md
::code-group{sync="pm"}
```

Persists tab selection across code groups on the page.

## Edge cases

1. **Inline-to-block promotion:** A single `:component` on its own line (with blank lines before/after) becomes block-level.
2. **Colon count must match:** `:::` does not close `::`.
3. **Component names:** Must start with letter, can contain letters/digits/hyphens/underscores, cannot end with underscore.
4. **Code fences inside components** are respected -- parser won't interpret `#` or `::` inside code fences.
5. **YAML `---` in components** only recognized as first content after block component opens.
6. **`[text]` vs checkboxes:** `[x]` is a span, but `- [ ] task` is a GFM checkbox (respected).
7. **Excerpt marker:** `<!--more-->` splits document into excerpt and body.
