import { Locator, Page } from '@playwright/test';

export const loginPageLocators =  {
	getLoginForm: (page: Page): Locator => page.locator('form.login-form'),

	getUsernameInput: (page: Page): Locator => page.locator('en-text-field.cs-auto-login-email-txt input[type="text"]'),
	getPasswordInput: (page: Page): Locator => page.locator('en-text-field.cs-auto-login-password-txt input[type="password"]'),

	getLoginButton: (page: Page): Locator => page.locator('en-button.cs-auto-login-login-btn'),
};

