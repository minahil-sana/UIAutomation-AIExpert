import { Page } from '@playwright/test';
import { getLoginPageLocators } from '@ui/login_page/login_page_locators';
import { waitForLoginPageReady } from '@ui/login_page/login_page_assertions';

export async function openLoginPage(page: Page): Promise<void> {
	await page.goto('https://st2.sso.xcloudiq.com/ws-login/', { waitUntil: 'domcontentloaded' });
	await waitForLoginPageReady(page);
}

export async function fillUsername(page: Page, username: string): Promise<void> {
	const locators = getLoginPageLocators(page);
	await locators.usernameInput.fill(username);
}

export async function fillPassword(page: Page, password: string): Promise<void> {
	const locators = getLoginPageLocators(page);
	await locators.passwordInput.fill(password);
}

export async function fillCredentials(page: Page, username: string, password: string): Promise<void> {
	await fillUsername(page, username);
	await fillPassword(page, password);
}

export async function clickLogin(page: Page): Promise<void> {
	const locators = getLoginPageLocators(page);
	await locators.loginButton.click();
}

export async function clickLoginWithSso(page: Page): Promise<void> {
	const locators = getLoginPageLocators(page);
	await locators.loginWithSsoButton.click();
}

export async function clickForgotPassword(page: Page): Promise<void> {
	const locators = getLoginPageLocators(page);
	await locators.forgotPasswordLink.click();
}
