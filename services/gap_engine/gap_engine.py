from typing import Dict, List

from shared.schemas.skill import SkillProfile
from shared.schemas.gap import SkillGap
from shared.taxonomy.roles import SkillRequirement


def _format_num(value: float) -> str:
    """Format float numbers cleanly (e.g. 55.0 -> '55', 72.5 -> '72.5')."""
    if int(value) == value:
        return str(int(value))
    return str(round(value, 2))


def calculate_skill_gaps(
    skills: Dict[str, SkillProfile],
    role_requirements: Dict[str, SkillRequirement],
) -> List[SkillGap]:
    """
    Calculate deterministic skill gaps comparing student skill profiles
    against a target role taxonomy.

    Classification rules:
    - 'missing': No SkillProfile exists for a required role skill.
    - 'needs_improvement': current_level < required_level.
    - 'meets_requirement': current_level >= required_level and < required_level + 10.
    - 'strong': current_level >= required_level + 10.

    Sorting:
    1. Unresolved gaps ('missing', 'needs_improvement') first
    2. Higher role importance first
    3. Larger numerical gap first
    """
    gaps: List[SkillGap] = []

    for skill_name, requirement in role_requirements.items():
        req_level = requirement.required_level
        importance = requirement.importance
        category = requirement.category

        profile = skills.get(skill_name)

        if profile is None:
            current_level = 0.0
            confidence = 0.0
            evidence_count = 0
            status = "missing"
            gap_val = req_level
            explanation = (
                f"No demonstrated evidence for {skill_name} was found. "
                f"The target requirement is {_format_num(req_level)}."
            )
        else:
            current_level = profile.proficiency
            confidence = profile.confidence
            evidence_count = profile.evidence_count
            gap_val = max(req_level - current_level, 0.0)

            if current_level >= req_level + 10:
                status = "strong"
                diff = current_level - req_level
                explanation = (
                    f"{skill_name} is at {_format_num(current_level)}/{_format_num(req_level)}. "
                    f"The student exceeds the target requirement by {_format_num(diff)} points."
                )
            elif current_level >= req_level:
                status = "meets_requirement"
                explanation = (
                    f"{skill_name} is at {_format_num(current_level)}/{_format_num(req_level)}. "
                    f"The student meets the target requirement."
                )
            else:
                status = "needs_improvement"
                diff = req_level - current_level
                explanation = (
                    f"{skill_name} is at {_format_num(current_level)}/{_format_num(req_level)}. "
                    f"The student is {_format_num(diff)} points below the target requirement."
                )

        gaps.append(
            SkillGap(
                skill=skill_name,
                current_level=round(current_level, 2),
                required_level=round(req_level, 2),
                gap=round(gap_val, 2),
                importance=round(importance, 2),
                category=category,
                status=status,
                confidence=round(confidence, 2),
                evidence_count=evidence_count,
                explanation=explanation,
            )
        )

    # Sort gaps:
    # 1. Unresolved ('missing', 'needs_improvement') first
    # 2. Higher importance first
    # 3. Larger numerical gap first
    gaps.sort(
        key=lambda g: (
            0 if g.status in ("missing", "needs_improvement") else 1,
            -g.importance,
            -g.gap,
        )
    )

    return gaps


def get_unresolved_gaps(gaps: List[SkillGap]) -> List[SkillGap]:
    """
    Filter and return only unresolved skill gaps ('missing' or 'needs_improvement').
    """
    return [g for g in gaps if g.status in ("missing", "needs_improvement")]
