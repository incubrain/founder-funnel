---
name: docs-writer
description: Creates and edits Nuxt Content MDC documentation for the Dark Sky Conservation project. Writes policy documentation targeting Maharashtra government officials and academic researchers. Handles section-specific rules (Research/Policy/Pilots), citation syntax, MDC component selection, and frontmatter conventions. Use when working on content/docs/ markdown files or .md documentation files.
---

## Activation

This skill applies when editing `.md` files under `examples/astronera/content/docs/`. Determine the section from the file path and apply its rules throughout.

## Reference Files

Detailed syntax and component specifications live in the `references/` directory. Consult on demand:

- **`references/MDC-SYNTAX.md`** -- Complete MDC syntax: frontmatter, block/inline components, props, slots, nesting, code blocks
- **`references/COMPONENTS.md`** -- Full catalog of available components with props tables and examples
- **`references/NUXT-DOCS-PATTERNS.md`** -- Gold-standard page structure, writing conventions, cross-reference patterns
- **`references/ASTRONERA-CUSTOM.md`** -- Citation `:cited[]{}`, glossary `:defn[]{}`, math, data source rules, section content boundaries (astronera template only)

## Page Structure

Every page follows this flow:

```md
---
title: 'Page Title'
description: 'One-sentence summary for meta tags.'
navigation:
  title: Short Nav Title
  icon: i-lucide-icon-name
---

Intro paragraph(s) explaining the concept. No heading before this.

## Major Section

Content with citations and callouts.

### Subsection

More specific details.
```

**Rules:**
1. No `# h1` in body -- `title` frontmatter serves as h1
2. 1-3 intro paragraphs immediately after frontmatter (before first heading)
3. `## h2` for major sections, `### h3` for subsections
4. Never skip heading levels (no h2 to h4)
5. Landing/index pages use `navigation: false` and `surround: false`

## Target Audience

### Government Officials
- State department heads (Environment, Tourism, Energy, Agriculture, Forest, Public Health)
- Need evidence-based justification, clear recommendations, implementation guidance
- Reading for decision-making on policy adoption and resource allocation

### Academic Researchers
- Policy analysts, technical advisors (IIT, IISER, TIFR, environmental organizations)
- Need rigorous citations, methodological clarity, data transparency
- Reading for evidence evaluation and technical consultation

## Writing Standards

**Voice:** Third-person objective, authoritative but accessible. Active voice 85%+, present tense 90%.

**Sentence patterns:**
- Subject-first declarative (60%): "Light pollution disrupts nocturnal ecosystems."
- Imperative instructions (25%): "Review the ecological impact evidence in Section 2.1."
- Contextual openers (15%): "When protecting migratory corridors, restrict lighting."

**Paragraphs:** 2-4 sentences max. Topic sentence first, then supporting details.

**Modal verbs (precision in recommendations):**

| Verb | Meaning | Frequency | Example |
|------|---------|-----------|---------|
| `can` | Optional | 40% | "Municipalities can implement lighting curfews." |
| `should` | Recommended | 30% | "Policies should prioritize ecological zones." |
| `may` | Possibility | 20% | "This may reduce bird collisions." |
| `must` | Required | 10% | "Protected areas must limit upward light." |

Avoid: `might`, `could`, `would` (use sparingly for hypotheticals only).

**Banned words/patterns:**
- "simply", "just", "obviously", "easily"
- "This section describes...", "In this document...", "Note that"
- "utilize" (use "use"), "leverage" (use "use"), "in order to" (use "to")
- Em-dashes (--) -- use commas or parentheses
- Starting with "It" or "This" without clear antecedent

## AstronEra-Specific Features

When editing `examples/astronera/content/docs/` files, consult `references/ASTRONERA-CUSTOM.md` for:
- Citation syntax (`:cited[text]{#source-id}`)
- Glossary terms (`:defn[term]{#id}`)
- Math expressions (KaTeX)
- Data source rules (MASTER_KEY.md)
- Section-specific content boundaries and component selection (Research/Policy/Pilots)

## Callout Quick Reference

```md
::tip
Helpful advice, key statistics, recommendations.
::

::note
Supplementary context, background information.
::

::important
Must-know information to avoid problems.
::

::warning
Could break or cause unexpected behavior.
::

::caution
Potential for data loss or security issues.
::
```

For colored callouts and the full component catalog, see `references/COMPONENTS.md`.

## Code Blocks

Always include file labels:

````md
```ts [nuxt.config.ts]
export default defineNuxtConfig({})
```

```bash [Terminal]
npm install katex rehype-katex remark-math
```
````

For tabbed alternatives, use code groups:

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

For complete code block syntax (highlighting, diffs, twoslash), see `references/MDC-SYNTAX.md`.

## Tables for Data

Use tables for quantified comparisons:

```md
| Impact Domain | Key Finding | Relevant Departments |
|---------------|-------------|---------------------|
| Ecology | 62% pollination reduction | Environment, Agriculture |
| Health | 40% CVD risk increase | Public Health |
```

## Cross-References

Use `:read-more` at end of sections to link related pages:

```md
:read-more{to="/docs/research/ecology"}
:read-more{title="Custom link text" to="/docs/policy/recommendations"}
```

Inline links on first mention of concepts:
```md
The [`nuxt.config.ts`](/docs/getting-started/configuration) file can override...
```

## Workflow

1. **Identify template** from file path (astronera? foundry? starter?)
2. **Apply page structure** with proper frontmatter and heading hierarchy
3. **Write content** following writing standards above
4. **Select components** appropriate to content type
5. **If astronera:** Apply section rules, citations, glossary terms per `references/ASTRONERA-CUSTOM.md`
6. **Verify** against quality checklist below

## Quality Checklist

- [ ] Frontmatter has `title` and `description` (no `# h1` in body)
- [ ] Heading hierarchy valid (no skipped levels)
- [ ] Active voice 85%+, present tense 90%+
- [ ] Paragraphs 2-4 sentences max
- [ ] No banned words (simply, just, obviously, utilize, leverage)
- [ ] No em-dashes
- [ ] Code blocks have file labels
- [ ] Cross-references use correct link syntax
- [ ] No content duplication (link to existing pages instead)
- [ ] External library docs linked rather than reproduced
