"""GitHub Analyzer orchestration: repository selection, metadata, language, dependency evidence."""

import base64
import json
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Any, Dict, List, Optional, Set, Tuple

from services.github_analyzer.client import GitHubClient
from services.github_analyzer.errors import (
    GitHubAnalysisError,
)
from services.github_analyzer.models import (
    GitHubAnalysisResult,
    GitHubRepositoryResult,
    GitHubEvidence,
    RepositoryActivity,
)
from services.github_analyzer.python_analyzer import analyze_repository_python
from services.skill_normalizer.normalizer import SkillNormalizer, get_normalizer

# Constants
MAX_DEEP_REPOSITORIES_DEFAULT = 8
MAX_DEEP_REPOSITORIES_UPPER = 20
MAX_DEPENDENCY_FILE_BYTES = 100 * 1024  # 100 KiB
MAX_README_BYTES = 200 * 1024  # 200 KiB
MAX_COMMITS_PER_REPO = 30

# Dependency manifest filenames we care about (root level)
DEPENDENCY_MANIFESTS = {
    # Python
    "requirements.txt",
    "pyproject.toml",
    "Pipfile",
    # JavaScript / Node
    "package.json",
    # Java
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    # Go
    "go.mod",
    # Rust
    "Cargo.toml",
    # Ruby
    "Gemfile",
    # PHP
    "composer.json",
}


def _validate_max_deep(max_deep: int) -> None:
    if not isinstance(max_deep, int):
        raise GitHubAnalysisError("github_invalid_config", "max_deep_repositories must be an integer")
    if max_deep < 0:
        raise GitHubAnalysisError("github_invalid_config", "max_deep_repositories must be >= 0")
    if max_deep > MAX_DEEP_REPOSITORIES_UPPER:
        raise GitHubAnalysisError(
            "github_invalid_config",
            f"max_deep_repositories exceeds allowed maximum of {MAX_DEEP_REPOSITORIES_UPPER}",
        )


def _parse_iso_datetime(value: Optional[str]) -> Optional[str]:
    """Return the original string if it looks like an ISO datetime, else None.
    We keep lexical ordering, so we just validate format loosely.
    """
    if not value:
        return None
    # GitHub returns ISO8601 with 'Z' or offset; accept any non-empty string.
    return value


def _safe_get(d: Dict[str, Any], key: str, default=None):
    return d.get(key, default)


def _owner_login(repo: Dict[str, Any], fallback_username: str) -> str:
    owner = repo.get("owner")
    if isinstance(owner, dict) and owner.get("login"):
        return owner["login"]
    return fallback_username


def _sort_key_pushed_at(repo: Dict[str, Any]) -> Tuple[int, str]:
    """Key for sorting: repos with valid pushed_at first (descending), then name asc.
    We return a tuple where first element is 0 for valid, 1 for missing/invalid,
    second element is negative timestamp for descending (lexical), third is name.
    """
    pushed = repo.get("pushed_at")
    if pushed and isinstance(pushed, str):
        # lexical descending => use negative by using inverted string? Simpler: sort later with reverse.
        return (0, pushed, repo.get("name", ""))
    return (1, "", repo.get("name", ""))


def _decode_base64_content(content: str) -> Optional[str]:
    try:
        decoded_bytes = base64.b64decode(content, validate=True)
        if len(decoded_bytes) > MAX_DEPENDENCY_FILE_BYTES:
            return None
        return decoded_bytes.decode("utf-8", errors="replace")
    except Exception:
        return None


def _decode_readme_content(content: str) -> Tuple[Optional[str], List[str]]:
    """Decode README content from base64. Returns (decoded_text, warnings)."""
    warnings = []
    try:
        # GitHub base64 may contain newlines; strip whitespace before decoding
        cleaned_content = "".join(content.split())
        decoded_bytes = base64.b64decode(cleaned_content, validate=True)
    except Exception:
        warnings.append("readme_malformed")
        return None, warnings
    if len(decoded_bytes) > MAX_README_BYTES:
        warnings.append("readme_too_large")
        return None, warnings
    try:
        decoded = decoded_bytes.decode("utf-8", errors="replace")
    except Exception:
        warnings.append("readme_malformed")
        return None, warnings
    return decoded, warnings


