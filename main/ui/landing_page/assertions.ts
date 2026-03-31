import { expect, Page } from '@playwright/test';
import { landingPageLocators } from '@ui/landing_page/locators';

export async function verifyLandingPageReady(page: Page): Promise<void> {
	await page.waitForURL(/st2\.ep1test\.com\/workspace/, {
		timeout: 60000,
	}).catch(() => {
		// Already on workspace, continue
	});
	await Promise.race([
		landingPageLocators.getWorkspaceTitle(page).waitFor({ state: 'visible', timeout: 45000 }),
		landingPageLocators.getAiExpertLauncherButton(page).waitFor({ state: 'visible', timeout: 45000 }),
	]);
}

export async function verifyAiExpertLauncherVisible(page: Page): Promise<void> {
	await expect(landingPageLocators.getAiExpertLauncherButton(page)).toBeVisible();
}
