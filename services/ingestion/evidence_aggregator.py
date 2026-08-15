from typing import Dict, List, Optional, Any
from shared.schemas.evidence import SkillEvidence
from shared.schemas.skill import SkillProfile
from services.db_service import get_evidence_by_user


def aggregate_evidence_to_profiles(
    user_id: str,
    db_path: Optional[str] = None
) -> List[SkillProfile]:
    """
    Retrieve stored SkillEvidence records for user_id and aggregate them into
    a list of SkillProfile objects using a deterministic proficiency formula.

    Formula Details:
    1. Item Weight W_i = (Confidence_i / 100) * (Recency_i / 100)
    2. Weighted Base Strength = sum(W_i * Strength_i) / sum(W_i)
    3. Multi-Source Boost = 1.0 + (num_distinct_sources - 1) * 0.12
    4. Evidence Count Boost = min(0.15, (evidence_count - 1) * 0.04)
    5. Final Proficiency = min(95.0, round(Base Strength * (Source Boost + Count Boost), 1))
    6. Final Confidence = min(98.0, round(mean(Confidence_i) + (num_distinct_sources - 1) * 5.0, 1))
    """
    evidence_items = get_evidence_by_user(user_id, db_path=db_path)
    if not evidence_items:
        return []

    # Group evidence items by canonical skill
    grouped: Dict[str, List[SkillEvidence]] = {}
    for ev in evidence_items:
        grouped.setdefault(ev.skill, []).append(ev)

    profiles: List[SkillProfile] = []

    for skill_name, items in grouped.items():
        count = len(items)
        sources = sorted(list(set(ev.source for ev in items)))
        num_sources = len(sources)

        # 1. Weighted Base Strength
        total_weight = 0.0
        weighted_strength_sum = 0.0
        confidence_sum = 0.0

        for ev in items:
            weight = (ev.confidence / 100.0) * (ev.recency / 100.0)
            weight = max(0.1, weight)
            total_weight += weight
            weighted_strength_sum += weight * ev.strength
            confidence_sum += ev.confidence

        base_strength = weighted_strength_sum / total_weight if total_weight > 0 else 50.0

        # 2. Multipliers
        source_boost = 1.0 + (num_sources - 1) * 0.12
        count_boost = min(0.15, (count - 1) * 0.04)

        # 3. Final Bounded Proficiency
        calculated_prof = base_strength * (source_boost + count_boost)
        proficiency = min(95.0, max(10.0, round(calculated_prof, 1)))

        # 4. Final Bounded Confidence
        mean_conf = confidence_sum / count
        confidence = min(98.0, max(50.0, round(mean_conf + (num_sources - 1) * 5.0, 1)))

        # 5. Human-readable summary
        sources_str = ", ".join(sources)
        top_ref = items[0].source_ref or items[0].source
        summary = (
            f"Demonstrated '{skill_name}' verified across {num_sources} source(s) ({sources_str}) "
            f"with {count} evidence item(s). Top evidence reference: {top_ref}."
        )

        profile = SkillProfile(
            skill=skill_name,
            proficiency=proficiency,
            confidence=confidence,
            evidence_count=count,
            evidence_sources=sources,
            summary=summary
        )
        profiles.append(profile)

    return profiles
