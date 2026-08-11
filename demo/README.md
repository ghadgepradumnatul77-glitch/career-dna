# Career-DNA demonstration

This demonstration runs the complete Career-DNA MVP pipeline from deterministic local fixture files:

```text
Resume fixture -> Resume Parser
Mock GitHub data -> GitHub Analyzer
                 -> Evidence Fusion
                 -> Gap Analysis
                 -> Report Generator
```

It makes no live GitHub or external API calls and requires no credentials. The runner reads `sample_resume.txt` and `sample_github.json`, then writes the expanded result to `demo_output.json`.

Run from the repository root:

```powershell
python demo/run_demo.py
```

Expected terminal output:

```text
Career DNA report generated successfully.
```

The JSON artifact includes:

- Candidate summary and detected canonical skills
- Resume project and experience evidence
- GitHub dependency, code import/usage, repository structure, and README evidence
- Present and missing role skills
- Resume and GitHub evidence counts

`sample_resume.txt` contains a synthetic candidate with no personal contact information. `sample_github.json` contains mocked repository, language, dependency, README, source, and commit metadata.
