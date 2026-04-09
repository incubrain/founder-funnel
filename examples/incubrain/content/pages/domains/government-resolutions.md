---
title: Government Resolutions — Incubrain
description: Digitizing Maharashtra's 200,000+ Government Resolutions through AI-powered OCR with human-verified quality control.
hero: false
navigation: true
---

::section-hero
---
badge:
  label: Active Domain
  description: First Pipeline
  icon: i-lucide-landmark
cta:
  primary:
    label: Review Pipeline
    to: /products/document-review-pipeline
    icon: i-lucide-workflow
  secondary:
    label: Review Pipeline
    to: /products/document-review-pipeline
    icon: i-lucide-workflow
intro:
  title: 200,000 Government Resolutions.
  highlight: One Unified Pipeline.
  description: >
    Whether scanned on paper, trapped in legacy font encodings, or natively
    digital — all of Maharashtra's GRs currently sit inaccessible. This project
    processes the entire corpus into a single searchable database.
media:
  src: https://placehold.co/600x400/1a1a2e/e0e0e0?text=GR+Document+Pipeline
  alt: Government Resolution digitization pipeline
metric:
  icon: i-lucide-file-text
  label: Government Resolutions
  value: 200,000+
  delta: to process
pattern:
  name: paithani-classic
  opacity: 0.15
---
::

::section-benefits
---
title: The GR Challenge
headline: Three Eras, One Pipeline
description: >
  Maharashtra's GR archive spans decades of technology transitions.
  Every document type requires a different approach — but the pipeline handles them all.
items:
  - id: scanned
    title: "Pre-2010: Scanned Paper"
    icon: i-lucide-file-scan
    description: >
      The bulk of the historical archive exists only as scanned images.
      Full OCR is required. Generic tools produce 8-17% error rates on Marathi.
  - id: legacy
    title: "2005-2015: Legacy Font Trap"
    icon: i-lucide-file-warning
    description: >
      PDFs look like Devanagari but use proprietary ASCII mappings — Shree Dev,
      Kruti Dev, Shusha. Text extraction produces garbled English characters.
  - id: digital
    title: "Post-2015: Digital but Inaccessible"
    icon: i-lucide-file-text
    description: >
      Natively typed in Unicode, text is extractable — but no GR is searchable,
      indexed, or cross-referenced. Structuring still required.
  - id: mixed
    title: "Mixed Encoding Everywhere"
    icon: i-lucide-layers
    description: >
      Single PDFs commonly contain Unicode headers, legacy-font bodies, and
      image-based tables. No clean cutoff exists.
---
::

::section-document-showcase
---
title: See It In Action
description: >
  Documents from different eras, departments, and formats — all processed through the same pipeline.
