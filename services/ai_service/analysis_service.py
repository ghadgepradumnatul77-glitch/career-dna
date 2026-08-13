from typing import Dict, List, Optional

from shared.schemas.analysis import AnalysisRequest, AnalysisResult
from shared.schemas.skill import SkillProfile
from shared.taxonomy.roles import get_role_requirements
from services.scoring.scoring_engine import calculate_role_readiness
from services.gap_engine.gap_engine import calculate_skill_gaps
from services.gap_engine.priority_engine import calculate_gap_priorities
from services.gap_engine.action_engine import generate_action_plan
from services.db_service import save_analysis_result


def run_full_analysis(request: AnalysisRequest, db_path: Optional[str] = None) -> AnalysisResult:
    """
    Orchestrate full Career DNA analysis pipeline and persist results to SQLite.

    Steps:
    1. Validate target_role taxonomy requirements.
    2. Compute overall role readiness score.
    3. Evaluate skill gaps against role requirements.
    4. Calculate gap priorities.
    5. Generate top-N Next Best Action plan.
    6. Assemble AnalysisResult.
    7. Persist AnalysisResult to SQLite database.
    8. Return AnalysisResult.
    """
    # 1. Validate taxonomy role requirements (raises ValueError if unknown)
    role_requirements = get_role_requirements(request.target_role)

    # 2. Convert skill profiles list to dict
    skills_dict: Dict[str, SkillProfile] = {
        skill.skill: skill for skill in request.skills
    }

    # 3. Calculate readiness score
    readiness_score = calculate_role_readiness(skills_dict, role_requirements)

    # 4. Calculate skill gaps
    skill_gaps = calculate_skill_gaps(skills_dict, role_requirements)

    # 5. Calculate gap priorities
    gap_priorities = calculate_gap_priorities(skill_gaps)

    # 6. Generate Next Best Actions plan
    next_best_actions = generate_action_plan(gap_priorities, limit=3)

    # 7. Classify strengths & development areas
    strengths = [
        g.skill for g in skill_gaps if g.status in ("meets_requirement", "strong")
    ]
    development_areas = [
        g.skill for g in skill_gaps if g.status in ("missing", "needs_improvement")
    ]

    # 8. Deterministic summary
    if readiness_score >= 80:
        summary_quality = "strong overall readiness"
    elif readiness_score >= 50:
        summary_quality = "moderate readiness with key development areas"
    else:
        summary_quality = "significant gaps needing targeted improvement"

    summary = (
        f"Career DNA analysis for user '{request.user_id}' targeting '{request.target_role}': "
        f"Readiness score is {readiness_score}% ({summary_quality}). "
        f"Identified {len(strengths)} strengths and {len(development_areas)} development areas."
    )

    result = AnalysisResult(
        user_id=request.user_id,
        target_role=request.target_role,
        readiness_score=readiness_score,
        skills=list(request.skills),
        strengths=strengths,
        development_areas=development_areas,
        skill_gaps=skill_gaps,
        gap_priorities=gap_priorities,
        next_best_actions=next_best_actions,
        summary=summary,
    )

    # 9. Persist result to SQLite
    save_analysis_result(result, db_path=db_path)

    return result
