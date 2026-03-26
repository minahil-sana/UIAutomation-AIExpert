import { BrowserContext, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json';
import { login } from '@ui/login_page/tasks';
import { openWorkspaceLanding , openAiExpertSidePanel } from '@ui/landing_page/actions';
import { expectAiExpertLauncherVisible } from '@ui/landing_page/assertions';

import * as sidePanelTasks from '@ui/conversational_panel/tasks';
import * as sidePanelAssertions from '@ui/conversational_panel/assertions';

type LoginCreds = {
	baseURL: string;
	workspaceURL: string;
	username: string;
	password: string;
};

const loginCreds = creds as LoginCreds;
const enablementTiles = ['About Me', 'Knowledge', 'Devices', 'Clients', 'Licensing', 'Alerts'];

test.describe.serial('AI Expert - Serial POM Flow', () => {
	test.setTimeout(180000);

	let context: BrowserContext;
	let page: Page;
	let isInitialized = false;

	test.beforeAll(async ({ browser }) => {
		context = await browser.newContext({ acceptDownloads: true });
		page = await context.newPage();
	});

	test.afterAll(async () => {
		await context.close();
	});

	test('login to application and validate landing page', async () => {
		if (!isInitialized) {
			await login(page, loginCreds.username, loginCreds.password, loginCreds.baseURL);
			await openWorkspaceLanding(page, loginCreds.workspaceURL);
			isInitialized = true;
		}
		await expectAiExpertLauncherVisible(page);
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
	    await sidePanelTasks.downloadTableCsv(page);
	    await sidePanelTasks.askFollowupAndValidateChart(page, 'Show me the distribution of my entitlements by application in a chart');
        await sidePanelTasks.switchChartAndDownloadImage(page);
	    await sidePanelTasks.downloadConversation(page);
	    await sidePanelTasks.renameAndDeleteConversation(page, 'Updated Title');
	});
});
