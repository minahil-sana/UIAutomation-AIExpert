import { BrowserContext, Page, test } from '@playwright/test';
import creds from '@test_data/login_creds.json';
import { login } from '@ui/login_page/tasks';
import { openAiExpertSidePanel } from '@ui/landing_page/actions';
import { verifyAiExpertLauncherVisible, verifyLandingPageReady } from '@ui/landing_page/assertions';
import * as sidePanelTasks from '@ui/conversational_panel/tasks';
import * as sidePanelAssertions from '@ui/conversational_panel/assertions';
import { seedConversationWithTenInteractions, updateConversationTitle } from '../main/api/conversation_seed.api';

test.describe.serial('AI Expert - Test with Pre Reqs', () => {
	test.setTimeout(900000);

	let context: BrowserContext;
	let page: Page;
	let uniqueConversationTitle: string;
	let uniqueConversationTimestamp: number;

	test.beforeAll(async ({ browser }) => {
		test.setTimeout(120000);
		context = await browser.newContext({ acceptDownloads: true });
		page = await context.newPage();

		await login(page, creds.username, creds.password, creds.baseURL);
		await verifyLandingPageReady(page);
		await verifyAiExpertLauncherVisible(page);
		await openAiExpertSidePanel(page);
	});

	test.afterAll(async () => {
		await context.close();
	});

	test('search and open conversation with 10 interactions created via backend service', async () => {
		const seeded = await seedConversationWithTenInteractions(page);
		// Update title with unique timestamp
		uniqueConversationTimestamp = Date.now();
		uniqueConversationTitle = `AutoTest-Interactions-${uniqueConversationTimestamp}`;
		await updateConversationTitle(page, seeded.conversationId, uniqueConversationTitle);
		await sidePanelTasks.searchAndOpenConversationByTitle(page, uniqueConversationTitle);
		await sidePanelAssertions.verifyConversationOpened(page, uniqueConversationTitle);
		await sidePanelTasks.deleteInteractionOneByOne(page, 10);
		await sidePanelAssertions.verifyEmptyDefaultScreen(page);
	});
});