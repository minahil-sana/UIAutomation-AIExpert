import { Page } from '@playwright/test';
import { landingPageLocators } from '@ui/landing_page/locators';
import { verifyLandingPageReady } from '@ui/landing_page/assertions';

export async function openWorkspaceLanding(page: Page, workspaceURL: string): Promise<void> {
	if (page.url() !== workspaceURL) {
		await page.goto(workspaceURL, { waitUntil: 'domcontentloaded' });
	}
	await verifyLandingPageReady(page);
}

export async function openAiExpertSidePanel(page: Page): Promise<void> {
	const locators = landingPageLocators;
	await locators.aiExpertLauncherButton(page).click();
}
