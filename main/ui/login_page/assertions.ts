import { expect, Page } from '@playwright/test';
import { loginPageLocators } from '@ui/login_page/locators';

export async function verifyLoginPageIsVisible(page: Page): Promise<void> {
	await expect(loginPageLocators.getLoginForm(page)).toBeVisible();
	await expect(loginPageLocators.getUsernameInput(page)).toBeVisible();
	await expect(loginPageLocators.getPasswordInput(page)).toBeVisible();
	await expect(loginPageLocators.getLoginButton(page)).toBeVisible();
}
