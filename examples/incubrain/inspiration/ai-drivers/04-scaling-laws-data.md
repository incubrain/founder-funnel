# Scaling Laws & Data: A Key Driver of AI Progress

> Deep research into how scaling laws, data strategies, and compute allocation are shaping the trajectory of artificial intelligence (2025-2028).
>
> Last updated: March 2026

---

## Table of Contents

1. [Current State: Chinchilla and Beyond](#1-current-state-chinchilla-and-beyond)
2. [The Synthetic Data Revolution](#2-the-synthetic-data-revolution)
3. [Data Quality Over Quantity](#3-data-quality-over-quantity)
4. [New Data Sources and Modalities](#4-new-data-sources-and-modalities)
5. [Post-Training Scaling: The Inference-Time Revolution](#5-post-training-scaling-the-inference-time-revolution)
6. [Recent Innovations (2025-2026)](#6-recent-innovations-2025-2026)
7. [Future Directions (2026-2028)](#7-future-directions-2026-2028)
8. [The Compounding Effect](#8-the-compounding-effect)
9. [Key Takeaways](#9-key-takeaways)
10. [Sources](#sources)

---

## 1. Current State: Chinchilla and Beyond

### 1.1 The Chinchilla Foundation

The 2022 Chinchilla paper from DeepMind established the foundational scaling law for large language models: for compute-optimal training, model size and training tokens should be scaled equally. For every doubling of model size, the number of training tokens should also double. The 70B-parameter Chinchilla model, trained with 4x more data than the 280B-parameter Gopher on the same compute budget, demonstrated that prior models were severely undertrained relative to their size.

**The original Chinchilla ratio:** ~20 tokens per parameter for compute-optimal training.

Sources: [Chinchilla Paper (arxiv.org)](https://arxiv.org/abs/2203.15556), [Chinchilla Scaling Laws Explained (lifearchitect.ai)](https://lifearchitect.ai/chinchilla/)

### 1.2 Beyond Chinchilla: The Over-Training Era

By 2024-2025, the industry decisively moved beyond strict Chinchilla-optimal ratios. The reason is practical: Chinchilla-optimal models are too large for efficient inference. Training smaller models on far more data ("over-training") produces models that are cheaper to serve while maintaining strong performance.

**Key examples of over-training ratios:**

| Model | Parameters | Training Tokens | Tokens/Parameter Ratio |
|-------|-----------|----------------|----------------------|
| Chinchilla (2022) | 70B | 1.4T | 20:1 |
| Llama 1 (2023) | 7-65B | 1-1.4T | Up to 142:1 |
| Llama 3 (2024) | 8-70B | 15T | ~214:1 |
| Qwen3-0.6B (2025) | 0.6B | 36T | **60,000:1** |
| Llama 4 Scout (2025) | MoE (17B active) | 40T | ~2,350:1 (active) |

Qwen3-0.6B set a remarkable record in April 2025 with a tokens-to-parameters ratio of 60,000:1, trained on 36 trillion tokens. This demonstrates that extremely small models can achieve surprisingly strong performance when trained on vastly more data than Chinchilla prescribes.

Sources: [LLM Scaling in 2025 (jonvet.com)](https://www.jonvet.com/blog/llm-scaling-in-2025), [Qwen3 Technical Report (arxiv.org)](https://arxiv.org/abs/2505.09388), [Llama 4 Blog (ai.meta.com)](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)

### 1.3 Are We Hitting the Data Wall?

Epoch AI predicts that all high-quality textual data on the internet will be exhausted by approximately **2028**, with machine learning datasets potentially depleting "high-quality language data" as early as **2026**. This "data wall" is compounded by several factors:

- **Publisher restrictions:** MIT's Data Provenance Initiative documented a "dramatic drop in content made available" as publishers and platforms increasingly block AI scraping.
- **Cost escalation:** Average computing costs rose **89%** from 2023 to 2025, with training data acquisition cited as a key driver.
- **AI contamination of the web:** By April 2025, over **74%** of newly created webpages contained AI-generated text (based on a 900K-page survey). As of August 2025, **10.4%** of sources cited in Google's AI Overviews were themselves AI-generated.

However, not everyone agrees the wall is imminent. Stanford professor Fei-Fei Li argued in 2024 that there remains "a wealth of differentiated data waiting to be mined" for more customized models.

Sources: [Data Wall Challenge (news.aibase.com)](https://news.aibase.com/news/10757), [WEF on AI Training Data (weforum.org)](https://www.weforum.org/stories/2025/12/data-ai-training-synthetic/), [Data Exhaustion Crisis (zair.top)](https://www.zair.top/en/post/data-exhaustion-crisis/)

### 1.4 Extensions to Chinchilla

Recent research has extended the original framework in several directions:

- **Sparse pre-training with dynamic pruning:** Sparse and dense models achieve comparable final losses for a given compute budget, but sparse models are substantially smaller at inference time.
- **Architecture-aware scaling laws:** New work adjusts the Chinchilla law to include model shape factors (width/depth ratios), enabling co-optimization for both accuracy and inference speed. An ICLR 2026 paper introduced conditional scaling laws that augment the Chinchilla framework with architectural information.
- **Data density metrics:** Research introduces "density" as a measure of redundancy and diversity in training data. Higher-density (more redundant, less diverse) datasets lead to sub-scaling — diminishing returns from additional data.

Sources: [Scaling Laws Meet Model Architecture (arxiv.org)](https://arxiv.org/abs/2510.18245), [Revisiting Scaling Laws (ACL 2025)](https://aclanthology.org/2025.acl-long.1163.pdf), [Race to Efficiency (arxiv.org)](https://arxiv.org/html/2501.02156v3)

---

## 2. The Synthetic Data Revolution

### 2.1 The Scale of Synthetic Data Adoption

Synthetic data — AI-generated training data for AI — has become a central strategy for overcoming data limitations. The synthetic data generation market is projected to reach **$3.5 billion by 2026**. By 2025, several major model releases used extensive synthetic datasets during pre-training, including Minimax, Trinity, K2/K2.5, Nemotron-3, and GPT-OSS.

By early 2026, a reusable ecosystem of synthetic datasets has emerged: Nemotron-Synth, SYNTH, and Toucan (IBM) represent purpose-built synthetic data resources available for the research community.

Sources: [Synthetic Pretraining (vintagedata.org)](https://vintagedata.org/blog/posts/synthetic-pretraining), [AI Training in 2026 (invisibletech.ai)](https://invisibletech.ai/blog/ai-training-in-2026-anchoring-synthetic-data-in-human-truth), [Future of Synthetic Dataset Generation (business20channel.tv)](https://business20channel.tv/future-ai-synthetic-dataset-generation-llms-rag-model-distillation-2026-16-december-2025)

### 2.2 Microsoft SynthLLM: Breaking the Data Wall

Microsoft Research Asia's **SynthLLM** framework represents a landmark in synthetic data research. Key findings:

- SynthLLM transforms pre-training corpora into diverse, high-quality synthetic datasets by automatically extracting and recombining high-level concepts across multiple documents using a graph algorithm.
- **Scaling laws hold for synthetic data:** After extensive testing, the team confirmed that synthetic data follows the same scaling laws as natural data, enabling predictable performance gains.
- **Saturation point at 300 billion tokens:** Performance levels off at ~300B synthetic tokens; beyond this, additional synthetic data brings diminishing returns.
- SynthLLM produces consistent performance gains across different model sizes, making it easier to optimize training strategies.

Microsoft applied this methodology successfully to its **Phi-3 family** of small language models, creating highly capable models with significantly less training data.

Sources: [SynthLLM (microsoft.com)](https://www.microsoft.com/en-us/research/articles/synthllm-breaking-the-ai-data-wall-with-scalable-synthetic-data/), [Overcoming the Data Wall (windowsforum.com)](https://windowsforum.com/threads/overcoming-the-data-wall-how-synthetic-data-and-synthllm-accelerate-ai-progress.372627/)

### 2.3 Distillation: Large Models Teaching Small Models

Model distillation — using outputs from large, capable models to train smaller, more efficient ones — has become a dominant training paradigm:

- **Google** adopted distillation with Gemini 1.5 Flash and Gemma 2, using larger Gemini models as teachers.
- **DeepSeek-3.2 "Speciale"** uses specialist distillation based on synthetic outputs from fine-tuned versions across mathematics, programming, and logical reasoning.
- **Anthropic's Claude 3 Haiku** is widely speculated to be a distilled version of Claude 3 Opus.

**The distillation controversy:** In a significant case, Anthropic revealed that three Chinese AI companies — DeepSeek, Moonshot, and MiniMax — used approximately 24,000 fake accounts to distill Claude through over 16 million interactions, violating terms of service. This highlighted both the power and the ethical/legal complexities of distillation.

Sources: [Distillation Attacks (anthropic.com)](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks), [Chinese AI Distillation (nbcnews.com)](https://www.nbcnews.com/world/asia/chinese-ai-companies-distilled-claude-improve-models-anthropic-says-rcna260386)

### 2.4 Self-Play and Self-Improvement

Self-play data generation — where models generate training data by competing against or critiquing themselves — is an increasingly important technique:

- **RLVR (Reinforcement Learning with Verifiable Rewards):** DeepSeek R1 scales GRPO with rule-based rewards for math, code, and logic. Rather than learning from human-labeled examples, the model gets direct binary feedback (correct/wrong) from deterministic verifiers.
- **Constitutional AI (Anthropic):** Instead of humans ranking outputs, an AI model judges outputs based on a written set of principles ("constitution"), creating a scalable reward signal without per-instance human labels.
- **RLAIF (RL from AI Feedback):** Google demonstrated that AI-generated feedback can match or exceed human feedback quality for alignment, enabling scalable post-training.

Sources: [RLVR Explained (promptfoo.dev)](https://www.promptfoo.dev/blog/rlvr-explained/), [RLAIF vs RLHF (arxiv.org)](https://arxiv.org/abs/2309.00267), [State of LLM Reasoning (sebastianraschka.com)](https://magazine.sebastianraschka.com/p/the-state-of-llm-reasoning-model-training)

### 2.5 The Model Collapse Risk

Training AI on AI-generated data carries a well-documented risk: **model collapse**. Published in Nature (2024), this research showed that generative models trained solely on predecessors' output produce increasingly inaccurate results, developing "irreversible defects."

**The mechanism:** Over successive generations, the system's view of reality narrows — rare details vanish, outputs become repetitive, and the model loses the variability that makes human-generated data rich. Different modes blur together until outputs no longer resemble real data.

**Key mitigation strategies (2025-2026):**

- **Accumulate, don't replace:** A 2024 study found that collapse occurs when you replace real data with synthetic data each generation, but when you accumulate synthetic data alongside original real data, models stay stable.
- **Data provenance:** Knowing where each training example originated — whether from a model or from humans — has become essential. Strong provenance tracking is no longer optional for serious AI programs.
- **Licensing real content:** Companies are actively licensing human-generated content to keep models grounded: Reddit with Google, News Corp with OpenAI, and others.
- **Human-in-the-loop anchoring:** The 2026 approach emphasizes anchoring synthetic data in "human truth" — using curated human data as a quality floor that synthetic data supplements but never replaces.

Sources: [Model Collapse (Nature)](https://www.nature.com/articles/s41586-024-07566-y), [Model Collapse Risk 2025 (winssolutions.org)](https://www.winssolutions.org/ai-model-collapse-2025-recursive-training/), [AI Training 2026 (invisibletech.ai)](https://invisibletech.ai/blog/ai-training-in-2026-anchoring-synthetic-data-in-human-truth)

---

## 3. Data Quality Over Quantity

### 3.1 The Phi Series: Textbook-Quality Data

Microsoft's Phi series of models has been the most prominent demonstration that data quality can substitute for data quantity and model scale:

- **Phi-1 (2023):** The "Textbooks Are All You Need" paper showed that a small model trained on high-quality, textbook-style data could outperform much larger models trained on web-scraped data.
- **Phi-4 Reasoning (2025):** The 14B-parameter model outperformed OpenAI's o1-mini and DeepSeek's 70B distilled model across most reasoning tasks, and approached the full DeepSeek-R1 (671B parameters) on challenging math (AIME) questions.

**Key to Phi-4's success:** The Microsoft team curated **1.4 million carefully chosen prompt-response pairs**, focusing on "teachable" examples at the edge of the model's abilities. The data covered STEM, coding, and safety domains. Despite its small size, Phi-4 delivered results that rivaled or exceeded models trained on orders of magnitude more data.

Sources: [Phi-4 Data-First Methodology (venturebeat.com)](https://venturebeat.com/ai/phi-4-proves-that-a-data-first-sft-methodology-is-the-new-differentiator), [Phi-1 Quality Over Quantity (medium.com)](https://medium.com/@verbytsky/quality-over-quantity-how-phi-1-outperforms-bigger-ai-models-70b12a9fbd56)

### 3.2 Curation Techniques

Modern data curation involves multiple layers of filtering and selection:

1. **Deduplication:** Perceptual hashing generates hash codes for text-image pairs, with CLIP models assessing semantic coherence of each duplicate group, retaining only the highest-scoring pairs.
2. **Quality scoring:** Systems like EcoDatum assign quality scores. Research shows that the **top 40% of samples** by quality score (after deduplication) provides the best balance between quality and quantity — roughly 3.5M samples from larger pools.
3. **LLM-based curation:** Using LLMs themselves to evaluate and filter training data has become standard. Microsoft's research shows this approach enables "data-efficient" training that can match much larger training runs.
4. **Difficulty-aware selection:** Selecting examples at the "edge of the model's abilities" — not too easy (no learning signal) and not too hard (noise) — maximizes learning efficiency.

Sources: [Quality Over Quantity (arxiv.org)](https://arxiv.org/html/2502.08211), [Quality-Guided Curation (microsoft.com)](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/11/2503.09205v4.pdf)

### 3.3 Qwen3: Massive Data With Quality

Qwen3 demonstrates that quality and quantity are not mutually exclusive when done right:

- Pre-trained on approximately **36 trillion tokens** covering 119 languages and dialects (nearly 2x Qwen2.5's 18T tokens).
- Three-stage training approach: 30T tokens for foundation, followed by targeted enhancement stages.
- Result: Qwen3 dense base models match Qwen2.5 base models with **2x the parameters**. Qwen3-1.7B matches Qwen2.5-3B; Qwen3-8B matches Qwen2.5-14B; Qwen3-32B matches Qwen2.5-72B.
- MoE variants achieve comparable performance to dense models with only **1/5 activated parameters**.

Sources: [Qwen3 Blog (qwenlm.github.io)](https://qwenlm.github.io/blog/qwen3/), [Qwen3 Technical Report (arxiv.org)](https://arxiv.org/html/2505.09388v1)

---

## 4. New Data Sources and Modalities

### 4.1 Code as Training Data

Code repositories have become a critical training data source, valued for their logical structure, formal reasoning patterns, and clear input-output relationships:

- **The Stack v2:** A 67.5TB dataset of source code in over 600 programming languages, yielding approximately **900 billion training tokens** — 10x larger than the original Stack (6.4TB, ~200B tokens). Built on Software Heritage's source code archive alongside GitHub pull requests, Kaggle notebooks, and code documentation.
- **StarCoder 2:** Models trained on 3.3-4.3 trillion tokens from The Stack v2, with careful deduplication, malicious code removal, decontamination, PII deletion, and opt-out compliance.
- **Impact on general reasoning:** Code-heavy training has been shown to improve mathematical and logical reasoning capabilities even in general-purpose models, which is why frontier models allocate significant portions of their training compute to code data.

Sources: [StarCoder 2 (arxiv.org)](https://arxiv.org/abs/2402.19173), [BigCode Project (huggingface.co)](https://huggingface.co/bigcode)

### 4.2 Video and Multimodal Data

Video understanding represents a massive new frontier for training data:

- **Sora (OpenAI):** Uses a transformer architecture operating on spacetime patches of video and image latent codes. Visual patches serve as tokens — a scalable representation for training on diverse video types. Sora 2 (December 2025) understands physics: predicting ball arcs, glass shattering, and fluid dynamics, trained on both real videos and physics engine simulations.
- **Gemini (Google):** Processes video's audio and visual frames simultaneously, sampling at one frame per second. Natively multimodal with context windows exceeding 1 million tokens. Gemini Ultra 2 (I/O 2026) promises near real-time, photorealistic video generation.
- **Training scale:** Llama 4's overall data mixture exceeded **30 trillion tokens** including diverse text, image, and video datasets — more than double Llama 3's pre-training mixture.

By end of 2026, experts predict AI will hit **95% accuracy** on standard video understanding tasks.

Sources: [Sora (openai.com)](https://openai.com/index/sora/), [Gemini Ultra 2 (aidailyshot.com)](https://aidailyshot.com/blog/google-gemini-ultra-2-ai-video-generation-2026), [Llama 4 (ai.meta.com)](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)

### 4.3 Embodied and Robotics Data

Physical-world data is emerging as a critical new modality:

- **GEN-0 (November 2025):** Generalist AI's embodied foundation model trained on the largest and most diverse real-world manipulation dataset ever built, spanning homes, bakeries, laundromats, warehouses, and factories.
- **Multimodal sensory datasets:** Novel datasets combining human tactile information, EMG signals, audio data, whole-body movement, and eye-tracking data — e.g., 680 segments (~11 hours) across seven modalities with 56,000 detailed annotations from kitchen tasks alone.
- **Video generation for robotics:** Video generation models produce diverse robot data capturing perception, reasoning, and action in the physical world. RBench provides a comprehensive robotics benchmark evaluating robot-oriented video generation across five task domains.
- **3D and multi-sensor integration:** Multimodal LLMs are integrating 3D data with touch, auditory, and thermal inputs, enhancing environmental comprehension and robotic decision-making.

Sources: [GEN-0 (generalistai.com)](https://generalistai.com/blog/nov-04-2025-GEN-0), [Embodied Multimodal Models Survey (sciencedirect.com)](https://www.sciencedirect.com/science/article/abs/pii/S2566253525002714), [Video for Robotics (arxiv.org)](https://arxiv.org/html/2601.15282v1)

### 4.4 Scientific Data

Scientific domains provide uniquely high-quality structured data:

- **AlphaFold Database:** Open access to over **200 million protein structure predictions**, with the March 2026 release adding 1.7 million homodimer predictions. Trained on publicly available experimental protein structures from the Protein Data Bank.
- **AI Co-Scientist (February 2025):** Google's multi-agent system built on Gemini 2.0 generates hypotheses, designs experiments, and drafts research proposals using scientific literature as training data.
- **Boltz-2 (June 2025):** Predicts protein structure and binding affinity jointly, running **1,000x faster** than physics-based methods, trained on structural biology data.
- **Cross-domain scientific corpora:** Papers, genomics databases, materials science datasets, and chemical databases are increasingly used to improve model reasoning about the physical world.

Sources: [AlphaFold (deepmind.google)](https://deepmind.google/blog/alphafold-five-years-of-impact/), [AlphaFold Database 2026 (nature.com)](https://www.nature.com/articles/d41586-026-00787-3), [AI in Scientific Software 2025 (rdworldonline.com)](https://www.rdworldonline.com/6-ways-ai-reshaped-scientific-software-in-2025/)

---

## 5. Post-Training Scaling: The Inference-Time Revolution

### 5.1 A New Scaling Paradigm

The most significant paradigm shift in AI scaling from 2024-2026 has been the emergence of **test-time compute scaling** — spending more compute at inference rather than (or in addition to) training. This represents an entirely new scaling axis.

**The core insight:** Letting models "think longer" through extended chain-of-thought reasoning produces capabilities that training alone cannot achieve. Similar to how a human may deliberate longer on harder questions, reasoning models allocate variable compute per query.

**Infrastructure implications:** Analysts project inference will exceed training compute demand by **118x by 2026**, with inference potentially claiming **75% of total AI compute by 2030**.

Sources: [Inference-Time Scaling (introl.com)](https://introl.com/blog/inference-time-scaling-research-reasoning-models-december-2025), [Scaling LLM Test-Time Compute (OpenReview)](https://openreview.net/forum?id=4FWAwZtd2n), [Test-Time Compute Report (emerge.haus)](https://www.emerge.haus/blog/test-time-compute-generative-ai)

### 5.2 The o-Series: Reasoning at Scale

OpenAI's o-series models are the flagship demonstration of inference-time scaling:

**OpenAI o1 (September 2024):**
- First major reasoning model using chain-of-thought at inference time.
- Performance consistently improved with both more RL training (train-time compute) and more thinking time (test-time compute).

**OpenAI o3 (April 2025):**
- **ARC-AGI:** 75.7% on semi-private evaluation (vs. o1's much lower scores). High-compute (172x) configuration scored **87.5%**.
- **AIME 2024:** 91.6% accuracy (vs. o1's 74.3%).
- **EpochAI Frontier Math:** Solved **25.2%** of problems when no other model had exceeded 2%.
- **GPQA Diamond (PhD-level science):** 83.3% accuracy.

**OpenAI o4-mini (April 2025):**
- Best-performing model on AIME 2024 and 2025: **99.5% pass@1** (100% consensus@8) on AIME 2025 with Python interpreter access.

Sources: [o3 ARC-AGI Breakthrough (arcprize.org)](https://arcprize.org/blog/oai-o3-pub-breakthrough), [Introducing o3 and o4-mini (openai.com)](https://openai.com/index/introducing-o3-and-o4-mini/), [o3 Analysis (arcprize.org)](https://arcprize.org/blog/analyzing-o3-with-arc-agi)

### 5.3 DeepSeek R1: Efficient Reasoning

DeepSeek R1 proved inference-time scaling at dramatic cost efficiency:

- Matched o1's reasoning performance by generating **10-100x more tokens per query**.
- Used Mixture-of-Experts: 671B total parameters, only **37B active** per token.
- Multi-Head Latent Attention (MLA) compressed the key-value cache into latent vectors, reducing memory usage by **~40%** during inference.
- Reported training cost of **$5.6 million** vs. $78M for GPT-4 and $191M for Gemini Ultra.
- Triggered "DeepSeek Monday" (January 2025): NVIDIA stock dropped 17% in a single day — the largest one-day market cap loss in history at the time.

This sparked the "Inference Wars" of mid-2025, shifting strategic advantage from training the biggest model to serving the most intelligent model at the lowest latency.

Sources: [DeepSeek R1 (hpcwire.com)](https://www.hpcwire.com/2025/01/27/deepseek-r1-stuns-the-ai-world/), [DeepSeek R1 Effect (financialcontent.com)](https://markets.financialcontent.com/stocks/article/tokenring-2026-2-6-the-deepseek-r1-effect-how-a-6-million-model-shattered-the-ai-scaling-myth), [DeepSeek True Cost (theregister.com)](https://www.theregister.com/2025/09/19/deepseek_cost_train/)

### 5.4 Post-Training Methods: RLHF, DPO, and RLVR

The post-training pipeline has become as important as pre-training:

- **RLHF (Reinforcement Learning from Human Feedback):** The standard approach, but research shows it scales less efficiently than pretraining, with diminishing returns from additional resources. Leading models use many iterative rounds of RLHF.
- **DPO (Direct Preference Optimization):** Skips the reward model step, directly using preference data to update the LLM. By 2025, DPO adoption increased by **45%**, becoming dominant alongside RLHF for enterprise applications.
- **RLVR (Reinforcement Learning with Verifiable Rewards):** The breakthrough behind DeepSeek R1. Uses deterministic verifiers (symbolic math checkers, code execution) instead of learned reward models. Provides binary correct/wrong feedback. However, recent research suggests most RLVR gains are "search compression" (improving pass@1 from existing pass@k capability) rather than genuine capability expansion.
- **Constitutional AI:** Anthropic's approach using written principles to guide AI self-evaluation, enabling scalable alignment without per-instance human labels.

Sources: [RLHF Book (rlhfbook.com)](https://rlhfbook.com/book.pdf), [Does RLHF Scale (OpenReview)](https://openreview.net/forum?id=FIXk0RP960), [RLVR Research (arxiv.org)](https://arxiv.org/abs/2506.14245)

---

## 6. Recent Innovations (2025-2026)

### 6.1 Mixture of Experts Goes Mainstream

Since early 2025, MoE has become the consensus architecture for frontier models:

- **Adoption rate:** Over **60%** of open-source AI model releases in 2025 use MoE designs.
- **Llama 4 Maverick:** 400B total parameters, 17B active per token. Achieved 390 TFLOPs/GPU during pre-training with FP8 on 32K GPUs.
- **Qwen 3.5 (February 2026):** 397B-parameter MoE model activating only 17B per token.
- **Key insight:** MoE decouples total parameters from computational cost. Research shows MoE models can be more memory-efficient than dense models, contradicting conventional wisdom.
- **Current focus (mid-2025 onward):** Innovation shifted from increasing parameter count to making routing reliable under long training runs and deployment constraints.

Sources: [MoE in Frontier Models (nvidia.com)](https://blogs.nvidia.com/blog/mixture-of-experts-frontier-models/), [MoE Survey (arxiv.org)](https://arxiv.org/html/2507.11181v2), [MoE Scaling Laws (OpenReview)](https://openreview.net/forum?id=7r2lkhDGUj)

### 6.2 Frontier Model Releases

**GPT-5 (August 2025):**
- Estimated 2-5 trillion parameters (unconfirmed by OpenAI).
- **AIME 2025:** 94.6% without tools.
- **SWE-bench Verified:** 74.9%.
- Hallucinations reduced **~45%** compared to GPT-4o.
- Trained on Microsoft Azure AI supercomputers with NVIDIA B100/B200 GPUs.

**Claude 4 (May 2025):**
- Hybrid reasoning with toggleable instant/extended thinking modes.
- Constitutional AI alignment approach.

**Claude Opus 4.5 (November 2025):**
- 67% price cut, 76% fewer output tokens for equivalent quality.
- Efficiency revolution: dramatically fewer tokens than predecessors for similar or better outcomes.

**Claude Opus 4.6 (February 2026):**
- 1M context window.
- Native multi-agent collaboration.
- Sonnet 4.6 preferred over previous-generation Opus in coding evaluations for the first time.

Sources: [GPT-5 (openai.com)](https://openai.com/index/introducing-gpt-5/), [Claude Opus 4.5 (anthropic.com)](https://www.anthropic.com/news/claude-opus-4-5), [Claude Models (claudefa.st)](https://claudefa.st/blog/models)

### 6.3 BeyondWeb: Synthetic Data at Trillion Scale

A 2025 paper titled "BeyondWeb: Lessons from Scaling Synthetic Data for Trillion-scale Pretraining" documented practical lessons from generating and using synthetic data at unprecedented scale, addressing the challenges of maintaining diversity, avoiding collapse, and integrating synthetic data with real-world corpora.

Sources: [BeyondWeb (arxiv.org)](https://arxiv.org/pdf/2508.10975)

### 6.4 Key Research Papers (2025-2026)

| Paper | Venue | Key Contribution |
|-------|-------|-----------------|
| Scaling Laws Meet Model Architecture | ICLR 2026 | Conditional scaling laws with architectural parameters |
| Revisiting Scaling Laws for Language Models | ACL 2025 | Updated scaling exponents and data density metrics |
| The Race to Efficiency | arXiv 2025 | Time- and efficiency-aware scaling framework |
| Will LLMs Scaling Hit the Wall? | arXiv 2025 | Analysis of scaling barriers and breakthrough paths |
| Strong Model Collapse | ICLR 2025 | Formal analysis of collapse from recursive training |
| SynthLLM | Microsoft Research 2025 | Synthetic data scaling laws confirmation |

Sources: [ICLR 2026 Paper (arxiv.org)](https://arxiv.org/pdf/2510.18245v2), [Breaking Barriers (arxiv.org)](https://arxiv.org/pdf/2503.08223), [Strong Model Collapse (ICLR 2025)](https://proceedings.iclr.cc/paper_files/paper/2025/file/284afdc2309f9667d2d4fb9290235b0c-Paper-Conference.pdf)

---

## 7. Future Directions (2026-2028)

### 7.1 Training Compute Projections

Epoch AI provides the most comprehensive projections:

- Training compute for frontier models has been growing **4.5x per year** since 2010 (more precisely 5.3x/year from 2010 to mid-2024).
- **2026 projection:** Over 10 models will exceed 10^26 FLOP of training compute; over 200 by 2030.
- **Training cost trajectory:** ~$10 billion per model in 2025; ~$100 billion per model by 2027.
- **Power demands:** Frontier training will likely reach **4-16 GW** by 2030, growing 2.2-2.9x per year.
- Training costs are climbing **2.5x annually**, while power requirements double each year.

Sources: [Epoch AI Trends (epoch.ai)](https://epoch.ai/trends), [Compute Forecast (ai-2027.com)](https://ai-2027.com/research/compute-forecast), [Can AI Scaling Continue (epoch.ai)](https://epoch.ai/blog/can-ai-scaling-continue-through-2030)

### 7.2 New Scaling Axes

The field is moving beyond the traditional "more parameters + more data" paradigm to explore multiple simultaneous scaling axes:

1. **Inference-time compute:** The dominant new axis. Variable compute per query based on problem difficulty. Already demonstrated by o3 (172x compute scaling on ARC-AGI) and DeepSeek R1.

2. **Efficiency scaling:** Without ongoing efficiency gains, advanced performance could demand millennia of training. But near-exponential progress remains achievable if efficiency-doubling rates parallel Moore's Law.

3. **Post-training data scaling:** RLVR, DPO, and RLAIF allow post-training on large amounts of data, making them candidates for unlocking capabilities through scaling compute during post-training.

4. **Architectural scaling:** MoE, Multi-Head Latent Attention, and novel routing mechanisms allow scaling total knowledge while constraining inference cost.

5. **Multimodal data scaling:** As text data approaches exhaustion, video, audio, sensor, robotics, and scientific data represent massive untapped reservoirs.

6. **Edge data:** Data generated by edge devices (IoT, mobile, embedded systems) represents a crucial alternative to both web-scraped and synthetic data.

Sources: [AI Beyond Scaling Laws (hec.edu)](https://www.hec.edu/en/dare/tech-ai/ai-beyond-scaling-laws), [Scaling Era Oral History (stripe.com)](https://assets.stripeassets.com/fzn2n1nzq965/5j0dFbeGgGbohTE3a2jrVA/ebd35e791ca5fa926c6a0b076860c71c/ZINE-Scaling_Era-singles.pdf), [Scaling Paradox (forethought.org)](https://www.forethought.org/research/the-scaling-paradox)

### 7.3 Will Scaling Continue?

**Arguments for continued scaling:**
- Multiple new scaling axes (inference-time, post-training, multimodal) provide paths even if pre-training scaling plateaus.
- Synthetic data, if properly managed, can extend data availability.
- Hardware improvements continue at ~2.5x per generation.
- Algorithmic efficiency gains compound with hardware improvements.

**Arguments for limits:**
- Diminishing returns are observable in pre-training scaling for some benchmarks.
- The data wall for high-quality text is real, with exhaustion projected ~2028.
- Training costs are becoming prohibitive ($100B+ per model by 2027).
- Model collapse risks from AI-contaminated web data.
- Industry insiders report growing consensus that "simply adding more data and compute will not create the highly capable systems once promised."

**Likely outcome:** Pre-training scaling alone is approaching diminishing returns, but the discovery of multiple new scaling axes — particularly inference-time compute and post-training methods — means overall AI capability improvement will continue, albeit through increasingly diverse and sophisticated approaches. The question shifts from "does scaling reduce loss?" to "which scaling metrics translate into durable economic utility?"

Sources: [Can AI Scaling Continue (epoch.ai)](https://epoch.ai/blog/can-ai-scaling-continue-through-2030), [AI's $100bn Question (exponentialview.co)](https://www.exponentialview.co/p/can-scaling-scale), [Scaling Laws and the AI Singularity (journalwjarr.com)](https://journalwjarr.com/sites/default/files/fulltext_pdf/WJARR-2026-0011.pdf)

### 7.4 Process-Level Evaluation and Trust

By 2027, research priorities may shift from whether pre-training loss continues falling to whether societies can evaluate and trust advanced reasoning systems. This includes:

- **Process supervision:** Verifying not just the final answer but the reasoning steps.
- **Human-AI epistemics:** How humans evaluate and trust AI reasoning that exceeds human capability in specific domains.
- **Interpretability:** Understanding what models learn and how they reason internally.

---

## 8. The Compounding Effect

### 8.1 The Multiplicative Stack

The most powerful dynamic in AI progress is the **compounding of improvements across hardware, algorithms, and data**. Each dimension multiplies the others:

| Improvement Dimension | Gain per Generation | Compounding Period |
|----------------------|--------------------|--------------------|
| Hardware (GPU efficiency) | 2-3x | ~2 years |
| Software optimization (batching, PagedAttention) | 2-3x | Continuous |
| Model architecture (MoE, attention variants) | 3-5x | ~1 year |
| Quantization & pruning | 2-4x | ~1 year |
| Data quality improvements | Variable | Continuous |

**Combined effect:** These gains are multiplicative. The headline result is a **~1,000x reduction in inference costs** over approximately 3 years (2023-2026).

Sources: [AI Inference Economics (gpunex.com)](https://www.gpunex.com/blog/ai-inference-economics-2026/), [Compute Forecast (ai-2027.com)](https://ai-2027.com/research/compute-forecast)

### 8.2 Hardware Trajectory

- **GPU efficiency:** 34% more energy-efficient per year since 2008. Energy efficiency doubles every 2.4 years.
- **Next-generation hardware:** NVIDIA Rubin GPU (R200) projected to achieve ~2.4x improvement over B200, reaching 6x10^15 FP16 FLOP.
- **Overall chip efficiency:** 2.5x increase projected over next three years, matching 1.35x/year historical trend.
- **Google TPUs:** Trillium (6th-generation) TPUs powered 100% of Gemini 2.0 training and inference.

Sources: [Compute Forecast (ai-2027.com)](https://ai-2027.com/research/compute-forecast), [AI Infrastructure Planning (introl.com)](https://introl.com/blog/ai-infrastructure-capacity-planning-forecasting-gpu-2025-2030)

### 8.3 Algorithmic Efficiency

- **Compiler improvements:** 20-30% annual efficiency gains.
- **FlashAttention:** Reduces memory requirements by 50%.
- **Quantization and pruning:** Compress models 4-10x with minimal accuracy loss.
- **Combined projection:** These improvements could reduce infrastructure needs by **75% over five years**.

### 8.4 How Data Improvements Amplify Everything

Data improvements interact with hardware and algorithmic advances in powerful ways:

1. **Better data + same compute = better models:** Phi-4 at 14B parameters rivaling 671B models demonstrates that data quality can substitute for 50x the compute.
2. **Synthetic data + efficiency hardware = scalable training:** SynthLLM's predictable scaling laws mean teams can precisely plan data-compute tradeoffs.
3. **Multimodal data + new architectures = new capabilities:** MoE architectures enable efficient processing of diverse data modalities without proportional compute increases.
4. **Post-training data + inference hardware = reasoning at scale:** RLVR and DPO improvements compound with more efficient inference hardware to make reasoning models practical for deployment.

The compounding effect means that even modest improvements in each dimension (2-3x) combine to produce transformative gains (100-1000x) over a few years — exactly what we have observed from 2023 to 2026.

Sources: [Deloitte Compute Analysis (deloitte.com)](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/compute-power-ai.html), [IBM 2026 Trends (ibm.com)](https://www.ibm.com/think/news/ai-tech-trends-predictions-2026)

---

## 9. Key Takeaways

### The Big Picture

1. **Scaling is not dead — it is diversifying.** Pre-training scaling alone shows diminishing returns, but new axes (inference-time compute, post-training methods, multimodal data, architectural innovations) provide multiple paths to continued capability improvement.

2. **The data wall is real but navigable.** High-quality text data exhaustion is projected by 2026-2028, but synthetic data, multimodal data, scientific data, code, and embodied data provide substantial new reservoirs. SynthLLM confirmed that synthetic data follows the same scaling laws as natural data.

3. **Quality has definitively won over quantity.** Phi-4 (14B) rivaling DeepSeek-R1 (671B) on reasoning tasks proves that carefully curated data can substitute for 50x the parameters. The "textbook quality" approach is now mainstream.

4. **Inference-time compute is the new frontier.** The shift from "train bigger" to "think longer" represents the most significant paradigm change since transformers. o3/o4's benchmark results and DeepSeek R1's cost efficiency demonstrate that test-time scaling delivers capabilities training alone cannot.

5. **The MoE revolution is complete.** Over 60% of frontier models now use Mixture-of-Experts architectures, decoupling knowledge capacity from inference cost. The focus has shifted from "how many parameters" to "how efficient is the routing."

6. **Model collapse is a real but manageable risk.** With 74% of new web pages containing AI-generated text, data provenance and human-data anchoring are essential. The key insight: accumulate synthetic data alongside real data rather than replacing it.

7. **The compounding effect is the most powerful force.** Hardware (2-3x), software (2-3x), architecture (3-5x), and data quality improvements multiply to produce ~1,000x cost reductions every 3 years. This pace shows no signs of slowing.

### Critical Numbers

| Metric | Value | Source Year |
|--------|-------|-------------|
| Frontier training compute growth | 4.5-5.3x/year | 2024 |
| Projected data exhaustion (high-quality text) | ~2028 | 2025 |
| Inference vs. training compute (projected) | 118x by 2026 | 2025 |
| Inference cost reduction (3-year compound) | ~1,000x | 2023-2026 |
| MoE adoption in frontier models | >60% | 2025 |
| Synthetic data market (projected) | $3.5B by 2026 | 2025 |
| AI-generated web content | 74% of new pages | April 2025 |
| GPU energy efficiency improvement | 34%/year since 2008 | 2025 |
| DeepSeek R1 training cost | $5.6M (vs. $78M GPT-4) | 2025 |
| Projected model training cost | $100B by 2027 | 2025 |

### What to Watch (2026-2028)

- **Will RLVR scale beyond math and code?** Extending verifiable rewards to knowledge-intensive domains remains unsolved.
- **Trillion-token synthetic pre-training:** Can synthetic data fully replace web data, or will model collapse set in at scale?
- **Video + robotics data:** Will physical-world data become the next scaling breakthrough?
- **$100B training runs:** Will the economics be justified? Or will inference-time scaling make them unnecessary?
- **Process supervision and interpretability:** Can we verify AI reasoning as it surpasses human capability in more domains?

---

## Sources

### Scaling Laws and Compute
- [Chinchilla Paper — Training Compute-Optimal LLMs](https://arxiv.org/abs/2203.15556)
- [Epoch AI — Trends in Artificial Intelligence](https://epoch.ai/trends)
- [Epoch AI — Training Compute Growth](https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)
- [Epoch AI — Can AI Scaling Continue Through 2030](https://epoch.ai/blog/can-ai-scaling-continue-through-2030)
- [Scaling Laws Meet Model Architecture (ICLR 2026)](https://arxiv.org/abs/2510.18245)
- [The Race to Efficiency: New Perspective on AI Scaling Laws](https://arxiv.org/html/2501.02156v3)
- [LLM Scaling Laws: From GPT-3 to o3](https://cameronrwolfe.substack.com/p/llm-scaling-laws)
- [AI Scaling Laws 2025 Report](https://dailyaiwire.com/ai-scaling-laws-2025/)

### Synthetic Data
- [SynthLLM — Microsoft Research](https://www.microsoft.com/en-us/research/articles/synthllm-breaking-the-ai-data-wall-with-scalable-synthetic-data/)
- [Synthetic Pretraining — Vintage Data](https://vintagedata.org/blog/posts/synthetic-pretraining)
- [BeyondWeb: Scaling Synthetic Data for Trillion-scale Pretraining](https://arxiv.org/pdf/2508.10975)
- [AI Training in 2026: Anchoring Synthetic Data in Human Truth](https://invisibletech.ai/blog/ai-training-in-2026-anchoring-synthetic-data-in-human-truth)
- [WEF — Data for AI Training](https://www.weforum.org/stories/2025/12/data-ai-training-synthetic/)

### Data Quality
- [Phi-4 Data-First Methodology — VentureBeat](https://venturebeat.com/ai/phi-4-proves-that-a-data-first-sft-methodology-is-the-new-differentiator)
- [Quality Over Quantity: Ensembled Multimodal Data Curation](https://arxiv.org/html/2502.08211)
- [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388)

### Model Collapse
- [AI Models Collapse When Trained on Recursively Generated Data — Nature](https://www.nature.com/articles/s41586-024-07566-y)
- [Strong Model Collapse — ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/file/284afdc2309f9667d2d4fb9290235b0c-Paper-Conference.pdf)
- [Model Collapse Risk 2025](https://www.winssolutions.org/ai-model-collapse-2025-recursive-training/)

### Inference-Time Scaling
- [Inference-Time Scaling Research — Introl](https://introl.com/blog/inference-time-scaling-research-reasoning-models-december-2025)
- [Scaling LLM Test-Time Compute — OpenReview](https://openreview.net/forum?id=4FWAwZtd2n)
- [OpenAI o3 ARC-AGI Breakthrough](https://arcprize.org/blog/oai-o3-pub-breakthrough)
- [Introducing o3 and o4-mini — OpenAI](https://openai.com/index/introducing-o3-and-o4-mini/)

### Post-Training
- [RLHF Book — Nathan Lambert](https://rlhfbook.com/book.pdf)
- [RLVR Research](https://arxiv.org/abs/2506.14245)
- [State of LLM Reasoning](https://magazine.sebastianraschka.com/p/the-state-of-llm-reasoning-model-training)
- [Detecting Distillation Attacks — Anthropic](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)

### Frontier Models
- [GPT-5 — OpenAI](https://openai.com/index/introducing-gpt-5/)
- [Claude Opus 4.5 — Anthropic](https://www.anthropic.com/news/claude-opus-4-5)
- [Llama 4 — Meta](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [DeepSeek R1 — HPCwire](https://www.hpcwire.com/2025/01/27/deepseek-r1-stuns-the-ai-world/)

### New Data Sources
- [GEN-0 Embodied Foundation Model](https://generalistai.com/blog/nov-04-2025-GEN-0)
- [AlphaFold Five Years of Impact](https://deepmind.google/blog/alphafold-five-years-of-impact/)
- [StarCoder 2 and The Stack v2](https://arxiv.org/abs/2402.19173)
- [Sora — OpenAI](https://openai.com/index/sora/)

### Hardware and Compounding
- [AI 2027 Compute Forecast](https://ai-2027.com/research/compute-forecast)
- [AI Inference Economics 2026](https://www.gpunex.com/blog/ai-inference-economics-2026/)
- [Deloitte — Compute Power for AI](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/compute-power-ai.html)
- [MoE in Frontier Models — NVIDIA](https://blogs.nvidia.com/blog/mixture-of-experts-frontier-models/)
