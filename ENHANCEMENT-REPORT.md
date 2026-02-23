# AI Agentic Setup Enhancement Report

**Issue:** DRE-67 — Enhance AI Agentic Setup
**Date:** 2026-02-23
**Branch:** vk/26f6-enhance-ai-agent

---

## Executive Summary

This report covers four areas of improvement for the project's AI agent workflow:

1. **Eliminate duplication** — Consolidate AGENTS.md/CLAUDE.md, establish canonical file locations
2. **Adopt Claude Code best practices** — Custom subagents, hooks, memory, env tuning
3. **VibeKanban orchestration** — Agent configurations, orchestrator patterns
4. **Beads evaluation** — Structured task memory across sessions

The recommendations are ordered by impact-to-effort ratio. Each has a concrete implementation plan.

---

## Part 1: File Structure Consolidation

### Current State (Problems)

```
.claude/CLAUDE.md          ← Main project instructions (4.3 KB)
.claude/AGENTS.md          ← Skills reference (1.6 KB, separate file)
.claude/rules/             ← Symlink → ../.agents/rules/
.claude/skills/            ← Symlink → ../.agents/skills/
.claude/settings.json      ← Permissions config
.claude/skills.json        ← External skills manifest

.agents/rules/             ← 5 rule files (architecture, conventions, etc.)
.agents/skills/            ← 21+ installed skills (gitignored)
```

**Problems identified:**
1. `.claude/CLAUDE.md` and `.claude/AGENTS.md` are separate files — AGENTS.md is referenced from CLAUDE.md but adds cognitive overhead
2. No root-level `AGENTS.md` (which is the emerging standard convention)
3. Only `layer/modules/comments/` has a module-level AGENTS.md — the other 5 modules (changelog, docs, events, rss, vrt) lack them
4. Skills are gitignored but the main AGENTS.md doesn't explain what they provide or how to install them for new contributors

### Recommended Structure

```
AGENTS.md                          ← ROOT: Canonical file (new)
.claude/CLAUDE.md                  ← Symlink → ../AGENTS.md
.claude/rules/                     ← Symlink → ../.agents/rules/ (keep)
.claude/skills/                    ← Symlink → ../.agents/skills/ (keep)
.claude/settings.json              ← Enhanced (see Part 2)
.claude/agents/                    ← Custom subagents (new, see Part 2)

.agents/rules/                     ← Keep as-is
.agents/skills/                    ← Keep as-is (gitignored)

layer/modules/comments/AGENTS.md   ← Keep (excellent example)
layer/modules/events/AGENTS.md     ← New
layer/modules/vrt/AGENTS.md        ← New
layer/modules/rss/AGENTS.md        ← New (brief)
layer/modules/changelog/AGENTS.md  ← New (brief)
layer/modules/docs/AGENTS.md       ← New (brief)
```

### Root AGENTS.md Content Strategy

The root `AGENTS.md` should merge the current `CLAUDE.md` and `AGENTS.md` into one file, structured as:

```markdown
# IncuBrain Foundry — Agent Instructions

## Quick Start
(commands from current CLAUDE.md)

## Critical Rules
(6 rules from current CLAUDE.md)

## Architecture
(from current CLAUDE.md, with @imports to .agents/rules/ for details)

## File Map
(condensed directory guide)

## Skills & Rules
(merged from current AGENTS.md, with note about install-skills.sh)
Skills are installed to `.agents/skills/` (gitignored).
Run `bash scripts/install-skills.sh` after cloning.

## Module Guide
Each module has its own AGENTS.md with detailed instructions:
- @layer/modules/events/AGENTS.md — Event tracking system
- @layer/modules/comments/AGENTS.md — Documentation review (dev-only)
- @layer/modules/vrt/AGENTS.md — Visual regression testing
- @layer/modules/rss/AGENTS.md — RSS feed generation
- @layer/modules/changelog/AGENTS.md — Changelog generation
- @layer/modules/docs/AGENTS.md — Documentation utilities

## Before You Code
(values filter from current CLAUDE.md)
```

