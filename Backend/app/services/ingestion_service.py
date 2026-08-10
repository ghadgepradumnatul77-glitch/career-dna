import re
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.data_source import DataSource
from app.models.evidence import EvidenceItem
from app.services.dna_service import recalculate_user_career_dna


def extract_skills_from_text(text: str) -> List[str]:
    """Basic keyword extraction for common engineering skills."""
    common_skills = [
        "Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker", "Kubernetes",
        "React", "TypeScript", "JavaScript", "Node.js", "Git", "GitHub",
        "CI/CD", "AWS", "GCP", "Azure", "GraphQL", "REST API", "Redis",
        "MongoDB", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn",
        "System Design", "Microservices", "Linux", "TailwindCSS", "HTML", "CSS"
    ]
    extracted = []
    text_lower = text.lower()
    for skill in common_skills:
        # Match word boundaries
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            extracted.append(skill)
    return extracted


def save_resume_data(db: Session, user_id: str, raw_text: str, file_name: str, parsed_skills: List[str] = None, experience: List[Dict[str, Any]] = None) -> DataSource:
    """Save ingested resume data to PostgreSQL/DB and generate evidence items."""
    skills = parsed_skills if parsed_skills else extract_skills_from_text(raw_text)
    
    ds = DataSource(
        user_id=user_id,
        source_type="resume",
        file_name=file_name,
        raw_text=raw_text,
        extracted_skills=skills,
        extracted_experience=experience or []
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)

    # Persist evidence items automatically for extracted resume skills
    for skill in skills:
        existing = db.query(EvidenceItem).filter(
            EvidenceItem.user_id == user_id,
            EvidenceItem.skill_name == skill,
            EvidenceItem.evidence_type == "resume_bullet"
        ).first()
        if not existing:
            evidence = EvidenceItem(
                user_id=user_id,
                skill_name=skill,
                evidence_type="resume_bullet",
                title=f"Resume Skill: {skill}",
                description=f"Skill '{skill}' extracted from uploaded resume '{file_name}'.",
                confidence_score=0.9,
                verification_status="verified"
            )
            db.add(evidence)
    
    db.commit()

    # Automatically update user's aggregated Career DNA profile
    recalculate_user_career_dna(db, user_id)
    
    return ds


def save_github_data(db: Session, user_id: str, github_username: str, repos: List[Dict[str, Any]] = None, top_languages: Dict[str, int] = None) -> DataSource:
    """Save ingested GitHub profile data to PostgreSQL/DB and generate evidence items."""
    languages = list(top_languages.keys()) if top_languages else []
    
    ds = DataSource(
        user_id=user_id,
        source_type="github",
        github_username=github_username,
        parsed_payload={"repos": repos, "languages": top_languages},
        extracted_skills=languages
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)

    # Create evidence items for GitHub repositories & languages
    for lang in languages:
        existing = db.query(EvidenceItem).filter(
            EvidenceItem.user_id == user_id,
            EvidenceItem.skill_name == lang,
            EvidenceItem.evidence_type == "github_repo"
        ).first()
        if not existing:
            evidence = EvidenceItem(
                user_id=user_id,
                skill_name=lang,
                evidence_type="github_repo",
                title=f"GitHub Primary Language: {lang}",
                description=f"Active code repository evidence on GitHub account @{github_username}.",
                url=f"https://github.com/{github_username}",
                confidence_score=0.95,
                verification_status="verified"
            )
            db.add(evidence)

    db.commit()

    # Automatically update user's aggregated Career DNA profile
    recalculate_user_career_dna(db, user_id)

    return ds
