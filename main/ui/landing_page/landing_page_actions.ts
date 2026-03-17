import { Page } from '@playwright/test';
import { getLandingPageLocators } from '@ui/landing_page/landing_page_locators';
import { expectAiExpertLauncherVisible } from '@ui/landing_page/landing_page_assertions';
import { waitForLandingPageReady } from '@utils/browser_actions.utils'; 

export async function openWorkspaceLanding(page: Page): Promise<void> {
	await page.goto('https://st2.ep1test.com/workspace', { waitUntil: 'domcontentloaded' });
	await waitForLandingPageReady(page);
}

export async function openAiExpertSidePanel(page: Page): Promise<void> {
	await expectAiExpertLauncherVisible(page);
	const locators = getLandingPageLocators(page);
	await locators.aiExpertLauncherButton.click();
}
