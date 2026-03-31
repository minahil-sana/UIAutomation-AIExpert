import { BrowserContext, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json';
import { login } from '@ui/login_page/tasks';
import { openAiExpertSidePanel } from '@ui/landing_page/actions';
import { verifyAiExpertLauncherVisible, verifyLandingPageReady } from '@ui/landing_page/assertions';
import * as sidePanelTasks from '@ui/conversational_panel/tasks';
import * as sidePanelAssertions from '@ui/conversational_panel/assertions';

const enablementTiles = ['About Me', 'Knowledge', 'Devices', 'Clients', 'Licensing', 'Alerts'];

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
		await login(page, creds.username, creds.password, creds.baseURL);
		await verifyLandingPageReady(page);
		await verifyAiExpertLauncherVisible(page);
	});

	test('open side panel and validate default tile sections', async () => {
		await openAiExpertSidePanel(page);
		await sidePanelAssertions.verifyDefaultPanelAndTiles(page, enablementTiles);
	});

	test('knowledge prompt flow with interaction actions and feedback', async () => {
		await sidePanelTasks.askKnowledgeQuestionAndValidateResponse(page);
		await sidePanelTasks.copyFeedbackAndDeleteLatestInteraction(page, 'Response is Accurate');
	});

	test('devices flow with table, chart, download, rename and delete conversation', async () => {
		await sidePanelTasks.askDevicesQuestionAndValidateTable(page);
		const csvDownload = await sidePanelTasks.downloadTableCsv(page);
		await sidePanelAssertions.verifyDownload(csvDownload, '.csv');
		await sidePanelTasks.askFollowupAndValidateChart(page, 'Show me the distribution of my entitlements by application in a chart');
		await sidePanelTasks.switchChartTypeToHorizontalBar(page);
		await sidePanelAssertions.verifyChartTypeSwitched(page);
		const chartDownload = await sidePanelTasks.downloadChartImage(page);
		await sidePanelAssertions.verifyDownload(chartDownload, '.png');
		const conversationDownload = await sidePanelTasks.downloadConversation(page);
		await sidePanelAssertions.verifyDownload(conversationDownload, '.zip');
		await sidePanelTasks.renameAndVerifyConversation(page, 'Updated Title');
		await sidePanelTasks.deleteAndVerifyConversation(page);
	});
});
