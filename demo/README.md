# Career-DNA demonstration

This demonstration runs the complete Career-DNA MVP pipeline with deterministic local fixtures:

```text
Resume fixture -> Resume Parser
Mock GitHub data -> GitHub Analyzer
                 -> Evidence Fusion
                 -> Gap Analysis
                 -> Report Generator
```

It makes no live GitHub or external API calls, requires no credentials, and does not write files. The printed payload contains the final structured report and the fused evidence grouped by provenance.

Run from the repository root:

```powershell
python demo/run_demo.py
```

The output includes:

- Candidate summary and detected canonical skills
- Resume project and experience evidence
- GitHub dependency, code import/usage, repository structure, and README evidence
- Present and missing role skills
- Resume and GitHub evidence counts

[`sample_output.json`](sample_output.json) is the expected deterministic JSON export.
