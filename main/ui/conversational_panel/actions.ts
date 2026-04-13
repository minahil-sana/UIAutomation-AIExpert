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

export async function clickConvertToCanvasButton(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Conversation Header'].getConvertToCanvasButton(page),
		'Click convert to canvas button',
	);
	await page.waitForTimeout(5000);
}

export async function openCanvasHistory(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas History'].getCanvasHistoryButton(page),
		'Click canvas history button',
	);
}

export async function clickDraftCanvasRenameButton(page: Page, itemIndex: number): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas History'].getDraftItemRenameButton(page, itemIndex),
		`Click draft canvas rename button for item ${itemIndex}`,
	);
}

export async function clickCanvasRefreshButton(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas Workspace'].getManualRefreshButton(page),
		'Click canvas refresh button',
	);
}

export async function clickCanvasPublishButton(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas Workspace'].getPublishButton(page),
		'Click canvas publish button',
	);
}

export async function openCanvasWidgetActions(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas Workspace'].getWidgetActionsButton(page),
		'Open canvas widget actions',
	);
}

export async function clickCanvasWidgetHorizontalBarOption(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas Workspace'].getWidgetChartSwitchHorizontalBar(page),
		'Switch canvas widget chart type to horizontal bar',
	);
}

export async function clickCanvasWidgetDeleteButton(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Canvas Workspace'].getWidgetDeleteButton(page),
		'Click canvas widget delete button',
	);
}