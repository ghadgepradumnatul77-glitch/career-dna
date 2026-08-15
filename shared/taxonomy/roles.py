from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class SkillRequirement:
    """
    Defines how important a skill is for a particular career role.
    """

    required_level: float
    importance: float
    category: str


# ============================================================
# AI / ML ENGINEER
# ============================================================

AI_ML_ENGINEER: Dict[str, SkillRequirement] = {

    "Python": SkillRequirement(
        required_level=85,
        importance=1.00,
        category="programming"
    ),

    "Machine Learning": SkillRequirement(
        required_level=85,
        importance=1.00,
        category="machine_learning"
    ),

    "Statistics": SkillRequirement(
        required_level=75,
        importance=0.80,
        category="mathematics"
    ),

    "SQL": SkillRequirement(
        required_level=70,
        importance=0.70,
        category="data"
    ),

    "Data Processing": SkillRequirement(
        required_level=75,
        importance=0.85,
        category="data"
    ),

    "Git": SkillRequirement(
        required_level=65,
        importance=0.60,
        category="tools"
    ),

    "APIs": SkillRequirement(
        required_level=65,
        importance=0.65,
        category="backend"
    ),

    "Docker": SkillRequirement(
        required_level=60,
        importance=0.55,
        category="deployment"
    )
}


# ============================================================
# SOFTWARE ENGINEER
# ============================================================

SOFTWARE_ENGINEER: Dict[str, SkillRequirement] = {

    "Python": SkillRequirement(
        required_level=75,
        importance=0.85,
        category="programming"
    ),

    "Java": SkillRequirement(
        required_level=75,
        importance=0.85,
        category="programming"
    ),

    "Data Structures": SkillRequirement(
        required_level=85,
        importance=1.00,
        category="computer_science"
    ),

    "Algorithms": SkillRequirement(
        required_level=85,
        importance=1.00,
        category="computer_science"
    ),

    "SQL": SkillRequirement(
        required_level=70,
        importance=0.70,
        category="data"
    ),

    "Git": SkillRequirement(
        required_level=75,
        importance=0.80,
        category="tools"
    ),

    "APIs": SkillRequirement(
        required_level=70,
        importance=0.75,
        category="backend"
    ),

    "Testing": SkillRequirement(
        required_level=70,
        importance=0.70,
        category="software_engineering"
    )
}


# ============================================================
# DATA SCIENTIST
# ============================================================

DATA_SCIENTIST: Dict[str, SkillRequirement] = {

    "Python": SkillRequirement(
        required_level=85,
        importance=0.95,
        category="programming"
    ),

    "Statistics": SkillRequirement(
        required_level=90,
        importance=1.00,
        category="mathematics"
    ),

    "Machine Learning": SkillRequirement(
        required_level=80,
        importance=0.90,
        category="machine_learning"
    ),

    "SQL": SkillRequirement(
        required_level=80,
        importance=0.85,
        category="data"
    ),

    "Data Processing": SkillRequirement(
        required_level=85,
        importance=0.95,
        category="data"
    ),

    "Data Visualization": SkillRequirement(
        required_level=75,
        importance=0.75,
        category="visualization"
    ),

    "Git": SkillRequirement(
        required_level=60,
        importance=0.50,
        category="tools"
    )
}


# ============================================================
# ROLE REGISTRY
# ============================================================

ROLE_REQUIREMENTS: Dict[str, Dict[str, SkillRequirement]] = {

    "AI/ML Engineer": AI_ML_ENGINEER,

    "Software Engineer": SOFTWARE_ENGINEER,

    "Data Scientist": DATA_SCIENTIST
}


def get_role_requirements(role: str) -> Dict[str, SkillRequirement]:
    """
    Return skill requirements for a target role.
    """

    if role not in ROLE_REQUIREMENTS:
        available_roles = ", ".join(ROLE_REQUIREMENTS.keys())

        raise ValueError(
            f"Unknown role '{role}'. "
            f"Available roles: {available_roles}"
        )

    return ROLE_REQUIREMENTS[role]