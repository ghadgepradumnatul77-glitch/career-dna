from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.career_dna import CareerDNA
from app.models.evidence import EvidenceItem
from app.models.data_source import DataSource


def recalculate_user_career_dna(db: Session, user_id: str) -> CareerDNA:
    """Computes and updates the aggregated Career DNA profile based on all user evidence & data sources."""
    evidence_items = db.query(EvidenceItem).filter(EvidenceItem.user_id == user_id).all()
    
    # Calculate skill matrix from evidence confidence
    skill_matrix: Dict[str, float] = {}
    for item in evidence_items:
        score = int(item.confidence_score * 85) + 10  # Standardize score 10-95
        if item.skill_name in skill_matrix:
            skill_matrix[item.skill_name] = min(100.0, skill_matrix[item.skill_name] + 5.0)
        else:
            skill_matrix[item.skill_name] = float(score)

    # Domain mapping
    domains = {
        "Backend": ["Python", "FastAPI", "REST API", "Node.js", "GraphQL", "Microservices"],
        "Database": ["PostgreSQL", "SQLAlchemy", "Redis", "MongoDB"],
        "DevOps & Cloud": ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Linux"],
        "Frontend": ["React", "TypeScript", "JavaScript", "HTML", "CSS", "TailwindCSS"],
        "AI & Data": ["PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn"]
    }

    domain_breakdown: Dict[str, float] = {}
    for domain, domain_skills in domains.items():
        matched_scores = [skill_matrix[s] for s in domain_skills if s in skill_matrix]
        if matched_scores:
            domain_breakdown[domain] = round(sum(matched_scores) / len(matched_scores), 1)
        else:
            domain_breakdown[domain] = 20.0  # Baseline


    # Calculate overall DNA score
    all_scores = list(skill_matrix.values()) if skill_matrix else [30.0]
    overall_score = round(sum(all_scores) / len(all_scores), 1)

    # Determine readiness level
    if overall_score >= 85:
        readiness_level = "Senior / Lead Ready"
    elif overall_score >= 70:
        readiness_level = "Mid-Level Professional"
    elif overall_score >= 50:
        readiness_level = "Junior / Associate"
    else:
        readiness_level = "Entry / Aspiring Engineer"

    # Determine primary archetype
    highest_domain = max(domain_breakdown, key=domain_breakdown.get) if domain_breakdown else "Backend"
    archetype_map = {
        "Backend": "Backend Systems Specialist",
        "Database": "Data Architect & Database Specialist",
        "DevOps & Cloud": "Cloud & Infrastructure Engineer",
        "Frontend": "Frontend UI/UX Engineer",
        "AI & Data": "AI & Data Science Engineer"
    }
    primary_archetype = archetype_map.get(highest_domain, "Full-Stack Software Engineer")

    # Trait scores
    trait_scores = {
        "Code Verification": min(100.0, len(evidence_items) * 15.0 + 40.0),
        "Skill Breadth": min(100.0, len(skill_matrix) * 10.0 + 30.0),
        "Architectural Depth": domain_breakdown.get("Backend", 30.0)
    }

    # Fetch or create CareerDNA profile
    dna = db.query(CareerDNA).filter(CareerDNA.user_id == user_id).first()
    if not dna:
        dna = CareerDNA(user_id=user_id)
        db.add(dna)

    dna.overall_score = overall_score
    dna.readiness_level = readiness_level
    dna.primary_archetype = primary_archetype
    dna.skill_matrix = skill_matrix
    dna.domain_breakdown = domain_breakdown
    dna.trait_scores = trait_scores

    db.commit()
    db.refresh(dna)
    return dna


def get_user_career_dna(db: Session, user_id: str) -> CareerDNA:
    """Retrieve existing Career DNA or recalculate on demand."""
    dna = db.query(CareerDNA).filter(CareerDNA.user_id == user_id).first()
    if not dna:
        dna = recalculate_user_career_dna(db, user_id)
    return dna
