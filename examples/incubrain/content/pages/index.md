---
title: Incubrain — Purpose-Built Marathi AI Infrastructure
description: AI-powered OCR pipeline and quality control for digitizing Maharashtra's 200,000+ Government Resolutions. Best-in-class Marathi text recognition.
hero: true
navigation: false
---

::section-hero
---
badge:
  label: Maharashtra
  description: AI Data Infrastructure
  icon: i-lucide-landmark
cta:
  primary:
    label: View Benchmarks
    to: /benchmarks
    icon: i-lucide-bar-chart-3
  secondary:
    label: Review Pipeline
    to: /pipeline
    icon: i-lucide-workflow
intro:
  title: Maharashtra Leads India
  highlight: In AI-Ready Marathi Data.
  description: >
    Purpose-built OCR pipeline turning 200,000+ unreadable Government
    Resolutions into machine-readable, AI-training-ready Marathi text —
    with human-verified quality control at every step.
media:
  src: https://placehold.co/600x400/1a1a2e/e0e0e0?text=GR+Document+→+AI+Text
  alt: Government Resolution being digitized by Incubrain OCR
metric:
  icon: i-lucide-file-text
  label: Government Resolutions
  value: 200,000+
  delta: to digitize
trusted:
  text: Built for India's sovereign AI ecosystem
  icons:
    - i-lucide-shield-check
    - i-lucide-languages
    - i-lucide-database
    - i-lucide-brain
pattern:
  name: paithani-classic
  opacity: 0.3
watermark: मराठी
---
::

::section-pillars
---
title: Why Incubrain
description: >
  National AI efforts treat Marathi as one language among many.
  We treat it as the only one that matters.
items:
  - id: purpose-built
    title: Purpose-Built for Marathi
    description: >
      Not a general-purpose tool adapted for Devanagari — a model designed
      from the ground up for shirorekha, matras, and conjunct characters.
      6.23% CER vs 16.72% for generic OCR.
    icon: i-lucide-target
  - id: quality-first
    title: Human-Verified Quality
    description: >
      Every output passes through AI-assisted quality control and trained
      Marathi-fluent reviewers. No unverified data enters the pipeline.
      Creating 100 part-time jobs in the process.
    icon: i-lucide-shield-check
  - id: open-source
    title: Open Source, State-Owned
    description: >
      All models, datasets, and benchmarks are published openly.
      Maharashtra retains full ownership. No vendor lock-in,
      no recurring licence fees.
    icon: i-lucide-unlock
---
::

::section-benefits
---
title: The Problem
headline: 200,000+ GRs Are Invisible to AI
description: >
  Maharashtra's Government Resolutions are the backbone of state governance —
  but they exist only as scanned images. No search. No indexing. No AI can read them.
items:
  - id: unreadable
    title: Not Machine-Readable
    icon: i-lucide-file-x
    description: >
      Over 200,000 GRs sit in public repositories as scanned images.
      Citizens and officials cannot search, cross-reference, or analyse them.
  - id: tools-fail
    title: Existing OCR Fails on Marathi
    icon: i-lucide-alert-triangle
    description: >
      General-purpose OCR tools produce 8–17% character error rates on Marathi text.
      Devanagari's shirorekha, matras, and conjuncts break them.
  - id: bottleneck
    title: Quality Data Is the Bottleneck
    icon: i-lucide-lock
    description: >
      India's sovereign AI platforms — and global leaders like OpenAI and Google —
      have publicly stated that quality Indic data is what's holding back their models.
  - id: no-pipeline
    title: No Quality Control Pipeline
    icon: i-lucide-x-circle
    description: >
      Raw OCR output without human verification is unusable for AI training.
      There is no systematic pipeline to validate Marathi text at scale.
---
::

::section-process
---
title: The Pipeline
description: >
  Four stages from scanned image to verified, published data —
  designed specifically for Devanagari script and Marathi linguistic structure.
items:
  - title: Extract
    description: >
      Documents are programmatically retrieved and segmented into lines using
      shirorekha-aware detection. Metadata — department, date, subject — is
      extracted automatically.
    icon: i-lucide-scan
  - title: Recognise
    description: >
      A custom OCR model trained on 600,000+ Marathi samples processes each line.
      Built for Devanagari's unique features: shirorekha, matras, and conjunct characters.
    icon: i-lucide-languages
  - title: Review
    description: >
      AI-assisted quality control with a 4-model consensus committee.
      Where models agree, output is auto-verified. The rest goes to trained
      Marathi-fluent reviewers via a purpose-built review application.
    icon: i-lucide-check-circle
  - title: Publish
    description: >
      Verified text is structured into a searchable database with entity extraction,
      department tagging, and cross-referencing. All outputs are open source.
    icon: i-lucide-globe
