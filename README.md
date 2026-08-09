# AITesterBluePrint4X

A structured QA blueprint repository for AI-assisted software testing. It contains prompt engineering frameworks, reusable prompt templates, and a working Playwright + TypeScript automation framework — all centered around the **RICE POT** prompting methodology.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Repository Structure](#repository-structure)
- [Chapter 1: LLM Basics](#chapter-1-llm-basics)
- [Chapter 2: Prompt Engineering](#chapter-2-prompt-engineering)
- [Prompt Templates Library](#prompt-templates-library)
- [Tasks & Deliverables](#tasks--deliverables)
- [Playwright Framework](#playwright-framework)
- [Contribution](#contribution)

## Overview

This repository is organized as a progressive blueprint for QA engineers working with AI:

- **Chapter 1 — LLM Basics:** Foundational anti-hallucination rules that govern how AI must behave as a QA Professionals.
- **Chapter 2 — Prompt Engineering:** The RICE POT prompt framework (`Role`, `Instructions`, `Context`, `Example`, `Parameters`, `Output`, `Tone`), a library of reusable prompt templates, and generated task deliverables (test plan, BDD test cases, and a runnable Playwright framework).

## Key Features

- **RICE POT Framework** — a 7-part prompt template for deterministic, enterprise-grade QA output.
- **Anti-Hallucination Rules** — mandatory verification rules for AI-generated test artifacts.
- **Reusable Prompt Templates** — for API testing, bug reporting, STLC activities, and README generation.
- **Working Automation Example** — a Playwright + TypeScript Page Object Model framework automating the VWO login flow.
- **Traceable Deliverables** — test plan and BDD test cases derived strictly from the VWO login PRD.

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
