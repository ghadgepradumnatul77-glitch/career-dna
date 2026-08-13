from typing import Dict, List, Optional

from shared.schemas.analysis import AnalysisRequest, AnalysisResult
from shared.schemas.skill import SkillProfile
from shared.taxonomy.roles import get_role_requirements
from services.scoring.scoring_engine import calculate_role_readiness
from services.gap_engine.gap_engine import calculate_skill_gaps
from services.gap_engine.priority_engine import calculate_gap_priorities
from services.gap_engine.action_engine import generate_action_plan
from services.skill_normalizer.normalizer import normalize_skill
from services.db_service import save_analysis_result


def _canonicalize_skill_dict(skills: List[SkillProfile], role_requirements: Dict) -> Dict[str, SkillProfile]:
    """
    Map candidate skill profiles to role requirement keys using skill taxonomy & normalizer.
    """
    skills_dict: Dict[str, SkillProfile] = {}

    # Create normalized lookup map for role requirements
    req_norm_map: Dict[str, str] = {}
    for req_key in role_requirements.keys():
        norm_key = (normalize_skill(req_key) or req_key).lower().replace("_", "").replace(" ", "")
        req_norm_map[norm_key] = req_key
        req_norm_map[req_key.lower().replace("_", "").replace(" ", "")] = req_key

    for skill_profile in skills:
        raw_name = skill_profile.skill
        # Normalize skill using Member 4 normalizer
        norm_id = normalize_skill(raw_name)

        # Try matching against role requirements
        matched_req_key = None
        if norm_id:
            norm_clean = norm_id.lower().replace("_", "").replace(" ", "")
            matched_req_key = req_norm_map.get(norm_clean)

        if not matched_req_key:
            raw_clean = raw_name.lower().replace("_", "").replace(" ", "")
            matched_req_key = req_norm_map.get(raw_clean)

        final_key = matched_req_key or raw_name
        skills_dict[final_key] = skill_profile

    return skills_dict


def run_full_analysis(request: AnalysisRequest, db_path: Optional[str] = None) -> AnalysisResult:
    """
    Orchestrate full Career DNA analysis pipeline and persist results to SQLite.

    Steps:
    1. Validate target_role taxonomy requirements.
    2. Normalize and map skill profiles using Member 4 skill normalizer.
    3. Compute overall role readiness score.
    4. Evaluate skill gaps against role requirements.
    5. Calculate gap priorities.
    6. Generate top-N Next Best Action plan.
    7. Assemble AnalysisResult.
    8. Persist AnalysisResult to SQLite database.
    9. Return AnalysisResult.
    """
    # 1. Validate taxonomy role requirements (raises ValueError if unknown)
    role_requirements = get_role_requirements(request.target_role)

    # 2. Map and normalize skill profiles list to dict
    skills_dict = _canonicalize_skill_dict(request.skills, role_requirements)

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
