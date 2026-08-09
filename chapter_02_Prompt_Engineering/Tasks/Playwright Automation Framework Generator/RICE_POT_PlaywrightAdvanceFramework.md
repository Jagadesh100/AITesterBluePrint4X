# Plan: RICE_POT_PlaywrightAdvanceFramework — VWO Login Automation

## Goal

Create an enterprise-grade, runnable **Playwright + TypeScript** framework for the VWO login page (`https://app.vwo.com/#/login`), implementing the RICE POT template (`chapter_02_Prompt_Engineering/Prompt Templates/playwright/Test_Automation_Framework_Generation.md`): Page Object Model, XPath-only locators, exactly 2 test scripts (valid + invalid login), web-first assertions, Playwright lifecycle hooks, externalized credentials — plus the minimal scaffold needed to run it.

## Location

Framework folder (the "chapter 2 task" folder — currently empty):

```
chapter_02_Prompt_Engineering/Tasks/RICE_POT_PlaywrightAdvanceFramework/
```

Plan deliverable folder (created by this task, name exactly as user specified):

```
chapter_02_Prompt_Engineering/Tasks/Playwright Automation Framweork generator/
  └── Plan.md   (a copy of this plan, saved during implementation)
```

## Files to create

### Framework: `Tasks/RICE_POT_PlaywrightAdvanceFramework/`

| File | Purpose |
|---|---|
| `pages/LoginPage.ts` | Login Page Object (the 1 required code file) |
| `tests/valid-login.spec.ts` | Valid login test (required) |
| `tests/invalid-login.spec.ts` | Invalid login test (required) |
| `playwright.config.ts` | Test runner config; baseURL + credentials from env |
| `tsconfig.json` | TypeScript config |
| `package.json` | Deps + `npm test` scripts |
| `.env.example` | Placeholder credentials (committed) |
| `.env` | Real credentials (gitignored, created with placeholders) |
| `.gitignore` | node_modules, .env, test-results, playwright-report |
| `README.md` | 1-page setup/run instructions |

### Plan deliverable: `Tasks/Playwright Automation Framweork generator/`

| File | Purpose |
|---|---|
| `Plan.md` | Copy of this plan (the generated plan file the user asked to save) |

## Locator truth (verified from live VWO DOM)

Real VWO login page elements and their XPath-only locators:

| Element | XPath |
|---|---|
| Email field | `//input[@id='login-username']` |
| Password field | `//input[@id='login-password']` |
| Sign In button | `//button[@id='js-login-btn']` |
| Error notification | `//div[@id='js-notification-box-msg']` |
| Remember Me checkbox | `//input[@id='login-remember-me']` — verify during implementation; if missing, fall back to `//label[contains(normalize-space(.),'Remember')]/input` |

- Invalid login error text: `Your email, password, IP address or location did not match`
- Post-login URL: hash route `https://app.vwo.com/#/dashboard` → assert with `toHaveURL(/#\/dashboard/)`

## Design

### 1. `pages/LoginPage.ts` (comment-free per template output rules)

- Class `LoginPage`, constructor takes `readonly page: Page`.
- Locators as private readonly `Locator` fields using **XPath only** (no CSS, no direct id/name selectors — ids only inside XPath expressions).
- Methods:
  - `goto(): Promise<void>` — `page.goto(url)`, URL from env via config `baseURL`.
  - `enterEmail(email: string)` / `enterPassword(password: string)` — `locator.fill()`.
  - `setRememberMe()` — checks the checkbox if not already checked.
  - `clickSignIn()` — click on `//button[@id='js-login-btn']`.
  - `login(email, password, rememberMe?)` — compose the flow (reusable action).
  - `getErrorMessage(): Locator` / `isErrorMessageVisible()` — validation helpers for the negative path.
- No hard-coded waits, no `Thread.sleep`, no try-catch noise — failures propagate via Playwright auto-waiting; only one purposeful try-catch if it adds diagnostic value (otherwise none).
- Strong typing throughout (`Promise<void>`, typed params).

### 2. `tests/valid-login.spec.ts`

