import {expect, Download, Page } from '@playwright/test';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';

export async function clickEnablementTile(page: Page, tileName: string): Promise<void> {
	await conversationalPanelLocators['Panel Layout'].getEnablementTileByName(page, tileName).click();
}

export async function clickPromptQuestionByCategoryAndNumber(page: Page, category: string, questionNumber: number): Promise<void> {
	await conversationalPanelLocators['Chat Input'].getPromptQuestionByCategoryAndNumber(page, category, questionNumber).click();
}

export async function copyInteractionText(page: Page): Promise<void> {
	await conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, 0).click();
}

export async function openFeedbackModal(page: Page): Promise<void> {
	await conversationalPanelLocators['Interaction Feedback'].getThumbsUpButton(page).click();
}


export async function scrollToConversationBottom(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).scrollIntoViewIfNeeded();
}
export async function submitPositiveFeedback(page: Page, additionalFeedback: string): Promise<void> {
	await openFeedbackModal(page);
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

export async function openConversationList(page: Page): Promise<void> {
	await conversationalPanelLocators['Conversation History'].getConversationListButton(page).click();
}

export async function renameConversation(page: Page, updatedTitle: string): Promise<void> {
	await openConversationList(page);
	await conversationalPanelLocators['Conversation History'].getConversationNameButton(page).hover();
	await conversationalPanelLocators['Conversation History'].getConversationRenameButton(page).click();
	await conversationalPanelLocators['Conversation History'].getConversationRenameInput(page).fill(updatedTitle);
	await conversationalPanelLocators['Conversation History'].getConversationRenameInput(page).press('Enter');
	await expect(conversationalPanelLocators['Conversation Header'].getConversationTitle(page)).toContainText(updatedTitle, {timeout: 15000});
    await openConversationList(page);

}

export async function openInteractionActions(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page).click();
}
