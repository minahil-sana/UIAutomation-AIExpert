import { Page } from '@playwright/test';
import { loginPageLocators } from '@ui/login_page/locators';
import { clickElement, typeText } from '@utils/browser_actions.utils';

export async function fillUsername(page: Page, username: string): Promise<void> {
	const locators = loginPageLocators;
	await typeText(locators.usernameInput(page), username, 'Fill username');
}

export async function fillPassword(page: Page, password: string): Promise<void> {
	const locators = loginPageLocators;
	await typeText(locators.passwordInput(page), password, 'Fill password');
}

export async function clickLogin(page: Page): Promise<void> {
	const locators = loginPageLocators;
	await clickElement(locators.loginButton(page), 'Click login button');
}

