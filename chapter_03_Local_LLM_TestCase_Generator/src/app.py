"""app.py — Screen 1: Chat. Main entry point for the Jira Test Case Generator.

User types a natural-language request containing a Jira key (e.g.
"create test cases for QA-102"), the app fetches the ticket from Jira,
merges it into the template from /templates, and renders the LLM-generated
test cases back in the chat pane.
"""

import re
from pathlib import Path

import streamlit as st

import config_store
import jira_client
import llm_client

JIRA_KEY_RE = re.compile(r"\b[A-Z][A-Z0-9]+-\d+\b")

TEMPLATE_PATH = Path(__file__).resolve().parent.parent / "templates" / "TestCase_Creator.md"

APP_NAME = "JIRA Test Case Generator"
APP_VERSION = "1.0.0"
APP_AUTHOR = "Jagadesh"

st.set_page_config(page_title="JIRA Test Case Generator", page_icon="🧪", layout="centered")

st.title("🧪 JIRA Test Case Generator")

# --- Sidebar: app info ---
with st.sidebar:
    st.caption(f"**{APP_NAME}**")
    st.caption(f"Version: {APP_VERSION}")
    st.caption(f"Author: {APP_AUTHOR}")


def load_template() -> str:
    """Read the test case template from /templates."""
    if not TEMPLATE_PATH.exists():
        st.error(f"Template not found at {TEMPLATE_PATH}. Add templates/TestCase_Creator.md and restart.")
        st.stop()
    return TEMPLATE_PATH.read_text(encoding="utf-8")


def build_prompt(ticket: dict) -> str:
    """Merge the fetched ticket content into the template structure."""
    template = load_template()
    ticket_block = (
        "----------------------------------------\n"
        f"TICKET: {ticket['key']}\n"
        f"Summary: {ticket['summary']}\n"
        f"Type: {ticket['issuetype']} | Status: {ticket['status']} | Priority: {ticket['priority']}\n"
        f"Labels: {', '.join(ticket['labels']) if ticket['labels'] else 'None'}\n\n"
        f"Description:\n{ticket['description']}\n\n"
        f"Acceptance Criteria:\n{ticket['acceptance_criteria']}\n"
        "----------------------------------------\n\n"
        "Generate the test cases for THE TICKET ABOVE, not for any example in the "
        "template. Follow the structure, BDD format, and rules in the template exactly. "
        "Use an iterative TestCase ID like FeatureName_TC_01. Keep the Actual Result, "
        "Execution Date, and Status columns blank."
    )
    return f"{template}\n\n{ticket_block}"


def handle_message(text: str) -> None:
    """Process a user message end-to-end: parse key -> fetch -> generate -> render."""
    match = JIRA_KEY_RE.search(text)
    if not match:
        st.error("No Jira key found in your message. Example: 'create test cases for QA-102'.")
        return

    issue_key = match.group(0)

    with st.chat_message("assistant"):
        status = st.status(f"Fetching {issue_key} from Jira...", expanded=False)

        cfg = config_store.get_credentials()
        errors = config_store.validate(cfg)
        if errors:
            status.update(label="Configuration incomplete", state="error", expanded=True)
            for err in errors:
                st.write(f"- {err}")
            st.write("Open the **Settings** page to configure the app.")
            return

        # 1. Fetch ticket.
        try:
            ticket = jira_client.fetch_ticket(
                cfg["JIRA_URL"], cfg["JIRA_EMAIL"], cfg["JIRA_API_TOKEN"], issue_key
            )
        except jira_client.JiraError as exc:
            status.update(label=f"Jira error: {exc}", state="error", expanded=True)
            st.write(str(exc))
            return

        # 2. Load template + build prompt.
        prompt = build_prompt(ticket)
        status.update(label=f"Ticket {issue_key} fetched. Generating test cases...", state="running")

        # 3. Generate via LLM (LM Studio default, Groq fallback).
        try:
            result_text, provider = llm_client.generate(prompt, cfg)
        except llm_client.LLMError as exc:
            status.update(label="Generation failed", state="error", expanded=True)
            st.write(str(exc))
            return

        status.update(label="Done", state="complete", expanded=False)
        st.markdown(result_text)
        st.caption(f"Generated via {provider}.")


# --- Session state ---
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "Hello! I generate test cases from a Jira ticket. "
            "Type e.g. **create test cases for QA-102** below, or click the Create TestCases button.",
        }
    ]

# --- Render chat history ---
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# --- Chat input (ChatGPT-style) ---
if prompt := st.chat_input("Enter JIRA ID you want to Create Testcases"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    handle_message(prompt)

# --- Button (per wireframe): explicit Jira ID input + Create TestCases button ---
st.write("")
col_input, col_button = st.columns([3, 1])
with col_input:
    jira_id_input = st.text_input(
        "JIRA ID",
        placeholder="e.g. QA-102",
        label_visibility="collapsed",
        key="jira_id_input",
    )
with col_button:
    clicked = st.button("Create TestCases", type="primary", use_container_width=True)

if clicked:
    message = f"create test cases for {jira_id_input.strip()}" if jira_id_input.strip() else "create test cases"
    st.session_state.messages.append({"role": "user", "content": message})
    with st.chat_message("user"):
        st.markdown(message)
    handle_message(message)
