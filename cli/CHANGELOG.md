# Changelog

All notable changes to `create-foundry` will be documented in this file.

## [0.1.0] - 2026-02-27

First public release.

### Features

- **Project scaffolding** — `npx create-foundry [dir]` creates a new Foundry project from starter templates
- **Template support** — `--template` / `-t` flag to select starter template (currently: `default`)
- **Copy-list system** — Automatically fetches shared config files from the monorepo after scaffolding via `copy-list.json`
- **Input validation** — Path traversal prevention, repository format validation, ref validation
- **Built on @nuxt/cli** — Uses Nuxt's official scaffolding (`nuxt init`) under the hood
- **Zero install** — Run directly with `npx create-foundry` or `pnpm create foundry`
