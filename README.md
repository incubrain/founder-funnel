# Foundry

> Validation landing pages for technical founders. Capture signal before you build.

## What It Does

- **Landing pages** with email capture, presales, and booking flows
- **Authority docs** with citations, cross-linking, and MCP integration
- **Signal capture** — form captures, events, and errors in one pull-based export
- **MCP tools** for AI agents — query pages and detect content changes
- **Auto-registration** with the Incubrain mentorship network (opt-in)
- **Theme-aware backgrounds** — 12 pattern/gradient utilities that follow your brand
- **Zero lock-in** — standard Nuxt app, swap any tool anytime

**Stack:** Nuxt 4 · Tailwind v4 · TypeScript

## Quick Start

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
```

## Configuration

Edit content files, not code:

```
content/
├── config/         Site config (YAML)
├── pages/          Landing pages (Markdown)
└── faq/            FAQ entries (YAML)
```

## Signal Export

Every event, form capture, and error/warning lands in a capped in-process ring buffer as a
single `SignalRow` envelope. Nothing is pushed anywhere — an external consumer pulls with a
cursor. Two environment variables, and that's the whole surface:

```bash
cp .env.example .env

NUXT_SIGNAL_EXPORT_TOKEN=<random-secret>   # required — unset means the endpoint returns 503
NUXT_PUBLIC_SITE_ID=my-site                # optional — defaults to the request host

curl -H "Authorization: Bearer $NUXT_SIGNAL_EXPORT_TOKEN" \
  "https://your-site.com/api/_signals/export?since=0&limit=500"
# → { rows: [...], cursor: 512, site: "my-site" }
```

Rows are held in memory by default (10 000, oldest evicted). Mount `nitro.storage.signals` to
an fs/KV driver if they must survive a restart.

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
- Databases (signals stream out via the export endpoint)
- Analytics vendors (no Umami/GA integration — pull the signal buffer instead)

These belong in your product, not your validation tool.

## Links

- [Documentation](https://foundry.incubrain.org)
- [GitHub Issues](https://github.com/incubrain/foundry/issues)
- [Discussions](https://github.com/incubrain/foundry/discussions)

## License

MIT
