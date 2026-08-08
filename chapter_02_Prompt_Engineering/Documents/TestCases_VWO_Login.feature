@login @regression
Feature: VWO Login
  As a user of the VWO platform
  I want to log in with my email and password
  So that I can securely access the VWO dashboard

  Background:
    Given the user is on the VWO login page "https://app.vwo.com/#/login"
    And the login page displays the email field, password field, submit button and Remember Me checkbox

  # =====================================================================
  # POSITIVE SCENARIOS
  # =====================================================================

  @smoke @TC_F-001
  Scenario: Successful login with valid credentials
    Given the user enters a valid registered email address in the email field
    And the user enters the corresponding valid password in the password field
    When the user clicks the login/submit button
    Then the user is authenticated successfully
    And the user is redirected to the main VWO dashboard
    And a success confirmation is displayed

  @smoke @TC_F-002
  Scenario: Login page loads with VWO branding
    Given the user navigates to "https://app.vwo.com/#/login"
    Then the login page displays the VWO branding
    And the login form is rendered with a modern, minimalist design
    And the email field, password field, submit button and Remember Me checkbox are visible

  @TC_F-003
  Scenario: Auto-focus on first input field
    Given the user navigates to "https://app.vwo.com/#/login"
    When the login page finishes loading
    Then focus is automatically set on the email input field
    And the user can type without an additional click

  @TC_F-004
  Scenario: Loading state displayed during authentication
    Given the user has entered valid credentials in the email and password fields
    When the user clicks the login/submit button
    Then a loading state (spinner/progress indicator) is displayed while authentication is in progress
    And the submit button is disabled to prevent duplicate submissions during processing

  @TC_F-005
  Scenario: Login success event is tracked by analytics
    Given the user enters valid credentials
    When the user successfully logs in
    Then the analytics integration records a login success event

  @TC_F-006
  Scenario: Login failure event is tracked by analytics
    Given the user enters invalid credentials
    When the login attempt fails
    Then the analytics integration records a login failure event

  @TC_F-019
  Scenario: Forgot Password entry point is visible on the login page
    Given the user is on the VWO login page
    Then the Forgot Password link/option is visible on the login page

  @TC_F-020
  Scenario: Forgot Password initiates the password reset flow
    Given the user is on the VWO login page
    When the user clicks the Forgot Password link
    Then the secure token-based password reset flow is initiated
    And the user is presented with email-based recovery options

  @TC_F-030
  Scenario: Session is not persisted when Remember Me is unchecked
    Given the user is on the VWO login page
    And the Remember Me checkbox is unchecked
    When the user logs in with valid credentials
    And the user closes the browser and reopens the login URL
    Then the user is required to re-enter credentials
    And no persistent login session is established

  @smoke @TC_F-030a
  Scenario: Persistent login session when Remember Me is checked
    Given the user is on the VWO login page
    And the Remember Me checkbox is checked
    When the user logs in with valid credentials
    And the user closes the browser and reopens the login URL
    Then the user's session is persisted
    And the user reaches the dashboard without re-entering credentials

  @TC_F-031
  Scenario: Remember Me checkbox is toggleable
    Given the user is on the VWO login page
    When the user checks the Remember Me checkbox
    Then the checkbox is in the checked state
    When the user unchecks the Remember Me checkbox
    Then the checkbox is in the unchecked state
    And the selected state is reflected when the form is submitted

  @TC_F-032
  Scenario: Remember Me persists session after successful login
    Given the user is on the VWO login page
    And the Remember Me checkbox is checked
    When the user logs in with valid credentials
    And the user closes and reopens the browser
    Then the user remains logged in and is taken to the dashboard

  @TC_U-001
  Scenario: Form labels are clickable and focus their input fields
    Given the user is on the VWO login page
    When the user clicks the "Email" label
    Then the email input field receives focus
    When the user clicks the "Password" label
    Then the password input field receives focus

  @TC_U-002
  Scenario: Light and Dark mode options are available on the login page
    Given the user is on the VWO login page
    When the user activates the Dark Mode option
    Then the login page theme changes to Dark Mode
    When the user activates the Light Mode option
    Then the login page theme changes to Light Mode

  @TC_U-003
  Scenario: Login page is consistent with the VWO design system
    Given the user is on the VWO login page
    Then the page design is consistent with the VWO branding and color scheme
    And the page has a professional, trustworthy appearance

  @TC_U-004
  Scenario: Login page is responsive on mobile viewports
    Given the user opens the VWO login page on a mobile viewport
    Then the login form is mobile-optimized with touch-friendly controls
    And the layout displays without horizontal scroll or overflow

  @TC_A-002
  Scenario: Login form is fully keyboard navigable
    Given the user is on the VWO login page
    When the user navigates the login form using only the keyboard
    Then all interactive elements are reachable and operable via keyboard

  @TC_A-003
  Scenario: Login form is usable in high contrast mode
    Given the user enables high contrast mode
    And the user is on the VWO login page
    Then the login form remains legible and usable

  @TC_S-001
  Scenario: Login communications are enforced over HTTPS
    Given the user attempts to access "http://app.vwo.com/#/login"
    When the request is processed
    Then the connection is redirected to HTTPS or blocked
    And all login communications use SSL/TLS encryption

  @TC_S-003
  Scenario: Password input is masked
    Given the user is on the VWO login page
    When the user types a password in the password field
    Then the password characters are masked and not echoed in clear text

  # =====================================================================
  # NEGATIVE SCENARIOS
  # =====================================================================

  @TC_F-010
  Scenario: Real-time validation feedback on field blur
    Given the user is on the VWO login page
    When the user enters an invalid value in the email field
    And the user tabs away from the email field (blur)
    Then validation feedback is displayed immediately

  @TC_F-011
  Scenario: Invalid email format is rejected
    Given the user is on the VWO login page
    When the user enters a malformed email address such as "user@" or "user@@example.com" in the email field
    And the user submits the login form
    Then an email format validation error is displayed
    And the login request is not submitted

  @TC_F-012
  Scenario: Specialized email keyboard is presented on mobile
    Given the user opens the VWO login page on a mobile device
    When the user focuses the email input field
    Then a specialized email keyboard with "@" and "." keys is presented

  @TC_F-013
  Scenario: Password strength visual feedback is displayed
    Given the user is on the VWO login page
    When the user types a password in the password field
    Then visual feedback indicating password strength/requirements is displayed

  @TC_F-014
  Scenario: Incorrect password is rejected with a clear error message
    Given the user is on the VWO login page
    And the user enters a valid registered email address
    And the user enters an incorrect password
    When the user clicks the login/submit button
    Then the user is not authenticated
    And a clear, actionable error message for the failed authentication is displayed
    And the user remains on the login page

  @TC_F-015
  Scenario: Empty fields are rejected on submit
    Given the user is on the VWO login page
    And the email field is empty
    And the password field is empty
    When the user clicks the login/submit button
    Then validation errors are displayed for the email field
    And validation errors are displayed for the password field
    And the login request is not submitted

  @TC_F-016
  Scenario: Whitespace-only credentials are rejected
    Given the user is on the VWO login page
    When the user enters whitespace characters only in the email field
    And the user enters whitespace characters only in the password field
    And the user clicks the login/submit button
    Then the input is treated as invalid and a validation error is displayed

  @TC_F-018
  Scenario: Password below minimum complexity requirement is rejected
    Given the user is on the VWO login page
    And the user enters a valid registered email address
    When the user enters a password below the minimum complexity requirement
    And the user clicks the login/submit button
    Then the password is rejected
    And clear guidance on the password requirements is displayed

  @TC_F-021
  Scenario: Password case sensitivity is enforced
    Given the user is on the VWO login page
    And the user enters a valid registered email address
    When the user enters the password with incorrect letter casing
    And the user clicks the login/submit button
    Then the authentication fails
    And a clear authentication error message is displayed

  @TC_S-004
  Scenario: Rate limiting protects against repeated failed login attempts
    Given the user is on the VWO login page
    And the user enters a valid registered email address
    When the user submits incorrect passwords repeatedly (5 or more attempts)
    Then the repeated login attempts are throttled or blocked
    And brute-force protection is active

  @TC_S-006
  Scenario: Replayed session token does not grant unauthorized access
    Given the user has successfully logged in
    When the session token is captured and replayed from a different context
    Then the replayed token does not grant unauthorized access

  @TC_S-007
  Scenario: SQL injection and XSS payloads are neutralized in credential fields
    Given the user is on the VWO login page
    When the user enters "' OR '1'='1" in the email field
    And the user enters "<script>alert(1)</script>" in the password field
    And the user clicks the login/submit button
    Then the inputs are treated as data, not code
    And no injection or script execution occurs
    And no unauthorized access is granted

  @TC_S-008
  Scenario: Rate limit lockout provides user feedback
    Given the user has triggered the rate limit through repeated failed attempts
    When the rate limit is reached
    Then the user receives actionable feedback about the throttling/lockout

  @TC_P-001
  Scenario: Login page loads within the performance benchmark
    Given the user accesses the VWO login page on a standard connection
    When the page is loaded
    Then the login page loads within 2 seconds
