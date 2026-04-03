import { Download, expect, Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import * as conversationalPanelActions from '@ui/conversational_panel/actions';
import { conversationalPanelLocators } from '@ui/conversational_panel/locators';
import { detectColumnType, getSortedColumnValues } from '@ui/conversational_panel/sorting.utils';
import { clickElement } from '@utils/browser_actions.utils';

async function expectColumnType(page: Page, columnName: string, expectedType: 'numeric' | 'date' | 'string'): Promise<void> {
	expect(
		detectColumnType(await conversationalPanelActions.getGridColumnValuesByName(page, columnName)),
		`Expected column ${columnName} to be classified as ${expectedType}.`
	).toBe(expectedType);
}

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

export async function verifyTableHasThreeColumns(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridRoot(page)).toBeVisible({ timeout: 60000 });
	await expect.poll(async () => {
		let ariaColCount = await conversationalPanelLocators['Table and Chart'].getTableGridRoot(page).getAttribute('aria-colcount');
		return Number(ariaColCount ?? '0');
	}, { timeout: 15000 }).toBeGreaterThan(0);
	await expect.poll(async () => await conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).count(), { timeout: 15000 }).toBeGreaterThan(0);
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).first()).toBeVisible({ timeout: 15000 });
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaders(page)).toHaveCount(3, { timeout: 15000 });
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, 'Created At')).toBeVisible({ timeout: 15000 });
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, 'Owner Id')).toBeVisible({ timeout: 15000 });
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, 'Mac Address')).toBeVisible({ timeout: 15000 });
}

export async function verifyTableHasNumericDateAndStringColumns(page: Page): Promise<void> {
	await expect.poll(async () => await conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).count(), { timeout: 15000 }).toBeGreaterThan(0);
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).first()).toBeVisible({ timeout: 15000 });
	await expectColumnType(page, 'Created At', 'date');
	await expectColumnType(page, 'Owner Id', 'numeric');
	await expectColumnType(page, 'Mac Address', 'string');
}

export async function verifyReasoningVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Interaction Response'].getReasoningStatus(page)).toBeVisible({timeout:15000});
}

export async function verifyFiltersPanelVisible(page: Page): Promise<void> {
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridFiltersButton(page)).toHaveAttribute('aria-expanded', 'true', { timeout: 10000 });
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridVisibleFiltersPanel(page)).toBeVisible({ timeout: 10000 });
}

export async function verifyNoRowsVisible(page: Page): Promise<void> {
	await expect.poll(async () => await conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).count(), { timeout: 15000 }).toBe(0);
}

export async function verifyRowsRestored(page: Page): Promise<void> {
	await expect.poll(async () => await conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).count(), { timeout: 15000 }).toBeGreaterThan(0);
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).first()).toBeVisible({ timeout: 15000 });
}

export async function verifyColumnHeaderSortState(page: Page, columnName: string, expectedState: 'ascending' | 'descending' | 'none'): Promise<void> {
	if (expectedState === 'none') {
		await expect.poll(async () => {
			let state = await conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, columnName).getAttribute('aria-sort');
			return state === 'none';
		}, { timeout: 15000 }).toBe(true);
		return;
	}
	await expect(conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, columnName)).toHaveAttribute('aria-sort', expectedState, { timeout: 15000 });
}

export async function verifyColumnSortedAscending(page: Page, columnName: string, originalValues: string[]): Promise<void> {
	await expect.poll(async () => JSON.stringify(await conversationalPanelActions.getGridColumnValuesByName(page, columnName)), { timeout: 15000 }).toBe(JSON.stringify(getSortedColumnValues(originalValues, 'ascending')));
}

export async function verifyColumnSortedDescending(page: Page, columnName: string, originalValues: string[]): Promise<void> {
	await expect.poll(async () => JSON.stringify(await conversationalPanelActions.getGridColumnValuesByName(page, columnName)), { timeout: 15000 }).toBe(JSON.stringify(getSortedColumnValues(originalValues, 'descending')));
}

export async function verifyColumnSortResetToOriginal(page: Page, columnName: string, originalValues: string[]): Promise<void> {
	await expect.poll(async () => JSON.stringify(await conversationalPanelActions.getGridColumnValuesByName(page, columnName)), { timeout: 15000 }).toBe(JSON.stringify(originalValues));
}

export async function verifyFirstTwoColumnHeaders(page: Page, firstColumnName: string, secondColumnName: string): Promise<void> {
	let firstColumnIdPrefix = firstColumnName === 'Created At' ? 'created_at' : firstColumnName === 'Owner Id' ? 'owner_id' : firstColumnName === 'Mac Address' ? 'mac_address' : '';
	let secondColumnIdPrefix = secondColumnName === 'Created At' ? 'created_at' : secondColumnName === 'Owner Id' ? 'owner_id' : secondColumnName === 'Mac Address' ? 'mac_address' : '';
	if (!firstColumnIdPrefix || !secondColumnIdPrefix) {
		throw new Error(`Unsupported column name mapping for reorder assertion: ${firstColumnName}, ${secondColumnName}`);
	}
	await expect.poll(async () => await conversationalPanelLocators['Table and Chart'].getTableGridRoot(page).locator(`[role="columnheader"][col-id^="${firstColumnIdPrefix}-"]`).first().getAttribute('aria-colindex'), { timeout: 15000 }).toBe('1');
	await expect.poll(async () => await conversationalPanelLocators['Table and Chart'].getTableGridRoot(page).locator(`[role="columnheader"][col-id^="${secondColumnIdPrefix}-"]`).first().getAttribute('aria-colindex'), { timeout: 15000 }).toBe('2');
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
