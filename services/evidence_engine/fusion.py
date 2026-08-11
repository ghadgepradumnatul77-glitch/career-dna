"""Evidence fusion orchestration."""

from typing import Any, Iterable, List

from services.evidence_engine.models import CandidateProfile, UnifiedEvidence


def _append_skill(skill_id: Any, skills: List[str], seen: set[str]) -> None:
    if isinstance(skill_id, str) and skill_id and skill_id not in seen:
        seen.add(skill_id)
        skills.append(skill_id)


def _resume_evidence(resume_result: Any) -> Iterable[UnifiedEvidence]:
    for normalized_skill in resume_result.normalized_skills:
        for item in normalized_skill.evidence:
            yield UnifiedEvidence(
                skill_id=item.skill_id,
                source="resume",
                evidence_type=item.evidence_type,
                raw_term=item.raw_term,
                evidence_text=item.evidence_text,
                source_section=item.source_section,
            )


def _github_evidence(github_result: Any) -> Iterable[UnifiedEvidence]:
    for repository in github_result.repositories:
        for item in repository.evidence:
            yield UnifiedEvidence(
                skill_id=item.skill_id,
                source="github",
                evidence_type=item.evidence_type,
                raw_term=item.raw_term,
                evidence_text=item.evidence_text,
                repository_name=item.repository_name,
                repository_url=item.repository_url,
                file_path=item.file_path,
                commit_sha=item.commit_sha,
                source_ref=item.source_ref,
            )


def fuse_evidence(resume_result: Any, github_result: Any) -> CandidateProfile:
    """Merge analyzer results without scoring, inference, or recommendation."""

    skills: List[str] = []
    seen: set[str] = set()

    for normalized_skill in resume_result.normalized_skills:
        _append_skill(normalized_skill.skill_id, skills, seen)
    for skill_id in github_result.all_normalized_skills:
        _append_skill(skill_id, skills, seen)

    evidence = list(_resume_evidence(resume_result))
    evidence.extend(_github_evidence(github_result))
    return CandidateProfile(normalized_skills=skills, evidence=evidence)
