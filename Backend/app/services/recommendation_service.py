from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationCreate


def generate_recommendations_for_user(db: Session, user_id: str, target_role: Optional[str] = None, missing_skills: Optional[List[str]] = None) -> List[Recommendation]:
    """Generates personalized action items/recommendations to close skill gaps."""
    skills_to_target = missing_skills or ["Docker", "Redis", "System Design"]
    role = target_role or "Senior Backend Engineer"
    
    created_recs = []
    
    for skill in skills_to_target[:3]:
        # 1. Project recommendation
        proj_rec = Recommendation(
            user_id=user_id,
            target_role=role,
            category="project",
            title=f"Build a Microservice with {skill}",
            description=f"Create a production-ready backend microservice implementing {skill} with automated test suite and Docker deployment.",
            target_skill=skill,
            priority="high",
            estimated_hours=15,
            resource_url=f"https://github.com/topics/{skill.lower()}"
        )
        db.add(proj_rec)
        created_recs.append(proj_rec)

        # 2. Course / Doc recommendation
        doc_rec = Recommendation(
            user_id=user_id,
            target_role=role,
            category="course",
            title=f"Mastering {skill} Fundamentals & Best Practices",
            description=f"In-depth guide and hands-on exercises for {skill} integration in enterprise backend applications.",
            target_skill=skill,
            priority="medium",
            estimated_hours=8,
            resource_url=f"https://devdocs.io/"
        )
        db.add(doc_rec)
        created_recs.append(doc_rec)

    db.commit()
    for r in created_recs:
        db.refresh(r)

    return created_recs


def get_user_recommendations(db: Session, user_id: str) -> List[Recommendation]:
    """Retrieve all recommendations for a user."""
    return db.query(Recommendation).filter(Recommendation.user_id == user_id).order_by(Recommendation.created_at.desc()).all()


def toggle_recommendation_completion(db: Session, rec_id: str, user_id: str) -> Optional[Recommendation]:
    """Mark a recommendation as completed or pending."""
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id, Recommendation.user_id == user_id).first()
    if rec:
        rec.is_completed = not rec.is_completed
        db.commit()
        db.refresh(rec)
    return rec
