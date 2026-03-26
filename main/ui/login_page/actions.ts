import { Page } from '@playwright/test';
import { loginPageLocators } from '@ui/login_page/locators';
import { clickElement, typeText } from '@utils/browser_actions.utils';

export async function fillUsername(page: Page, username: string): Promise<void> {
	const locators = loginPageLocators;
	await typeText(locators.getUsernameInput(page), username, 'Fill username');
}

export async function fillPassword(page: Page, password: string): Promise<void> {
	const locators = loginPageLocators;
	await typeText(locators.getPasswordInput(page), password, 'Fill password');
}

export async function clickLoginButton(page: Page): Promise<void> {
	const locators = loginPageLocators;
	await clickElement(locators.getLoginButton(page), 'Click login button');
}

