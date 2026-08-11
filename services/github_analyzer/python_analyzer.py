"""Python source analysis using stdlib ast."""

import ast
import base64
from typing import Any, Dict, List, Optional, Set, Tuple

from services.github_analyzer.client import GitHubClient
from services.github_analyzer.errors import GitHubAnalysisError
from services.github_analyzer.models import GitHubEvidence, GitHubRepositoryResult
from services.skill_normalizer.normalizer import SkillNormalizer

# Limits
MAX_SOURCE_FILES_PER_REPO = 50
MAX_SOURCE_FILE_BYTES = 100 * 1024  # 100 KiB

# Directories to skip during traversal
SKIP_DIRS = {
    ".git",
    "__pycache__",
    "venv",
    ".venv",
    "env",
    "node_modules",
    "dist",
    "build",
    "target",
    "site-packages",
    "migrations",
    "vendor",
}

# Usage patterns mapping to skill IDs (canonical)
# Each pattern specifies: (provenance_type, provenance_value, usage_pattern)
# provenance_type: "module", "alias", "symbol", "constructor"
# provenance_value: the imported module/alias/symbol/constructor name
# usage_pattern: the AST pattern to match (e.g., attribute name, call name)
USAGE_PATTERNS = {
    "fastapi": [
        ("constructor", "FastAPI", ("Attribute", "get")),
        ("constructor", "FastAPI", ("Attribute", "post")),
        ("constructor", "FastAPI", ("Attribute", "put")),
        ("constructor", "FastAPI", ("Attribute", "delete")),
        ("constructor", "FastAPI", ("Attribute", "patch")),
        ("constructor", "FastAPI", ("Attribute", "route")),
        ("symbol", "FastAPI", ("Call", "FastAPI")),
        ("module", "fastapi", ("Attribute", "FastAPI")),
    ],
    "django": [
        ("module", "django", ("Attribute", "Model")),
        ("module", "django", ("Attribute", "models")),
        ("symbol", "path", ("Call", "path")),
        ("symbol", "include", ("Call", "include")),
        ("symbol", "urlpatterns", ("Attribute", "urlpatterns")),
    ],
    "scikit_learn": [
        ("module", "sklearn", ("Call", "fit")),
        ("module", "sklearn", ("Call", "predict")),
        ("module", "sklearn", ("Call", "train_test_split")),
        ("module", "sklearn", ("Call", "classification_report")),
        ("module", "sklearn", ("Call", "mean_squared_error")),
        ("alias", "sklearn", ("Call", "fit")),
        ("alias", "sklearn", ("Call", "predict")),
    ],
    "pandas": [
        ("alias", "pandas", ("Call", "read_csv")),
        ("alias", "pandas", ("Call", "DataFrame")),
        ("alias", "pandas", ("Call", "groupby")),
        ("alias", "pandas", ("Call", "merge")),
        ("alias", "pandas", ("Call", "read_excel")),
        ("alias", "pandas", ("Call", "read_json")),
        ("symbol", "read_csv", ("Call", "read_csv")),
        ("symbol", "DataFrame", ("Call", "DataFrame")),
        ("module", "pandas", ("Attribute", "read_csv")),
        ("module", "pandas", ("Attribute", "DataFrame")),
    ],
    "numpy": [
        ("alias", "numpy", ("Call", "array")),
        ("alias", "numpy", ("Call", "mean")),
        ("alias", "numpy", ("Call", "reshape")),
        ("alias", "numpy", ("Call", "zeros")),
        ("alias", "numpy", ("Call", "ones")),
        ("symbol", "array", ("Call", "array")),
        ("module", "numpy", ("Attribute", "array")),
    ],
    "pytorch": [
        ("module", "torch", ("Attribute", "nn")),
        ("module", "torch", ("Attribute", "Module")),
        ("symbol", "DataLoader", ("Call", "DataLoader")),
        ("alias", "torch", ("Call", "backward")),
    ],
    "tensorflow": [
        ("module", "tensorflow", ("Attribute", "keras")),
        ("module", "tensorflow", ("Attribute", "Model")),
        ("alias", "tensorflow", ("Call", "fit")),
        ("alias", "tensorflow", ("Call", "predict")),
        ("symbol", "Model", ("Call", "Model")),
    ],
}


