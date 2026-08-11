# Career-DNA MVP Architecture

## System architecture

Career-DNA is a deterministic Python analysis pipeline. Each stage owns one bounded responsibility and passes plain dataclass results to the next stage.

```text
Resume text/PDF                  Mocked or injected GitHub client
      |                                      |
      v                                      v
Resume Parser                         GitHub Analyzer
      |                                      |
      +------------------+-------------------+
                         |
                         v
                  Evidence Fusion
                         |
Role requirement --------+--------> Skill Gap Analysis
                                      |
                                      v
                              Report Generator
                                      |
                                      v
                           JSON-compatible report
```

The demonstration workflow in `demo/run_demo.py` exercises the complete pipeline with in-memory GitHub fixtures and prints deterministic JSON.

## Data flow

1. The Resume Parser converts bounded resume input into canonical normalized skills, structured resume entities, and provenance-bearing evidence.
2. The GitHub Analyzer consumes an injected GitHub client and produces repository metadata, canonical skill evidence, warnings, and bounded activity metadata.
3. Evidence Fusion merges canonical skill IDs in stable first-seen order and preserves whether each evidence record originated from `resume` or `github`.
4. Skill Gap Analysis compares only canonical candidate skill IDs with ordered canonical role requirements.
5. The Report Generator produces candidate, skill, evidence-count, present-skill, missing-skill, and warning summaries.
6. Every final contract supports conversion to plain JSON-compatible dictionaries.

## Module responsibilities

### `services/resume_parser`

- Validates and normalizes resume text.
- Reads bounded PDF input without executing embedded content.
- Detects resume sections and extracts projects, experience, and education.
- Produces canonical skill evidence with local source provenance.

### `services/github_analyzer`

- Validates usernames and authenticated API base URLs.
- Uses a bounded, injectable HTTP transport.
- Collects repository language, dependency, source, structure, and README evidence.
- Records bounded commit activity as metadata, not skill evidence.
- Continues safely on ordinary repository-level failures while propagating systemic access and rate-limit errors.

### `services/evidence_engine`

- Merges resume and GitHub canonical skills.
- Preserves all evidence provenance.
- Deduplicates skill identifiers while retaining evidence records.
- Applies no score, proficiency, or recommendation logic.

### `services/gap_analysis`

- Compares candidate canonical IDs with role canonical IDs.
- Preserves stable role ordering and deduplicated evidence sources.
- Separates present and missing skills without ranking or scoring.

### `services/report_generator`

- Builds the final structured Career DNA report.
- Summarizes detected skills and evidence counts by source.
- Includes present and missing skill results.
- Merges warnings deterministically.

## Security decisions

- Authentication tokens are read only by the GitHub client and are never stored in result models or warnings.
- Authenticated GitHub requests are restricted to the official HTTPS GitHub API base URL.
- Tests and demonstrations inject mocked clients; they make no live network calls.
- README, dependency, and source files are size-bounded, decoded in memory, and never executed.
- The analyzer does not follow GitHub `download_url` values, clone repositories, invoke subprocesses, or evaluate source code.
- Error and warning messages use deterministic codes and exclude raw API bodies, source contents, tokens, and transport details.
- Ordering is explicit for repositories, files, dependencies, README matches, evidence, skills, sources, and activity timestamps.
- Mutable dataclass fields use independent `default_factory` values.
- Pipeline outputs are plain JSON-compatible data and contain no persistence or database behavior.
