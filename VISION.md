---
type: vision
title: Every Foundry site streams the full signal of whether it is working — raw — to the consumer where the double-down-or-kill call is made.
created: 2026-06-02
updated: 2026-08-31
status: active
tags: [vision, project]
applies-to: incubrain/foundry
upstream-vision: visions/personal.md
derivation-status: draft
kpis:
  - name=Time to live site with signal flowing | target=1 | unit=days | kind=threshold | go_when=at_or_below | direction=down | cadence=per-deploy
  - name=Signal completeness per deploy | target=100 | unit=percent | direction=up | cadence=monthly
  - name=Agent-traffic visibility | target=100 | unit=percent | direction=up | cadence=monthly
  - name=Anomaly surfaced before we noticed it | target=1 | unit=count | direction=up | cadence=monthly
---

# Foundry vision

## Purpose

Foundry is the wireframe for a website that proves whether it is working. Every site built
on it captures the whole signal — what visitors do (visits, and intent through the convert
components: email capture, presales clicks, bookings) and what the site itself reports
(errors, warnings) — and streams it **raw** to an external consumer. We consume it in
Polaris; someone else could point the same stream at a Grafana-class tool. Transport is
ratified (`product-validator-a4r.1`): the site buffers a unified signal envelope
server-side and exposes an authenticated, cursor-based export endpoint. The consumer pulls.

The second pillar is **agent-readiness**. Agentic traffic is expected to dwarf human
traffic — 10-100x within a couple of years. A site only humans can find and use is
invisible to most of its future audience, so Foundry sites are efficiently discoverable and
interactable by agents, ours and external, via MCP tools, `llms.txt`, and strong SEO/OG.
Human-vs-agent classification is itself signal and ships on the stream.

Foundry ends at the stream. No charts, no dashboards, no anomaly detection inside the site
— the consumer owns interpretation, and anomalies are the highest-value signal for deciding
where to double down.

Most of this is not proven yet. As of August 2026 the layer runs two of our own websites,
the transport shipped in 0.8.0, and the agent-readiness surface was on a chopping-block
list a week ago.

## Value

Drew stands up a new site in an afternoon — writes content, deploys, wires nothing. That
evening Polaris shows him the visits, the three people who left an email, the presales
click that went nowhere, and the agent-to-human ratio. A week later it flags a spike from a
source he did not expect, and the next month's work gets chosen on evidence. A customer who
never touches Polaris gets the same thing: the export endpoint is theirs, authenticated,
and points wherever they want.

## KPIs

- **Time to live site with signal flowing.** From a fresh Foundry site to a deployed page
  whose events and logs are landing in a consumer — under a day, done by someone who has
  not read the docs. Time the next site we stand up.
- **Signal completeness per deploy.** Every deploy streams events, logs, and visitor-class
  with zero extra wiring. The reading that counts: pick any live Foundry site, ask the
  consumer what it knows about it — all three, or the KPI is failing.
- **Agent-traffic visibility.** Every request is classified human or agent on the stream,
  and the agent share is a number we can quote per site. Unclassified traffic trending up
  is the failure mode.
- **Anomaly surfaced before we noticed it.** The consumer flags something on one of our own
  sites that we had not caught by hand — a dead conversion path, a crawler finding a page.
  Observable in a single instance, long before the others have trend lines.

## Boundaries

Foundry is the site and the stream. Polaris is the interpretation — charts, anomaly
detection, decisions, publishing schedules. Anything dashboard-shaped belongs there.

Out permanently: decision-log capture and display (killed), the founder-grilling flow as
product scope, email sequences, authentication, payment processing, in-product analytics
dashboards. Out on principle: an opinionated design system — AI makes design cheap, and
hard-coding taste into the wireframe is a liability, not a feature. Foundry ships structure
and signal. Named future ambition, not current scope: blog publishing managed and scheduled
from Polaris via Nuxt Content/Studio (`product-validator-3bd`).

## Blockers

- **The stream carries nothing worth consuming.** Sites ship, but the consumer has nothing
  to say about them beyond a visit count you could have got from Umami in five minutes.
  Stop building transport and keep the layer alive purely as the website substrate for
  incubrain-website and astronera-website.
- **Agent traffic never materialises.** If by end of 2027 agent traffic on our own sites is
  still a rounding error, drop agent-readiness to plain SEO hygiene and delete the MCP
  surface. It is a bet on a trend; a bet that does not land gets cut, not defended.
- **Complete signal only comes at a privacy cost.** If completeness turns out to require
  fingerprinting visitors or exfiltrating page content, we stop instead of taking that
  route. "Raw" means raw about our own site, never about the people on it.
- **Resources never arrive.** Foundry sits behind the money engines (manuscript-ocr,
  astronera) and is designed to wait. If those still haven't freed attention by end of 2027,
  stop holding a slot: Foundry is a website layer we use, and the signal stream stays an
  ambition on the Polaris side.
