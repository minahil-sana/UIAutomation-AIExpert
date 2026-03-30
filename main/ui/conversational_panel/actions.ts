import {Page } from '@playwright/test';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';
import { clickElement } from '@utils/browser_actions.utils';

export async function clickEnablementTile(page: Page, tileName: string): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Panel Layout'].getEnablementTileByName(page, tileName),
		`Click enablement tile: ${tileName}`,
	);
}

export async function clickPromptQuestionByCategoryAndNumber(page: Page, category: string, questionNumber: number): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Chat Input'].getPromptQuestionByCategoryAndNumber(page, category, questionNumber),
		`Click prompt question ${category}-${questionNumber}`,
	);
}

export async function copyInteractionText(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, 0),
		'Copy latest interaction text',
	);
}

export async function openFeedbackModal(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Interaction Feedback'].getThumbsUpButton(page),
		'Open positive feedback modal',
	);
}

export async function scrollToConversationBottom(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).scrollIntoViewIfNeeded();
}

export async function openConversationList(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Conversation History'].getConversationListButton(page),
		'Open conversation list',
	);
}
