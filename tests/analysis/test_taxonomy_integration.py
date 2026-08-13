"""Integration tests for the complete Day-1 taxonomy pipeline."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import yaml
from services.skill_normalizer.normalizer import normalize_skill, SkillNormalizer
from services.skill_normalizer.validator import validate_taxonomy


def test_validator_reports_valid():
    result = validate_taxonomy()
    assert result.valid, f"Taxonomy validation failed: {result.errors}"


def test_all_role_requirements_reference_canonical_skills():
    result = validate_taxonomy()
    assert result.valid


def test_all_alias_targets_exist():
    result = validate_taxonomy()
    assert result.valid


def _load_profiles():
    with open(ROOT / "tests" / "fixtures" / "member4_test_profiles.yaml", "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("profiles", [])


def test_ml_profile_normalizes():
    profiles = _load_profiles()
    profile = next(p for p in profiles if p["id"] == "ml_oriented")
    normalizer = SkillNormalizer()
    normalized = []
    unknown = []
    for term in profile["raw_skills"]:
        cid = normalizer.normalize_skill(term)
        if cid is None:
            unknown.append(term)
        else:
            normalized.append(cid)
    assert set(normalized) == set(profile["expected_canonical_skill_ids"])
    assert unknown == profile["expected_unknown_terms"]


def test_software_profile_normalizes():
    profiles = _load_profiles()
    profile = next(p for p in profiles if p["id"] == "software_oriented")
    normalizer = SkillNormalizer()
    normalized = []
    unknown = []
    for term in profile["raw_skills"]:
        cid = normalizer.normalize_skill(term)
        if cid is None:
            unknown.append(term)
        else:
            normalized.append(cid)
    assert set(normalized) == set(profile["expected_canonical_skill_ids"])
    assert unknown == profile["expected_unknown_terms"]


def test_data_profile_normalizes():
    profiles = _load_profiles()
    profile = next(p for p in profiles if p["id"] == "data_oriented")
    normalizer = SkillNormalizer()
    normalized = []
    unknown = []
    for term in profile["raw_skills"]:
        cid = normalizer.normalize_skill(term)
        if cid is None:
            unknown.append(term)
        else:
            normalized.append(cid)
    assert set(normalized) == set(profile["expected_canonical_skill_ids"])
    assert unknown == profile["expected_unknown_terms"]


def test_unknown_terms_return_none():
    assert normalize_skill("totally_unknown_skill_xyz") is None
    assert normalize_skill("") is None
    assert normalize_skill("   ") is None


def test_duplicate_candidates_do_not_create_duplicate_ids():
    normalizer = SkillNormalizer()
    terms = ["Python", "python3", "PYTHON", "py"]
    ids = {normalizer.normalize_skill(t) for t in terms}
    assert ids == {"python"}


def test_aliases_resolve_to_same_canonical():
    normalizer = SkillNormalizer()
    assert normalizer.normalize_skill("Python") == "python"
    assert normalizer.normalize_skill("python3") == "python"
    assert normalizer.normalize_skill("PYTHON") == "python"


def test_false_positive_safety():
    normalizer = SkillNormalizer()
    assert normalizer.normalize_skill("CSS") == "css"
    assert normalizer.normalize_skill("C") == "c"
    assert normalizer.normalize_skill("React") == "react"
    assert normalizer.normalize_skill("R") == "r"
    assert normalizer.normalize_skill("Go") == "go"
    assert normalizer.normalize_skill("Google") is None


# ----- Invalid configuration detection (using in-memory data) -----
def _make_validator_with_overrides(skills=None, aliases=None, roles=None):
    """Helper to run validator on temporary dicts by writing to temp files."""
    import tempfile, yaml
    base = ROOT / "shared" / "taxonomy"
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        s_path = tmp_path / "skills.yaml"
        a_path = tmp_path / "aliases.yaml"
        r_path = tmp_path / "roles.yaml"
        # start from real files then patch
        with open(base / "skills.yaml") as f:
            s_data = yaml.safe_load(f)
        with open(base / "aliases.yaml") as f:
            a_data = yaml.safe_load(f)
        with open(base / "role_requirements.yaml") as f:
            r_data = yaml.safe_load(f)
        if skills is not None:
            s_data["skills"] = skills
        if aliases is not None:
            a_data["aliases"] = aliases
        if roles is not None:
            r_data["roles"] = roles
        with open(s_path, "w") as f:
            yaml.safe_dump(s_data, f)
        with open(a_path, "w") as f:
            yaml.safe_dump(a_data, f)
        with open(r_path, "w") as f:
            yaml.safe_dump(r_data, f)
        return validate_taxonomy(s_path, a_path, r_path)


def test_invalid_duplicate_skill_id():
    skills = [
        {"id": "python", "name": "Python", "category": "programming_languages"},
        {"id": "python", "name": "Python Duplicate", "category": "programming_languages"},
    ]
    res = _make_validator_with_overrides(skills=skills)
    assert not res.valid
    assert any("Duplicate skill ID" in e for e in res.errors)


def test_invalid_duplicate_canonical_name():
    skills = [
        {"id": "python", "name": "Python", "category": "programming_languages"},
        {"id": "python2", "name": "Python", "category": "programming_languages"},
    ]
    res = _make_validator_with_overrides(skills=skills)
    assert not res.valid
    assert any("Duplicate canonical name" in e for e in res.errors)


def test_invalid_category():
    skills = [
        {"id": "foo", "name": "Foo", "category": "not_a_category"},
    ]
    res = _make_validator_with_overrides(skills=skills)
    assert not res.valid
    assert any("invalid category" in e for e in res.errors)


def test_invalid_alias_unknown_target():
    aliases = {"py": "nonexistent_skill"}
    res = _make_validator_with_overrides(aliases=aliases)
    assert not res.valid
    assert any("unknown canonical skill" in e for e in res.errors)


def test_invalid_alias_collision():
    aliases = {"py": "python", "PY": "java"}  # both normalize to "py"
    res = _make_validator_with_overrides(aliases=aliases)
    assert not res.valid
    assert any("Alias collision" in e for e in res.errors)


def test_invalid_role_unknown_skill():
    roles = [
        {
            "id": "ai_ml_engineer",
            "name": "AI/ML Engineer",
            "description": "d",
            "requirements": [{"skill_id": "nonexistent", "required_level": 3, "importance": 3, "requirement_type": "required"}],
        },
        {
            "id": "software_engineer",
            "name": "Software Engineer",
            "description": "d",
            "requirements": [],
        },
        {
            "id": "data_scientist",
            "name": "Data Scientist",
            "description": "d",
            "requirements": [],
        },
    ]
    res = _make_validator_with_overrides(roles=roles)
    assert not res.valid
    assert any("unknown skill_id" in e for e in res.errors)


def test_invalid_required_level():
    roles = [
        {
            "id": "ai_ml_engineer",
            "name": "AI/ML Engineer",
            "description": "d",
            "requirements": [{"skill_id": "python", "required_level": 6, "importance": 3, "requirement_type": "required"}],
        },
        {"id": "software_engineer", "name": "Software Engineer", "description": "d", "requirements": []},
        {"id": "data_scientist", "name": "Data Scientist", "description": "d", "requirements": []},
    ]
    res = _make_validator_with_overrides(roles=roles)
    assert not res.valid
    assert any("invalid required_level" in e for e in res.errors)


def test_invalid_importance():
    roles = [
        {
            "id": "ai_ml_engineer",
            "name": "AI/ML Engineer",
            "description": "d",
            "requirements": [{"skill_id": "python", "required_level": 3, "importance": 0, "requirement_type": "required"}],
        },
        {"id": "software_engineer", "name": "Software Engineer", "description": "d", "requirements": []},
        {"id": "data_scientist", "name": "Data Scientist", "description": "d", "requirements": []},
    ]
    res = _make_validator_with_overrides(roles=roles)
    assert not res.valid
    assert any("invalid importance" in e for e in res.errors)


def test_invalid_requirement_type():
    roles = [
        {
            "id": "ai_ml_engineer",
            "name": "AI/ML Engineer",
            "description": "d",
            "requirements": [{"skill_id": "python", "required_level": 3, "importance": 3, "requirement_type": "mandatory"}],
        },
        {"id": "software_engineer", "name": "Software Engineer", "description": "d", "requirements": []},
        {"id": "data_scientist", "name": "Data Scientist", "description": "d", "requirements": []},
    ]
    res = _make_validator_with_overrides(roles=roles)
    assert not res.valid
    assert any("invalid requirement_type" in e for e in res.errors)


def test_canonical_name_alias_collision():
    # alias "python" (normalizes to "python") pointing to java, while canonical name "Python" also normalizes to "python"
    aliases = {"python": "java"}
    res = _make_validator_with_overrides(aliases=aliases)
    assert not res.valid
    assert any("Canonical name" in e and "collides" in e for e in res.errors)


if __name__ == "__main__":
    # manual run fallback
    test_validator_reports_valid()
    test_all_role_requirements_reference_canonical_skills()
    test_all_alias_targets_exist()
    test_ml_profile_normalizes()
    test_software_profile_normalizes()
    test_data_profile_normalizes()
    test_unknown_terms_return_none()
    test_duplicate_candidates_do_not_create_duplicate_ids()
    test_aliases_resolve_to_same_canonical()
    test_false_positive_safety()
    test_invalid_duplicate_skill_id()
    test_invalid_duplicate_canonical_name()
    test_invalid_category()
    test_invalid_alias_unknown_target()
    test_invalid_alias_collision()
    test_invalid_role_unknown_skill()
    test_invalid_required_level()
    test_invalid_importance()
    test_invalid_requirement_type()
    print("All integration tests passed")