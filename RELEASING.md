# Release Process

## Layer (`@incubrain/foundry`)

### Pre-release checklist

```bash
pnpm verify                  # lint + typecheck
pnpm test                    # all tests pass
pnpm build                   # layer builds
pnpm build:foundry           # example app builds against the layer
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
6. Creates git commit: `chore(release): v0.8.0`
7. Creates annotated git tag: `v0.8.0`
8. Pushes commit + tag
9. Creates GitHub release with changelog body
10. Opens the release page in your browser

`.release-it.json` sets `npm.publish: false`, so nothing reaches the registry until you run
`pnpm layer:publish` (`npm publish --access public` from `layer/`). This two-step approach
lets you review the GitHub release before publishing. `@incubrain/foundry` is the only
published package — there is no CLI package.

### After publishing

Update example apps to use the new version:
```bash
# In examples/foundry/package.json (and other example apps)
"@incubrain/foundry": "^0.8.0"
```

---

## Version Strategy

- **Patch** (0.8.x → 0.8.y): Bug fixes, no new features
- **Minor** (0.7.x → 0.8.0): New features, backward compatible
- **Major** (0.x → 1.0): Breaking changes to public API

## Changelog

The `CHANGELOG.md` is updated automatically by release-it using conventional commits. You can also hand-edit it before running `pnpm layer:release` — release-it will preserve your edits and append the new section.

## Tags

| Package | Tag format | Example |
|---|---|---|
| `@incubrain/foundry` | `v{version}` | `v0.8.0` |
