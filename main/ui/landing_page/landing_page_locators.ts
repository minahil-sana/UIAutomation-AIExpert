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

//? We create locators for elements like this (where each locator is a function)
export const getWorkspaceTitle=(page: Page): Locator => {
	return page.getByTestId('dashboard-title').getByText('Workspace');
}

export const getAIExpertButton=(page: Page): Locator => {
	return page.getByTestId('side-menu__pendo_AIExpert-btn');
}

//? or like this (where json object is created with all the locators and exported directly)
export const createNewCanvasLocators = {
  Header: {
    getCanvasTitle: (page: Page): Locator => page.getByTestId
    ('dashboard-title').locator('.title-wrapper'),
    getPublishUnpublishButton: (page: Page): Locator => page.locator('[data-testid*="dashboard-publish"] button'),
    getLiveLabel: (page: Page): Locator => page.locator('.live-text-wrapper:has-text("Live")'),
    getPublishUnpublishButtonText: (page: Page): Locator => page.locator('[data-testid*="dashboard-publish"]')
  },
  'Chat Header': {
    getConvertToCanvasButton: (page: Page): Locator => page.locator('.pendo-convert-to-dashboard-btn button'),
    getConvertToCanvasButtonTooltip: (page: Page): Locator =>
      page
        .locator('.is-ai-expert-open.conversation-selected')
        .getByText('You have reached the limit of 10 draft canvases. Delete one to create a new canvas.')
  },
};


//! Combining both approaches will make code look messy