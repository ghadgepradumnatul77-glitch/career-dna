"""Tests for the resume parser foundation."""

import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from services.resume_parser.parser import parse_resume_text, parse_resume_pdf, ResumeParseError
from services.resume_parser.sections import detect_sections


def test_meaningful_text_parses_successfully():
    text = "SUMMARY\nHello world\nSKILLS\nPython, SQL"
    result = parse_resume_text(text)
    assert isinstance(result.raw_text, str)
    assert "summary" in result.sections
    assert "skills" in result.sections


def test_empty_string_fails():
    try:
        parse_resume_text("")
        assert False, "Expected ResumeParseError"
    except ResumeParseError:
        pass


def test_whitespace_only_fails():
    try:
        parse_resume_text("   \n\t\n  ")
        assert False, "Expected ResumeParseError"
    except ResumeParseError:
        pass


def test_crlf_normalized():
    text = "SUMMARY\r\nHello\r\nSKILLS\r\nPython"
    result = parse_resume_text(text)
    assert "\r" not in result.raw_text
    assert "summary" in result.sections


def test_recognized_headings_detected():
    text = "TECHNICAL SKILLS\nPython\nPROJECTS\nMy project"
    result = parse_resume_text(text)
    assert "skills" in result.sections
    assert "projects" in result.sections


def test_heading_aliases_map_to_stable_names():
    # "Technical Skills:" with colon
    text = "Technical Skills:\nPython\nWORK EXPERIENCE\nDev"
    result = parse_resume_text(text)
    assert "skills" in result.sections
    assert "experience" in result.sections


def test_skills_with_colon_detected():
    text = "SKILLS:\nPython, SQL"
    result = parse_resume_text(text)
    assert "skills" in result.sections


def test_punctuation_preserved():
    text = "SKILLS\nC++\nC#\nNode.js\nCI/CD"
    result = parse_resume_text(text)
    # Ensure punctuation not stripped
    assert "C++" in result.raw_text
    assert "C#" in result.raw_text
    assert "Node.js" in result.raw_text
    assert "CI/CD" in result.raw_text


def test_ordinary_lines_not_headings():
    text = "Python Developer\nMachine Learning Engineer\nGoogle Cloud Platform\nSKILLS\nPython"
    result = parse_resume_text(text)
    # Only "skills" should be a section
    assert set(result.sections.keys()) == {"skills"}


def test_sectionless_meaningful_resume_parses():
    text = "Experienced developer with Python and SQL expertise."
    result = parse_resume_text(text)
    assert result.sections == {}
    # Should have warning
    assert "no_recognized_sections" in result.warnings


def test_sectionless_returns_deterministic_warning():
    text = "Just a line of text."
    result = parse_resume_text(text)
    assert result.warnings == ["no_recognized_sections"]


def test_synthetic_fixture_parses_without_pii():
    fixture_path = "tests/fixtures/sample_resume.txt"
    with open(fixture_path, "r", encoding="utf-8") as f:
        text = f.read()
    result = parse_resume_text(text)
    # Basic sanity checks
    assert result.raw_text == text.replace("\r\n", "\n").replace("\r", "\n")
    assert set(result.sections.keys()) >= {"summary", "skills", "projects", "experience", "education", "certifications"}
    # Ensure no real PII patterns (simple check)
    assert "@" not in result.raw_text
    assert "phone" not in result.raw_text.lower()


# ---- Skill extraction tests ----
def test_canonical_skill_extraction():
    text = "SKILLS\nPython\nSQL\nDocker"
    result = parse_resume_text(text)
    assert "python" in [s.skill_id for s in result.normalized_skills]
    assert "sql" in [s.skill_id for s in result.normalized_skills]
    assert "docker" in [s.skill_id for s in result.normalized_skills]
    # candidate skills contain raw terms
    assert "Python" in result.candidate_skills
    assert "SQL" in result.candidate_skills
    assert "Docker" in result.candidate_skills


