"""PDF text extraction using pdfplumber."""

from pathlib import Path
import pdfplumber
from services.resume_parser.errors import ResumeParseError


MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_PDF_PAGES = 20


def extract_pdf_text(path: str | Path) -> str:
    """
    Extract text from a PDF file using pdfplumber.

    Returns concatenated page text in order.
    Raises ResumeParseError with deterministic codes for failures.
    """
    p = Path(path)
    # Validate extension first
    if p.suffix.lower() != ".pdf":
        raise ResumeParseError("pdf_invalid_extension")
    if not p.exists():
        raise ResumeParseError("pdf_file_missing")
    if not p.is_file():
        raise ResumeParseError("pdf_path_not_a_file")
    # Size guard
    if p.stat().st_size > MAX_PDF_SIZE_BYTES:
        raise ResumeParseError("pdf_file_too_large")

    texts = []
    try:
        pdf = pdfplumber.open(p)
    except Exception as e:
        raise ResumeParseError("pdf_corrupted_or_unreadable") from e

    with pdf:
        if not pdf.pages:
            raise ResumeParseError("pdf_contains_no_extractable_text")
        if len(pdf.pages) > MAX_PDF_PAGES:
            raise ResumeParseError("pdf_too_many_pages")
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                texts.append(page_text)

    combined = "\n".join(texts)
    if not combined.strip():
        raise ResumeParseError("pdf_contains_no_extractable_text")
    return combined