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
	await conversationalPanelActions.copyInteractionText(page);
	await expect(conversationalPanelLocators['Interaction Feedback'].getCopyAlert(page)).toBeVisible();
	await submitPositiveFeedback(page, feedbackMessage);
	await conversationalPanelAssertions.verifyFeedbackSuccess(page);
	await deleteInteraction(page);
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
	const download = await downloadInteractionCsv(page);
	await saveAndVerifyDownload(download, '.csv', startedAtMs);
}

export async function askFollowupAndValidateChart(page: Page, question: string): Promise<void> {
	await askFollowUpInChat(page, question);
	await conversationalPanelAssertions.verifyChartGenerated(page);
}

export async function switchChartAndDownloadImage(page: Page): Promise<void> {
    await switchChartTypeToHorizontalBar(page);
	await conversationalPanelAssertions.verifyChartTypeSwitched(page);
	const startedAtMs = Date.now();
	const chartDownload = await downloadChartImage(page);
	await saveAndVerifyDownload(chartDownload, '.png', startedAtMs);
}

export async function downloadConversation(page: Page): Promise<void> {
	const startedAtMs = Date.now();
	const conversationDownload = await downloadConversationZip(page);
	await saveAndVerifyDownload(conversationDownload, '.zip', startedAtMs);
}

export async function renameAndDeleteConversation(page: Page, updatedTitle: string): Promise<void> {
	await renameConversation(page, updatedTitle);
	await conversationalPanelAssertions.verifyConversationTitle(page, updatedTitle);
	await conversationalPanelActions.openConversationList(page);
	await deleteConversation(page);
}

export async function deleteConversation(page: Page): Promise<void> {
    await conversationalPanelActions.openConversationList(page);
	await conversationalPanelLocators['Conversation History'].getConversationNameButton(page).hover();
	await conversationalPanelLocators['Conversation History'].getConversationDeleteButton(page).click();
	await conversationalPanelLocators['Confirmation Modals'].getDeleteConversationConfirmButton(page).click();
}

export async function submitPositiveFeedback(page: Page, additionalFeedback: string): Promise<void> {
	await conversationalPanelActions.openFeedbackModal(page);
	await conversationalPanelLocators['Interaction Feedback'].getFeedbackAccurateOption(page).click();
	await conversationalPanelLocators['Interaction Feedback'].getFeedbackLabelInput(page).fill(additionalFeedback);
	await conversationalPanelLocators['Interaction Feedback'].getFeedbackSubmitButton(page).click();
}

export async function deleteInteraction(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click();
	await expect(conversationalPanelLocators['Interaction Actions'].getDeleteActionButton(page)).toBeVisible({ timeout: 15000 });
	await conversationalPanelLocators['Interaction Actions'].getDeleteActionButton(page).click();
	await conversationalPanelLocators['Confirmation Modals'].getDeleteInteractionConfirmButton(page).click();
}

export async function downloadChartImage(page: Page): Promise<Download> {
	await conversationalPanelLocators.getLatestResponseMessage(page).scrollIntoViewIfNeeded();
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		(async () => {
			await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click({ force: true });
			await conversationalPanelLocators['Interaction Actions'].getInteractionDownloadButton(page).dispatchEvent('click');
		})(),
	]);
	return download;
}

export async function downloadInteractionCsv(page: Page) {
	await conversationalPanelLocators.getLatestResponseMessage(page).scrollIntoViewIfNeeded();
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        (async () => {
			await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click({ force: true });
			await conversationalPanelLocators['Interaction Actions'].getInteractionDownloadButton(page).dispatchEvent('click');
        })(),
    ]);
    return download;
}

export async function askFollowUpInChat(page: Page, prompt: string): Promise<void> {
	await conversationalPanelLocators['Chat Input'].getChatInput(page).fill(prompt);
	await conversationalPanelLocators['Chat Input'].getChatInput(page).press('Enter');
}

export async function switchChartTypeToHorizontalBar(page: Page): Promise<void> {
	await conversationalPanelLocators['Table and Chart'].getChartOptionsButton(page).click();
	await conversationalPanelLocators['Table and Chart'].getHorizontalBarChartOption(page).click();
}

export async function downloadConversationZip(page: Page): Promise<Download> {
	await conversationalPanelLocators.getLatestResponseMessage(page).scrollIntoViewIfNeeded();
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		(async () => {
			await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click({ force: true });
			await conversationalPanelLocators['Conversation Header'].getConversationDownloadButton(page).dispatchEvent('click');
		})(),
	]);
	return download;
}

export async function renameConversation(page: Page, updatedTitle: string): Promise<void> {
	await conversationalPanelActions.openConversationList(page);
	await conversationalPanelLocators['Conversation History'].getConversationNameButton(page).hover();
	await conversationalPanelLocators['Conversation History'].getConversationRenameButton(page).click();
	await conversationalPanelLocators['Conversation History'].getConversationRenameInput(page).fill(updatedTitle);
	await conversationalPanelLocators['Conversation History'].getConversationRenameInput(page).press('Enter');
}

export async function openInteractionActions(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click();
}