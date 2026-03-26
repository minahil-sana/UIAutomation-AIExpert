import {expect, Download, Page } from '@playwright/test';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';

export async function clickEnablementTile(page: Page, tileName: string): Promise<void> {
	await conversationalPanelLocators.enablementTileByName(page, tileName).click();
}

export async function clickPromptQuestionByCategoryAndNumber(page: Page, category: string, questionNumber: number): Promise<void> {
	await conversationalPanelLocators.promptQuestionByCategoryAndNumber(page, category, questionNumber).click();
}

export async function copyInteractionText(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.copyInteractionButton(0).click();
}

export async function openFeedbackModal(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.thumbsUpButton.click();
}


export async function scrollToConversationBottom(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.latestResponseMessage.scrollIntoViewIfNeeded();
}
export async function submitPositiveFeedback(page: Page, additionalFeedback: string): Promise<void> {
    const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
    await openFeedbackModal(page);
    await locators.feedbackAccurateOption.click();
    await locators.feedbackLabelInput.fill(additionalFeedback);
    await locators.feedbackSubmitButton.click();
}

export async function deleteInteraction(page: Page): Promise<void> {
    const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
    await locators.latestResponseMessage.hover();
    await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });
    await locators.additionalActionsTrigger.click();
    
    await expect(locators.deleteActionButton).toBeVisible({ timeout: 15000 });
    await locators.deleteActionButton.click();
    await locators.deleteInteractionConfirmButton.click();
}

export async function downloadInteractionCsv(page: Page) {
    const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
    await locators.latestResponseMessage.scrollIntoViewIfNeeded();
    await locators.latestResponseMessage.hover();
    await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        (async () => {
            await locators.additionalActionsTrigger.click({ force: true });
            await locators.interactionDownloadButton.dispatchEvent('click');
        })(),
    ]);

    return download;
}

export async function downloadChartImage(page: Page): Promise<Download> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.latestResponseMessage.scrollIntoViewIfNeeded();
	await locators.latestResponseMessage.hover();
	await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		(async () => {
			await locators.additionalActionsTrigger.click({ force: true });
			await locators.interactionDownloadButton.dispatchEvent('click');
		})(),
	]);

	return download;
}

export async function askFollowUpInChat(page: Page, prompt: string): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.chatInput.fill(prompt);
	await locators.chatInput.press('Enter');
}

export async function switchChartTypeToHorizontalBar(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.chartOptionsButton.click();
	await locators.horizontalBarChartOption.click();
}



export async function downloadConversationZip(page: Page): Promise<Download> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.latestResponseMessage.scrollIntoViewIfNeeded();
	await locators.latestResponseMessage.hover();
	await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		(async () => {
			await locators.additionalActionsTrigger.click({ force: true });
			await locators.conversationDownloadButton.dispatchEvent('click');
		})(),
	]);

	return download;
}

export async function openConversationList(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.conversationListButton.click();
}

export async function renameConversation(page: Page, updatedTitle: string): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await openConversationList(page);
    await locators.conversationNameButton.hover();
	await locators.conversationRenameButton.click();
	await locators.conversationRenameInput.fill(updatedTitle);
	await locators.conversationRenameInput.press('Enter');
    await expect(locators.conversationTitle).toContainText(updatedTitle, {timeout: 15000});
    await openConversationList(page);

}

export async function openInteractionActions(page: Page): Promise<void> {
	const locators = conversationalPanelLocators.getConversationalPanelLocators(page);
	await locators.latestResponseMessage.hover();
	await expect(locators.additionalActionsTrigger).toBeVisible({ timeout: 15000 });
	await locators.additionalActionsTrigger.click();
}
