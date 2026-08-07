# CLAUDE.md

Guidance for Claude Code in this repository. Reference detail — architecture, file
locations, workflows, and the full context-mode tool-routing rules (redirected tools, the
tool-selection hierarchy, the `ctx` command reference) — lives in `CONTEXT.md`. Canonical
terms are in `GLOSSARY.md`.

## Project

**Foundry** (`@incubrain/foundry`) is a Nuxt 4 validation layer for technical founders —
captures signal (email, presales, bookings) to prove demand before building product. See
`GLOSSARY.md` for domain terms and `CONTEXT.md` for architecture, file locations, and
day-to-day workflow (verdaccio cross-repo testing, module guides, visual testing).

## Critical rules

1. **Never add features that don't capture signal.** If it doesn't help founders validate faster, reject it.
2. **Never build custom when VueUse/library exists.** Priority: VueUse → library → custom (last resort). Check composables.vueuse.org first.
3. **Validation ≠ Product.** Email sequences, auth, payment processing, gated content are product features — out of scope.
4. **Complexity budget:** max 50 lines per layer component (reusable); example-app components can run longer but extract composables at ~150 lines. Max 5 props, max 2 abstraction layers, max 3 nesting levels.
5. **Content in YAML/Markdown, not hardcoded.** Customers edit content files, not code.
6. **Ship first, optimize later.** Ship working → measure → optimize what data proves necessary.

Before building: does VueUse solve this? does an existing component handle it? is this a
real (not imagined) problem? will it capture signal faster? If all four are "no," don't
build it.

## Rule files

Detailed rules live in `.agents/rules/` (symlinked at `.claude/rules/`) — read on demand,
not autoloaded every session: [architecture.md](.agents/rules/architecture.md),
[conventions.md](.agents/rules/conventions.md), [decisions.md](.agents/rules/decisions.md),
[anti-patterns.md](.agents/rules/anti-patterns.md). Per-module guides are listed in
`CONTEXT.md`.

## Hard-blocked commands — do NOT retry

`curl`, `wget`, inline HTTP (`fetch('http`, `requests.get(`, `requests.post(`,
`http.get(`, `http.request(`), and `WebFetch` are intercepted by a PreToolUse hook and
replaced with an error message. Do not retry them in Bash. Use
`ctx_fetch_and_index(url, source)` then `ctx_search(queries)` for web pages, or
`ctx_execute(language, code)` to run HTTP calls in the sandbox — only stdout enters context.

## Bash — short output only

Bash is for short-output commands and mutations only (`git`, `mkdir`, `rm`, `mv`, `cd`,
`ls`, `pnpm install`). Anything printing more than ~20 lines — including `grep` over a large
tree — floods context if run directly; route it through `ctx_batch_execute(commands,
queries)` or `ctx_execute(language: "shell", …)` instead, so only the derived answer enters
context. Full tool-selection hierarchy and the `ctx` command table are in `CONTEXT.md`.

## Issue tracking — beads (`bd`)

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
