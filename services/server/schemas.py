"""Pydantic HTTP request and response schemas for Career-DNA."""

from typing import Any, Dict, Optional

from pydantic import BaseModel, field_validator


class AnalyzeRequest(BaseModel):
    """Career analysis request body."""

    resume_text: str
    github_username: Optional[str] = None

    @field_validator("resume_text")
    @classmethod
    def validate_resume_text(cls, value: str) -> str:
        """Reject empty and whitespace-only resume content."""

        if not value.strip():
            raise ValueError("resume text is required")
        return value


class AnalyzeResponse(BaseModel):
    """Stable success/error response envelope."""

    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, str]] = None
