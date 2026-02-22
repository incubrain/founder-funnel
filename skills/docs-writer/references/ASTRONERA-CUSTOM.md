# AstronEra Custom Components & Data Rules

These features are specific to the AstronEra Dark Sky Conservation template and are **optional** in other templates.

## Table of Contents

- [Citation Syntax](#citation-syntax)
- [Glossary Terms](#glossary-terms)
- [Math Expressions](#math-expressions)
- [Data Source Rules](#data-source-rules)
- [Section-Specific Rules](#section-specific-rules)

---

## Citation Syntax

All quantitative claims in research/policy documents require citations using the custom `:cited` inline component.

### Basic Usage

```md
:cited[The cited fact or statistic.]{#source-id}
```

### Multiple Sources

```md
:cited[Claim supported by multiple sources.]{#id1,id2}
```

### Citation Placement

The text inside `[...]` is the fact, statistic, or source name the citation supports:

```md
:cited[62% reduction in pollinator visits]{#knop-2017-pollination-threat}
:cited[The 2023 RAND Europe study]{#hafner-2023-insomnia-burden} quantifies...
```

### Source ID Convention

Source IDs follow the pattern: `author-year-topic`

```
#holker-2010-biodiversity-threat
#knop-2017-pollination-threat
#france-2018-light-nuisance-decree
#cms-2024-light-guidelines
```

### Source Files

Citations resolve against YAML reference files in `examples/astronera/content/references/`:

| File | Content |
|------|---------|
| `ecology.yml` | Ecology & biodiversity studies |
| `health.yml` | Human health studies |
| `climate.yml` | Climate & energy studies |
| `tourism.yml` | Tourism & economy studies |
| `policy.yml` | Policy & legal references |

Each source entry has: `id`, `title`, `author`, `url`, `affiliation`, `credibilityScore`, `date`, `description`.

---

## Glossary Terms

Technical terms use the custom `:defn` inline component on first mention.

### Basic Usage

```md
:defn[Artificial Light at Night (ALAN)]{#alan}
```

### When to Use

- First mention of a technical term in a page
- Terms that government officials may not know
- Abbreviations that need expansion

### Glossary Files

Terms resolve against YAML files in `examples/astronera/content/glossary/`:

| File | Content |
|------|---------|
| `general.yml` | General terms (astrotourism, ROI, etc.) |
| `technical.yml` | Technical terms (CCT, lux, SQM, etc.) |
| `ecological.yml` | Ecological terms (ALAN, circadian, etc.) |
| `regulatory.yml` | Legal/regulatory terms (EIA, CRZ, etc.) |
| `organizations.yml` | Organization abbreviations (DSI, CMS, etc.) |

### Do NOT Wrap

- Terms already defined earlier on the same page
- Common English words
- Terms that are self-explanatory in context

---

## Math Expressions

KaTeX math rendering for scientific notation and formulas.

### Inline Math

```md
The grid factor is $0.757\,\text{tCO}_2/\text{MWh}$.
```

### Display Block

```md
$$E = P \times t \times EF$$
```

### Common Patterns

```md
$\text{CO}_2$                              → CO₂ subscript
$0.757\,\mathrm{tCO_2/MWh}$               → Units with thin space
\$4.32 trillion                            → Escaped dollar sign (not math)
$>4000\,\text{K}$                          → CCT with units
$0.25\,\text{lux}$                         → Light level with units
```

### Prerequisites

Math rendering requires these packages in the Nuxt Content pipeline:

```bash [Terminal]
pnpm add katex rehype-katex remark-math
```

---

## Data Source Rules

**ALL quantitative data must come from:** `examples/astronera/MASTER_KEY.md`

### Rules

1. Never invent statistics
2. Never extrapolate data not in MASTER_KEY
3. If data is unavailable, note the research gap instead
4. Cross-check citation IDs against the reference YAML files
5. If a statistic appears in MASTER_KEY without a citation, flag it for review

---

## Section-Specific Rules

### Research (`examples/astronera/content/docs/1.research/`)

**Content boundaries:**
- Peer-reviewed studies with `:cited[]{}` syntax
- Global data and international examples
- Maharashtra context ONLY inside `::callout{color="info"}` (1-2 sentences, factual)

**Exclude from research:**
- Policy recommendations → belongs in Policy section
- Implementation details → belongs in Pilots section
- "Why Maharashtra Must Act" or "Next Steps" sections

**Language:** "Studies document...", "Evidence indicates...", "Research demonstrates..."

### Policy (`examples/astronera/content/docs/2.policy/`)

**Content boundaries:**
- Constitutional obligations and legal precedents
- International treaty commitments
- State-specific regulatory frameworks
- Justifications tied to Research evidence

**Language progression:**
- Early drafts: "Recommendations include...", "Framework proposes..."
- Refined drafts: "Policy shall require...", "Standards mandate..."

### Pilots (`examples/astronera/content/docs/3.pilots/`)

**Content boundaries:**
- Selection criteria, measurement protocols, monitoring frameworks
- Stakeholder engagement processes, institutional coordination

**Exclude from pilots:**
- Specific site selections (too premature)
- Detailed budget allocations, named individual responsibilities

**Language progression:**
- Early: "Guidelines suggest...", "Methodology encompasses..."
- Refined: "Standards require...", "Protocols specify..."

### Component Selection by Section

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
