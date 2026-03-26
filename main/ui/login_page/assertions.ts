import { expect, Page } from '@playwright/test';
import { loginPageLocators } from '@ui/login_page/locators';

export async function verifyLoginPageReady(page: Page): Promise<void> {
	const locators = loginPageLocators;
	await expect(locators.getLoginForm(page)).toBeVisible();
	await expect(locators.getUsernameInput(page)).toBeVisible();
	await expect(locators.getPasswordInput(page)).toBeVisible();
	await expect(locators.getLoginButton(page)).toBeVisible();
}
