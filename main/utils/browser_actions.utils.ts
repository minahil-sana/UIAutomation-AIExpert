import { Locator } from '@playwright/test';

export async function typeText(locator: Locator, value: string, message: string, clear: boolean = true): Promise<void> {
  try {
    clear && (await locator.fill('', { timeout: 30000 }));
    await locator.fill(value, { timeout: 30000 });
  } catch (error) {
    throw new Error(`${message} - Type text action failed after 30000 ms - ${error}`);
  }
}

export async function clickElement(locator: Locator, message: string, force: boolean = false): Promise<void> {
  try {
    await locator.click({ force, timeout: 30000 });
  } catch (error) {
    throw new Error(`${message} - Click action failed after 30000 ms - ${error}`);
  }
}