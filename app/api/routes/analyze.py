from fastapi import APIRouter, HTTPException

from shared.schemas.analysis import AnalysisRequest, AnalysisResult
from services.ai_service.analysis_service import run_full_analysis

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResult)
def analyze_career_dna(request: AnalysisRequest):
    """
    Trigger full Career DNA analysis pipeline for a student targeting a role.
    """
    try:
        return run_full_analysis(request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
