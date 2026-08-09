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
        self._alias_map = {}            # normalized alias -> id

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
        return None


# Singleton instance for convenience
_normalizer_instance: SkillNormalizer | None = None


def get_normalizer() -> SkillNormalizer:
    global _normalizer_instance
    if _normalizer_instance is None:
        _normalizer_instance = SkillNormalizer()
    return _normalizer_instance


def normalize_skill(raw_term: str) -> str | None:
    """Convenience function using shared normalizer instance."""
    return get_normalizer().normalize_skill(raw_term)