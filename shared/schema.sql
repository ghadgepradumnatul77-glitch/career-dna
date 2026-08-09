-- Career DNA Relational Database Schema (SQLite Compatible)
-- Version 1.0 - Member 1 Foundation

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    source_ref TEXT,
    strength REAL NOT NULL,
    confidence REAL NOT NULL,
    relevance REAL NOT NULL,
    recency REAL NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    proficiency REAL NOT NULL,
    confidence REAL NOT NULL,
    evidence_count INTEGER NOT NULL,
    evidence_sources TEXT NOT NULL, -- JSON Array e.g. ["github", "resume"]
    summary TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill)
);

CREATE TABLE IF NOT EXISTS role_requirements (
    id TEXT PRIMARY KEY,
    role_name TEXT NOT NULL, -- e.g. "AI/ML Engineer"
    skill TEXT NOT NULL,     -- e.g. "Machine Learning"
    required_level REAL NOT NULL,
    importance REAL NOT NULL,
    category TEXT NOT NULL,
    UNIQUE(role_name, skill)
);

CREATE TABLE IF NOT EXISTS career_dna (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    readiness_score REAL NOT NULL,
    strengths TEXT NOT NULL,         -- JSON Array e.g. ["Python", "Statistics"]
    development_areas TEXT NOT NULL, -- JSON Array e.g. ["Machine Learning"]
    summary TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_gaps (
    id TEXT PRIMARY KEY,
    career_dna_id TEXT NOT NULL REFERENCES career_dna(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    current_level REAL NOT NULL,
    required_level REAL NOT NULL,
    gap REAL NOT NULL,
    importance REAL NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL, -- missing, needs_improvement, meets_requirement, strong
    confidence REAL NOT NULL,
    evidence_count INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gap_priorities (
    id TEXT PRIMARY KEY,
    career_dna_id TEXT NOT NULL REFERENCES career_dna(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    priority_score REAL NOT NULL,
    priority_level TEXT NOT NULL, -- HIGH, MEDIUM, LOW
    gap REAL NOT NULL,
    importance REAL NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS next_best_actions (
    id TEXT PRIMARY KEY,
    career_dna_id TEXT NOT NULL REFERENCES career_dna(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    action_type TEXT NOT NULL, -- project, practice, coursework
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_effort_hours INTEGER NOT NULL,
    expected_skill_gain REAL NOT NULL,
    priority_score REAL NOT NULL,
    evidence_to_collect TEXT NOT NULL, -- JSON Array
    success_criteria TEXT NOT NULL,    -- JSON Array
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
