import { Page } from '@playwright/test';
import { clickLogin, fillCredentials } from '@ui/login_page/login_page_actions';

export async function login(page: Page, username: string, password: string): Promise<void> {
	await fillCredentials(page, username, password);
	await clickLogin(page);
}
