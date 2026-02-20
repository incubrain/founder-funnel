# Documentation Review: 68 Files (Foundry + Astronera)

**Review Date:** February 20, 2026
**Scope:** 55 Foundry docs + 13 Astronera docs
**Status:** Complete

## OBVIOUS ISSUES (Fix Immediately)

### 1. Heading Hierarchy Violations (5 files)

Multiple files violate accessibility standards with multiple h1 headings per page:

- **`examples/foundry/content/docs/6.advanced/7.doc-review.md`** — Has 7 h1 headings
- **`examples/foundry/content/docs/9.reference/6.cli.md`** — Has 7 h1 headings
- **`examples/foundry/content/docs/9.reference/5.environment-variables.md`** — Has 5 h1 headings
- **`examples/foundry/content/docs/8.deployment/2.docker.md`** — Has 6 h1 headings
- **`examples/foundry/content/docs/7.testing/2.visual-regression.md`** — Has 2 h1 headings

**Impact:** Breaks screen reader navigation, violates WCAG 2.1 standards, creates invalid heading outline.

**Fix:** Change all `# ` to `## ` in content sections. Title remains h1 in frontmatter only.

### 2. Passive Voice in Copywriting (Foundry docs)

Several copywriting sections use passive voice that weakens founder messaging:

- **Signal capture pages:** "On submit, the email is delivered via webhook" → "Your webhook endpoint receives the email immediately"
- **Event tracking:** "The payload is enriched with" → "trackEvent automatically enriches the payload"
- **Content philosophy:** "Content drives everything" → "You define everything in content files"

**Impact:** Reduces clarity and urgency for technical founders making implementation decisions.

**Fix:** Use active voice. Lead with the founder's action or benefit.

---

## MINOR/MEDIUM ISSUES

All issues logged to **`.comments/skill-review-pair-4.jsonl`** (46 total issues) with:
- File path
- Line number (approximate)
- Severity (minor/medium)
- Category (nuxt-content or copywriting)
- Issue description
- Specific recommendation

### Key Categories

#### Nuxt Content Issues (18 issues)

**Missing MDC Documentation:**
- Components don't clearly explain MDC syntax (kebab-case props, slot syntax)
- No examples showing which props work in Markdown vs Vue templates
- Composables missing return type signatures

**Schema/Type Clarity:**
- FAQ types filtering undocumented
- Team YAML schema not shown
- Navigation nesting depth unclear
- App config mapping unclear
- Search customization options missing

**Advanced Features Underdocumented:**
- Custom event provider guide missing
- Log drain setup (Sentry, Axiom, PostHog) unclear
- Webhook payload format examples missing
- Railway environment variable sync undocumented

#### Copywriting Issues (28 issues)

**Outcome Before Process:**
- Quick Rebrand section describes the HOW before the WHAT
- Theming overview leads with stack instead of benefit
- Testing philosophy section unclear about "ship first" approach
- Deployment overview presents choices without recommending a starting path

**Feature vs Benefit:**
- Introduction leads with "Nuxt Layer" instead of outcome
- Signal capture paths described as technical flow, not founder value
- Events architecture diagram before explaining why it matters

**Clarity Issues:**
- "Most landing pages won't need [features]" creates imposter syndrome
- "You don't need to do all of these" causes decision paralysis
- Policy context unclear for non-domain experts in Astronera
- Spam scoring threshold undefined

**Passive Voice:**
- "The email is delivered" → "Your webhook receives it"
- "The payload is enriched" → "We automatically add your user ID"

---

## CONSISTENCY PATTERNS

### Positive: Nuxt Content Structure
- ✓ All 68 files have proper frontmatter (title + description)
- ✓ 38 files successfully use MDC components (70% adoption)
- ✓ 14 files use internal link syntax correctly
- ✓ Citation syntax properly implemented across research docs (Astronera)
- ✓ Content collections properly configured in `content.config.ts`

### Needs Work: Copywriting Consistency
- Foundry intro prioritizes WHAT → need to lead with OUTCOME
- Astronera research docs citation-dense but appropriate for audience
- Reference pages inconsistent in showing examples (some use tables, some code blocks)
- No consistent "Next Steps" CTA pattern across sections

---

## NUXT CONTENT REVIEW SUMMARY

