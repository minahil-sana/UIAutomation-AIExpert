import {Page } from '@playwright/test';
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

export async function openConversationList(page: Page): Promise<void> {
	await conversationalPanelLocators['Conversation History'].getConversationListButton(page).click();
}
