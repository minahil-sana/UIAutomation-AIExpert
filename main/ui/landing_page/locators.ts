import { Locator, Page } from '@playwright/test';

export const landingPageLocators = {
	getWorkspaceTitle: (page: Page): Locator => page.getByTestId('dashboard-title').getByText('Workspace'),
	getAiExpertLauncherButton: (page: Page): Locator => page.getByTestId('side-menu__pendo_AIExpert-btn'),
};
