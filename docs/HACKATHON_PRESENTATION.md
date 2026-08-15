# 🏆 Career DNA — Hackathon Presentation Deck Structure

---

### Slide 1: Title & Tagline
- **Title**: 🧬 Career DNA
- **Tagline**: AI-Powered Career Intelligence & Skill Gap Platform
- **Presenter**: Prashant Ghadge (Lead Engineer)
- **Visual**: Glassmorphic Logo & Live Demo Link (`https://career-dna.vercel.app`)

---

### Slide 2: Problem Statement
- **Resume Noise**: Static PDF resumes contain keyword stuffing and lack verification.
- **Skill Mismatch**: Software engineers struggle to identify exact missing competencies for target roles.
- **Feedback Void**: Traditional job portals provide no actionable learning guidance after rejection.

---

### Slide 3: The Career DNA Solution
- **Multi-Source Ingestion**: Natural language resume parser + GitHub repository activity sync.
- **Career DNA Metric Engine**: Algorithmic scoring of overall readiness (e.g. `88/100`), readiness tier, and archetype.
- **Target Role Gap Analyzer**: Instant gap analysis benchmarking user profile against roles like *AI Engineer* or *Backend Architect*.
- **Actionable Roadmap**: AI-generated step-by-step learning goals with completion status tracking.

---

### Slide 4: System Architecture
- **Frontend Layer**: React 18, Vite, Bootstrap 5, Custom AI Glassmorphic Styling System, Axios JWT Interceptors. Deployed on **Vercel**.
- **Backend API Layer**: FastAPI (Python 3.11), Pydantic v2 validation, Security OAuth2 JWT authentication. Deployed on **Render**.
- **Data & Migration Layer**: PostgreSQL 17, SQLAlchemy 2.0 ORM, Alembic migrations. Managed on **Supabase**.

---

### Slide 5: Key Features & UI Showcase
- **Interactive AI Dashboard**: Live metrics, skill proficiency meters, and interactive navigation tabs.
- **GitHub Metric Sync**: Automatic repository language breakdown.
- **Skill Gap Radar**: Categorized breakdown of matched skills vs. missing target competencies.
- **Dynamic Task Checkmarks**: Interactive roadmap goal toggles (`PATCH /recommendations/{id}/toggle`).

---

### Slide 6: Live Product Demonstration
- **Live Demo Workflow**:
  1. Register & Login with JWT session (`/signup` $\rightarrow$ `/dashboard`)
  2. Paste Resume Text & Sync GitHub handle `@Manan274`
  3. View Career DNA Score (88/100) & Skill Matrix
  4. Run Target Role Gap Analysis for `AI Engineer`
  5. Generate and check off learning goals

---

### Slide 7: Technical Highlights & Rigor
- **100% Test Coverage**: Passed 7/7 automated end-to-end integration tests.
- **Sub-350ms Frontend Build**: Vite production compilation in 304ms.
- **Zero Secrets Security Policy**: Strict `.gitignore` enforcement and environment variable isolation.

---

### Slide 8: Future Roadmap & Market Impact
- **LLM Integration**: Direct OpenAI/Gemini integration for automated code review evidence parsing.
- **Automated Resume File Parsing**: Native PDF and DOCX binary upload processing.
- **Enterprise Hiring Portal**: Recruiter view for candidate verification and talent search.
