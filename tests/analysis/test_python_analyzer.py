"""Tests for Python analyzer."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import httpx
import base64

from services.github_analyzer.client import GitHubClient
from services.github_analyzer.python_analyzer import (
    _collect_python_files,
    _fetch_file_content,
    _analyze_python_source,
    _match_usage_patterns,
    analyze_repository_python,
)
from services.github_analyzer.models import GitHubRepositoryResult, GitHubEvidence
from services.skill_normalizer.normalizer import SkillNormalizer
from services.github_analyzer.errors import GitHubAnalysisError


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
    return make_response(200, {"login": "octocat", "html_url": "https://github.com/octocat", "public_repos": 1})


def _repo_list_response(repos):
    return make_response(200, repos)


def _contents_response(entries):
    return make_response(200, entries)


def _file_content_response(content_text):
    return make_response(200, {"encoding": "base64", "content": _b64(content_text)})


# ---- Tests ----
def test_collect_python_files():
    entries_root = [
        {"name": "src", "type": "dir"},
        {"name": "README.md", "type": "file"},
        {"name": "test.py", "type": "file"},
    ]
    entries_src = [
        {"name": "main.py", "type": "file"},
        {"name": "utils.py", "type": "file"},
        {"name": "sub", "type": "dir"},
    ]
    entries_sub = [
        {"name": "helper.py", "type": "file"},
    ]
    transport = make_transport([
        _contents_response(entries_root),
        _contents_response(entries_src),
        _contents_response(entries_sub),
    ])
    client = make_client_with_transport(transport)
    files, warnings = _collect_python_files(client, "octocat", "repo")
    assert len(files) == 4
    paths = {f.get("path") or f.get("name") for f in files}
    assert "test.py" in paths
    assert "src/main.py" in paths
    assert "src/utils.py" in paths
    assert "src/sub/helper.py" in paths
    client.close()


def test_collect_python_files_skip_dirs():
    entries_root = [
        {"name": "venv", "type": "dir"},
        {"name": "src", "type": "dir"},
    ]
    entries_src = [{"name": "main.py", "type": "file"}]
    transport = make_transport([
        _contents_response(entries_root),
        _contents_response(entries_src),
    ])
    client = make_client_with_transport(transport)
    files, warnings = _collect_python_files(client, "octocat", "repo")
    # venv should be skipped
    paths = {f.get("path") or f.get("name") for f in files}
    assert "src/main.py" in paths
    assert "venv/lib.py" not in paths
    client.close()


def test_fetch_file_content():
    content = "print('hello')"
    transport = make_transport([_file_content_response(content)])
    client = make_client_with_transport(transport)
    src, warnings = _fetch_file_content(client, "octocat", "repo", "main.py")
    assert src == content
    assert not warnings
    client.close()


def test_fetch_file_content_malformed():
    transport = make_transport([make_response(200, {"encoding": "base64", "content": "!!invalid!!"})])
    client = make_client_with_transport(transport)
    src, warnings = _fetch_file_content(client, "octocat", "repo", "main.py")
    assert src is None
    assert any("source_file_malformed" in w for w in warnings)
    client.close()


def test_analyze_python_source_imports():
    source = "import fastapi\nfrom pandas import DataFrame\nimport numpy as np\n"
    analysis = _analyze_python_source(source, "main.py")
    raw_terms = [t for t, _ in analysis.imports]
    assert "fastapi" in raw_terms
    assert "pandas" in raw_terms
    assert "numpy" in raw_terms


def test_analyze_python_source_functions():
    source = "def foo():\n    pass\nasync def bar():\n    pass\n"
    analysis = _analyze_python_source(source, "main.py")
    assert "foo" in analysis.functions
    assert "bar" in analysis.async_functions


def test_analyze_python_source_classes():
    source = "class MyClass:\n    pass\n"
    analysis = _analyze_python_source(source, "main.py")
    assert "MyClass" in analysis.classes


def test_analyze_python_source_decorators():
    source = "@app.get('/')\ndef foo():\n    pass\n"
    analysis = _analyze_python_source(source, "main.py")
    # decorators are now tuples of (name, base)
    assert ("get", "app") in analysis.decorators


def test_analyze_python_syntax_error():
    source = "def foo(:\n    pass\n"
    analysis = _analyze_python_source(source, "main.py")
    assert any("python_syntax_error" in w for w in analysis.warnings)


def test_match_usage_patterns_fastapi_no_provenance():
    # This should NOT create FastAPI evidence because there's no FastAPI import
    source = "@app.get('/users')\ndef get_users():\n    pass\n"
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "fastapi" not in skill_ids


def test_match_usage_patterns_fastapi_with_provenance():
    # This SHOULD create FastAPI evidence because of the import and constructor
    source = "from fastapi import FastAPI\napp = FastAPI()\n@app.get('/users')\ndef get_users():\n    pass\n"
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "fastapi" in skill_ids


def test_match_usage_patterns_pandas():
    source = "import pandas as pd\ndf = pd.read_csv('data.csv')\n"
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "pandas" in skill_ids


def test_analyze_repository_python_integration():
    # Setup repo with two python files
    repo_result = GitHubRepositoryResult(name="repo1", url="https://github.com/octocat/repo1")
    # root entries
    root_entries = [
        {"name": "main.py", "type": "file", "path": "main.py"},
        {"name": "utils.py", "type": "file", "path": "utils.py"},
    ]
    main_src = "import fastapi\nfrom fastapi import FastAPI\n@app.get('/')\ndef root():\n    pass\n"
    utils_src = "import pandas as pd\ndf = pd.read_csv('data.csv')\n"
    transport = make_transport([
        _contents_response(root_entries),
        _file_content_response(main_src),
        _file_content_response(utils_src),
    ])
    client = make_client_with_transport(transport)
    normalizer = SkillNormalizer()
    evidence, warnings = analyze_repository_python(client, normalizer, repo_result, "octocat", "repo1", "https://github.com/octocat/repo1")
    skill_ids = {e.skill_id for e in evidence}
    assert "fastapi" in skill_ids
    assert "pandas" in skill_ids
    # code_import evidence
    import_ev = [e for e in evidence if e.evidence_type == "code_import"]
    usage_ev = [e for e in evidence if e.evidence_type == "code_usage"]
    assert import_ev
    assert usage_ev
    client.close()


def test_file_cap_limit():
    # Create many python files > MAX_SOURCE_FILES_PER_REPO (50)
    entries = [{"name": f"file{i}.py", "type": "file", "path": f"file{i}.py"} for i in range(60)]
    # each file content simple
    file_responses = [_file_content_response("print('hi')") for _ in range(60)]
    transport = make_transport([_contents_response(entries)] + file_responses)
    client = make_client_with_transport(transport)
    normalizer = SkillNormalizer()
    repo_result = GitHubRepositoryResult(name="repo", url="")
    evidence, warnings = analyze_repository_python(client, normalizer, repo_result, "octocat", "repo", "")
    # Should have limit warning and only 50 files processed
    assert any("source_file_limit_reached" in w for w in warnings)
    # evidence count <= 50 * (maybe imports) but not crash
    client.close()


def test_false_positive_sklearn_fit():
    # Generic fit() should NOT create scikit_learn evidence without sklearn import
    source = """
