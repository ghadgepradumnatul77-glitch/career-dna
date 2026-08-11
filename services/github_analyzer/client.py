"""GitHub REST API client for the GitHub Analyzer."""

import os
import time
from urllib.parse import urlparse
import httpx
from typing import Optional, List, Dict, Any
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


GITHUB_API_BASE = "https://api.github.com"
DEFAULT_TIMEOUT = 10.0
DEFAULT_MAX_RETRIES = 2
DEFAULT_USER_AGENT = "Career-DNA"


def _is_official_github_api(url: str) -> bool:
    """Return True if url points to the official GitHub API (https://api.github.com)."""
    parsed = urlparse(url)
    return parsed.scheme == "https" and parsed.netloc == "api.github.com"


def validate_github_username(username: str) -> None:
    """Raise GitHubAnalysisError if username does not meet GitHub rules."""
    if not username:
        raise github_invalid_username("Username is empty")
    if len(username) > 39:
        raise github_invalid_username("Username exceeds 39 characters")
    if not all(c.isalnum() or c == "-" for c in username):
        raise github_invalid_username("Username contains invalid characters")
    if username.startswith("-") or username.endswith("-"):
        raise github_invalid_username("Username cannot start or end with hyphen")
    if "--" in username:
        raise github_invalid_username("Username cannot contain consecutive hyphens")


class GitHubClient:
    """Synchronous GitHub REST API client."""

    def __init__(
        self,
        token: Optional[str] = None,
        timeout_seconds: float = DEFAULT_TIMEOUT,
        max_retries: int = DEFAULT_MAX_RETRIES,
        base_url: str = GITHUB_API_BASE,
        client: Optional[httpx.Client] = None,
    ) -> None:
        self._token = token or os.getenv("GITHUB_TOKEN")
        self.timeout = timeout_seconds
        self.max_retries = max_retries
        self.base_url = base_url.rstrip("/")

        # Validate base_url when a token is present (security: prevent token exfiltration)
        if self._token:
            if not _is_official_github_api(self.base_url):
                raise github_invalid_base_url(
                    "Authenticated client must use the official GitHub API (https://api.github.com)"
                )

        # Persistent safe headers (no Authorization)
        self._headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": DEFAULT_USER_AGENT,
        }

        if client is not None:
            self._client = client
            self._owns_client = False
        else:
            self._client = httpx.Client(timeout=self.timeout)
            self._owns_client = True

    def _request_headers(self) -> Dict[str, str]:
        """Build request headers, adding Authorization when token exists."""
        headers = dict(self._headers)
        if self._token:
            headers["Authorization"] = f"Bearer {self._token}"
        return headers

    def _request(self, method: str, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{path}"
        attempt = 0
        while True:
            try:
                resp = self._client.request(
                    method,
                    url,
                    headers=self._request_headers(),
                    params=params,
                )
            except httpx.TimeoutException:
                raise github_timeout()
            except httpx.RequestError:
                raise github_api_error("GitHub request failed")

            # Handle status codes
            if resp.status_code == 200:
                try:
                    return resp.json()
                except ValueError:
                    raise github_malformed_response("Response is not valid JSON")

            if resp.status_code == 404:
                raise github_not_found("Resource not found")
            if resp.status_code == 401:
                raise github_private_or_forbidden("Unauthorized")
            if resp.status_code == 403:
                # Rate limit detection
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining == "0":
                    raise github_rate_limited("Rate limit exceeded")
                raise github_private_or_forbidden("Forbidden")
            if resp.status_code == 429:
                # treat as rate limit
                raise github_rate_limited("Too many requests")
            if 500 <= resp.status_code < 600:
                # retry logic
                if attempt < self.max_retries:
                    attempt += 1
                    backoff = 0.5 * (2 ** (attempt - 1))
                    time.sleep(backoff)
                    continue
                raise github_api_error(f"Server error {resp.status_code}")

            # other client errors
            raise github_api_error(f"Unexpected status {resp.status_code}")

    def close(self) -> None:
        """Close the underlying HTTP client if owned by this instance."""
        if self._owns_client:
            self._client.close()

    def __enter__(self) -> "GitHubClient":
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        self.close()

    # ---- Public API methods ----
    def get_user(self, username: str) -> Dict[str, Any]:
        validate_github_username(username)
        try:
            data = self._request("GET", f"/users/{username}")
        except GitHubAnalysisError as e:
            if e.code == "github_not_found":
                raise github_user_not_found(username)
            raise
        if not isinstance(data, dict):
            raise github_malformed_response("User endpoint did not return object")
        return data

    def list_user_repositories(self, username: str, max_repositories: int = 100) -> List[Dict[str, Any]]:
        validate_github_username(username)
        repos: List[Dict[str, Any]] = []
        page = 1
        per_page = 100
        while len(repos) < max_repositories:
            params = {"page": page, "per_page": per_page, "sort": "pushed", "direction": "desc"}
            data = self._request("GET", f"/users/{username}/repos", params=params)
            if not isinstance(data, list):
                raise github_malformed_response("Repos endpoint did not return list")
            if not data:
                break
            repos.extend(data)
            if len(data) < per_page:
                break
            page += 1
        return repos[:max_repositories]

    def get_repository_languages(self, owner: str, repo: str) -> Dict[str, int]:
        data = self._request("GET", f"/repos/{owner}/{repo}/languages")
        if not isinstance(data, dict):
            raise github_malformed_response("Languages endpoint did not return object")
        return data

    def get_repository_contents(self, owner: str, repo: str, path: str = "") -> Any:
        data = self._request("GET", f"/repos/{owner}/{repo}/contents/{path}")
        return data

    def get_readme(self, owner: str, repo: str) -> Optional[Dict[str, Any]]:
        try:
            data = self._request("GET", f"/repos/{owner}/{repo}/readme")
        except GitHubAnalysisError as e:
            if e.code == "github_not_found":
                # README not found (404)
                return None
            raise
        if not isinstance(data, dict):
            raise github_malformed_response("Readme endpoint did not return object")
        return data

    def list_repository_commits(
        self, owner: str, repo: str, max_commits: int = 30
    ) -> List[Dict[str, Any]]:
        """Fetch recent commits for a repository."""
        commits: List[Dict[str, Any]] = []
        page = 1
        per_page = 30
        while len(commits) < max_commits:
            params = {"page": page, "per_page": per_page}
            data = self._request("GET", f"/repos/{owner}/{repo}/commits", params=params)
            if not isinstance(data, list):
                raise github_malformed_response("Commits endpoint did not return list")
            if not data:
                break
            commits.extend(data)
            if len(data) < per_page:
                break
            page += 1
        return commits[:max_commits]
