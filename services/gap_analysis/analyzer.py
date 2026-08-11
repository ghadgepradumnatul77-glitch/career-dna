"""Deterministic comparison of candidate skills with role requirements."""

from typing import Any, Dict, Iterable, List

from services.gap_analysis.models import SkillGap, SkillGapResult


def _read_value(value: Any, key: str, default: Any) -> Any:
    if isinstance(value, dict):
        return value.get(key, default)
    return getattr(value, key, default)


def _required_skill_ids(role_requirement: Any) -> Iterable[str]:
    requirements = _read_value(role_requirement, "requirements", [])
    if not isinstance(requirements, (list, tuple)):
        return
    seen: set[str] = set()
    for requirement in requirements:
        skill_id = _read_value(requirement, "skill_id", None)
        if isinstance(skill_id, str) and skill_id and skill_id not in seen:
            seen.add(skill_id)
            yield skill_id


def _candidate_skill_ids(candidate_profile: Any) -> set[str]:
    skills = _read_value(candidate_profile, "normalized_skills", [])
    if not isinstance(skills, (list, tuple)):
        return set()
    return {skill_id for skill_id in skills if isinstance(skill_id, str) and skill_id}


def _evidence_sources(candidate_profile: Any) -> Dict[str, List[str]]:
    sources_by_skill: Dict[str, List[str]] = {}
    seen_by_skill: Dict[str, set[str]] = {}
    evidence = _read_value(candidate_profile, "evidence", [])
    if not isinstance(evidence, (list, tuple)):
        return sources_by_skill

    for item in evidence:
        skill_id = _read_value(item, "skill_id", None)
        source = _read_value(item, "source", None)
        if not isinstance(skill_id, str) or not skill_id:
            continue
        if not isinstance(source, str) or not source:
            continue
        skill_sources = sources_by_skill.setdefault(skill_id, [])
        seen_sources = seen_by_skill.setdefault(skill_id, set())
        if source not in seen_sources:
            seen_sources.add(source)
            skill_sources.append(source)
    return sources_by_skill


def analyze_skill_gap(candidate_profile: Any, role_requirement: Any) -> SkillGapResult:
    """Classify ordered canonical role skills as present or missing."""

    role_id = _read_value(role_requirement, "id", "")
    if not isinstance(role_id, str):
        role_id = ""

    candidate_skills = _candidate_skill_ids(candidate_profile)
    sources_by_skill = _evidence_sources(candidate_profile)
    result = SkillGapResult(role_id=role_id)

    for skill_id in _required_skill_ids(role_requirement):
        if skill_id in candidate_skills:
            result.present_skills.append(
                SkillGap(
                    skill_id=skill_id,
                    status="present",
                    evidence_sources=list(sources_by_skill.get(skill_id, [])),
                )
            )
        else:
            result.missing_skills.append(
                SkillGap(skill_id=skill_id, status="missing", evidence_sources=[])
            )
    return result
