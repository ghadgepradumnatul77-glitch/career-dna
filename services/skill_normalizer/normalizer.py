"""Deterministic skill normalizer using canonical taxonomy and aliases."""

from pathlib import Path
import yaml
import re


def _normalize_token(text: str) -> str:
    """Normalize a raw skill token for lookup."""
    if not isinstance(text, str):
        return ""
    # strip whitespace
    t = text.strip()
    # collapse internal whitespace
    t = re.sub(r"\s+", " ", t)
    # casefold for case-insensitive matching
    t = t.casefold()
    return t


class SkillNormalizer:
    def __init__(self, taxonomy_path: str | None = None, aliases_path: str | None = None):
        base = Path(__file__).resolve().parents[2]  # project root
        self.taxonomy_path = Path(taxonomy_path) if taxonomy_path else base / "shared" / "taxonomy" / "skills.yaml"
        self.aliases_path = Path(aliases_path) if aliases_path else base / "shared" / "taxonomy" / "aliases.yaml"

        self._canonical_by_id = {}
        self._canonical_name_map = {}   # normalized name -> id
        self._canonical_id_map = {}     # normalized id -> id
        self._alias_map = {}            # normalized alias -> id
        self._raw_alias_map = {}        # raw alias -> id

        self._load_taxonomy()
        self._load_aliases()
        self._validate()

    def _load_taxonomy(self):
        with open(self.taxonomy_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        for skill in data.get("skills", []):
            sid = skill["id"]
            name = skill["name"]
            self._canonical_by_id[sid] = skill
            norm_name = _normalize_token(name)
            if norm_name in self._canonical_name_map:
                raise ValueError(f"Duplicate canonical name after normalization: {name}")
            self._canonical_name_map[norm_name] = sid
            norm_id = _normalize_token(sid)
            if norm_id in self._canonical_id_map and self._canonical_id_map[norm_id] != sid:
                raise ValueError(f"Duplicate canonical ID after normalization: {sid}")
            self._canonical_id_map[norm_id] = sid

    def _load_aliases(self):
        with open(self.aliases_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        for alias_raw, target_id in data.get("aliases", {}).items():
            if target_id not in self._canonical_by_id:
                raise ValueError(f"Alias '{alias_raw}' points to unknown canonical skill '{target_id}'")
            norm_alias = _normalize_token(alias_raw)
            if norm_alias in self._alias_map:
                existing = self._alias_map[norm_alias]
                if existing != target_id:
                    raise ValueError(f"Alias collision: '{alias_raw}' normalizes to same key as another alias mapping to different skill")
            self._alias_map[norm_alias] = target_id
            # store raw alias for vocabulary access
            self._raw_alias_map[alias_raw] = target_id

    def _validate(self):
        # Ensure canonical names do not collide with aliases mapping to different skills
        for norm_name, cid in self._canonical_name_map.items():
            if norm_name in self._alias_map and self._alias_map[norm_name] != cid:
                raise ValueError(f"Canonical name '{norm_name}' collides with alias mapping to different skill")

    def normalize_skill(self, raw_term: str) -> str | None:
        """Return canonical skill id for a raw term, or None if unknown."""
        norm = _normalize_token(raw_term)
        if not norm:
            return None
        # alias lookup first
        if norm in self._alias_map:
            return self._alias_map[norm]
        # canonical name lookup
        if norm in self._canonical_name_map:
            return self._canonical_name_map[norm]
        # canonical id lookup
        if norm in self._canonical_id_map:
            return self._canonical_id_map[norm]
        return None

    def get_match_terms(self) -> list[tuple[str, str]]:
        """
        Return a list of (term, skill_id) for all canonical skill names and raw aliases.
        The term is the original canonical name or raw alias string as appears in taxonomy.
        """
        terms: list[tuple[str, str]] = []
        # canonical names (original case)
        for skill in self._canonical_by_id.values():
            terms.append((skill["name"], skill["id"]))
        # raw aliases
        for alias_raw, skill_id in self._raw_alias_map.items():
            terms.append((alias_raw, skill_id))
        return terms


# Cache of normalizer instances keyed by (taxonomy_path, aliases_path)
_normalizer_cache: dict[tuple[str, str], SkillNormalizer] = {}


def get_normalizer(taxonomy_path: str | None = None, aliases_path: str | None = None) -> SkillNormalizer:
    """Return a cached normalizer for the given paths, creating if needed."""
    base = Path(__file__).resolve().parents[2]  # project root
    tp = str(Path(taxonomy_path) if taxonomy_path else base / "shared" / "taxonomy" / "skills.yaml")
    ap = str(Path(aliases_path) if aliases_path else base / "shared" / "taxonomy" / "aliases.yaml")
    key = (tp, ap)
    if key not in _normalizer_cache:
        _normalizer_cache[key] = SkillNormalizer(taxonomy_path, aliases_path)
    return _normalizer_cache[key]


def normalize_skill(raw_term: str) -> str | None:
    """Convenience function using default normalizer instance."""
    return get_normalizer().normalize_skill(raw_term)