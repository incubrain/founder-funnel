---
title: Review Pipeline — Incubrain
description: How documents flow from raw scans to verified, AI-ready Marathi text through Incubrain's quality control pipeline.
hero: false
navigation: true
---

::section-hero
---
badge:
  label: Quality Control
  description: End-to-End Pipeline
  icon: i-lucide-workflow
cta:
  primary:
    label: Government Resolutions
    to: /domains/government-resolutions
    icon: i-lucide-landmark
intro:
  title: From Raw Scan
  highlight: To AI-Ready Text.
  description: >
    Every document passes through a five-stage pipeline — from ingestion
    through multi-model OCR, human-verified quality control, and back into
    the system to improve the model. No shortcuts. No unverified data.
media:
  src: https://placehold.co/600x400/1a1a2e/e0e0e0?text=Pipeline+Overview
  alt: Incubrain review pipeline overview
metric:
  icon: i-lucide-check-circle
  label: Quality Standard
  value: 3/4
  delta: consensus required
pattern:
  name: paithani-classic
  opacity: 0.3
watermark: गुणवत्ता
---
::

::section-pipeline
---
title: The Pipeline
description: >
  Five stages from raw document to verified training data. Each stage
  adds quality — and the output feeds back to improve the input.
stages:
  - step: 1
    title: Document Ingestion
    icon: i-lucide-download
    description: >
      Raw documents — scanned PDFs, archival images, government repository pages —
      are programmatically retrieved and prepared for processing. Each page is
      catalogued with source metadata for full traceability.
    detail: >
      For the GR pilot: 200,000+ Government Resolutions from Maharashtra's
      public repositories, automatically downloaded and queued.
    visual:
      src: https://placehold.co/800x200/f5f5f5/333?text=Raw+Scanned+GR+Document
      alt: Raw scanned Government Resolution

  - step: 2
    title: Page Segmentation & Line Extraction
    icon: i-lucide-scan
    description: >
      Each page is segmented into individual text lines using shirorekha-aware
      detection — a technique designed specifically for Devanagari script, which
      uses the headline (shirorekha) connecting characters as a natural boundary.
    detail: >
      Our segmentation pipeline extracts 744,000 word images from 10 books in
      25 minutes. Line-level extraction preserves word order and spacing for
      accurate downstream recognition.
    visual:
      src: https://placehold.co/800x200/f5f5f5/333?text=Segmented+Lines+Highlighted
      alt: Document with extracted text lines highlighted

  - step: 3
    title: Multi-Model OCR
    icon: i-lucide-languages
    description: >
      Each extracted line is processed by four independent OCR models simultaneously:
      our purpose-built Marathi model, Tesseract, EasyOCR, and PaddleOCR. This
      creates a committee of predictions for every line of text.
    detail: >
      Our model (6.23% CER) leads the committee, but all four models contribute.
      When three or more models agree on the same output, the text is automatically
      promoted — no human review needed.

  - step: 4
    title: Consensus & Human Review
    icon: i-lucide-users
    description: >
      Lines where models disagree are routed to trained, Marathi-fluent
      human reviewers via a purpose-built mobile-friendly review application.
      Each line requires consensus from three independent reviewers before
      final acceptance.
    detail: >
      Reviewers can accept, correct, skip, or flag each line. A Devanagari
      virtual keyboard enables precise corrections. Reviewer performance is
      tracked — underperforming reviewers are replaced. Target: 1,000 images
      per reviewer per day.
    visual:
      src: https://placehold.co/800x300/1a1a2e/e0e0e0?text=Review+App+Interface
      alt: Incubrain review application interface

  - step: 5
    title: Feedback Loop
    icon: i-lucide-refresh-cw
    description: >
      Every human correction feeds directly back into the training pipeline.
      The model improves with each batch of reviewed data — creating a
      virtuous cycle where more data produces a better model, which produces
      higher-quality initial predictions, which reduces the volume of human
      review needed.
    detail: >
      Impact measured: adding 11,000 consensus-labeled samples improved CER
      from 9.72% to 6.28% on unseen data — a 35% reduction in errors from
      data quality alone. This is why the pipeline exists.
---
::

::section-metrics
---
title: Pipeline Performance
description: >
  Key metrics from the current pipeline deployment.
items:
  - id: consensus-rate
    value: 22%
    label: Auto-Promoted
    detail: Lines where 3/4 models agree — no human review needed
    icon: i-lucide-check-circle
  - id: throughput
    value: 1,000
    label: Reviews Per Day
    detail: Target throughput per trained Marathi-fluent reviewer
    icon: i-lucide-clock
  - id: improvement
    value: 35%
    label: Error Reduction
    detail: CER improvement from adding human-verified data alone
    icon: i-lucide-trending-down
  - id: jobs
    value: 100
    label: Part-Time Positions
    detail: Marathi-fluent data labellers for the GR pilot
    icon: i-lucide-users
---
::

::section-quote
---
quote: Data quality is the single biggest lever for OCR accuracy. Verified, human-reviewed training data reduced our character error rate by 35% — the same principle applies to every downstream AI application that consumes this data.
author: Incubrain Technical Report, 2026
---
::