def test_alias_normalization():
    text = "SKILLS\nPython3\nsklearn\ncicd"
    result = parse_resume_text(text)
    ids = {s.skill_id for s in result.normalized_skills}
    assert "python" in ids
    assert "scikit_learn" in ids
    assert "ci_cd" in ids


def test_punctuation_skills():
    text = "SKILLS\nC++\nC#\nNode.js\nCI/CD"
    result = parse_resume_text(text)
    ids = {s.skill_id for s in result.normalized_skills}
    assert "cpp" in ids
    assert "csharp" in ids
    assert "nodejs" in ids
    assert "ci_cd" in ids


def test_multiword_skill():
    text = "SKILLS\nMachine Learning\nDeep Learning"
    result = parse_resume_text(text)
    ids = {s.skill_id for s in result.normalized_skills}
    assert "machine_learning" in ids
    assert "deep_learning" in ids


def test_false_positive_safety():
    text = "SKILLS\nCSS\nReact\nGoogle\nDjango"
    result = parse_resume_text(text)
    ids = {s.skill_id for s in result.normalized_skills}
    # Should have css, react, django but NOT c, r, go from these
    assert "css" in ids
    assert "react" in ids
    assert "django" in ids
    assert "c" not in ids
    assert "r" not in ids
    assert "go" not in ids


def test_one_char_uppercase_match():
    text = "SKILLS\nC\nR"
    result = parse_resume_text(text)
    ids = {s.skill_id for s in result.normalized_skills}
    assert "c" in ids
    assert "r" in ids


def test_one_char_lowercase_no_match():
    # lowercase isolated letters should not match
    text = "SKILLS\nc\nr"
    result = parse_resume_text(text)
    ids = {s.skill_id for s in result.normalized_skills}
    assert "c" not in ids
    assert "r" not in ids
    # also in prose
    text2 = "developed c applications and used r for stats"
    result2 = parse_resume_text(text2)
    ids2 = {s.skill_id for s in result2.normalized_skills}
    assert "c" not in ids2
    assert "r" not in ids2


def test_deduplication_across_sections():
    text = "SKILLS\nPython\nPROJECTS\nBuilt a system in Python\nEXPERIENCE\nUsed Python daily"
    result = parse_resume_text(text)
    # Only one normalized skill for python
    python_skills = [s for s in result.normalized_skills if s.skill_id == "python"]
    assert len(python_skills) == 1
    # Should have three evidence entries
    assert len(python_skills[0].evidence) == 3
    ev_types = {e.evidence_type for e in python_skills[0].evidence}
    assert "skill_claim" in ev_types
    assert "project_usage" in ev_types
    assert "experience_usage" in ev_types


def test_evidence_section_mapping():
    text = "SKILLS\nPython\nPROJECTS\nUsed Docker\nEXPERIENCE\nManaged Kubernetes"
    result = parse_resume_text(text)
    # Check evidence types
    for skill in result.normalized_skills:
        for ev in skill.evidence:
            if ev.skill_id == "python":
                assert ev.evidence_type == "skill_claim"
            elif ev.skill_id == "docker":
                assert ev.evidence_type == "project_usage"
            elif ev.skill_id == "kubernetes":
                assert ev.evidence_type == "experience_usage"


# ---- PDF tests (mocked) ----
def test_parse_resume_pdf_missing_file():
    try:
        parse_resume_pdf("nonexistent.pdf")
        assert False, "Expected ResumeParseError"
    except ResumeParseError as e:
        assert "pdf_file_missing" in str(e)


def test_parse_resume_pdf_wrong_extension():
    try:
        parse_resume_pdf("resume.txt")
        assert False, "Expected ResumeParseError"
    except ResumeParseError as e:
        assert "pdf_invalid_extension" in str(e)


def test_parse_resume_pdf_directory():
    import tempfile, os
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create a directory with .pdf suffix to pass extension check
        pdf_dir = Path(tmpdir) / "dummy.pdf"
        pdf_dir.mkdir()
        try:
            parse_resume_pdf(pdf_dir)
            assert False, "Expected ResumeParseError"
        except ResumeParseError as e:
            assert "pdf_path_not_a_file" in str(e)


