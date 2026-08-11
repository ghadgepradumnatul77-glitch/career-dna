# Career DNA

Career DNA is an evidence-first career intelligence platform. It turns resume content and optional GitHub repository signals into a deterministic, provenance-preserving skills report and role gap analysis.

The MVP deliberately does not score proficiency, rank candidates, or generate recommendations.

## Features

- **Resume Intelligence** — parses resume text and bounded PDFs into canonical skills, project evidence, experience evidence, and structured entries.
- **GitHub Intelligence** — analyzes repository languages, dependencies, Python imports and usage, repository structure, README claims, and bounded activity metadata.
- **Evidence Fusion** — merges canonical skills while preserving resume and GitHub provenance.
- **Skill Gap Analysis** — identifies present and missing skills for the existing Software Engineer role definition.
- **Career DNA Report** — produces a deterministic, JSON-serializable report without scoring or recommendations.
- **FastAPI server** — exposes health and analysis endpoints with sanitized errors and local-development CORS.
- **React dashboard** — provides a responsive presentation interface for the analysis workflow.
- **Mocked demo** — runs the complete pipeline without live GitHub calls or credentials.

## Architecture

```text
Resume text ──> Resume Parser ──┐
                               ├─> Evidence Fusion ─> Gap Analysis ─> Report Generator
GitHub API ──> GitHub Analyzer ─┘                                      │
                                                                         v
React Dashboard <── HTTP/JSON ── FastAPI Server <── API Pipeline ── Career DNA Report
```

Module responsibilities and security boundaries are documented in [`FINAL_ARCHITECTURE.md`](FINAL_ARCHITECTURE.md).

## Local Development

### Backend

Create a Python 3.11 environment, install dependencies, and start FastAPI:

```powershell
python -m pip install -r requirements.txt
uvicorn services.server.app:app --reload --host 0.0.0.0 --port 8000
```

The optional `GITHUB_TOKEN` environment variable increases GitHub API limits. Authenticated requests remain restricted to the official GitHub HTTPS API.

### Frontend

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The dashboard uses `VITE_API_URL=http://localhost:8000` by default. See [`frontend/README.md`](frontend/README.md) for configuration details.

## Docker Setup

Copy the environment template and optionally provide a GitHub token:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Open:

- Dashboard: `http://localhost:3000`
- API: `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`

The Compose backend health check waits for `GET /health` before starting the frontend container.

Stop the local stack with:

```powershell
docker compose down
```

## Offline Demo

Run the deterministic fixture-driven demonstration from the repository root:

```powershell
python demo/run_demo.py
```

The runner reads the synthetic resume and mocked GitHub fixtures, executes the complete pipeline without internet access, and saves valid JSON to `demo/demo_output.json`.

Expected terminal output:

```text
Career DNA report generated successfully.
```

## API Endpoints

### `GET /health`

Returns service availability:

```json
{
  "status": "ok",
  "service": "career-dna"
}
```

### `POST /analyze`

Request:

```json
{
  "resume_text": "SKILLS\nPython, SQL",
  "github_username": "optional-user"
}
```

Successful responses use the envelope:

```json
{
  "success": true,
  "data": {
    "report": {},
    "evidence_summary": {},
    "skill_gaps": {
      "present_skills": [],
      "missing_skills": []
    },
    "normalized_skills": []
  },
  "error": null
}
```

Validation and pipeline failures return deterministic error codes without stack traces, source content, credentials, or internal exception details.

## Testing

Run the complete backend and HTTP suite:

```powershell
pytest
```

Build the frontend:

```powershell
cd frontend
npm install
npm run build
```

All GitHub tests use injected or mocked transports; the test suite makes no live GitHub calls.
