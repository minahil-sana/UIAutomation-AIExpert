import { Page } from '@playwright/test';
import * as loginPageActions from '@ui/login_page/actions';
import { verifyLoginPageIsVisible } from '@ui/login_page/assertions';

export async function login(page: Page, username: string, password: string, baseURL: string): Promise<void> {
	await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

	try {
		await verifyLoginPageIsVisible(page);
	} catch {
		return;
	}

	await loginPageActions.fillUsername(page, username);
	await loginPageActions.fillPassword(page, password);
	await loginPageActions.clickLoginButton(page);
}
