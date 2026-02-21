---
label: Getting Started
title: Getting Started
description: What Foundry is, who it's for, and the core philosophy that drives every design decision.
---

Foundry is a [Nuxt Layer](https://nuxt.com/docs/getting-started/layers) that gives technical founders everything they need to test whether an idea has demand — before writing a single line of product code.

It provides:

- **Landing pages** built from Markdown and YAML content files
- **Signal capture** via email forms, external payment links, and booking integrations
- **Event tracking** that is analytics-agnostic — swap providers without changing code
- **Webhook delivery** to Slack, Discord, or Telegram so you see signals in real time

## Who Is This For?

Foundry is built for **technical founders** who:

- Have an idea but aren't sure anyone will pay for it
- Want to capture real demand signals (emails, presales, bookings) before committing to a build
- Prefer editing content files over wrestling with page builders
- Value shipping fast over shipping perfect

If you're building a SaaS, a developer tool, a course, or a consulting offer — and you want proof of demand before investing months of engineering — Foundry is for you.

## Core Philosophy

### Validation is Not Product

This is the most important idea in Foundry. **Validation captures intent. Product delivers value.** They are fundamentally different activities and mixing them is the #1 cause of wasted engineering time.

| Validation (Foundry)    | Product (Not Foundry) |
| ----------------------- | --------------------- |
| Email capture           | Email sequences       |
| External payment links  | Payment processing    |
| Booking links (Cal.com) | Authentication        |
| Event tracking          | Databases             |
| Webhook streaming       | CRM integration       |

Foundry handles the left column. For everything in the right column, use external tools like [ConvertKit](https://convertkit.com), [Stripe](https://stripe.com), [Cal.com](https://cal.com), or [Supabase](https://supabase.com).

### Content-First

Customers edit YAML and Markdown — not Vue components. All page content, navigation, FAQ entries, team profiles, and site configuration live in the `content/` directory. The framework turns those files into pages.

### Ship First, Optimize Later

Ship a working funnel. Measure what happens. Optimize only what the data proves necessary. Don't build features "just in case" or because a competitor has them.

### Complexity Budget

Every component and composable in Foundry follows strict limits:

| Constraint          | Limit        |
| ------------------- | ------------ |
| Component length    | 50 lines max |
| Props per component | 5 max        |
| Abstraction depth   | 2 layers max |
| Nesting levels      | 3 max        |

If something needs to exceed these limits, it gets split into smaller pieces.

## Three Validation Paths

Foundry supports three ways to capture demand signal:

### 1. Email Capture

Collect email addresses with optional custom fields. Anonymous visitor IDs and UTM parameters are tracked automatically. Form submissions are delivered via webhook to your chosen platform.

**Best for:** Testing interest before you build anything.

### 2. Presales Links

Link to external payment pages (Stripe, LemonSqueezy) to prove payment intent. Every click is tracked as an event.

**Best for:** Proving people will pay before you process payments.

### 3. Service Bookings

Embed scheduling links (Cal.com, Calendly) to let potential customers book time with you. Generate revenue while learning what to build.

**Best for:** Earning while validating — consulting, coaching, audits.

## What's Under the Hood

Foundry is built on a modern, well-supported stack:

| Technology                                    | Purpose                          | Docs                                                 |
| --------------------------------------------- | -------------------------------- | ---------------------------------------------------- |
| [Nuxt 4](https://nuxt.com)                    | Full-stack Vue framework         | [nuxt.com/docs](https://nuxt.com/docs)               |
| [Nuxt Content](https://content.nuxt.com)      | Markdown/YAML content management | [content.nuxt.com](https://content.nuxt.com)         |
| [Nuxt UI](https://ui.nuxt.com)                | Component library                | [ui.nuxt.com](https://ui.nuxt.com)                   |
| [Tailwind CSS v4](https://tailwindcss.com)    | Utility-first CSS                | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| [VueUse](https://vueuse.org)                  | Composition utilities            | [vueuse.org](https://vueuse.org)                     |
| [Nuxt SEO](https://nuxtseo.com)               | SEO meta, sitemap, OG images     | [nuxtseo.com](https://nuxtseo.com)                   |
| [evlog](https://github.com/davestewart/evlog) | Structured logging               | [GitHub](https://github.com/davestewart/evlog)       |

You don't need to learn all of these to use Foundry. Most of the complexity is handled by the layer. But when you need to go deeper, these are the tools you're working with.

## Next Steps

::card-group
  ::card{title="Quickstart" icon="i-lucide-zap" to="/docs/getting-started/quickstart"}
  From zero to running dev server in under 5 minutes.
  ::

  ::card{title="Project Structure" icon="i-lucide-folder-tree" to="/docs/getting-started/project-structure"}
  Where everything lives and what each file does.
  ::

  ::card{title="Configuration" icon="i-lucide-sliders-horizontal" to="/docs/getting-started/configuration"}
  Site config, navigation, app config, environment variables.
  ::
::
