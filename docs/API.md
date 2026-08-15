# 📖 Career DNA API Specification

Base URL: `http://127.0.0.1:8000/api/v1`

---

## 1. Authentication APIs

### 1.1 Sign Up
- **Endpoint**: `POST /auth/signup`
- **Request Body**:
```json
{
  "email": "engineer@careerdna.ai",
  "password": "Password123!",
  "full_name": "Prashant Ghadge"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
  "email": "engineer@careerdna.ai",
  "full_name": "Prashant Ghadge",
  "is_active": true,
  "created_at": "2026-08-10T22:30:00Z"
}
```

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
```json
{
  "email": "engineer@careerdna.ai",
  "password": "Password123!"
}
```
- **Response** (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a"
}
```

### 1.3 Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response** (`200 OK`):
```json
{
  "id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
  "email": "engineer@careerdna.ai",
  "full_name": "Prashant Ghadge",
  "is_active": true,
  "created_at": "2026-08-10T22:30:00Z"
}
```

---

## 2. Ingestion APIs

### 2.1 Ingest Resume
- **Endpoint**: `POST /ingest/resume`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
```json
{
  "raw_text": "Experienced Python Backend Engineer skilled in FastAPI, PostgreSQL, React, and Machine Learning.",
  "file_name": "resume.pdf"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "e93f12a8-1234-5678-9abc-def123456789",
  "user_id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
  "source_type": "resume",
  "file_name": "resume.pdf",
  "extracted_skills": ["Python", "FastAPI", "PostgreSQL", "React", "Machine Learning"],
  "created_at": "2026-08-10T22:31:00Z"
}
```

### 2.2 Sync GitHub
- **Endpoint**: `POST /ingest/github`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
```json
{
  "github_username": "Manan274"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "f82a19b3-4321-8765-cba9-9876543210fe",
  "user_id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
  "source_type": "github",
  "github_username": "Manan274",
  "extracted_skills": ["Python", "JavaScript", "TypeScript"],
  "created_at": "2026-08-10T22:32:00Z"
}
```

---

## 3. Career DNA Core APIs

### 3.1 Get Profile & Skill Matrix
- **Endpoint**: `GET /career-dna`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response** (`200 OK`):
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "user_id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
  "overall_score": 88,
  "readiness_level": "Production Ready",
  "primary_archetype": "Backend / AI Architect",
  "skill_matrix": {
    "Python": 90,
    "FastAPI": 85,
    "PostgreSQL": 85,
    "React": 80,
    "Docker": 75
  },
  "updated_at": "2026-08-10T22:33:00Z"
}
```

---

## 4. Skill Gap APIs

### 4.1 Analyze Target Role Gap
- **Endpoint**: `POST /skill-gap/analyze`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
```json
{
  "target_role": "AI Engineer"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
  "user_id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
  "target_role": "AI Engineer",
  "match_percentage": 82.5,
  "existing_skills": ["Python", "FastAPI", "PostgreSQL", "Machine Learning"],
  "missing_skills": ["PyTorch", "LangChain", "Vector Databases"],
  "created_at": "2026-08-10T22:34:00Z"
}
```

---

## 5. Recommendation APIs

### 5.1 Generate Recommendations
- **Endpoint**: `POST /recommendations/generate?target_role=AI%20Engineer`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response** (`201 Created`):
```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "user_id": "c1f7a63b-968b-4a5e-8517-5e6e6659f10a",
    "title": "Master PyTorch & Deep Learning Fundamentals",
    "description": "Build an end-to-end neural network model using PyTorch and deploy it to production.",
    "category": "Machine Learning",
    "is_completed": false,
    "created_at": "2026-08-10T22:35:00Z"
  }
]
```

### 5.2 Toggle Completion Status
- **Endpoint**: `PATCH /recommendations/{id}/toggle`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response** (`200 OK`):
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
  "title": "Master PyTorch & Deep Learning Fundamentals",
  "is_completed": true
}
```
