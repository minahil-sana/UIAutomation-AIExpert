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

export async function verifyResponseGeneratedforNonRag(page: Page, index: number): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Actions'].getCopyInteractionButton(page, index)).toBeVisible({ timeout: 45000 });
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

export async function verifyDraftCanvasCount(page: Page, expectedDraftCount: number): Promise<void> {
	await expect
		.poll(async () => {
			await conversationalPanelLocators['Canvas History'].getDraftHeader(page).waitFor({ state: 'visible', timeout: 10000 });
			const countText = (await conversationalPanelLocators['Canvas History'].getDraftCountLabel(page).innerText()).trim();
			const match = countText.match(/^(\d+)\s*\/\s*\d+$/);
			if (!match) {
				return -1;
			}
			return Number(match[1]);
		}, { timeout: 5000 })
		.toBe(expectedDraftCount);
}

export async function verifyDraftCanvasTitle(page: Page, itemIndex: number, expectedTitle: string): Promise<void> {
	await expect(conversationalPanelLocators['Canvas History'].getDraftItemTitle(page, itemIndex)).toContainText(expectedTitle, { timeout: 30000 });
}

export async function verifyCanvasRefreshTime(page: Page, refreshClickedAt: Date): Promise<void> {
	const refreshClickedAtMinute = new Date(refreshClickedAt);
	refreshClickedAtMinute.setSeconds(0, 0);

	await expect
		.poll(async () => {
			await conversationalPanelLocators['Canvas Workspace'].getWidgetActionsButton(page).click({ timeout: 10000 });
			await conversationalPanelLocators['Canvas Workspace'].getWidgetActionsMenu(page).waitFor({ state: 'visible', timeout: 10000 });
			const updatedOnText = (await conversationalPanelLocators['Canvas Workspace'].getWidgetUpdatedOnValue(page).innerText()).trim();
			const updatedOnDate = new Date(updatedOnText);
			if (Number.isNaN(updatedOnDate.getTime())) {
				return false;
			}
			return updatedOnDate.getTime() >= refreshClickedAtMinute.getTime();
		}, { timeout: 180000 })
		.toBeTruthy();
}

export async function verifyCanvasIsLive(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Canvas Workspace'].getLiveIndicator(page)).toBeVisible({ timeout: 30000 });
}

export async function verifyCanvasEmptyPromptsVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Canvas Workspace'].getCanvasEmptyPromptsContainer(page)).toBeVisible({ timeout: 30000 });
}

export async function verifyCanvasWidgetResized(page: Page): Promise<void> {
	const widget = conversationalPanelLocators['Canvas Workspace'].getWidget1GridItem(page);
	await expect.poll(async () => {
		const style = await widget.getAttribute('style') ?? '';
		const widthMatch = style.match(/width:\s*(\d+)px/);
		const heightMatch = style.match(/height:\s*(\d+)px/);
		if (!widthMatch || !heightMatch) return false;
		return Number(widthMatch[1]) > 430 && Number(heightMatch[1]) > 350;
	}, { timeout: 15000 }).toBeTruthy();
}

export async function verifyCanvasWidgetRearranged(page: Page, movedWidgetTitle: string): Promise<void> {
	const widget2TitleLocator = conversationalPanelLocators['Canvas Workspace'].getWidget2Title(page);
	await expect(widget2TitleLocator).toContainText(movedWidgetTitle, { timeout: 15000 });
}

export async function verifyCanvasWidgetChartTypeSwitched(page: Page): Promise<void> {
	await expect
		.poll(async () => {
			await conversationalPanelLocators['Canvas Workspace'].getWidgetActionsButton(page).click({ timeout: 10000 });
			return await conversationalPanelLocators['Canvas Workspace'].getWidgetChartSwitchHorizontalBarSelected(page).isVisible();
		}, { timeout: 120000 })
		.toBeTruthy();
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