def test_parse_resume_pdf_mocked():
    # Create a temporary dummy pdf file
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        # Mock pdfplumber.open to return a fake PDF object that is a context manager
        mock_page1 = MagicMock()
        mock_page1.extract_text.return_value = "SKILLS\nPython\nJava"
        mock_page2 = MagicMock()
        mock_page2.extract_text.return_value = "PROJECTS\nBuilt with Docker"
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page1, mock_page2]
        mock_pdf.__enter__.return_value = mock_pdf
        mock_pdf.__exit__.return_value = False
        with patch("services.resume_parser.pdf_reader.pdfplumber.open", return_value=mock_pdf):
            result = parse_resume_pdf(tmp_path)
        assert "python" in [s.skill_id for s in result.normalized_skills]
        assert "java" in [s.skill_id for s in result.normalized_skills]
        assert "docker" in [s.skill_id for s in result.normalized_skills]
        # page order preserved in raw_text
        assert result.raw_text.startswith("SKILLS")
    finally:
        os.unlink(tmp_path)


def test_parse_resume_pdf_empty_text():
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        mock_page = MagicMock()
        mock_page.extract_text.return_value = ""
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page]
        mock_pdf.__enter__.return_value = mock_pdf
        mock_pdf.__exit__.return_value = False
        with patch("services.resume_parser.pdf_reader.pdfplumber.open", return_value=mock_pdf):
            try:
                parse_resume_pdf(tmp_path)
                assert False, "Expected ResumeParseError"
            except ResumeParseError as e:
                assert "pdf_contains_no_extractable_text" in str(e)
    finally:
        os.unlink(tmp_path)


# ---- Structured entity extraction tests ----
def test_projects_extraction():
    fixture_path = "tests/fixtures/sample_resume.txt"
    with open(fixture_path, "r", encoding="utf-8") as f:
        text = f.read()
    result = parse_resume_text(text)
    assert len(result.projects) >= 2
    titles = [p.title for p in result.projects]
    assert "Spam Classifier" in titles
    assert "Portfolio Website" in titles
    # technologies contain canonical skill ids
    spam = next(p for p in result.projects if p.title == "Spam Classifier")
    assert "python" in spam.technologies
    assert "fastapi" in spam.technologies
    assert "scikit_learn" in spam.technologies
    assert "docker" in spam.technologies
    # source_text preserved
    assert spam.source_text != ""


def test_experience_extraction():
    fixture_path = "tests/fixtures/sample_resume.txt"
    with open(fixture_path, "r", encoding="utf-8") as f:
        text = f.read()
    result = parse_resume_text(text)
    assert len(result.experience) >= 2
    # first entry pipe-separated
    exp1 = result.experience[0]
    assert exp1.role == "Software Engineering Intern"
    assert exp1.organization == "Example Labs"
    assert exp1.date_text == "Jan 2026 - Mar 2026"
    assert "Python" in exp1.description or "PostgreSQL" in exp1.description
    assert exp1.source_text != ""


def test_education_extraction():
    fixture_path = "tests/fixtures/sample_resume.txt"
    with open(fixture_path, "r", encoding="utf-8") as f:
        text = f.read()
    result = parse_resume_text(text)
    assert len(result.education) >= 1
    edu = result.education[0]
    assert "Bachelor" in (edu.degree or "")
    assert "Example University" in (edu.institution or "")
    assert edu.date_text is not None
    assert edu.source_text != ""


def test_missing_sections_empty_lists():
    text = "SKILLS\nPython"
    result = parse_resume_text(text)
    assert result.projects == []
    assert result.experience == []
    assert result.education == []


def test_empty_section_yields_empty():
    text = "PROJECTS\n\nEXPERIENCE\n\nEDUCATION\n"
    result = parse_resume_text(text)
    assert result.projects == []
    assert result.experience == []
    assert result.education == []


