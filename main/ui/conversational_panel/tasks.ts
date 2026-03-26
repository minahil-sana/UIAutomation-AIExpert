import { Download, expect, Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import * as conversationalPanelActions from '@ui/conversational_panel/actions';
import * as conversationalPanelAssertions from '@ui/conversational_panel/assertions';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';

function getDownloadsDirectory(): string {
	const homeDir = process.env.USERPROFILE ?? process.env.HOME;
	if (!homeDir) {
		throw new Error('Unable to determine user home directory for Downloads verification.');
	}

	return path.join(homeDir, 'Downloads');
}

async function saveAndVerifyDownload(
	download: Download,
	extension: '.csv' | '.png' | '.zip',
	startedAtMs: number,
): Promise<void> {
	const downloadsDir = getDownloadsDirectory();
	const suggestedFileName = download.suggestedFilename();
	const downloadPath = path.join(downloadsDir, `${Date.now()}-${suggestedFileName}`);
	await download.saveAs(downloadPath);
	
	const stats = await fs.stat(downloadPath);
	const fileExtension = path.extname(downloadPath).toLowerCase();
	const clockToleranceMs = 120000;

	expect(fileExtension).toBe(extension);
	expect(stats.mtimeMs).toBeGreaterThanOrEqual(startedAtMs - clockToleranceMs);
	expect(stats.mtimeMs).toBeLessThanOrEqual(Date.now() + clockToleranceMs);
}


export async function askKnowledgeQuestionAndValidateResponse(page: Page): Promise<void> {
	await conversationalPanelActions.clickEnablementTile(page, 'Knowledge');
	await conversationalPanelActions.clickPromptQuestionByCategoryAndNumber(page, 'Knowledge', 0);
	await conversationalPanelAssertions.verifyResponseGenerated(page);
	await conversationalPanelAssertions.verifyInteractionActionsVisible(page);
}

export async function copyFeedbackAndDeleteLatestInteraction(page: Page, feedbackMessage: string): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await conversationalPanelActions.copyInteractionText(page);
	await expect(locators.copyAlert).toBeVisible();

	await conversationalPanelActions.submitPositiveFeedback(page, feedbackMessage);
	await conversationalPanelAssertions.verifyFeedbackSuccess(page);
	await conversationalPanelActions.deleteInteraction(page);
	await conversationalPanelAssertions.verifyEmptyDefaultScreen(page);
}

export async function askDevicesQuestionAndValidateTable(page: Page): Promise<void> {
	await conversationalPanelActions.clickEnablementTile(page, 'Devices');
	await conversationalPanelActions.clickPromptQuestionByCategoryAndNumber(page, 'Devices', 2);
	await conversationalPanelAssertions.verifyReasoningVisible(page);
	await conversationalPanelAssertions.verifyTableResponseGenerated(page);
    
}

export async function downloadTableCsv(page: Page): Promise<void> {
	await conversationalPanelActions.scrollToConversationBottom(page);
	const startedAtMs = Date.now();
	const download = await conversationalPanelActions.downloadInteractionCsv(page);
	await saveAndVerifyDownload(download, '.csv', startedAtMs);
}

export async function askFollowupAndValidateChart(page: Page, question: string): Promise<void> {
	await conversationalPanelActions.askFollowUpInChat(page, question);
	await conversationalPanelAssertions.verifyChartGenerated(page);
}

export async function switchChartAndDownloadImage(page: Page): Promise<void> {
    await conversationalPanelActions.switchChartTypeToHorizontalBar(page);
	await conversationalPanelAssertions.verifyChartTypeSwitched(page);

	const startedAtMs = Date.now();
	const chartDownload = await conversationalPanelActions.downloadChartImage(page);
	await saveAndVerifyDownload(chartDownload, '.png', startedAtMs);
}

export async function downloadConversation(page: Page): Promise<void> {
	const startedAtMs = Date.now();
	const conversationDownload = await conversationalPanelActions.downloadConversationZip(page);
	await saveAndVerifyDownload(conversationDownload, '.zip', startedAtMs);
}

export async function renameAndDeleteConversation(page: Page, updatedTitle: string): Promise<void> {
	await conversationalPanelActions.renameConversation(page, updatedTitle);
	await conversationalPanelAssertions.verifyConversationTitle(page, updatedTitle);
	await deleteConversation(page);
}

export async function deleteConversation(page: Page): Promise<void> {
    await conversationalPanelActions.openConversationList(page);
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
    await locators.conversationNameButton.hover();
	await locators.conversationDeleteButton.click();
	await locators.deleteConversationConfirmButton.click();
}

