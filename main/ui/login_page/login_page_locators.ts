import { Locator, Page } from '@playwright/test';

export type LoginPageLocators = {
	loginForm: Locator;
	usernameInput: Locator;
	passwordInput: Locator;
	loginButton: Locator;
	loginWithSsoButton: Locator;
	forgotPasswordLink: Locator;
};

export function getLoginPageLocators(page: Page): LoginPageLocators {
	return {
		loginForm: page.locator('form.login-form'),

		usernameInput: page.locator('en-text-field.cs-auto-login-email-txt input[type="text"]'),
		passwordInput: page.locator('en-text-field.cs-auto-login-password-txt input[type="password"]'),

		loginButton: page.locator('en-button.cs-auto-login-login-btn'),
		loginWithSsoButton: page.locator('en-button.cs-auto-login-login-sso-btn'),
		forgotPasswordLink: page.locator('en-link.cs-auto-login-forgot-password-btn'),
	};
}
