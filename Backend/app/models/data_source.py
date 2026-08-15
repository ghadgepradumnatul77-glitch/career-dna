import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    source_type = Column(String(50), nullable=False)  # 'resume' or 'github'
    
    # Metadata
    file_name = Column(String(255), nullable=True)
    github_username = Column(String(255), nullable=True)
    
    # Ingested & Extracted Data
    raw_text = Column(Text, nullable=True)
    parsed_payload = Column(JSON, nullable=True)
    extracted_skills = Column(JSON, nullable=True)  # list of skill strings or skill dicts
    extracted_experience = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="data_sources")
