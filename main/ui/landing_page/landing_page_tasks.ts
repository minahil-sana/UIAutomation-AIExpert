import { Page } from '@playwright/test';
//! dont push unused import
import { openAiExpertSidePanel, openWorkspaceLanding } from '@ui/landing_page/landing_page_actions';

//! this is not a task
export async function openAiExpert(page: Page): Promise<void> {
	await openAiExpertSidePanel(page);
}
