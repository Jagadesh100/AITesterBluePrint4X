# AITesterBluePrint4X

A structured QA blueprint repository for AI-assisted software testing. It contains prompt engineering frameworks, reusable prompt templates, a working Playwright + TypeScript automation framework, a Jira-driven LLM test case generator app, an AI-powered resume tailoring toolkit, and a local-first job application tracker — all centered around the **RICE POT** prompting methodology.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Repository Structure](#repository-structure)
- [Chapter 1: LLM Basics](#chapter-1-llm-basics)
- [Chapter 2: Prompt Engineering](#chapter-2-prompt-engineering)
- [Chapter 3: Local LLM Test Case Generator](#chapter-3-local-llm-test-case-generator)
- [Chapter 4: JobKit AI — Resume Tailor](#chapter-4-jobkit-ai--resume-tailor)
- [Chapter 5: Job Tracker AI](#chapter-5-job-tracker-ai)
- [Prompt Templates Library](#prompt-templates-library)
- [Tasks & Deliverables](#tasks--deliverables)
- [Playwright Framework](#playwright-framework)
- [Contribution](#contribution)

## Overview

This repository is organized as a progressive blueprint for QA engineers working with AI:

- **Chapter 1 — LLM Basics:** Foundational anti-hallucination rules that govern how AI must behave as a QA Professionals.
- **Chapter 2 — Prompt Engineering:** The RICE POT prompt framework (`Role`, `Instructions`, `Context`, `Example`, `Parameters`, `Output`, `Tone`), a library of reusable prompt templates, and generated task deliverables (test plan, BDD test cases, and a runnable Playwright framework).
- **Chapter 3 — Local LLM Test Case Generator:** A Streamlit app that turns a Jira ticket into enterprise-grade test cases, using a local LLM (LM Studio) with a Groq cloud fallback.
- **Chapter 4 — JobKit AI — Resume Tailor:** An AI skill that tailors an existing resume to a job description and renders an ATS-safe, editable `.docx`, with every change highlighted for approval.
- **Chapter 5 — Job Tracker AI:** A local-first React + Vite job application tracker with a drag-and-drop Kanban board, IndexedDB persistence, interview-round tracking, and analytics.

## Key Features

- **RICE POT Framework** — a 7-part prompt template for deterministic, enterprise-grade QA output.
- **Anti-Hallucination Rules** — mandatory verification rules for AI-generated test artifacts.
- **Reusable Prompt Templates** — for API testing, bug reporting, STLC activities, and README generation.
- **Working Automation Example** — a Playwright + TypeScript Page Object Model framework automating the VWO login flow.
- **Traceable Deliverables** — test plan and BDD test cases derived strictly from the VWO login PRD.
- **Jira → Test Case Pipeline** — a Streamlit app that merges a Jira ticket into a RICE POT template and generates test cases via a local or hosted LLM.
- **Resume Tailoring** — an AI skill that rewrites a resume against a JD, highlighting every change and refusing to invent facts.
- **Job Application Tracker** — a local-first Kanban board (React + Vite + IndexedDB) with restricted drag-and-drop, interview-round tracking, and follow-up reminders.

## Repository Structure

```text
AITesterBluePrint4X/
├── .gitignore
├── README.md
├── chapter_01_LLM_Basics/
│   └── Anti-Hallucination.rules.md        # Anti-hallucination rules for QA assistants
└── chapter_02_Prompt_Engineering/
    ├── 01_RICE_POT_Template.md            # Core RICE POT prompt template
    ├── 02_RICE_POT_Test_Plan_Generation_Example.md
    ├── 03_RICE_POT_Test_Case_Generation_BDD_Format_Example.md
    ├── Documents/
    │   └── PRD_VWO.md                     # VWO login dashboard product requirements
    ├── Prompt Templates/
    │   ├── API Testing Prompts/           # REST API, validation, contract, auth, error, performance
    │   ├── Bug Reporting Templates/       # Evidence-based bug reports and analysis
    │   ├── README File Template/          # RICE POT prompt for README creation/updates
    │   ├── STLC/                          # Test case, PRD-to-test, negative, regression templates
    │   └── playwright/
    │       └── Test_Automation_Framework_Generation.md
    └── Tasks/
        ├── Playwright Automation Framework Generator/
        │   ├── RICE_POT_PlaywrightAdvanceFramework.md  # Framework generation plan
        │   └── RICE_POT_PlaywrightAdvanceFramework/    # Runnable framework (see below)
        ├── Test Plan Generator/
        │   └── TestPlan_VWO_Login.md      # Generated enterprise test plan
        └── TestCase Generator/
            └── TestCases_VWO_Login.feature  # Generated BDD feature file
├── chapter_03_Local_LLM_TestCase_Generator/
│   ├── templates/
│   │   └── TestCase_Creator.md            # RICE POT test case generation template
│   └── src/
│       ├── app.py                         # Streamlit chat screen (entry point)
│       ├── pages/
│       │   └── settings.py                # Jira + LLM credential configuration
│       ├── config_store.py                # Persisted settings (.env) read/write
│       ├── jira_client.py                 # Jira REST API ticket fetcher
│       ├── llm_client.py                  # LM Studio / Groq LLM calls
│       ├── FineTune_Prompt.md             # RICE POT prompt used to build the app
│       ├── requirements.txt
│       └── .env.example                   # Copy to .env — never commit real keys
└── chapter_04_JobKitAI/
    ├── Job_Description_22_Aug_2026/
    │   └── linkedin_jobs.csv              # Source JD spreadsheet
    ├── Resume/
    │   └── Jagadesh_Thirumal_Resume.pdf   # Source resume
    ├── resume-helper/
    │   └── resume-tailor/
    │       ├── SKILL.md                   # Resume tailoring skill definition
    │       ├── references/                # Schema + writing rules
    │       └── scripts/
    │           ├── build_resume.js        # Renders spec JSON → .docx
    │           └── package.json
    └── output/                            # Generated tailored resumes (.docx + spec JSON)
└── chapter_05_Job_Tracker_AI_Application/
    ├── Skill.md                           # Full product spec for the tracker app
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── src/
        ├── main.jsx                       # React entry point
        ├── App.jsx                        # App shell: header, tabs, views
        ├── index.css                      # Tailwind + theme scrollbar styling
        ├── db/
        │   └── db.js                      # idb IndexedDB open + CRUD helpers
        ├── hooks/
        │   └── useJobs.js                 # IndexedDB state hook
        ├── utils/
        │   └── helpers.js                 # Statuses, accents, transitions, tags
        └── components/
            ├── Board.jsx                  # DnD context + column grid
            ├── Column.jsx                 # Kanban column (status dot, count, + Add)
            ├── JobCard.jsx                # Draggable job card
            ├── JobFormModal.jsx           # Add/edit modal (rounds, contact, tags)
            ├── SearchBar.jsx              # Search + tag filter
            ├── TagChip.jsx                # Colored tag chip
            ├── ThemeToggle.jsx            # Dark/light toggle
            ├── ArchiveView.jsx            # Archived cards list
            ├── AnalyticsView.jsx          # Stats view
            ├── CalendarView.jsx           # Follow-up/interview calendar
            └── ImportExport.jsx           # JSON export/import
```

## Chapter 1: LLM Basics

`chapter_01_LLM_Basics/Anti-Hallucination.rules.md` defines strict rules for AI QA Professionals:

- Use **only** information explicitly provided (PRD, API docs, logs, screenshots, test data, user input).
- **Never invent** features, APIs, error codes, UI elements, or behavior.
- Mark missing information as `Insufficient information to determine`.
- Label inferred details as `Inference (low confidence)`.
- Every assertion must be traceable to provided input.
- Output must be deterministic and repeatable.

## Chapter 2: Prompt Engineering

The **RICE POT** template (`01_RICE_POT_Template.md`) structures every prompt into seven sections:

| Component | Purpose |
|---|---|
| **R** — Role | Expertise the AI should adopt |
| **I** — Instructions | What to do and constraints to follow |
| **C** — Context | Background information and goals |
| **E** — Example | Expected input/output format |
| **P** — Parameters | Formatting and quality standards |
| **O** — Output | Exact deliverable and exclusions |
| **T** — Tone | Style of the final response |

Two worked examples are included:

- `02_RICE_POT_Test_Plan_Generation_Example.md` — generating an industry-level test plan for the VWO login page.
- `03_RICE_POT_Test_Case_Generation_BDD_Format_Example.md` — generating BDD-format test cases with positive and negative scenarios.

## Chapter 3: Local LLM Test Case Generator

`chapter_03_Local_LLM_TestCase_Generator/` is a **Streamlit** application that turns a Jira ticket into enterprise-grade test cases. Built entirely from a RICE POT prompt (`src/FineTune_Prompt.md`), it is an internal QA productivity tool, not a production SaaS.

### How it works

1. User types a natural-language request containing a Jira key, e.g. `create test cases for QA-102`.
2. The app fetches the ticket (summary, description, acceptance criteria) via the **Jira REST API v2**.
3. The ticket content is merged into the RICE POT template (`templates/TestCase_Creator.md`).
4. The combined prompt is sent to the selected LLM — **LM Studio** running locally (default) or **Groq** as a hosted fallback.
5. Generated test cases render back in the chat pane, with the provider shown.

### App structure

| Module | Purpose |
|---|---|
| `app.py` | Screen 1 — ChatGPT-style chat, Jira key parsing, end-to-end flow |
| `pages/settings.py` | Screen 2 — persist Jira URL, email, API token, provider choice, Groq key |
| `config_store.py` | Read/write settings from a local `.env` (never hardcoded) |
| `jira_client.py` | Fetch ticket details; locates the acceptance-criteria customfield |
| `llm_client.py` | OpenAI-compatible calls to LM Studio (`localhost:1234`) or Groq |
| `templates/TestCase_Creator.md` | RICE POT template enforcing the 7-column test case table |

### Setup & Run

```bash
cd chapter_03_Local_LLM_TestCase_Generator/src
pip install -r requirements.txt
copy .env.example .env      # then fill in Jira + LLM credentials
streamlit run app.py
```

> **Note:** The default provider is LM Studio (`http://localhost:1234`, model `gemma3:1b` / `gemma2:1b`). Groq is used when selected in Settings. Credentials are stored in `.env`, which is excluded from version control.

## Chapter 4: JobKit AI — Resume Tailor

`chapter_04_JobKitAI/` is an AI-assisted job application toolkit. It pairs a source resume (`Resume/Jagadesh_Thirumal_Resume.pdf`) with job descriptions (`Job_Description_22_Aug_2026/linkedin_jobs.csv`) and produces tailored, ATS-safe resumes.

### How it works

The core is the `resume-tailor` skill (`resume-helper/resume-tailor/SKILL.md`), which:

1. Reads the resume and extracts every role, date, metric, tool, and claim — and what's missing.
2. Extracts the JD's real requirements: named hard skills (the gates), responsibilities, seniority signals, domain, and recurring vocabulary.
3. Cross-references the two into a match table — ✅ Match, 🟡 Partial, or 🙈 Absent — never inventing skills or metrics.
4. **Reports before writing**: the match table and a blunt fit estimate are shown to the candidate first.
5. Builds the resume from a JSON spec and renders a `.docx` via `scripts/build_resume.js`.
6. Delivers an editable Google Doc with every change **highlighted** so the candidate can audit it.

### Inline markup

| Markup | Renders as | Purpose |
|---|---|---|
| `==text==` | Yellow highlight | A change made for this JD |
| `[text]` | Red bold | A fact only the candidate can supply |
| `**text**` | Bold | A metric or term worth anchoring the eye on |

Running the build with `--clean` strips highlights, drops `note` blocks, and **refuses to build** if any `[placeholder]` remains — making it structurally impossible to send out a resume with unanswered gaps.

### Generated outputs

`chapter_04_JobKitAI/output/` contains tailored resumes as `.docx` files with their JSON specs:

- `JAGADESH_THIRUMAL_QA_Automation_Engineer.docx` — base tailored resume
- `JAGADESH_THIRUMAL_QA_Automation_Engineer_TEKSystems.docx` — tailored to TEKSystems JD
- `JAGADESH_THIRUMAL_QA_Engineer_Infosys.docx` — tailored to Infosys JD

## Chapter 5: Job Tracker AI

`chapter_05_Job_Tracker_AI_Application/` is a **local-first job application tracker** — a single-page React + Vite app with a drag-and-drop Kanban board. All data lives in the browser via **IndexedDB** (the `idb` wrapper); there is no backend, auth, or external API, so it works fully offline. The full product spec lives in `Skill.md`.

### Kanban board

Seven equal-width columns (no horizontal scrolling — all fit the viewport):

1. **Wishlist** — saved jobs not yet applied to
2. **Applied** — application submitted
3. **Follow-up** — followed up with recruiter/referral
4. **Interview** — in interview rounds
5. **Offer Accepted** — offer received and accepted
6. **Offer Declined** — offer received but declined by the candidate
7. **Rejected** — got a rejection from the company

Each card shows the company, role, resume tag, tag chips, days since applied, a clickable LinkedIn link, a status label pill, and a colored accent matching its status. Columns have a fixed-height "+ Add" slot so all columns stay the same size; the button only appears in **Wishlist, Applied, and Interview**.

### Restricted drag-and-drop

Card movement is strictly limited to a transition map:

| From | Allowed targets |
|---|---|
| Wishlist | Applied only |
| Applied | Follow-up, Interview, Rejected |
| Follow-up | Interview, Rejected |
| Interview | Follow-up, Offer Accepted, Offer Declined, Rejected |
| Offer Accepted / Offer Declined / Rejected | locked (cannot be dragged) |

During a drag, legal target columns highlight blue, the source stays normal, and illegal targets dim.

### Core features

- **Drag-and-drop** with `@dnd-kit/core` — persists the new status to IndexedDB immediately.
- **Add/Edit modal** — all fields (company, role, LinkedIn URL, resume/cover letter, salary, dates, status, tags, contact/recruiter, JD snapshot, notes), grouped into sections.
- **Interview round tracker** — rounds are only enterable while a card is in **Interview**; free-text stages with date, notes, and a "Done" checkbox.
- **Search & tag filter** — live substring match on company/role plus multi-tag filtering.
- **Follow-up reminders** — overdue badge on cards + a "N need follow-up" count in the header.
- **Archive (soft delete)** — archive a card, then restore or permanently delete from the Archive tab.
- **Calendar view** — monthly view plotting follow-up dates and interview rounds; clicking an event opens the card.
- **Analytics view** — applications this week/month, response rate, rejection rate (company + self-declined), average days to outcome.
- **Import/Export JSON** — dump all records to a `.json` file and re-import with shape validation.
- **Dark/light mode** — Tailwind `dark:` classes with a smooth theme transition, stored in `localStorage`.

### Tech stack

| Dependency | Version |
|---|---|
| `react` / `react-dom` | ^18.3.1 |
| `vite` | ^6.4.3 |
| `tailwindcss` | ^3.4.19 |
| `idb` | ^8.0.0 |
| `@dnd-kit/core` / `sortable` / `utilities` | ^6.1.0 / ^8.0.0 / ^3.2.2 |

### Setup & Run

```bash
cd chapter_05_Job_Tracker_AI_Application
npm install
npm run dev          # start the dev server (http://localhost:5173)
npm run build        # production build
```

> **Note:** If `npm install` doesn't pull dev dependencies, run `npm install --save-dev vite @vitejs/plugin-react tailwindcss postcss autoprefixer` — a global `npm config set omit=dev` can suppress them.

## Prompt Templates Library

`chapter_02_Prompt_Engineering/Prompt Templates/` contains reusable templates:

- **API Testing Prompts** — REST API test suite, validation tests, test case generation, contract testing, authentication tests, performance scenarios, and error handling tests.
- **Bug Reporting Templates** — bug reports from evidence, bug classification, chain-of-thought bug analysis, and note-to-bug-report conversion.
- **STLC** — basic test case generation, PRD-to-test-case conversion, negative-only test cases, and regression test suite generation.
- **Playwright** — enterprise Playwright + TypeScript framework generation prompt (POM, XPath-only locators, web-first assertions, externalized credentials).
- **README File Template** — the prompt used to create or update this README, keeping it synchronized with the repository.

## Tasks & Deliverables

Generated artifacts based on the VWO login PRD (`Documents/PRD_VWO.md`):

- **Test Plan** — `Tasks/Test Plan Generator/TestPlan_VWO_Login.md`: a full enterprise test plan (TP-VWO-LOGIN-001) covering functional, security, UI/UX, accessibility, performance, and compatibility cases with PRD traceability.
- **BDD Test Cases** — `Tasks/TestCase Generator/TestCases_VWO_Login.feature`: Gherkin feature file with positive and negative login scenarios, tagged for smoke/regression.
- **Automation Framework Plan** — `Tasks/Playwright Automation Framework Generator/RICE_POT_PlaywrightAdvanceFramework.md`: the design plan for the runnable Playwright framework below.

## Playwright Framework

A runnable **Playwright + TypeScript** automation framework for the VWO login page (`https://app.vwo.com/#/login`), located at:

```text
chapter_02_Prompt_Engineering/Tasks/Playwright Automation Framework Generator/
└── RICE_POT_PlaywrightAdvanceFramework/
    ├── package.json
    ├── package-lock.json
    ├── pages/
    │   └── LoginPage.ts              # Page Object Model (XPath-only locators)
    └── tests/
        ├── valid-login.spec.ts       # Valid credentials → dashboard
        └── invalid-login.spec.ts     # Invalid credentials → error message
```

### Technology Stack

| Dependency | Version |
|---|---|
| `@playwright/test` | ^1.62.1 |
| `typescript` | ^7.0.2 |
| `@types/node` | ^26.2.0 |
| `dotenv` | ^17.4.2 |

### Framework Design

- **Page Object Model** — all locators and interactions encapsulated in `LoginPage.ts`.
- **XPath-only locators** — no CSS, direct ID, or name selectors.
- **Web-first assertions** — Playwright auto-waiting, no hard-coded waits.
- **Reusable actions** — `login()`, `goto()`, `getErrorMessage()`, and visibility checks.

### Setup & Run

```bash
cd "chapter_02_Prompt_Engineering/Tasks/Playwright Automation Framework Generator/RICE_POT_PlaywrightAdvanceFramework"
npm install
```

> **Note:** Valid credentials must be provided before running the valid-login test — `tests/valid-login.spec.ts` defines `VALID_EMAIL` and `VALID_PASSWORD` as placeholders to be filled in. The invalid-login test uses fixed invalid credentials and requires no account setup.

```bash
npx playwright test                 # run the full test suite
npx playwright test tests/invalid-login.spec.ts   # run a single spec
```

## Contribution

Ensure all generated test artifacts comply with the repository's anti-hallucination rules:

- Base content only on the referenced source documents (PRD, API docs, evidence).
- Label unknown information as `Insufficient information to determine`.
- Label inferred details as `Inference (low confidence)`.
- Keep the README synchronized with actual repository contents.
