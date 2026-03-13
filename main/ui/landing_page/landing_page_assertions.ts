import { expect, Page } from '@playwright/test';
import { getLandingPageLocators } from '@ui/landing_page/landing_page_locators';

export async function waitForLandingPageReady(page: Page): Promise<void> {
	const locators = getLandingPageLocators(page);

	// Login can briefly redirect across landing routes before the app shell is stable.
	await page.waitForURL(/st2\.ep1test\.com\/workspace/, {
		timeout: 60000,
	});

	await Promise.race([
		locators.workspaceTitle.waitFor({ state: 'visible', timeout: 45000 }),
		locators.aiExpertLauncherButton.waitFor({ state: 'visible', timeout: 45000 }),
	]);

}

export async function expectAiExpertLauncherVisible(page: Page): Promise<void> {
	const locators = getLandingPageLocators(page);
	await expect(locators.aiExpertLauncherButton).toBeVisible();
}
