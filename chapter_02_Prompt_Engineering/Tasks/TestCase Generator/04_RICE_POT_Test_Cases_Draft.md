# VWO Login — Test Cases (BDD Format)

**Feature:** VWO Login
**URL:** https://app.vwo.com/#/login
**Scope:** Login scenario ONLY — email, password, submit button, Remember Me, and Forgot Password (recovery path). No dashboard, registration, SSO, 2FA, or social login flows are covered.
**Basis:** `PRD_VWO.md`, `TestPlan_VWO_Login.md`, Anti-Hallucination Rules
**Author:** QA Automation Tester (5 years experience)

---

## 1. Positive Scenarios (10)

| TestCase ID | Test Scenario | Precondition | Test Steps (BDD) | Expected Result | PRD Trace | Actual Result | Execution Date | Status |
|---|---|---|---|---|---|---|---|---|
| Login_TC_01 | Successful login with valid credentials | Valid account (email + password) provisioned; login URL reachable | Given user is on https://app.vwo.com/#/login<br/>When user enters valid email<br/>And enters valid password<br/>And clicks Sign In<br/>Then user is authenticated<br/>And is redirected to the main VWO dashboard<br/>And success is clearly confirmed | User is authenticated and transitions to the main VWO dashboard; success clearly confirmed | PRD §Login Process; §Dashboard Transition; §Success Confirmation (F-001) | | | |
| Login_TC_02 | Login page renders all expected elements | Browser opens login URL | Given user opens the login URL<br/>Then VWO branding, email field, password field, submit button and Remember Me checkbox are displayed | Login page displays VWO branding, modern minimalist form with email + password fields, submit button, and Remember Me checkbox | PRD §Existing Features (F-002) | | | |
| Login_TC_03 | Remember Me checked — persistent login | Valid account; browser cookies enabled | Given user checks Remember Me<br/>And enters valid credentials<br/>When user submits and logs in<br/>And closes the browser<br/>When user reopens the login URL<br/>Then user reaches the dashboard without re-entering credentials | Session persists across browser restarts; user reaches dashboard without re-entering credentials | PRD §Remember Me; §Quick Access (F-030a / F-032) | | | |
| Login_TC_04 | Remember Me unchecked — session not persisted | Valid account | Given user logs in WITHOUT checking Remember Me<br/>When user closes the browser<br/>And reopens the login URL<br/>Then user must re-enter credentials | No persistent login; session is session-scoped only (Inference (low confidence): default scope — confirm) | PRD §Session Management (F-030) | | | |
| Login_TC_05 | Remember Me checkbox toggles reliably | Login page open | Given user is on the login page<br/>When user checks Remember Me<br/>And unchecks it<br/>And re-checks it<br/>Then the checkbox state toggles reliably<br/>And the selection is reflected on submit | Checkbox toggles reliably; selection honored on submit (Inference: toggle behavior — confirm) | PRD §Remember Me (F-031) | | | |
| Login_TC_06 | Loading state shown during submission | Valid credentials ready | Given user enters valid credentials<br/>When user clicks Sign In<br/>Then a visible loading state (spinner/progress) is shown during processing<br/>And double-submission is prevented while pending | Clear feedback during authentication processing; no duplicate submission possible while pending | PRD §Loading States (F-004) | | | |
| Login_TC_07 | Auto-focus on first input field | Login URL opened | Given user opens the login URL<br/>Then focus automatically lands on the email field without user interaction | Focus lands automatically on the email field | PRD §Auto-focus (F-003) | | | |
| Login_TC_08 | Forgot Password entry point visible | Login page open | Given user is on the login page<br/>Then a Forgot Password / recovery link is present | Forgot Password / recovery entry point is present on the login page | PRD §Forgot Password Flow (F-019) | | | |
| Login_TC_09 | Forgot Password initiates reset flow | Login page open | Given user is on the login page<br/>When user clicks Forgot Password<br/>And follows the flow<br/>Then a secure token-based password reset process starts | Secure token-based password reset process starts (full flow content out of scope) | PRD §Forgot Password Flow; §Recovery Options (F-020) | | | |
| Login_TC_10 | Password at minimum complexity accepted (boundary-pass) | Exact complexity rules confirmed with PO (PRD silent — Insufficient information to determine) | Given user enters a valid email<br/>And a password at exactly the minimum requirements<br/>When user submits<br/>Then login is accepted (boundary pass) | Accepted per confirmed complexity rules (Insufficient information to determine: exact minimum length and required character classes — confirm with PO) | PRD §Password Requirements (F-017) | | | |

## 2. Negative Scenarios (15)

