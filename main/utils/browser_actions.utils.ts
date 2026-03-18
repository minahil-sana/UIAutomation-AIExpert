import { Page,Locator } from '@playwright/test';
import { getLandingPageLocators } from '@ui/landing_page/landing_page_locators';

//! browser actions util file is absolutely wrong it should have generic browser actions which we do with elements
export async function waitForLandingPageReady(page: Page): Promise<void> {
	const locators = getLandingPageLocators(page);

	// Login can briefly redirect across landing routes before the app shell is stable.
	await page.waitForURL(/st2\.ep1test\.com\/workspace/, {
		timeout: 60000,
	});

	await Promise.race([
		locators.workspaceTitle.waitFor({ state: 'visible', timeout: 45000 }),
		locators.aiExpertLauncherButton.waitFor({ state: 'visible', timeout: 45000 }),
	]);

}

//? Examples of browser actions utils you need to create
//* example we type something in input field which uses function fill, which will be used for typing username, password, chat input
//* thus common browser action for this case will be typeText()

export async function typeText(locator: Locator, value: string, message: string, clear: boolean = true): Promise<void> {
  try {
    clear && (await locator.fill('', { timeout: 30000 }));
    await locator.fill(value, { timeout: 30000 });
  } catch (error) {
    throw new Error(`${message} - Type text action failed after 30000 ms - ${error}`);
  }
}

//* Its implementation in the fellow action file would be like this
/** 
 export async function enterPrompt(page: Page, prompt: string): Promise<void> {
     await browserActions.typeText(conversationalInterfaceLocators['Chat Input Area'].getChatInput(page), prompt, 'Create New Interaction');
  }
*/

//? Same we can do it for click too

export async function click(locator: Locator, message: string, force: boolean = false): Promise<void> {
  try {
    await locator.click({ force, timeout: 30000 });
  } catch (error) {
    throw new Error(`${message} - Click action failed after 30000 ms - ${error}`);
  }
}

//* Its implementation in fellow action file would be like this
/**
 export async function clickEditWidgetTitleButton(page: Page, type: string, widgetNumber: number): Promise<void> {
  await browserActions.click(
    renameWidgetLocators['Grid'].getWidgetEditTitleButton(page, type, widgetNumber),
    `Edit Widget Title Button for ${type} Widget ${widgetNumber}`
  );
}
*/