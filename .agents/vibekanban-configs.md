# VibeKanban Agent Configurations

These agent configurations should be created manually in VibeKanban Settings > Agents.
See: https://www.vibekanban.com/docs/settings/agent-configurations

## Standard (Default)

Use for: Feature implementation, refactoring, multi-step tasks.

| Setting | Value |
|---------|-------|
| Name | Standard |
| Agent | CLAUDE_CODE |
| Plan | true |
| Append Prompt | Follow the project's validation-first philosophy. Read AGENTS.md and relevant module AGENTS.md before starting. Check .agents/rules/ for constraints. Max 50 lines/component, 5 props, 2 abstraction layers. VueUse before custom. Content in YAML not code. |

## Quick Fix

Use for: Bug fixes, small targeted changes, single-file edits.

| Setting | Value |
|---------|-------|
| Name | Quick Fix |
| Agent | CLAUDE_CODE |
| Plan | false |
| Append Prompt | Focus on the specific fix. Don't refactor surrounding code. Respect complexity budget: max 50 lines per component, max 5 props. Run tests after changes. |

## Review

Use for: Code review, PR review, architecture assessment.

| Setting | Value |
|---------|-------|
| Name | Review |
| Agent | CLAUDE_CODE |
| Plan | false |
| Append Prompt | Review mode only. Do not modify files. Report: signal capture impact, complexity budget violations (50 lines, 5 props, 2 layers), missing tests, anti-patterns from .agents/rules/anti-patterns.md. Output as PASS/FAIL with specific violations. |

## Orchestrator Workflow

When breaking down large tasks:

1. Create parent issue with full scope description
2. Use orchestrator (main session) to plan subtasks via `create_issue`
3. Assign subtasks with appropriate agent config:
   - Implementation tasks → Standard
   - Bug fixes → Quick Fix
   - Post-implementation review → Review
4. Launch subtask sessions via `start_workspace_session` with the selected config
