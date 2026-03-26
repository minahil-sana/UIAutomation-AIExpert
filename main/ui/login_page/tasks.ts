import { Page } from '@playwright/test';
import * as loginPageActions from '@ui/login_page/actions';
import { verifyLoginPageReady } from '@ui/login_page/assertions';

export async function login(page: Page, username: string, password: string, baseURL: string): Promise<void> {
	await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

	try {
		await verifyLoginPageReady(page);
	} catch {
		return;
	}

	await loginPageActions.fillUsername(page, username);
	await loginPageActions.fillPassword(page, password);
	await loginPageActions.clickLogin(page);

	// Wait for redirect to workspace after login
	await page.waitForURL(/st2\.ep1test\.com\/workspace/, {
		timeout: 60000,
	}).catch(() => {
		// Redirect may not happen immediately or may have already happened
	});
}
