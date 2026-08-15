import json
import os
import sqlite3
import uuid
from typing import Dict, List, Optional, Any

from shared.schemas.evidence import SkillEvidence
from shared.schemas.skill import SkillProfile
from shared.schemas.career_dna import CareerDNA
from shared.schemas.gap import SkillGap
from shared.schemas.gap_priority import GapPriority
from shared.schemas.next_action import NextBestAction
from shared.schemas.analysis import AnalysisResult


DEFAULT_DB_PATH = os.environ.get("CAREER_DNA_DB_PATH", "career_dna.db")
SCHEMA_SQL_PATH = os.path.join("shared", "schema.sql")

_IN_MEMORY_CONN: Optional[sqlite3.Connection] = None


def init_db(conn: sqlite3.Connection) -> None:
    """Initialize database tables using shared/schema.sql."""
    if os.path.exists(SCHEMA_SQL_PATH):
        with open(SCHEMA_SQL_PATH, "r", encoding="utf-8") as f:
            sql_script = f.read()
        conn.executescript(sql_script)


def get_db_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Get SQLite database connection with row factory configured and schema initialized."""
    global _IN_MEMORY_CONN
    target_path = db_path or os.environ.get("CAREER_DNA_DB_PATH", "career_dna.db")

    if target_path == ":memory:":
        if _IN_MEMORY_CONN is None:
            _IN_MEMORY_CONN = sqlite3.connect(":memory:", check_same_thread=False)
            _IN_MEMORY_CONN.row_factory = sqlite3.Row
            _IN_MEMORY_CONN.execute("PRAGMA foreign_keys = ON;")
            init_db(_IN_MEMORY_CONN)
        return _IN_MEMORY_CONN

    conn = sqlite3.connect(target_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    init_db(conn)
    return conn


def reset_in_memory_db() -> None:
    """Reset global in-memory database connection for unit testing."""
    global _IN_MEMORY_CONN
    if _IN_MEMORY_CONN:
        _IN_MEMORY_CONN.close()
        _IN_MEMORY_CONN = None


def save_evidence(user_id: str, evidence: SkillEvidence, db_path: Optional[str] = None) -> None:
    """Persist a SkillEvidence item to SQLite."""
    conn = get_db_connection(db_path)
    try:
        with conn:
            # Ensure user exists
            conn.execute(
                "INSERT OR IGNORE INTO users (id, email) VALUES (?, ?)",
                (user_id, f"{user_id}@career-dna.local")
            )
            # Insert evidence
            ev_id = f"ev_{uuid.uuid4().hex}"
            conn.execute(
                """
                INSERT INTO evidence (
                    id, user_id, skill, source, evidence_type, source_ref,
                    strength, confidence, relevance, recency, description
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    ev_id, user_id, evidence.skill, evidence.source,
                    evidence.evidence_type, evidence.source_ref,
                    evidence.strength, evidence.confidence,
                    evidence.relevance, evidence.recency, evidence.description
                )
            )
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def get_evidence_by_user(user_id: str, db_path: Optional[str] = None) -> List[SkillEvidence]:
    """Retrieve all SkillEvidence records for a given user_id."""
    conn = get_db_connection(db_path)
    try:
        rows = conn.execute(
            """
            SELECT skill, source, evidence_type, source_ref, strength, confidence, relevance, recency, description
            FROM evidence
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,)
        ).fetchall()

        return [
            SkillEvidence(
                skill=row["skill"],
                source=row["source"],
                evidence_type=row["evidence_type"],
                source_ref=row["source_ref"],
                strength=row["strength"],
                confidence=row["confidence"],
                relevance=row["relevance"],
                recency=row["recency"],
                description=row["description"],
            )
            for row in rows
        ]
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def clear_user_evidence(user_id: str, source: Optional[str] = None, db_path: Optional[str] = None) -> None:
    """Clear evidence records for user_id (optionally filtered by source)."""
    conn = get_db_connection(db_path)
    try:
        with conn:
            if source:
                conn.execute("DELETE FROM evidence WHERE user_id = ? AND source = ?", (user_id, source))
            else:
                conn.execute("DELETE FROM evidence WHERE user_id = ?", (user_id,))
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def save_analysis_result(result: AnalysisResult, db_path: Optional[str] = None) -> None:
    """Persist complete AnalysisResult to SQLite across all related tables."""
    conn = get_db_connection(db_path)
    try:
        with conn:
            # 1. Ensure user exists
            conn.execute(
                "INSERT OR IGNORE INTO users (id, email) VALUES (?, ?)",
                (result.user_id, f"{result.user_id}@career-dna.local")
            )

            # 2. Insert career_dna record
            dna_id = f"dna_{uuid.uuid4().hex}"
            conn.execute(
                """
                INSERT INTO career_dna (
                    id, user_id, target_role, readiness_score, strengths, development_areas, summary
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    dna_id,
                    result.user_id,
                    result.target_role,
                    result.readiness_score,
                    json.dumps(result.strengths),
                    json.dumps(result.development_areas),
                    result.summary,
                )
            )

            # 3. Upsert skills profiles
            for s in result.skills:
                skill_id = f"skill_{result.user_id}_{s.skill}"
                conn.execute(
                    """
                    INSERT INTO skills (
                        id, user_id, skill, proficiency, confidence, evidence_count, evidence_sources, summary
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(user_id, skill) DO UPDATE SET
                        proficiency = excluded.proficiency,
                        confidence = excluded.confidence,
                        evidence_count = excluded.evidence_count,
                        evidence_sources = excluded.evidence_sources,
                        summary = excluded.summary
                    """,
                    (
                        skill_id,
                        result.user_id,
                        s.skill,
                        s.proficiency,
                        s.confidence,
                        s.evidence_count,
                        json.dumps(s.evidence_sources),
                        s.summary,
                    )
                )

            # 4. Insert skill_gaps
            for g in result.skill_gaps:
                gap_id = f"gap_{uuid.uuid4().hex}"
                conn.execute(
                    """
                    INSERT INTO skill_gaps (
                        id, career_dna_id, skill, current_level, required_level, gap,
                        importance, category, status, confidence, evidence_count, explanation
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        gap_id, dna_id, g.skill, g.current_level, g.required_level,
                        g.gap, g.importance, g.category, g.status, g.confidence,
                        g.evidence_count, g.explanation
                    )
                )

            # 5. Insert gap_priorities
            for p in result.gap_priorities:
                prio_id = f"prio_{uuid.uuid4().hex}"
                conn.execute(
                    """
                    INSERT INTO gap_priorities (
                        id, career_dna_id, skill, priority_score, priority_level, gap, importance, reason
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        prio_id, dna_id, p.skill, p.priority_score, p.priority_level,
                        p.gap, p.importance, p.reason
                    )
                )

            # 6. Insert next_best_actions
            for a in result.next_best_actions:
                act_id = f"act_{uuid.uuid4().hex}"
                conn.execute(
                    """
                    INSERT INTO next_best_actions (
                        id, career_dna_id, skill, action_type, title, description,
                        estimated_effort_hours, expected_skill_gain, priority_score,
                        evidence_to_collect, success_criteria
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        act_id, dna_id, a.skill, a.action_type, a.title, a.description,
                        a.estimated_effort_hours, a.expected_skill_gain, a.priority_score,
                        json.dumps(a.evidence_to_collect), json.dumps(a.success_criteria)
                    )
                )
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def get_latest_career_dna(user_id: str, db_path: Optional[str] = None) -> Optional[CareerDNA]:
    """Retrieve latest CareerDNA for user_id."""
    conn = get_db_connection(db_path)
    try:
        row = conn.execute(
            """
            SELECT id, user_id, target_role, readiness_score, strengths, development_areas, summary
            FROM career_dna
            WHERE user_id = ?
            ORDER BY created_at DESC LIMIT 1
            """,
            (user_id,)
        ).fetchone()

        if not row:
            return None

        # Fetch skills for user
        skill_rows = conn.execute(
            "SELECT skill, proficiency, confidence, evidence_count, evidence_sources, summary FROM skills WHERE user_id = ?",
            (user_id,)
        ).fetchall()

        skills = [
            SkillProfile(
                skill=sr["skill"],
                proficiency=sr["proficiency"],
                confidence=sr["confidence"],
                evidence_count=sr["evidence_count"],
                evidence_sources=json.loads(sr["evidence_sources"]),
                summary=sr["summary"]
            )
            for sr in skill_rows
        ]

        return CareerDNA(
            user_id=row["user_id"],
            target_role=row["target_role"],
            readiness_score=row["readiness_score"],
            skills=skills,
            strengths=json.loads(row["strengths"]),
            development_areas=json.loads(row["development_areas"]),
            summary=row["summary"],
        )
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def get_latest_gaps(user_id: str, unresolved_only: bool = False, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieve latest SkillGap records for user_id."""
    conn = get_db_connection(db_path)
    try:
        dna_row = conn.execute(
            "SELECT id, target_role FROM career_dna WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            (user_id,)
        ).fetchone()

        if not dna_row:
            return None

        dna_id = dna_row["id"]
        target_role = dna_row["target_role"]

        if unresolved_only:
            query = "SELECT * FROM skill_gaps WHERE career_dna_id = ? AND status IN ('missing', 'needs_improvement') ORDER BY importance DESC, gap DESC"
        else:
            query = "SELECT * FROM skill_gaps WHERE career_dna_id = ? ORDER BY importance DESC, gap DESC"

        gap_rows = conn.execute(query, (dna_id,)).fetchall()

        gaps = [
            SkillGap(
                skill=gr["skill"],
                current_level=gr["current_level"],
                required_level=gr["required_level"],
                gap=gr["gap"],
                importance=gr["importance"],
                category=gr["category"],
                status=gr["status"],
                confidence=gr["confidence"],
                evidence_count=gr["evidence_count"],
                explanation=gr["explanation"]
            )
            for gr in gap_rows
        ]

        return {
            "user_id": user_id,
            "target_role": target_role,
            "gaps": gaps
        }
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def get_latest_priorities(user_id: str, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieve latest GapPriority rankings for user_id."""
    conn = get_db_connection(db_path)
    try:
        dna_row = conn.execute(
            "SELECT id, target_role FROM career_dna WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            (user_id,)
        ).fetchone()

        if not dna_row:
            return None

        dna_id = dna_row["id"]
        target_role = dna_row["target_role"]

        prio_rows = conn.execute(
            "SELECT * FROM gap_priorities WHERE career_dna_id = ? ORDER BY priority_score DESC",
            (dna_id,)
        ).fetchall()

        priorities = [
            GapPriority(
                skill=pr["skill"],
                priority_score=pr["priority_score"],
                priority_level=pr["priority_level"],
                gap=pr["gap"],
                importance=pr["importance"],
                reason=pr["reason"]
            )
            for pr in prio_rows
        ]

        return {
            "user_id": user_id,
            "target_role": target_role,
            "priorities": priorities
        }
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()


def get_latest_actions(user_id: str, limit: int = 3, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieve latest NextBestAction recommendations for user_id."""
    conn = get_db_connection(db_path)
    try:
        dna_row = conn.execute(
            "SELECT id, target_role FROM career_dna WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            (user_id,)
        ).fetchone()

        if not dna_row:
            return None

        dna_id = dna_row["id"]
        target_role = dna_row["target_role"]

        act_rows = conn.execute(
            "SELECT * FROM next_best_actions WHERE career_dna_id = ? ORDER BY priority_score DESC LIMIT ?",
            (dna_id, limit)
        ).fetchall()

        actions = [
            NextBestAction(
                skill=ar["skill"],
                action_type=ar["action_type"],
                title=ar["title"],
                description=ar["description"],
                estimated_effort_hours=ar["estimated_effort_hours"],
                expected_skill_gain=ar["expected_skill_gain"],
                priority_score=ar["priority_score"],
                evidence_to_collect=json.loads(ar["evidence_to_collect"]),
                success_criteria=json.loads(ar["success_criteria"])
            )
            for ar in act_rows
        ]

        return {
            "user_id": user_id,
            "target_role": target_role,
            "actions": actions
        }
    finally:
        if conn != _IN_MEMORY_CONN:
            conn.close()
