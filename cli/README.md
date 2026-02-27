# create-foundry

CLI to scaffold a new [Foundry](https://github.com/incubrain/foundry) project.

## Usage

```bash
npx create-foundry my-project
cd my-project
pnpm install
pnpm dev
```

## Options

| Flag | Alias | Default | Description |
|------|-------|---------|-------------|
| `dir` | (positional) | `my-project` | Project directory |
| `--template` | `-t` | `default` | Template to use |

## Templates

- **default** — Minimal starter with landing page and signal capture

## Development

```bash
pnpm install
pnpm build
pnpm dev my-test-project
```
