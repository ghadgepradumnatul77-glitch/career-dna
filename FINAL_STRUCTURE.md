# Career DNA — Important Repository Structure

```text
career-dna/
├── README.md
├── CHANGELOG.md
├── FINAL_ARCHITECTURE.md
├── FINAL_STRUCTURE.md
├── SUBMISSION_READY.md
├── requirements.txt
├── Dockerfile.backend
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── shared/
│   └── taxonomy/
│       ├── skills.yaml
│       ├── aliases.yaml
│       └── role_requirements.yaml
├── services/
│   ├── skill_normalizer/
│   ├── resume_parser/
│   ├── github_analyzer/
│   ├── evidence_engine/
│   ├── gap_analysis/
│   ├── report_generator/
│   ├── api/
│   │   ├── models.py
│   │   └── pipeline.py
│   └── server/
│       ├── app.py
│       ├── schemas.py
│       └── errors.py
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── api/
│       ├── components/
│       └── styles/
├── demo/
│   ├── sample_resume.txt
│   ├── sample_github.json
│   ├── run_demo.py
│   ├── demo_output.json
│   └── README.md
└── tests/
    ├── analysis/
    ├── api/
    ├── server/
    └── demo/
```

Generated dependencies, build outputs, caches, bytecode, local environment files, and coverage artifacts are intentionally excluded from the submission tree.
