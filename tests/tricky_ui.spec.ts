import { BrowserContext, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json';
import { login } from '@ui/login_page/tasks';
import { openAiExpertSidePanel } from '@ui/landing_page/actions';
import { verifyAiExpertLauncherVisible, verifyLandingPageReady } from '@ui/landing_page/assertions';
import * as sidePanelTasks from '@ui/conversational_panel/tasks';
import * as sidePanelAssertions from '@ui/conversational_panel/assertions';
import * as sidePanelActions from '@ui/conversational_panel/actions';

const loginCreds = creds;

test.describe.serial('AI Expert - Serial POM Flow', () => {
	test.setTimeout(180000);
	let context: BrowserContext;
	let page: Page;
	test.beforeAll(async ({ browser }) => {
		context = await browser.newContext({ acceptDownloads: true });
		page = await context.newPage();
	});

	test.afterAll(async () => {
		await context.close();
	});

	test('login to application and validate landing page', async () => {
		await login(page, loginCreds.username, loginCreds.password, loginCreds.baseURL);
		await verifyLandingPageReady(page);
		await verifyAiExpertLauncherVisible(page);
	});

    test('Table Workflow, Filter ,Sort and Rearrange Columns + Chart Workflow', async () => {
        await openAiExpertSidePanel(page);
        await sidePanelTasks.askFollowUpInChat(page, 'Show a list of my 10 wireless devices along with their creation time(first column), Owner ID(second column) and MAC address(third column) only');
        await sidePanelAssertions.verifyTableResponseGenerated(page);
		await sidePanelAssertions.verifyTableHasThreeColumns(page);
		await sidePanelAssertions.verifyTableHasNumericDateAndStringColumns(page);
        await sidePanelActions.openTableFiltersPanel(page);
        await sidePanelAssertions.verifyFiltersPanelVisible(page);
        
        // Filter workflow for all three columns: Select "Blank", apply, verify no rows, then reset and verify rows restored
        await sidePanelTasks.applyFilterWithBlankOperatorAndVerify(page, 'Created At');
        await sidePanelTasks.applyFilterWithBlankOperatorAndVerify(page, 'Owner Id');
        await sidePanelTasks.applyFilterWithBlankOperatorAndVerify(page, 'Mac Address');
        await sidePanelActions.openTableFiltersPanel(page); // Close filters panel to proceed with sorting

		// Sorting workflow for all three columns: ascending, descending, then original order
		await sidePanelTasks.sortColumnandVerifySort(page, 'Created At');
		await sidePanelTasks.sortColumnandVerifySort(page, 'Owner Id');
		await sidePanelTasks.sortColumnandVerifySort(page, 'Mac Address');

		// Column rearrangement: move Created At to the right so Owner Id becomes first
		await sidePanelTasks.rearrangeColumnsAndVerify(page);

        // Chart workflow: generate chart, switch type, verify switch
        await sidePanelTasks.askFollowupAndValidateChart(page, 'Show me the distribution of my entitlements by application in a chart');
        await sidePanelTasks.switchChartTypeToHorizontalBar(page);
        await sidePanelAssertions.verifyChartTypeSwitched(page);

    });
});