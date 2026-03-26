import { Locator, Page } from '@playwright/test';

export const loginPageLocators =  {
	loginForm: (page: Page): Locator => page.locator('form.login-form'),

	usernameInput: (page: Page): Locator => page.locator('en-text-field.cs-auto-login-email-txt input[type="text"]'),
	passwordInput: (page: Page): Locator => page.locator('en-text-field.cs-auto-login-password-txt input[type="password"]'),

	loginButton: (page: Page): Locator => page.locator('en-button.cs-auto-login-login-btn'),
	loginWithSsoButton: (page: Page): Locator => page.locator('en-button.cs-auto-login-login-sso-btn'),
	forgotPasswordLink: (page: Page): Locator => page.locator('en-link.cs-auto-login-forgot-password-btn'),
	
};

