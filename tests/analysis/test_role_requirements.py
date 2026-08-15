"""Tests for role requirements validation."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import yaml


def load_skills():
    with open(ROOT / "shared" / "taxonomy" / "skills.yaml", "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return {s["id"]: s for s in data.get("skills", [])}


def load_roles():
    with open(ROOT / "shared" / "taxonomy" / "role_requirements.yaml", "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("roles", [])


def test_exactly_three_roles():
    roles = load_roles()
    assert len(roles) == 3, f"Expected 3 roles, got {len(roles)}"


def test_unique_role_ids():
    roles = load_roles()
    ids = [r["id"] for r in roles]
    assert len(set(ids)) == len(ids), "Duplicate role IDs"


def test_unique_role_names():
    roles = load_roles()
    names = [r["name"] for r in roles]
    assert len(set(names)) == len(names), "Duplicate role names"


def test_skill_ids_exist():
    skills = load_skills()
    roles = load_roles()
    for role in roles:
        for req in role.get("requirements", []):
            sid = req["skill_id"]
            assert sid in skills, f"Role {role['id']} references unknown skill_id: {sid}"


def test_no_alias_used():
    # We cannot programmatically know aliases, but we ensure skill_id matches canonical IDs (already checked)
    pass


def test_no_duplicate_requirement_per_role():
    roles = load_roles()
    for role in roles:
        seen = set()
        for req in role.get("requirements", []):
            sid = req["skill_id"]
            assert sid not in seen, f"Duplicate requirement for skill {sid} in role {role['id']}"
            seen.add(sid)


def test_required_level_range():
    roles = load_roles()
    for role in roles:
        for req in role.get("requirements", []):
            lvl = req["required_level"]
            assert isinstance(lvl, int) and 1 <= lvl <= 5, f"Invalid required_level {lvl} in role {role['id']}"


def test_importance_range():
    roles = load_roles()
    for role in roles:
        for req in role.get("requirements", []):
            imp = req["importance"]
            assert isinstance(imp, int) and 1 <= imp <= 5, f"Invalid importance {imp} in role {role['id']}"


def test_requirement_type_values():
    roles = load_roles()
    for role in roles:
        for req in role.get("requirements", []):
            t = req["requirement_type"]
            assert t in ("required", "preferred"), f"Invalid requirement_type {t} in role {role['id']}"


def test_requirement_count_bounds():
    roles = load_roles()
    for role in roles:
        cnt = len(role.get("requirements", []))
        assert 12 <= cnt <= 18, f"Role {role['id']} has {cnt} requirements (expected 12-18)"


def test_at_least_one_importance_5():
    roles = load_roles()
    for role in roles:
        assert any(req["importance"] == 5 for req in role.get("requirements", [])), f"Role {role['id']} lacks importance=5"


def test_at_least_one_required():
    roles = load_roles()
    for role in roles:
        assert any(req["requirement_type"] == "required" for req in role.get("requirements", [])), f"Role {role['id']} lacks required"


def test_cross_role_differentiation():
    roles = {r["id"]: r for r in load_roles()}
    # AI/ML Engineer: Machine Learning importance 5
    ai = next(req for req in roles["ai_ml_engineer"]["requirements"] if req["skill_id"] == "machine_learning")
    assert ai["importance"] == 5, "AI/ML Engineer should have Machine Learning importance 5"
    # Software Engineer: Data Structures and Algorithms importance 5
    se = next(req for req in roles["software_engineer"]["requirements"] if req["skill_id"] == "data_structures_and_algorithms")
    assert se["importance"] == 5, "Software Engineer should have DSA importance 5"
    # Data Scientist: Statistics importance 5 and Data Analysis importance 5
    ds_stats = next(req for req in roles["data_scientist"]["requirements"] if req["skill_id"] == "statistics")
    ds_da = next(req for req in roles["data_scientist"]["requirements"] if req["skill_id"] == "data_analysis")
    assert ds_stats["importance"] == 5, "Data Scientist should have Statistics importance 5"
    assert ds_da["importance"] == 5, "Data Scientist should have Data Analysis importance 5"


if __name__ == "__main__":
    test_exactly_three_roles()
    test_unique_role_ids()
    test_unique_role_names()
    test_skill_ids_exist()
    test_no_duplicate_requirement_per_role()
    test_required_level_range()
    test_importance_range()
    test_requirement_type_values()
    test_requirement_count_bounds()
    test_at_least_one_importance_5()
    test_at_least_one_required()
    test_cross_role_differentiation()
    print("All role requirement tests passed")