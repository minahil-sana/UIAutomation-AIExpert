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

export async function askPromptAndVerifyResponseGenerated(page: Page, prompt: string, index: number): Promise<void> {
	await askFollowUpInChat(page, prompt);
	await conversationalPanelAssertions.verifyResponseGeneratedforNonRag(page, index);
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

export async function renameDraftCanvas(page: Page, itemIndex: number, updatedTitle: string): Promise<void> {
	await conversationalPanelLocators['Canvas History'].getDraftItem(page, itemIndex).hover();
	await conversationalPanelActions.clickDraftCanvasRenameButton(page, itemIndex);
	await typeText(
		conversationalPanelLocators['Canvas History'].getDraftItemRenameInput(page, itemIndex),
		updatedTitle,
		`Type updated draft canvas title for item ${itemIndex}`,
	);
	await conversationalPanelLocators['Canvas History'].getDraftItemRenameInput(page, itemIndex).press('Enter');
}

export async function refreshCanvas(page: Page): Promise<Date> {
	const refreshClickedAt = new Date();
	await conversationalPanelActions.clickCanvasRefreshButton(page);
	return refreshClickedAt;
}

export async function publishCanvas(page: Page): Promise<void> {
	await conversationalPanelActions.clickCanvasPublishButton(page);
}

export async function switchCanvasWidgetChartTypeToHorizontalBar(page: Page): Promise<void> {
	await conversationalPanelActions.openCanvasWidgetActions(page);
	await conversationalPanelActions.clickCanvasWidgetHorizontalBarOption(page);
}

export async function resizeFirstCanvasWidget(page: Page): Promise<void> {
	const resizeHandle = conversationalPanelLocators['Canvas Workspace'].getWidget1ResizeHandle(page);
	const box = await resizeHandle.boundingBox();
	if (!box) throw new Error('Widget 1 SE resize handle not found');
	const startX = box.x + box.width / 2;
	const startY = box.y + box.height / 2;
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.move(startX + 441, startY + 60, { steps: 30 });
	await page.mouse.up();
}

export async function rearrangeFirstCanvasWidget(page: Page): Promise<string> {
	const titleLocator = conversationalPanelLocators['Canvas Workspace'].getWidget1Title(page);
	const movedWidgetTitle = (await titleLocator.innerText()).trim();
	const dragHandle = conversationalPanelLocators['Canvas Workspace'].getWidget1DragHandle(page);
	const box = await dragHandle.boundingBox();
	if (!box) throw new Error('Widget 1 drag handle not found');
	const startX = box.x + box.width / 2;
	const startY = box.y + box.height / 2;
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.move(startX, startY + 450, { steps: 40 });
	await page.mouse.up();
	return movedWidgetTitle;
}

export async function deleteAllCanvasWidgets(page: Page): Promise<void> {
	const maxDeletions = 10;
	for (let i = 0; i < maxDeletions; i++) {
		const widgetCount = await conversationalPanelLocators['Canvas Workspace'].getPublishedWidgets(page).count();
		if (widgetCount === 0) {
			break;
		}

		await conversationalPanelActions.openCanvasWidgetActions(page);
		await conversationalPanelActions.clickCanvasWidgetDeleteButton(page);

		await expect
			.poll(
				async () => await conversationalPanelLocators['Canvas Workspace'].getPublishedWidgets(page).count(),
				{ timeout: 15000 },
			)
			.toBeLessThan(widgetCount);
	}
}