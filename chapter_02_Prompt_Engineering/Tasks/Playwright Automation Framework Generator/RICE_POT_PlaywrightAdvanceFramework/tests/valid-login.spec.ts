import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_EMAIL: string = '';
const VALID_PASSWORD: string = '';

test.describe('VWO Login - Valid Credentials', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should log in successfully with valid credentials', async ({ page }) => {
        await loginPage.login(VALID_EMAIL, VALID_PASSWORD, true);

        await expect(page).toHaveURL(/#\/dashboard/);
        await expect(page.locator("//a[@id='navbarDropdown']")).toBeVisible();
    });
});
