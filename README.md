# 🧬 Career DNA — AI Career Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/ghadgepradumnatul77-glitch/career-dna)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_17-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Career DNA** is an end-to-end, full-stack AI career intelligence platform. It analyzes raw text resumes, GitHub repository activity, and technical project artifacts to compute an engineer's **Career DNA Score**, readiness level, primary archetype, skill gap matrix, and personalized actionable learning roadmap.

---

## 🌟 Key Features

- **📄 AI Resume Skill Extraction**: Natural language processing of raw resume text to identify technical competencies.
- **💻 GitHub Activity & Repository Sync**: Automated ingestion of public repositories, language metrics, and star counts.
- **🧬 Career DNA Readiness Engine**: Computes overall readiness score (e.g. `85/100`), readiness tier (`Production Ready`), primary archetype (`Backend / AI Architect`), and verified skill matrix.
- **🎯 Target Role Skill Gap Analysis**: Compares verified user skills against target roles (e.g. `AI Engineer`, `Senior Backend Engineer`) to highlight missing competencies.
- **💡 Actionable Learning Roadmap**: Generates personalized skill recommendations with interactive completion tracking (`is_completed`).
- **🛡️ Verifiable Skill Evidence Tracking**: Stores links to commits, project demos, and achievements with verification statuses.
- **🔒 JWT Security & Authentication**: Secure user registration, authentication, and protected routing.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│               React + Vite Frontend                    │
│   (AuthContext, Dashboard, Glassmorphic UI, Axios)     │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP REST (JWT Bearer)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│   (Routers, Ingestion, DNA Engine, Skill Gap, Recs)    │
└───────────────────────────┬────────────────────────────┘
                            │  SQLAlchemy ORM
                            ▼
┌────────────────────────────────────────────────────────┐
│                 PostgreSQL Database                    │
│   (users, data_sources, career_dna, evidence, gaps)    │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Custom AI Dark Glassmorphism Design System) + Bootstrap 5
- **HTTP Client**: Axios (with JWT interceptors)
- **Routing**: React Router DOM v6

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **Database Migrations**: Alembic
- **Server**: Uvicorn ASGI

### Database & Security
- **Database**: PostgreSQL 17.10 (with SQLite fallback)
- **Authentication**: JWT (JSON Web Tokens) with `passlib` & `python-jose`

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js v18+ & `npm`
- PostgreSQL 17+ (optional, fallback SQLite supported automatically)

### 1. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```
Backend server will run live at `http://127.0.0.1:8000`. Swagger API docs are available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

```bash
cd Frontend

# Install node dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run Vite dev server
npm run dev
```
Frontend will be active at `http://localhost:5173`.

---

## 📖 API Documentation Summary

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth/signup` | `POST` | Register a new user account |
| **Auth** | `/api/v1/auth/login` | `POST` | Authenticate user & return JWT token |
| **Auth** | `/api/v1/auth/me` | `GET` | Retrieve active user profile |
| **Ingestion** | `/api/v1/ingest/resume` | `POST` | Ingest resume text & extract skills |
| **Ingestion** | `/api/v1/ingest/github` | `POST` | Ingest GitHub profile & language metrics |
| **Ingestion** | `/api/v1/ingest/sources` | `GET` | List connected data sources |
| **Evidence** | `/api/v1/evidence` | `POST` | Add verifiable skill proof item |
| **Evidence** | `/api/v1/evidence` | `GET` | List evidence items for user |
| **Career DNA** | `/api/v1/career-dna` | `GET` | Retrieve overall score & skill matrix |
| **Career DNA** | `/api/v1/career-dna/recalculate` | `POST` | Recalculate Career DNA score |
| **Skill Gap** | `/api/v1/skill-gap/analyze` | `POST` | Analyze match % and missing role skills |
| **Skill Gap** | `/api/v1/skill-gap/history` | `GET` | Get historical gap reports |
| **Recommendations** | `/api/v1/recommendations/generate` | `POST` | Generate actionable learning goals |
| **Recommendations** | `/api/v1/recommendations` | `GET` | List recommendations |
| **Recommendations** | `/api/v1/recommendations/{id}/toggle` | `PATCH` | Toggle goal completion status |

*See full request/response schemas in [docs/API.md](docs/API.md).*

---

## 🖼️ Screenshots

Screenshots of the Career DNA platform are stored in `docs/screenshots/`:
- **Dashboard Overview**: Overall readiness score, archetype, and skill matrix.
- **Skill Ingestion**: Resume NLP parser and GitHub repository sync.
- **Skill Gap & Recommendations**: Target role match bar and actionable learning goals.

---

## 🔮 Future Improvements

- [ ] Automated LLM-based custom resume feedback engine using OpenAI/Gemini APIs.
- [ ] Integration with LinkedIn API for automated profile sync.
- [ ] PDF and DOCX file parser integration using `PyPDF2` / `pdfplumber`.
- [ ] Real-time job board scraping to match target roles dynamically.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
