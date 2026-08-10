import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    
    target_role = Column(String(255), nullable=False)
    match_percentage = Column(Float, default=0.0)
    
    existing_skills = Column(JSON, nullable=True)  # List of matched skills
    missing_skills = Column(JSON, nullable=True)   # List of missing skills required for target_role
    gap_details = Column(JSON, nullable=True)       # Breakdown of skill gaps with priority scores

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="skill_gaps")
