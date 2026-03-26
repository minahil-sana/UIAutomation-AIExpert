import { expect, Page } from '@playwright/test';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';


export async function verifySidePanelReady(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.panelContainer).toBeVisible();
}

export async function verifyDefaultPanelAndTiles(page: Page, tileNames: string[]): Promise<void> {
	await verifySidePanelReady(page);
	await verifyEmptyDefaultScreen(page);
	await verifyEnablementTilesVisible(page, tileNames);
}


export async function verifyEmptyDefaultScreen(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.emptyStateContainer).toBeVisible();
}

export async function verifyEnablementTilesVisible(page: Page, tileNames: string[]): Promise<void> {
	for (const tileName of tileNames) {
		await expect(conversationalPanelLocators.enablementTileByName(page, tileName)).toBeVisible({timeout: 15000});
	}
}

export async function verifyInteractionActionsVisible(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.latestResponseMessage.hover();

	await expect(locators.copyInteractionButton(0)).toBeVisible({ timeout: 45000 });
	await expect(locators.thumbsUpButton).toBeVisible();
	await expect(locators.thumbsDownButton).toBeVisible();
	await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });
}

export async function verifyFeedbackSuccess(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.feedbackSuccessToast).toBeVisible();
}

export async function verifyResponseGenerated(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.copyInteractionButton(0)).toBeVisible({ timeout: 45000 });

}

export async function verifyTableResponseGenerated(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.tableResponseContainer).toBeVisible({ timeout: 60000 });
	await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });
	await locators.additionalActionsTrigger.click();
	await expect(locators.interactionDownloadButton).toBeVisible({ timeout: 15000 });
}

export async function verifyReasoningVisible(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.reasoningStatus).toBeVisible({timeout:15000});
}

export async function verifyChartGenerated(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.chartResponseContainer).toBeVisible({ timeout: 60000 });
	await expect(locators.chartOptionsButton).toBeVisible({ timeout: 30000 });
}

export async function verifyChartTypeSwitched(page: Page ): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.horizontalBarChartSelected).toBeVisible({ timeout: 15000 });
}

export async function verifyConversationTitle(page: Page, title: string): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await expect(locators.conversationTitle).toContainText(title, {timeout: 15000});
}
