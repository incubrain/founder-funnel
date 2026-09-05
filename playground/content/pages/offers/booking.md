---
title: Book A Validation Call
description: Offer copy that ConvertInternal resolves from the pages collection.
navigation: false
hero: false
---

Regression fixture for product-validator-m0f.4. `ConvertInternal` looks this
document up by `offerSlug` and renders its `title`/`description` as the CTA
copy. That lookup must resolve during SSR — it previously ran with
`server: false`, so the rendered HTML carried only the generic "Learn More"
fallback and the real conversion copy existed nowhere a zero-JS crawler could
see it.
