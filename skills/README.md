# Custom Agent Skills

This directory contains project-specific agent skills that are committed to git.

## Structure

```
/skills/
└── docs-writer/          # Documentation writing skill
    ├── SKILL.md          # Main skill definition
    └── references/       # Reference documentation
```

## How It Works

Skills are organized across three directories:

1. **`/skills/`** (this directory) - Custom skills committed to git
2. **`.agents/skills/`** - External skills (gitignored) + symlinks to custom skills
3. **`.claude/skills/`** - Symlink to `.agents/skills/` (agent access point)

### Symlink Chain

```
Custom skill flow:
  /skills/docs-writer/
    ↓ (symlinked to)
  .agents/skills/docs-writer/
    ↓ (accessed via)
  .claude/skills/ → ../.agents/skills/

External skill flow:
  .agents/skills/nuxt/
    ↓ (accessed via)
  .claude/skills/ → ../.agents/skills/
```

## Installation

Run the installation script to set up external skills and create necessary symlinks:

```bash
# Install for Claude Code (default)
bash scripts/install-skills.sh

# Install for other agents
bash scripts/install-skills.sh cursor

# Or use npm script
npm run skills:install
```

The script will:
- Install external skills to `.agents/skills/`
- Create symlinks from `.agents/skills/` to `/skills/` for custom skills
- Create agent directory symlink (`.claude/skills` → `.agents/skills`)

## Adding Custom Skills

To add a new custom skill:

1. **Create** skill directory in `/skills/`:
   ```bash
   mkdir -p skills/my-skill
   ```

2. **Add** `SKILL.md` file:
   ```markdown
   ---
   name: my-skill
   description: What this skill does
   ---

   # My Skill

   Skill instructions here...
   ```

3. **Run** install script to create symlinks:
   ```bash
   bash scripts/install-skills.sh
   ```

4. **Commit** to git:
   ```bash
   git add skills/my-skill
   git commit -m "feat: add my-skill custom skill"
   ```

## External Skills

External skills are defined in `.claude/skills.json` and installed via the script. They live in `.agents/skills/` and are gitignored.

See `scripts/install-skills.sh` for the list of external skills.

## Multi-Agent Support

The same skill structure works for multiple agents:

```bash
# Install for Claude Code
bash scripts/install-skills.sh claude-code

# Install for Cursor
bash scripts/install-skills.sh cursor

# Result:
# .claude/skills → ../.agents/skills
# .cursor/skills → ../.agents/skills
```

Both agents access the same skill directory, maintaining consistency.
