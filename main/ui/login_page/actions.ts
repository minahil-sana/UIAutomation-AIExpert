import { Page } from '@playwright/test';
import { loginPageLocators } from '@ui/login_page/locators';
import { clickElement, typeText } from '@utils/browser_actions.utils';

export async function fillUsername(page: Page, username: string): Promise<void> {
	await typeText(loginPageLocators.getUsernameInput(page), username, 'Fill username');
}

export async function fillPassword(page: Page, password: string): Promise<void> {
	await typeText(loginPageLocators.getPasswordInput(page), password, 'Fill password');
}

export async function clickLoginButton(page: Page): Promise<void> {
	await clickElement(loginPageLocators.getLoginButton(page), 'Click login button');
}

