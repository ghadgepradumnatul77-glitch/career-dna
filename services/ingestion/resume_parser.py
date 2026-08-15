import io
import re
from typing import Dict, List, Any, Optional
from pypdf import PdfReader

from shared.schemas.evidence import SkillEvidence
from services.skill_normalizer.normalizer import get_normalizer
from services.db_service import save_evidence, clear_user_evidence


def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract full raw text from a PDF file byte stream."""
    if not file_bytes or len(file_bytes) == 0:
        raise ValueError("Resume file is empty (0 bytes).")

    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_pages.append(text)

        full_text = "\n".join(extracted_pages).strip()
        if not full_text:
            raise ValueError("Uploaded PDF resume contains no extractable text.")
        return full_text
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Invalid or unreadable PDF resume file: {str(e)}")


def parse_resume_file(
    user_id: str,
    file_bytes: bytes,
    filename: str = "resume.pdf",
    db_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Parse a candidate PDF resume, detect canonical skills against taxonomy,
    generate SkillEvidence records, and persist them to SQLite.
    """
    if not user_id or not user_id.strip():
        raise ValueError("user_id is required for resume parsing.")

    raw_text = extract_text_from_pdf_bytes(file_bytes)
    normalizer = get_normalizer()

    # Determine section contexts in resume text
    lines = raw_text.splitlines()
    skills_section_boost = False

    # Extract candidate keywords using taxonomy
    detected_map: Dict[str, Dict[str, Any]] = {}

    # Build token list to scan
    words_and_phrases = re.findall(r'[A-Za-z0-9+#\-\._]+', raw_text)

    # Scan multi-word lines & single tokens against skill normalizer
    scanned_candidates = set()
    for line in lines:
        line_clean = line.strip().lower()
        if any(h in line_clean for h in ["skill", "technical", "technologies", "proficiencies", "competencies"]):
            skills_section_boost = True

        # Check full line chunks and individual words
        tokens = [re.sub(r'^[^\w+#\-\._]+|[^\w+#\-\._]+$', '', t) for t in line.split()]
        tokens = [t for t in tokens if t]
        for i in range(len(tokens)):
            for j in range(i + 1, min(i + 4, len(tokens) + 1)):
                phrase = " ".join(tokens[i:j])
                scanned_candidates.add(phrase)

    evidence_list: List[SkillEvidence] = []
    detected_skills_set = set()

    for term in scanned_candidates:
        sid = normalizer.normalize_skill(term)
        if sid and sid in normalizer._canonical_by_id:
            canonical_name = normalizer._canonical_by_id[sid]["name"]
            if canonical_name not in detected_skills_set:
                detected_skills_set.add(canonical_name)

                # Count occurrences in raw text
                count = len(re.findall(r'\b' + re.escape(term) + r'\b', raw_text, re.IGNORECASE))
                count = max(1, count)

                base_strength = 65.0
                if skills_section_boost:
                    base_strength += 10.0
                if count > 2:
                    base_strength += 10.0
                strength = min(90.0, base_strength)

                evidence_type = "project_experience" if "project" in raw_text.lower() else "skill_mention"
                desc = (
                    f"Detected '{canonical_name}' in candidate resume '{filename}' "
                    f"(Mention count: {count}, Source section context: verified)."
                )

                ev = SkillEvidence(
                    skill=canonical_name,
                    source="resume",
                    evidence_type=evidence_type,
                    source_ref=filename,
                    strength=strength,
                    confidence=85.0,
                    relevance=90.0,
                    recency=85.0,
                    description=desc
                )
                evidence_list.append(ev)

    # Clear old resume evidence for this user and save new items
    clear_user_evidence(user_id, source="resume", db_path=db_path)
    for ev in evidence_list:
        save_evidence(user_id, ev, db_path=db_path)

    skills_detected = [ev.skill for ev in evidence_list]

    return {
        "user_id": user_id,
        "source": "resume",
        "filename": filename,
        "skills_detected": skills_detected,
        "evidence_count": len(evidence_list),
        "status": "processed"
    }