**Key design decisions:**
- Use `@import` syntax to pull in rule files on-demand rather than duplicating content
- Module AGENTS.md files are referenced but NOT imported (loaded only when agent works in that directory)
- Skills section explains the gitignored skills to new contributors
- Total root file stays under 200 lines for optimal context loading

### Symlink Strategy

```bash
# Root AGENTS.md is the source of truth
# .claude/CLAUDE.md symlinks to it (Claude Code reads .claude/CLAUDE.md)
ln -sf ../AGENTS.md .claude/CLAUDE.md

# .claude/AGENTS.md is removed (content merged into root AGENTS.md)
rm .claude/AGENTS.md
```

**Why this works:** Claude Code loads `.claude/CLAUDE.md` automatically. By symlinking it to the root `AGENTS.md`, we get:
- Standard convention (root AGENTS.md)
- No duplication
- Works for any agent that reads AGENTS.md (Cursor, Windsurf, etc.)
- Claude Code's import system (`@path`) handles loading rules on-demand

---

## Part 2: Claude Code Best Practices

### 2.1 Custom Subagents

Create `.claude/agents/` directory with specialized agents for common tasks:

**`.claude/agents/nuxt-dev.md`** — Development specialist
```yaml
---
name: nuxt-dev
description: Nuxt 4 layer development. Use for implementing components, composables, pages, or server routes.
model: inherit
skills:
  - nuxt
  - vue-best-practices
  - nuxt-ui
  - vueuse-functions
memory: project
maxTurns: 30
---
You are a Nuxt 4 development specialist for the IncuBrain Foundry project.

Key constraints:
- Max 50 lines per component, max 5 props
- VueUse first, then library, then custom (last resort)
- Content in YAML/Markdown, never hardcoded
- Use useEvents() for all tracking
- Validation captures intent, never build product features
```

**`.claude/agents/signal-reviewer.md`** — Post-change validation
```yaml
---
name: signal-reviewer
description: Reviews code changes against the validation-first philosophy. Use proactively after modifications to signal capture paths.
tools: Read, Grep, Glob
model: haiku
maxTurns: 10
---
Review changes against the project's validation philosophy:
1. Does this capture signal faster?
2. Is this validation or product? (we only do validation)
3. Does an external tool solve this?
4. Is the complexity budget respected? (50 lines, 5 props, 2 layers)
5. Is content in YAML/Markdown, not hardcoded?

Report: pass/fail with specific violations.
```

**`.claude/agents/explorer.md`** — Codebase research
```yaml
---
name: codebase-explorer
description: Deep codebase exploration. Use when you need to understand how a feature works across the layer, examples, and modules.
tools: Read, Grep, Glob
model: haiku
maxTurns: 20
---
You explore the IncuBrain Foundry codebase. Key directories:
- layer/ — Nuxt layer (core reusable code)
- layer/modules/ — Feature modules (events, vrt, comments, rss, changelog, docs)
- examples/ — Example apps (foundry, astronera, starter)
- shared/ — Shared config and types

Each module may have an AGENTS.md with detailed architecture docs.
Report findings concisely — the main agent needs actionable information, not verbose file dumps.
```

### 2.2 Environment Variable Tuning

Add to `.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE": "80",
    "ENABLE_TOOL_SEARCH": "auto"
  }
}
```

**`CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE=80`**: Triggers compaction at 80% instead of the default ~95%. Benefits:
- Higher-quality summaries (more headroom for the summary generation)
- Fewer hallucinations in subsequent turns
- Marginal token cost savings from earlier cleanup
- The default 95% means compaction happens when context is already saturated

**`ENABLE_TOOL_SEARCH=auto`**: Dynamically loads MCP tools on-demand instead of preloading all tool schemas. With VibeKanban + Context7 MCP servers, tool schemas consume significant context. Auto mode activates when tool descriptions exceed 10% of context window.

