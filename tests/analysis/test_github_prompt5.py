"""Prompt-5 README and repository activity contract tests."""

import base64
import json

import pytest

from services.github_analyzer.analyzer import (
    MAX_README_BYTES,
    _decode_readme_content,
    _extract_skills_from_readme,
    _fetch_and_analyze_commits,
    _fetch_and_analyze_readme,
)
from services.github_analyzer.errors import GitHubAnalysisError
from services.github_analyzer.models import GitHubAnalysisResult, GitHubRepositoryResult
from services.skill_normalizer.normalizer import SkillNormalizer


class StubClient:
    def __init__(self, *, readme=None, commits=None, error=None):
        self.readme = readme
        self.commits = [] if commits is None else commits
        self.error = error

    def get_readme(self, owner, repo):
        if self.error:
            raise self.error
        return self.readme

    def list_repository_commits(self, owner, repo, max_commits):
        if self.error:
            raise self.error
        return self.commits[:max_commits]


def _encoded_readme(text, *, path="docs/README.md"):
    return {
        "encoding": "base64",
        "content": base64.b64encode(text.encode()).decode(),
        "path": path,
        "download_url": "https://attacker.invalid/never-followed",
    }


@pytest.mark.parametrize(
    ("text", "expected_id", "expected_raw"),
    [
        ("Built with Python.", "python", "Python"),
        ("Built with python3.", "python", "python3"),
        ("Uses C++ daily.", "cpp", "C++"),
        ("Uses C# daily.", "csharp", "C#"),
        ("A Node.js service.", "nodejs", "Node.js"),
        ("Automated CI/CD.", "ci_cd", "CI/CD"),
        ("Natural Language Processing pipeline.", "natural_language_processing", "Natural Language Processing"),
    ],
)
def test_readme_taxonomy_terms(text, expected_id, expected_raw):
    matches = _extract_skills_from_readme(text, SkillNormalizer())
    assert any(skill_id == expected_id and raw == expected_raw for skill_id, raw, _, _ in matches)


@pytest.mark.parametrize(
    ("text", "forbidden_id"),
    [("CSS", "c"), ("React", "r"), ("Google", "go"), ("Django", "go")],
)
def test_readme_does_not_use_substring_matches(text, forbidden_id):
    ids = [item[0] for item in _extract_skills_from_readme(text, SkillNormalizer())]
    assert forbidden_id not in ids


def test_readme_malformed_base64_and_newlines_and_size_limit():
    assert _decode_readme_content("!!invalid!!") == (None, ["readme_malformed"])
    encoded = base64.b64encode(b"Python").decode()
    wrapped = "\n".join(encoded[index:index + 2] for index in range(0, len(encoded), 2))
    assert _decode_readme_content(wrapped) == ("Python", [])
    oversized = base64.b64encode(b"x" * (MAX_README_BYTES + 1)).decode()
    assert _decode_readme_content(oversized) == (None, ["readme_too_large"])


def test_readme_evidence_is_bounded_deduplicated_and_uses_api_path():
    text = "x" * 150 + " Python " + "y" * 150 + " Python"
    evidence, warnings, has_readme = _fetch_and_analyze_readme(
        StubClient(readme=_encoded_readme(text)), "owner", "repo", SkillNormalizer()
    )
    python_evidence = [item for item in evidence if item.skill_id == "python"]
    assert warnings == []
    assert has_readme is True
    assert len(python_evidence) == 1
    assert python_evidence[0].raw_term == "Python"
    assert python_evidence[0].file_path == "docs/README.md"
    assert len(python_evidence[0].evidence_text) <= 200


def _custom_normalizer(tmp_path, skill_id, name, alias):
    skills = tmp_path / f"{skill_id}-skills.yaml"
    aliases = tmp_path / f"{skill_id}-aliases.yaml"
    skills.write_text(
        f"skills:\n  - id: {skill_id}\n    name: {name}\n    category: tools_version_control\n",
        encoding="utf-8",
    )
    aliases.write_text(f"aliases:\n  {alias}: {skill_id}\n", encoding="utf-8")
    return SkillNormalizer(str(skills), str(aliases))


def test_readme_custom_taxonomy_and_bidirectional_isolation(tmp_path):
    custom = _custom_normalizer(tmp_path, "quux", "Quux Tool", "quuxer")
    assert [item[0] for item in _extract_skills_from_readme("Quux Tool and quuxer", custom)] == ["quux"]
    assert _extract_skills_from_readme("Python", custom) == []
    assert _extract_skills_from_readme("Quux Tool", SkillNormalizer()) == []


def _commit(date=None):
    author = {} if date is None else {"date": date}
    return {"commit": {"author": author}, "author": {"login": "someone"}}


@pytest.mark.parametrize(
    ("commits", "count", "earliest", "latest"),
    [
        ([], 0, None, None),
        ([_commit("2024-01-02T00:00:00Z")], 1, "2024-01-02T00:00:00Z", "2024-01-02T00:00:00Z"),
        ([_commit("2024-02-01T00:00:00Z"), _commit("2023-12-01T00:00:00Z")], 2,
         "2023-12-01T00:00:00Z", "2024-02-01T00:00:00Z"),
        ([_commit("not-a-date"), _commit()], 2, None, None),
    ],
)
def test_repository_activity_contract(commits, count, earliest, latest):
    warnings, activity = _fetch_and_analyze_commits(StubClient(commits=commits), "owner", "repo")
    assert warnings == []
    assert activity.commit_count == count
    assert activity.earliest_commit_at == earliest
    assert activity.latest_commit_at == latest


def test_repository_activity_cap_and_determinism():
    commits = [_commit(f"2024-01-{day:02d}T00:00:00Z") for day in range(1, 31)] + [_commit("2099-01-01T00:00:00Z")]
    first = _fetch_and_analyze_commits(StubClient(commits=commits), "owner", "repo")
    second = _fetch_and_analyze_commits(StubClient(commits=commits), "owner", "repo")
    assert first == second
    assert first[1].commit_count == 30
    assert first[1].latest_commit_at == "2024-01-30T00:00:00Z"


def test_repository_commit_failure_is_safe_warning():
    warnings, activity = _fetch_and_analyze_commits(
        StubClient(error=GitHubAnalysisError("github_timeout", "secret response body")), "owner", "repo"
    )
    assert warnings == ["commit_activity_unavailable: github_timeout"]
    assert activity.commit_count == 0
    assert "secret response body" not in warnings[0]


@pytest.mark.parametrize("code", ["github_rate_limited", "github_private_or_forbidden"])
def test_repository_commit_systemic_errors_propagate(code):
    with pytest.raises(GitHubAnalysisError, match=code):
        _fetch_and_analyze_commits(StubClient(error=GitHubAnalysisError(code, "safe")), "owner", "repo")


def test_activity_serialization_is_json_compatible_and_not_skill_evidence():
    repo = GitHubRepositoryResult(name="repo", url="https://github.com/o/repo")
    repo.activity.commit_count = 1
    repo.activity.latest_commit_at = "2024-01-01T00:00:00Z"
    result = GitHubAnalysisResult(username="o", profile_url="https://github.com/o", repositories=[repo])
    serialized = result.to_dict()
    json.dumps(serialized)
    assert serialized["repositories"][0]["activity"]["commit_count"] == 1
    assert serialized["repositories"][0]["evidence"] == []
    assert serialized["repositories"][0]["normalized_skills"] == []
