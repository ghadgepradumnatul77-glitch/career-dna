"""HTTP contract tests for the Career-DNA FastAPI server."""

import json
import importlib

from fastapi.testclient import TestClient

from services.api.models import CareerDNAPipelineError, CareerDNAResponse
from services.server.app import app


client = TestClient(app, raise_server_exceptions=False)
server_app_module = importlib.import_module("services.server.app")


def _pipeline_response():
    return CareerDNAResponse(
        report={"candidate_summary": {"total_skills_detected": 1}, "warnings": []},
        evidence_summary={"resume_evidence": 1, "github_evidence": 0},
        skill_gaps={"present_skills": [], "missing_skills": []},
        normalized_skills=["python"],
    )


def test_health_returns_200():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "career-dna"}


def test_valid_resume_analysis_succeeds(monkeypatch):
    monkeypatch.setattr(
        server_app_module,
        "run_career_dna_pipeline",
        lambda resume_text, github_username=None: _pipeline_response(),
    )
    response = client.post("/analyze", json={"resume_text": "Python developer"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["normalized_skills"] == ["python"]


def test_empty_resume_rejected():
    response = client.post("/analyze", json={"resume_text": ""})
    assert response.status_code == 422
    assert response.json() == {
        "success": False,
        "error": {"code": "INVALID_RESUME", "message": "Resume text is required"},
    }


def test_whitespace_resume_rejected():
    response = client.post("/analyze", json={"resume_text": "   \n\t"})
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "INVALID_RESUME"


def test_invalid_json_handled_safely():
    response = client.post(
        "/analyze",
        content="{invalid-json",
        headers={"content-type": "application/json"},
    )
    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "error": {"code": "INVALID_REQUEST", "message": "Invalid request"},
    }


def test_github_optional_parameter_works(monkeypatch):
    captured = {}

    def pipeline(resume_text, github_username=None):
        captured["github_username"] = github_username
        return _pipeline_response()

    monkeypatch.setattr(server_app_module, "run_career_dna_pipeline", pipeline)
    response = client.post(
        "/analyze",
        json={"resume_text": "Python developer", "github_username": "octocat"},
    )
    assert response.status_code == 200
    assert captured == {"github_username": "octocat"}


def test_pipeline_failure_returns_sanitized_error(monkeypatch):
    def fail(resume_text, github_username=None):
        raise CareerDNAPipelineError("internal-secret-token-and-path")

    monkeypatch.setattr(server_app_module, "run_career_dna_pipeline", fail)
    response = client.post("/analyze", json={"resume_text": "Python developer"})
    serialized = response.text
    assert response.status_code == 500
    assert response.json() == {
        "success": False,
        "error": {"code": "PIPELINE_ERROR", "message": "Analysis failed"},
    }
    assert "internal-secret" not in serialized


def test_response_is_json_serializable(monkeypatch):
    monkeypatch.setattr(
        server_app_module,
        "run_career_dna_pipeline",
        lambda resume_text, github_username=None: _pipeline_response(),
    )
    response = client.post("/analyze", json={"resume_text": "Python developer"})
    assert json.loads(json.dumps(response.json())) == response.json()
