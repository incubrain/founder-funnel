---
title: Events & Tracking
description: Analytics-agnostic event system — providers, webhooks, and anti-spam.
---

Foundry's event system is designed so you can swap analytics providers without changing a single line of event code.

::card-group
  ::card{title="Overview" icon="i-lucide-activity" to="/docs/events/overview"}
  Architecture and the hook-based pipeline.
  ::

  ::card{title="Tracking Events" icon="i-lucide-mouse-pointer-click" to="/docs/events/tracking"}
  useEvents(), event types, and payload shapes.
  ::

  ::card{title="Providers" icon="i-lucide-plug" to="/docs/events/providers"}
  Console, Umami, and webhook providers.
  ::

  ::card{title="Webhooks" icon="i-lucide-webhook" to="/docs/events/webhooks"}
  Server handler, platform formatters, and multi-webhook delivery.
  ::

  ::card{title="Anti-Spam" icon="i-lucide-shield" to="/docs/events/anti-spam"}
  Honeypot, rate limiting, JS token validation, and scoring.
  ::
::
