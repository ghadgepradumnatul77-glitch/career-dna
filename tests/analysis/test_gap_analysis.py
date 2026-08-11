"""Tests for Gap Analysis MVP."""

import json

from services.evidence_engine import CandidateProfile, UnifiedEvidence
from services.gap_analysis import SkillGap, SkillGapResult, analyze_skill_gap


def _evidence(skill_id, source):
    return UnifiedEvidence(
        skill_id=skill_id,
        source=source,
        evidence_type="skill_claim",
        raw_term=skill_id,
        evidence_text=skill_id,
    )


def _role(*skill_ids):
    return {
        "id": "software_engineer",
        "requirements": [{"skill_id": skill_id} for skill_id in skill_ids],
    }


def test_all_required_skills_present():
    candidate = CandidateProfile(
        normalized_skills=["python", "sql"],
        evidence=[_evidence("python", "resume"), _evidence("sql", "github")],
    )
    result = analyze_skill_gap(candidate, _role("python", "sql"))
    assert [gap.skill_id for gap in result.present_skills] == ["python", "sql"]
    assert result.missing_skills == []


def test_missing_skills_detected():
    candidate = CandidateProfile(normalized_skills=["python"])
    result = analyze_skill_gap(candidate, _role("python", "docker", "sql"))
    assert [gap.skill_id for gap in result.present_skills] == ["python"]
    assert [gap.skill_id for gap in result.missing_skills] == ["docker", "sql"]
    assert all(gap.status == "missing" for gap in result.missing_skills)


def test_resume_and_github_sources_preserved():
    candidate = CandidateProfile(
        normalized_skills=["python"],
        evidence=[_evidence("python", "resume"), _evidence("python", "github")],
    )
    result = analyze_skill_gap(candidate, _role("python"))
    assert result.present_skills[0].evidence_sources == ["resume", "github"]


def test_empty_candidate_profile():
    result = analyze_skill_gap(CandidateProfile(), _role("python", "sql"))
    assert result.present_skills == []
    assert [gap.skill_id for gap in result.missing_skills] == ["python", "sql"]


def test_empty_role_requirement():
    candidate = CandidateProfile(normalized_skills=["python"], evidence=[_evidence("python", "resume")])
    result = analyze_skill_gap(candidate, _role())
    assert result.role_id == "software_engineer"
    assert result.present_skills == []
    assert result.missing_skills == []


def test_duplicate_sources_removed():
    candidate = CandidateProfile(
        normalized_skills=["python"],
        evidence=[
            _evidence("python", "resume"),
            _evidence("python", "resume"),
            _evidence("python", "github"),
            _evidence("python", "github"),
        ],
    )
    result = analyze_skill_gap(candidate, _role("python", "python"))
    assert len(result.present_skills) == 1
    assert result.present_skills[0].evidence_sources == ["resume", "github"]


def test_deterministic_output():
    candidate = CandidateProfile(
        normalized_skills=["sql", "python"],
        evidence=[_evidence("python", "github"), _evidence("python", "resume")],
    )
    role = _role("python", "docker", "sql")
    first = analyze_skill_gap(candidate, role).to_dict()
    second = analyze_skill_gap(candidate, role).to_dict()
    assert first == second
    assert [item["skill_id"] for item in first["present_skills"]] == ["python", "sql"]


def test_json_serialization():
    result = SkillGapResult(
        role_id="software_engineer",
        present_skills=[SkillGap("python", "present", ["resume"])],
        missing_skills=[SkillGap("docker", "missing")],
    )
    loaded = json.loads(json.dumps(result.to_dict()))
    assert loaded == {
        "role_id": "software_engineer",
        "present_skills": [
            {"skill_id": "python", "status": "present", "evidence_sources": ["resume"]}
        ],
        "missing_skills": [
            {"skill_id": "docker", "status": "missing", "evidence_sources": []}
        ],
        "warnings": [],
    }
