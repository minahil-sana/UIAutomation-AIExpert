import { Locator, Page } from '@playwright/test';

export const landingPageLocators = {
	workspaceTitle: (page: Page): Locator => page.getByTestId('dashboard-title').getByText('Workspace'),
	aiExpertLauncherButton: (page: Page): Locator => page.getByTestId('side-menu__pendo_AIExpert-btn'),
};