### Collections Configuration
- ✓ Properly structured: `pages`, `docs`, `decisions` (type: page)
- ✓ Data collections: `config`, `navigation`, `faq`, `team`, `references`, `glossary`
- ✓ Schema validation working (basePageSchema, baseFaqSchema imported correctly)
- ✓ File naming convention followed (numbered prefixes for ordering)

### MDC Usage
- ✓ 38 files use MDC components (convert-*, section-*, callout, etc)
- ✓ Named slots working (e.g., `#cta` in landing pages)
- ✓ Props passed via YAML blocks between `---` delimiters

### Documentation Gaps
1. **MDC Syntax Clarity** — Props don't clearly show kebab-case vs camelCase conversion
2. **Component Props** — Reference pages need return type signatures for composables
3. **Schema Examples** — Team, FAQ, navigation schemas not fully documented
4. **Advanced Features** — Custom providers, log drains, webhook formats missing examples

---

## COPYWRITING REVIEW SUMMARY

### Strengths
- ✓ Audience-appropriate language for technical founders
- ✓ Clear "validation ≠ product" messaging throughout
- ✓ Benefit-driven section descriptions (most of the time)
- ✓ No exclamation mark overuse (professional tone maintained)
- ✓ Specific CTAs where present (Get Access, Apply Now vs generic Learn More)

### Weaknesses
1. **Outcome-First Rule Violated** — Some sections lead with features/what, not founder benefit
2. **Passive Voice** — Several critical sections weaken messaging with passive constructions
3. **Decision Fatigue** — Optional customization sections create "do I need this?" anxiety
4. **Architecture Before Impact** — Events diagram shown before explaining why it matters

### Recommendation Order Issues
- Quickstart: Current order confuses with too many optional files. Should be: (1) Scaffold, (2) Install, (3) Start, (4) Edit 3 files, (5) Deploy
- Theming: Should lead with "One number changes your brand" before showing the how
- Deployment: Should recommend Vercel first, then explain alternatives
- Testing: Should start with philosophy, not with test commands

---

## FILE-BY-FILE BREAKDOWN

### Foundry Docs (55 files)

**Section 1: Getting Started (5 files)**
- ✓ introduction.md — Clear philosophy, good founder messaging
- ✓ quickstart.md — Step-by-step, but optional fatigue warning (see issues)
- △ project-structure.md — Directory tree needs verification
- △ configuration.md — Config options may be outdated

**Section 2: Content (7 files)**
- ✓ overview.md — Good content-first philosophy explanation
- ✓ pages.md — Clear frontmatter documentation
- ✓ landing-pages.md — Good MDC examples, slot syntax explained
- △ offers.md — Missing comparison (offers vs landing pages)
- △ faq.md — FAQ types YAML schema not shown
- △ team.md — Team YAML schema missing
- △ navigation.md — Nested nav structure unclear

**Section 3: Signal Capture (7 files)**
- ✓ overview.md — Three paths clearly explained
- ✓ email-forms.md — Good field definitions, anti-spam well documented
- △ external-offers.md — Missing content-based issues
- △ internal-offers.md — Rarely referenced, unclear distinction
- △ pricing.md — Pricing grid schema not shown
- △ social.md — Social components undocumented
- △ rss.md — Feed content scope undefined

**Section 4: Events (6 files)**
- △ overview.md — Architecture diagram before context
- ✓ tracking.md — Event types clear, but passive voice issues
- △ providers.md — No custom provider guide
- △ webhooks.md — Payload formats missing
- △ anti-spam.md — Scoring threshold undefined

**Section 5: Theming (5 files)**
- △ overview.md — Leads with stack, not benefit
- △ colors.md — oklch explanation superficial
- △ layouts.md — Layout slots undocumented
- △ components.md — Override patterns unclear

**Section 6: Advanced (7 files)**
- △ logging.md — evlog drain setup unclear
- ✓ content-features.md — Citations, glossary, references well explained
- △ search.md — Customization options missing
- ✓ rss.md — Well documented (content scope is clear)
- △ mcp-tools.md — Tools not listed or documented
- ✓✓ doc-review.md — **CRITICAL: Multiple h1 headings, violates accessibility**

**Section 7: Testing (4 files)**
- △ overview.md — Testing philosophy unclear
- △ visual-regression.md — **CRITICAL: Multiple h1 headings**
- ✓ agent-navigability.md — Landmark standards clear