def _extract_skills_from_readme(
    readme_text: str, normalizer: SkillNormalizer
) -> List[Tuple[str, str, int, int]]:
    """Extract skill mentions from README text using taxonomy-aware matching.
    Returns (skill_id, actual matched text, start, end) in document order.
    """
    if not readme_text:
        return []

    # Get all match terms from normalizer (canonical names + aliases)
    match_terms = normalizer.get_match_terms()

    # Prefer longer terms at the same position, with lexical tie-breaking.
    match_terms.sort(key=lambda x: (-len(x[0]), x[0].casefold(), x[1]))
    candidates: List[Tuple[int, int, str, str]] = []
    for term, skill_id in match_terms:
        pattern = rf"(?<![A-Za-z0-9_]){re.escape(term)}(?![A-Za-z0-9_])"
        for match in re.finditer(pattern, readme_text, flags=re.IGNORECASE):
            candidates.append((match.start(), match.end(), skill_id, match.group(0)))

    candidates.sort(key=lambda item: (item[0], -(item[1] - item[0]), item[2], item[3].casefold()))
    found_skills: List[Tuple[str, str, int, int]] = []
    seen_skill_ids: Set[str] = set()
    for start, end, skill_id, actual_term in candidates:
        if skill_id in seen_skill_ids:
            continue
        found_skills.append((skill_id, actual_term, start, end))
        seen_skill_ids.add(skill_id)

    return found_skills


def _fetch_and_analyze_readme(
    client: GitHubClient, owner: str, repo: str, normalizer: SkillNormalizer
) -> Tuple[List[GitHubEvidence], List[str], bool]:
    """Fetch README and extract claim evidence. Returns (evidence, warnings, has_readme)."""
    evidence: List[GitHubEvidence] = []
    warnings: List[str] = []
    has_readme = False
    
    try:
        readme_obj = client.get_readme(owner, repo)
    except GitHubAnalysisError as e:
        warnings.append(f"readme_check_failed: {e.code}")
        return evidence, warnings, has_readme
    
    if readme_obj is None:
        return evidence, warnings, False
    
    has_readme = True
    
    encoding = readme_obj.get("encoding")
    content = readme_obj.get("content")
    if encoding != "base64" or not content:
        warnings.append("readme_malformed")
        return evidence, warnings, has_readme
    
    decoded, decode_warnings = _decode_readme_content(content)
    warnings.extend(decode_warnings)
    
    if decoded is None:
        return evidence, warnings, has_readme
    
    # Extract skill mentions
    skill_matches = _extract_skills_from_readme(decoded, normalizer)
    
    readme_path = readme_obj.get("path") if isinstance(readme_obj.get("path"), str) else "README"
    for skill_id, matched_term, start, end in skill_matches:
        # Keep only bounded local context, centered around the actual match.
        context_start = max(0, start - 90)
        context_end = min(len(decoded), end + 90)
        ev_text = " ".join(decoded[context_start:context_end].split())[:200]
        ev = GitHubEvidence(
            skill_id=skill_id,
            raw_term=matched_term,
            repository_name="",  # will be filled by caller
            repository_url="",   # will be filled by caller
            evidence_type="readme_claim",
            evidence_text=ev_text,
            file_path=readme_path,
            commit_sha=None,
            source_ref="readme_claim",
        )
        evidence.append(ev)
    
    return evidence, warnings, has_readme