- `test.describe('VWO Login — Valid Credentials')` with `test.beforeEach` navigating to the login page via the Page Object (Playwright's native hook; no TestNG annotations).
- Steps: instantiate `LoginPage(page)` → `goto()` → `login(env email, env password)` → web-first assertion: `await expect(page).toHaveURL(/#\/dashboard/)` and assert a visible post-login element (e.g. dashboard heading by XPath).
- Credentials read from `process.env.VWO_EMAIL` / `VWO_PASSWORD` — never hard-coded.

### 3. `tests/invalid-login.spec.ts`

- `test.describe('VWO Login — Invalid Credentials')` with `test.beforeEach` navigating to login.
- Steps: `login(invalid email, invalid password)` → assert error box visible and `toContainText('Your email, password, IP address or location did not match')` → assert NOT authenticated (`await expect(page).not.toHaveURL(/#\/dashboard/)` and error element remains visible).

### 4. `playwright.config.ts`

- `import dotenv from 'dotenv'; dotenv.config();` at top → loads `.env` into `process.env`.
- `defineConfig`: `testDir: './tests'`, `fullyParallel: true`, `timeout: 30_000`, `expect.timeout: 5_000`, `retries: 0`, `reporter: [['list'], ['html', { open: 'never' }]]`, `use: { baseURL: process.env.VWO_BASE_URL ?? 'https://app.vwo.com', screenshot: 'only-on-failure', trace: 'on-first-retry' }`, `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]`.

### 5. `package.json` / `tsconfig.json` / `.env*` / `.gitignore` / `README.md`

- `package.json`: private, `scripts: { test: 'playwright test', "test:headed": 'playwright test --headed', "test:debug": 'playwright test --debug' }`, `devDependencies`: `@playwright/test`, `@types/node`, `typescript`, `dotenv`. Node >= 18.
- `tsconfig.json`: `target ES2022`, `module commonjs`, `moduleResolution node`, `strict true`, `esModuleInterop`, `outDir dist`, `include: ['tests', 'pages', 'playwright.config.ts']`.
- `.env.example`: `VWO_BASE_URL=https://app.vwo.com`, `VWO_EMAIL=your-email@example.com`, `VWO_PASSWORD=your-password`.
- `.env`: same keys, placeholder values (user fills in real creds).
- `.gitignore`: `node_modules/`, `.env`, `test-results/`, `playwright-report/`, `dist/`.
- `README.md`: short — install (`npm install`), fill `.env`, run (`npm test` / `npx playwright test --headed`).

### 6. `Plan.md` deliverable

- After the framework is created, write a copy of this plan to `chapter_02_Prompt_Engineering/Tasks/Playwright Automation Framweork generator/Plan.md` (create the folder if needed) so the generated plan is saved alongside the task, per user request.

## Constraints honored from the template

- XPath-only locators; no CSS / direct id / name selectors; no Selenium `PageFactory`/`@FindBy` (explicitly called out in the template).
- Playwright lifecycle hooks only (`beforeEach`) — no `@Test`/`@BeforeMethod` etc.
- No `Thread.sleep`, no hard-coded waits; Playwright auto-waiting + web-first assertions.
- Credentials externalized via `.env` — nothing hard-coded in specs.
- Assertions live in the test layer; locators + interactions in the Page Object.
- Code: no comments, no markdown explanations, production-grade typing.

## Verification

1. `cd chapter_02_Prompt_Engineering/Tasks/RICE_POT_PlaywrightAdvanceFramework`
2. `npm install`
3. Put real VWO credentials in `.env`
4. `npx tsc --noEmit` — type-check passes
5. `npx playwright test tests/invalid-login.spec.ts` — passes without real creds (invalid path needs no valid account)
6. `npx playwright test` — valid test passes with real creds; invalid test passes; `playwright-report/` shows 2/2 green
7. Confirm `chapter_02_Prompt_Engineering/Tasks/Playwright Automation Framweork generator/Plan.md` exists and matches this plan
8. Confirm no CSS selectors / hard-coded waits / Selenium or Java syntax anywhere in the 3 code files
