# RICE POT Framework — Enterprise Playwright TypeScript Automation

## R — Role

You are a **Senior QA Automation Engineer with 5+ years of experience** specializing in enterprise-level test automation, IT applications, CRM projects, and web application testing.

You have strong expertise in:

* Playwright
* TypeScript
* Enterprise automation framework design
* Page Object Model (POM)
* Scalable and maintainable test architecture
* UI functional and negative testing
* Authentication and login workflows
* Exception handling
* Test setup and teardown
* Reusable automation components
* XPath-based element identification

Your objective is to design and implement an **enterprise-grade Playwright + TypeScript automation framework** for the VWO application login functionality.

---

## I — Instructions

Follow all instructions below strictly.

### Framework Requirements

1. Generate a complete **Playwright + TypeScript** automation implementation following enterprise-level automation standards.
2. Use a clean, modular, reusable, and maintainable framework architecture.
3. Implement the **Page Object Model (POM)** pattern.
4. Create reusable page-level action methods wherever applicable.
5. Maintain consistent naming conventions, structure, readability, and modularity.
6. The generated implementation must be production-oriented and avoid bad coding practices.

### Application Under Test

Automate the VWO login page:

`https://app.vwo.com/#/login`

The login page contains functionality including:

* Email field
* Password field
* Sign-in button
* Remember Me functionality

### Test Coverage

Create exactly **two test scripts**:

1. **Valid Login Test**

   * Verify successful login using valid credentials.
   * Verify relevant successful-login behavior.
   * Verify the expected navigation or post-login state.

2. **Invalid Login Test**

   * Verify login behavior using invalid credentials.
   * Verify the appropriate validation/error message.
   * Verify that the user is not successfully authenticated.

### Locator Requirements

1. **Use XPath locators only.**
2. Do not use CSS selectors.
3. Do not use ID selectors directly.
4. Do not use name selectors directly.
5. Do not use other locator strategies when an XPath-based locator can be used.
6. Keep XPath expressions robust and maintainable.

### Page Object Requirements

Implement the login page using the Page Object Model.

The Page Object must contain:

* Locator definitions
* Constructor initialization
* Reusable action methods
* Login-related operations
* Appropriate validation methods
* Proper Playwright `Page` handling

Use Playwright TypeScript equivalents for PageFactory-style functionality where applicable.

**Important:** Playwright does not provide Selenium's `PageFactory`, `@FindBy`, or `PageFactory.initElements()` mechanism. Do not attempt to implement Selenium-specific APIs in Playwright. Instead, implement the equivalent enterprise-level Page Object structure using Playwright's `Page` and XPath locators.

### Exception Handling

1. Implement robust error handling where appropriate.
2. Use structured `try-catch` blocks when they provide meaningful recovery or diagnostic value.
3. Do not use unnecessary or excessive exception handling.
4. Ensure failures propagate correctly so that Playwright tests are not falsely reported as successful.
5. Page Object and test-level error handling should remain clean and maintainable.

### Test Lifecycle

Use Playwright's native lifecycle mechanisms appropriately, including:

* `test.beforeEach`
* `test.afterEach`
* `test.beforeAll`
* `test.afterAll`

Use only the hooks that are actually required.

Do not use Selenium/TestNG-specific annotations such as:

* `@Test`
* `@BeforeTest`
* `@AfterTest`
* `@BeforeMethod`
* `@AfterMethod`

Use the correct Playwright Test equivalents.

### Synchronization

1. Do not use `Thread.sleep()`.
2. Do not use hard-coded waits.
3. Do not introduce unnecessary timeout-based synchronization.
4. Rely on Playwright's built-in auto-waiting, assertions, and appropriate waiting mechanisms.
5. Use web-first assertions wherever applicable.

### Coding Standards

1. Follow TypeScript best practices.
2. Use strong typing where appropriate.
3. Avoid duplicated code.
4. Create reusable methods for common operations.
5. Keep test scripts focused on test intent.
6. Keep locators and page interactions inside Page Objects wherever appropriate.
7. Keep assertions in the test layer unless there is a strong architectural reason otherwise.
8. Avoid unnecessary abstraction.
9. Do not introduce Selenium WebDriver APIs.
10. Do not introduce Java-specific syntax.
11. Do not introduce TestNG/JUnit annotations.
12. Ensure all generated code is compatible with Playwright Test and TypeScript.

### Output Restrictions

The generated implementation must:

* Contain only runnable code.
* Contain no explanations.
* Contain no comments.
* Contain no dependency installation commands.
* Contain no markdown explanations.
* Contain no `Thread.sleep()`.
* Contain no CSS selectors.
* Contain no Selenium APIs.
* Contain no TestNG APIs.
* Contain no unnecessary code.

---

## C — Context

The application under test is the **VWO A/B Testing platform**.

The automation requirement is specifically focused on the VWO login functionality.

The login workflow consists primarily of:

1. Navigating to the VWO login page.
2. Entering an email address.
3. Entering a password.
4. Optionally interacting with the Remember Me functionality.
5. Clicking the Sign In button.
6. Verifying successful authentication for valid credentials.
7. Verifying appropriate validation/error behavior for invalid credentials.

The framework must be designed so that credentials can be supplied externally rather than hard-coded into the test scripts.

External environments may include:

* Application URLs
* Staging URLs
* Usernames
* Passwords

These values should be consumed through an appropriate configuration/environment mechanism when implemented.

---

## E — Example

The following Selenium example demonstrates the intended Page Object concept:

```java
public class LoginPage {

    @FindBy(xpath = "//input[@id='username']")
    WebElement username;

    @FindBy(xpath = "//input[@id='password']")
    WebElement password;

    @FindBy(xpath = "//input[@id='Login']")
    WebElement loginButton;

    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public void doLogin(String user, String pass) {
        username.sendKeys(user);
        password.sendKeys(pass);
        loginButton.click();
    }
}
```

For this task, **do not reproduce the Selenium implementation**.

Translate the architectural intent into the correct **Playwright + TypeScript Page Object Model**.

Because Playwright does not support Selenium's `PageFactory`, `@FindBy`, or `PageFactory.initElements()`, use Playwright's native `Page` object, XPath locators, constructors, and reusable methods to achieve the equivalent design.

---

## P — Parameters

Generate the solution as a **production-level enterprise automation implementation** with:

* Playwright
* TypeScript
* Playwright Test
* Page Object Model
* XPath-only locators
* Reusable page actions
* Valid login scenario
* Invalid login scenario
* Proper test lifecycle handling
* Web-first assertions
* Robust synchronization
* Appropriate exception handling
* Externalized credentials
* Maintainable architecture
* Clean TypeScript implementation
* Consistent coding standards
* Minimal duplication
* Production-oriented design
* Pinpoint accuracy
* Near-zero bad coding practices

Credentials must **not** be hard-coded into the test scripts.

Assume that external credentials and environment-specific URLs will be supplied through configuration/environment variables.

---

## O — Output

Provide exactly:

1. **One Login Page Object file**
2. **One valid-login test script**
3. **One invalid-login test script**

Total: **3 files only**

Do not provide:

* Framework explanations
* Architecture explanations
* Installation instructions
* Package files
* Configuration files
* Additional utility files
* Comments
* Documentation
* Markdown explanations
* Additional test scripts

The output must contain only the runnable TypeScript source code for the three requested files.

---

## T — Tone

Technical, precise, concise, enterprise-grade, production-oriented, and code-focused.

Prioritize:

* Correctness
* Maintainability
* Scalability
* Reliability
* Readability
* Reusability
* Enterprise automation standards
* Playwright-native implementation
