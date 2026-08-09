import { Locator, Page } from '@playwright/test';

export class LoginPage {
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly signInButton: Locator;
    private readonly rememberMeCheckbox: Locator;
    private readonly errorNotification: Locator;

    constructor(private readonly page: Page) {
        this.emailField = page.locator("//input[@id='login-username']");
        this.passwordField = page.locator("//input[@id='login-password']");
        this.signInButton = page.locator("//button[@id='js-login-btn']");
        this.rememberMeCheckbox = page.locator("//input[@id='login-remember-me']");
        this.errorNotification = page.locator("//div[@id='js-notification-box-msg']");
    }

    async goto(): Promise<void> {
        await this.page.goto('/#/login');
    }

    async enterEmail(email: string): Promise<void> {
        await this.emailField.fill(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordField.fill(password);
    }

    async setRememberMe(): Promise<void> {
        if (!(await this.rememberMeCheckbox.isChecked())) {
            await this.rememberMeCheckbox.check();
        }
    }

    async clickSignIn(): Promise<void> {
        await this.signInButton.click();
    }

    async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
        await this.enterEmail(email);
        await this.enterPassword(password);
        if (rememberMe) {
            await this.setRememberMe();
        }
        await this.clickSignIn();
    }

    async getErrorMessage(): Promise<string> {
        return this.errorNotification.textContent() ?? '';
    }

    async isErrorNotificationVisible(): Promise<boolean> {
        return this.errorNotification.isVisible();
    }
}
