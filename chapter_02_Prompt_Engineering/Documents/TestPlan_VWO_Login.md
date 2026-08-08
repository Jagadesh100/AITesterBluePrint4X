# Test Plan — VWO Login Dashboard (https://app.vwo.com/#/login)

| | |
|---|---|
| **Document ID** | TP-VWO-LOGIN-001 |
| **Product** | VWO Login Dashboard (app.vwo.com/#/login) |
| **Scope** | Login scenario ONLY (email, password, submit, remember-me) |
| **Based on** | `PRD_VWO.md` (Product Requirements Document: VWO Login Dashboard) |
| **Compliance** | OWASP Authentication Guidelines; GDPR & CCPA; WCAG 2.1 AA |
| **Author** | QA Automation Tester (5 yrs experience) |
| **Version** | 1.0 |
| **Status** | Draft — Ready for Review |

---

## 1. Introduction

### 1.1 Objective
Validate that the VWO login dashboard provides a secure, intuitive, and efficient login experience connecting users to the VWO platform, per the PRD product vision, while meeting enterprise-grade security, performance, accessibility, and compliance standards.

### 1.2 Scope (In-Scope)
This test plan covers **only** the login scenario:
- Email and password authentication flow (PRD §Authentication System – Login Process)
- Remember Me functionality (PRD §Existing Features)
- Field validation and error handling (PRD §User Input Validation)
- Session handling as it pertains to the login handoff (PRD §Login Process)
- Login page performance, security, accessibility, and responsive behavior directly tied to the login form (PRD §Technical/UX Requirements)
- Password reset (Forgot Password) — only as an error-recovery path reachable from the login page (PRD §Error Recovery Flow, §Password Management)

### 1.3 Out of Scope
- Dashboard functionality post-login (VWO Core Platform features, A/B testing, analytics tools)
- Registration / free-trial signup page content
- Full SSO, 2FA, and social login flows — covered only at "entry point exists on login page" level
- Mobile native apps and PWA (Future Enhancements)
- Biometric / adaptive authentication (Future Enhancements)

> Note: Out-of-scope items are listed to define boundaries; no test cases are authored for them.

---

## 2. References & Traceability Source

| Ref | Document |
|---|---|
| [PRD] | `chapter_02_Prompt_Engineering/PRD_VWO.md` |
| [AHR] | `chapter_01_LLM_Basics/Anti-Hallucination.rules.md` |

**Traceability rule:** Every assertion in this plan is traceable to a PRD section. Where the PRD is silent on a detail, the case is labeled **"Insufficient information to determine"** and the tester must confirm with the Product Owner before execution. Inferred behavior is labeled **"Inference (low confidence)"** — do not treat it as a requirement.

---

## 3. Test Environment & Data

### 3.1 Environment
| Component | Specification |
|---|---|
| Browser matrix | Chrome (latest + previous), Firefox (latest), Safari (latest), Edge (latest) — inference for matrix size: verify with project infra |
| Mobile viewports | 375×667 (iPhone SE-class), 390×844 (iPhone 12/13-class), 412×915 (Pixel-class) — Inference (low confidence), confirm device list |
| Network | Standard connection (for 2s load benchmark); throttled 3G for degraded-mode checks |
| Target environment | Production clone / staging build of app.vwo.com — confirm URL availability with project |
| Test data | See §3.2 |

### 3.2 Test Data Requirements
| Data | Purpose | Source |
|---|---|---|
| Valid email + valid password (standard account) | Happy-path login | Provisioned by project team |
| Valid email + invalid password | Negative auth | Test data setup |
| Invalid email format (e.g., `user@`, `user@@x.com`, `user name@x.com`) | Format validation | Test data setup |
| Valid email + incorrect password (repeated 5–10×) | Rate limiting / brute-force | Test data setup |
| Password exactly at min complexity (as defined by PRD's "Enforced security standards" — exact rules to be confirmed with PO) | Boundary validation | Test data setup |
| Special-character / Unicode email addresses (e.g., `+` alias, internationalized) | Format boundary | Test data setup — confirm PRD-supported charset |
| Locked / deactivated account | Recovery-path validation | Provisioned by project team |
| Inactive/free-trial-expired account | Recovery-path validation | Provisioned by project team |

> **Insufficient information to determine:** Exact password complexity rules (min length, required character classes), account lockout threshold, and session timeout duration are not specified in the PRD. Confirm with the Product Owner and record here before test execution.

---

## 4. Test Approach & Strategy

| Aspect | Strategy |
|---|---|
| Functional | Manual + automated (Selenium/Playwright WebDriver) covering positive, negative, and boundary cases |
| Security | OWASP-guided checks for login: HTTPS enforcement, rate limiting, credential handling in DOM/network, session token behavior |
| UI/UX | Visual, loading-state, focus-management, and theme checks per PRD UX requirements |
| Accessibility | WCAG 2.1 AA automated scan (axe) + manual keyboard/ARIA pass |
| Performance | Page load ≤2 s on standard connection; asset optimization sanity check |
| Compatibility | Cross-browser + responsive matrix above |
| Error Handling | All PRD-mandated error paths: failed auth, recovery options, success confirmation |

**Test levels:** System (end-to-end login flow) and UAT (business user acceptance of login UX).

---

## 5. Test Case Specifications

> **TC IDs:** `F` = Functional, `S` = Security, `U` = UI/UX, `A` = Accessibility, `P` = Performance, `C` = Compatibility.
> **Severity:** Critical / High / Medium / Low · **Priority:** P1–P4
> Every case lists its PRD trace.

### 5.1 Functional — Happy Path

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| F-001 | Valid login with correct credentials | 1. Open https://app.vwo.com/#/login 2. Enter valid email 3. Enter valid password 4. Click login/submit | User is authenticated and transitions to the main VWO dashboard; success is clearly confirmed | §Login Process "Email and password-based login"; §User Journey "Dashboard Transition"; §Error Recovery Flow "Success Confirmation" |
| F-002 | Login page loads with branding | 1. Open login URL | Login page displays VWO branding, modern minimalist form, email + password fields, submit button, Remember Me checkbox | §Existing Features (all listed elements) |
| F-003 | Auto-focus on first input field | 1. Open login URL | Focus automatically lands on the email field without user interaction | §User Experience – Auto-focus |
| F-004 | Loading state during submission | 1. Enter valid credentials 2. Submit | Visible loading state (spinner/progress) during authentication processing; no double-submit possible while pending | §User Experience – Loading States |
| F-005 | Login success analytics event | 1. Complete successful login 2. Inspect analytics calls | Login success event is tracked to analytics integration | §Integration – Analytics Integration |
| F-006 | Login failure analytics event | 1. Enter invalid credentials 2. Submit | Login failure event is tracked to analytics integration | §Integration – Analytics Integration |

### 5.2 Functional — Validation & Error Handling

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| F-010 | Real-time validation on blur | 1. Click into email field 2. Type invalid value 3. Tab away (blur) | Validation feedback appears immediately on blur | §User Input Validation – Real-time Validation |
| F-011 | Invalid email format rejected | 1. Enter malformed email (e.g., `user@`, `user@@x.com`) 2. Blur / submit | Email format validation error shown; login not submitted | §User Input Validation – Email Format Verification |
| F-012 | Email format hint for mobile keyboards | 1. Open login on mobile viewport 2. Focus email field | Specialized email keyboard (e.g., `@` and `.` keys) is presented | §User Input Validation – Email Format Verification ("specialized mobile keyboards") |
| F-013 | Password strength visual feedback | 1. Focus password field 2. Type password | Visual feedback indicating password requirements/strength is shown | §User Input Validation – Password Strength Indicators |
| F-014 | Incorrect password rejected with clear error | 1. Valid email + wrong password 2. Submit | Clear, actionable error message for failed authentication; user stays on login page | §User Input Validation – Error Handling; §Error Recovery Flow – Error Identification |
| F-015 | Empty fields on submit | 1. Leave email + password empty 2. Submit | Validation errors shown for both fields; no submission | §User Input Validation – Error Handling (Inference: field-level messaging — confirm copy with PO) |
| F-016 | Whitespace-only email/password | 1. Enter spaces only in both fields 2. Submit | Treated as empty/invalid; validation error displayed (Inference (low confidence) — confirm expected handling) | §User Input Validation |
| F-017 | Password boundary — minimum complexity | 1. Enter password at exact minimum requirements 2. Submit | Accepted (boundary-pass) or rejected with clear guidance (boundary-fail) per confirmed complexity rules | §Password Management – Password Requirements |
| F-018 | Password boundary — below minimum | 1. Enter password below minimum requirements 2. Submit | Rejected with clear guidance on requirements | §Password Management – Password Requirements |
| F-019 | Forgot Password link visible from login | 1. Open login page | Forgot Password / recovery entry point is present | §Password Management – Forgot Password Flow |
| F-020 | Forgot Password initiates reset flow | 1. Click Forgot Password 2. Follow flow | Secure token–based password reset process starts (full flow content not in scope) | §Password Management – Forgot Password Flow; §Error Recovery Flow – Recovery Options |
| F-021 | Case sensitivity of password | 1. Correct email, password with wrong case 2. Submit | Authentication fails with clear error (standard behavior — Inference (low confidence), confirm) | §User Input Validation – Error Handling |

### 5.3 Remember Me

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| F-030 | Remember Me unchecked — session not persisted | 1. Login WITHOUT Remember Me 2. Close browser 3. Reopen login URL | User must re-enter credentials; no persistent login (session-scoped) | §Existing Features – Remember Me; §Login Process – Session Management (Inference: default scope — confirm) |
| F-030a | Remember Me checked — persistent login | 1. Login WITH Remember Me 2. Close browser 3. Reopen login URL | User's session persists; user reaches dashboard without re-entering credentials | §Existing Features – Remember Me ("persistent login sessions"); §User Journey – Quick Access "remembered credentials option" |
| F-031 | Remember Me checkbox state is toggleable | 1. Open login page 2. Check Remember Me 3. Uncheck 4. Re-check | Checkbox toggles state reliably; selection reflected on submit | §Existing Features – Remember Me (Inference: toggle behavior — confirm) |
| F-032 | Remember Me works with valid login | 1. Check Remember Me 2. Login 3. Close/reopen browser | Persistent session honored on next visit | §Existing Features – Remember Me |

### 5.4 Security

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| S-001 | HTTPS enforcement | 1. Attempt http://app.vwo.com/#/login 2. Inspect transport | All login communications use SSL/TLS; HTTP redirects to HTTPS or is blocked | §Technical – HTTPS Enforcement |
| S-002 | No credentials in DOM/logs | 1. Login while capturing network + DOM 2. Inspect payloads | Password never transmitted/stored in clear text; encrypted end-to-end transmission | §Technical – Data Protection – Encryption; §Secure Storage |
| S-003 | Password field masking | 1. Focus password field 2. Type | Characters masked (dots) in the input; no clear-text echo | §Security posture (Inference (low confidence) — masked field standard; confirm with build) |
| S-004 | Rate limiting on repeated failures | 1. Attempt login with wrong password repeatedly (≥5 times) 2. Observe responses | Repeated failed attempts throttled/blocked — brute-force protection active | §Technical – Rate Limiting |
| S-005 | Secure session token on login | 1. Successful login 2. Inspect session cookie/token attributes | Session token generated securely with appropriate flags (HttpOnly/Secure/SameSite) | §Technical – Session Security; §Data Protection – Session Security |
| S-006 | Session hijack resistance (sanity) | 1. Successful login 2. Capture token 3. Replay from another context | Replayed/forged token does not grant unauthorized access | §Security Metrics – "No unauthorized session hijacking incidents" |
| S-007 | No SQLi/XSS in credential fields | 1. Enter `' OR '1'='1` in email, `<script>` in password 2. Submit | Inputs treated as data — no injection execution, no script execution | §Compliance – OWASP Authentication Guidelines; §Data Protection |
| S-008 | Rate limit lockout message | 1. Trigger rate limit 2. Observe UI | User receives actionable feedback about throttling/lockout | §Error Handling – Error Handling (Inference (low confidence): copy to confirm) |
| S-009 | GDPR/CCPA compliance sanity | 1. Inspect login page for consent/privacy notices 2. Review data handling | Login flow respects GDPR/CCPA data handling requirements | §Compliance – GDPR; §Compliance – CCPA |
| S-010 | Audit trail for enterprise login | 1. Verify login events captured for audit | Login attempts logged for enterprise audit requirements | §Compliance – Enterprise Security "audit requirements" |

### 5.5 UI / UX

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| U-001 | Clickable form labels | 1. Click the "Email" label 2. Click the "Password" label | Clicking label focuses its corresponding input field | §User Experience – Clickable Labels |
| U-002 | Light/Dark mode toggle available | 1. Open login page 2. Toggle theme | Light and Dark Mode options visible and functional on login page | §Existing Features – Product Announcements "Light and Dark Mode"; §Branding – Theme Support |
| U-003 | Brand consistency | 1. Visually inspect login page | Design consistent with VWO design system and color scheme | §Branding – Brand Consistency; §Visual Appeal |
| U-004 | Responsive layout on mobile | 1. Open login on mobile viewports | Interface mobile-optimized, touch-friendly controls; no horizontal scroll or overflow | §User Experience – Responsive Design |

### 5.6 Accessibility (WCAG 2.1 AA)

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| A-001 | ARIA labels / screen reader support | 1. Run automated a11y scan 2. Navigate with screen reader (e.g., NVDA/VoiceOver) | All interactive elements (email, password, submit, Remember Me) have correct ARIA labels and roles; screen reader announces fields correctly | §Accessibility – Screen Reader Support |
| A-002 | Full keyboard navigation | 1. Clear mouse 2. Tab through login form | All interactive elements reachable and operable via keyboard only | §Accessibility – Keyboard Navigation |
| A-003 | High contrast mode | 1. Enable high-contrast OS/site setting 2. Inspect login form | Login form remains legible/usable in high contrast mode | §Accessibility – High Contrast Mode |
| A-004 | Focus visibility | 1. Tab through form 2. Observe focus indicator | Visible focus indicator on every interactive element (Inference (low confidence) — WCAG 2.4.7 standard, confirm implementation) | §Accessibility – WCAG 2.1 AA compliance |
| A-005 | Automated WCAG 2.1 AA scan | 1. Run axe (or equivalent) against login page | No critical/serious WCAG 2.1 AA violations on login page | §Compliance – WCAG 2.1 AA |

### 5.7 Performance

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| P-001 | Page load ≤ 2 s | 1. Load login page on standard connection 2. Measure load time | Login page loads within 2 seconds | §Performance – Page Load Speed |
| P-002 | Asset optimization sanity | 1. Inspect page assets | Compressed images; minified CSS/JS in use | §Performance – Asset Optimization |
| P-003 | CDN delivery | 1. Inspect asset origins/headers | Static assets served via CDN | §Performance – CDN Integration |
| P-004 | Degraded network behavior | 1. Throttle to 3G 2. Load + login | Form remains usable; loading states visible; no unhandled errors (Inference (low confidence)) | §User Experience – Loading States |
| P-005 | Concurrency readiness (staging load test) | 1. Execute load test with thousands of simultaneous login attempts (staging only) | No degradation/crash; supports stated concurrency | §Scalability – Concurrent Users; §High Availability |

### 5.8 Compatibility

| TC ID | Test Case | Steps | Expected Result | PRD Trace |
|---|---|---|---|---|
| C-001 | Cross-browser login | 1. Execute F-001 on Chrome, Firefox, Safari, Edge | Login works identically across browsers | §Integration – VWO Core Platform (Inference: matrix size — confirm) |
| C-002 | Mobile viewport login | 1. Execute F-001 on mobile viewports listed in §3.1 | Login functional and touch-friendly on mobile | §User Experience – Responsive Design |

---

## 6. Test Execution Matrix

| Type | TC IDs | Priority | Severity | Automation |
|---|---|---|---|---|
| Smoke | F-001, F-002, F-030a | P1 | Critical | Yes |
| Regression (login) | All F-*, S-001..S-010, U-001..U-004, A-001..A-005 | P1–P2 | High | Yes |
| Boundary | F-015, F-016, F-017, F-018, F-021 | P2 | High | Yes |
| Security | S-001..S-010 | P1 | Critical/High | Partial (S-007, S-002, S-001 automated; S-006 manual) |
| Accessibility | A-001..A-005 | P2 | Medium | A-005 automated; A-001..A-004 manual |
| Performance | P-001..P-005 | P2 | High | P-001, P-005 automated; rest manual |
| Compatibility | C-001, C-002 | P3 | Medium | C-001 automated; C-002 manual |
| UX/Visual | U-001..U-004 | P3 | Low/Medium | Manual |

---

## 7. Entry Criteria

- Build of the login page deployed to test/staging environment; URL reachable
- Test data from §3.2 provisioned (valid account, negative data, locked account)
- PRD confirmed as source of truth; open "Insufficient information" items resolved or logged with PO
- Test environment (browsers, viewports, network profiles) available per §3.1

## 8. Exit Criteria

- 100% of P1 and P2 test cases executed; 0 open Critical/High defects
- All blockers resolved; all defects triaged with severity and owner
- No open security findings of Critical/High severity (S-001..S-010)
- WCAG 2.1 AA scan: no critical/serious violations
- Test summary report produced with traceability to PRD

---

## 9. Risks & Assumptions

| Risk / Assumption | Impact | Mitigation |
|---|---|---|
| **Insufficient information to determine:** exact password complexity rules | Boundary cases F-017/F-018 may not match implementation | Confirm rules with PO and record before execution |
| **Insufficient information to determine:** session timeout duration, lockout threshold | Session/rate-limit assertions approximate | Confirm with PO; parameterize tests |
| **Inference (low confidence):** browser matrix, viewport list, cookie flags, masking behavior, case-sensitivity handling | Some assertions are standards-based, not PRD-verified | Flag as inferences; verify against actual build during test prep |
| Production environment instability | Performance benchmarks skewed | Run P-tests on staging with controlled network |
| Rate limiting tests could affect shared test account | Lockout risk | Use dedicated test accounts; coordinate with team |

---

## 10. Self-Validation Check (per Anti-Hallucination Rules)

1. **Extracted verifiable facts** from `PRD_VWO.md` only — no external assumptions promoted to requirements. ✔
2. **Missing/unknown information listed** — password complexity, session timeout, lockout threshold, browser matrix details. ✔
3. **Generated output from PRD facts only** — every TC carries a PRD trace; inference items labeled `Inference (low confidence)`. ✔
4. **Self-check for contradictions** — no test case asserts behavior the PRD contradicts; out-of-scope items clearly bounded. ✔

> **Note to Reviewer:** Any assertion marked "Inference (low confidence)" or "Insufficient information to determine" must be confirmed with the Product Owner before this plan is baselined. Per the Anti-Hallucination rules, do not promote unverified details to requirements.
