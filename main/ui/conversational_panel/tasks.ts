import { Download, expect, Page } from '@playwright/test';
import * as conversationalPanelActions from '@ui/conversational_panel/actions';
import * as conversationalPanelAssertions from '@ui/conversational_panel/assertions';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';
import { clickElement, typeText } from '@utils/browser_actions.utils';

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

export async function downloadTableCsv(page: Page): Promise<Download> {
	await conversationalPanelActions.scrollToConversationBottom(page);
	return downloadInteractionCsv(page);
}

export async function askFollowupAndValidateChart(page: Page, question: string): Promise<void> {
	await askFollowUpInChat(page, question);
	await conversationalPanelAssertions.verifyChartGenerated(page);
}

export async function downloadConversation(page: Page): Promise<Download> {
	return downloadConversationZip(page);
}

export async function renameAndVerifyConversation(page: Page, updatedTitle: string): Promise<void> {
	await renameConversation(page, updatedTitle);
	await conversationalPanelAssertions.verifyConversationTitle(page, updatedTitle);
}

export async function deleteAndVerifyConversation(page: Page): Promise<void> {
	await conversationalPanelActions.openConversationList(page);
	await deleteConversation(page);
	await conversationalPanelAssertions.verifyEmptyDefaultScreen(page);
}

export async function deleteConversation(page: Page): Promise<void> {
    await conversationalPanelActions.openConversationList(page);
	await conversationalPanelLocators['Conversation History'].getConversationNameButton(page).hover();
	await clickElement(
		conversationalPanelLocators['Conversation History'].getConversationDeleteButton(page),
		'Click delete conversation button',
	);
	await clickElement(
		conversationalPanelLocators['Confirmation Modals'].getDeleteConversationConfirmButton(page),
		'Confirm delete conversation',
	);
}

export async function submitPositiveFeedback(page: Page, additionalFeedback: string): Promise<void> {
	await conversationalPanelActions.openFeedbackModal(page);
	await clickElement(
		conversationalPanelLocators['Interaction Feedback'].getFeedbackAccurateOption(page),
		'Select feedback accurate option',
	);
	await typeText(
		conversationalPanelLocators['Interaction Feedback'].getFeedbackLabelInput(page),
		additionalFeedback,
		'Type additional feedback',
	);
	await clickElement(
		conversationalPanelLocators['Interaction Feedback'].getFeedbackSubmitButton(page),
		'Submit interaction feedback',
	);
}

export async function deleteInteraction(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await clickElement(
		conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page),
		'Open additional interaction actions',
	);
	await expect(conversationalPanelLocators['Interaction Actions'].getDeleteActionButton(page)).toBeVisible({ timeout: 15000 });
	await clickElement(
		conversationalPanelLocators['Interaction Actions'].getDeleteActionButton(page),
		'Click delete interaction action',
	);
	await clickElement(
		conversationalPanelLocators['Confirmation Modals'].getDeleteInteractionConfirmButton(page),
		'Confirm delete interaction',
	);
}

export async function downloadChartImage(page: Page): Promise<Download> {
	await conversationalPanelLocators.getLatestResponseMessage(page).scrollIntoViewIfNeeded();
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		(async () => {
			await clickElement(
				conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page),
				'Open additional actions before chart download',
				true,
			);
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
			await clickElement(
				conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page),
				'Open additional actions before CSV download',
				true,
			);
			await conversationalPanelLocators['Interaction Actions'].getInteractionDownloadButton(page).dispatchEvent('click');
        })(),
    ]);
    return download;
}

export async function askFollowUpInChat(page: Page, prompt: string): Promise<void> {
	await typeText(
		conversationalPanelLocators['Chat Input'].getChatInput(page),
		prompt,
		'Type follow-up question',
	);
	await conversationalPanelLocators['Chat Input'].getChatInput(page).press('Enter');
}

export async function switchChartTypeToHorizontalBar(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getChartOptionsButton(page),
		'Open chart options menu',
	);
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getHorizontalBarChartOption(page),
		'Switch chart to horizontal bar',
	);
}

export async function downloadConversationZip(page: Page): Promise<Download> {
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		(async () => {
			await conversationalPanelLocators['Conversation Header'].getConversationDownloadButton(page).dispatchEvent('click');
		})(),
	]);
	return download;
}

export async function renameConversation(page: Page, updatedTitle: string): Promise<void> {
	await conversationalPanelActions.openConversationList(page);
	await conversationalPanelLocators['Conversation History'].getConversationNameButton(page).hover();
	await clickElement(
		conversationalPanelLocators['Conversation History'].getConversationRenameButton(page),
		'Click rename conversation button',
	);
	await typeText(
		conversationalPanelLocators['Conversation History'].getConversationRenameInput(page),
		updatedTitle,
		'Type updated conversation title',
	);
	await conversationalPanelLocators['Conversation History'].getConversationRenameInput(page).press('Enter');
}

export async function openInteractionActions(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await clickElement(
		conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page),
		'Open additional interaction actions panel',
	);
}

export async function searchAndOpenConversationByTitle(page: Page, title: string): Promise<void> {
	await conversationalPanelActions.openConversationList(page);
	await conversationalPanelActions.searchConversationHistoryByTitle(page, title);
	const unselectedItem = conversationalPanelLocators['Conversation History'].getConversationItemByTitleUnselected(page, title);
	await clickElement(
		unselectedItem,
		`Open conversation: ${title}`,
	);
}

export async function deleteInteractionOneByOne(page: Page, count: number): Promise<void> {
	await conversationalPanelActions.scrollToConversationTop(page);

	for (let interactionIndex = count - 1; interactionIndex >= 0; interactionIndex--) {
		await page.waitForTimeout(1000);
		await deleteInteraction(page);
	}
}