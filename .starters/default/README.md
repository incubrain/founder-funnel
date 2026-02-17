# Foundry Starter

Minimal starter template for [Foundry](https://github.com/incubrain/foundry) — validate your product idea before building it.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Site runs at `http://localhost:3000`.

## What's Included

```
content/
├── config/
│   ├── navigation.yml    Header/footer navigation links
│   └── site.yml          Business name, socials, mission statement
├── faq/                  FAQ entries (YAML) — shown in ::section-faq
├── pages/
│   ├── index.md          Landing page (progressive validation stages)
│   ├── about.md          About page
│   ├── offers/           Offer detail pages (mentorship, products, etc.)
│   └── success/          Post-conversion confirmation pages
└── team/
    └── founder.yml       Team member profiles

app/
├── app.config.ts         App config (title, logo, collections, routing)
├── assets/
│   └── theme.css         Brand colors (oklch) — change hue to rebrand
└── components/
    └── section/
        ├── Hero.vue      Custom hero section (override the layer default)
        ├── HeroBadge.vue Badge sub-component
        └── HeroCta.vue   CTA sub-component

nuxt.config.ts            Route rules, site metadata, modules
content.config.ts         Content collection definitions + schemas
server/plugins/
└── evlog-drain.ts        Logging drain (Sentry/Axiom/PostHog — uncomment to enable)
public/                   Favicons and static assets
.env.example              All available environment variables
```

## Configuration Checklist

After scaffolding, update these files with your project details:

- [ ] `.env` — Copy from `.env.example`, set `NUXT_PUBLIC_SITE_URL`
- [ ] `nuxt.config.ts` — Replace `Your Product` with your product name and URL
- [ ] `app/app.config.ts` — Set title, description, logo paths
- [ ] `content/config/site.yml` — Business name, legal name, socials
- [ ] `content/config/navigation.yml` — Header/footer links
- [ ] `content/pages/index.md` — Landing page content (hero, benefits, offer)
- [ ] `content/team/founder.yml` — Your name, bio, and social links
- [ ] `app/assets/theme.css` — Change the hue value (e.g. 250 -> 30) to rebrand
- [ ] `public/` — Replace favicon files with your logo

## Content Editing

All content lives in `content/` as YAML and Markdown. Edit content files — not code.

**Landing page sections** are defined in `content/pages/index.md` using MDC syntax:
- `::section-hero` — Value prop + primary CTA
- `::section-benefits` — Why your solution matters
- `::section-outcome` — How it works, step by step
- `::section-offer` — What they get when they convert
- `::section-results` — Testimonials and social proof
- `::section-faq` — Address objections (pulls from `content/faq/`)

## Theme

Override brand colors in `app/assets/theme.css`. Uses [oklch](https://oklch.com) for perceptual uniformity — change the last value (hue) to shift the entire palette.

## Production

```bash
npm run build
npm run preview
```

## Links

- [Foundry](https://github.com/incubrain/foundry)
- [Nuxt](https://nuxt.com)
- [Nuxt Content](https://content.nuxt.com)
- [Nuxt Studio](https://nuxt.studio)
