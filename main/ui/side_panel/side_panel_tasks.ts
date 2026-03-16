import { expect, Page } from '@playwright/test';
import * as sidePanelActions from '@ui/side_panel/side_panel_actions';
import * as sidePanelAssertions from '@ui/side_panel/side_panel_assertions';
import { getSidePanelLocators } from '@ui/side_panel/side_panel_locators';

export async function expectSidePanelReady(page: Page): Promise<void> {
	await sidePanelAssertions.waitForSidePanelReady(page);
}

export async function validateDefaultPanelAndTiles(page: Page, tileNames: string[]): Promise<void> {
	await sidePanelAssertions.waitForSidePanelReady(page);
	await sidePanelAssertions.expectEmptyDefaultScreen(page);
	await sidePanelAssertions.expectEnablementTilesVisible(page, tileNames);
}

export async function askKnowledgeQuestionAndValidateResponse(page: Page): Promise<void> {
	await sidePanelActions.clickEnablementTile(page, 'Knowledge');
	await sidePanelActions.clickPromptQuestionByKnowledge(page);
	await sidePanelAssertions.expectResponseGenerated(page);
	await sidePanelAssertions.expectInteractionActionsVisible(page);
}

export async function copyFeedbackAndDeleteLatestInteraction(page: Page, feedbackMessage: string): Promise<void> {
	const locators = getSidePanelLocators(page);
	await sidePanelActions.copyInteractionText(page);
	await expect(locators.copyAlert).toBeVisible();

	await sidePanelActions.submitPositiveFeedback(page, feedbackMessage);
	await sidePanelAssertions.expectFeedbackSuccess(page);
	await sidePanelActions.deleteInteraction(page);
	await sidePanelAssertions.expectEmptyDefaultScreen(page);
}

export async function askDevicesQuestionAndValidateTable(page: Page): Promise<void> {
	await sidePanelActions.clickEnablementTile(page, 'Devices');
	await sidePanelActions.clickPromptQuestionByDevices(page);
	await sidePanelAssertions.expectReasoningVisible(page);
	await sidePanelAssertions.expectTableResponseGenerated(page);
}

export async function downloadTableCsv(page: Page): Promise<void> {
	const download = await sidePanelActions.downloadInteractionCsv(page);
	expect(await download.suggestedFilename()).toContain('.csv');
}

export async function askFollowupAndValidateChart(page: Page, question: string): Promise<void> {
	await sidePanelActions.askFollowUpInChat(page, question);
	await sidePanelAssertions.expectChartGenerated(page);
}

export async function switchChartAndDownloadImage(page: Page): Promise<void> {
    await sidePanelActions.switchChartTypeToHorizontalBar(page);
    await sidePanelAssertions.expectChartTypeSwitched(page);
    // await sidePanelActions.downloadChartImage(page);
}

export async function downloadConversation(page: Page): Promise<void> {
	const conversationZip = await sidePanelActions.downloadConversationZip(page);
	expect(await conversationZip.suggestedFilename()).toContain('.zip');
}

export async function renameAndDeleteConversation(page: Page, updatedTitle: string): Promise<void> {
	await sidePanelActions.renameConversation(page, updatedTitle);
	await sidePanelAssertions.expectConversationTitle(page, updatedTitle);
	await sidePanelActions.deleteConversation(page);
}
