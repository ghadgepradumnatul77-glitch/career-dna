import os
import re
from typing import Dict, List, Any, Optional
import httpx

from shared.schemas.evidence import SkillEvidence
from services.skill_normalizer.normalizer import get_normalizer
from services.db_service import save_evidence, clear_user_evidence


def clean_github_username(raw_input: str) -> str:
    """Extract clean GitHub username from full URL or user input."""
    if not raw_input:
        return ""
    cleaned = raw_input.strip()
    cleaned = re.sub(r"^https?://(www\.)?github\.com/", "", cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.rstrip("/")
    return cleaned


def link_and_parse_github(
    user_id: str,
    username: str,
    db_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Fetch public repositories for a GitHub username via GitHub REST API,
    extract programming languages, topics, and repository descriptions,
    map to canonical skills, generate SkillEvidence, and persist to SQLite.
    """
    if not user_id or not user_id.strip():
        raise ValueError("user_id is required for GitHub linking.")

    clean_user = clean_github_username(username)
    if not clean_user:
        raise ValueError("A valid GitHub username or profile URL is required.")

    token = os.environ.get("GITHUB_TOKEN")
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "CareerDNA-App"}
    if token:
        headers["Authorization"] = f"token {token}"

    url = f"https://api.github.com/users/{clean_user}/repos?per_page=30&sort=updated"

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.get(url, headers=headers)

            if resp.status_code == 404:
                raise ValueError(f"GitHub user '{clean_user}' not found.")
            elif resp.status_code == 403:
                raise ValueError("GitHub API rate limit exceeded or access forbidden.")
            elif resp.status_code != 200:
                raise ValueError(f"GitHub API error (status {resp.status_code}).")

            repos = resp.json()
    except httpx.RequestError as e:
        raise ValueError(f"Network error connecting to GitHub API: {str(e)}")

    if not isinstance(repos, list):
        repos = []

    normalizer = get_normalizer()
    evidence_list: List[SkillEvidence] = []
    detected_skills_set = set()

    for repo in repos:
        repo_name = repo.get("name", "")
        repo_url = repo.get("html_url", "")
        lang = repo.get("language")
        topics = repo.get("topics", [])
        desc = repo.get("description") or ""
        stargazers = repo.get("stargazers_count", 0)

        # 1. Primary Language mapping
        if lang:
            sid = normalizer.normalize_skill(lang)
            if sid and sid in normalizer._canonical_by_id:
                canonical_name = normalizer._canonical_by_id[sid]["name"]
                if canonical_name not in detected_skills_set:
                    detected_skills_set.add(canonical_name)
                    strength = min(90.0, 70.0 + min(15.0, stargazers * 2))
                    ev = SkillEvidence(
                        skill=canonical_name,
                        source="github",
                        evidence_type="repo_language",
                        source_ref=repo_url,
                        strength=strength,
                        confidence=90.0,
                        relevance=90.0,
                        recency=90.0,
                        description=f"Verified {canonical_name} primary language in repository '{clean_user}/{repo_name}'."
                    )
                    evidence_list.append(ev)

        # 2. Topics mapping
        for topic in topics:
            sid = normalizer.normalize_skill(topic)
            if sid and sid in normalizer._canonical_by_id:
                canonical_name = normalizer._canonical_by_id[sid]["name"]
                if canonical_name not in detected_skills_set:
                    detected_skills_set.add(canonical_name)
                    ev = SkillEvidence(
                        skill=canonical_name,
                        source="github",
                        evidence_type="repo_topics",
                        source_ref=repo_url,
                        strength=75.0,
                        confidence=90.0,
                        relevance=90.0,
                        recency=90.0,
                        description=f"Verified {canonical_name} topic tag in repository '{clean_user}/{repo_name}'."
                    )
                    evidence_list.append(ev)

        # 3. Description & repo name mapping
        full_repo_text = f"{repo_name} {desc}"
        for token in full_repo_text.split():
            sid = normalizer.normalize_skill(token)
            if sid and sid in normalizer._canonical_by_id:
                canonical_name = normalizer._canonical_by_id[sid]["name"]
                if canonical_name not in detected_skills_set:
                    detected_skills_set.add(canonical_name)
                    ev = SkillEvidence(
                        skill=canonical_name,
                        source="github",
                        evidence_type="code_repository",
                        source_ref=repo_url,
                        strength=70.0,
                        confidence=85.0,
                        relevance=90.0,
                        recency=90.0,
                        description=f"Verified {canonical_name} in repository description for '{clean_user}/{repo_name}'."
                    )
                    evidence_list.append(ev)

    # Clear old GitHub evidence for this user and save new evidence
    clear_user_evidence(user_id, source="github", db_path=db_path)
    for ev in evidence_list:
        save_evidence(user_id, ev, db_path=db_path)

    skills_detected = [ev.skill for ev in evidence_list]

    return {
        "user_id": user_id,
        "source": "github",
        "username": clean_user,
        "repositories_analyzed": len(repos),
        "skills_detected": skills_detected,
        "evidence_count": len(evidence_list),
        "status": "processed"
    }
