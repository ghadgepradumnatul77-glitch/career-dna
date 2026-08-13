# Career DNA - API & Integration Contract (Member 1)

This specification defines the formal REST API contract for Member 1's AI & Product Architecture modules in Career DNA.

---

## Architecture Flow

```text
+-----------------------+     +-----------------------+     +--------------------------+
|  Ingestion Service    |     |  Member 1 AI Engine   |     |   Backend / Frontend     |
|                       |     |                       |     |                          |
|  POST /evidence       | --> |  POST /analyze        | --> |  GET /career-dna/{uid}   |
|                       |     |                       |     |  GET /gaps/{uid}         |
|                       |     |                       |     |  GET /priorities/{uid}   |
|                       |     |                       |     |  GET /actions/{uid}      |
+-----------------------+     +-----------------------+     +--------------------------+
```

---

## 1. POST `/evidence`

**Purpose:** Ingests raw evidence supporting a student's skills.

### Request Body (`application/json`)
```json
{
  "user_id": "usr_12345",
  "evidence_items": [
    {
      "skill": "Python",
      "source": "github",
      "evidence_type": "code_usage",
      "source_ref": "https://github.com/student/repo",
      "strength": 85.0,
      "confidence": 90.0,
      "relevance": 90.0,
      "recency": 95.0,
      "description": "500+ commits using Python with FastAPI and PyTest"
    }
  ]
}
```

### Response (`201 Created`)
```json
{
  "status": "success",
  "user_id": "usr_12345",
  "ingested_count": 1,
  "message": "1 evidence items successfully ingested."
}
```

### Errors
- `400 Bad Request`: Validation failure on evidence scores outside `[0, 100]`.

---

## 2. POST `/analyze`

**Purpose:** Triggers full Career DNA analysis pipeline (Scoring $\rightarrow$ Gaps $\rightarrow$ Priorities $\rightarrow$ Actions).

### Request Body (`application/json`)
```json
{
  "user_id": "usr_12345",
  "target_role": "AI/ML Engineer"
}
```

### Response (`200 OK`)
```json
{
  "user_id": "usr_12345",
  "target_role": "AI/ML Engineer",
  "readiness_score": 72.50,
  "total_skills_evaluated": 8,
  "unresolved_gaps_count": 5,
  "top_action_title": "Build a data preprocessing pipeline",
  "created_at": "2026-08-09T18:54:00Z"
}
```

### Errors
- `404 Not Found`: Target role not in taxonomy (`AI/ML Engineer`, `Software Engineer`, `Data Scientist`).
- `400 Bad Request`: No evidence or skill profiles found for `user_id`.

---

## 3. GET `/career-dna/{user_id}`

**Purpose:** Retrieves student's computed `CareerDNA` readiness profile.

### Response (`200 OK`)
```json
{
  "user_id": "usr_12345",
  "target_role": "AI/ML Engineer",
  "readiness_score": 72.50,
  "skills": [
    {
      "skill": "Python",
      "proficiency": 85.0,
      "confidence": 90.0,
      "evidence_count": 4,
      "evidence_sources": ["github", "resume"],
      "summary": "Proficient Python developer"
    }
  ],
  "strengths": ["Python", "Statistics"],
  "development_areas": ["Machine Learning", "Data Processing"],
  "summary": "Demonstrates strong foundational programming and mathematics skills. Needs focused work on core Machine Learning and Data Processing."
}
```

---

## 4. GET `/gaps/{user_id}`

**Purpose:** Retrieves evaluated `SkillGap` records comparing current proficiency to target role requirements.

### Query Parameters
- `unresolved_only` (boolean, optional, default: `false`)

### Response (`200 OK`)
```json
{
  "user_id": "usr_12345",
  "target_role": "AI/ML Engineer",
  "gaps": [
    {
      "skill": "Machine Learning",
      "current_level": 55.0,
      "required_level": 85.0,
      "gap": 30.0,
      "importance": 1.00,
      "category": "machine_learning",
      "status": "needs_improvement",
      "confidence": 75.0,
      "evidence_count": 2,
      "explanation": "Machine Learning is at 55/85. The student is 30 points below the target requirement."
    }
  ]
}
```

---

## 5. GET `/priorities/{user_id}`

**Purpose:** Retrieves ranked `GapPriority` objects for unresolved skill gaps.

### Response (`200 OK`)
```json
{
  "user_id": "usr_12345",
  "target_role": "AI/ML Engineer",
  "priorities": [
    {
      "skill": "Data Processing",
      "priority_score": 94.75,
      "priority_level": "HIGH",
      "gap": 75.0,
      "importance": 0.85,
      "reason": "Data Processing has a high priority because it is a critical target skill with no demonstrated evidence found (requirement: 75)."
    }
  ]
}
```

---

## 6. GET `/actions/{user_id}`

**Purpose:** Retrieves recommended `NextBestAction` top-N action plan.

### Query Parameters
- `limit` (integer, optional, default: `3`)

### Response (`200 OK`)
```json
{
  "user_id": "usr_12345",
  "target_role": "AI/ML Engineer",
  "actions": [
    {
      "skill": "Data Processing",
      "action_type": "project",
      "title": "Build a data preprocessing pipeline",
      "description": "Create a Python pipeline using Pandas and NumPy that cleans, transforms, validates, and prepares a real dataset.",
      "estimated_effort_hours": 25,
      "expected_skill_gain": 20.0,
      "priority_score": 94.75,
      "evidence_to_collect": ["GitHub repository", "preprocessing code", "dataset documentation", "README"],
      "success_criteria": [
        "Clean raw data with zero unhandled nulls/duplicates",
        "Implement reproducible data transformation script",
        "Document pipeline steps and dataset schema in README"
      ]
    }
  ]
}
```
