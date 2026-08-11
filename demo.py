"""Minimal fully mocked Career DNA pipeline demonstration."""

import base64
import json

from services.evidence_engine import fuse_evidence
from services.gap_analysis import analyze_skill_gap
from services.github_analyzer import analyze_github_user
from services.report_generator import generate_report
from services.resume_parser import parse_resume_text


class DemoGitHubClient:
    """In-memory GitHub client used to guarantee that the demo makes no network calls."""

    def get_user(self, username):
        return {
            "login": username,
            "html_url": f"https://github.com/{username}",
            "public_repos": 1,
        }

    def list_user_repositories(self, username, max_repositories=100):
        return [
            {
                "name": "career-demo",
                "owner": {"login": username},
                "html_url": f"https://github.com/{username}/career-demo",
                "description": "A mocked portfolio repository",
                "language": "Python",
                "fork": False,
                "archived": False,
                "pushed_at": "2026-01-01T00:00:00Z",
                "default_branch": "main",
            }
        ][:max_repositories]

    def get_repository_languages(self, owner, repo):
        return {"Python": 1000}

    def get_repository_contents(self, owner, repo, path=""):
        return []

    def get_readme(self, owner, repo):
        content = base64.b64encode(b"Built with Python and Docker.").decode()
        return {"encoding": "base64", "content": content, "path": "README.md"}

    def list_repository_commits(self, owner, repo, max_commits=30):
        return [
            {"commit": {"author": {"date": "2026-01-01T00:00:00Z"}}}
        ][:max_commits]


def build_demo_report():
    """Run the complete pipeline and return its final report."""

    resume_result = parse_resume_text(
        "SKILLS\nPython, SQL\n\nEXPERIENCE\nBuilt reporting services with Python and SQL."
    )
    github_result = analyze_github_user(
        "demo-user",
        client=DemoGitHubClient(),
        max_deep_repositories=1,
    )
    candidate_profile = fuse_evidence(resume_result, github_result)
    role_requirement = {
        "id": "software_engineer",
        "requirements": [
            {"skill_id": "python"},
            {"skill_id": "sql"},
            {"skill_id": "docker"},
            {"skill_id": "java"},
        ],
    }
    skill_gap_result = analyze_skill_gap(candidate_profile, role_requirement)
    return generate_report(candidate_profile, skill_gap_result)


def main():
    print(json.dumps(build_demo_report().to_dict(), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
