import { Page } from '@playwright/test';
import { openAiExpertSidePanel, openWorkspaceLanding } from '@ui/landing_page/landing_page_actions';

export async function openAiExpert(page: Page): Promise<void> {
	await openAiExpertSidePanel(page);
}
