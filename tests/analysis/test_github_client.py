"""Tests for GitHub client and username validation."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import httpx
import pytest
from services.github_analyzer.client import GitHubClient, validate_github_username
from services.github_analyzer.errors import (
    GitHubAnalysisError,
    github_invalid_username,
    github_user_not_found,
    github_private_or_forbidden,
    github_rate_limited,
    github_timeout,
    github_api_error,
    github_malformed_response,
    github_not_found,
    github_invalid_base_url,
)


def make_response(status_code: int, json_data=None, headers=None):
    """Create a real httpx.Response object."""
    return httpx.Response(
        status_code=status_code,
        json=json_data,
        headers=headers or {},
        request=httpx.Request("GET", "https://api.github.com/test"),
    )


def make_transport(responses):
    """Create an httpx.MockTransport that returns responses in sequence."""
    responses = list(responses)

    def handler(request: httpx.Request) -> httpx.Response:
        if responses:
            return responses.pop(0)
        return make_response(404)

    return httpx.MockTransport(handler)


def make_client_with_transport(transport, **kwargs):
    """Create a GitHubClient with a custom transport."""
    client = httpx.Client(transport=transport, timeout=kwargs.get("timeout_seconds", 5.0))
    return GitHubClient(token="test_token", client=client, **kwargs)


def test_list_repository_commits_is_bounded_to_requested_cap():
    requests = []

    def handler(request):
        requests.append(request)
        return make_response(200, [{"sha": str(index)} for index in range(30)])

    client = make_client_with_transport(httpx.MockTransport(handler), max_retries=0)
    commits = client.list_repository_commits("owner", "repo", max_commits=30)
    assert len(commits) == 30
    assert len(requests) == 1
    assert requests[0].url.path == "/repos/owner/repo/commits"
    client.close()


def test_list_repository_commits_rejects_malformed_response():
    client = make_client_with_transport(make_transport([make_response(200, {"not": "a list"})]), max_retries=0)
    with pytest.raises(GitHubAnalysisError, match="github_malformed_response"):
        client.list_repository_commits("owner", "repo")
    client.close()


# ---- Username validation tests ----
def test_validate_github_username_valid():
    for u in ("octocat", "john-doe", "dev123", "a", "a-b-c"):
        validate_github_username(u)  # should not raise


def test_validate_github_username_invalid():
    invalid_cases = [
        "",
        "-user",
        "user-",
        "user--name",
        "user name",
        "a" * 40,
        "user@name",
    ]
    for u in invalid_cases:
        try:
            validate_github_username(u)
            assert False, f"expected error for {u}"
        except GitHubAnalysisError as e:
            assert e.code == "github_invalid_username"


# ---- Client tests using MockTransport ----
def test_get_user_success():
    transport = make_transport([
        make_response(200, {"login": "octocat", "id": 1}),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    user = client.get_user("octocat")
    assert user["login"] == "octocat"
    client.close()


def test_get_user_not_found():
    transport = make_transport([
        make_response(404),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("nouser")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_user_not_found"
    client.close()


def test_get_user_unauthorized():
    transport = make_transport([
        make_response(401),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_private_or_forbidden"
    client.close()


def test_get_user_rate_limited():
    transport = make_transport([
        make_response(403, headers={"X-RateLimit-Remaining": "0"}),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_rate_limited"
    client.close()


def test_get_user_forbidden_non_rate():
    transport = make_transport([
        make_response(403, headers={"X-RateLimit-Remaining": "10"}),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_private_or_forbidden"
    client.close()


def test_get_user_too_many_requests():
    transport = make_transport([
        make_response(429),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_rate_limited"
    client.close()


def test_get_user_server_error_then_success():
    transport = make_transport([
        make_response(500),
        make_response(200, {"login": "octocat"}),
    ])
    client = make_client_with_transport(transport, max_retries=2)
    user = client.get_user("octocat")
    assert user["login"] == "octocat"
    client.close()


def test_get_user_server_error_exhausted():
    transport = make_transport([
        make_response(500),
        make_response(500),
        make_response(500),
    ])
    client = make_client_with_transport(transport, max_retries=2)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_api_error"
    client.close()


def test_get_user_timeout():
    def timeout_handler(request: httpx.Request) -> httpx.Response:
        raise httpx.TimeoutException("timeout")

    transport = httpx.MockTransport(timeout_handler)
    client = make_client_with_transport(transport, max_retries=0)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_timeout"
    client.close()


def test_get_user_malformed_json():
    # Response with invalid JSON body
    transport = make_transport([
        httpx.Response(
            status_code=200,
            content=b"not valid json",
            headers={},
            request=httpx.Request("GET", "https://api.github.com/test"),
        ),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_malformed_response"
    client.close()


# ---- Pagination tests ----
def test_list_user_repositories_pagination():
    # Need to return per_page (100) items on first page to trigger pagination
    page1 = [{"id": i, "name": f"repo{i}"} for i in range(100)]
    page2 = [{"id": i, "name": f"repo{i}"} for i in range(100, 105)]

    def pagination_handler(request: httpx.Request) -> httpx.Response:
        page = request.url.params.get("page", "1")
        if page == "1":
            return make_response(200, page1)
        elif page == "2":
            return make_response(200, page2)
        return make_response(200, [])

    transport = httpx.MockTransport(pagination_handler)
    client = make_client_with_transport(transport, max_retries=1)
    repos = client.list_user_repositories("octocat", max_repositories=105)
    assert len(repos) == 105
    assert repos[-1]["name"] == "repo104"
    client.close()


def test_list_user_repositories_cap():
    # Return per_page (100) items per page to test cap
    def cap_handler(request: httpx.Request) -> httpx.Response:
        page = int(request.url.params.get("page", "1"))
        start = (page - 1) * 100
        data = [{"id": start + i, "name": f"repo{start + i}"} for i in range(100)]
        return make_response(200, data)

    transport = httpx.MockTransport(cap_handler)
    client = make_client_with_transport(transport, max_retries=1)
    repos = client.list_user_repositories("octocat", max_repositories=3)
    assert len(repos) == 3
    client.close()


def test_list_user_repositories_empty():
    transport = make_transport([
        make_response(200, []),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    repos = client.list_user_repositories("octocat")
    assert repos == []
    client.close()


# ---- Response shape validation ----
def test_get_user_malformed_shape():
    transport = make_transport([
        make_response(200, [1, 2, 3]),  # list not dict
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_malformed_response"
    client.close()


def test_list_repos_malformed_shape():
    transport = make_transport([
        make_response(200, {"not": "list"}),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.list_user_repositories("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_malformed_response"
    client.close()


def test_languages_malformed_shape():
    transport = make_transport([
        make_response(200, ["Python"]),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_repository_languages("octocat", "repo")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_malformed_response"
    client.close()


# ---- Readme tests ----
def test_get_readme_exists():
    transport = make_transport([
        make_response(200, {"content": "b2Vy", "encoding": "base64"}),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    readme = client.get_readme("octocat", "repo")
    assert readme is not None
    assert "content" in readme
    client.close()


def test_get_readme_missing():
    transport = make_transport([
        make_response(404),
    ])
    client = make_client_with_transport(transport, max_retries=1)
    readme = client.get_readme("octocat", "repo")
    assert readme is None
    client.close()


# ---- Token safety ----
def test_token_not_leaked_in_error():
    transport = make_transport([
        make_response(500),
    ])
    client = GitHubClient(token="super_secret_test_token", client=httpx.Client(transport=transport, timeout=5.0), max_retries=0)
    try:
        client.get_user("octocat")
        assert False
    except GitHubAnalysisError as e:
        assert "super_secret_test_token" not in str(e)
    client.close()


# ---- Additional: request parameter inspection ----
def test_list_repos_request_params():
    """Verify that pagination parameters are correctly sent."""
    captured_params = {}

    def capture_handler(request: httpx.Request) -> httpx.Response:
        captured_params.update(dict(request.url.params))
        return make_response(200, [])

    transport = httpx.MockTransport(capture_handler)
    client = make_client_with_transport(transport, max_retries=1)
    client.list_user_repositories("octocat", max_repositories=10)
    client.close()

    assert captured_params.get("page") == "1"
    assert captured_params.get("per_page") == "100"
    assert captured_params.get("sort") == "pushed"
    assert captured_params.get("direction") == "desc"


# ---- Retry sleep behavior (no real sleep) ----
def test_retry_no_real_sleep(monkeypatch):
    """Verify retry backoff doesn't actually sleep."""
    import time
    sleep_calls = []

    def fake_sleep(duration):
        sleep_calls.append(duration)

    monkeypatch.setattr(time, "sleep", fake_sleep)

    transport = make_transport([
        make_response(500),
        make_response(500),
        make_response(200, {"login": "octocat"}),
    ])
    client = make_client_with_transport(transport, max_retries=2)
    user = client.get_user("octocat")
    assert user["login"] == "octocat"
    # Should have slept twice with exponential backoff: 0.5, 1.0
    assert sleep_calls == [0.5, 1.0]
    client.close()


