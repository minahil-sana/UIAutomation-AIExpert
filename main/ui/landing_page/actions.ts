import { Page } from '@playwright/test';
import { landingPageLocators } from '@ui/landing_page/locators';

export async function openAiExpertSidePanel(page: Page): Promise<void> {
	await landingPageLocators.getAiExpertLauncherButton(page).click();
}
