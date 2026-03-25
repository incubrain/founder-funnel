# Release Process

## Layer (`@incubrain/foundry`)

### Pre-release checklist

```bash
pnpm verify                  # lint + typecheck
pnpm test                    # all tests pass
pnpm build                   # playground builds
pnpm layer:check             # npm pack dry run — verify files list
pnpm layer:release:dry       # release-it dry run — preview tag, changelog, GitHub release
```

### Release

```bash
pnpm layer:release           # Bumps layer/package.json, commits, tags, creates GitHub release
pnpm layer:publish           # Publishes to npm (separate step — intentional)
```

`pnpm layer:release` does the following automatically:
1. Runs `pnpm verify` (lint + typecheck)
2. Runs `pnpm test` (all unit tests)
3. Prompts for version bump (patch/minor/major)
4. Updates `layer/package.json` version
5. Updates `CHANGELOG.md` via conventional-changelog
6. Creates git commit: `chore(release): v0.7.0`
7. Creates annotated git tag: `v0.7.0`
8. Pushes commit + tag
9. Creates GitHub release with changelog body
10. Opens the release page in your browser

Then `pnpm layer:publish` publishes to npm separately. This two-step approach lets you review the GitHub release before publishing.

### After publishing

Update example apps to use the new version:
```bash
# In examples/astronera/package.json and examples/foundry/package.json
"@incubrain/foundry": "^0.7.0"
```

---

## CLI (`create-foundry`)

Only release when CLI code changes. The CLI is independent of the layer version.

### Pre-release checklist

```bash
pnpm cli:build               # Build CLI
pnpm cli:check               # npm pack dry run
pnpm cli:release:dry          # release-it dry run
```

### Release

```bash
pnpm cli:release             # Bumps cli/package.json, commits, tags (cli-v*), GitHub release
pnpm cli:publish             # Publishes to npm
```

CLI tags use the `cli-v` prefix (e.g., `cli-v0.7.0`) to distinguish from layer tags.

---

## Version Strategy

- **Patch** (0.6.x → 0.6.y): Bug fixes, no new features
- **Minor** (0.6.x → 0.7.0): New features, backward compatible
- **Major** (0.x → 1.0): Breaking changes to public API

The layer and CLI are versioned independently. They don't need to match.

## Changelog

The `CHANGELOG.md` is updated automatically by release-it using conventional commits. You can also hand-edit it before running `pnpm layer:release` — release-it will preserve your edits and append the new section.

## Tags

| Package | Tag format | Example |
|---|---|---|
| `@incubrain/foundry` | `v{version}` | `v0.7.0` |
| `create-foundry` | `cli-v{version}` | `cli-v0.7.0` |
