# When AI Meets Early Childhood Education: Large Language Models as Assessment Teammates in Chinese Preschools

<p align="center">
  <a href="https://aied-conference.org/2026"><img src="https://img.shields.io/badge/AIED%202026-Seoul%2C%20South%20Korea-blue?style=flat-square" alt="AIED 2026" /></a>
  <a href="AIED26_paper_408.pdf"><img src="https://img.shields.io/badge/Paper-PDF-red?style=flat-square&logo=adobe-acrobat-reader" alt="Paper PDF" /></a>
  <img src="https://img.shields.io/badge/Status-Accepted-brightgreen?style=flat-square" alt="Accepted" />
  <img src="https://img.shields.io/badge/Paper%20ID-408-orange?style=flat-square" alt="Paper ID 408" />
</p>

<p align="center">
  <b>Xingming Li</b><sup>1</sup> &nbsp;·&nbsp;
  <b>Runke Huang</b><sup>2✉</sup> &nbsp;·&nbsp;
  <b>Yanan Bao</b><sup>2</sup> &nbsp;·&nbsp;
  <b>Yuye Jin</b><sup>2</sup> &nbsp;·&nbsp;
  <b>Yuru Jiao</b><sup>2</sup> &nbsp;·&nbsp;
  <b>Qingyong Hu</b><sup>3</sup>
</p>

<p align="center">
  <sup>1</sup> National University of Defense Technology &nbsp;·&nbsp;
  <sup>2</sup> The Chinese University of Hong Kong, Shenzhen &nbsp;·&nbsp;
  <sup>3</sup> University of Oxford
</p>

<p align="center">
  <a href="https://qingyonghu.github.io/Interaction2Eval/">🌐 Project Page</a> &nbsp;|&nbsp;
  <a href="AIED26_paper_408.pdf">📄 Paper</a> &nbsp;|&nbsp;
  <a href="#citation">📖 BibTeX</a>
</p>

---

## Abstract

High-quality teacher-child interaction (TCI) is fundamental to early childhood development, yet traditional expert-based assessment faces a critical **scalability challenge**. In China's system serving 36 million children across 250,000+ kindergartens, the cost and time of manual observation make continuous quality monitoring infeasible.

We investigate whether AI can serve as a scalable assessment teammate by extracting structured quality indicators and validating their alignment with human expert judgments. Our contributions include:

- **TEPE-TCI-370h** — the first large-scale dataset of naturalistic TCI in Chinese preschools (370 hours, 105 classrooms) with standardized ECQRS-EC and SSTEW annotations.
- **Interaction2Eval** — a specialized LLM-based framework addressing domain-specific challenges (child speech recognition, Mandarin homophone disambiguation, rubric-based reasoning), achieving up to **88% agreement** with human experts.
- **Deployment validation** across 43 classrooms demonstrating **18× efficiency gains**, enabling a shift from annual expert audits to monthly AI-assisted monitoring.

## Key Results

| Scale | Best Model | κ | Agreement |
|-------|-----------|---|-----------|
| ECQRS-EC | DeepSeek-v3.1 | 0.710 | 87.3% |
| SSTEW | DeepSeek-v3.1 | 0.741 | 87.9% |

**ASR Transcription Quality (after Refinement Agent):**

| Model | Raw CER | Refined CER | Relative ↓ |
|-------|---------|-------------|------------|
| FunASR Paraformer | 9.9% | 4.3% | 56.6% |
| Whisper-large v3 | 35.1% | 23.2% | 33.4% |

**Efficiency:** 380 min (manual) → 21 min (Interaction2Eval) = **18× faster**

## Interaction2Eval Pipeline

```
Raw Audio
   │
   ▼
[1] Transcription Agent  ─── FunASR Paraformer + Speaker Diarization
   │
   ▼
[2] Refinement Agent     ─── Qwen3-Max + Domain-aware Error Correction
   │                         (Mandarin homophones, preschool vocabulary)
   ▼
[3] Evaluation Agent     ─── LLM + ECQRS-EC / SSTEW Rubric Prompting
   │                         (Evidence-first reasoning)
   ▼
Quality Assessment Report + Pedagogical Feedback
```

## Dataset: TEPE-TCI-370h

| Attribute | Value |
|-----------|-------|
| Total Duration | 370+ hours |
| Classrooms | 105 (41 preschools) |
| Speakers | 2,550 |
| Age Group | 3–6 years |
| Preschool Tiers | District / Municipal / Provincial |
| Annotation Scales | ECQRS-EC (22 items) + SSTEW (15 items) |
| Total Indicators | 206 |
| Inter-rater Reliability | κ > 0.80 |

## Pilot Deployment

- **3** public kindergartens in Shenzhen, China
- **77** teachers participated
- **127** classroom sessions processed
- **96.8%** pipeline success rate
- Average processing time: **21 min** per 3-hour session

## Citation

```bibtex
@inproceedings{li2026when,
  title     = {When {AI} Meets Early Childhood Education: Large Language Models as Assessment Teammates in {Chinese} Preschools},
  author    = {Li, Xingming and Huang, Runke and Bao, Yanan and Jin, Yuye and Jiao, Yuru and Hu, Qingyong},
  booktitle = {Proceedings of the 27th International Conference on Artificial Intelligence in Education ({AIED})},
  year      = {2026},
  address   = {Seoul, South Korea}
}
```

## Contact

For questions, please contact **Runke Huang** (corresponding author): [runkehuang@cuhk.edu.cn](mailto:runkehuang@cuhk.edu.cn)
