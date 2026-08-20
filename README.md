# Foundry

> Validation landing pages for technical founders. Capture signal before you build.

## What It Does

- **Landing pages** with email capture, presales, and booking flows
- **Authority docs** with citations, cross-linking, and MCP integration
- **Event tracking** that streams form captures to your webhook URL
- **MCP tools** for AI agents — query pages and detect content changes
- **Auto-registration** with the Incubrain mentorship network (opt-in)
- **Theme-aware backgrounds** — 12 pattern/gradient utilities that follow your brand
- **Zero lock-in** — standard Nuxt app, swap any tool anytime

**Stack:** Nuxt 4 · Tailwind v4 · TypeScript

## Quick Start

```bash
npx create-foundry my-project
cd my-project
npm install
npm run dev
```

Or install the layer directly:

```bash
npm install @incubrain/foundry
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@incubrain/foundry']
})
```

## Validation Paths

**Email Capture** — Test interest before creating content
**Presales** — Collect payment before building (external links to Stripe/LemonSqueezy)
**Service Bookings** — Sell calls via Cal.com/Calendly, learn from delivery

## Project Structure

```
layer/              Nuxt layer (npm: @incubrain/foundry)
examples/
  ├── foundry/      Demo site
  └── incubrain/    Incubation platform example
.starters/
  └── default/      Minimal template (used by CLI)
cli/                create-foundry CLI
```

## Configuration

Edit content files, not code:

```
content/
├── config/         Site config (YAML)
├── pages/          Landing pages (Markdown)
└── faq/            FAQ entries (YAML)
```

Set up webhooks:

```bash
cp .env.example .env
NUXT_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## MCP Tools

AI agents can query your site via the [Model Context Protocol](https://modelcontextprotocol.io):

| Tool | Purpose |
|---|---|
| `list-pages` | Browse pages with content hashes |
| `get-page` | Retrieve full markdown + hash |
| `what-changed` | Lightweight polling — paths + SHA-256 hashes with `since` filter |

Tools are auto-registered from `server/mcp/tools/`. Visit `/_mcp/tools` in dev to verify.

## Mentorship Network

Set `NUXT_FOUNDRY_REGISTER=true` in production to auto-register with the Incubrain mentorship network. Your site's MCP endpoint and RSS feeds are shared so mentors can track your progress.

## What's Not Included

- Email sequences (use ConvertKit/Mailchimp)
- Authentication (validation ≠ product)
- Payment processing (external links only)
- Databases (webhooks stream to your destination)

These belong in your product, not your validation tool.

## Links

- [Documentation](https://foundry.incubrain.org)
- [GitHub Issues](https://github.com/incubrain/foundry/issues)
- [Discussions](https://github.com/incubrain/foundry/discussions)

## License

MIT