### 2.3 Hooks Configuration

Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'POST-COMPACTION REMINDERS: Use pnpm (not npm). Validation != Product. Max 50 lines/component. Check VueUse before custom. Event tracking via useEvents(). Content in YAML not code. Check .agents/rules/ for detailed guidelines.'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path // empty' | xargs -I{} sh -c 'case \"{}\" in *.vue|*.ts|*.js|*.json) npx eslint --fix \"{}\" 2>/dev/null || true;; esac'",
            "async": true,
            "timeout": 30,
            "statusMessage": "Auto-linting..."
          }
        ]
      }
    ]
  }
}
```

**SessionStart (compact matcher):** Re-injects the most critical project rules after context compaction. Without this, agents can "forget" core constraints after compaction.

**PostToolUse (Write|Edit):** Auto-lints files after editing. Async so it doesn't block the agent. Catches lint issues immediately rather than at commit time.

### 2.4 Enhanced Permissions

Update `.claude/settings.json` permissions:

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm dev:*)",
      "Bash(pnpm build:*)",
      "Bash(pnpm lint*)",
      "Bash(pnpm test*)",
      "Bash(pnpm run dev:*)",
      "Bash(pnpm run build:*)",
      "Bash(pnpm run lint*)",
      "Bash(pnpm typecheck*)",
      "Bash(pnpm verify*)",
      "Bash(pnpm prepare*)",
      "Bash(git status*)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(npx eslint *)",
      "Bash(npx prettier *)",
      "Bash(bash scripts/install-skills.sh*)",
      "Bash(npx skills *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

Changes: Fixed permission patterns (removed erroneous colons), added eslint/prettier/skills permissions, added secrets directory deny rule.

### 2.5 Path-Specific Rules

Convert current rules to use path-specific frontmatter for context efficiency:

**`.agents/rules/layer-development.md`** (new, replaces parts of conventions.md)
```markdown
---
paths:
  - "layer/**/*"
---
# Layer Development Rules
- Max component: 50 lines, Max props: 5
- Use useEvents() for tracking
- Use useAppStorage() for storage (never direct localStorage)
- Components: PascalCase, Composables: camelCase with use prefix
- data-testid pattern: {component-type}-{identifier}
```

**`.agents/rules/example-apps.md`** (new)
```markdown
---
paths:
  - "examples/**/*"
---
# Example App Rules
- Content in YAML/Markdown, not hardcoded
- Use layer composables, don't duplicate
- Each example can have its own nuxt.config.ts extending the layer
- Create evlog drain plugins in server/plugins/
```

These path-specific rules only load when the agent is working on matching files, reducing baseline context consumption.

### 2.6 Memory Configuration

The project already has auto-memory at `~/.claude/projects/<project>/memory/`. Enhancements:

1. **Subagent memory** — The `nuxt-dev` agent with `memory: project` stores learnings in `.claude/agent-memory/nuxt-dev/` which can be committed to git for team sharing.

2. **MEMORY.md seeding** — Create initial memory content with known patterns:

```markdown
# Project Memory

## Architecture
- Nuxt 4 layer at layer/, examples at examples/
- 6 modules: events, comments, vrt, rss, changelog, docs
- Event-driven: action → useEvents() → handler → provider

## Patterns
- Content comes from YAML/Markdown files in content/ dirs
- Sections driven by SectionWrapper component
- Signal capture via convert/ components (Form, External, Internal)

