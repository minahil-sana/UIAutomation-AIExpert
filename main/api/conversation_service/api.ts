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

export async function getAllDashboards(
	page: Page,
): Promise<Array<{ status?: string }>> {
	const endpoint = new URL(apiPath['conversation-service'].getDashboards, auth.getBaseUrl());

	const response = await page.request.get(endpoint.toString(), {
		headers: auth.buildHeaders(),
		timeout: auth.REQUEST_TIMEOUT_MS,
	});

	const responseText = await response.text();
	if (!response.ok()) {
		throw new Error(
			`Get dashboards failed: ${response.status()} - ${responseText.substring(0, auth.RESPONSE_PREVIEW_LENGTH)}`,
		);
	}

	try {
		return JSON.parse(responseText) as Array<{ status?: string }>;
	} catch {
		throw new Error(
			`Get dashboards failed: expected JSON response - ${responseText.substring(0, auth.RESPONSE_PREVIEW_LENGTH)}`,
		);
	}
}

export async function deleteDashboardByID(
	page: Page,
	dashboardID: string,
): Promise<void> {
	const endpoint = new URL(
		`${apiPath['conversation-service'].getDashboards}/${dashboardID}`,
		auth.getBaseUrl(),
	).toString();

	const response = await page.request.delete(endpoint, {
		headers: auth.buildHeaders(),
		timeout: auth.REQUEST_TIMEOUT_MS,
	});

	if (!response.ok()) {
		const responseText = await response.text();
		throw new Error(
			`Delete dashboard failed: ${response.status()} - ${responseText.substring(0, auth.RESPONSE_PREVIEW_LENGTH)}`,
		);
	}
}