def _fetch_and_analyze_commits(
    client: GitHubClient, owner: str, repo: str
) -> Tuple[List[str], RepositoryActivity]:
    """Fetch bounded repository activity metadata without inferring authorship."""
    warnings: List[str] = []
    activity = RepositoryActivity()
    
    try:
        commits = client.list_repository_commits(owner, repo, max_commits=MAX_COMMITS_PER_REPO)
    except GitHubAnalysisError as e:
        # Systemic failures should propagate
        if e.code in ("github_rate_limited", "github_private_or_forbidden", "github_invalid_base_url"):
            raise
        warnings.append(f"commit_activity_unavailable: {e.code}")
        return warnings, activity
    except Exception:
        warnings.append("commit_activity_unavailable: unknown_error")
        return warnings, activity
    
    if not commits:
        return warnings, activity

    activity.commit_count = len(commits)
    valid_dates: List[Tuple[datetime, str]] = []
    for commit in commits:
        if not isinstance(commit, dict):
            continue
        commit_data = commit.get("commit")
        author = commit_data.get("author") if isinstance(commit_data, dict) else None
        raw_date = author.get("date") if isinstance(author, dict) else None
        if not isinstance(raw_date, str):
            continue
        try:
            parsed = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
        except ValueError:
            continue
        valid_dates.append((parsed, raw_date))
    if valid_dates:
        valid_dates.sort(key=lambda item: (item[0], item[1]))
        activity.earliest_commit_at = valid_dates[0][1]
        activity.latest_commit_at = valid_dates[-1][1]
    return warnings, activity


def _parse_requirements_txt(text: str) -> List[str]:
    """Extract package names from requirements.txt lines."""
    pkgs = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        # Remove options like --index-url
        if line.startswith("-"):
            continue
        # Split on version specifiers, extras, markers
        # Use regex to get leading package name
        import re
        m = re.match(r"^([A-Za-z0-9][A-Za-z0-9._-]*)", line)
        if m:
            pkgs.append(m.group(1))
    return pkgs


def _parse_package_json(text: str) -> List[str]:
    try:
        data = json.loads(text)
    except Exception:
        return []
    deps = []
    for dep_dict in (data.get("dependencies", {}), data.get("devDependencies", {})):
        if isinstance(dep_dict, dict):
            deps.extend(dep_dict.keys())
    return deps


def _parse_pyproject_toml(text: str) -> List[str]:
    # Python 3.11+ has tomllib
    try:
        import tomllib
    except Exception:
        return []
    try:
        data = tomllib.loads(text)
    except Exception:
        return []
    pkgs = []
    # poetry
    poetry = data.get("tool", {}).get("poetry", {})
    for dep_dict in (poetry.get("dependencies", {}), poetry.get("dev-dependencies", {})):
        if isinstance(dep_dict, dict):
            pkgs.extend(dep_dict.keys())
    # PEP 621 project.dependencies
    project = data.get("project", {})
    for dep in project.get("dependencies", []):
        # format "pkg>=1.0"
        import re
        m = re.match(r"^([A-Za-z0-9][A-Za-z0-9._-]*)", dep)
        if m:
            pkgs.append(m.group(1))
    return pkgs


def _parse_pipfile(text: str) -> List[str]:
    try:
        import tomllib
    except Exception:
        return []
    try:
        data = tomllib.loads(text)
    except Exception:
        return []
    pkgs = []
    for dep_dict in (data.get("packages", {}), data.get("dev-packages", {})):
        if isinstance(dep_dict, dict):
            pkgs.extend(dep_dict.keys())
    return pkgs


def _parse_pom_xml(text: str) -> List[str]:
    try:
        root = ET.fromstring(text)
    except Exception:
        return []
    ns = {"m": "http://maven.apache.org/POM/4.0.0"}
    artifacts = []
    for dep in root.findall(".//m:dependency/m:artifactId", ns):
        if dep.text:
            artifacts.append(dep.text)
    return artifacts


def _parse_build_gradle(text: str) -> List[str]:
    # Very lightweight: look for lines like implementation 'group:artifact:version'
    import re
    pkgs = []
    for line in text.splitlines():
        m = re.search(r"['\"]([^:'\"]+):([^:'\"]+)[:']", line)
        if m:
            pkgs.append(m.group(2))
    return pkgs


