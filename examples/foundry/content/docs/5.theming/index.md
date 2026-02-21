---
label: Theming
title: Theming Overview
description: How Foundry's theming system works with Tailwind v4, Nuxt UI, and oklch colors.
---

Foundry's theming system is built on [Nuxt UI v3](https://ui.nuxt.com){target="_blank"} — a fully-typed component library with accessible primitives, Tailwind CSS v4 theming, and dark mode support out of the box. All of Nuxt UI's components and composables are available in your Foundry project.

For detailed theming customization, see the [Nuxt UI Theming Guide](https://ui.nuxt.com/getting-started/theme){target="_blank"}.

## Stack

Foundry's visual layer is built on:

- [Tailwind CSS v4](https://tailwindcss.com/docs){target="_blank"} — Utility-first CSS with CSS-first configuration
- [Nuxt UI v3](https://ui.nuxt.com){target="_blank"} — Component library built on Tailwind
- [oklch](https://oklch.com){target="_blank"} — Perceptually uniform color space

## How CSS Works

The layer's CSS module (`modules/css.ts`) generates a virtual CSS file at build time that:

1. Imports Tailwind CSS v4
2. Imports Nuxt UI's styles
3. Registers content source paths for Tailwind class scanning

Your app's `theme.css` is loaded on top, overriding the layer's defaults. The layer also includes a `main.css` with page/layout transitions and base prose styles.

## Color System

Foundry uses the standard [Nuxt UI color system](https://ui.nuxt.com/getting-started/theme#colors){target="_blank"} with semantic color tokens. The primary colors are configured via oklch values in `theme.css` and automatically generate light/dark mode variants.

For full details on available colors and customization options, see the [Nuxt UI Color Documentation](https://ui.nuxt.com/getting-started/theme#colors){target="_blank"}.

## Quick Rebrand

To change your entire brand identity:

1. Open `app/assets/theme.css`
2. Change the hue value (the last number in oklch)
3. Save — everything updates

See [Colors](/docs/theming/colors) for details.

::card-group
  ::card{title="Colors" icon="i-lucide-paintbrush" to="/docs/theming/colors"}
  Change your brand in one line with oklch hue shifting.
  ::

  ::card{title="Layouts" icon="i-lucide-layout-template" to="/docs/theming/layouts"}
  Landing, default, article, and docs layouts.
  ::

  ::card{title="Components" icon="i-lucide-component" to="/docs/theming/components"}
  Override layer components and create custom sections.
  ::
::
