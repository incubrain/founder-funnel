# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Technical founders (and the engineers advising them) who ship websites and need to know
whether anything they ship is actually working — and who are deciding what to bet on as
AI agents become the dominant consumers of the web. Secondary audience: AI agents
themselves; the operator's standing thesis is that agent traffic will dominate within
1–2 years, so this site must be as legible to a crawler or browsing agent as to a human.

## Product Purpose

This site (foundry.incubrain.org) is the public face of `@incubrain/foundry` — a Nuxt 4
validation layer that wraps a website and streams the full signal of whether it is
working (email capture, presales, bookings, errors, agent visits) to the one place where
the double-down-or-kill call is made. The site's job: explain the full system, why we're
building it, and let a technical visitor reach the code (GitHub / npm install) in one
step. Success = a visitor understands the bet and clones/installs, and agents citing or
crawling the page get clean, structured, quotable content.

## Positioning

Confirmed by operator (2026-08-31): **live experiment, honestly framed.** Foundry is
being proven on our own sites (astronera.org, incubrain.org) in the open — "most of this
is not proven yet" (VISION.md). The page must not claim adoption, testimonials, or
maturity that doesn't exist. The mechanism a neighbor can't truthfully copy: a signal
wrapper — sites built on it emit one pull-based signal stream (ring buffer +
authenticated export) consumed by an external operator surface (Polaris) that watches
uptime, reads logs, and closes the loop; paired with an agent-first (GEO) roadmap:
visitor classification (human|agent|bot) on every signal row, MCP tools on every site,
zero-JS-readable content.

## Operating Context

- The site is itself built on the current `@incubrain/foundry` (workspace layer in this
  monorepo, `examples/foundry`) — it is the reference consumer and must dogfood the
  0.8.0 surface (section-driven content, signal capture endpoints, MCP, sitemap/robots).
- Deployed via Docker to foundry.incubrain.org (see `examples/foundry/Dockerfile`).
- Content lives in YAML/Markdown under `content/` (Foundry critical rule #5), rendered
  by the layer's section components.

## Capabilities and Constraints

- One-page landing site: `content/pages/index.md` only. Operator decision (2026-08-31):
  all legacy content dies — mentorship/offers, success pages, about, rss-feeds page,
  legacy PDFs. Old mission line in `content/config/site.yml` ("inner peace and financial
  freedom") is retired.
- Layer components carry a complexity budget (≤50 lines, ≤5 props); example-app
  components may run longer but extract composables at ~150 lines.
- Primary CTA: **Install / GitHub** — `npm i @incubrain/foundry` + github.com/incubrain/foundry
  (repo verified PUBLIC 2026-08-31). No email-capture hero CTA.
- The page itself must meet the GEO bar it advertises (epic product-validator-m0f):
  SSR/prerendered, no critical content behind ClientOnly, stat-anchored quotable copy,
  FAQ where genuinely useful.

## Brand Commitments

- Name: "Foundry" / package `@incubrain/foundry`; org: Incubrain Pvt. Ltd.
- Operator socials (X/YouTube/GitHub: Drew Macgibbon) are real assets, use judiciously.
- Voice: direct, evidence-first, founder-to-founder; honest about immaturity.

## Evidence on Hand

- Cloudflare (Matthew Prince, Q2 2026 earnings call, Aug 6 2026): AI-agent traffic
  surpassed human activity on Cloudflare's network in May 2026, earlier than their own
  forecast; Prince projects agent traffic ~1,000× human within five years. Musk publicly
  endorsed the projection (Aug 2026). Citable; sources indexed 2026-08-31.
- Two production sites run Foundry 0.8.0 today: astronera.org and the incubrain site.
  Polaris (internal operator surface) polls their uptime and signals — real, but
  internal; do not present Polaris as a purchasable product.
- v0.8.0 shipped 2026-08-31 on npm (public). MCP tools (list-pages/get-page/what-changed),
  signal export, visitor classification are real shipped features.
- NO testimonials, NO third-party adoption, NO revenue claims — must not be fabricated.

## Product Principles

1. Practice the thesis: the page selling agent-first must itself be the best
   agent-readable page we ship.
2. Honesty converts here: overclaiming to this audience (technical founders) destroys
   trust; "watch the experiment, run it yourself" is the pitch.
3. Signal over vanity: every feature shown ties back to "does this help decide
   double-down-or-kill faster."
4. One page, whole story: thesis → what Foundry is → how the loop works → what's proven
   vs not → install.