---
::

::section-demo
---
title: See It In Action
description: >
  Scanned government documents go in. Machine-readable, verified Marathi text comes out.
input:
  src: https://placehold.co/500x350/f5f5f5/333333?text=Scanned+GR+Page
  alt: Scanned Government Resolution document
  caption: Original scanned GR document (image only, not searchable)
output:
  text: |
    महाराष्ट्र शासन निर्णय
    क्रमांक: संकीर्ण-२०२४/प्र.क्र.१२३/२४
    दिनांक: १५ मार्च २०२४

    विषय: कृषी विभागाच्या योजनांचे
    अंमलबजावणी मार्गदर्शक तत्त्वे...
  caption: Extracted and verified Marathi text (searchable, indexable, AI-ready)
reviewApp:
  src: https://placehold.co/900x400/1a1a2e/e0e0e0?text=Review+App+Demo+GIF
  alt: Incubrain AI-assisted review platform
  caption: >
    AI-assisted review platform — multiple OCR models pre-verify output,
    human reviewers confirm via mobile-friendly interface at 1,000 images per day.
---
::

::section-metrics
---
title: Results That Matter
description: >
  Independently benchmarked on 2,500 real Marathi document line images
  against every major open-source OCR system.
pattern:
  name: asawali-lotus
  opacity: 0.12
items:
  - id: accuracy
    value: 6.23%
    label: Character Error Rate
    detail: Lowest of any system — PaddleOCR scores 8.34%, Tesseract 16.72%
    icon: i-lucide-target
  - id: word-accuracy
    value: 5x
    label: Better Line Matching
    detail: 35.8% exact match vs 7.4% for the nearest competitor
    icon: i-lucide-check-check
  - id: speed
    value: 20x
    label: Faster Processing
    detail: 124.5 lines/sec vs 6–10 for alternatives
    icon: i-lucide-zap
  - id: data
    value: 600K+
    label: Training Samples
    detail: Real book scans, verified datasets, and synthetic data
    icon: i-lucide-database
---
::

::section-ecosystem
---
title: Who Needs This Data
headline: Quality Indic Data Is the Universal Bottleneck
description: >
  At the 2025 Delhi AI Summit, global and national AI leaders identified
  quality training data as the single biggest barrier to Indic language AI.
  Incubrain builds the pipeline that produces it.
items:
  - id: sarvam
    name: Sarvam AI
    description: India's sovereign AI platform — needs high-quality Marathi text for foundation model training.
    icon: i-lucide-brain
    to: https://sarvam.ai
  - id: bhashini
    name: Bhashini
    description: Government of India's national language translation platform — depends on quality Indic data.
    icon: i-lucide-languages
    to: https://bhashini.gov.in
  - id: ai4bharat
    name: AI4Bharat
    description: IIT Madras research lab building open-source Indic AI models — needs verified training corpora.
    icon: i-lucide-graduation-cap
  - id: openai
    name: OpenAI (ChatGPT)
    description: Acknowledged quality Indic data as a bottleneck for multilingual model performance.
    icon: i-lucide-message-square
  - id: google
    name: Google (Gemini)
    description: Investing heavily in Indic languages but dependent on quality training data from local sources.
    icon: i-lucide-search
---
::

::section-roadmap
---
title: What Comes After
description: >
  The GR digitisation pilot establishes a proven pipeline that scales
  to any Marathi document corpus. Every application compounds the return.
pattern:
  name: warli
  opacity: 0.1
items:
  - title: Government Resolutions
    description: 200,000+ GRs — the pilot that proves the pipeline.
    icon: i-lucide-landmark
    status: active
  - title: Court & Revenue Records
    description: Land registries, court documents, inter-departmental records.
    icon: i-lucide-scale
    status: upcoming
  - title: Historical Manuscripts
    description: Maharashtra's 800+ years of literary heritage, many already scanned under Gyan Bharatam Mission.
    icon: i-lucide-book-open
    status: future
  - title: Newspapers & Periodicals
    description: Historical Marathi newspapers, magazines, and academic journals.
    icon: i-lucide-newspaper
    status: future
---
::

::section-closing-cta
---
title: Build Maharashtra's AI Future
highlight: With Sovereign Marathi Data.
description: >
  The next generation of Marathi AI starts with data that's accurate,
  verified, and owned by the state. We're building it.
cta:
  label: View Benchmarks
  to: /benchmarks
  icon: i-lucide-arrow-right
pattern:
  name: paithani-classic
  opacity: 0.15
---
::
