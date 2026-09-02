# @incubrain/foundry

A Nuxt 4 layer for marketing and validation sites that stream the full signal of whether
they are working — visitor events and site errors alike — to an external consumer over an
authenticated cursor endpoint.

Extending this layer gives you a content-driven site, the signal pipeline that feeds it,
and an agent-readable surface. It does not give you a design system: the layer ships
structure and signal, and your app supplies the taste.

## Installation

```bash
npm install @incubrain/foundry
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@incubrain/foundry'],
})
```

**Requirements:** Nuxt 4.x, Node 22+.

Optional peer dependencies, added in your own app when you want them: `nuxt-llms`
(`llms.txt` generation), `nuxt-studio` (visual content editing),
`@iconify-json/lucide` and `@iconify-json/simple-icons` (icon sets), `better-sqlite3`.

## What you get

**Signal capture.** Client events (`useEvents()`) and client errors are batched to
`POST /api/_signals/ingest`; form captures and Nitro request errors are appended
server-side. All of it becomes one `SignalRow` envelope in a capped ring buffer, pulled by
a consumer at `GET /api/_signals/export?since=<seq>&limit=<n≤2000>` behind a bearer token.
Every row carries a server-derived `visitor.class` of `human`, `agent`, or `bot`. Nothing
is pushed out — no webhook forwarders, no analytics vendors, no second destination.

**Identity events.** Always on, for every visitor: `ui.click`, `ui.section`, and `ui.page`
rows describing *which* authored thing was touched — never *what* was typed. No pixel
coordinates, no input values, no keystrokes. Sections are identified by `data-section` (or a
plain `<section id>`); `SectionWrapper` stamps it automatically. A `?polaris_review=<token>`
query param rides along as the row's own `review` field for one page load only, letting an
external reviewer bind a review session to an anonymous visitor. Details in
`modules/events/AGENTS.md`.

**Convert components** — the intent-capture surface, each wired to the event stream:
`ConvertForm`, `ConvertExternal`, `ConvertInternal`, `ConvertPricing`, `ConvertSocial`,
`ConvertSocialShare`, and `ConvertRss`.

**Content collections.** Zod schemas — `basePageSchema`, `baseFaqSchema`,
`baseConfigSchema`, `baseNavigationSchema`, `baseTeamSchema`, `bannerSchema` — exported
from `@incubrain/foundry/schemas` and composed in your own `content.config.ts`. Content
lives in markdown and YAML, edited without touching code.

**Page structure.** `default`, `article`, and `landing` layouts selected per route with an
`appLayout` route rule, a catch-all content page, header/footer/banner components, MDC
content components, and `SectionWrapper` — an accessible section primitive that fires a
`section_view_<id>` event on intersection.

**Agent-readiness.** `GET /api/_health` — unauthenticated liveness+identity check for
external monitors (Polaris), pure computation with `Cache-Control: no-store`. MCP tools
(`list-pages`, `get-page`, `what-changed`) served by
`@nuxtjs/mcp-toolkit`; the `markdown-rewrite` module, which writes Vercel edge redirects so
`Accept: text/markdown` requests get raw markdown and `/` serves `llms.txt`; `@nuxtjs/seo`
for sitemap, robots, schema.org, link checking, and canonical redirects; a Satori OG image
component for landing pages.

**RSS.** Config-driven feeds from any content collection — declare `rss: { feeds: {} }` in
your app config and they are served at `/rss/{key}`.

## Configuration

```bash
NUXT_SIGNAL_EXPORT_TOKEN=<random-secret>   # bearer token for the export endpoint (unset → 503)
NUXT_PUBLIC_SITE_ID=my-site                # stamped on every signal row (defaults to request host)
NUXT_PUBLIC_SITE_URL=https://example.com   # canonical URL, consumed by @nuxtjs/seo
```

```ts
// nuxt.config.ts
events: {
  signals: { enabled: true, capacity: 100_000, captureErrors: true },
  debug: true,
}
```

Signal rows are held in `useStorage('signals')` — memory by default. Mount
`nitro.storage.signals` to an fs or KV driver to survive restarts.

## Not included

Email sequences, authentication, payment processing, in-product dashboards or charts,
analytics vendor integrations, per-platform webhook notifiers, and an opinionated design
system. Validation captures intent; products deliver value — mixing them creates scope
creep.

## Credits

Foundry's content and layout foundation is adapted from
[Docus](https://docus.dev) ([GitHub](https://github.com/nuxt-content/docus)) by the Nuxt
Content team. i18n was removed — browser-native translation is improving fast and
maintaining translations slows shipping — and signal capture, agent-readiness, and the
export endpoint were added. For Docus-inherited behaviour (MDC components, content
collections, search, theming), the [Docus documentation](https://docus.dev/en) remains a
good reference.

## License

MIT
