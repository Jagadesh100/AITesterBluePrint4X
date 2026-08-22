"""jira_client.py — fetch ticket details from the Jira REST API.

Uses Basic Auth (email + API token) against the v2 REST API. The "acceptance
criteria" field is located by scanning customfields for a name containing
"acceptance" (case-insensitive); if none is found the description is used.
"""

import re

import requests

TIMEOUT_SECONDS = 15


class JiraError(Exception):
    """Raised for Jira API failures with a user-friendly message."""

    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


def check_connection(jira_url: str, email: str, api_token: str) -> str:
    """Verify Jira credentials by calling the 'myself' endpoint.

    Returns a human-readable status message so the UI can show it without
    raising exceptions.
    """
    if not jira_url or not email or not api_token:
        return "Jira credentials are not configured. Set them in the Settings screen."

    try:
        resp = requests.get(
            f"{jira_url.rstrip('/')}/rest/api/2/myself",
            auth=(email, api_token),
            headers={"Accept": "application/json"},
            timeout=TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        return f"Could not reach Jira: {exc}"

    if resp.status_code == 401 or resp.status_code == 403:
        return "Jira authentication failed (401/403). Check JIRA_EMAIL and JIRA_API_TOKEN."
    if resp.status_code >= 400:
        return f"Jira API error (HTTP {resp.status_code})."
    display_name = (resp.json().get("displayName") or "") if resp.headers.get("Content-Type", "").startswith("application/json") else ""
    return f"Jira connection OK. Authenticated as {display_name}." if display_name else "Jira connection OK."


def fetch_ticket(jira_url: str, email: str, api_token: str, issue_key: str) -> dict:
    """Fetch a Jira issue and return its key details as a dict.

    Raises JiraError with a readable message on bad credentials, missing
    ticket, or network failure.
    """
    if not jira_url or not email or not api_token:
        raise JiraError("Jira credentials are not configured. Set them in the Settings screen.")

    session = requests.Session()
    session.auth = (email, api_token)
    session.headers.update({"Accept": "application/json"})

    base_url = jira_url.rstrip("/")

    # Field metadata maps customfield_* IDs to human-readable names. Used to
    # locate the acceptance-criteria field. Cache per session.
    try:
        fields_resp = session.get(f"{base_url}/rest/api/2/field", timeout=TIMEOUT_SECONDS)
        field_names = {}
        if fields_resp.status_code == 200:
            for field in fields_resp.json():
                if field.get("id", "").startswith("customfield_"):
                    field_names[field["id"]] = field.get("name", "")
    except requests.RequestException:
        field_names = {}

    try:
        resp = session.get(f"{base_url}/rest/api/2/issue/{issue_key}", timeout=TIMEOUT_SECONDS)
    except requests.RequestException as exc:
        raise JiraError(f"Could not reach Jira: {exc}") from exc

    if resp.status_code == 401 or resp.status_code == 403:
        raise JiraError("Jira authentication failed (401/403). Check JIRA_EMAIL and JIRA_API_TOKEN.", resp.status_code)
    if resp.status_code == 404:
        raise JiraError(f"Jira issue {issue_key} not found (404).", resp.status_code)
    if resp.status_code >= 400:
        raise JiraError(f"Jira API error (HTTP {resp.status_code}).", resp.status_code)

    data = resp.json()
    fields = data.get("fields", {})

    description = _parse_rich_text(fields.get("description"))
    acceptance_criteria = _find_acceptance_criteria(fields, field_names)

    return {
        "key": issue_key,
        "summary": fields.get("summary", "").strip(),
        "description": description,
        "acceptance_criteria": acceptance_criteria,
        "status": (fields.get("status") or {}).get("name", ""),
        "priority": (fields.get("priority") or {}).get("name", ""),
        "issuetype": (fields.get("issuetype") or {}).get("name", ""),
        "labels": fields.get("labels") or [],
    }


def _find_acceptance_criteria(fields: dict, field_names: dict) -> str:
    """Locate the acceptance-criteria customfield, else fall back to description.

    field_names maps customfield_* IDs to their display names (fetched from
    /rest/api/2/field). A customfield whose name contains "acceptance"
    (case-insensitive) is treated as the acceptance-criteria field.
    """
    for key, value in fields.items():
        if not key.startswith("customfield_"):
            continue
        field_name = field_names.get(key, "")
        if "acceptance" in str(field_name).lower():
            # Customfields can be stored as plain strings or as ADF dicts.
            raw = value.get("value") if isinstance(value, dict) and "value" in value else value
            text = _parse_rich_text(raw)
            if text:
                return text
    return _parse_rich_text(fields.get("description", ""))


def _parse_rich_text(value) -> str:
    """Convert Jira's Atlassian Document Format (ADF) to plain text.

    ADF is the shape: {"type":"doc","content":[{"type":"paragraph",
    "content":[{"type":"text","text":"..."}]}]}. Plain strings pass through.
    """
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    if not isinstance(value, dict):
        return str(value).strip()

    parts = []

    def walk(node):
        if isinstance(node, dict):
            if node.get("type") == "text":
                parts.append(node.get("text", ""))
            if node.get("type") == "hardBreak":
                parts.append("\n")
            if node.get("type") == "codeBlock":
                parts.append("\n```\n")
            for child in node.get("content", []) or []:
                walk(child)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(value)

    text = "".join(parts).strip()
    # Collapse 3+ newlines to 2 for readability.
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text
