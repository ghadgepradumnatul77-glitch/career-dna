import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class CareerDNA(Base):
    __tablename__ = "career_dna_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    
    # Core Metrics
    overall_score = Column(Float, default=0.0)
    readiness_level = Column(String(100), default="Junior")
    primary_archetype = Column(String(100), default="Software Engineer")

    # Structured DNA Aggregations
    skill_matrix = Column(JSON, nullable=True)     # e.g., {"Python": 90, "PostgreSQL": 85, "FastAPI": 88}
    domain_breakdown = Column(JSON, nullable=True) # e.g., {"Backend": 90, "Database": 85, "DevOps": 70}
    trait_scores = Column(JSON, nullable=True)     # e.g., {"Code Consistency": 88, "Documentation": 75}

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="career_dna")
