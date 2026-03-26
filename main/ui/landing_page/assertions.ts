import { expect, Page } from '@playwright/test';
import { landingPageLocators } from '@ui/landing_page/locators';

export async function verifyLandingPageReady(page: Page): Promise<void> {
	const locators = landingPageLocators;

	await page.waitForURL(/st2\.ep1test\.com\/workspace/, {
		timeout: 60000,
	}).catch(() => {
		// Already on workspace, continue
	});

	await Promise.race([
		locators.getWorkspaceTitle(page).waitFor({ state: 'visible', timeout: 45000 }),
		locators.getAiExpertLauncherButton(page).waitFor({ state: 'visible', timeout: 45000 }),
	]);
}

export async function expectAiExpertLauncherVisible(page: Page): Promise<void> {
	const locators = landingPageLocators;
	await expect(locators.getAiExpertLauncherButton(page)).toBeVisible();
}
