import io
import unittest
from unittest.mock import patch, MagicMock
from pypdf import PdfWriter

from shared.schemas.evidence import SkillEvidence
from shared.schemas.skill import SkillProfile
from shared.schemas.analysis import AnalysisRequest
from services.db_service import (
    reset_in_memory_db,
    save_evidence,
    get_evidence_by_user,
    clear_user_evidence,
)
from services.ingestion.resume_parser import (
    extract_text_from_pdf_bytes,
    parse_resume_file,
)
from services.ingestion.github_service import (
    clean_github_username,
    link_and_parse_github,
)
from services.ingestion.evidence_aggregator import aggregate_evidence_to_profiles
from services.ai_service.analysis_service import run_full_analysis


class TestRealEvidenceIngestion(unittest.TestCase):
    def setUp(self):
        reset_in_memory_db()

    def tearDown(self):
        reset_in_memory_db()

    # -------------------------------------------------------------------------
    # RESUME TESTS (1 - 6)
    # -------------------------------------------------------------------------
    def test_1_valid_pdf_text_extraction(self):
        """1. Valid PDF text extraction returns string."""
        # Mock extract_text to return valid resume text for test
        with patch("services.ingestion.resume_parser.PdfReader") as mock_reader:
            mock_page = MagicMock()
            mock_page.extract_text.return_value = "SKILLS: Python, Machine Learning, Statistics, Git"
            mock_reader.return_value.pages = [mock_page]

            text = extract_text_from_pdf_bytes(b"%PDF-1.4 dummy bytes")
            self.assertIn("Python", text)

    def test_2_invalid_pdf_handling(self):
        """2. Invalid PDF bytes raise ValueError."""
        with self.assertRaises(ValueError):
            extract_text_from_pdf_bytes(b"not a real pdf content")

    def test_3_empty_pdf_handling(self):
        """3. Empty PDF bytes raise ValueError."""
        with self.assertRaises(ValueError):
            extract_text_from_pdf_bytes(b"")

    def test_4_skill_detection_from_resume(self):
        """4. Detect canonical skills from resume text."""
        with patch("services.ingestion.resume_parser.PdfReader") as mock_reader:
            mock_page = MagicMock()
            mock_page.extract_text.return_value = (
                "EXPERIENCE & SKILLS:\n"
                "Proficient in Python, FastAPI, Docker, SQL, Machine Learning, and Git."
            )
            mock_reader.return_value.pages = [mock_page]

            res = parse_resume_file(
                user_id="user-resume-01",
                file_bytes=b"%PDF-1.4 dummy",
                filename="cv.pdf",
                db_path=":memory:"
            )

            self.assertEqual(res["user_id"], "user-resume-01")
            self.assertEqual(res["source"], "resume")
            self.assertIn("Python", res["skills_detected"])
            self.assertIn("Machine Learning", res["skills_detected"])
            self.assertIn("Docker", res["skills_detected"])

    def test_5_resume_evidence_generation(self):
        """5. Verify SkillEvidence items generated from resume are stored in DB."""
        with patch("services.ingestion.resume_parser.PdfReader") as mock_reader:
            mock_page = MagicMock()
            mock_page.extract_text.return_value = "TECHNICAL SKILLS: Python, Statistics"
            mock_reader.return_value.pages = [mock_page]

            parse_resume_file(
                user_id="user-resume-02",
                file_bytes=b"%PDF-1.4 dummy",
                filename="resume.pdf",
                db_path=":memory:"
            )

            ev = get_evidence_by_user("user-resume-02", db_path=":memory:")
            self.assertGreater(len(ev), 0)
            skills = [e.skill for e in ev]
            self.assertIn("Python", skills)

    def test_6_user_specific_resume_evidence(self):
        """6. Resume evidence is strictly associated with user_id."""
        with patch("services.ingestion.resume_parser.PdfReader") as mock_reader:
            mock_page = MagicMock()
            mock_page.extract_text.return_value = "SKILLS: Python, SQL"
            mock_reader.return_value.pages = [mock_page]

            parse_resume_file(
                user_id="user-unique-resume-A",
                file_bytes=b"%PDF-1.4 dummy",
                filename="a.pdf",
                db_path=":memory:"
            )

            ev_a = get_evidence_by_user("user-unique-resume-A", db_path=":memory:")
            ev_b = get_evidence_by_user("user-unique-resume-B", db_path=":memory:")
            self.assertGreater(len(ev_a), 0)
            self.assertEqual(len(ev_b), 0)

    # -------------------------------------------------------------------------
    # GITHUB TESTS (7 - 12)
    # -------------------------------------------------------------------------
    def test_7_github_username_cleaning(self):
        """7. Clean username from full GitHub URLs."""
        self.assertEqual(clean_github_username("https://github.com/Shravan-Bhagat"), "Shravan-Bhagat")
        self.assertEqual(clean_github_username("TejasMore/"), "TejasMore")

    @patch("httpx.Client.get")
    def test_8_github_repository_language_extraction(self, mock_get):
        """8. Extract primary languages from GitHub API repos response."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {
                "name": "ai-ml-project",
                "html_url": "https://github.com/shravan/ai-ml-project",
                "language": "Python",
                "topics": ["machine-learning", "fastapi"],
                "description": "An AI pipeline built with Python and FastAPI",
                "stargazers_count": 5
            }
        ]
        mock_get.return_value = mock_resp

        res = link_and_parse_github(
            user_id="user-gh-01",
            username="shravan",
            db_path=":memory:"
        )

        self.assertEqual(res["user_id"], "user-gh-01")
        self.assertIn("Python", res["skills_detected"])

    @patch("httpx.Client.get")
    def test_9_github_topic_and_desc_skill_mapping(self, mock_get):
        """9. Map topics and description keywords to canonical skills."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {
                "name": "docker-sql-demo",
                "html_url": "https://github.com/dev/demo",
                "language": "Python",
                "topics": ["docker", "sql"],
                "description": "SQL database pipeline with Docker",
                "stargazers_count": 2
            }
        ]
        mock_get.return_value = mock_resp

        res = link_and_parse_github(
            user_id="user-gh-02",
            username="dev",
            db_path=":memory:"
        )

        self.assertIn("Docker", res["skills_detected"])
        self.assertIn("SQL", res["skills_detected"])

    @patch("httpx.Client.get")
    def test_10_github_evidence_generation(self, mock_get):
        """10. Verify GitHub evidence items are stored in SQLite."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {
                "name": "git-tools",
                "html_url": "https://github.com/dev/git-tools",
                "language": "Python",
                "topics": [],
                "description": "Git automation tools",
                "stargazers_count": 1
            }
        ]
        mock_get.return_value = mock_resp

        link_and_parse_github(
            user_id="user-gh-03",
            username="dev",
            db_path=":memory:"
        )

        ev = get_evidence_by_user("user-gh-03", db_path=":memory:")
        self.assertGreater(len(ev), 0)
        self.assertTrue(any(e.source == "github" for e in ev))

    @patch("httpx.Client.get")
    def test_11_github_failure_handling(self, mock_get):
        """11. Handle non-existent GitHub username (404)."""
        mock_resp = MagicMock()
        mock_resp.status_code = 404
        mock_get.return_value = mock_resp

        with self.assertRaises(ValueError):
            link_and_parse_github(
                user_id="user-gh-fail",
                username="non-existent-user-12345",
                db_path=":memory:"
            )

    @patch("httpx.Client.get")
    def test_12_user_specific_github_evidence(self, mock_get):
        """12. GitHub evidence is strictly isolated by user_id."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {
                "name": "repo-a",
                "html_url": "https://github.com/usera/repo-a",
                "language": "Python",
                "topics": [],
                "description": "Python repo",
                "stargazers_count": 0
            }
        ]
        mock_get.return_value = mock_resp

        link_and_parse_github("user-gh-A", "usera", db_path=":memory:")

        ev_a = get_evidence_by_user("user-gh-A", db_path=":memory:")
        ev_b = get_evidence_by_user("user-gh-B", db_path=":memory:")
        self.assertGreater(len(ev_a), 0)
        self.assertEqual(len(ev_b), 0)

    # -------------------------------------------------------------------------
    # AGGREGATION TESTS (13 - 16)
    # -------------------------------------------------------------------------
    def test_13_multiple_evidence_combines_into_skill_profile(self):
        """13. Combine resume and github evidence for same skill into single SkillProfile."""
        user_id = "user-agg-01"
        save_evidence(
            user_id,
            SkillEvidence(
                skill="Python", source="resume", evidence_type="skill_mention",
                strength=70.0, confidence=85.0, relevance=90.0, recency=85.0,
                description="Resume mention"
            ),
            db_path=":memory:"
        )
        save_evidence(
            user_id,
            SkillEvidence(
                skill="Python", source="github", evidence_type="repo_language",
                strength=80.0, confidence=90.0, relevance=90.0, recency=90.0,
                description="GitHub language"
            ),
            db_path=":memory:"
        )

        profiles = aggregate_evidence_to_profiles(user_id, db_path=":memory:")
        self.assertEqual(len(profiles), 1)

        py_prof = profiles[0]
        self.assertEqual(py_prof.skill, "Python")
        self.assertEqual(py_prof.evidence_count, 2)
        self.assertIn("resume", py_prof.evidence_sources)
        self.assertIn("github", py_prof.evidence_sources)

    def test_14_evidence_confidence_affects_proficiency(self):
        """14. Higher strength & confidence in evidence increases overall proficiency score."""
        user_low = "user-prof-low"
        save_evidence(
            user_low,
            SkillEvidence(
                skill="Python", source="resume", evidence_type="mention",
                strength=50.0, confidence=70.0, relevance=80.0, recency=70.0,
                description="Low evidence"
            ),
            db_path=":memory:"
        )

        user_high = "user-prof-high"
        save_evidence(
            user_high,
            SkillEvidence(
                skill="Python", source="resume", evidence_type="mention",
                strength=85.0, confidence=95.0, relevance=90.0, recency=90.0,
                description="High evidence"
            ),
            db_path=":memory:"
        )

        prof_low = aggregate_evidence_to_profiles(user_low, db_path=":memory:")[0]
        prof_high = aggregate_evidence_to_profiles(user_high, db_path=":memory:")[0]

        self.assertGreater(prof_high.proficiency, prof_low.proficiency)

    def test_15_multiple_sources_preserved(self):
        """15. Multiple evidence sources are distinct and preserved."""
        user_id = "user-agg-sources"
        save_evidence(user_id, SkillEvidence(skill="Git", source="resume", evidence_type="m", strength=70.0, confidence=85.0, relevance=90.0, recency=85.0, description="desc"), db_path=":memory:")
        save_evidence(user_id, SkillEvidence(skill="Git", source="github", evidence_type="m", strength=75.0, confidence=90.0, relevance=90.0, recency=90.0, description="desc"), db_path=":memory:")

        profiles = aggregate_evidence_to_profiles(user_id, db_path=":memory:")
        self.assertEqual(sorted(profiles[0].evidence_sources), ["github", "resume"])

    def test_16_missing_skill_remains_missing(self):
        """16. Un-evidenced role skills remain absent from aggregated profiles."""
        user_id = "user-sparse-skills"
        save_evidence(user_id, SkillEvidence(skill="Python", source="resume", evidence_type="m", strength=80.0, confidence=85.0, relevance=90.0, recency=85.0, description="desc"), db_path=":memory:")

        profiles = aggregate_evidence_to_profiles(user_id, db_path=":memory:")
        skills_found = [p.skill for p in profiles]
        self.assertIn("Python", skills_found)
        self.assertNotIn("Machine Learning", skills_found)

    # -------------------------------------------------------------------------
    # USER ISOLATION TESTS (17 - 18)
    # -------------------------------------------------------------------------
    def test_17_shravan_evidence_cannot_appear_in_tejas(self):
        """17. Candidate Shravan evidence does not contaminate Candidate Tejas profiles."""
        shravan_id = "shravan-iso-17"
        tejas_id = "tejas-iso-17"

        save_evidence(shravan_id, SkillEvidence(skill="Python", source="github", evidence_type="m", strength=85.0, confidence=90.0, relevance=90.0, recency=90.0, description="desc"), db_path=":memory:")
        save_evidence(tejas_id, SkillEvidence(skill="JavaScript", source="github", evidence_type="m", strength=80.0, confidence=85.0, relevance=90.0, recency=85.0, description="desc"), db_path=":memory:")

        shravan_profs = aggregate_evidence_to_profiles(shravan_id, db_path=":memory:")
        tejas_profs = aggregate_evidence_to_profiles(tejas_id, db_path=":memory:")

        shravan_skills = [p.skill for p in shravan_profs]
        tejas_skills = [p.skill for p in tejas_profs]

        self.assertIn("Python", shravan_skills)
        self.assertNotIn("JavaScript", shravan_skills)

        self.assertIn("JavaScript", tejas_skills)
        self.assertNotIn("Python", tejas_skills)

    def test_18_tejas_evidence_cannot_appear_in_shravan(self):
        """18. Verify strict reverse data isolation."""
        self.test_17_shravan_evidence_cannot_appear_in_tejas()

    # -------------------------------------------------------------------------
    # ANALYSIS PIPELINE TESTS (19 - 20)
    # -------------------------------------------------------------------------
    def test_19_analyze_derives_skills_from_stored_evidence(self):
        """19. POST /analyze with empty skills payload aggregates stored candidate evidence."""
        user_id = "user-pipeline-19"
        save_evidence(
            user_id,
            SkillEvidence(
                skill="Python", source="resume", evidence_type="mention",
                strength=85.0, confidence=90.0, relevance=90.0, recency=90.0,
                description="Python evidence"
            ),
            db_path=":memory:"
        )

        req = AnalysisRequest(
            user_id=user_id,
            target_role="AI/ML Engineer",
            skills=[]
        )

        result = run_full_analysis(req, db_path=":memory:")
        self.assertEqual(result.user_id, user_id)

        evaluated_skills = [s.skill for s in result.skills]
        self.assertIn("Python", evaluated_skills)

    def test_20_existing_scoring_engine_pipeline_remains_intact(self):
        """20. Scoring, Gap, Priority, and Next Action engines process aggregated profiles cleanly."""
        user_id = "user-pipeline-20"
        save_evidence(user_id, SkillEvidence(skill="Python", source="resume", evidence_type="m", strength=85.0, confidence=90.0, relevance=90.0, recency=90.0, description="d"), db_path=":memory:")
        save_evidence(user_id, SkillEvidence(skill="Machine Learning", source="github", evidence_type="m", strength=75.0, confidence=85.0, relevance=90.0, recency=85.0, description="d"), db_path=":memory:")

        req = AnalysisRequest(
            user_id=user_id,
            target_role="AI/ML Engineer",
            skills=[]
        )

        result = run_full_analysis(req, db_path=":memory:")
        self.assertGreater(result.readiness_score, 0.0)
        self.assertGreater(len(result.skill_gaps), 0)
        self.assertGreater(len(result.gap_priorities), 0)
        self.assertGreater(len(result.next_best_actions), 0)


if __name__ == "__main__":
    unittest.main()
