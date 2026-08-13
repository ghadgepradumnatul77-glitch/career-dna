from typing import Dict, List, Any

from shared.schemas.gap_priority import GapPriority
from shared.schemas.next_action import NextBestAction


# Extensible action catalog for known skills
ACTION_CATALOG: Dict[str, Dict[str, Any]] = {
    "Machine Learning": {
        "action_type": "project",
        "title": "Build an end-to-end machine learning project",
        "description": (
            "Build a supervised ML project using data preprocessing, "
            "model training, evaluation, and documented results."
        ),
        "evidence_to_collect": [
            "GitHub repository",
            "README",
            "model evaluation metrics",
            "project documentation",
        ],
        "success_criteria": [
            "Train and evaluate model with clean metric validation",
            "Document feature engineering pipeline in README",
            "Publish reproducible code repo on GitHub",
        ],
    },
    "Data Processing": {
        "action_type": "project",
        "title": "Build a data preprocessing pipeline",
        "description": (
            "Create a Python pipeline using Pandas and NumPy that cleans, "
            "transforms, validates, and prepares a real dataset."
        ),
        "evidence_to_collect": [
            "GitHub repository",
            "preprocessing code",
            "dataset documentation",
            "README",
        ],
        "success_criteria": [
            "Clean raw data with zero unhandled nulls/duplicates",
            "Implement reproducible data transformation script",
            "Document pipeline steps and dataset schema in README",
        ],
    },
    "SQL": {
        "action_type": "practice",
        "title": "Build a SQL analytics project",
        "description": (
            "Create a relational database and answer analytical questions "
            "using joins, aggregations, subqueries, and window functions."
        ),
        "evidence_to_collect": [
            "SQL scripts",
            "database schema",
            "query examples",
            "project README",
        ],
        "success_criteria": [
            "Write queries demonstrating joins, subqueries, and window functions",
            "Define normalized database schema",
            "Document analytical insights with query outputs",
        ],
    },
    "Docker": {
        "action_type": "project",
        "title": "Containerize an existing project",
        "description": (
            "Create a Dockerfile and containerize one of the student's "
            "existing applications."
        ),
        "evidence_to_collect": [
            "Dockerfile",
            "docker-compose configuration if needed",
            "successful build/run evidence",
            "README instructions",
        ],
        "success_criteria": [
            "Create optimized multi-stage Dockerfile",
            "Verify container builds and runs locally without errors",
            "Document docker run/build commands in README",
        ],
    },
    "APIs": {
        "action_type": "project",
        "title": "Build and document a REST API",
        "description": (
            "Create a FastAPI service with multiple endpoints, validation, "
            "error handling, and API documentation."
        ),
        "evidence_to_collect": [
            "source code",
            "OpenAPI documentation",
            "API test results",
            "README",
        ],
        "success_criteria": [
            "Implement REST endpoints with request/response Pydantic models",
            "Include error handling and HTTP status codes",
            "Publish automated tests and OpenAPI docs",
        ],
    },
    "Python": {
        "action_type": "project",
        "title": "Build a Python project demonstrating advanced development",
        "description": (
            "Build a production-style Python project with clean architecture, "
            "testing, error handling, and documentation."
        ),
        "evidence_to_collect": [
            "GitHub repository",
            "source code",
            "unit test suite",
            "README",
        ],
        "success_criteria": [
            "Implement modular OOP/functional architecture",
            "Write unit test suite with high coverage",
            "Publish documented codebase on GitHub",
        ],
    },
}


def _get_action_template(skill: str) -> Dict[str, Any]:
    """Retrieve template from catalog or return extensible default for unknown skills."""
    if skill in ACTION_CATALOG:
        return ACTION_CATALOG[skill]

    return {
        "action_type": "project",
        "title": f"Build a practical {skill} project",
        "description": (
            f"Develop a hands-on project demonstrating core proficiency and application of {skill}."
        ),
        "evidence_to_collect": [
            "GitHub repository",
            "source code",
            "project README",
        ],
        "success_criteria": [
            f"Implement core features utilizing {skill}",
            "Document application setup and usage steps",
            "Publish clean repository on GitHub",
        ],
    }


def generate_next_best_action(priority: GapPriority) -> NextBestAction:
    """
    Generate a concrete NextBestAction recommendation for a given GapPriority.

    Expected skill gain & effort scale deterministically based on priority level:
    - HIGH priority: gain 20.0, effort 25 hours
    - MEDIUM priority: gain 15.0, effort 15 hours
    - LOW priority: gain 8.0, effort 8 hours
    """
    template = _get_action_template(priority.skill)

    if priority.priority_level == "HIGH":
        effort_hours = 25
        skill_gain = 20.0
    elif priority.priority_level == "MEDIUM":
        effort_hours = 15
        skill_gain = 15.0
    else:  # LOW
        effort_hours = 8
        skill_gain = 8.0

    return NextBestAction(
        skill=priority.skill,
        action_type=template["action_type"],
        title=template["title"],
        description=template["description"],
        estimated_effort_hours=effort_hours,
        expected_skill_gain=round(skill_gain, 2),
        priority_score=round(priority.priority_score, 2),
        evidence_to_collect=list(template["evidence_to_collect"]),
        success_criteria=list(template["success_criteria"]),
    )


def generate_action_plan(
    priorities: List[GapPriority],
    limit: int = 3
) -> List[NextBestAction]:
    """
    Compile a top-N action plan from prioritized skill gaps.

    Steps:
    1. Sort priorities descending by priority_score.
    2. Take top 'limit' priorities.
    3. Generate NextBestAction for each.
    """
    if not priorities or limit <= 0:
        return []

    sorted_priorities = sorted(priorities, key=lambda p: p.priority_score, reverse=True)
    selected_priorities = sorted_priorities[:limit]

    return [generate_next_best_action(p) for p in selected_priorities]
