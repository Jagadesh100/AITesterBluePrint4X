"""config_store.py — read/write persisted app settings from a local .env file.

The Settings screen (pages/settings.py) reads current values via load_env()
and persists edits via save_env(). No secrets are hardcoded here; defaults
are applied only for keys that are absent from the file.
"""

from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent / ".env"

DEFAULTS = {
    "JIRA_URL": "",
    "JIRA_EMAIL": "",
    "JIRA_API_TOKEN": "",
    "LLM_PROVIDER": "lm_studio",       # "lm_studio" | "groq"
    "LM_STUDIO_URL": "http://localhost:1234",
    "LM_STUDIO_MODEL": "gemma2:1b",
    "GROQ_API_KEY": "",
    "GROQ_MODEL": "llama-3.1-8b-instant",
}

# Order in which keys are written to .env (stable, readable file).
_KEY_ORDER = [
    "JIRA_URL",
    "JIRA_EMAIL",
    "JIRA_API_TOKEN",
    "LLM_PROVIDER",
    "LM_STUDIO_URL",
    "LM_STUDIO_MODEL",
    "GROQ_API_KEY",
    "GROQ_MODEL",
]


def _parse_env(text: str) -> dict:
    """Parse KEY=VALUE lines into a dict (simple parser, no external dep).

    Preserves only real assignments; blank lines and comments are skipped.
    A value may be quoted with double or single quotes; quotes are stripped.
    """
    cfg = {}
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        cfg[key] = value
    return cfg


def load_env() -> dict:
    """Return a dict of current settings with defaults applied for missing keys."""
    cfg = dict(DEFAULTS)
    if ENV_PATH.exists():
        cfg.update(_parse_env(ENV_PATH.read_text(encoding="utf-8")))
    return cfg


def save_env(cfg: dict) -> None:
    """Write settings to .env, preserving unknown keys already present.

    Keys are written in _KEY_ORDER; any key present in the existing file
    but not in _KEY_ORDER is kept as-is at the end of the file.
    """
    existing = {}
    if ENV_PATH.exists():
        existing = _parse_env(ENV_PATH.read_text(encoding="utf-8"))

    merged = {**existing, **cfg}
    lines = []
    for key in _KEY_ORDER:
        if key in merged:
            lines.append(f"{key}={merged[key]}")
    for key, value in merged.items():
        if key not in _KEY_ORDER:
            lines.append(f"{key}={value}")

    ENV_PATH.parent.mkdir(parents=True, exist_ok=True)
    ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def validate(cfg: dict) -> list:
    """Return a list of human-readable validation errors (empty if valid)."""
    errors = []

    if not cfg.get("JIRA_URL"):
        errors.append("JIRA URL is required.")
    elif not str(cfg["JIRA_URL"]).startswith(("http://", "https://")):
        errors.append("JIRA URL must start with http:// or https://.")

    if not cfg.get("JIRA_EMAIL"):
        errors.append("JIRA Email is required.")

    if not cfg.get("JIRA_API_TOKEN"):
        errors.append("JIRA API Token is required.")

    provider = cfg.get("LLM_PROVIDER", "lm_studio")
    if provider not in ("lm_studio", "groq"):
        errors.append("LLM Provider must be 'lm_studio' or 'groq'.")

    if provider == "groq" and not cfg.get("GROQ_API_KEY"):
        errors.append("GROQ API Key is required when provider is Groq.")

    return errors


def get_credentials() -> dict:
    """Convenience accessor used by jira_client / llm_client."""
    return load_env()
