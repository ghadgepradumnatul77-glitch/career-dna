# Changelog

## v1.0-mvp

### Features added

- Resume Intelligence for bounded text/PDF parsing, structured sections, and canonical skill evidence.
- GitHub Intelligence for repository languages, dependencies, Python code, structure, README claims, and activity metadata.
- Evidence Fusion with stable canonical skill merging and resume/GitHub provenance.
- Skill Gap Analysis for deterministic present/missing role requirements.
- JSON-compatible Career DNA Report generation without scoring or recommendations.
- API pipeline wrapper with safe deterministic error contracts.
- FastAPI HTTP server with `/health`, `/analyze`, validation handling, and local-dashboard CORS.
- Responsive React + Vite demonstration dashboard.
- Python/Uvicorn and Node/Nginx Docker packaging with Compose health checks.
- Fixture-driven offline demo that requires no credentials or network access.

### Architecture

- Layered deterministic pipeline: parser/analyzer → evidence fusion → gap analysis → report.
- Thin API and HTTP adapters delegate to existing intelligence services.
- Dataclass contracts serialize to plain JSON-compatible dictionaries.
- Injected transports keep tests and offline demonstrations independent of live GitHub.
- Frontend and backend package independently and run together through Docker Compose.

### Security improvements

- Authenticated GitHub traffic is restricted to the official HTTPS API base URL.
- Tokens, raw API bodies, source contents, stack traces, and internal exception details are excluded from public errors and warnings.
- Repository inputs are bounded, decoded in memory, and never executed or cloned.
- No subprocess, `eval`, `exec`, LLM, database, or persistence behavior exists in the intelligence pipeline.
- Test and demo GitHub interactions use mocks or local fixtures only.
- Submission tree excludes `.env`, caches, bytecode, dependencies, and generated frontend builds.

### Testing status

- **237 tests passed** in the audited complete suite.
- Two consecutive final release runs are required and recorded in the release audit report.
- Zero live GitHub calls in tests.
- Offline demo output is valid JSON and deterministic across repeated runs.
