"""pages/settings.py — Screen 2: Settings.

A configuration screen to input and persist: Jira URL, Jira email ID,
Jira API token, LLM provider choice (LM Studio / Groq), LM Studio URL/model,
and Groq API key/model. Values are stored in the local .env file only.
"""

import streamlit as st

import config_store
import jira_client
import llm_client

st.set_page_config(page_title="Settings — JIRA Test Case Generator", page_icon="⚙️")

st.title("⚙️ Settings")

cfg = config_store.load_env()
provider = cfg.get("LLM_PROVIDER", "lm_studio")

st.markdown("Configure your Jira and LLM provider connections. Settings are stored locally in `.env`.")

# --- Jira Configuration ---
st.subheader("Jira Configuration")
jira_url = st.text_input(
    "Jira URL",
    value=cfg.get("JIRA_URL", ""),
    placeholder="https://your-company.atlassian.net",
)
jira_email = st.text_input("Jira Email", value=cfg.get("JIRA_EMAIL", ""))
jira_token = st.text_input("Jira API Token", value=cfg.get("JIRA_API_TOKEN", ""), type="password")

if st.button("Test Jira Connection"):
    with st.status("Testing Jira connection...", expanded=False) as status:
        jira_status = jira_client.check_connection(
            jira_url.strip(),
            jira_email.strip(),
            jira_token.strip(),
        )
        status.update(label="Jira connection test complete", state="complete", expanded=True)
    st.write(jira_status)

st.divider()

# --- LLM Provider ---
st.subheader("🤖 LLM Provider")

llm_provider = st.radio(
    "Select LLM provider",
    options=["lm_studio", "groq"],
    format_func=lambda x: "LM Studio (local, gemma3:1b)" if x == "lm_studio" else "Groq (cloud)",
    index=0 if provider == "lm_studio" else 1,
    horizontal=True,
)

lm_studio_url = st.text_input(
    "LM Studio URL",
    value=cfg.get("LM_STUDIO_URL", "http://localhost:1234"),
    placeholder="http://localhost:1234",
)
lm_studio_model = st.text_input("LM Studio Model", value=cfg.get("LM_STUDIO_MODEL", "gemma2:1b"))

if st.button("Test LM Studio"):
    test_cfg = {
        "LLM_PROVIDER": "lm_studio",
        "LM_STUDIO_URL": lm_studio_url.strip(),
        "LM_STUDIO_MODEL": lm_studio_model.strip(),
    }
    with st.status("Testing LM Studio connection...", expanded=False) as status:
        lm_status = llm_client.check_connection(test_cfg)
        status.update(label="LM Studio test complete", state="complete", expanded=True)
    st.write(lm_status)

groq_token = st.text_input("Groq API Key", value=cfg.get("GROQ_API_KEY", ""), type="password")

if st.button("Test Groq"):
    test_cfg = {
        "LLM_PROVIDER": "groq",
        "GROQ_API_KEY": groq_token.strip(),
        "GROQ_MODEL": cfg.get("GROQ_MODEL", "llama-3.1-8b-instant"),
    }
    with st.status("Testing Groq connection...", expanded=False) as status:
        groq_status = llm_client.check_connection(test_cfg)
        status.update(label="Groq test complete", state="complete", expanded=True)
    st.write(groq_status)

st.divider()

# --- Save ---
if st.button("💾 Save Settings", type="primary"):
    new_cfg = {
        "JIRA_URL": jira_url.strip(),
        "JIRA_EMAIL": jira_email.strip(),
        "JIRA_API_TOKEN": jira_token.strip(),
        "LLM_PROVIDER": llm_provider,
        "LM_STUDIO_URL": lm_studio_url.strip(),
        "LM_STUDIO_MODEL": lm_studio_model.strip(),
        "GROQ_API_KEY": groq_token.strip(),
        "GROQ_MODEL": cfg.get("GROQ_MODEL", "llama-3.1-8b-instant"),
    }
    errors = config_store.validate(new_cfg)
    if errors:
        st.error("Please fix the following:")
        for err in errors:
            st.write(f"- {err}")
    else:
        config_store.save_env(new_cfg)
        st.success("Settings saved to .env successfully.")
