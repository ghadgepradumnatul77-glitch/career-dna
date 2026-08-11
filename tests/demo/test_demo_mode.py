"""Offline fixture-driven demonstration tests."""

import json
import importlib.util
import socket
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEMO_PATH = ROOT / "demo" / "run_demo.py"
SPEC = importlib.util.spec_from_file_location("career_dna_offline_demo", DEMO_PATH)
assert SPEC is not None and SPEC.loader is not None
DEMO_MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(DEMO_MODULE)
generate_demo_output = DEMO_MODULE.generate_demo_output


def test_demo_runs_without_network(monkeypatch, tmp_path):
    def network_forbidden(*args, **kwargs):
        raise AssertionError("offline demo attempted network access")

    monkeypatch.setattr(socket, "create_connection", network_forbidden)
    payload = generate_demo_output(tmp_path / "output.json")
    assert payload["detected_skills"]


def test_output_json_exists(tmp_path):
    output_path = tmp_path / "output.json"
    generate_demo_output(output_path)
    assert output_path.is_file()


def test_output_schema_is_valid(tmp_path):
    output_path = tmp_path / "output.json"
    payload = generate_demo_output(output_path)
    loaded = json.loads(output_path.read_text(encoding="utf-8"))
    assert loaded == payload
    assert set(payload) == {
        "candidate_profile",
        "detected_skills",
        "evidence_sources",
        "missing_skills",
        "career_report",
    }
    assert set(payload["evidence_sources"]) == {"resume", "github"}


def test_no_secrets_or_personal_information(tmp_path):
    payload = generate_demo_output(tmp_path / "output.json")
    serialized = json.dumps(payload).casefold()
    forbidden = (
        "github_token",
        "authorization",
        "bearer ",
        "api_key",
        "@example",
        "phone",
        "email",
    )
    assert all(term not in serialized for term in forbidden)


def test_deterministic_output(tmp_path):
    first = generate_demo_output(tmp_path / "first.json")
    second = generate_demo_output(tmp_path / "second.json")
    assert first == second
    assert (tmp_path / "first.json").read_bytes() == (tmp_path / "second.json").read_bytes()
