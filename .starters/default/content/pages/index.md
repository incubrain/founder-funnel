---
title: Your Product Name
description: One-sentence value proposition. What do you do for whom?
---

<!--
MINIMAL WIREFRAME

Foundry ships structure and signal, not an opinionated design system. This page
starts (and stays) at the minimal set below — add your own sections for
persuasive copy, "how it works," FAQ, or testimonials if you want them. That's
taste, and AI makes design cheap, so it isn't shipped for you.

- Hero: Value prop + primary CTA
- Offer: What you're selling + conversion
-->

::section-hero
---
badge:
  label: Open Source
  description: MIT Licensed
  to: https://github.com/yourusername/your-repo
  icon: i-simple-icons-github
intro:
  # Answer: What problem do you solve? For whom?
  # Example: "Ship Validated Products" not "Revolutionary Platform"
  title: Your Outcome-Focused Headline

  # What transformation do they get?
  # Example: "Start Validating" or "Launch Faster"
  highlight: Your Key Benefit

  # One sentence. What do they get? Why does it matter?
  description: >
    The core value proposition that makes someone care. Keep it under 25 words.
cta:
  primary:
    label: Get Started
    to: /offers/your-offer
media:
  src: /product/hero-screenshot.png
  alt: Screenshot showing your product's main value
---
::

::section-offer
---
title: What You're Offering
description: The thing they get when they convert. Be specific about deliverables.
price: Free
cta:
  label: Get Started
  to: '#'
features:
  - title: Specific deliverable 1
    icon: statusAvailable

  - title: Specific deliverable 2
    icon: statusAvailable

  - title: Specific deliverable 3
    icon: statusAvailable

  - title: Future deliverable (coming soon)
    icon: statusBeta
---
::
