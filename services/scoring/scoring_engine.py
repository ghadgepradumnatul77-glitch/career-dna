from typing import Dict, List

from shared.schemas.skill import SkillProfile
from shared.taxonomy.roles import SkillRequirement


def calculate_skill_score(
    evidence_scores: List[float],
) -> float:
    """
    Combine multiple evidence scores into one demonstrated
    skill score.

    Stronger evidence contributes more, while additional
    evidence increases confidence without allowing the score
    to exceed 100.
    """

    if not evidence_scores:
        return 0.0

    evidence_scores = [
        max(0.0, min(100.0, score))
        for score in evidence_scores
    ]

    # Strongest evidence gets the most weight.
    evidence_scores.sort(reverse=True)

    weights = [1.0, 0.7, 0.5, 0.35, 0.25]

    weighted_sum = 0.0
    total_weight = 0.0

    for index, score in enumerate(evidence_scores):
        weight = weights[index] if index < len(weights) else 0.20

        weighted_sum += score * weight
        total_weight += weight

    return round(weighted_sum / total_weight, 2)


def calculate_role_readiness(
    skills: Dict[str, SkillProfile],
    role_requirements: Dict[str, SkillRequirement],
) -> float:
    """
    Calculate overall readiness for a target role.

    A student's demonstrated proficiency is compared against
    the required level for every role skill.

    Role importance determines how strongly each skill affects
    the final readiness score.
    """

    if not role_requirements:
        return 0.0

    weighted_score = 0.0
    total_importance = 0.0

    for skill_name, requirement in role_requirements.items():

        skill_profile = skills.get(skill_name)

        if skill_profile is None:
            demonstrated_level = 0.0
        else:
            demonstrated_level = skill_profile.proficiency

        # Convert demonstrated proficiency into percentage
        # of the required level.
        coverage = (
            demonstrated_level / requirement.required_level
        ) * 100

        # A skill cannot contribute more than 100% coverage.
        coverage = min(coverage, 100.0)

        weighted_score += (
            coverage * requirement.importance
        )

        total_importance += requirement.importance

    if total_importance == 0:
        return 0.0

    return round(
        weighted_score / total_importance,
        2
    )