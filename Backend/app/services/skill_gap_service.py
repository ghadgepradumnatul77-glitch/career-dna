from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.skill_gap import SkillGap
from app.models.career_dna import CareerDNA
from app.services.dna_service import get_user_career_dna

ROLE_BENCHMARKS = {
    "Senior Backend Engineer": ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker", "REST API", "System Design", "Redis"],
    "Lead Data Engineer": ["Python", "PostgreSQL", "Pandas", "Docker", "SQL", "Spark", "Data Pipelines", "AWS"],
    "Full-Stack Architect": ["Python", "FastAPI", "PostgreSQL", "React", "TypeScript", "Docker", "CI/CD", "TailwindCSS"],
    "DevOps & Cloud Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Python", "Terraform", "PostgreSQL"]
}


def analyze_user_skill_gap(db: Session, user_id: str, target_role: str, custom_required_skills: Optional[List[str]] = None) -> SkillGap:
    """Computes skill gap for a target role and saves to DB."""
    # Get benchmark skills
    required_skills = custom_required_skills or ROLE_BENCHMARKS.get(target_role, ["Python", "PostgreSQL", "FastAPI", "Docker", "REST API"])
    
    # Get user's current skills
    dna = get_user_career_dna(db, user_id)
    user_skill_matrix = dna.skill_matrix or {}
    user_skills = set(user_skill_matrix.keys())

    existing_skills = [skill for skill in required_skills if skill in user_skills or any(skill.lower() == s.lower() for s in user_skills)]
    missing_skills = [skill for skill in required_skills if skill not in existing_skills]

    match_percentage = round((len(existing_skills) / len(required_skills)) * 100.0, 1) if required_skills else 100.0

    gap_details = {
        "total_required": len(required_skills),
        "total_matched": len(existing_skills),
        "priority_missing": missing_skills[:3],
        "secondary_missing": missing_skills[3:]
    }

    skill_gap = SkillGap(
        user_id=user_id,
        target_role=target_role,
        match_percentage=match_percentage,
        existing_skills=existing_skills,
        missing_skills=missing_skills,
        gap_details=gap_details
    )
    db.add(skill_gap)
    db.commit()
    db.refresh(skill_gap)

    return skill_gap


def get_user_skill_gaps(db: Session, user_id: str) -> List[SkillGap]:
    """Retrieve history of skill gap analysis for user."""
    return db.query(SkillGap).filter(SkillGap.user_id == user_id).order_by(SkillGap.created_at.desc()).all()
