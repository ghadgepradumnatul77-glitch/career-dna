"""End-to-end validation for the mocked Career DNA pipeline."""

import json

from demo import build_demo_report


def test_full_pipeline_is_json_serializable_and_deterministic():
    first = build_demo_report().to_dict()
    second = build_demo_report().to_dict()

    assert first == second
    serialized = json.dumps(first, sort_keys=True)
    assert json.loads(serialized) == first

    assert first["candidate_summary"]["total_skills_detected"] == 3
    assert first["candidate_summary"]["evidence_sources_count"] == 2
    assert [item["skill_id"] for item in first["skills"]] == ["python", "sql", "docker"]
    assert [item["skill_id"] for item in first["present_skills"]] == ["python", "sql", "docker"]
    assert [item["skill_id"] for item in first["missing_skills"]] == ["java"]
    assert first["evidence_summary"]["resume_evidence"] > 0
    assert first["evidence_summary"]["github_evidence"] > 0
