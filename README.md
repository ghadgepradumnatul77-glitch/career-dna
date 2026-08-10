# Career DNA — Evidence-Backed AI Career Intelligence Platform

Frontend UI/UX codebase built for **HackNexus '26**.

Career DNA analyzes candidate resumes, GitHub repositories, and project evidence to prove demonstrated technical skills, calculate target role readiness, pinpoint critical skill gaps, and prescribe the **Next Best Action**.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite 5
- **Language**: JavaScript (ES6+)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios (with custom interceptor resilience layer)
- **Icons**: Lucide React
- **Data Visualizations**: Custom SVG Gauges & Recharts
- **Styling**: Modern CSS System with CSS Variables, Dark Futuristic Aesthetic & Glassmorphism

---

## 📁 Project Structure

```
career-dna-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AppLayout.jsx
│   │   ├── dashboard/
│   │   │   ├── ReadinessScore.jsx
│   │   │   ├── SkillOverview.jsx
│   │   │   ├── Strengths.jsx
│   │   │   ├── Weaknesses.jsx
│   │   │   └── CareerSummary.jsx
│   │   ├── evidence/
│   │   │   ├── EvidenceCard.jsx
│   │   │   ├── EvidenceList.jsx
│   │   │   └── ConfidenceBadge.jsx
│   │   ├── gaps/
│   │   │   ├── SkillGapCard.jsx
│   │   │   ├── GapPriority.jsx
│   │   │   └── RoleSelector.jsx
│   │   └── nextAction/
│   │       ├── ActionCard.jsx
│   │       └── Roadmap.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   ├── mockCareerDNA.js
│   │   ├── mockSkillGaps.js
│   │   ├── mockNextAction.js
│   │   └── mockEvidence.js
│   ├── hooks/
│   │   └── useApi.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Setup.jsx
│   │   ├── Processing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Evidence.jsx
│   │   ├── SkillGaps.jsx
│   │   ├── NextAction.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js           # Real FastAPI Axios client
│   │   ├── mockApi.js       # Standalone mock API client
│   │   └── apiAdapter.js    # Resilient dual-mode API adapter
│   ├── styles/
│   │   ├── variables.css
│   │   ├── globals.css
│   │   ├── layout.css
│   │   └── responsive.css
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set mock mode or backend API URL in `.env`:
```env
# Toggle standalone mock mode vs live FastAPI backend
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Backend API Integration Contract

All backend communication goes through `src/services/apiAdapter.js`. The FastAPI backend expects these endpoints:

1. **`POST /upload-resume`** (`multipart/form-data`) - Upload PDF resume
2. **`POST /link-github`** (`{ "username": "string" }`) - Link GitHub profile
3. **`GET /career-dna/{user_id}`** - Fetch readiness score & skill breakdown
4. **`GET /skill-gaps/{user_id}/{role}`** - Fetch target role gaps
5. **`GET /next-action/{user_id}/{role}`** - Fetch Next Best Action & roadmap
6. **`GET /health`** - Check backend API health

When `VITE_USE_MOCK_API=true`, all API calls return realistic mock data instantly, allowing 100% demo capabilities even without a live backend!

---

## 🎯 Target Roles Supported (MVP)
1. **AI/ML Engineer**
2. **Software Engineer**
3. **Data Scientist**

Users can seamlessly switch between target roles in real-time from the Navbar, Dashboard, Skill Gaps, or Next Action screens.

---

## 🏆 Hackathon Demo Flow
`Landing Page (/)` ➔ `Candidate Setup (/setup)` ➔ `Processing Screen (/processing)` ➔ `Career DNA Dashboard (/dashboard)` ➔ `Click Skill Evidence (/evidence/python)` ➔ `Skill Gap Matrix (/gaps)` ➔ `Next Best Action Roadmap (/next-action)`
