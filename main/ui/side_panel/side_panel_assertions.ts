import { expect, Page } from '@playwright/test';
import * as sidePanelLocators from '@ui/side_panel/side_panel_locators';

export async function waitForSidePanelReady(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.panelContainer).toBeVisible();
}

export async function expectEmptyDefaultScreen(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.emptyStateContainer).toBeVisible();
}

export async function expectEnablementTilesVisible(page: Page, tileNames: string[]): Promise<void> {
	for (const tileName of tileNames) {
		await expect(sidePanelLocators.enablementTileByName(page, tileName)).toBeVisible({timeout: 15000});
	}
}

export async function expectInteractionActionsVisible(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.latestResponseMessage.hover();

	await expect(locators.copyInteractionButton(0)).toBeVisible({ timeout: 45000 });
	await expect(locators.thumbsUpButton).toBeVisible();
	await expect(locators.thumbsDownButton).toBeVisible();
    await locators.additionalActions.click();
    await expect(locators.deleteActionButton).toBeVisible();
}

export async function expectFeedbackSuccess(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.feedbackSuccessToast).toBeVisible();
}

export async function expectResponseGenerated(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
    await expect(locators.copyInteractionButton(0)).toBeVisible({ timeout: 45000 });

}

export async function expectTableResponseGenerated(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.tableResponseContainer).toBeVisible({ timeout: 60000 });
    await locators.additionalActions.click();
	await expect(locators.interactionDownloadButton).toBeVisible();
}

export async function expectReasoningVisible(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.reasoningStatus).toBeVisible();
}

export async function expectChartGenerated(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.chartResponseContainer).toBeVisible({ timeout: 60000 });
	await expect(locators.chartOptionsButton).toBeVisible({ timeout: 30000 });
}

export async function expectChartTypeSwitched(page: Page ): Promise<void> {
    const locators = sidePanelLocators.getSidePanelLocators(page);
    await expect(locators.horizontalBarChartSelected).toBeVisible({ timeout: 15000 });
}

export async function expectConversationTitle(page: Page, title: string): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await expect(locators.conversationTitle).toContainText(title, {timeout: 15000});
}
