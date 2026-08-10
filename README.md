# 🧬 Career DNA — AI Career Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/ghadgepradumnatul77-glitch/career-dna)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_17-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Frontend_Deploy-Vercel-black?logo=vercel)](https://career-dna.vercel.app)
[![Render](https://img.shields.io/badge/Backend_Deploy-Render-46E3B7?logo=render)](https://career-dna-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Career DNA** is an end-to-end, full-stack AI career intelligence platform. It analyzes raw text resumes, GitHub repository activity, and technical project artifacts to compute an engineer's **Career DNA Score**, readiness level, primary archetype, skill gap matrix, and personalized actionable learning roadmap.

---

## 🔗 Live Production Deployment Links

- 🌐 **Frontend Application**: `https://career-dna.vercel.app`
- ⚙️ **Backend API Service**: `https://career-dna-api.onrender.com`
- 📖 **Interactive Swagger Docs**: `https://career-dna-api.onrender.com/docs`
- 📊 **Cloud Database**: Managed PostgreSQL 17 on **Supabase**

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

## 🏗️ Cloud Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│               Vercel Frontend (React 18)               │
│         https://career-dna.vercel.app                  │
└───────────────────────────┬────────────────────────────┘
                            │  HTTPS REST (JWT Bearer)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Render Backend API (FastAPI)              │
│       https://career-dna-api.onrender.com              │
└───────────────────────────┬────────────────────────────┘
                            │  PostgreSQL Protocol
                            ▼
┌────────────────────────────────────────────────────────┐
│            Supabase Cloud Database (PostgreSQL 17)     │
│   (users, data_sources, career_dna, evidence, gaps)    │
└────────────────────────────────────────────────────────┘
```
*See complete cloud setup in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).*

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Custom AI Dark Glassmorphism Design System + Bootstrap 5
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

## 📖 Project Documentation & Assets

- 🔌 **API Documentation**: [docs/API.md](docs/API.md)
- ☁️ **Cloud Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 🎬 **3-Minute Demo Video Script**: [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
- 📹 **Showcase Video Timing Guide**: [docs/SHOWCASE_VIDEO_SCRIPT.md](docs/SHOWCASE_VIDEO_SCRIPT.md)
- 🏆 **Hackathon Presentation Pitch Deck**: [docs/HACKATHON_PRESENTATION.md](docs/HACKATHON_PRESENTATION.md)
- 💼 **Resume & LinkedIn Content**: [docs/PORTFOLIO_CONTENT.md](docs/PORTFOLIO_CONTENT.md)
- 🌐 **LinkedIn Announcement Post**: [docs/LINKEDIN_ANNOUNCEMENT.md](docs/LINKEDIN_ANNOUNCEMENT.md)

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
