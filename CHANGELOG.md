# Changelog

## Career-DNA MVP

### Features

- **Resume Intelligence** — deterministic resume text and PDF parsing with canonical skill evidence, projects, experience, and education extraction.
- **GitHub Intelligence** — bounded repository metadata, languages, dependencies, Python code evidence, repository structure, README claims, and activity metadata.
- **Evidence Fusion** — stable merging of canonical skills and source provenance from resume and GitHub analysis.
- **Skill Gap Analysis** — ordered comparison of candidate evidence against canonical role requirements, producing present and missing skills.
- **Career DNA Report** — JSON-serializable candidate, skill, evidence, and gap summaries without scoring or recommendations.
- **Demo workflow** — complete deterministic pipeline demonstration using local resume and mocked GitHub fixtures.

### Security

- No token or API-key leakage in report, evidence, warning, or error output.
- No live GitHub or external API calls during tests.
- Deterministic, bounded processing with no repository cloning, source execution, subprocess use, or LLM calls.

### Testing

- **216 tests passed** in each of two consecutive complete-suite runs.
- **Zero failures**.
- Tests ran with Python bytecode and pytest cache generation disabled for a clean release tree.
