import { BrowserContext, expect, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json';
import { verifyDashboardCount } from '@aiexpert-api/conversation_service/helper';
import { login } from '@ui/login_page/tasks';
import { openAiExpertSidePanel } from '@ui/landing_page/actions';
import { openCanvasHistory, clickConvertToCanvasButton } from '@ui/conversational_panel/actions';
import { verifyAiExpertLauncherVisible, verifyLandingPageReady } from '@ui/landing_page/assertions';
import * as sidePanelTasks from '@ui/conversational_panel/tasks';
import * as sidePanelAssertions from '@ui/conversational_panel/assertions';

const enablementTiles = ['About Me', 'Knowledge', 'Devices', 'Clients', 'Licensing', 'Alerts'];

test.describe.serial('Dashboards pre-req and multi-prompt conversation flow', () => {
	test.setTimeout(900000);

	let context: BrowserContext;
	let page: Page;
	let unpublishedCount: number;

	test.beforeAll(async ({ browser }) => {
        test.setTimeout(900000);
		context = await browser.newContext({ acceptDownloads: true });
		page = await context.newPage();

		await login(page, creds.username, creds.password, creds.baseURL);
		await verifyLandingPageReady(page);
		await verifyAiExpertLauncherVisible(page);
		await openAiExpertSidePanel(page);
		await sidePanelAssertions.verifyDefaultPanelAndTiles(page, enablementTiles);
	});

	test.afterAll(async () => {
		await context.close();
	});

	test('Pre-Req Unpublished/Published-Count and Delete Canvas', async () => {
		const { publishedCount, unpublishedCount: unpublished } = await verifyDashboardCount(page, 2, 9);
		console.log(`Published canvas count after pre-req: ${publishedCount}`);
		console.log(`Unpublished canvas count after pre-req: ${unpublished}`);
		expect(publishedCount).toBeLessThanOrEqual(2);
		expect(unpublished).toBeLessThanOrEqual(9);
		unpublishedCount = unpublished;
	});

	test('Non Rag-Add to Canvas-Manage anvas', async () => {
		const updatedDraftTitle = `Auto-Draft-Canvas-${Date.now()}`;

		await sidePanelTasks.askPromptAndVerifyResponseGenerated(page, 'What is the total number of devices currently connected to my network?', 0);
        await sidePanelTasks.askPromptAndVerifyResponseGenerated(page, 'List my cloud managed wireless devices', 1);
        await sidePanelTasks.askPromptAndVerifyResponseGenerated(page, 'Show me the distribution of my entitlements by application in donut chart', 2);
        await sidePanelTasks.askPromptAndVerifyResponseGenerated(page, 'How many alerts were generated per severity level in the last week', 3);
		await clickConvertToCanvasButton(page);
		await openCanvasHistory(page);
		await sidePanelAssertions.verifyDraftCanvasCount(page, unpublishedCount + 1);
		await sidePanelTasks.renameDraftCanvas(page, 1, updatedDraftTitle);
		await sidePanelAssertions.verifyDraftCanvasTitle(page, 1, updatedDraftTitle);
        const refreshClickedAt = await sidePanelTasks.refreshCanvas(page);
		await sidePanelAssertions.verifyCanvasRefreshTime(page, refreshClickedAt);
        await sidePanelTasks.switchCanvasWidgetChartTypeToHorizontalBar(page);
		await sidePanelAssertions.verifyCanvasWidgetChartTypeSwitched(page);
		await sidePanelTasks.publishCanvas(page);
		await sidePanelAssertions.verifyCanvasIsLive(page);
        await sidePanelAssertions.verifyCanvasWidgetChartTypeSwitched(page); //to verify that the chart type switch is retained after publishing
		await sidePanelTasks.resizeFirstCanvasWidget(page);
		await sidePanelAssertions.verifyCanvasWidgetResized(page);
		const movedWidgetTitle = await sidePanelTasks.rearrangeFirstCanvasWidget(page);
		await sidePanelAssertions.verifyCanvasWidgetRearranged(page, movedWidgetTitle);
		await sidePanelTasks.deleteAllCanvasWidgets(page);
		await sidePanelAssertions.verifyCanvasEmptyPromptsVisible(page);
    });
});