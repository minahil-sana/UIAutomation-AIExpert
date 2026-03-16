import { BrowserContext, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json';
import { openLoginPage } from '@ui/login_page/login_page_actions';
import { login } from '@ui/login_page/login_page_tasks';
import { openWorkspaceLanding } from '@ui/landing_page/landing_page_actions';
import { waitForLandingPageReady } from '@ui/landing_page/landing_page_assertions';
import { openAiExpert } from '@ui/landing_page/landing_page_tasks';

import * as sidePanelTasks from '@ui/side_panel/side_panel_tasks';

type LoginCreds = {
	username: string;
	password: string;
};

const loginCreds = creds as LoginCreds;
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
		await openLoginPage(page);
		await login(page, loginCreds.username, loginCreds.password);
		await openWorkspaceLanding(page);
		await waitForLandingPageReady(page);
	});

	test('open side panel and validate default tile sections', async () => {
		await openAiExpert(page);
		await sidePanelTasks.validateDefaultPanelAndTiles(page, enablementTiles);
	});

	test('knowledge prompt flow with interaction actions and feedback', async () => {
		await sidePanelTasks.askKnowledgeQuestionAndValidateResponse(page);
		await sidePanelTasks.copyFeedbackAndDeleteLatestInteraction(page, 'Response is Accurate');
	});

	test('devices flow with table, chart, download, rename and delete conversation', async () => {
	    await sidePanelTasks.askDevicesQuestionAndValidateTable(page);
	    //await sidePanelTasks.downloadTableCsv(page);
	    await sidePanelTasks.askFollowupAndValidateChart(page, 'Show me the distribution of my entitlements by application in a chart');
        await sidePanelTasks.switchChartAndDownloadImage(page);
	    // await sidePanelTasks.downloadConversation(page);
	    await sidePanelTasks.renameAndDeleteConversation(page, 'Updated Title');
	});
});
