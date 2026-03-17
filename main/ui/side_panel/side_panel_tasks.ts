import { Download, expect, Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import * as sidePanelActions from '@ui/side_panel/side_panel_actions';
import * as sidePanelAssertions from '@ui/side_panel/side_panel_assertions';
import * as sidePanelLocators from '@ui/side_panel/side_panel_locators';

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
	await sidePanelActions.clickEnablementTile(page, 'Knowledge');
	await sidePanelActions.clickPromptQuestionByKnowledge(page);
	await sidePanelAssertions.expectResponseGenerated(page);
	await sidePanelAssertions.expectInteractionActionsVisible(page);
}

export async function copyFeedbackAndDeleteLatestInteraction(page: Page, feedbackMessage: string): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
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
	await sidePanelActions.scrollToConversationBottom(page);
	const startedAtMs = Date.now();
	const download = await sidePanelActions.downloadInteractionCsv(page);
	await saveAndVerifyDownload(download, '.csv', startedAtMs);
}

export async function askFollowupAndValidateChart(page: Page, question: string): Promise<void> {
	await sidePanelActions.askFollowUpInChat(page, question);
	await sidePanelAssertions.expectChartGenerated(page);
}

export async function switchChartAndDownloadImage(page: Page): Promise<void> {
    await sidePanelActions.switchChartTypeToHorizontalBar(page);
    await sidePanelAssertions.expectChartTypeSwitched(page);

	const startedAtMs = Date.now();
	const chartDownload = await sidePanelActions.downloadChartImage(page);
	await saveAndVerifyDownload(chartDownload, '.png', startedAtMs);
}

export async function downloadConversation(page: Page): Promise<void> {
	const startedAtMs = Date.now();
	const conversationDownload = await sidePanelActions.downloadConversationZip(page);
	await saveAndVerifyDownload(conversationDownload, '.zip', startedAtMs);
}

export async function renameAndDeleteConversation(page: Page, updatedTitle: string): Promise<void> {
	await sidePanelActions.renameConversation(page, updatedTitle);
	await sidePanelAssertions.expectConversationTitle(page, updatedTitle);
	await sidePanelActions.deleteConversation(page);
}

