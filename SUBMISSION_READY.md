# Career DNA — Submission Ready

## Project summary

Career DNA is an evidence-first career intelligence MVP. It combines structured resume claims and observable GitHub repository signals into a transparent candidate profile, compares that profile with canonical role requirements, and produces a portable JSON report and responsive dashboard.

## Problem statement

Career profiles are often fragmented across resumes and public development work. Conventional screening can obscure where a skill claim came from, overstate confidence, or jump directly to opaque scores. Candidates and reviewers need a deterministic view of which skills are supported, where the evidence originated, and which role requirements remain unsupported.

## Solution overview

Career DNA parses resume sections, analyzes bounded GitHub metadata and source signals, normalizes both sources through one taxonomy, fuses provenance-bearing evidence, identifies present and missing role skills, and generates a structured report. The MVP intentionally avoids proficiency scoring, ranking, and generated recommendations.

## Architecture diagram

```text
Synthetic/local resume                         GitHub API or offline fixture
         |                                                 |
         v                                                 v
   Resume Parser                                     GitHub Analyzer
         |                                                 |
         +----------------------+--------------------------+
                                |
                                v
                         Evidence Fusion
                                |
Role taxonomy ----------------->+-----------------> Gap Analysis
                                                       |
                                                       v
                                                Report Generator
                                                       |
                                  +--------------------+-------------------+
                                  |                                        |
                                  v                                        v
                           FastAPI / JSON                           Offline demo JSON
                                  |
                                  v
                         React dashboard
```

## Key innovations

- Evidence provenance remains attached from source extraction through final reporting.
- Canonical taxonomy and aliases produce stable skill identifiers across resume and repository inputs.
- README and source matching support punctuation-heavy skills while avoiding substring false positives.
- Repository activity remains metadata and never becomes fabricated skill evidence.
- Deterministic first-seen ordering makes identical inputs produce identical JSON.
- Safe partial-failure handling preserves resume analysis when optional GitHub analysis is unavailable.

## Technical stack

- Python 3.11
- FastAPI and Uvicorn
- HTTPX with injected mock transports
- PyYAML and pdfplumber
- React and Vite
- Nginx static serving
- Docker and Docker Compose
- Pytest

## Demo instructions

### Offline pipeline

```powershell
python demo/run_demo.py
```

Expected message:

```text
Career DNA report generated successfully.
```

The result is saved to `demo/demo_output.json` without network access.

### Full local application

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Open the dashboard at `http://localhost:3000` and API documentation at `http://localhost:8000/docs`.

## Future roadmap

The following are intentionally outside `v1.0-mvp` and require separate design and validation:

- User-selected role requirements and additional transparent role taxonomies.
- Durable profile persistence with explicit privacy and retention controls.
- Authenticated multi-user operation and authorization boundaries.
- Broader language analyzers using the same bounded evidence contracts.
- Calibrated scoring or recommendations only after explainability, fairness, and evaluation work.
- Production observability that records operational metadata without resume or source-content leakage.
