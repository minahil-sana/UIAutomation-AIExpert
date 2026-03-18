import { BrowserContext, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json'; //! where is this file i dont see it
//! login_page_actions -> file format incorrect you already have a folder name login so in it just have actions.ts, assertions.ts 
//? Keep the file naming format simple, for landing_page folder the helper files will be just actions.ts, assertions.ts and locators.ts, similarly for login_page folder also just have actions.ts, assertions.ts and locators.ts, no need to have login_page_actions or login_page_assertions because its already inside login_page folder so its redundant to have login_page prefix in file name same goes for landing page also
import { openLoginPage } from '@ui/login_page/login_page_actions';
import { login } from '@ui/login_page/login_page_tasks';
import { openWorkspaceLanding } from '@ui/landing_page/landing_page_actions';
import { waitForLandingPageReady } from '@utils/browser_actions.utils';
import { openAiExpert } from '@ui/landing_page/landing_page_tasks';

import * as sidePanelTasks from '@ui/side_panel/side_panel_tasks';
import * as sidePanelAssertions from '@ui/side_panel/side_panel_assertions';

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
		//! this approach is wrong, create a json file which should include (baseURL, username, password) and create a generic function for login which will take username and password as parameters and do the login, and in before each test just call that function, this way you can avoid hitting urls directly in your test files and also avoid code duplication of login steps in each test file
		await openLoginPage(page);
		await login(page, loginCreds.username, loginCreds.password);
		await openWorkspaceLanding(page);
		await waitForLandingPageReady(page);
	});

	test('open side panel and validate default tile sections', async () => {
		await openAiExpert(page);
		await sidePanelAssertions.validateDefaultPanelAndTiles(page, enablementTiles);
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
