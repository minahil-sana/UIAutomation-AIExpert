import { Page } from '@playwright/test';
import { getLandingPageLocators } from '@ui/landing_page/landing_page_locators';
import { expectAiExpertLauncherVisible } from '@ui/landing_page/landing_page_assertions';
import { waitForLandingPageReady } from '@utils/browser_actions.utils'; 

export async function openWorkspaceLanding(page: Page): Promise<void> {
	await page.goto('https://st2.ep1test.com/workspace', { waitUntil: 'domcontentloaded' }); //! why are we hitting links directly(its not a good practice)
	await waitForLandingPageReady(page); //! Its not a browser action util file
}

export async function openAiExpertSidePanel(page: Page): Promise<void> {
	await expectAiExpertLauncherVisible(page); //! click already checks for visibility, so no need to check it separately in assertion file, we can directly click here and if its not visible test will fail with proper error message
	const locators = getLandingPageLocators(page);
	await locators.aiExpertLauncherButton.click();
}
