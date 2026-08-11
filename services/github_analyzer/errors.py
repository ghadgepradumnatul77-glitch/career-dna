"""Deterministic error model for GitHub Analyzer."""

class GitHubAnalysisError(Exception):
    """Base error for GitHub analysis failures."""

    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(f"{code}: {message}")


# Helper constructors for deterministic codes
def github_invalid_username(msg: str = "Invalid GitHub username") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_invalid_username", msg)


def github_user_not_found(username: str) -> GitHubAnalysisError:
    return GitHubAnalysisError("github_user_not_found", f"User '{username}' not found")


def github_private_or_forbidden(msg: str = "Private or forbidden") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_private_or_forbidden", msg)


def github_rate_limited(msg: str = "Rate limit exceeded") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_rate_limited", msg)


def github_timeout(msg: str = "Request timeout") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_timeout", msg)


def github_api_error(msg: str = "GitHub API error") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_api_error", msg)


def github_malformed_response(msg: str = "Malformed GitHub API response") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_malformed_response", msg)


def github_not_found(msg: str = "Resource not found") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_not_found", msg)


def github_invalid_base_url(msg: str = "Invalid base URL for authenticated client") -> GitHubAnalysisError:
    return GitHubAnalysisError("github_invalid_base_url", msg)