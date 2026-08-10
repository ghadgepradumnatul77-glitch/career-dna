# ☁️ Career DNA Cloud Deployment Architecture

```
                                  ┌───────────────────────────────┐
                                  │           End User            │
                                  └───────────────┬───────────────┘
                                                  │
                                                  │ HTTPS
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │      Vercel (Frontend)        │
                                  │     React 18 + Vite App       │
                                  └───────────────┬───────────────┘
                                                  │
                                                  │ REST API / JWT
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │     Render / Railway (API)    │
                                  │      FastAPI + Uvicorn        │
                                  └───────────────┬───────────────┘
                                                  │
                                                  │ PostgreSQL Protocol
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │ Supabase / Railway Database   │
                                  │    Managed PostgreSQL 17      │
                                  └───────────────────────────────┘
```

---

## 1. Frontend Cloud Setup (Vercel / Netlify)
- **Root Directory**: `Frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**:
  ```env
  VITE_API_URL=https://career-dna-api.onrender.com/api/v1
  ```

---

## 2. Backend Cloud Setup (Render / Railway)
- **Root Directory**: `Backend`
- **Environment**: Python 3.11
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  ```env
  DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
  SECRET_KEY=your_production_super_secret_jwt_key
  ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=1440
  CORS_ORIGINS=["https://career-dna.vercel.app"]
  ```

---

## 3. Database Cloud Setup (Supabase / Railway PostgreSQL)
- **Service**: Managed PostgreSQL Database
- **Migration Command**:
  ```bash
  cd Backend
  alembic upgrade head
  ```
- **Verified Schema Tables**:
  - `users`
  - `data_sources`
  - `career_dna_profiles`
  - `evidence_items`
  - `skill_gaps`
  - `recommendations`
  - `alembic_version`
