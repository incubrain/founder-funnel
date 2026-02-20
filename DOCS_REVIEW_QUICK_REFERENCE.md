# Documentation Review: Quick Reference

## Critical Issues (Fix Now)

### 1. Heading Hierarchy Violations
Five files have multiple h1 headings that break accessibility:

```
examples/foundry/content/docs/6.advanced/7.doc-review.md      ← 7 h1s
examples/foundry/content/docs/9.reference/6.cli.md             ← 7 h1s
examples/foundry/content/docs/9.reference/5.environment-variables.md ← 5 h1s
examples/foundry/content/docs/8.deployment/2.docker.md         ← 6 h1s
examples/foundry/content/docs/7.testing/2.visual-regression.md ← 2 h1s
```

**Fix:** Change `# ` to `## ` in all content sections. Title stays h1 in frontmatter.

---

## Copywriting Issues Summary

### Passive Voice (3 files need fixes)
1. Signal Capture → "email is delivered" → "your webhook receives it"
2. Events → "payload is enriched" → "we automatically add your user ID"
3. Content → "content drives everything" → "you define everything in files"

### Outcome-First Rule Violated
- Theming Overview leads with stack, not benefit
- Quick Rebrand describes process before outcome
- Events overview shows architecture before explaining why it matters
- Testing overview unclear about "ship first" philosophy

### Decision Fatigue
- Quickstart: too many optional files listed upfront
- Theming: unclear which customizations are essential vs nice-to-have
- Deployment: multiple options without clear recommendation

---

## Nuxt Content Issues Summary

### Missing Documentation (18 issues)

**Component Props:**
- No MDC vs Vue prop syntax clarification (kebab-case)
- Composable return types not documented
- Component slots unclear

**Schemas:**
- FAQ types filtering not shown
- Team YAML schema missing
- Navigation nesting depth undefined
- App config structure not mapped

**Advanced Features:**
- Custom event providers: no guide
- Log drains (Sentry/Axiom/PostHog): setup unclear
- Webhook payload formats: no examples
- Railway integration: environment vars sync undocumented
- Search customization: no options listed
- Layout slots: not documented

### Collection Structure Issues
- ✓ Collections properly defined (pages, docs, decisions, data collections)
- ✓ Schema validation working
- ✓ File naming convention followed
- ✓ Frontmatter complete (all 68 files)
- △ Internal links working (14/68 files) — underutilized

---

## File Quality Distribution

### Excellent (8 files)
- introduction.md
- overview.md (signal capture)
- overview.md (content)
- landing-pages.md
- email-forms.md
- content-features.md
- Astronera research docs (1-4)

### Good (25 files)
- Most API reference pages
- Deployment Docker/Vercel docs
- Event tracking documentation
- CLI documentation

### Needs Work (25 files)
- See full issues log: `.comments/skill-review-pair-4.jsonl`

### Critical (5 files)
- 5 files with accessibility violations (heading hierarchy)

---

## Copywriting Fixes: Pattern Matching

### Lead with Outcome, Then Explain
**Before:** "ConvertForm is a component that captures email addresses using MDC syntax."
**After:** "Capture emails with zero backend setup. Just drop a `::convert-form` block and configure your webhook destination."

### Active Voice Template
**Before:** "The email is delivered via webhook and the visitor is redirected to /success."
**After:** "Your webhook endpoint receives the submission. The visitor is redirected to /success."

### Benefit Before Feature
**Before:** "Foundry is a Nuxt Layer that provides landing pages, signal capture, event tracking, and webhooks."
**After:** "Prove demand for your idea before writing product code. Land a page, capture signals, see results in real-time."

---

## Issue Types Quick Lookup

**By Severity:**
- **Medium (5 issues):** Heading hierarchy, core architecture clarity
- **Minor (41 issues):** Missing examples, passive voice, schema docs, advanced features

**By Category:**
- **Nuxt Content (18 issues):** Missing docs, schema examples, advanced features
- **Copywriting (28 issues):** Passive voice, outcome order, decision clarity

**By Section:**
- **Signal Capture (3 issues):** Focus on outcome clarity
- **Events (4 issues):** Architecture explanation, webhook formats
- **Reference (8 issues):** MDC syntax, return types, schemas
- **Deployment (3 issues):** Env var setup, platform-specific docs
- **Theming (4 issues):** Outcome-first, technical depth

---

## How to Use This Review

### For Contributors Fixing Issues
1. Open `.comments/skill-review-pair-4.jsonl`
2. Find your assigned file
3. Search for the recommended issue text in the markdown
4. Apply the recommendation
5. Test with `pnpm lint` (ESLint) and visual if needed

### For Prioritizing Work
**Sprint 1 (Critical):**
- Fix heading hierarchy in 5 files
- Add passive voice fixes to Signal Capture/Events sections

**Sprint 2 (Important):**
- Add MDC prop documentation
- Add schema examples (FAQ, team, navigation)
- Restructure Quickstart flow

**Sprint 3 (Nice-to-Have):**
- Advanced feature documentation (custom providers, log drains)
- Comparison tables (offers vs pages)
- Contextual messaging for Astronera docs

---

## Stats

- **Total files reviewed:** 68 (55 Foundry + 13 Astronera)
- **Total issues identified:** 46
  - Critical (accessibility): 5
  - Medium (copywriting/structure): 5
  - Minor (docs/examples/clarity): 36
- **Files needing fixes:** 31 (46%)
- **Files excellent as-is:** 8 (12%)
- **Files good but improvable:** 25 (37%)

---

## Next Steps

1. **Review this document** with team for alignment
2. **Triage issues** in `.comments/skill-review-pair-4.jsonl`
3. **Assign critical fixes** (heading hierarchy, passive voice)
4. **Schedule documentation sprint** for Sprint 2 items
5. **Monitor** as team fixes issues (comments auto-resolve)
