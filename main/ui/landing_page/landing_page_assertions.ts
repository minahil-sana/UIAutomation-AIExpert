import { expect, Page } from '@playwright/test';
import { getLandingPageLocators } from '@ui/landing_page/landing_page_locators';


export async function expectAiExpertLauncherVisible(page: Page): Promise<void> {
	const locators = getLandingPageLocators(page);
	await expect(locators.aiExpertLauncherButton).toBeVisible();
}