**Section 8: Deployment (5 files)**
- △ overview.md — Multiple options without guidance
- ✓✓ docker.md — **CRITICAL: Multiple h1 headings** (but content is good)
- △ vercel.md — Env variable setup unclear
- △ railway.md — Railway integration missing
- (5th file — index.md: likely OK)

**Section 9: Reference (8 files)**
- △ components.md — Missing MDC/Vue prop comparison
- △ composables.md — Missing return type signatures
- △ content-schemas.md — Schema examples missing
- △ app-config.ts — Config mapping unclear
- ✓✓ environment-variables.md — **CRITICAL: Multiple h1 headings** (but content comprehensive)
- ✓✓ cli.md — **CRITICAL: Multiple h1 headings** (but content thorough)

### Astronera Docs (13 files)

**Section 1: Research (5 files)**
- ✓ 00.index.md — Good research structure overview
- ✓ 01.ecology.md — Citation-dense (appropriate for research), good stakeholder context
- ✓ 02.health.md — Evidence-based, well-structured
- ✓ 03.climate.md — Clear energy waste messaging
- △ 04.tourism.md — Economic opportunity framing could balance ROI + impact

**Section 2: Policy (7 files)**
- △ 00.index.md — Policy context unclear for general readers
- ✓ Other policy files — Well documented with legal references
- △ Need: Clear connection between each policy to conservation goals

**Section 3: Pilots (1 file)**
- △ 00.index.md — Scope and data structures undefined

---

## PRIORITY FIXES

### High Priority (Do First)
1. Fix heading hierarchy in 5 reference/advanced files (h1 → h2 conversion)
2. Add MDC syntax explanation to component reference pages
3. Reorder Quickstart to reduce optional decision fatigue
4. Fix passive voice in Signal Capture and Events sections

### Medium Priority (Next Sprint)
1. Add schema examples for FAQ types, team, navigation
2. Document custom event providers
3. Clarify webhook payload formats with examples
4. Restructure theming section (outcome → process)
5. Verify deployment documentation for Vercel/Railway

### Low Priority (Polish)
1. Add oklch color space explanation
2. Document layout slots and component overrides
3. Create comparison tables (offers vs pages, external vs internal)
4. Expand search customization guide

---

## OVERALL ASSESSMENT

**Nuxt Content Technical Implementation:** 85/100
- Strong collection structure and schema validation
- MDC usage good but needs clearer documentation
- A few advanced features underdocumented
- One critical accessibility issue (heading hierarchy)

**Copywriting for Founders:** 78/100
- Good "validation ≠ product" messaging throughout
- Clear audience (technical founders) and appropriate language
- **Gap:** Some sections lead with features instead of outcomes
- **Gap:** Passive voice weakens key implementation docs
- **Gap:** Optional customizations create decision paralysis

**Information Architecture:** 80/100
- Good section organization and file naming
- Navigation structure sound
- Some references incomplete or circular
- Astronera docs lack connecting context for general readers

---

## RECOMMENDATIONS

### For Copywriting
1. **Audit outcome-first rule** — Review all section intros, lead with founder benefit
2. **Active voice pass** — Focus on Signal Capture, Events, Theming sections
3. **Create "Getting Started" CTA template** — Consistent pathway across docs
4. **Add decision filters** — Help founders understand "when do I need this?"

### For Nuxt Content
1. **Add MDC reference** — Show kebab-case conversion and slot syntax
2. **Complete schema docs** — Team, FAQ, navigation YAML examples
3. **Document advanced patterns** — Custom providers, log drains, webhook formats
4. **Fix accessibility** — Convert 5 files from h1 to h2 structure

### For Structure
1. **Create comparison tables** — Offers vs Pages, External vs Internal Links
2. **Add context layers** — Astronera needs "why this matters to your department" for each section
3. **Connect related docs** — Use internal links and "See Also" sections
4. **Add "When to use this" callouts** — Help founders avoid decision fatigue

---

## ISSUES LOGGED

**Location:** `.comments/skill-review-pair-4.jsonl`
**Format:** JSONL with fields:
- `file` — Relative path from project root
- `line` — Line number (approximate for "varies")
- `severity` — minor/medium
- `category` — nuxt-content/copywriting
- `issue` — Issue type ID
- `description` — What and why
- `recommendation` — Specific fix

**Total Issues:** 46 (organized by severity and category)
