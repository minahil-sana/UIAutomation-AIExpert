import { Page } from '@playwright/test';
import * as loginPageActions from '@ui/login_page/login_page_actions';

//! dont create fillCredentials function seperately add fillUsername and fillPassword in this function
export async function login(page: Page, username: string, password: string): Promise<void> {
	await fillCredentials(page, username, password);
	await loginPageActions.clickLogin(page);
}

export async function fillCredentials(page: Page, username: string, password: string): Promise<void> {
	await loginPageActions.fillUsername(page, username);
	await loginPageActions.fillPassword(page, password);
}