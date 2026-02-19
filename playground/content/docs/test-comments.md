---
title: Comment Test Page
description: A test page for exercising the documentation review comment system.
---

## Plain Text Section

This is a simple paragraph with no formatting. It should be straightforward to highlight and anchor.

A second paragraph under the same heading for testing block index counting.

## Formatted Text Section

This paragraph contains **bold text** right in the middle of a sentence.

Here we have *italic text* and also `inline code` mixed together.

A paragraph with a **bold phrase at the start** followed by regular text.

Regular text followed by **bold at the end**.

## List Section

- First list item with plain text
- Second list item with plain text
- Third list item with **bold text** inside

## Duplicate Text Section

The word Foundry appears here in this paragraph.

The word Foundry also appears here in this different paragraph.

## Nested Formatting Section

This has **bold with *nested italic* inside** the bold block.

A link to [Example Site](https://example.com) within a paragraph.

## Code Block Section

Here is a plain code example:

```
const plain = 'no highlighting'
```

Here is a syntax-highlighted code example:

```ts [content.config.ts]
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: { include: 'pages/**/*.md', prefix: '/' },
    }),
  },
})
```

Text after the code block should still be highlightable.

## Mixed Content Section

Paragraph before a table.

| Column A | Column B |
|----------|----------|
| Cell 1   | Cell 2   |

Paragraph after a table.
