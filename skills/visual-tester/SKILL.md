---
name: visual-tester
description: Perform UI/UX visual reviews and detect layout/styling bugs using annotated snapshots from agent-browser. Use when asked to "review the UI", "check for visual bugs", "screenshot this page", "compare layouts", or "test responsive design".
allowed-tools: Bash(npx agent-browser:*), Bash(agent-browser:*), Bash(bash .claude/scripts/visual-review.sh:*)
---

# Visual Testing with agent-browser

Extends the agent-browser skill with visual testing workflows for UI/UX bug detection.

## Quick Start

```bash
# One-command visual review
bash .claude/scripts/visual-review.sh https://localhost:3000

# Review a specific section
bash .claude/scripts/visual-review.sh https://localhost:3000 "#hero"
```

## Visual Review Workflow

### 1. Full Page Review

```bash
agent-browser --session visual-review open https://localhost:3000
agent-browser --session visual-review wait --load networkidle
agent-browser --session visual-review screenshot --annotate
# Analyze the annotated screenshot for visual issues
# Report findings with @eN references
agent-browser --session visual-review close
```

### 2. Section-Scoped Review

```bash
agent-browser --session visual-review open https://localhost:3000
agent-browser --session visual-review wait --load networkidle
agent-browser --session visual-review snapshot -i -s "[data-testid='section-hero']"
agent-browser --session visual-review screenshot --annotate
agent-browser --session visual-review close
```

### 3. Before/After Comparison

```bash
# Capture baseline
agent-browser --session visual-baseline open https://localhost:3000
agent-browser --session visual-baseline wait --load networkidle
agent-browser --session visual-baseline screenshot baseline.png
agent-browser --session visual-baseline close

# After changes, capture and diff
agent-browser --session visual-after open https://localhost:3000
agent-browser --session visual-after wait --load networkidle
agent-browser --session visual-after diff screenshot --baseline baseline.png
agent-browser --session visual-after close
```

### 4. Responsive Testing (Desktop vs Mobile)

```bash
# Desktop capture
agent-browser --session desktop open https://localhost:3000
agent-browser --session desktop wait --load networkidle
agent-browser --session desktop screenshot --annotate

# Mobile capture (iOS Simulator)
agent-browser -p ios --device "iPhone 16 Pro" open https://localhost:3000
agent-browser -p ios screenshot mobile.png
agent-browser -p ios close

agent-browser --session desktop close
```

## What to Check

Use the project's `data-testid` convention to scope reviews:

| Section | Selector |
|---------|----------|
| Hero | `[data-testid="section-hero"]` |
| Benefits | `[data-testid="section-benefits"]` |
| FAQ | `[data-testid="section-faq"]` |
| Convert Form | `[data-testid="convert-form"]` |
| Pricing | `[data-testid="convert-pricing"]` |

## Findings Format

Always report findings in this structure:

```
**Visual Review: [page/component]**

**Findings:**
- [CRITICAL] @eN — description of issue
- [WARNING] @eN — description of issue
- [INFO] @eN — description of issue

**Screenshots:** path/to/screenshot.png
**Recommendation:** actionable fix
```

Severity levels:
- **CRITICAL**: Broken layout, missing content, non-functional UI elements
- **WARNING**: Spacing inconsistencies, minor alignment issues, contrast concerns
- **INFO**: Cosmetic suggestions, polish opportunities
