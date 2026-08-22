"""llm_client.py — generate test cases via LM Studio (local) or Groq (hosted).

Both backends expose an OpenAI-compatible /chat/completions API, so the
request shape is identical. The provider selected in Settings
(LLM_PROVIDER) is authoritative: "groq" always calls Groq, anything else
calls LM Studio. There is no silent fallback — a failure surfaces as an
LLMError with the real cause. Returns (response_text, provider_used) so the
chat can show which backend served the request.
"""

import re

import requests

TIMEOUT_SECONDS = 60

GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"


class LLMError(Exception):
    """Raised when both providers fail."""


def generate(prompt: str, cfg: dict) -> tuple:
    """Generate a response for `prompt` using the provider selected in Settings.

    Returns (text, provider_used). Raises LLMError with the real cause if the
    selected provider fails — no silent fallback to the other provider.
    """
    provider = str(cfg.get("LLM_PROVIDER", "lm_studio")).lower()

    if provider == "groq":
        text = _call_groq(prompt, cfg)
        return text, "groq"

    text = _call_lm_studio(prompt, cfg)
    return text, "lm_studio"


def check_connection(cfg: dict) -> str:
    """Verify LM Studio is reachable and the configured model is loaded.

    Returns a human-readable status message (success or failure) so the UI
    can show it without raising exceptions.
    """
    provider = str(cfg.get("LLM_PROVIDER", "lm_studio")).lower()
    if provider == "groq":
        if not cfg.get("GROQ_API_KEY"):
            return "Groq API key is not configured. Set it in the Settings screen."
        try:
            resp = requests.get(
                "https://api.groq.com/openai/v1/models",
                headers={"Authorization": f"Bearer {cfg['GROQ_API_KEY']}"},
                timeout=TIMEOUT_SECONDS,
            )
            resp.raise_for_status()
            return "Groq connection OK."
        except requests.RequestException as exc:
            return f"Groq connection failed: {exc}"

    base_url = str(cfg.get("LM_STUDIO_URL", "http://localhost:1234")).rstrip("/")
    try:
        resp = requests.get(f"{base_url}/v1/models", timeout=TIMEOUT_SECONDS)
        resp.raise_for_status()
        model = str(cfg.get("LM_STUDIO_MODEL", "gemma3:1b"))
        models = [m.get("id", "") for m in resp.json().get("data", [])]
        loaded = _find_loaded_model(model, models)
        if loaded:
            return f"LM Studio connection OK. Model '{loaded}' is loaded."
        return (
            f"LM Studio connection OK, but model '{model}' is not loaded. "
            f"Available models: {', '.join(models) or 'none'}."
        )
    except requests.RequestException as exc:
        return f"LM Studio connection failed: {exc}"
    except (KeyError, ValueError) as exc:
        return f"Unexpected LM Studio response: {exc}"


def _find_loaded_model(configured: str, available: list) -> str | None:
    """Match the configured model name against the loaded model list.

    LM Studio serves models like "google/gemma-3-1b"; the app may configure
    the alias "gemma3:1b". Match by the trailing size tag (e.g. "3-1b") so
    aliases and vendor prefixes both resolve.
    """
    configured = configured.strip().lower()
    # Extract the numeric size tag: "gemma3:1b" -> "3-1b", "qwen3:8b" -> "3-8b"
    tag_match = re.search(r"(\d[^:]*)$", configured)
    if not tag_match:
        return None
    tag = tag_match.group(1).replace("_", "-")
    for m in available:
        m_lower = str(m).lower()
        if m_lower == configured or tag in m_lower:
            return m
    return None


def _call_lm_studio(prompt: str, cfg: dict) -> str:
    base_url = str(cfg.get("LM_STUDIO_URL", "http://localhost:1234")).rstrip("/")
    model = cfg.get("LM_STUDIO_MODEL", "gemma3:1b")
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    try:
        resp = requests.post(
            f"{base_url}/v1/chat/completions",
            json=payload,
            timeout=TIMEOUT_SECONDS,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
    except requests.RequestException as exc:
        raise LLMError(f"LM Studio unreachable: {exc}") from exc
    except (KeyError, IndexError, ValueError) as exc:
        raise LLMError(f"Unexpected LM Studio response: {exc}") from exc


def _call_groq(prompt: str, cfg: dict) -> str:
    api_key = cfg.get("GROQ_API_KEY", "")
    if not api_key:
        raise LLMError("GROQ_API_KEY is not configured. Set it in the Settings screen.")
    model = cfg.get("GROQ_MODEL", "llama-3.1-8b-instant")
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    try:
        resp = requests.post(
            GROQ_BASE_URL,
            json=payload,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            timeout=TIMEOUT_SECONDS,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
    except requests.RequestException as exc:
        raise LLMError(f"Groq request failed: {exc}") from exc
    except (KeyError, IndexError, ValueError) as exc:
        raise LLMError(f"Unexpected Groq response: {exc}") from exc
