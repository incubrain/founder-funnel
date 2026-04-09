---
title: Marathi OCR Benchmarks — Incubrain
description: Independent benchmark results comparing Incubrain's Marathi OCR model against PaddleOCR, EasyOCR, and Tesseract on real document line images.
hero: false
navigation: true
---

::section-benefits
---
title: Benchmark Results
headline: Best-in-Class Marathi OCR
description: >
  Independently benchmarked on 2,500 real Marathi document line images.
  Our purpose-built model outperforms every major open-source OCR system
  across accuracy, word recognition, exact line matching, and speed.
items:
  - id: cer
    title: "6.23% Character Error Rate"
    icon: i-lucide-target
    description: >
      Lowest error rate of any tested system on the MarathiLine benchmark.
      PaddleOCR scores 8.34% — over 33% more errors per character.
  - id: wer
    title: "21.91% Word Error Rate"
    icon: i-lucide-text-cursor
    description: >
      Half the word error rate of PaddleOCR (44.69%) because our model
      correctly predicts word boundaries — something competitors cannot do.
  - id: exact
    title: "35.8% Exact Line Match"
    icon: i-lucide-check-check
    description: >
      5x higher exact match rate than any competitor (PaddleOCR 7.4%, EasyOCR 5.6%).
      Over a third of all lines are recognised perfectly.
  - id: speed
    title: "124.5 Lines Per Second"
    icon: i-lucide-zap
    description: >
      13–20x faster than every competitor. Enables processing
      of large government document archives in hours, not weeks.
---
::

::section-benchmark
---
title: How We Compare
headline: MarathiLine 2.5K Benchmark
description: >
  All models tested on the same 2,500-line dataset of real Marathi text —
  balanced across clean printed, degraded, synthetic multi-font, and mixed real sources.
  Same hardware, same preprocessing, character-level and word-level evaluation.
metrics:
  - label: Character Error Rate (CER)
    hint: Lower is better — percentage of incorrectly recognised characters
    lowerIsBetter: true
    key: cer
  - label: Word Error Rate (WER)
    hint: Lower is better — percentage of incorrectly recognised words
    lowerIsBetter: true
    key: wer
  - label: Exact Line Match
    hint: Higher is better — percentage of lines recognised perfectly
    key: exactMatch
  - label: Throughput (lines/second)
    hint: Higher is better — processing speed on the same hardware
    key: throughput
models:
  - name: Incubrain
    cer: 6.23
    wer: 21.91
    exactMatch: 35.8
    throughput: 124.5
    isOurs: true
  - name: PaddleOCR
    cer: 8.34
    wer: 44.69
    exactMatch: 7.4
    throughput: 6.2
  - name: EasyOCR
    cer: 15.31
    wer: 52.75
    exactMatch: 5.6
    throughput: 9.5
  - name: Tesseract
    cer: 16.72
    wer: 48.75
    exactMatch: 5.6
    throughput: 7.7
---
::

::section-process
---
title: Methodology
description: >
  How the MarathiLine benchmark works — designed to be a robust,
  independently verifiable Marathi text recognition benchmark.
items:
  - title: Dataset — MarathiLine 2.5K
    description: >
      2,500 line images sampled from real scanned documents — clean printed,
      degraded archival material, synthetic multi-font, and mixed real sources.
      Balanced across difficulty levels.
    icon: i-lucide-database
  - title: Controlled Conditions
    description: >
      All models run on identical hardware with the same image preprocessing.
      No cherry-picking — every line in the dataset is evaluated.
    icon: i-lucide-settings
  - title: Four Evaluation Metrics
    description: >
      Character Error Rate, Word Error Rate, Exact Line Match, and Throughput.
      Industry-standard metrics computed using standard edit distance
      at both character and word levels.
    icon: i-lucide-ruler
  - title: Reproducibility
    description: >
      Dataset, evaluation scripts, and model weights will be published
      openly. Any researcher or institution can independently verify results.
    icon: i-lucide-git-branch
---
::

::section-ecosystem
---
title: Coming Soon
headline: Open Source
description: >
  Our model, benchmark dataset, and evaluation tools will be published openly —
  enabling independent verification and further research.
items:
  - id: huggingface
    name: Model on Hugging Face
    description: Pre-trained Marathi OCR model weights — download, fine-tune, or deploy. Coming soon.
    icon: i-lucide-box
  - id: benchmark-data
    name: MarathiLine Benchmark
    description: The full 2,500-line evaluation dataset with ground truth — for independent verification. Coming soon.
    icon: i-lucide-bar-chart-3
  - id: pipeline
    name: Review Pipeline
    description: See how documents flow from raw scans to verified, AI-ready text through our quality control system.
    icon: i-lucide-workflow
    to: /products/document-review-pipeline
---
::
