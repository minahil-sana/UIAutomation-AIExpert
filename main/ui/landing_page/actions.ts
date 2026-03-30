import { Page } from '@playwright/test';
import { landingPageLocators } from '@ui/landing_page/locators';
import { clickElement } from '@utils/browser_actions.utils';

export async function openAiExpertSidePanel(page: Page): Promise<void> {
	await clickElement(landingPageLocators.getAiExpertLauncherButton(page), 'Open AI Expert side panel');
}