# ---- Base URL security tests ----
def test_base_url_official_allowed():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    client = make_client_with_transport(transport, base_url="https://api.github.com")
    user = client.get_user("octocat")
    assert user["login"] == "octocat"
    client.close()


def test_base_url_official_trailing_slash_allowed():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    client = make_client_with_transport(transport, base_url="https://api.github.com/")
    user = client.get_user("octocat")
    assert user["login"] == "octocat"
    client.close()


def test_base_url_custom_rejected_when_token():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    try:
        GitHubClient(token="secret", base_url="https://evil.example", client=httpx.Client(transport=transport, timeout=5.0))
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_invalid_base_url"


def test_base_url_subdomain_spoof_rejected():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    try:
        GitHubClient(token="secret", base_url="https://api.github.com.evil.example", client=httpx.Client(transport=transport, timeout=5.0))
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_invalid_base_url"


def test_base_url_http_rejected():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    try:
        GitHubClient(token="secret", base_url="http://api.github.com", client=httpx.Client(transport=transport, timeout=5.0))
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_invalid_base_url"


def test_base_url_custom_allowed_when_no_token():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    # No token, custom base_url should be allowed (e.g., for GitHub Enterprise)
    client = GitHubClient(token=None, base_url="https://ghe.example.com", client=httpx.Client(transport=transport, timeout=5.0))
    user = client.get_user("octocat")
    assert user["login"] == "octocat"
    client.close()


# ---- Token header not persisted ----
def test_authorization_header_not_in_persistent_headers():
    transport = make_transport([make_response(200, {"login": "octocat"})])
    client = make_client_with_transport(transport, max_retries=1)
    # The internal _headers should not contain Authorization
    assert "Authorization" not in client._headers
    client.close()


# ---- 404 contract tests ----
def test_repository_resource_404_returns_github_not_found():
    transport = make_transport([make_response(404)])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_repository_languages("octocat", "nonexistent")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_not_found"
    client.close()


def test_repository_contents_404_returns_github_not_found():
    transport = make_transport([make_response(404)])
    client = make_client_with_transport(transport, max_retries=1)
    try:
        client.get_repository_contents("octocat", "nonexistent", "some/path")
        assert False
    except GitHubAnalysisError as e:
        assert e.code == "github_not_found"
    client.close()


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])
