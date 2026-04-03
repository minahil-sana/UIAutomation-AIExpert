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

export async function openTableFiltersPanel(page: Page): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridFiltersButton(page),
		'Open Table filters panel',
	);
}

export async function clickTableColumnHeader(page: Page, columnName: string): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, columnName),
		`Click table column header: ${columnName}`,
		true,
	);
}

export async function dragColumnHeaderToRightOfColumn(page: Page, sourceColumnName: string, targetColumnName: string): Promise<void> {
	await conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, sourceColumnName).scrollIntoViewIfNeeded();
	await conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, targetColumnName).scrollIntoViewIfNeeded();
	let sourceBox = await conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, sourceColumnName).boundingBox();
	let targetBox = await conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, targetColumnName).boundingBox();
	let gridBox = await conversationalPanelLocators['Table and Chart'].getTableGridRoot(page).boundingBox();
	if (!sourceBox || !targetBox) {
		throw new Error(`Unable to get column header bounds for drag: ${sourceColumnName} -> ${targetColumnName}`);
	}
	// Drop slightly right of center on the target column to insert right after it
	let dropX = targetBox.x + (targetBox.width / 2) + 15;
	if (gridBox) {
		dropX = Math.min(dropX, gridBox.x + gridBox.width - 12);
	}
	let dropY = targetBox.y + (targetBox.height / 2);
	await page.mouse.move(sourceBox.x + (sourceBox.width / 2), sourceBox.y + (sourceBox.height / 2));
	await page.mouse.down();
	await page.mouse.move(dropX, dropY, { steps: 20 });
	await page.mouse.up();
}

export async function expandFilterGroup(page: Page, columnName: string): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridFilterGroupHeader(page, columnName),
		`Expand filter group for column: ${columnName}`,
	);
}

export async function selectFilterOperator(page: Page, columnName: string, operatorLabel: string): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridFilterOperatorDropdown(page, columnName),
		`Click filter operator dropdown for column: ${columnName}`,
	);
	await page.waitForTimeout(300);
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridFilterOperatorOption(page, operatorLabel),
		`Select filter operator: ${operatorLabel}`,
	);
}

export async function clickApplyFilter(page: Page, columnName: string): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridFilterApplyButton(page, columnName),
		`Click Apply filter button for column: ${columnName}`,
	);
}

export async function clickResetFilter(page: Page, columnName: string): Promise<void> {
	await clickElement(
		conversationalPanelLocators['Table and Chart'].getTableGridFilterResetButton(page, columnName),
		`Click Reset filter button for column: ${columnName}`,
	);
}

export async function getGridColumnValues(page: Page, columnIndex: number): Promise<string[]> {
	let values: string[] = [];
	let rowCount = await conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).count();
	for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
		let value = (await conversationalPanelLocators['Table and Chart'].getTableGridRoot(page).locator(`.ag-center-cols-container [role="row"][row-index="${rowIndex}"]`).first().getByRole('gridcell').nth(columnIndex).innerText()).trim();
		if (value) {
			values.push(value);
		}
	}
	return values;
}

export async function getGridColumnValuesByName(page: Page, columnName: string): Promise<string[]> {
	let values: string[] = [];
	let rowCount = await conversationalPanelLocators['Table and Chart'].getTableGridRenderedRows(page).count();
	let ariaColumnIndex = await conversationalPanelLocators['Table and Chart'].getTableGridColumnHeaderByName(page, columnName).getAttribute('aria-colindex');
	if (!ariaColumnIndex) {
		throw new Error(`Unable to determine aria-colindex for column: ${columnName}`);
	}
	for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
		let value = (await conversationalPanelLocators['Table and Chart'].getTableGridRoot(page).locator(`.ag-center-cols-container [role="row"][row-index="${rowIndex}"]`).first().getByRole('gridcell').nth(Number(ariaColumnIndex) - 1).innerText()).trim();
		if (value) {
			values.push(value);
		}
	}
	return values;
}
