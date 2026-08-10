from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ResumeIngestRequest(BaseModel):
    raw_text: str
    file_name: Optional[str] = "resume.pdf"
    parsed_skills: Optional[List[str]] = []
    experience: Optional[List[Dict[str, Any]]] = []


class GitHubSyncRequest(BaseModel):
    github_username: str
    repos: Optional[List[Dict[str, Any]]] = []
    top_languages: Optional[Dict[str, int]] = {}


class DataSourceResponse(BaseModel):
    id: str
    user_id: str
    source_type: str
    file_name: Optional[str] = None
    github_username: Optional[str] = None
    extracted_skills: Optional[List[str]] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