def test_serialization_to_json():
    import json
    fixture_path = "tests/fixtures/sample_resume.txt"
    with open(fixture_path, "r", encoding="utf-8") as f:
        text = f.read()
    result = parse_resume_text(text)
    data = result.to_dict()
    # Ensure it can be JSON serialized
    json_str = json.dumps(data)
    assert isinstance(json_str, str)
    # Basic structural checks
    loaded = json.loads(json_str)
    assert "normalized_skills" in loaded
    assert "projects" in loaded
    assert "experience" in loaded
    assert "education" in loaded


# ---- Custom taxonomy / normalizer tests ----
def test_custom_taxonomy_detection():
    import tempfile, os, yaml
    from services.skill_normalizer.normalizer import SkillNormalizer
    # Create temporary taxonomy with a unique skill
    with tempfile.TemporaryDirectory() as tmpdir:
        skills_path = Path(tmpdir) / "skills.yaml"
        aliases_path = Path(tmpdir) / "aliases.yaml"
        skills_data = {
            "skills": [
                {"id": "quantum_widget", "name": "QuantumWidget", "category": "software_engineering"}
            ]
        }
        aliases_data = {"aliases": {"qwidget": "quantum_widget"}}
        with open(skills_path, "w") as f:
            yaml.safe_dump(skills_data, f)
        with open(aliases_path, "w") as f:
            yaml.safe_dump(aliases_data, f)
        custom_normalizer = SkillNormalizer(str(skills_path), str(aliases_path))
        # Text containing the custom terms
        text = "SKILLS\nQuantumWidget\nqwidget"
        result = parse_resume_text(text, normalizer=custom_normalizer)
        ids = {s.skill_id for s in result.normalized_skills}
        assert "quantum_widget" in ids
        # Ensure default taxonomy terms not mistakenly matched (e.g., python not present)
        assert "python" not in ids


def test_custom_taxonomy_isolation():
    import tempfile, yaml
    from services.skill_normalizer.normalizer import SkillNormalizer
    with tempfile.TemporaryDirectory() as tmpdir:
        skills_path = Path(tmpdir) / "skills.yaml"
        aliases_path = Path(tmpdir) / "aliases.yaml"
        skills_data = {
            "skills": [
                {"id": "foo_skill", "name": "FooSkill", "category": "software_engineering"}
            ]
        }
        aliases_data = {"aliases": {"foo": "foo_skill"}}
        with open(skills_path, "w") as f:
            yaml.safe_dump(skills_data, f)
        with open(aliases_path, "w") as f:
            yaml.safe_dump(aliases_data, f)
        custom_norm = SkillNormalizer(str(skills_path), str(aliases_path))
        # Use custom first
        text1 = "SKILLS\nFooSkill"
        res1 = parse_resume_text(text1, normalizer=custom_norm)
        assert "foo_skill" in {s.skill_id for s in res1.normalized_skills}
        # Then default parser should still work for python
        text2 = "SKILLS\nPython"
        res2 = parse_resume_text(text2)  # default normalizer
        assert "python" in {s.skill_id for s in res2.normalized_skills}
        # Custom terms not leak into default
        assert "foo_skill" not in {s.skill_id for s in res2.normalized_skills}


# ---- Ambiguous entity tests ----
def test_ambiguous_experience():
    text = "EXPERIENCE\nWorked on backend systems using Python and PostgreSQL."
    result = parse_resume_text(text)
    assert len(result.experience) == 1
    exp = result.experience[0]
    assert exp.role is None
    assert exp.organization is None
    assert exp.date_text is None
    assert "Python" in exp.description
    assert exp.source_text != ""


def test_ambiguous_education():
    text = "EDUCATION\nCompleted undergraduate coursework in computing."
    result = parse_resume_text(text)
    assert len(result.education) == 1
    edu = result.education[0]
    assert edu.degree is None
    assert edu.institution is None
    assert edu.date_text is None
    assert edu.source_text != ""


def test_project_fallback_untitled():
    text = "PROJECTS\nBuilt an API using Python and FastAPI."
    result = parse_resume_text(text)
    assert len(result.projects) == 1
    proj = result.projects[0]
    assert proj.title is None
    assert "Python" in proj.description or "FastAPI" in proj.description
    assert "python" in proj.technologies
    assert "fastapi" in proj.technologies
    assert proj.source_text != ""