samples:
  - id: modern-agriculture
    label: Agriculture Dept (2024)
    era: Post-2015 — Native Unicode digital
    image: https://placehold.co/400x600/f5f5f4/78716c?text=कृषी+विभाग+GR+2024
    text: |
      महाराष्ट्र शासन निर्णय
      कृषी, पशुसंवर्धन, दुग्ध व्यवसाय विकास व मत्स्यव्यवसाय विभाग

      क्रमांक: संकीर्ण-२०२४/प्र.क्र.१२३/२४
      दिनांक: १५ मार्च २०२४

      विषय: कृषी विभागाच्या योजनांचे अंमलबजावणी
      मार्गदर्शक तत्त्वे सुधारित करण्याबाबत.

      प्रस्तावना: राज्यातील शेतकऱ्यांना विविध कृषी
      योजनांचा लाभ मिळावा यासाठी...
  - id: legacy-revenue
    label: Revenue Dept (2010)
    era: 2005-2015 — Legacy font encoded (Shree Dev)
    image: https://placehold.co/400x600/f5f5f4/78716c?text=महसूल+विभाग+GR+2010
    text: |
      महाराष्ट्र शासन
      महसूल व वन विभाग

      शासन निर्णय क्रमांक: जमीन-२०१०/प्र.क्र.४५/ज-१
      दिनांक: २२ जुलै २०१०

      विषय: जमीन महसूल अधिनियमांतर्गत
      सुधारणा करण्याबाबत.

      शासन निर्णय: सदर प्रकरणी विचारान्ती
      खालीलप्रमाणे निर्णय घेण्यात येतो...
  - id: scanned-education
    label: Education Dept (1998)
    era: Pre-2010 — Scanned paper document
    image: https://placehold.co/400x600/f5f5f4/78716c?text=शिक्षण+विभाग+GR+1998
    text: |
      महाराष्ट्र शासन
      शालेय शिक्षण व क्रीडा विभाग

      शासन निर्णय क्रमांक: शिक्षण-९८/प्र.क्र.७८/९८
      दिनांक: ०५ ऑगस्ट १९९८

      विषय: प्राथमिक शिक्षणाच्या सार्वत्रिकीकरणाबाबत
      राज्यस्तरीय धोरण निश्चित करणे.

      उपरोक्त विषयाच्या अनुषंगाने शासनाने
      विचारविनिमय करून निर्णय घेतला...
  - id: mixed-urban
    label: Urban Dev (2012)
    era: Mixed encoding — Unicode headers, legacy body
    image: https://placehold.co/400x600/f5f5f4/78716c?text=नगर+विकास+GR+2012
    text: |
      महाराष्ट्र शासन
      नगर विकास विभाग

      शासन निर्णय क्रमांक: नवि-२०१२/प्र.क्र.२३४/नवि-३३
      दिनांक: १८ नोव्हेंबर २०१२

      विषय: महानगरपालिका क्षेत्रातील
      विकास नियंत्रण नियमावलीत सुधारणा.

      सदर शासन निर्णयान्वये महाराष्ट्र प्रादेशिक
      नियोजन व नगर रचना अधिनियमात बदल...
---
::

::section-process
---
title: The GR Pipeline
description: >
  Four stages from scanned government document to verified, searchable data.
items:
  - title: Ingest
    description: >
      GR documents retrieved from state repositories. The pipeline identifies
      each document type — scanned paper, legacy-encoded PDF, or native Unicode —
      and routes it to the appropriate processing path.
    icon: i-lucide-scan-line
  - title: Recognise
    description: >
      Scanned and legacy-encoded documents processed by a custom OCR model
      trained on 600,000+ Marathi samples. Native Unicode text extracted directly.
      All output normalised to standard Devanagari.
    icon: i-lucide-languages
  - title: Review
    description: >
      Four OCR models vote independently. Where three agree, output is
      auto-verified. The rest goes to trained Marathi-fluent reviewers.
      This approach is validated by Orgpedia, who OCR all 50,000+ Maharashtra
      GRs because text extraction alone is too unreliable.
    icon: i-lucide-check-circle-2
  - title: Publish
    description: >
      Verified text structured with entity extraction, department tagging,
      date indexing, and cross-referencing. The complete corpus becomes
      a single searchable database. All outputs are open source.
    icon: i-lucide-globe-2
---
::

::section-metrics
---
title: GR Pipeline Results
description: >
  Independently benchmarked on real Marathi document line images.
items:
  - id: accuracy
    value: 6.23%
    label: Character Error Rate
    detail: Lowest of any system — PaddleOCR 8.34%, Tesseract 16.72%
    icon: i-lucide-target
  - id: match
    value: 35.8%
    label: Exact Line Match
    detail: 5x higher than the nearest competitor
    icon: i-lucide-check-check
  - id: speed
    value: 124.5
    label: Lines Per Second
    detail: 13-20x faster than every competitor
    icon: i-lucide-zap
  - id: jobs
    value: 100
    label: Part-Time Jobs Created
    detail: Marathi-fluent data labellers across Maharashtra
    icon: i-lucide-users
---
::

::section-closing-cta
---
title: Maharashtra's GR archive
highlight: searchable for the first time.
description: >
  200,000 Government Resolutions processed through a unified pipeline,
  delivered as a single open-source searchable database.
cta:
  label: Explore the Review Pipeline
  to: /products/document-review-pipeline
  icon: i-lucide-arrow-right
pattern:
  name: paithani-classic
  opacity: 0.12
---
::
