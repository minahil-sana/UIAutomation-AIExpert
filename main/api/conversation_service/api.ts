import { Page } from '@playwright/test';
import apiPath from '@aiexpert-api/apiPaths/paths.json';
import * as auth from '@aiexpert-api/shared/auth';
import { updateTitlePayload } from '@aiexpert-api/conversation_service/payload';

export async function updateConversationTitle(
	page: Page,
	conversationId: string,
	newTitle: string,
): Promise<string> {
	const endpoint = new URL(
		`${apiPath['conversation-service'].createConversation}/${conversationId}/title`,
		auth.getBaseUrl(),
	).toString();
	const headers = auth.buildHeaders();

	const response = await page.request.put(endpoint, {
		headers,
		data: updateTitlePayload(newTitle),
		timeout: auth.REQUEST_TIMEOUT_MS,
	});

	if (!response.ok()) {
		const responseText = await response.text();
		throw new Error(`Title update failed: ${response.status()} - ${responseText.substring(0, auth.RESPONSE_PREVIEW_LENGTH)}`);
	}

	return newTitle;
}
