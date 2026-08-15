from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

from services.ingestion.resume_parser import parse_resume_file
from services.ingestion.github_service import link_and_parse_github

router = APIRouter()


class GithubLinkRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the student")
    username: str = Field(..., description="GitHub username or profile link")


@router.post("/upload-resume")
async def upload_resume_endpoint(
    user_id: str = Form(..., description="Unique identifier for the student"),
    resume: UploadFile = File(..., description="PDF Resume file")
):
    """
    Upload and parse a candidate PDF resume file, extract skill evidence,
    and persist evidence records to SQLite under user_id.
    """
    if not resume.filename or not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only PDF resume files (.pdf) are supported."
        )

    try:
        contents = await resume.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Resume file size exceeds maximum limit of 10MB."
            )

        result = parse_resume_file(
            user_id=user_id,
            file_bytes=contents,
            filename=resume.filename
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred while parsing the resume: {str(e)}"
        )


@router.post("/link-github")
def link_github_endpoint(request: GithubLinkRequest):
    """
    Link a student's GitHub profile, query public repositories via GitHub REST API,
    extract code languages/topics/descriptions, generate SkillEvidence, and persist to SQLite.
    """
    try:
        result = link_and_parse_github(
            user_id=request.user_id,
            username=request.username
        )
        return result
    except ValueError as e:
        detail = str(e)
        status_code = 404 if "not found" in detail.lower() else 400
        raise HTTPException(status_code=status_code, detail=detail)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred while linking GitHub: {str(e)}"
        )
