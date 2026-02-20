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

## Section-Specific Rules

### Research (`examples/astronera/content/docs/1.research/`)

**Purpose:** Global scientific evidence documenting light pollution impacts.

**Language:** "Studies document...", "Evidence indicates...", "Research demonstrates..."

**Include:**
- Peer-reviewed studies with `:cited[]{}` syntax
- Global data and international examples
- Maharashtra context ONLY inside `::callout{color="info"}` (1-2 sentences, factual)

**Exclude:**
- Policy recommendations (belongs in Policy section)
- Implementation details (belongs in Pilots section)
- "Why Maharashtra Must Act" or "Next Steps" sections

**Example:**
```md
### 2.1 Pollination

:cited[Light pollution disrupts nocturnal pollinator activity.]{#study-id} Research documents :cited[62% reduction in pollinator visits under ALAN conditions]{#another-study}.

::callout{color="info"}
Maharashtra's agricultural economy depends heavily on pollinator-dependent crops including cotton, pulses, and fruits.
::
```

### Policy (`examples/astronera/content/docs/2.policy/`)

**Purpose:** Legal frameworks, Maharashtra obligations, action plans.

**Language progression:**
- Early drafts: "Recommendations include...", "Framework proposes..."
- Refined drafts: "Policy shall require...", "Standards mandate..."

**Include:**
- Constitutional obligations and legal precedents
- International treaty commitments
- State-specific regulatory frameworks
- Justifications tied to Research evidence

### Pilots (`examples/astronera/content/docs/3.pilots/`)

**Purpose:** Implementation methodology (not specific site listings).

**Language progression:**
- Early: "Guidelines suggest...", "Methodology encompasses..."
- Refined: "Standards require...", "Protocols specify..."

**Include:**
- Selection criteria, measurement protocols, monitoring frameworks
- Stakeholder engagement processes, institutional coordination

**Exclude:**
- Specific site selections (too premature)
- Detailed budget allocations, named individual responsibilities

## Citation Syntax

All quantitative claims require citations. Syntax:

```md
:cited[The cited fact or statistic.]{#source-id}
:cited[Claim supported by multiple sources.]{#id1,id2}
```

The text inside `[...]` is the fact, statistic, or source name the citation supports:
```md
:cited[62% reduction in pollinator visits]{#knop-2017-pollination-threat}
:cited[The 2023 RAND Europe study]{#hafner-2023-insomnia-burden} quantifies...
```

## Glossary Terms

First use of technical terms should include a glossary definition:

```md
:defn[Artificial Light at Night (ALAN)]{#alan}
```

## Math Expressions

- Inline: `$expression$`
- Display block: `$$expression$$`
- Escape dollar signs in text: `\$4.32 trillion`
- Units: `$0.757\,\mathrm{tCO_2/MWh}$`

## Component Selection by Section

| Need | Component | Section |
|------|-----------|---------|
| Key statistics | `::tip` | Research |
| Maharashtra context | `::callout{color="info"}` | Research |
| Background info | `::note` | Any |
| Recommendations | `::tip` | Policy |
| Requirements | `::important` | Policy |
| Implementation challenges | `::warning` | Pilots |
| Best practices | `::tip` | Pilots |
| Success indicators | `::callout{color="success"}` | Any |

**Quick reference for callouts:**
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

::callout{color="info"}
Maharashtra-specific contextual notes.
::

::callout{color="success"}
Positive outcomes, success indicators.
::
```

For the full component catalog (cards, tabs, steps, accordions, code-groups, etc.), see `references/COMPONENTS.md`.

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

## Data Source

**ALL quantitative data must come from:** `examples/astronera/MASTER_KEY.md`

Never invent statistics. Never extrapolate data not in MASTER_KEY. If data is not available, note the research gap instead.

## Workflow

1. **Determine section** from file path (Research/Policy/Pilots)
2. **Apply section rules** for content boundaries and tone
3. **Write content** with proper frontmatter, heading hierarchy, citations
4. **Select components** appropriate to section type
5. **Add math expressions** where quantitative data requires formulas
6. **Verify** against quality checklist below

## Quality Checklist

- [ ] Frontmatter has `title` and `description` (no `# h1` in body)
- [ ] Section rules followed (Research/Policy/Pilots boundaries)
- [ ] Active voice 85%+, present tense 90%+
- [ ] Modal verbs precise (can/should/may/must)
- [ ] Paragraphs 2-4 sentences max
- [ ] All data sourced from MASTER_KEY.md
- [ ] Citations use `:cited[text]{#id}` syntax
- [ ] Maharashtra context in Research only inside `::callout{color="info"}`
- [ ] Component types match section (tip/info/warning/important)
- [ ] No banned words (simply, just, obviously, utilize, leverage)
- [ ] No em-dashes
- [ ] No weak modals (might/could/would)
- [ ] Heading hierarchy valid (no skipped levels)
- [ ] Code blocks have file labels
