import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    
    skill_name = Column(String(150), nullable=False, index=True)
    evidence_type = Column(String(50), nullable=False)  # 'github_repo', 'commit', 'resume_bullet', 'project_demo'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    confidence_score = Column(Float, default=1.0)
    verification_status = Column(String(50), default="verified")  # 'verified', 'unverified', 'pending'
    
    extra_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="evidence_items")
