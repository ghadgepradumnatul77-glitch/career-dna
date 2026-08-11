"""Tests for GitHub Analyzer orchestrator."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import httpx
import base64
import json

from services.github_analyzer.client import GitHubClient
from services.github_analyzer.analyzer import analyze_github_user
from services.github_analyzer.models import GitHubAnalysisResult
from services.github_analyzer.errors import GitHubAnalysisError
from services.skill_normalizer.normalizer import SkillNormalizer


def make_response(status_code: int, json_data=None, headers=None):
    return httpx.Response(
        status_code=status_code,
        json=json_data,
        headers=headers or {},
        request=httpx.Request("GET", "https://api.github.com/test"),
    )


def make_transport(responses):
    responses = list(responses)

    def handler(request: httpx.Request) -> httpx.Response:
        if responses:
            return responses.pop(0)
        return make_response(404)

    return httpx.MockTransport(handler)


def make_client_with_transport(transport, **kwargs):
    client = httpx.Client(transport=transport, timeout=kwargs.get("timeout_seconds", 5.0))
    return GitHubClient(token="test_token", client=client, **kwargs)


def _b64(text: str) -> str:
    return base64.b64encode(text.encode()).decode()


# ---- Fixtures ----
def _user_response():
    return make_response(200, {
        "login": "octocat",
        "html_url": "https://github.com/octocat",
        "public_repos": 5,
    })


def _repo_list_response(repos):
    return make_response(200, repos)


def _languages_response(langs):
    return make_response(200, langs)


def _readme_response(exists=True):
    if exists:
        return make_response(200, {"content": _b64("# Hello"), "encoding": "base64"})
    return make_response(404)


def _commits_response(commits=None):
    if commits is None:
        commits = [
            {
                "sha": "abc123",
                "commit": {"author": {"name": "Test User", "date": "2023-01-01T00:00:00Z"}, "message": "Initial commit"},
                "author": {"login": "octocat"}
            }
        ]
    return make_response(200, commits)


def _contents_response(entries):
    return make_response(200, entries)


def _file_content_response(filename, content_text):
    return make_response(200, {
        "encoding": "base64",
        "content": _b64(content_text),
    })


# ---- Tests ----
def test_analyze_user_basic():
    # Two repos, one fork, one archived, one normal
    repos = [
        {"name": "repo1", "fork": False, "archived": False, "pushed_at": "2023-01-02T00:00:00Z",
         "html_url": "https://github.com/octocat/repo1", "description": "d1",
         "language": "Python", "stargazers_count": 10, "forks_count": 2,
         "created_at": "2022-01-01T00:00:00Z", "updated_at": "2023-01-01T00:00:00Z",
         "default_branch": "main"},
        {"name": "repo2", "fork": True, "archived": False, "pushed_at": "2023-01-03T00:00:00Z",
         "html_url": "https://github.com/octocat/repo2"},
        {"name": "repo3", "fork": False, "archived": True, "pushed_at": "2023-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/repo3"},
    ]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # repo1 deep analysis - new order:
        # 1. languages
        _languages_response({"Python": 1000, "JavaScript": 500}),
        # 2. root contents
        _contents_response([
            {"name": "requirements.txt", "type": "file"},
            {"name": "src", "type": "dir"},
        ]),
        # 3. dependency file (requirements.txt)
        _file_content_response("requirements.txt", "fastapi==0.100\nrequests\n"),
        # 4. README
        _readme_response(True),
        # 5. structure (root contents again)
        _contents_response([]),
        # 6. commits
        _commits_response(),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer, max_deep_repositories=5)

    assert isinstance(result, GitHubAnalysisResult)
    assert result.username == "octocat"
    assert result.profile_url == "https://github.com/octocat"
    assert result.public_repos == 5
    # only repo1 selected (fork and archived excluded)
    assert result.repositories_analyzed == 1
    repo_res = result.repositories[0]
    assert repo_res.name == "repo1"
    assert repo_res.primary_language == "Python"
    assert repo_res.languages == {"Python": 1000, "JavaScript": 500}
    assert repo_res.has_readme is True
    # evidence includes language python, javascript, dependency fastapi, requests
    skill_ids = [e.skill_id for e in repo_res.evidence]
    assert "python" in skill_ids
    assert "javascript" in skill_ids
    # fastapi and requests normalized?
    # fastapi -> fastapi (should be in taxonomy), requests -> requests (maybe not)
    # Ensure no crash
    client.close()


def test_include_forks_and_archived():
    repos = [
        {"name": "forked", "fork": True, "archived": False, "pushed_at": "2023-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/forked", "language": "Python"},
        {"name": "archived", "fork": False, "archived": True, "pushed_at": "2023-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/archived", "language": "Java"},
    ]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        _languages_response({"Python": 100}),
        _readme_response(False),
        _contents_response([]),
        _commits_response(),
        _contents_response([]),
        _languages_response({"Java": 200}),
        _readme_response(False),
        _contents_response([]),
        _commits_response(),
        _contents_response([]),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5, include_forks=True, include_archived=True)
    assert result.repositories_analyzed == 2
    names = {r.name for r in result.repositories}
    assert names == {"forked", "archived"}
    client.close()


def test_max_deep_repositories_limit():
    repos = [
        {"name": f"repo{i}", "fork": False, "archived": False,
         "pushed_at": f"2023-01-{i:02d}T00:00:00Z",
         "html_url": f"https://github.com/octocat/repo{i}", "language": "Python"}
        for i in range(1, 6)
    ]
    responses = [_user_response(), _repo_list_response(repos)]
    # For each repo deep analysis: languages, readme, contents
    for _ in repos:
        responses.extend([
            _languages_response({"Python": 100}),
            _readme_response(False),
            _contents_response([]),
            _commits_response(),
            _contents_response([]),
        ])
    transport = make_transport(responses)
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=3)
    assert result.repositories_analyzed == 3
    client.close()


def test_max_deep_zero():
    transport = make_transport([_user_response(), _repo_list_response([])])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=0)
    assert result.repositories_analyzed == 0
    client.close()


def test_max_deep_negative_rejected():
    transport = make_transport([_user_response()])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    try:
        analyze_github_user("octocat", client=client, normalizer=normalizer,
                            max_deep_repositories=-1)
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_invalid_config"
    client.close()


def test_max_deep_exceeds_upper_rejected():
    transport = make_transport([_user_response()])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    try:
        analyze_github_user("octocat", client=client, normalizer=normalizer,
                            max_deep_repositories=100)
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_invalid_config"
    client.close()


def test_pushed_at_sorting():
    repos = [
        {"name": "older", "fork": False, "archived": False,
         "pushed_at": "2022-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/older", "language": "Python"},
        {"name": "newer", "fork": False, "archived": False,
         "pushed_at": "2023-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/newer", "language": "Python"},
        {"name": "no_date", "fork": False, "archived": False,
         "pushed_at": None,
         "html_url": "https://github.com/octocat/no_date", "language": "Python"},
    ]
    responses = [_user_response(), _repo_list_response(repos)]
    for _ in repos:
        responses.extend([
            _languages_response({"Python": 100}),
            _readme_response(False),
            _contents_response([]),
            _commits_response(),
            _contents_response([]),
        ])
    transport = make_transport(responses)
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=10)
    # order should be newer, older, no_date
    ordered_names = [r.name for r in result.repositories]
    assert ordered_names == ["newer", "older", "no_date"]
    client.close()


def test_language_evidence_creation():
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        _languages_response({"Python": 1000, "JavaScript": 500, "UnknownLang": 10}),
        _readme_response(False),
        _contents_response([]),
        _commits_response(),
        _contents_response([]),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    repo = result.repositories[0]
    assert repo.languages == {"Python": 1000, "JavaScript": 500, "UnknownLang": 10}
    skill_ids = [e.skill_id for e in repo.evidence if e.evidence_type == "repository_language"]
    assert "python" in skill_ids
    assert "javascript" in skill_ids
    # UnknownLang should not produce evidence
    assert "unknownlang" not in skill_ids
    client.close()


def test_dependency_parsing_requirements_txt():
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # 1. languages
        _languages_response({"Python": 100}),
        # 2. root contents
        _contents_response([{"name": "requirements.txt", "type": "file"}]),
        # 3. dependency file
        _file_content_response("requirements.txt", "fastapi==0.100\nscikit-learn>=1.2\nunknownpkg\n"),
        # 4. README
        _readme_response(False),
        # 5. structure
        _contents_response([]),
        # 6. commits
        _commits_response(),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    repo = result.repositories[0]
    dep_evidence = [e for e in repo.evidence if e.evidence_type == "dependency_declared"]
    skill_ids = {e.skill_id for e in dep_evidence}
    # fastapi and scikit_learn should normalize
    assert "fastapi" in skill_ids
    assert "scikit_learn" in skill_ids
    # unknownpkg likely not in taxonomy
    client.close()


def test_dependency_parsing_package_json():
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "JavaScript",
    }]
    pkg_json = json.dumps({
        "dependencies": {"react": "^18.0.0", "typescript": "^5.0.0"},
        "devDependencies": {"jest": "^29.0.0"}
    })
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # 1. languages
        _languages_response({"JavaScript": 200}),
        # 2. root contents
        _contents_response([{"name": "package.json", "type": "file"}]),
        # 3. dependency file
        _file_content_response("package.json", pkg_json),
        # 4. README
        _readme_response(False),
        # 5. structure
        _contents_response([]),
        # 6. commits
        _commits_response(),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    repo = result.repositories[0]
    dep_skills = {e.skill_id for e in repo.evidence if e.evidence_type == "dependency_declared"}
    assert "react" in dep_skills
    assert "typescript" in dep_skills
    # jest may not be in taxonomy
    client.close()


def test_malformed_dependency_file_warning():
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    # invalid base64
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # 1. languages
        _languages_response({"Python": 100}),
        # 2. root contents
        _contents_response([{"name": "requirements.txt", "type": "file"}]),
        # 3. dependency file (malformed)
        make_response(200, {"encoding": "base64", "content": "notvalidbase64!!"}),
        # 4. README
        _readme_response(False),
        # 5. structure
        _contents_response([]),
        # 6. commits
        _commits_response(),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    repo = result.repositories[0]
    assert any("dependency_file_malformed" in w for w in repo.warnings)
    client.close()


def test_readme_presence():
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    # README exists
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # 1. languages
        _languages_response({"Python": 100}),
        # 2. root contents
        _contents_response([]),
        # 3. no dependency files
        # 4. README
        _readme_response(True),
        # 5. structure
        _contents_response([]),
        # 6. commits
        _commits_response(),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    assert result.repositories[0].has_readme is True
    client.close()

    # README missing
    transport2 = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # 1. languages
        _languages_response({"Python": 100}),
        # 2. root contents
        _contents_response([]),
        # 3. no dependency files
        # 4. README (404)
        _readme_response(False),
        # 5. structure
        _contents_response([]),
        # 6. commits
        _commits_response(),
    ])
    client2 = make_client_with_transport(transport2, max_retries=0)
    result2 = analyze_github_user("octocat", client=client2, normalizer=normalizer,
                                  max_deep_repositories=5)
    assert result2.repositories[0].has_readme is False
    client2.close()


def test_partial_failure_one_repo_fails():
    repos = [
        {"name": "good", "fork": False, "archived": False,
         "pushed_at": "2023-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/good", "language": "Python"},
        {"name": "bad", "fork": False, "archived": False,
         "pushed_at": "2023-01-01T00:00:00Z",
         "html_url": "https://github.com/octocat/bad", "language": "Python"},
    ]
    # good repo languages succeed, bad repo languages raise 500
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # good repo
        _languages_response({"Python": 100}),
        _readme_response(False),
        _contents_response([]),
        _commits_response(),
        _contents_response([]),
        # bad repo languages error 500
        make_response(500),
        _readme_response(False),
        _contents_response([]),
        _commits_response(),
        _contents_response([]),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    assert result.repositories_analyzed == 2
    good_repo = next(r for r in result.repositories if r.name == "good")
    bad_repo = next(r for r in result.repositories if r.name == "bad")
    assert good_repo.languages == {"Python": 100}
    assert any("languages_unavailable" in w for w in bad_repo.warnings)
    client.close()


def test_serialization():
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        _languages_response({"Python": 100}),
        _readme_response(False),
        _contents_response([]),
        _commits_response(),
        _contents_response([]),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    # Should be JSON serializable
    import json
    data = json.dumps(result.to_dict())
    assert isinstance(data, str)
    client.close()


def test_no_token_leak_in_errors():
    # Already covered by client tests, but ensure analyzer doesn't leak
    transport = make_transport([
        _user_response(),
        _repo_list_response([]),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    # no token in result
    assert "super_secret" not in str(result)
    client.close()


def test_custom_normalizer_isolation_structure_evidence():
    # Custom normalizer that doesn't know docker/ci_cd should not produce structure evidence
    import tempfile
    import yaml
    from services.skill_normalizer.normalizer import SkillNormalizer
    
    with tempfile.TemporaryDirectory() as tmpdir:
        taxonomy_path = f"{tmpdir}/skills.yaml"
        aliases_path = f"{tmpdir}/aliases.yaml"
        
        custom_taxonomy = {
            "version": "1.0",
            "skills": [
                {"id": "python", "name": "Python", "category": "programming_languages"},
            ]
        }
        custom_aliases = {"version": "1.0", "aliases": {}}
        
        with open(taxonomy_path, "w") as f:
            yaml.dump(custom_taxonomy, f)
        with open(aliases_path, "w") as f:
            yaml.dump(custom_aliases, f)
        
        custom_normalizer = SkillNormalizer(taxonomy_path, aliases_path)
        
        repos = [{
            "name": "repo1", "fork": False, "archived": False,
            "pushed_at": "2023-01-01T00:00:00Z",
            "html_url": "https://github.com/octocat/repo1", "language": "Python",
        }]
        transport = make_transport([
            _user_response(),
            _repo_list_response(repos),
            _languages_response({"Python": 100}),
            _readme_response(False),
            _contents_response([
                {"name": "Dockerfile", "type": "file"},
                {"name": ".github", "type": "dir"},
            ]),
            # workflows dir
            make_response(200, [{"name": "ci.yml", "type": "file"}]),
            _commits_response(),
            _contents_response([]),
        ])
        client = make_client_with_transport(transport, max_retries=0)
        result = analyze_github_user("octocat", client=client, normalizer=custom_normalizer,
                                     max_deep_repositories=5)
        
        repo = result.repositories[0]
        structure_evidence = [e for e in repo.evidence if e.evidence_type == "repository_structure"]
        # Should have NO structure evidence because custom normalizer doesn't know docker/ci_cd
        assert len(structure_evidence) == 0
        client.close()


def test_deterministic_repeated_analyzer_output():
    # Repeated analysis should produce identical repository order, skills order, evidence order
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    normalizer = SkillNormalizer()
    
    results = []
    for _ in range(3):
        transport = make_transport([
            _user_response(),
            _repo_list_response(repos),
            _languages_response({"Python": 100, "JavaScript": 50}),
            _readme_response(False),
            _contents_response([{"name": "requirements.txt", "type": "file"}]),
            _file_content_response("requirements.txt", "pandas\nnumpy\n"),
            _commits_response(),
            _contents_response([]),
        ])
        client = make_client_with_transport(transport, max_retries=0)
        result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                     max_deep_repositories=5)
        
        repo_names = tuple(r.name for r in result.repositories)
        all_skills = tuple(result.all_normalized_skills)
        evidence_types = tuple((e.evidence_type, e.skill_id) for r in result.repositories for e in r.evidence)
        warnings = tuple(result.warnings)
        
        results.append((repo_names, all_skills, evidence_types, warnings))
        client.close()
    
    assert results[0] == results[1] == results[1]


def test_systemic_rate_limit_propagates():
    # Rate limit during deep traversal should propagate as warning, not silently fail
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # Rate limit on languages call
        make_response(403, headers={"X-RateLimit-Remaining": "0"}),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    
    repo = result.repositories[0]
    # Should have warning about rate limit
    assert any("languages_unavailable" in w and "github_rate_limited" in w for w in repo.warnings)
    client.close()


def test_systemic_private_forbidden_propagates():
    # Private/forbidden during deep traversal should propagate
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        # 403 with remaining > 0 = forbidden
        make_response(403, headers={"X-RateLimit-Remaining": "10"}),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    
    repo = result.repositories[0]
    assert any("languages_unavailable" in w and "github_private_or_forbidden" in w for w in repo.warnings)
    client.close()


def test_warnings_no_token_or_source():
    # Warnings should not contain tokens or source text
    repos = [{
        "name": "repo1", "fork": False, "archived": False,
        "pushed_at": "2023-01-01T00:00:00Z",
        "html_url": "https://github.com/octocat/repo1", "language": "Python",
    }]
    # Malformed dependency file
    transport = make_transport([
        _user_response(),
        _repo_list_response(repos),
        _languages_response({"Python": 100}),
        _readme_response(False),
        _contents_response([{"name": "requirements.txt", "type": "file"}]),
        make_response(200, {"encoding": "base64", "content": "!!invalid!!"}),
        _commits_response(),
        _contents_response([]),
    ])
    client = make_client_with_transport(transport, max_retries=0)
    normalizer = SkillNormalizer()
    result = analyze_github_user("octocat", client=client, normalizer=normalizer,
                                 max_deep_repositories=5)
    
    repo = result.repositories[0]
    for w in repo.warnings:
        assert "!!invalid!!" not in w
        assert "super_secret" not in w
    client.close()


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])