def _should_skip_dir(name: str) -> bool:
    return name in SKIP_DIRS or name.startswith(".")


def _collect_python_files(
    client: GitHubClient,
    owner: str,
    repo: str,
    path: str = "",
    collected: Optional[List[Dict[str, Any]]] = None,
    warnings: Optional[List[str]] = None,
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Recursively collect .py files up to limit."""
    if collected is None:
        collected = []
    if warnings is None:
        warnings = []
    if len(collected) >= MAX_SOURCE_FILES_PER_REPO:
        warnings.append("source_file_limit_reached")
        return collected, warnings
    try:
        entries = client.get_repository_contents(owner, repo, path=path)
    except GitHubAnalysisError as e:
        warnings.append(f"source_contents_unavailable: {path}: {e.code}")
        return collected, warnings
    if not isinstance(entries, list):
        entries = [entries]
    # Sort entries for deterministic traversal
    entries.sort(key=lambda e: (e.get("type", ""), e.get("name", "")))
    for entry in entries:
        if len(collected) >= MAX_SOURCE_FILES_PER_REPO:
            warnings.append("source_file_limit_reached")
            break
        etype = entry.get("type")
        name = entry.get("name", "")
        full_path = f"{path}/{name}" if path else name
        if etype == "dir":
            if _should_skip_dir(name):
                continue
            _collect_python_files(client, owner, repo, full_path, collected, warnings)
        elif etype == "file" and name.endswith(".py"):
            entry_copy = dict(entry)
            entry_copy["full_path"] = full_path
            entry_copy["path"] = full_path
            collected.append(entry_copy)
    return collected, warnings


def _fetch_file_content(
    client: GitHubClient, owner: str, repo: str, path: str
) -> Tuple[Optional[str], List[str]]:
    warnings = []
    try:
        content_obj = client.get_repository_contents(owner, repo, path=path)
    except GitHubAnalysisError as e:
        warnings.append(f"source_file_unreadable: {path}: {e.code}")
        return None, warnings
    if not isinstance(content_obj, dict):
        warnings.append(f"source_file_malformed: {path}")
        return None, warnings
    encoding = content_obj.get("encoding")
    content = content_obj.get("content")
    if encoding != "base64" or not content:
        warnings.append(f"source_file_malformed: {path}")
        return None, warnings
    # decode with explicit error handling
    try:
        # GitHub base64 may contain newlines; strip whitespace before decoding
        cleaned_content = "".join(content.split())
        decoded_bytes = base64.b64decode(cleaned_content, validate=True)
    except Exception:
        warnings.append(f"source_file_malformed: {path}")
        return None, warnings
    if len(decoded_bytes) > MAX_SOURCE_FILE_BYTES:
        warnings.append(f"source_file_too_large: {path}")
        return None, warnings
    try:
        decoded = decoded_bytes.decode("utf-8", errors="replace")
    except Exception:
        warnings.append(f"source_file_malformed: {path}")
        return None, warnings
    return decoded, warnings


class PythonFileAnalysis:
    """Internal structured observations from one Python source file."""
    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        self.imports: List[Tuple[str, str]] = []  # (raw_term, source_line)
        # Provenance tracking
        self.imported_modules: Set[str] = set()  # e.g., "fastapi", "pandas", "sklearn"
        self.imported_aliases: Dict[str, str] = {}  # alias -> module, e.g., "pd" -> "pandas"
        self.imported_symbols: Dict[str, str] = {}  # symbol -> module, e.g., "read_csv" -> "pandas"
        self.constructor_assignments: Dict[str, str] = {}  # var_name -> constructor, e.g., "app" -> "FastAPI"
        self.call_attrs: List[Tuple[str, Optional[str]]] = []  # (attr_name, base_name) e.g., ("read_csv", "pd")
        self.functions: List[str] = []
        self.async_functions: List[str] = []
        self.classes: List[str] = []
        self.decorators: List[Tuple[str, Optional[str]]] = []  # (decorator_name, base_name) e.g., ("get", "app")
        self.warnings: List[str] = []


def _extract_imports_from_node(node: ast.AST, source_lines: List[str], analysis: PythonFileAnalysis) -> None:
    if isinstance(node, ast.Import):
        for alias in node.names:
            raw = alias.name.split(".")[0]
            line = source_lines[node.lineno - 1].strip() if node.lineno <= len(source_lines) else ""
            analysis.imports.append((raw, line))
            analysis.imported_modules.add(raw)
            if alias.asname:
                analysis.imported_aliases[alias.asname] = raw
    elif isinstance(node, ast.ImportFrom):
        if node.module:
            raw = node.module.split(".")[0]
            line = source_lines[node.lineno - 1].strip() if node.lineno <= len(source_lines) else ""
            analysis.imports.append((raw, line))
            analysis.imported_modules.add(raw)
            for alias in node.names:
                symbol = alias.name
                asname = alias.asname or symbol
                analysis.imported_symbols[asname] = raw
                if alias.asname:
                    analysis.imported_aliases[asname] = raw


def _analyze_constructor_assignments(node: ast.AST, analysis: PythonFileAnalysis) -> None:
    """Track variable assignments from constructor calls like app = FastAPI()"""
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name) and isinstance(node.value, ast.Call):
                if isinstance(node.value.func, ast.Name):
                    constructor_name = node.value.func.id
                    analysis.constructor_assignments[target.id] = constructor_name
                elif isinstance(node.value.func, ast.Attribute):
                    # e.g., fastapi.FastAPI()
                    base = node.value.func.value
                    if isinstance(base, ast.Name):
                        constructor_name = f"{base.id}.{node.value.func.attr}"
                        analysis.constructor_assignments[target.id] = constructor_name


def _analyze_python_source(source: str, file_path: str) -> PythonFileAnalysis:
    analysis = PythonFileAnalysis(file_path)
    try:
        tree = ast.parse(source, filename=file_path)
    except SyntaxError as e:
        analysis.warnings.append(f"python_syntax_error: {e.msg} at line {e.lineno}")
        return analysis
    except Exception:
        analysis.warnings.append("python_parse_error")
        return analysis
    source_lines = source.splitlines()
    for node in ast.walk(tree):
        # imports
        _extract_imports_from_node(node, source_lines, analysis)
        # constructor assignments
        _analyze_constructor_assignments(node, analysis)
        # functions
        if isinstance(node, ast.FunctionDef):
            analysis.functions.append(node.name)
        elif isinstance(node, ast.AsyncFunctionDef):
            analysis.async_functions.append(node.name)
        # classes
        elif isinstance(node, ast.ClassDef):
            analysis.classes.append(node.name)
        # call attributes with base tracking
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Attribute):
                attr_name = node.func.attr
                base_name = None
                if isinstance(node.func.value, ast.Name):
                    base_name = node.func.value.id
                analysis.call_attrs.append((attr_name, base_name))
    # Decorators with base tracking
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            for dec in node.decorator_list:
                if isinstance(dec, ast.Name):
                    analysis.decorators.append((dec.id, None))
                elif isinstance(dec, ast.Attribute):
                    base_name = None
                    if isinstance(dec.value, ast.Name):
                        base_name = dec.value.id
                    analysis.decorators.append((dec.attr, base_name))
                elif isinstance(dec, ast.Call):
                    if isinstance(dec.func, ast.Name):
                        analysis.decorators.append((dec.func.id, None))
                    elif isinstance(dec.func, ast.Attribute):
                        base_name = None
                        if isinstance(dec.func.value, ast.Name):
                            base_name = dec.func.value.id
                        analysis.decorators.append((dec.func.attr, base_name))
    return analysis


def _has_provenance(analysis: PythonFileAnalysis, provenance_type: str, provenance_value: str) -> bool:
    """Check if the analysis has the required provenance for a pattern."""
    if provenance_type == "module":
        return provenance_value in analysis.imported_modules
    elif provenance_type == "alias":
        return provenance_value in analysis.imported_aliases.values()
    elif provenance_type == "symbol":
        return provenance_value in analysis.imported_symbols.values()
    elif provenance_type == "constructor":
        return provenance_value in analysis.constructor_assignments.values()
    return False


def _check_call_provenance(analysis: PythonFileAnalysis, provenance_type: str, provenance_value: str, attr_name: str) -> bool:
    """Check if a call attribute has the required provenance."""
    if provenance_type == "module":
        # Check if any call is on a base that's an alias for this module
        for call_attr, base in analysis.call_attrs:
            if call_attr == attr_name and base and base in analysis.imported_aliases:
                if analysis.imported_aliases[base] == provenance_value:
                    return True
        # Also check module.Attribute pattern
        return provenance_value in analysis.imported_modules
    elif provenance_type == "alias":
        for call_attr, base in analysis.call_attrs:
            if call_attr == attr_name and base and base in analysis.imported_aliases:
                if analysis.imported_aliases[base] == provenance_value:
                    return True
        return False
    elif provenance_type == "symbol":
        # Direct symbol call (no base)
        for call_attr, base in analysis.call_attrs:
            if call_attr == attr_name and base is None:
                if attr_name in analysis.imported_symbols:
                    if analysis.imported_symbols[attr_name] == provenance_value:
                        return True
        return False
    elif provenance_type == "constructor":
        # Check if call is on a variable assigned from this constructor
        for call_attr, base in analysis.call_attrs:
            if call_attr == attr_name and base and base in analysis.constructor_assignments:
                if analysis.constructor_assignments[base] == provenance_value:
                    return True
        return False
    return False


def _check_decorator_provenance(analysis: PythonFileAnalysis, provenance_type: str, provenance_value: str, attr_name: str) -> bool:
    """Check if a decorator has the required provenance."""
    if provenance_type == "constructor":
        for dec_name, base in analysis.decorators:
            if dec_name == attr_name and base and base in analysis.constructor_assignments:
                if analysis.constructor_assignments[base] == provenance_value:
                    return True
        return False
    elif provenance_type == "symbol":
        for dec_name, base in analysis.decorators:
            if dec_name == attr_name and base is None:
                if attr_name in analysis.imported_symbols:
                    if analysis.imported_symbols[attr_name] == provenance_value:
                        return True
        return False
    return False


def _match_usage_patterns(analysis: PythonFileAnalysis, normalizer: SkillNormalizer) -> List[Tuple[str, str, str]]:
    """Return list of (skill_id, raw_term, source_line) for code_usage evidence."""
    matches = []
    for skill_id, patterns in USAGE_PATTERNS.items():
        # Verify skill_id exists in normalizer (respects custom taxonomy)
        if not normalizer.normalize_skill(skill_id):
            continue
        matched = False
        for provenance_type, provenance_value, (pattern_type, pattern_name) in patterns:
            has_provenance = False
            if pattern_type == "Call":
                has_provenance = _check_call_provenance(analysis, provenance_type, provenance_value, pattern_name)
            elif pattern_type == "Attribute":
                has_provenance = _has_provenance(analysis, provenance_type, provenance_value)
            elif pattern_type == "Decorator":
                has_provenance = _check_decorator_provenance(analysis, provenance_type, provenance_value, pattern_name)
            
            if has_provenance:
                # find a source line that contains it (approx)
                line = ""
                for imp_raw, imp_line in analysis.imports:
                    if pattern_name in imp_line or provenance_value in imp_line:
                        line = imp_line
                        break
                if not line and analysis.decorators:
                    line = analysis.decorators[0][0]
                elif not line and analysis.call_attrs:
                    line = analysis.call_attrs[0][0]
                # Normalize skill_id through normalizer (respects custom taxonomy)
                normalized_skill_id = normalizer.normalize_skill(skill_id)
                if normalized_skill_id:
                    matches.append((normalized_skill_id, pattern_name, line[:200]))
                    matched = True
                    break  # only first pattern per skill
    return matches


def _normalize_and_make_evidence(
    normalizer: SkillNormalizer,
    raw_term: str,
    repo_name: str,
    repo_url: str,
    evidence_type: str,
    file_path: Optional[str] = None,
    source_line: str = "",
) -> Optional[GitHubEvidence]:
    skill_id = normalizer.normalize_skill(raw_term)
    if not skill_id:
        return None
    if evidence_type == "code_import":
        text = f"Python import: {source_line}" if source_line else f"Python import: {raw_term}"
    elif evidence_type == "code_usage":
        text = f"Code usage: {source_line}" if source_line else f"Code usage: {raw_term}"
    elif evidence_type == "repository_structure":
        text = f"Repository structure: {raw_term}"
    else:
        text = raw_term
    return GitHubEvidence(
        skill_id=skill_id,
        raw_term=raw_term,
        repository_name=repo_name,
        repository_url=repo_url,
        evidence_type=evidence_type,
        evidence_text=text,
        file_path=file_path,
        commit_sha=None,
        source_ref=evidence_type,
    )


def analyze_repository_python(
    client: GitHubClient,
    normalizer: SkillNormalizer,
    repo: GitHubRepositoryResult,
    owner: str,
    repo_name: str,
    repo_url: str,
) -> Tuple[List[GitHubEvidence], List[str]]:
    """Analyze Python files in a repository. Returns (evidence_list, warnings)."""
    all_evidence: List[GitHubEvidence] = []
    all_warnings: List[str] = []

    # collect python files
    py_files, coll_warnings = _collect_python_files(client, owner, repo_name)
    all_warnings.extend(coll_warnings)

    seen_evidence_keys: Set[Tuple[str, str, str, str]] = set()

    for entry in py_files:
        path = entry.get("full_path") or entry.get("path") or entry.get("name")
        if not path:
            continue
        source, fetch_warnings = _fetch_file_content(client, owner, repo_name, path)
        all_warnings.extend(fetch_warnings)
        if source is None:
            continue
        analysis = _analyze_python_source(source, path)

        # code_import evidence
        for raw_term, source_line in analysis.imports:
            ev = _normalize_and_make_evidence(
                normalizer, raw_term, repo_name, repo_url, "code_import",
                file_path=path, source_line=source_line
            )
            if ev:
                key = (ev.skill_id, ev.evidence_type, ev.file_path or "", ev.evidence_text)
                if key not in seen_evidence_keys:
                    seen_evidence_keys.add(key)
                    all_evidence.append(ev)

        # code_usage evidence (validated through provenance)
        usage_matches = _match_usage_patterns(analysis, normalizer)
        for skill_id, raw_term, source_line in usage_matches:
            text = f"Code usage: {source_line}" if source_line else f"Code usage: {raw_term}"
            ev = GitHubEvidence(
                skill_id=skill_id,
                raw_term=raw_term,
                repository_name=repo_name,
                repository_url=repo_url,
                evidence_type="code_usage",
                evidence_text=text,
                file_path=path,
                commit_sha=None,
                source_ref="code_usage",
            )
            key = (ev.skill_id, ev.evidence_type, ev.file_path or "", ev.evidence_text)
            if key not in seen_evidence_keys:
                seen_evidence_keys.add(key)
                all_evidence.append(ev)

    return all_evidence, all_warnings