class MyModel:
    def fit(self):
        pass

model = MyModel()
model.fit()
"""
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "scikit_learn" not in skill_ids


def test_false_positive_generic_get():
    # Generic get() should NOT create FastAPI evidence without FastAPI import
    source = """
class MyApp:
    def get(self):
        pass

app = MyApp()
app.get()
"""
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "fastapi" not in skill_ids


def test_pandas_direct_import():
    # from pandas import read_csv; read_csv(...) should create evidence
    source = "from pandas import read_csv\ndf = read_csv('data.csv')\n"
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "pandas" in skill_ids


def test_numpy_alias():
    # import numpy as np; np.array(...) should create evidence
    source = "import numpy as np\narr = np.array([1,2,3])\n"
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "numpy" in skill_ids


def test_sklearn_with_import():
    # import sklearn; model.fit() should create evidence with proper provenance
    source = "import sklearn\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X, y)\n"
    analysis = _analyze_python_source(source, "main.py")
    normalizer = SkillNormalizer()
    matches = _match_usage_patterns(analysis, normalizer)
    skill_ids = [s for s, _, _ in matches]
    assert "scikit_learn" in skill_ids


def test_custom_normalizer_isolation_code_evidence():
    # Custom normalizer that doesn't know about fastapi should not produce fastapi evidence
    from services.skill_normalizer.normalizer import SkillNormalizer
    import tempfile
    import yaml
    
    # Create a custom taxonomy without fastapi
    with tempfile.TemporaryDirectory() as tmpdir:
        taxonomy_path = f"{tmpdir}/skills.yaml"
        aliases_path = f"{tmpdir}/aliases.yaml"
        
        custom_taxonomy = {
            "version": "1.0",
            "skills": [
                {"id": "python", "name": "Python", "category": "programming_languages"},
                {"id": "pandas", "name": "pandas", "category": "data_science"},
            ]
        }
        custom_aliases = {"version": "1.0", "aliases": {"py": "python", "pd": "pandas"}}
        
        with open(taxonomy_path, "w") as f:
            yaml.dump(custom_taxonomy, f)
        with open(aliases_path, "w") as f:
            yaml.dump(custom_aliases, f)
        
        custom_normalizer = SkillNormalizer(taxonomy_path, aliases_path)
        
        source = "from fastapi import FastAPI\napp = FastAPI()\n@app.get('/')\ndef root():\n    pass\n"
        analysis = _analyze_python_source(source, "main.py")
        matches = _match_usage_patterns(analysis, custom_normalizer)
        skill_ids = [s for s, _, _ in matches]
        # fastapi should NOT be in skill_ids because custom normalizer doesn't know it
        assert "fastapi" not in skill_ids


def test_nested_path_preserved():
    # Test that nested paths like src/api/main.py are preserved exactly
    entries_root = [
        {"name": "src", "type": "dir"},
    ]
    entries_src = [
        {"name": "api", "type": "dir"},
    ]
    entries_api = [
        {"name": "main.py", "type": "file", "path": "src/api/main.py"},
    ]
    transport = make_transport([
        _contents_response(entries_root),
        _contents_response(entries_src),
        _contents_response(entries_api),
    ])
    client = make_client_with_transport(transport)
    files, warnings = _collect_python_files(client, "octocat", "repo")
    paths = {f.get("path") or f.get("name") for f in files}
    assert "src/api/main.py" in paths
    assert "main.py" not in paths  # should not lose path prefix
    client.close()


def test_malformed_base64_warning():
    # Malformed base64 should produce deterministic warning
    transport = make_transport([make_response(200, {"encoding": "base64", "content": "!!invalid!!"})])
    client = make_client_with_transport(transport)
    src, warnings = _fetch_file_content(client, "octocat", "repo", "main.py")
    assert src is None
    assert any("source_file_malformed" in w for w in warnings)
    # Warning should not contain the malformed content
    for w in warnings:
        assert "!!invalid!!" not in w
    client.close()


def test_valid_base64_with_newlines():
    # GitHub-style base64 with newlines should decode correctly
    import base64
    content = "print('hello')\n"
    # Add newlines like GitHub sometimes does
    b64_content = base64.b64encode(content.encode()).decode()
    # Insert newlines every 76 chars (MIME standard)
    b64_with_newlines = "\n".join(b64_content[i:i+76] for i in range(0, len(b64_content), 76))
    
    transport = make_transport([make_response(200, {"encoding": "base64", "content": b64_with_newlines})])
    client = make_client_with_transport(transport)
    src, warnings = _fetch_file_content(client, "octocat", "repo", "main.py")
    assert src == content
    assert not warnings
    client.close()


def test_deterministic_repeated_output():
    # Repeated analysis of identical input should produce identical output
    source = "import pandas as pd\nimport numpy as np\ndf = pd.read_csv('data.csv')\narr = np.array([1,2,3])\n"
    normalizer = SkillNormalizer()
    
    results = []
    for _ in range(3):
        analysis = _analyze_python_source(source, "main.py")
        matches = _match_usage_patterns(analysis, normalizer)
        skill_ids = tuple(sorted([s for s, _, _ in matches]))
        results.append(skill_ids)
    
    assert results[0] == results[1] == results[2]
    assert "pandas" in results[0]
    assert "numpy" in results[0]


def test_warnings_no_source_text():
    # Warnings should not contain source file contents
    source = "def secret_function():\n    password = 'super_secret_123'\n    return password\n"
    transport = make_transport([_file_content_response(source)])
    client = make_client_with_transport(transport)
    normalizer = SkillNormalizer()
    repo_result = GitHubRepositoryResult(name="repo", url="")
    
    root_entries = [{"name": "main.py", "type": "file", "path": "main.py"}]
    # Need to mock the contents response
    transport2 = make_transport([
        _contents_response(root_entries),
        _file_content_response(source),
    ])
    client2 = make_client_with_transport(transport2)
    evidence, warnings = analyze_repository_python(client2, normalizer, repo_result, "octocat", "repo", "")
    
    for w in warnings:
        assert "super_secret_123" not in w
        assert "password" not in w
    client2.close()


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])