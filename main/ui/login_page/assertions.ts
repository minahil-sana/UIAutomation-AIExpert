import { expect, Page } from '@playwright/test';
import { loginPageLocators } from '@ui/login_page/locators';

export async function verifyLoginPageReady(page: Page): Promise<void> {
	const locators = loginPageLocators;
	await expect(locators.loginForm(page)).toBeVisible();
	await expect(locators.usernameInput(page)).toBeVisible();
	await expect(locators.passwordInput(page)).toBeVisible();
	await expect(locators.loginButton(page)).toBeVisible();
}
