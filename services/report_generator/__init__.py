"""Public API for Career DNA report generation."""

from services.report_generator.generator import generate_report
from services.report_generator.models import CareerDNAReport

__all__ = ["generate_report", "CareerDNAReport"]