def _parse_go_mod(text: str) -> List[str]:
    pkgs = []
    in_require = False
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("require"):
            in_require = True
            continue
        if in_require:
            if line == ")":
                break
            parts = line.split()
            if parts:
                pkgs.append(parts[0])
    return pkgs


def _parse_cargo_toml(text: str) -> List[str]:
    try:
        import tomllib
    except Exception:
        return []
    try:
        data = tomllib.loads(text)
    except Exception:
        return []
    pkgs = []
    for dep_dict in (data.get("dependencies", {}), data.get("dev-dependencies", {})):
        if isinstance(dep_dict, dict):
            pkgs.extend(dep_dict.keys())
    return pkgs


def _parse_gemfile(text: str) -> List[str]:
    import re
    pkgs = []
    for line in text.splitlines():
        m = re.match(r"^\s*gem\s+['\"]([^'\"]+)['\"]", line)
        if m:
            pkgs.append(m.group(1))
    return pkgs


def _parse_composer_json(text: str) -> List[str]:
    try:
        data = json.loads(text)
    except Exception:
        return []
    pkgs = []
    for dep_dict in (data.get("require", {}), data.get("require-dev", {})):
        if isinstance(dep_dict, dict):
            pkgs.extend(dep_dict.keys())
    return pkgs


# Mapping from manifest filename to parser function
_MANIFEST_PARSERS = {
    "requirements.txt": _parse_requirements_txt,
    "pyproject.toml": _parse_pyproject_toml,
    "Pipfile": _parse_pipfile,
    "package.json": _parse_package_json,
    "pom.xml": _parse_pom_xml,
    "build.gradle": _parse_build_gradle,
    "build.gradle.kts": _parse_build_gradle,
    "go.mod": _parse_go_mod,
    "Cargo.toml": _parse_cargo_toml,
    "Gemfile": _parse_gemfile,
    "composer.json": _parse_composer_json,
}


