import { expect, Page } from '@playwright/test';
import { getLoginPageLocators } from '@ui/login_page/login_page_locators';

export async function waitForLoginPageReady(page: Page): Promise<void> {
	const locators = getLoginPageLocators(page);
	await expect(locators.loginForm).toBeVisible();
	await expect(locators.usernameInput).toBeVisible();
	await expect(locators.passwordInput).toBeVisible();
	await expect(locators.loginButton).toBeVisible();
}
