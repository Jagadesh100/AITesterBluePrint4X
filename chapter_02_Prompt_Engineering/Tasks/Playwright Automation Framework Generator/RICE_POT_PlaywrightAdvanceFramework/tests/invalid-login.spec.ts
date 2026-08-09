import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('VWO Login - Invalid Credentials', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should display an error and not authenticate with invalid credentials', async ({ page }) => {
        await loginPage.login('invalid@example.com', 'Invalid@123');

        await expect(loginPage.getErrorMessage()).toContainText('Your email, password, IP address or location did not match');
        await expect(page).not.toHaveURL(/#\/dashboard/);
    });
});
