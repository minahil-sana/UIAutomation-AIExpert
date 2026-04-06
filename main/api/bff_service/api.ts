import { Page } from '@playwright/test';
import prompts from '@test_data/prompts.json';
import apiPath from '@aiexpert-api/apiPaths/paths.json';
import * as auth from '@aiexpert-api/shared/auth';
import { createConversationPayload } from '@aiexpert-api/bff_service/payload';

export async function createInteraction(
	page: Page,
	prompt: string,
	conversationId: string | null,
	baseUrl: string,
	headers: Record<string, string>,
): Promise<{ conversationId: string; interactionId: string }> {
	const endpoint = new URL(apiPath['bff-service'].createConversation, baseUrl).toString();

	const response = await page.request.post(endpoint, {
		headers,
		data: createConversationPayload(prompt, conversationId),
		timeout: auth.REQUEST_TIMEOUT_MS,
	});
	const responseText = await response.text();

	if (!response.ok()) {
		throw new Error(`Create failed: ${response.status()} at ${endpoint} - ${responseText.substring(0, auth.RESPONSE_PREVIEW_LENGTH)}`);
	}

	let data: Record<string, unknown>;
	try {
		data = JSON.parse(responseText) as Record<string, unknown>;
	} catch {
		throw new Error(
			`Create failed: expected JSON but got non-JSON response at ${endpoint}. ` +
			`Body starts with: ${responseText.substring(0, auth.RESPONSE_PREVIEW_LENGTH)}`,
		);
	}

	const newConversationId = String(data['conversationId'] ?? '');
	const interactionId = String(data['id'] ?? '');

	if (!newConversationId) {
		throw new Error('Invalid create response: missing conversationId');
	}

	if (!interactionId) {
		throw new Error('Invalid create response: missing conversationId or id');
	}

	return { conversationId: newConversationId, interactionId };
}

export async function streamResponse(
	conversationId: string,
	interactionId: string,
	baseUrl: string,
	headers: Record<string, string>,
): Promise<string> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), auth.STREAM_TIMEOUT_MS);
	const streamPath = `${apiPath['bff-service'].getStream}${conversationId}/interaction/${interactionId}?generateStream=true`;
	const url = new URL(streamPath, baseUrl).toString();

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...headers,
				accept: 'text/event-stream',
				'cache-control': 'no-cache',
				connection: 'keep-alive',
			},
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new Error(`Stream failed: ${response.status}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('Stream not readable');
		}

		const decoder = new TextDecoder();
		let buffer = '';
		let finalText = '';
		let keepAliveCount = 0;

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split(/\r?\n/);
			buffer = lines.pop() ?? '';

			for (const line of lines) {
				if (!line.startsWith('data:')) continue;

				let event: Record<string, unknown>;
				try {
					event = JSON.parse(line.replace(/^data:\s*/, '').trim()) as Record<string, unknown>;
				} catch {
					continue;
				}

				if (event['type'] === 'keep-alive') {
					keepAliveCount += 1;
					if (keepAliveCount > auth.MAX_KEEP_ALIVE_EVENTS && !finalText) {
						throw new Error('Only keep-alives received');
					}
					continue;
				}

				const eventData =
					typeof event['data'] === 'object' && event['data'] !== null
						? (event['data'] as Record<string, unknown>)
						: event;
				const interaction = (eventData['interaction'] as Record<string, unknown>) ?? {};
				const userMessage = (interaction['user_message'] as Record<string, unknown>) ?? {};
				const advisorMessage = (userMessage['advisor_message'] as Record<string, unknown>) ?? {};
				const message = advisorMessage['message'];
				if (typeof message === 'string' && message.trim()) {
					finalText = message;
				}

				const state = (eventData['state'] ?? interaction['state'] ?? '').toString().toLowerCase();
				if (state === 'completed' || state === 'done') {
					return finalText.trim();
				}
			}
		}

		if (finalText) {
			return finalText.trim();
		}

		throw new Error('Stream ended without response text');
	} catch (error) {
		throw new Error(`Stream error: ${error instanceof Error ? error.message : String(error)}`);
	} finally {
		clearTimeout(timeout);
	}
}

export async function sendPrompt(
	page: Page,
	prompt: string,
	conversationId: string | null,
	baseUrl: string,
	headers: Record<string, string>,
): Promise<{ conversationId: string; interactionId: string; finalResponse: string }> {
	const created = await createInteraction(page, prompt, conversationId, baseUrl, headers);
	const finalResponse = await streamResponse(created.conversationId, created.interactionId, baseUrl, headers);

	return {
		conversationId: created.conversationId,
		interactionId: created.interactionId,
		finalResponse,
	};
}

export async function seedConversationWithTenInteractions(
	page: Page,
): Promise<{ conversationId: string; interactionIds: string[]; responses: string[] }> {
	const baseUrl = auth.getBaseUrl();
	const headers = auth.buildHeaders();

	let conversationId: string | null = null;
	const interactionIds: string[] = [];
	const responses: string[] = [];

	for (const prompt of prompts) {
		const result = await sendPrompt(page, prompt, conversationId, baseUrl, headers);
		conversationId = result.conversationId;
		interactionIds.push(result.interactionId);
		responses.push(result.finalResponse);
	}

	return {
		conversationId: conversationId ?? '',
		interactionIds,
		responses,
	};
}
