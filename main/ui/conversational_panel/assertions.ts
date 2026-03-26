import { expect, Page } from '@playwright/test';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';

export async function verifySidePanelIsVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Panel Layout'].getPanelContainer(page)).toBeVisible();
}

export async function verifyDefaultPanelAndTiles(page: Page, tileNames: string[]): Promise<void> {
	await verifySidePanelIsVisible(page);
	await verifyEmptyDefaultScreen(page);
	await verifyEnablementTilesVisible(page, tileNames);
}

export async function verifyEmptyDefaultScreen(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Panel Layout'].getEmptyStateContainer(page)).toBeVisible();
}

export async function verifyEnablementTilesVisible(page: Page, tileNames: string[]): Promise<void> {
	for (const tileName of tileNames) {
		await expect(conversationalPanelLocators['Panel Layout'].getEnablementTileByName(page, tileName)).toBeVisible({timeout: 15000});
	}
}

export async function verifyInteractionActionsVisible(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, 0)).toBeVisible({ timeout: 45000 });
	await expect(conversationalPanelLocators['Interaction Feedback'].getThumbsUpButton(page)).toBeVisible();
	await expect(conversationalPanelLocators['Interaction Feedback'].getThumbsDownButton(page)).toBeVisible();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
}

export async function verifyFeedbackSuccess(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Feedback'].getFeedbackSuccessToast(page)).toBeVisible();
}

export async function verifyResponseGenerated(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, 0)).toBeVisible({ timeout: 45000 });
}

export async function verifyTableResponseGenerated(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getTableResponseContainer(page)).toBeVisible({ timeout: 60000 });
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click();
	await expect(conversationalPanelLocators['Interaction Actions'].getInteractionDownloadButton(page)).toBeVisible({ timeout: 15000 });
}

export async function verifyReasoningVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Response'].getReasoningStatus(page)).toBeVisible({timeout:15000});
}

export async function verifyChartGenerated(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getChartResponseContainer(page)).toBeVisible({ timeout: 60000 });
	await expect(conversationalPanelLocators['Table and Chart'].getChartOptionsButton(page)).toBeVisible({ timeout: 30000 });
}

export async function verifyChartTypeSwitched(page: Page ): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getHorizontalBarChartSelected(page)).toBeVisible({ timeout: 15000 });
}

export async function verifyConversationTitle(page: Page, title: string): Promise<void> {
	await expect(conversationalPanelLocators['Conversation Header'].getConversationTitle(page)).toContainText(title, {timeout: 15000});
}
