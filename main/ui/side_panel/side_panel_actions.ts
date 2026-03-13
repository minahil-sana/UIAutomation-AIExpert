import {expect, Download, Page } from '@playwright/test';
import * as sidePanelLocators from '@ui/side_panel/side_panel_locators';

export async function clickEnablementTile(page: Page, tileName: string): Promise<void> {
	await sidePanelLocators.enablementTileByName(page, tileName).click();
}

export async function clickPromptQuestionByKnowledge(page: Page ): Promise<void> {
	await sidePanelLocators.promptQuestionByKnowledge(page ).click();
}

export async function clickPromptQuestionByDevices(page: Page ): Promise<void> {
	await sidePanelLocators.promptQuestionByDevices(page ).click();
}


export async function copyInteractionText(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.copyInteractionButton(0).click();
}

export async function openFeedbackModal(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.thumbsUpButton.click();
}

export async function submitPositiveFeedback(page: Page, additionalFeedback: string): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await openFeedbackModal(page);
	await locators.feedbackAccurateOption.click();
	await locators.feedbackLabelInput.fill(additionalFeedback);
	await locators.feedbackSubmitButton.click();
}

export async function deleteInteraction(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
    await locators.additionalActions.click();
    await locators.deleteActionButton.click();
	await locators.deleteInteractionConfirmButton.click();
}

export async function downloadInteractionCsv(page: Page): Promise<Download> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
     await locators.additionalActions.click();

    const [download] = await Promise.all([
		page.waitForEvent('download'),
		locators.interactionDownloadButton.click()
	]);

	return download;

}

export async function askFollowUpInChat(page: Page, prompt: string): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.chatInput.fill(prompt);
	await locators.chatInput.press('Enter');
}

export async function switchChartTypeToHorizontalBar(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.chartOptionsButton.click();
	await locators.horizontalBarChartOption.click();
}



export async function downloadConversationZip(page: Page): Promise<Download> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	const downloadPromise = page.waitForEvent('download');
    await locators.additionalActions.click();
    await expect(locators.conversationDownloadButton).toBeVisible({ timeout: 15000 });
	await locators.conversationDownloadButton.click();
	return downloadPromise;
}

export async function openConversationList(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.conversationListButton.click();
}

export async function renameConversation(page: Page, updatedTitle: string): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await openConversationList(page);
    await locators.conversationNameButton.hover();
	await locators.conversationRenameButton.click();
	await locators.conversationRenameInput.fill(updatedTitle);
	await locators.conversationRenameInput.press('Enter');
    await expect(locators.conversationTitle).toContainText(updatedTitle, {timeout: 15000});
}

export async function deleteConversation(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await openConversationList(page);
	await locators.conversationDeleteButton.click();
	await locators.deleteConversationConfirmButton.click();
}

export async function openInteractionActions(page: Page): Promise<void> {
	const locators = sidePanelLocators.getSidePanelLocators(page);
	await locators.additionalActions.click();
}
