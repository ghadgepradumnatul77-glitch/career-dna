"""Sanitized HTTP error handling for the Career-DNA server."""

from typing import Dict

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


INVALID_RESUME_ERROR = {
    "code": "INVALID_RESUME",
    "message": "Resume text is required",
}
INVALID_REQUEST_ERROR = {
    "code": "INVALID_REQUEST",
    "message": "Invalid request",
}
PIPELINE_ERROR = {
    "code": "PIPELINE_ERROR",
    "message": "Analysis failed",
}


def error_response(status_code: int, error: Dict[str, str]) -> JSONResponse:
    """Return a deterministic error envelope without internal details."""

    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": dict(error)},
    )


async def validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Map request validation failures to safe client errors."""

    del request
    resume_error = any(
        error.get("loc") and error["loc"][-1] == "resume_text"
        for error in exc.errors()
    )
    if resume_error:
        return error_response(422, INVALID_RESUME_ERROR)
    return error_response(400, INVALID_REQUEST_ERROR)


async def unexpected_error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Suppress unexpected exception details at the HTTP boundary."""

    del request, exc
    return error_response(500, PIPELINE_ERROR)