## Common Issues
- See .agents/rules/ for detailed guidelines
- See layer/modules/*/AGENTS.md for module-specific docs
```

### 2.7 LSP Plugin (Optional)

Consider installing the TypeScript LSP plugin for real-time diagnostics:
```bash
claude plugin install typescript-lsp@claude-plugins-official
```

This gives Claude type error detection after every edit without needing to run `pnpm typecheck`. However, it adds overhead — evaluate after implementing other changes.

---

## Part 3: VibeKanban Orchestration

### 3.1 Agent Configurations

Create named agent configurations in VibeKanban for different task types:

| Config Name | Agent | Key Settings | Use For |
|---|---|---|---|
| **Standard** | CLAUDE_CODE | `plan: true` | Feature implementation, refactoring |
| **Quick Fix** | CLAUDE_CODE | `plan: false` | Bug fixes, small changes |
| **Review** | CLAUDE_CODE | `plan: false`, custom prompt | Code review, PR review |

**Configuration details:**

**Standard (Default):**
- Agent: CLAUDE_CODE
- `plan`: true (requires plan approval before implementation)
- `append_prompt`: "Follow the project's validation-first philosophy. Check .agents/rules/ and AGENTS.md before starting."

**Quick Fix:**
- Agent: CLAUDE_CODE
- `plan`: false
- `append_prompt`: "Focus on the specific fix. Don't refactor surrounding code. Max 50 lines per component."

**Review:**
- Agent: CLAUDE_CODE
- `plan`: false
- `append_prompt`: "Review mode only. Do not modify files. Report: signal capture impact, complexity budget violations, missing tests, anti-patterns from .agents/rules/anti-patterns.md."

### 3.2 Orchestrator Pattern

The VibeKanban MCP server (already configured) enables orchestration via:

1. **Planning agent** breaks work into issues with `create_issue`
2. **Each issue** gets assigned to a workspace session via `start_workspace_session`
3. **Different agent configs** are selected per issue type

For the current project, the recommended workflow:

```
User creates parent issue (e.g., "Add pricing section")
    ↓
Orchestrator (main session) plans subtasks:
    1. create_issue("Design pricing YAML content")
    2. create_issue("Implement PricingCard component")
    3. create_issue("Add event tracking for pricing clicks")
    4. create_issue("Write tests for pricing section")
    ↓
Each subtask → start_workspace_session with appropriate config
```

This is already possible with the current VibeKanban MCP setup. The key improvement is creating the named agent configurations so the orchestrator can select the right one.

### 3.3 Related Issues

Found related issues that should be linked:
- **DRE-20**: "Evaluate skills-npm adoption and add to starter template" — directly related
- **DRE-21**: "Create custom skill for our Nuxt layer package" — related
- **DRE-25**: "Check if Claude Code actually has access to Agent Skills in Repo" — related

These should be linked as sub-issues or related to DRE-67.

---

## Part 4: Beads Evaluation

### Verdict: Not Now, Revisit at 1.0

**What Beads solves:** Persistent structured task memory across sessions with dependency graphs. An agent can plan 20 subtasks, close the session, and the next session knows exactly what was done and what's left.

**Why not now:**

1. **Alpha software (v0.56.1)** — Multiple breaking changes per week. Dolt backend migration is actively causing issues (crashes, import failures). 60 open issues.

2. **This project already has VibeKanban** — which provides structured issue tracking, subtask management, and session-to-session continuity via the MCP server. `bd ready` is equivalent to `list_issues(status: "To do")`.

3. **Agents drift** — Agents need explicit prompting to use Beads. They "forget" mid-session as context fills. This adds cognitive overhead for the developer.

4. **Overhead vs. value** — For this project's scope (validation tool with focused modules), the built-in CLAUDE.md rules + auto memory + VibeKanban issue tracking is sufficient. Beads shines for multi-day epics with complex dependency chains.

**When to revisit:**
- Beads reaches 1.0 with stable Dolt backend
- Project grows to require multi-day epics with >10 dependent subtasks
- Multiple developers need shared task state beyond what VibeKanban provides

**Alternative for structured memory:** Use Claude Code's built-in subagent `memory: project` feature. This stores learnings in `.claude/agent-memory/` which can be committed to git — achieving the "shared memory for forked repos" goal without adding a CLI dependency.

---

## Part 5: Implementation Plan

### Phase 1: File Consolidation (Lowest Risk)

**Tasks:**
1. Create root `AGENTS.md` by merging `.claude/CLAUDE.md` + `.claude/AGENTS.md`
2. Replace `.claude/CLAUDE.md` with symlink to `../AGENTS.md`
3. Delete `.claude/AGENTS.md` (content merged)
4. Update `.gitignore` if needed
5. Create module AGENTS.md files for events, vrt, rss, changelog, docs

**Estimated complexity:** Low — file moves and content merge, no code changes.

### Phase 2: Settings & Environment (Low Risk)

**Tasks:**
1. Update `.claude/settings.json` with enhanced permissions, env vars, hooks
2. Set `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE=80`
3. Set `ENABLE_TOOL_SEARCH=auto`
4. Add SessionStart compact hook
5. Add PostToolUse auto-lint hook
6. Fix permission patterns (remove erroneous colons)

**Estimated complexity:** Low — JSON config changes only.

### Phase 3: Custom Subagents (Medium Risk)

**Tasks:**
1. Create `.claude/agents/` directory
2. Add `nuxt-dev.md` subagent
3. Add `signal-reviewer.md` subagent
4. Add `codebase-explorer.md` subagent
5. Test subagent invocation in a session

**Estimated complexity:** Medium — new files, requires testing.

### Phase 4: Path-Specific Rules (Low Risk)

**Tasks:**
1. Add path frontmatter to existing rule files where appropriate
2. Create `layer-development.md` and `example-apps.md` rule files
3. Test that rules load correctly for matching paths

**Estimated complexity:** Low — frontmatter additions.

### Phase 5: VibeKanban Agent Configs (Low Risk)

**Tasks:**
1. Create "Standard", "Quick Fix", "Review" agent configurations in VibeKanban settings
2. Link related issues (DRE-20, DRE-21, DRE-25) to DRE-67
3. Document orchestrator workflow in AGENTS.md

**Estimated complexity:** Low — UI configuration.

### Phase 6: Memory & Documentation (Low Risk)

**Tasks:**
1. Seed MEMORY.md with known project patterns
2. Configure subagent `memory: project` for nuxt-dev agent
3. Update root AGENTS.md with memory and subagent documentation
4. Update install-skills.sh if needed for new structure

**Estimated complexity:** Low — documentation and config.

---

## Summary of Key Recommendations

| Change | Impact | Effort | Priority |
|---|---|---|---|
| Merge CLAUDE.md + AGENTS.md → root AGENTS.md | High (eliminates confusion) | Low | 1 |
| Set AUTOCOMPACT to 80% | High (better compaction quality) | Trivial | 1 |
| Enable TOOL_SEARCH=auto | Medium (reduces MCP context) | Trivial | 1 |
| Add compact SessionStart hook | High (preserves critical context) | Low | 2 |
| Fix permission patterns in settings.json | Medium (smoother workflow) | Low | 2 |
| Create custom subagents | High (specialized workflows) | Medium | 2 |
| Add module AGENTS.md files | High (focused context per module) | Medium | 3 |
| Add PostToolUse auto-lint hook | Medium (catches issues early) | Low | 3 |
| Path-specific rule frontmatter | Medium (reduces baseline context) | Low | 3 |
| VibeKanban agent configurations | Medium (task-appropriate agents) | Low | 4 |
| Seed auto-memory | Low (bootstraps knowledge) | Low | 4 |
| Beads adoption | High (but premature) | High | Deferred |
| TypeScript LSP plugin | Medium (real-time diagnostics) | Low | Evaluate |

---

## Appendix: Related Issues

| Issue | Title | Status | Relationship |
|---|---|---|---|
| DRE-67 | Enhance AI Agentic Setup | In Progress | Parent |
| DRE-20 | Evaluate skills-npm adoption | To Do | Related |
| DRE-21 | Create custom skill for Nuxt layer | To Do | Related |
| DRE-25 | Check Claude Code access to Agent Skills | To Do | Related |
| DRE-4 | Optimise Repo for Claude Code | Done | Predecessor |
| DRE-18 | Update Project AI Agent Skills | Done | Predecessor |
