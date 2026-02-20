---
name: docs-writer
description: Create and edit Nuxt Content MDC documentation for IncuBrain Foundry templates. Handles page structure, MDC component selection, frontmatter conventions, cross-referencing, and content quality standards. Supports template-specific rules for astronera (Dark Sky Conservation with citations, glossary, policy docs) and foundry (developer-facing product documentation). Use when working on content/docs/ markdown files, .md documentation files, or any Nuxt Content pages.
---

# Docs Writer

Write documentation for Nuxt Content sites using MDC (Markdown Components) syntax.

## Workflow

1. **Determine template** from file path:
   - `examples/astronera/content/docs/` → astronera rules (citations, glossary, government audience)
   - `examples/foundry/content/docs/` → foundry rules (developer audience, signal-capture focus)
   - Other paths → general MDC documentation
2. **Apply page structure** (see below)
3. **Select components** appropriate to content type — see `references/COMPONENTS.md`
4. **Write content** following standards below
5. **If astronera:** Apply citations, glossary, section rules per `references/ASTRONERA-CUSTOM.md`
6. **Verify** against quality checklist

## Reference Files

Load on demand — do not read unless needed for the current task:

| File | When to read |
|------|-------------|
| `references/MDC-SYNTAX.md` | Unsure about MDC syntax (props, slots, nesting, code blocks) |
| `references/COMPONENTS.md` | Choosing components or need props/examples |
| `references/ASTRONERA-CUSTOM.md` | Editing astronera template files (citations, glossary, section rules) |

## Page Structure

```md
---
title: 'Page Title'
description: 'One-sentence summary for meta tags.'
navigation:
  icon: i-lucide-icon-name
---

Intro paragraph(s) — no heading before this. 1-3 sentences.

## Major Section

Content with code examples and callouts.

### Subsection

More specific details.

:read-more{to="/docs/related-topic"}
```

**Rules:**
1. No `# h1` in body — `title` frontmatter is the h1
2. Intro paragraphs immediately after frontmatter, before first `##`
3. Never skip heading levels (no h2 → h4)
4. Landing/index pages: `navigation: false` and `surround: false`, use `::card-group` to link subsections
5. `:read-more` goes at end of sections, after the last paragraph or code block
6. Code blocks always have file labels: `` ```ts [nuxt.config.ts] ``

## Writing Standards

**Voice:** Active voice, present tense, direct and instructive.

**Banned:** "simply", "just", "obviously", "easily", "utilize" (use "use"), "leverage" (use "use"), "in order to" (use "to"), "This section describes...", "Note that", em-dashes.

**Paragraphs:** 2-4 sentences max. Topic sentence first.

**Links:** Inline link on first mention of a concept: `` [`nuxt.config.ts`](/docs/getting-started/configuration) ``

**No duplication:** Link to existing pages with `:read-more` instead of repeating information. Link to external library docs instead of reproducing them.

## Component Selection

Choose the right component for the content:

| Need | Component |
|------|-----------|
| Cross-reference another page | `:read-more{to="/docs/..."}` |
| Helpful advice or recommendation | `::tip` |
| Supplementary context | `::note` |
| Must-know information | `::important` |
| Pitfall or danger | `::warning` |
| Anti-pattern example | `::caution{icon="i-lucide-circle-x"}` |
| Step-by-step tutorial | `::steps` |
| Package manager alternatives | `::code-group` |
| Section landing navigation | `::card-group` with `::card` items |
| Expandable FAQ items | `::accordion` |
| API parameters / props | `::field-group` with `::field` items |
| Comparison data | Standard markdown table |
| Long code block | `::code-collapse` |

Full props and examples: `references/COMPONENTS.md`

## Foundry Template Rules

For `examples/foundry/content/docs/`:

**Audience:** Technical founders and developers using the Foundry validation template.

**Tone:** Second person ("you"), practical, ship-first. "Create a file...", "Run the command..."

**Content priorities:**
- Signal capture paths (email, presales, bookings)
- Configuration and customization
- Deployment and integration

**Key conventions:**
- Environment variables: document in `9.reference/5.environment-variables.md` only, link from other pages
- Component props: document in `9.reference/1.components.md` only, link from feature pages
- App config: document in `9.reference/4.app-config.md` only, link from other pages

## Quality Checklist

- [ ] Frontmatter has `title` and `description`
- [ ] No `# h1` in body
- [ ] Heading hierarchy valid (no skipped levels)
- [ ] Paragraphs 2-4 sentences
- [ ] No banned words
- [ ] Code blocks have file labels
- [ ] No content duplication (link instead)
- [ ] External library docs linked, not reproduced
- [ ] `:read-more` at end of sections, not mid-content
