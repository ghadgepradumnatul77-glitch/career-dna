import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    
    target_role = Column(String(255), nullable=True)
    category = Column(String(50), nullable=False)  # 'project', 'course', 'certification'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_skill = Column(String(150), nullable=False)
    priority = Column(String(20), default="medium")  # 'high', 'medium', 'low'
    resource_url = Column(String(500), nullable=True)
    estimated_hours = Column(Integer, default=10)
    is_completed = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="recommendations")
