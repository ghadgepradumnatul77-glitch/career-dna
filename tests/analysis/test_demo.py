"""Tests for the final Career-DNA demonstration workflow."""

import json
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEMO_PATH = ROOT / "demo" / "run_demo.py"
SPEC = importlib.util.spec_from_file_location("career_dna_final_demo", DEMO_PATH)
assert SPEC is not None and SPEC.loader is not None
DEMO_MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(DEMO_MODULE)
run_demo = DEMO_MODULE.run_demo


def test_demo_executes_successfully():
    output = run_demo()
    report = output["career_dna_report"]
    assert report["candidate_summary"]["total_skills_detected"] == 4
    assert [item["skill_id"] for item in report["missing_skills"]] == ["javascript"]


def test_demo_output_json_is_valid_and_matches_sample():
    output = run_demo()
    serialized = json.dumps(output, sort_keys=True)
    assert json.loads(serialized) == output
    sample = json.loads((ROOT / "demo" / "sample_output.json").read_text(encoding="utf-8"))
    assert sample == output


def test_demo_has_required_evidence_categories():
    output = run_demo()
    resume_types = {item["evidence_type"] for item in output["evidence"]["resume"]}
    github_types = {item["evidence_type"] for item in output["evidence"]["github"]}
    assert {"project_usage", "experience_usage"} <= resume_types
    assert {"dependency_declared", "code_import", "code_usage", "readme_claim"} <= github_types


def test_demo_contains_no_token_or_secret_leakage():
    serialized = json.dumps(run_demo(), sort_keys=True).casefold()
    for forbidden in ("github_token", "authorization", "bearer ", "api_key", "secret"):
        assert forbidden not in serialized


def test_demo_output_is_deterministic():
    assert run_demo() == run_demo()
