import { Locator, Page } from '@playwright/test';

export type LandingPageLocators = {
	workspaceTitle: Locator;
	aiExpertLauncherButton: Locator;
};

export function getLandingPageLocators(page: Page): LandingPageLocators {
	return {
		workspaceTitle: page.getByTestId('dashboard-title').getByText('Workspace'),
		aiExpertLauncherButton: page.getByTestId('side-menu__pendo_AIExpert-btn'),
	};
}
