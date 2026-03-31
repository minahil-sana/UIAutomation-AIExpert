import { Download, expect, Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';
import { clickElement } from '@utils/browser_actions.utils';

function getDownloadsDirectory(): string {
	const homeDir = process.env.USERPROFILE ?? process.env.HOME;
	if (!homeDir) {
		throw new Error('Unable to determine user home directory for Downloads verification.');
	}
	return path.join(homeDir, 'Downloads');
}

export async function verifySidePanelIsVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Panel Layout'].getPanelContainer(page)).toBeVisible();
}

export async function verifyDefaultPanelAndTiles(page: Page, tileNames: string[]): Promise<void> {
	await verifySidePanelIsVisible(page);
	await verifyEmptyDefaultScreen(page);
	await verifyEnablementTilesVisible(page, tileNames);
}

export async function verifyEmptyDefaultScreen(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Panel Layout'].getEmptyStateContainer(page)).toBeVisible();
}

export async function verifyEnablementTilesVisible(page: Page, tileNames: string[]): Promise<void> {
	for (const tileName of tileNames) {
		await expect(conversationalPanelLocators['Panel Layout'].getEnablementTileByName(page, tileName)).toBeVisible({timeout: 15000});
	}
}

export async function verifyInteractionActionsVisible(page: Page): Promise<void> {
	await conversationalPanelLocators.getLatestResponseMessage(page).hover();
	await expect(conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, 0)).toBeVisible({ timeout: 45000 });
	await expect(conversationalPanelLocators['Interaction Feedback'].getThumbsUpButton(page)).toBeVisible();
	await expect(conversationalPanelLocators['Interaction Feedback'].getThumbsDownButton(page)).toBeVisible();
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
}

export async function verifyFeedbackSuccess(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Feedback'].getFeedbackSuccessToast(page)).toBeVisible();
}

export async function verifyResponseGenerated(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, 0)).toBeVisible({ timeout: 45000 });
}

export async function verifyTableResponseGenerated(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getTableResponseContainer(page)).toBeVisible({ timeout: 60000 });
	await expect(conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page)).toBeVisible({ timeout: 15000 });
	await clickElement(
		conversationalPanelLocators['Interaction Actions'].getAdditionalActionsTrigger(page),
		'Open additional interaction actions in table assertion',
	);
	await expect(conversationalPanelLocators['Interaction Actions'].getInteractionDownloadButton(page)).toBeVisible({ timeout: 15000 });
}

export async function verifyReasoningVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Response'].getReasoningStatus(page)).toBeVisible({timeout:15000});
}

export async function verifyChartGenerated(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getChartResponseContainer(page)).toBeVisible({ timeout: 60000 });
	await expect(conversationalPanelLocators['Table and Chart'].getChartOptionsButton(page)).toBeVisible({ timeout: 30000 });
}

export async function verifyChartTypeSwitched(page: Page ): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getHorizontalBarChartSelected(page)).toBeVisible({ timeout: 15000 });
}

export async function verifyConversationTitle(page: Page, title: string): Promise<void> {
	await expect(conversationalPanelLocators['Conversation Header'].getConversationTitle(page)).toContainText(title, {timeout: 15000});
}

export async function verifyConversationOpened(page: Page, title: string): Promise<void> {
	await expect(conversationalPanelLocators['Conversation History'].getConversationItemByTitle(page, title)).toBeVisible({ timeout: 15000 });
}

export async function verifyDownload(download: Download, extension: '.csv' | '.png' | '.zip'): Promise<void> {
	const downloadsDir = getDownloadsDirectory();
	const suggestedFileName = download.suggestedFilename();
	const startedAtMs = Date.now();
	const downloadPath = path.join(downloadsDir, `${startedAtMs}-${suggestedFileName}`);
	await download.saveAs(downloadPath);
	const stats = await fs.stat(downloadPath);
	const fileExtension = path.extname(downloadPath).toLowerCase();
	const clockToleranceMs = 120000;
	expect(fileExtension).toBe(extension);
	expect(stats.mtimeMs).toBeGreaterThanOrEqual(startedAtMs - clockToleranceMs);
	expect(stats.mtimeMs).toBeLessThanOrEqual(Date.now() + clockToleranceMs);
}
