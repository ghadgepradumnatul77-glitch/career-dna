from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from shared.schemas.career_dna import CareerDNA
from shared.schemas.gap import SkillGap
from shared.schemas.gap_priority import GapPriority
from shared.schemas.next_action import NextBestAction
from services.db_service import (
    get_latest_career_dna,
    get_latest_gaps,
    get_latest_priorities,
    get_latest_actions,
)

router = APIRouter()


@router.get("/career-dna/{user_id}", response_model=CareerDNA)
def get_career_dna(user_id: str):
    """
    Retrieve latest computed CareerDNA readiness profile for a student.
    """
    dna = get_latest_career_dna(user_id)
    if not dna:
        raise HTTPException(
            status_code=404,
            detail=f"No Career DNA assessment found for user_id '{user_id}'."
        )
    return dna


@router.get("/gaps/{user_id}")
def get_gaps(
    user_id: str,
    unresolved_only: bool = Query(default=False, description="Filter for missing/needs_improvement gaps only")
):
    """
    Retrieve evaluated SkillGap records for a student.
    """
    result = get_latest_gaps(user_id, unresolved_only=unresolved_only)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No skill gap evaluation found for user_id '{user_id}'."
        )
    return result


@router.get("/priorities/{user_id}")
def get_priorities(user_id: str):
    """
    Retrieve ranked GapPriority records for unresolved skill gaps.
    """
    result = get_latest_priorities(user_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No gap priority evaluation found for user_id '{user_id}'."
        )
    return result


@router.get("/actions/{user_id}")
def get_actions(
    user_id: str,
    limit: int = Query(default=3, ge=1, le=10, description="Maximum number of recommended actions to return")
):
    """
    Retrieve recommended NextBestAction plan items for a student.
    """
    result = get_latest_actions(user_id, limit=limit)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No recommended action plan found for user_id '{user_id}'."
        )
    return result
