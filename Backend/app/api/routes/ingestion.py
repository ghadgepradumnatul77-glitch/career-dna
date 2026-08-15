from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.data_source import DataSource
from app.models.user import User
from app.schemas.ingestion import ResumeIngestRequest, GitHubSyncRequest, DataSourceResponse
from app.services import ingestion_service

router = APIRouter(prefix="/ingest", tags=["Data Ingestion & Persistence"])


def _get_effective_user_id(db: Session, current_user_id: Optional[str]) -> str:
    """Helper to return current user or fallback demo user for hackathon testing."""
    if current_user_id:
        return current_user_id
    demo_user = db.query(User).filter(User.email == "demo@careerdna.ai").first()
    if not demo_user:
        demo_user = User(
            email="demo@careerdna.ai",
            full_name="Hackathon Demo User",
            hashed_password="hashed_demo_password"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
    return demo_user.id


@router.post("/resume", response_model=DataSourceResponse, status_code=status.HTTP_201_CREATED)
def ingest_resume(
    payload: ResumeIngestRequest,
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Ingest resume text and extract/persist skills into PostgreSQL/DB."""
    user_id = _get_effective_user_id(db, current_user_id)
    return ingestion_service.save_resume_data(
        db=db,
        user_id=user_id,
        raw_text=payload.raw_text,
        file_name=payload.file_name or "resume.pdf",
        parsed_skills=payload.parsed_skills,
        experience=payload.experience
    )


@router.post("/github", response_model=DataSourceResponse, status_code=status.HTTP_201_CREATED)
def sync_github(
    payload: GitHubSyncRequest,
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Ingest and persist GitHub repository and language metrics."""
    user_id = _get_effective_user_id(db, current_user_id)
    return ingestion_service.save_github_data(
        db=db,
        user_id=user_id,
        github_username=payload.github_username,
        repos=payload.repos,
        top_languages=payload.top_languages
    )


@router.get("/sources", response_model=List[DataSourceResponse])
def get_user_sources(
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve all ingested data sources for the active user."""
    user_id = _get_effective_user_id(db, current_user_id)
    return db.query(DataSource).filter(DataSource.user_id == user_id).order_by(DataSource.created_at.desc()).all()
