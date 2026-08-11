"""Deterministic Career DNA report generation."""

from dataclasses import asdict, is_dataclass
from typing import Any, Dict, List

from services.report_generator.models import CareerDNAReport


def _read_value(value: Any, key: str, default: Any) -> Any:
    if isinstance(value, dict):
        return value.get(key, default)
    return getattr(value, key, default)


def _collection_count(value: Any, count_key: str, collection_key: str) -> int:
    explicit_count = _read_value(value, count_key, None)
    if isinstance(explicit_count, int) and not isinstance(explicit_count, bool) and explicit_count >= 0:
        return explicit_count
    collection = _read_value(value, collection_key, [])
    return len(collection) if isinstance(collection, (list, tuple)) else 0


def _gap_to_dict(gap: Any) -> Dict[str, Any]:
    if isinstance(gap, dict):
        return dict(gap)
    if is_dataclass(gap):
        return asdict(gap)
    return {
        "skill_id": _read_value(gap, "skill_id", ""),
        "status": _read_value(gap, "status", ""),
        "evidence_sources": list(_read_value(gap, "evidence_sources", [])),
    }


def _merged_warnings(candidate_profile: Any, skill_gap_result: Any) -> List[str]:
    merged: List[str] = []
    seen: set[str] = set()
    for source in (candidate_profile, skill_gap_result):
        warnings = _read_value(source, "warnings", [])
        if not isinstance(warnings, (list, tuple)):
            continue
        for warning in warnings:
            if isinstance(warning, str) and warning not in seen:
                seen.add(warning)
                merged.append(warning)
    return merged


def generate_report(candidate_profile: Any, skill_gap_result: Any) -> CareerDNAReport:
    """Build an unscored, JSON-compatible report from existing analysis results."""

    normalized_skills = _read_value(candidate_profile, "normalized_skills", [])
    if not isinstance(normalized_skills, (list, tuple)):
        normalized_skills = []
    evidence = _read_value(candidate_profile, "evidence", [])
    if not isinstance(evidence, (list, tuple)):
        evidence = []

    evidence_by_skill: Dict[str, List[Any]] = {}
    source_counts: Dict[str, int] = {"resume": 0, "github": 0}
    unique_sources: List[str] = []
    seen_sources: set[str] = set()

    for item in evidence:
        skill_id = _read_value(item, "skill_id", None)
        source = _read_value(item, "source", None)
        if isinstance(skill_id, str) and skill_id:
            evidence_by_skill.setdefault(skill_id, []).append(item)
        if isinstance(source, str) and source:
            source_counts[source] = source_counts.get(source, 0) + 1
            if source not in seen_sources:
                seen_sources.add(source)
                unique_sources.append(source)

    skills: List[Dict[str, Any]] = []
    seen_skills: set[str] = set()
    for skill_id in normalized_skills:
        if not isinstance(skill_id, str) or not skill_id or skill_id in seen_skills:
            continue
        seen_skills.add(skill_id)
        skill_evidence = evidence_by_skill.get(skill_id, [])
        skill_sources: List[str] = []
        seen_skill_sources: set[str] = set()
        for item in skill_evidence:
            source = _read_value(item, "source", None)
            if isinstance(source, str) and source and source not in seen_skill_sources:
                seen_skill_sources.add(source)
                skill_sources.append(source)
        skills.append(
            {
                "skill_id": skill_id,
                "sources": skill_sources,
                "evidence_count": len(skill_evidence),
            }
        )

    present = _read_value(skill_gap_result, "present_skills", [])
    missing = _read_value(skill_gap_result, "missing_skills", [])
    present_skills = [_gap_to_dict(item) for item in present] if isinstance(present, (list, tuple)) else []
    missing_skills = [_gap_to_dict(item) for item in missing] if isinstance(missing, (list, tuple)) else []

    return CareerDNAReport(
        candidate_summary={
            "total_skills_detected": len(skills),
            "evidence_sources_count": len(unique_sources),
            "project_count": _collection_count(candidate_profile, "project_count", "projects"),
            "experience_count": _collection_count(candidate_profile, "experience_count", "experience"),
        },
        skills=skills,
        present_skills=present_skills,
        missing_skills=missing_skills,
        evidence_summary={
            "resume_evidence": source_counts["resume"],
            "github_evidence": source_counts["github"],
        },
        warnings=_merged_warnings(candidate_profile, skill_gap_result),
    )