| TestCase ID | Test Scenario | Precondition | Test Steps (BDD) | Expected Result | PRD Trace | Actual Result | Execution Date | Status |
|---|---|---|---|---|---|---|---|---|
| Login_TC_11 | Invalid email format rejected | Login page open | Given user enters a malformed email (e.g., `user@`, `user@@x.com`)<br/>When user blurs the field or submits<br/>Then an email format validation error is shown<br/>And login is not submitted | Email format validation error shown; login not submitted | PRD §Email Format Verification (F-011) | | | |
| Login_TC_12 | Correct email + wrong password rejected | Valid email; incorrect password | Given user enters a valid email<br/>And an incorrect password<br/>When user submits<br/>Then a clear, actionable authentication error is shown<br/>And user stays on the login page | Clear, actionable error message; user stays on the login page | PRD §Error Handling; §Error Identification (F-014) | | | |
| Login_TC_13 | Empty fields on submit rejected | Login page open | Given user leaves email and password empty<br/>When user clicks Sign In<br/>Then validation errors are shown for both fields<br/>And no submission occurs | Validation errors shown for both fields; no submission (Inference: field-level messaging copy — confirm) | PRD §Error Handling (F-015) | | | |
| Login_TC_14 | Whitespace-only credentials rejected | Login page open | Given user enters spaces only in email and password<br/>When user submits<br/>Then input is treated as empty/invalid<br/>And a validation error is displayed | Input treated as empty/invalid; validation error displayed (Inference (low confidence): expected handling — confirm) | PRD §User Input Validation (F-016) | | | |
| Login_TC_15 | Password below minimum complexity rejected | Complexity rules confirmed with PO | Given user enters a valid email<br/>And a password below the minimum requirements<br/>When user submits<br/>Then login is rejected with clear guidance on the requirements | Rejected with clear guidance on password requirements (Insufficient information to determine: exact rules — confirm with PO) | PRD §Password Requirements (F-018) | | | |
| Login_TC_16 | Password case-sensitivity failure | Valid email; password with wrong letter case | Given user enters a valid email<br/>And the password with incorrect letter case<br/>When user submits<br/>Then authentication fails with a clear error | Authentication fails with a clear error (Inference (low confidence): case-sensitivity handling — confirm) | PRD §Error Handling (F-021) | | | |
| Login_TC_17 | Real-time validation on blur | Login page open | Given user types an invalid value into the email field<br/>When user tabs away (blur)<br/>Then validation feedback appears immediately | Validation feedback appears immediately on blur | PRD §Real-time Validation (F-010) | | | |
| Login_TC_18 | SQL injection payload rejected | Login page open | Given user enters `' OR '1'='1` in the email field<br/>And any password<br/>When user submits<br/>Then the input is treated as data — no injection executes<br/>And login fails with an error | No SQL injection executes; no unauthorized access; login fails with an error | PRD §OWASP Authentication Guidelines (S-007) | | | |
| Login_TC_19 | XSS payload rejected | Login page open | Given user enters a `<script>` payload in the email/password field<br/>When user submits<br/>Then no script executes<br/>And no XSS occurs | Payload treated as data; no script execution; no XSS | PRD §OWASP Authentication Guidelines (S-007) | | | |
| Login_TC_20 | Rate limiting after repeated failures | Dedicated test account (avoid lockout of shared account) | Given user attempts login with a wrong password repeatedly (≥5 times)<br/>When the system processes the attempts<br/>Then repeated failures are throttled/blocked | Repeated failed attempts throttled/blocked — brute-force protection active (Insufficient information to determine: exact lockout threshold — confirm with PO) | PRD §Rate Limiting (S-004) | | | |
| Login_TC_21 | Lockout feedback after rate limit triggered | Rate limit triggered (see Login_TC_20) | Given the rate limit has been triggered<br/>When user attempts further logins<br/>Then actionable throttling/lockout feedback is shown | User receives actionable feedback about throttling/lockout (Inference (low confidence): message copy — confirm) | PRD §Error Handling (S-008) | | | |
| Login_TC_22 | HTTPS enforcement | Browser allows http attempt | Given user attempts `http://app.vwo.com/#/login`<br/>Then the request is redirected to HTTPS or blocked | All login communications use SSL/TLS; HTTP redirects to HTTPS or is blocked | PRD §HTTPS Enforcement (S-001) | | | |
| Login_TC_23 | Password field masking | Login page open | Given user types in the password field<br/>Then characters are masked (dots)<br/>And no clear-text echo is shown | Password characters masked; no clear-text echo (Inference (low confidence): masking behavior — confirm with build) | PRD §Data Protection (S-003) | | | |
| Login_TC_24 | No clear-text credentials in DOM/network | DevTools capture enabled | Given user performs login while network + DOM are captured<br/>Then the password is never transmitted/stored in clear text<br/>And transmission is encrypted | Password never transmitted/stored in clear text; end-to-end encrypted transmission | PRD §Encryption; §Secure Storage (S-002) | | | |
| Login_TC_25 | Secure session token after login | Successful login completed | Given user logs in successfully<br/>When session token is inspected<br/>Then a secure session token is generated with appropriate attributes (HttpOnly/Secure/SameSite) | Secure session token generated with appropriate attributes; session secured against hijacking (Inference (low confidence): cookie attribute details — confirm) | PRD §Session Security (S-005) | | | |

---

## 3. Traceability Note

- Test Case IDs follow the prompt convention `FeatureName_TC_xx` → `Login_TC_01` … `Login_TC_25` (iterative, no gaps).
- Each case maps to a Test Plan TC ID (F-xxx / S-xxx) and the PRD sections listed in the PRD Trace column.
- All cases are within the login scope defined in Test Plan §1.2. No out-of-scope functionality (dashboard, registration, SSO, 2FA, social login) is covered.

## 4. Self-Validation Check (per Anti-Hallucination Rules)

1. **Verified facts** extracted from `PRD_VWO.md` and `TestPlan_VWO_Login.md` only — no external assumptions promoted to requirements. ✔
2. **Missing/unknown information listed** — password complexity rules, session timeout, lockout threshold, cookie attributes are flagged as `Insufficient information to determine` or `Inference (low confidence)`. ✔
3. **Generated output from provided facts only** — every TC carries a PRD trace. ✔
4. **Self-check for contradictions** — no test case asserts behavior the PRD contradicts; out-of-scope items excluded. ✔

> **Note to QA:** `Actual Result`, `Execution Date`, and `Status` columns are intentionally blank and must be filled by the QA member after completing the testing. Items marked `Insufficient information to determine` / `Inference (low confidence)` must be confirmed with the Product Owner before test execution.
