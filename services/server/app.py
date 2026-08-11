"""FastAPI application for the Career-DNA MVP."""

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from services.api import CareerDNAPipelineError, run_career_dna_pipeline
from services.server.errors import (
    INVALID_RESUME_ERROR,
    PIPELINE_ERROR,
    error_response,
    unexpected_error_handler,
    validation_error_handler,
)
from services.server.schemas import AnalyzeRequest, AnalyzeResponse


app = FastAPI(title="Career DNA API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(Exception, unexpected_error_handler)


@app.get("/health")
def health() -> dict[str, str]:
    """Return service health without touching the analysis pipeline."""

    return {"status": "ok", "service": "career-dna"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """Run Career-DNA analysis through the existing API pipeline wrapper."""

    try:
        response = run_career_dna_pipeline(
            resume_text=request.resume_text,
            github_username=request.github_username,
        )
    except CareerDNAPipelineError as exc:
        if exc.code == "resume_text_required":
            return error_response(422, INVALID_RESUME_ERROR)
        return error_response(500, PIPELINE_ERROR)
    except Exception:
        return error_response(500, PIPELINE_ERROR)

    return AnalyzeResponse(success=True, data=response.to_dict(), error=None)
