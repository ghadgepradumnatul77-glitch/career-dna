"""Deterministic validator for the complete taxonomy configuration."""

from dataclasses import dataclass
from pathlib import Path
import yaml
import re


@dataclass
class ValidationResult:
    valid: bool
    errors: list[str]

    @staticmethod
    def ok() -> "ValidationResult":
        return ValidationResult(True, [])

    @staticmethod
    def fail(errors: list[str]) -> "ValidationResult":
        return ValidationResult(False, errors)


_ALLOWED_CATEGORIES = {
    "programming_languages",
    "web_backend",
    "frontend",
    "databases",
    "data_engineering",
    "ai_machine_learning",
    "data_science",
    "cloud_devops",
    "testing",
    "tools_version_control",
    "software_engineering",
}

_REQUIRED_ROLE_IDS = {"ai_ml_engineer", "software_engineer", "data_scientist"}


def _normalize_token(text: str) -> str:
    if not isinstance(text, str):
        return ""
    t = text.strip()
    t = re.sub(r"\s+", " ", t)
    return t.casefold()


def validate_taxonomy(
    skills_path: str | Path | None = None,
    aliases_path: str | Path | None = None,
    roles_path: str | Path | None = None,
) -> ValidationResult:
    """Validate the full taxonomy (skills, aliases, role requirements)."""
    base = Path(__file__).resolve().parents[2]  # project root
    skills_path = Path(skills_path) if skills_path else base / "shared" / "taxonomy" / "skills.yaml"
    aliases_path = Path(aliases_path) if aliases_path else base / "shared" / "taxonomy" / "aliases.yaml"
    roles_path = Path(roles_path) if roles_path else base / "shared" / "taxonomy" / "role_requirements.yaml"

    errors: list[str] = []

    # ----- Load files -----
    try:
        with open(skills_path, "r", encoding="utf-8") as f:
            skills_data = yaml.safe_load(f) or {}
    except Exception as e:
        return ValidationResult.fail([f"Failed to load skills.yaml: {e}"])

    try:
        with open(aliases_path, "r", encoding="utf-8") as f:
            aliases_data = yaml.safe_load(f) or {}
    except Exception as e:
        return ValidationResult.fail([f"Failed to load aliases.yaml: {e}"])

    try:
        with open(roles_path, "r", encoding="utf-8") as f:
            roles_data = yaml.safe_load(f) or {}
    except Exception as e:
        return ValidationResult.fail([f"Failed to load role_requirements.yaml: {e}"])

    # ----- SKILLS validation -----
    skills = skills_data.get("skills")
    if not isinstance(skills, list) or not skills:
        errors.append("skills.yaml must contain a non-empty 'skills' list")
    else:
        seen_ids = set()
        seen_names = set()
        for idx, skill in enumerate(skills):
            # required fields
            for field in ("id", "name", "category"):
                if field not in skill:
                    errors.append(f"Skill at index {idx} missing required field '{field}'")
            sid = skill.get("id", "")
            name = skill.get("name", "")
            cat = skill.get("category", "")

            # unique IDs
            if sid in seen_ids:
                errors.append(f"Duplicate skill ID: {sid}")
            seen_ids.add(sid)

            # unique canonical names case-insensitively
            norm_name = name.casefold()
            if norm_name in seen_names:
                errors.append(f"Duplicate canonical name (case-insensitive): {name}")
            seen_names.add(norm_name)

            # machine-readable ID (lowercase, alphanum/underscore)
            if not re.fullmatch(r"[a-z0-9_]+", sid):
                errors.append(f"Skill ID not machine-readable (lowercase, underscore only): {sid}")

            # allowed category
            if cat not in _ALLOWED_CATEGORIES:
                errors.append(f"Skill '{sid}' has invalid category '{cat}'")

    canonical_ids = {s["id"] for s in skills if isinstance(s, dict) and "id" in s}

    # ----- ALIASES validation -----
    aliases = aliases_data.get("aliases")
    if not isinstance(aliases, dict):
        errors.append("aliases.yaml must contain an 'aliases' mapping")
    else:
        norm_alias_map: dict[str, str] = {}
        for alias_raw, target_id in aliases.items():
            if target_id not in canonical_ids:
                errors.append(f"Alias '{alias_raw}' points to unknown canonical skill '{target_id}'")
            norm = _normalize_token(alias_raw)
            if norm in norm_alias_map and norm_alias_map[norm] != target_id:
                errors.append(f"Alias collision: '{alias_raw}' normalizes to same key as another alias mapping to different skill")
            norm_alias_map[norm] = target_id

    # ----- ROLE REQUIREMENTS validation -----
    roles = roles_data.get("roles")
    if not isinstance(roles, list):
        errors.append("role_requirements.yaml must contain a 'roles' list")
    else:
        if len(roles) != 3:
            errors.append(f"Expected exactly 3 roles, found {len(roles)}")
        role_ids = set()
        role_names = set()
        for role in roles:
            rid = role.get("id")
            rname = role.get("name")
            if rid in role_ids:
                errors.append(f"Duplicate role ID: {rid}")
            role_ids.add(rid)
            if rname in role_names:
                errors.append(f"Duplicate role name: {rname}")
            role_names.add(rname)

            if rid not in _REQUIRED_ROLE_IDS:
                errors.append(f"Unexpected role ID '{rid}' (expected one of {_REQUIRED_ROLE_IDS})")

            reqs = role.get("requirements")
            if not isinstance(reqs, list):
                errors.append(f"Role '{rid}' must have a 'requirements' list")
                continue

            seen_req_skills = set()
            for req in reqs:
                sid = req.get("skill_id")
                if sid not in canonical_ids:
                    errors.append(f"Role '{rid}' references unknown skill_id '{sid}'")
                if sid in seen_req_skills:
                    errors.append(f"Role '{rid}' has duplicate requirement for skill '{sid}'")
                seen_req_skills.add(sid)

                lvl = req.get("required_level")
                if not isinstance(lvl, int) or not (1 <= lvl <= 5):
                    errors.append(f"Role '{rid}' skill '{sid}' has invalid required_level: {lvl}")

                imp = req.get("importance")
                if not isinstance(imp, int) or not (1 <= imp <= 5):
                    errors.append(f"Role '{rid}' skill '{sid}' has invalid importance: {imp}")

                rtype = req.get("requirement_type")
                if rtype not in ("required", "preferred"):
                    errors.append(f"Role '{rid}' skill '{sid}' has invalid requirement_type: {rtype}")

    return ValidationResult.ok() if not errors else ValidationResult.fail(errors)