# ---- PDF guard tests ----
def test_pdf_oversized():
    import tempfile, os
    from pathlib import Path
    from unittest.mock import patch, MagicMock
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        mock_stat = MagicMock()
        mock_stat.st_size = 11 * 1024 * 1024
        mock_stat.st_mode = 0o100644  # regular file
        with patch.object(Path, "stat", return_value=mock_stat), \
             patch.object(Path, "is_file", return_value=True):
            try:
                parse_resume_pdf(tmp_path)
                assert False, "Expected ResumeParseError"
            except ResumeParseError as e:
                assert "pdf_file_too_large" in str(e)
    finally:
        os.unlink(tmp_path)


def test_pdf_too_many_pages():
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        mock_pages = [MagicMock() for _ in range(21)]
        for mp in mock_pages:
            mp.extract_text.return_value = "SKILLS\nPython"
        mock_pdf = MagicMock()
        mock_pdf.pages = mock_pages
        mock_pdf.__enter__.return_value = mock_pdf
        mock_pdf.__exit__.return_value = False
        with patch("services.resume_parser.pdf_reader.pdfplumber.open", return_value=mock_pdf):
            try:
                parse_resume_pdf(tmp_path)
                assert False, "Expected ResumeParseError"
            except ResumeParseError as e:
                assert "pdf_too_many_pages" in str(e)
    finally:
        os.unlink(tmp_path)


def test_pdf_within_limits():
    import tempfile, os
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        mock_page1 = MagicMock()
        mock_page1.extract_text.return_value = "SKILLS\nPython\nJava"
        mock_page2 = MagicMock()
        mock_page2.extract_text.return_value = "PROJECTS\nBuilt with Docker"
        mock_pdf = MagicMock()
        mock_pdf.pages = [mock_page1, mock_page2]
        mock_pdf.__enter__.return_value = mock_pdf
        mock_pdf.__exit__.return_value = False
        with patch("services.resume_parser.pdf_reader.pdfplumber.open", return_value=mock_pdf):
            result = parse_resume_pdf(tmp_path)
            assert "python" in [s.skill_id for s in result.normalized_skills]
            assert "java" in [s.skill_id for s in result.normalized_skills]
            assert "docker" in [s.skill_id for s in result.normalized_skills]
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    # Manual run fallback without pytest
    test_meaningful_text_parses_successfully()
    test_empty_string_fails()
    test_whitespace_only_fails()
    test_crlf_normalized()
    test_recognized_headings_detected()
    test_heading_aliases_map_to_stable_names()
    test_skills_with_colon_detected()
    test_punctuation_preserved()
    test_ordinary_lines_not_headings()
    test_sectionless_meaningful_resume_parses()
    test_sectionless_returns_deterministic_warning()
    test_synthetic_fixture_parses_without_pii()
    # new skill extraction tests
    test_canonical_skill_extraction()
    test_alias_normalization()
    test_punctuation_skills()
    test_multiword_skill()
    test_false_positive_safety()
    test_one_char_uppercase_match()
    test_one_char_lowercase_no_match()
    test_deduplication_across_sections()
    test_evidence_section_mapping()
    # pdf tests
    test_parse_resume_pdf_missing_file()
    test_parse_resume_pdf_wrong_extension()
    test_parse_resume_pdf_directory()
    test_parse_resume_pdf_mocked()
    test_parse_resume_pdf_empty_text()
    test_pdf_oversized()
    test_pdf_too_many_pages()
    test_pdf_within_limits()
    # structured entity tests
    test_projects_extraction()
    test_experience_extraction()
    test_education_extraction()
    test_missing_sections_empty_lists()
    test_empty_section_yields_empty()
    test_serialization_to_json()
    # custom taxonomy tests
    test_custom_taxonomy_detection()
    test_custom_taxonomy_isolation()
    # ambiguous entity tests
    test_ambiguous_experience()
    test_ambiguous_education()
    test_project_fallback_untitled()
    print("All resume parser tests passed")