def _fetch_root_contents(client: GitHubClient, owner: str, repo: str) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Fetch root directory listing. Returns (entries, warnings)."""
    warnings = []
    try:
        data = client.get_repository_contents(owner, repo, path="")
    except GitHubAnalysisError as e:
        warnings.append(f"contents_unavailable: {e.code}")
        return [], warnings
    if isinstance(data, list):
        return data, warnings
    if isinstance(data, dict):
        # Single file at root (unlikely)
        return [data], warnings
    warnings.append("contents_malformed")
    return [], warnings


def _extract_dependency_files(entries: List[Dict[str, Any]]) -> List[str]:
    names = []
    for entry in entries:
        if entry.get("type") == "file" and entry.get("name") in DEPENDENCY_MANIFESTS:
            names.append(entry["name"])
    return names


def _fetch_and_parse_manifest(
    client: GitHubClient, owner: str, repo: str, filename: str
) -> Tuple[List[str], List[str]]:
    """Return (raw_dependency_names, warnings)."""
    warnings = []
    try:
        content_obj = client.get_repository_contents(owner, repo, path=filename)
    except GitHubAnalysisError as e:
        warnings.append(f"dependency_file_unreadable: {filename}: {e.code}")
        return [], warnings
    if not isinstance(content_obj, dict):
        warnings.append(f"dependency_file_malformed: {filename}")
        return [], warnings
    encoding = content_obj.get("encoding")
    content = content_obj.get("content")
    if encoding != "base64" or not content:
        warnings.append(f"dependency_file_malformed: {filename}")
        return [], warnings
    # decode with error handling
    try:
        decoded_bytes = base64.b64decode(content, validate=True)
    except Exception:
        warnings.append(f"dependency_file_malformed: {filename}")
        return [], warnings
    if len(decoded_bytes) > MAX_DEPENDENCY_FILE_BYTES:
        warnings.append(f"dependency_file_too_large: {filename}")
        return [], warnings
    try:
        decoded = decoded_bytes.decode("utf-8", errors="replace")
    except Exception:
        warnings.append(f"dependency_file_malformed: {filename}")
        return [], warnings
    parser = _MANIFEST_PARSERS.get(filename)
    if not parser:
        return [], warnings
    try:
        dep_names = parser(decoded)
    except Exception:
        warnings.append(f"dependency_file_malformed: {filename}")
        return [], warnings
    return dep_names, warnings


def _normalize_and_make_evidence(
    normalizer: SkillNormalizer,
    raw_term: str,
    repo_name: str,
    repo_url: str,
    evidence_type: str,
    file_path: Optional[str] = None,
) -> Optional[GitHubEvidence]:
    skill_id = normalizer.normalize_skill(raw_term)
    if not skill_id:
        return None
    # Build evidence text
    if evidence_type == "repository_language":
        text = f"GitHub language metadata: {raw_term}"
    elif evidence_type == "dependency_declared":
        text = f"Declared dependency: {raw_term}"
    else:
        text = raw_term
    return GitHubEvidence(
        skill_id=skill_id,
        raw_term=raw_term,
        repository_name=repo_name,
        repository_url=repo_url,
        evidence_type=evidence_type,
        evidence_text=text,
        file_path=file_path,
        commit_sha=None,
        source_ref=evidence_type,
    )


def analyze_github_user(
    username: str,
    client: Optional[GitHubClient] = None,
    normalizer: Optional[SkillNormalizer] = None,
    max_deep_repositories: int = MAX_DEEP_REPOSITORIES_DEFAULT,
    include_forks: bool = False,
    include_archived: bool = False,
) -> GitHubAnalysisResult:
    """Analyze a GitHub user's public repositories and produce evidence."""
    _validate_max_deep(max_deep_repositories)

    # Resolve client/normalizer ownership
    own_client = False
    if client is None:
        client = GitHubClient()
        own_client = True
    if normalizer is None:
        normalizer = get_normalizer()

    result = GitHubAnalysisResult(username=username, profile_url="", public_repos=0)

    try:
        # ---- Fetch user ----
        user_data = client.get_user(username)
        result.username = user_data.get("login", username)
        result.profile_url = user_data.get("html_url", "")
        result.public_repos = int(user_data.get("public_repos", 0))

        # ---- Fetch repositories (lightweight list) ----
        repos = client.list_user_repositories(username, max_repositories=100)

        # ---- Filter ----
        eligible = []
        for repo in repos:
            if not include_forks and repo.get("fork"):
                continue
            if not include_archived and repo.get("archived"):
                continue
            # Ensure has name
            if not repo.get("name"):
                continue
            eligible.append(repo)

        # ---- Sort by pushed_at descending, missing last, tie-break name asc ----
        with_date = [r for r in eligible if r.get("pushed_at")]
        without_date = [r for r in eligible if not r.get("pushed_at")]
        with_date.sort(key=lambda r: r["pushed_at"], reverse=True)
        without_date.sort(key=lambda r: r.get("name", ""))
        sorted_repos = with_date + without_date

        # ---- Select deep repositories ----
        deep_repos = sorted_repos[:max_deep_repositories]

        # ---- Analyze each selected repository ----
        all_skills: List[str] = []
        seen_skills: Set[str] = set()
        repo_results: List[GitHubRepositoryResult] = []

        for repo in deep_repos:
            repo_name = repo["name"]
            owner = _owner_login(repo, username)
            repo_url = repo.get("html_url", "")

            repo_result = GitHubRepositoryResult(name=repo_name, url=repo_url)
            repo_result.description = repo.get("description")
            repo_result.primary_language = repo.get("language")
            repo_result.stars = int(repo.get("stargazers_count", 0) or 0)
            repo_result.forks = int(repo.get("forks_count", 0) or 0)
            repo_result.fork = bool(repo.get("fork", False))
            repo_result.archived = bool(repo.get("archived", False))
            repo_result.created_at = _parse_iso_datetime(repo.get("created_at"))
            repo_result.updated_at = _parse_iso_datetime(repo.get("updated_at"))
            repo_result.pushed_at = _parse_iso_datetime(repo.get("pushed_at"))
            repo_result.default_branch = repo.get("default_branch")

            # ---- Languages ----
            try:
                languages = client.get_repository_languages(owner, repo_name)
                if isinstance(languages, dict):
                    repo_result.languages = languages
                    # Sort for deterministic order
                    for lang_name in sorted(languages.keys()):
                        ev = _normalize_and_make_evidence(
                            normalizer, lang_name, repo_name, repo_url, "repository_language"
                        )
                        if ev:
                            repo_result.evidence.append(ev)
                            if ev.skill_id not in seen_skills:
                                seen_skills.add(ev.skill_id)
                                all_skills.append(ev.skill_id)
                                repo_result.normalized_skills.append(ev.skill_id)
            except GitHubAnalysisError as e:
                repo_result.warnings.append(f"languages_unavailable: {e.code}")

            # ---- Root contents ----
            entries, content_warnings = _fetch_root_contents(client, owner, repo_name)
            repo_result.warnings.extend(content_warnings)

            # ---- Dependency files detection ----
            dep_files = _extract_dependency_files(entries)
            # Sort for deterministic order
            dep_files.sort()
            repo_result.dependency_files = dep_files

            # ---- Parse each manifest ----
            for manifest in dep_files:
                raw_deps, parse_warnings = _fetch_and_parse_manifest(client, owner, repo_name, manifest)
                repo_result.warnings.extend(parse_warnings)
                # Sort for deterministic order
                raw_deps.sort()
                for raw_dep in raw_deps:
                    ev = _normalize_and_make_evidence(
                        normalizer,
                        raw_dep,
                        repo_name,
                        repo_url,
                        "dependency_declared",
                        file_path=manifest,
                    )
                    if ev:
                        # Deduplicate within repo by (skill_id, evidence_type, file_path, raw_term)
                        dup = False
                        for existing in repo_result.evidence:
                            if (
                                existing.skill_id == ev.skill_id
                                and existing.evidence_type == ev.evidence_type
                                and existing.file_path == ev.file_path
                                and existing.raw_term == ev.raw_term
                            ):
                                dup = True
                                break
                        if not dup:
                            repo_result.evidence.append(ev)
                            if ev.skill_id not in seen_skills:
                                seen_skills.add(ev.skill_id)
                                all_skills.append(ev.skill_id)
                                repo_result.normalized_skills.append(ev.skill_id)

            # ---- README presence/claim ----
            readme_evidence, readme_warnings, has_readme = _fetch_and_analyze_readme(
                client, owner, repo_name, normalizer
            )
            repo_result.warnings.extend(readme_warnings)
            repo_result.has_readme = has_readme
            # Set repository info on evidence
            for ev in readme_evidence:
                ev.repository_name = repo_name
                ev.repository_url = repo_url
                # Deduplicate
                dup = False
                for existing in repo_result.evidence:
                    if (
                        existing.skill_id == ev.skill_id
                        and existing.evidence_type == ev.evidence_type
                        and existing.file_path == ev.file_path
                        and existing.raw_term == ev.raw_term
                    ):
                        dup = True
                        break
                if not dup:
                    repo_result.evidence.append(ev)
                    if ev.skill_id not in seen_skills:
                        seen_skills.add(ev.skill_id)
                        all_skills.append(ev.skill_id)
                        repo_result.normalized_skills.append(ev.skill_id)

            # ---- Repository structure evidence (Docker, CI/CD) ----
            try:
                root_entries = client.get_repository_contents(owner, repo_name, path="")
            except GitHubAnalysisError:
                root_entries = []
            if isinstance(root_entries, list):
                # Sort for deterministic processing
                root_entries.sort(key=lambda e: e.get("name", ""))
                for entry in root_entries:
                    name = entry.get("name", "")
                    if name in ("Dockerfile", "docker-compose.yml", "docker-compose.yaml"):
                        ev = _normalize_and_make_evidence(
                            normalizer, "docker", repo_name, repo_url,
                            "repository_structure", file_path=name
                        )
                        if ev:
                            repo_result.evidence.append(ev)
                            if ev.skill_id not in seen_skills:
                                seen_skills.add(ev.skill_id)
                                all_skills.append(ev.skill_id)
                                repo_result.normalized_skills.append(ev.skill_id)
                    if name == ".github":
                        # check workflows dir
                        try:
                            wf_entries = client.get_repository_contents(owner, repo_name, path=".github/workflows")
                        except GitHubAnalysisError:
                            wf_entries = []
                        if isinstance(wf_entries, list) and wf_entries:
                            ev = _normalize_and_make_evidence(
                                normalizer, "ci_cd", repo_name, repo_url,
                                "repository_structure", file_path=".github/workflows"
                            )
                            if ev:
                                repo_result.evidence.append(ev)
                                if ev.skill_id not in seen_skills:
                                    seen_skills.add(ev.skill_id)
                                    all_skills.append(ev.skill_id)
                                    repo_result.normalized_skills.append(ev.skill_id)

            repo_results.append(repo_result)

        # ---- Python source analysis for each repository ----
        for repo_result in repo_results:
            # find original repo dict for owner
            # we can match by name
            orig_repo = next((r for r in deep_repos if r["name"] == repo_result.name), None)
            if not orig_repo:
                continue
            owner = _owner_login(orig_repo, username)
            py_evidence, py_warnings = analyze_repository_python(
                client, normalizer, repo_result, owner, repo_result.name, repo_result.url
            )
            repo_result.warnings.extend(py_warnings)
            for ev in py_evidence:
                # deduplicate within repo
                dup = False
                for existing in repo_result.evidence:
                    if (
                        existing.skill_id == ev.skill_id
                        and existing.evidence_type == ev.evidence_type
                        and existing.file_path == ev.file_path
                        and existing.raw_term == ev.raw_term
                    ):
                        dup = True
                        break
                if not dup:
                    repo_result.evidence.append(ev)
                    if ev.skill_id not in seen_skills:
                        seen_skills.add(ev.skill_id)
                        all_skills.append(ev.skill_id)
                        repo_result.normalized_skills.append(ev.skill_id)

        # ---- Commit/activity metadata for each repository ----
        for repo_result in repo_results:
            orig_repo = next((r for r in deep_repos if r["name"] == repo_result.name), None)
            if not orig_repo:
                continue
            owner = _owner_login(orig_repo, username)
            
            try:
                commit_warnings, activity = _fetch_and_analyze_commits(
                    client, owner, repo_result.name
                )
            except GitHubAnalysisError as e:
                # Systemic failures propagate
                if e.code in ("github_rate_limited", "github_private_or_forbidden", "github_invalid_base_url"):
                    raise
                commit_warnings = [f"commit_activity_unavailable: {e.code}"]
                activity = RepositoryActivity()
            
            repo_result.warnings.extend(commit_warnings)
            
            # Store activity metadata
            repo_result.activity = activity

        # Rebuild stable first-seen skill aggregation from final evidence order.
        all_skills = []
        seen_all: Set[str] = set()
        for repo_result in repo_results:
            repo_result.normalized_skills = []
            seen_repo: Set[str] = set()
            for ev in repo_result.evidence:
                if ev.skill_id not in seen_repo:
                    seen_repo.add(ev.skill_id)
                    repo_result.normalized_skills.append(ev.skill_id)
                if ev.skill_id not in seen_all:
                    seen_all.add(ev.skill_id)
                    all_skills.append(ev.skill_id)

        result.repositories = repo_results
        result.repositories_analyzed = len(repo_results)
        result.all_normalized_skills = all_skills

    finally:
        if own_client:
            client.close()

    return result
