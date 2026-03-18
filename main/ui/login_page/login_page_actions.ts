import { Page } from '@playwright/test';
import { getLoginPageLocators } from '@ui/login_page/login_page_locators';
import { waitForLoginPageReady } from '@ui/login_page/login_page_assertions';


//! as mentioned in the spec file, dont create seperate action for it, in the login task it should be
//? await page.goto(config.baseURL ) and then fillUsername, fillPasword and click login button in the task file
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


export async function clickLogin(page: Page): Promise<void> {
	const locators = getLoginPageLocators(page);
	await locators.loginButton.click();
}

