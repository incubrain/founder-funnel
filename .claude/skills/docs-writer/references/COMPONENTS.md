# MDC Component Catalog

Complete catalog of components available in MDC markdown files. Organized by use case.

## Contents

- [Callout shortcuts](#callout-shortcuts)
- [Callout (full)](#callout-full)
- [Code group](#code-group)
- [Steps](#steps)
- [Tabs](#tabs)
- [Card and card group](#card-and-card-group)
- [Accordion](#accordion)
- [Collapsible](#collapsible)
- [Read more](#read-more)
- [Details](#details)
- [Field and field group](#field-and-field-group)
- [Badge](#badge)
- [Icon](#icon)
- [Kbd](#kbd)
- [Code collapse](#code-collapse)
- [Code tree](#code-tree)
- [Code preview](#code-preview)

## Callout shortcuts

Aliases for `::callout` with preset colors/icons. Use these as the primary callout syntax.

**Severity order (lowest to highest):** tip < note < callout < important < warning < caution

```md
::tip
Helpful advice or shortcut.
::

::note
Supplementary information.
::

::warning
Danger or pitfall to avoid.
::

::important
Critical information the reader must know.
::

::caution{icon="i-lucide-circle-x"}
Wrong approach (used for contrast with correct approach).
::
```

All shortcuts accept optional props: `icon`, `to`, `target`.

```md
::tip{icon="i-lucide-circle-check"}
Well done! Setup complete.
::

::warning{to="/docs/guide/caveats"}
This pattern has known limitations.
::
```

## Callout (full)

Full `::callout` with explicit color control.

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `string` | Icon identifier (e.g. `"i-lucide-info"`) |
| `color` | `string` | `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` |
| `to` | `string` | Navigation URL |
| `target` | `string` | Link target (`_blank`, etc.) |

```md
::callout{icon="i-lucide-info" color="info"}
Informational callout with custom color.
::

::callout{icon="i-lucide-circle-check" color="success"}
Operation completed successfully.
::

::callout{icon="i-lucide-circle-x" color="error"}
Configuration error detected.
::
```

## Code group

Tabbed code blocks. Tab labels from `[brackets]` after language.

| Prop | Type | Description |
|------|------|-------------|
| `sync` | `string` | Persist tab selection to localStorage key |

````md
::code-group

```bash [pnpm]
pnpm add @nuxt/ui
```

```bash [yarn]
yarn add @nuxt/ui
```

```bash [npm]
npm install @nuxt/ui
```

::
````

With synchronized selection across code groups:

```md
::code-group{sync="pm"}
```

## Steps

Transform headings into numbered step-by-step guides.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `"2"` / `"3"` / `"4"` | `"3"` | Heading level for steps |

````md
::steps{level="3"}

### Install the module

```bash
pnpm add @nuxt/ui
```

### Configure Nuxt

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

### Start development

```bash
pnpm dev
```

::
````

## Tabs

Interactive tabbed content (for non-code content).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal"` / `"vertical"` | `"horizontal"` | Layout |
| `defaultValue` | `string` | `"0"` | Initial tab |
| `variant` | `"pill"` / `"link"` | - | Visual style |

```md
::tabs

:::tabs-item{label="Overview" icon="i-lucide-eye"}
Overview content with **markdown** support.
:::

:::tabs-item{label="Configuration" icon="i-lucide-settings"}
Configuration details here.
:::

::
```

Note: `:::` for nested items inside `::` parent.

## Card and card group

Content blocks with navigation, icons, and grid layout.

### Card props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card heading |
| `icon` | `string` | Icon identifier |
| `color` | `string` | Color variant |
| `to` | `string` | Navigation URL |
| `target` | `string` | Link target |
| `variant` | `string` | `solid`, `outline`, `soft`, `subtle` |

### Card group

```md
::card-group

::card
---
title: Getting Started
icon: i-lucide-rocket
to: /docs/getting-started
---
Follow this guide to set up your project.
::

::card
---
title: API Reference
icon: i-lucide-book-open
to: /docs/api
---
Complete API documentation.
::

::
```

Single card with inline props:

```md
::card{title="Open on StackBlitz" icon="i-simple-icons-stackblitz" to="https://stackblitz.com" target="_blank"}
```

## Accordion

Expandable/collapsible content sections.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single"` / `"multiple"` | `"single"` | One or many open |
| `defaultValue` | `string[]` | - | Initially open items |
| `collapsible` | `boolean` | `true` | Allow closing open item |

```md
::accordion

:::accordion-item{label="What is this?" icon="i-lucide-circle-help"}
Expandable FAQ item with **markdown** support.
:::

:::accordion-item{label="How does it work?"}
Detailed explanation here.
:::

::
```

## Collapsible

Single expandable section.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Initial state |
| `open` | `boolean` | - | Controlled state |

```md
::collapsible

| Prop | Default | Type |
|------|---------|------|
| `name` | | `string` |
| `size` | `md` | `string` |

::
```

## Read more

Cross-reference links. The primary mechanism for linking between docs pages.

**Inline (auto-generates link text):**
```md
:read-more{to="/docs/guide/concepts/rendering"}
```

**Inline with custom title:**
```md
:read-more{title="Learn about rendering" to="/docs/guide/concepts/rendering"}
```

**Block (with custom descriptive text):**
```md
::read-more{to="/docs/api/configuration"}
Every option is described in the **Configuration Reference**.
::
```

**With icon:**
```md
::read-more{to="/docs/guide/experimental" icon="i-lucide-star"}
Explore experimental features.
::
```

**Placement rule:** Always at the end of a section, after the last paragraph/code block.

## Details

Collapsible content with summary trigger.

```md
::details
:summary[Additional setup notes:]
- **Node.js**: Use an even-numbered version (18, 20, 22)
- **IDE**: VS Code with Volar extension recommended
::
```

Can nest inside callouts:
```md
::note
  ::details
  :summary[Advanced configuration:]
  Detailed configuration options here.
  ::
::
```

## Field and field group

Document API parameters and props.

### Field props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field identifier |
| `type` | `string` | Data type |
| `description` | `string` | Explanatory text |
| `required` | `boolean` | Whether required |

```md
::field-group

::field{name="color" type="string" required}
Color variant: `primary`, `secondary`, `neutral`.
::

::field{name="size" type="string"}
Size: `xs`, `sm`, `md`, `lg`, `xl`. Default `md`.
::

::
```

## Badge

Status labels and version indicators.

```md
:badge[New]{color="success"}
:badge[Beta]{color="warning"}
:badge[Deprecated]{color="error"}
:badge[v4.0]{color="primary"}
```

## Icon

Inline icons from Iconify collections.

```md
:icon{name="i-lucide-moon"}
:icon{name="i-simple-icons-nuxtdotjs"}
```

Naming convention: `i-{collection}-{name}` (e.g., `i-lucide-check`, `i-simple-icons-github`).

## Kbd

Keyboard shortcuts.

```md
Press :kbd{value="meta"} :kbd{value="K"} to open search.
```

`meta` renders as Command on macOS, Ctrl elsewhere.

## Code collapse

Make long code blocks collapsible.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Label text |
| `open` | `boolean` | `false` | Initial state |
| `openText` | `string` | - | Text when collapsed |
| `closeText` | `string` | - | Text when expanded |

````md
::code-collapse

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-sans: 'Inter', sans-serif;
  /* many more lines... */
}
```

::
````

## Code tree

File/folder structure with syntax-highlighted code.

| Prop | Type | Description |
|------|------|-------------|
| `defaultValue` | `string` | Initial file path |
| `expandAll` | `boolean` | Expand all directories |

````md
::code-tree{defaultValue="app/app.config.ts"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

::
````

## Code preview

Live preview alongside source code.

````md
::code-preview
Preview content rendered here.

#code
```vue
<template>
  <p>Source code shown here</p>
</template>
```
::
````

## Color reference

Shared across all components:

| Color | Use |
|-------|-----|
| `primary` | Primary actions, default |
| `secondary` | Secondary emphasis |
| `success` | Positive outcomes |
| `info` | Informational, tips |
| `warning` | Caution, deprecation |
| `error` | Errors, breaking changes |
| `neutral` | Muted, de-emphasized |
