from typing import List, Optional

from shared.schemas.gap import SkillGap
from shared.schemas.gap_priority import GapPriority


def _format_num(value: float) -> str:
    """Format float numbers cleanly (e.g. 55.0 -> '55', 72.5 -> '72.5')."""
    if int(value) == value:
        return str(int(value))
    return str(round(value, 2))


def _generate_priority_reason(gap: SkillGap, priority_level: str) -> str:
    """Generate a deterministic, explainable rationale for priority assignment."""
    skill = gap.skill
    gap_val = _format_num(gap.gap)
    req_val = _format_num(gap.required_level)
    imp_pct = _format_num(gap.importance * 100)

    if priority_level == "HIGH":
        if gap.status == "missing":
            return (
                f"{skill} has a high priority because it is a critical target skill "
                f"with no demonstrated evidence found (requirement: {req_val})."
            )
        else:
            return (
                f"{skill} has a high priority because it is a critical target skill "
                f"with a significant proficiency gap of {gap_val} points."
            )

    elif priority_level == "MEDIUM":
        if gap.status == "missing":
            return (
                f"{skill} has a medium priority as it is a missing skill "
                f"with moderate role importance ({imp_pct}%)."
            )
        else:
            return (
                f"{skill} has a medium priority due to a moderate proficiency gap of {gap_val} points."
            )

    else:  # LOW
        if gap.status == "missing":
            return (
                f"{skill} has a low priority as it is a missing skill "
                f"with lower role importance ({imp_pct}%)."
            )
        else:
            return (
                f"{skill} has a low priority as it represents a minor proficiency gap of {gap_val} points."
            )


def calculate_gap_priorities(gaps: List[SkillGap]) -> List[GapPriority]:
    """
    Calculate deterministic priority scores for unresolved skill gaps.

    Formula:
    gap_ratio = gap / required_level
    raw_score = (gap_ratio * 0.45) + (importance * 0.35) + (((100 - current_level) / 100) * 0.20)
    priority_score = round(raw_score * 100, 2)  (bounded 0 - 100)

    Classifications:
    - HIGH: priority_score >= 70
    - MEDIUM: 40 <= priority_score < 70
    - LOW: priority_score < 40

    Resolved skills ('meets_requirement', 'strong') are excluded.
    Returns list sorted by priority_score descending.
    """
    priorities: List[GapPriority] = []

    for g in gaps:
        # Only unresolved gaps receive priority
        if g.status not in ("missing", "needs_improvement"):
            continue

        # 1. Gap Ratio
        if g.required_level > 0:
            gap_ratio = g.gap / g.required_level
        else:
            gap_ratio = 0.0
        gap_ratio = max(0.0, min(1.0, gap_ratio))

        # 2. Importance
        importance_comp = max(0.0, min(1.0, g.importance))

        # 3. Current Level Deficit
        deficit_comp = (100.0 - g.current_level) / 100.0
        deficit_comp = max(0.0, min(1.0, deficit_comp))

        # Weighted raw score
        raw_score = (gap_ratio * 0.45) + (importance_comp * 0.35) + (deficit_comp * 0.20)

        # Scale to 0 - 100
        priority_score = round(max(0.0, min(100.0, raw_score * 100.0)), 2)

        # Classify level
        if priority_score >= 70.0:
            priority_level = "HIGH"
        elif priority_score >= 40.0:
            priority_level = "MEDIUM"
        else:
            priority_level = "LOW"

        reason = _generate_priority_reason(g, priority_level)

        priorities.append(
            GapPriority(
                skill=g.skill,
                priority_score=priority_score,
                priority_level=priority_level,
                gap=round(g.gap, 2),
                importance=round(g.importance, 2),
                reason=reason,
            )
        )

    # Sort descending by priority_score
    priorities.sort(key=lambda p: p.priority_score, reverse=True)

    return priorities


def get_top_priority_gap(gaps: List[SkillGap]) -> Optional[GapPriority]:
    """
    Return the highest priority unresolved gap, or None if no unresolved gaps exist.
    """
    priorities = calculate_gap_priorities(gaps)
    if priorities:
        return priorities[0]
    return None
