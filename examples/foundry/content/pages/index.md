---
title: Foundry — Signal Station
description: A Nuxt 4 layer that wraps your website in a recording instrument — every visit, capture, and error, human or machine, streamed raw to where you decide to double down or kill.
---

::section-station
---
headline: The next billion visitors won't be human.
sub: >
  AI agents passed human traffic on Cloudflare's network in May 2026. Foundry wraps your
  Nuxt site in an instrument that records every signal that matters — from both species
  of visitor — and streams it raw to the one place you decide: double down, or kill it.
install: npm i @incubrain/foundry
github: https://github.com/incubrain/foundry
events:
  - at: 0.14
    date: 2026-05
    label: agents pass humans
    amp: 0.9
  - at: 0.38
    date: 2026-08-20
    label: signal transport ships
    amp: 0.6
  - at: 0.56
    date: 2026-08-31
    label: v0.8.0 on npm
    amp: 0.75
  - at: 0.78
    date: now
    label: your visit, on the drum
    amp: 0.45
---
::

::section-reading
---
plate: FIG. 1 — THE READING
title: The web's readership just changed species.
body: >
  This is not a forecast anymore; it is a measurement. The crossover already happened on
  one of the largest networks on earth, ahead of its own schedule. Websites designed only
  for human eyes are now illegible to most of their readers.
stats:
  - value: MAY 2026
    claim: AI agents surpassed human activity on Cloudflare's network — earlier than Cloudflare's own forecast of 2027.
    source:
      label: Cloudflare Q2 2026 earnings call
      href: https://www.fool.com/investing/2026/08/16/cloudflare-ceo-says-the-internet-is-changing-exponentially/
  - value: ~18×
    claim: Growth in agentic traffic over the preceding twelve months, as discussed by Motley Fool analysts covering the call.
    source:
      label: Motley Fool, Aug 2026
      href: https://www.fool.com/investing/2026/08/16/cloudflare-ceo-says-the-internet-is-changing-exponentially/
  - value: 1,000×
    claim: Cloudflare CEO Matthew Prince's five-year projection for agent traffic relative to human traffic — a projection, marked as such on the chart.
    source:
      label: via Stocktwits / Yahoo Finance
      href: https://finance.yahoo.com/technology/ai/articles/elon-musk-backs-study-showing-032931794.html
---
::

::section-loop
---
plate: PLATE II — THE LOOP
title: Wrap. Stream. Decide.
steps:
  - n: "01"
    name: Wrap
    detail: One line, and your site is an instrument.
    code: "extends: ['@incubrain/foundry']"
  - n: "02"
    name: Stream
    detail: Every event inked to a buffer you own — nothing pushed, everything pulled.
    code: GET /api/_signals/export
  - n: "03"
    name: Decide
    detail: "Read the record, make the only call that matters: double down, or kill."
---
::

::section-channels
---
plate: PLATE III — CHANNELS
title: One drum, every signal.
body: >
  Foundry refuses dashboards, charts, and on-site analytics — interpretation belongs to
  the consumer. The layer's whole job is a clean recording: four channels, one buffer,
  one authenticated export.
channels:
  - ch: CH 01
    name: Captures
    detail: Email, presales, bookings — the demand signals a validation site exists to collect. Forms land as signal rows, not inbox noise.
  - ch: CH 02
    name: Events
    detail: Section views and offer clicks, tracked in the page's own vocabulary — which promise pulled, which one died.
  - ch: CH 03
    name: Errors
    detail: Server and client failures enter the same stream via the error hook. A broken site is the loudest signal of all.
  - ch: CH 04
    name: Visitors
    detail: Every row is stamped human, agent, or bot — so you can watch the species shift happen on your own site, not in someone's keynote.
endpoints:
  - path: /api/_signals/export
    note: bearer · pull
  - path: /api/_signals/ingest
    note: client rows
  - path: /api/v1/webhook
    note: form capture
  - path: /api/_health
    note: liveness · 0.8.1
  - path: /mcp
    note: list-pages · get-page · what-changed
  - path: /sitemap.xml
    note: page manifest
  - path: /llms.txt
    note: agent map
  - path: /robots.txt
    note: crawler policy
---
::

::section-species
---
plate: PLATE IV — BOTH SPECIES
title: Built to be read by machines, watched by you.
body: >
  Agents don't run your JavaScript and don't admire your gradients — they read structure,
  or they leave. Foundry treats the machine readership as a first-class audience and
  keeps an honest ledger of which agent-first surfaces are shipped versus planned.
items:
  - name: Server-rendered everything
    detail: Content is SSR/prerendered markdown — fully legible to zero-JS crawlers like GPTBot, ClaudeBot, and PerplexityBot. This page included.
    status: SHIPPED
  - name: Visitor classification
    detail: Every signal row stamped human | agent | bot at the server, so agent traffic is measured, not guessed.
    status: SHIPPED
  - name: MCP tools on every site
    detail: list-pages, get-page, what-changed — agents can query your content and detect changes by hash instead of scraping.
    status: SHIPPED
  - name: sitemap.xml · robots.txt · llms.txt
    detail: The discovery surfaces, emitted by default.
    status: SHIPPED
  - name: Deliberate AI-crawler robots policy
    detail: Separate treatment for training crawlers versus search and live-fetch bots, configurable per site.
    status: PLANNED
  - name: Raw markdown negotiation
    detail: Serve pages as plain markdown to agents that ask for it, on any host.
    status: PLANNED
  - name: FAQ & Organization structured data
    detail: JSON-LD from content the sites already model — the last structured-data spend the evidence justifies.
    status: PLANNED
---
::

::section-ledger
---
plate: PLATE V — STATION LOG
title: A live experiment, honestly framed.
quote:
  text: Most of this is not proven yet.
  source: VISION.md, this repository
note: >
  This page is itself a Foundry instrument — your visit is being classified and inked to
  the drum right now. No adoption numbers, no testimonials, no revenue screenshots:
  when the record says something, the record will say it.
entries:
  - date: 2026-05
    entry: Agent traffic passes human activity on Cloudflare's network.
    status: REPORTED
  - date: 2026-08-20
    entry: Signal transport ships — ring buffer, error hook, authenticated export.
    status: RECORDED
  - date: 2026-08-31
    entry: v0.8.0 published to npm. Two production sites streaming — astronera.org and incubrain.org.
    status: RECORDED
  - date: —
    entry: Third-party adoption beyond our own sites.
    status: OPEN
  - date: —
    entry: The 1,000× projection.
    status: OPEN
---
::

::section-questions
---
plate: PLATE VI — QUESTIONS
title: Asked and answered.
---
::

::section-tag
---
headline: Point an instrument at your next idea.
install: npm i @incubrain/foundry
github: https://github.com/incubrain/foundry
agents:
  - path: /llms.txt
    note: what this site offers
  - path: /sitemap.xml
    note: every page
  - path: /mcp
    note: query content · detect changes
  - path: /api/_health
    note: am I up (from 0.8.1)
colophon: >
  FOUNDRY · SIGNAL STATION №1 — built on itself: this page records its own signal,
  classifies its own visitors, and exports its own record. Nuxt 4 · Tailwind 4 · TypeScript.
---
::
