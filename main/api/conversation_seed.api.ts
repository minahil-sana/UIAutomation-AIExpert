import { Page } from '@playwright/test';
import prompts from '@test_data/prompts.json';

const REQUEST_TIMEOUT_MS = 30000;
const STREAM_TIMEOUT_MS = 120000;
const RESPONSE_PREVIEW_LENGTH = 300;
const MAX_KEEP_ALIVE_EVENTS = 50;

function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env variable: ${name}`);
	}
	return value;
}

function sanitizeToken(rawToken: string): string {
	let token = rawToken.trim();
	if (token.startsWith('"') && token.endsWith('"')) {
		token = token.slice(1, -1);
	}
	if (token.startsWith('Bearer ')) {
		return token;
	}
	return `Bearer ${token}`;
}

function buildHeaders(): Record<string, string> {
	const context = getRequiredEnv('AIEXPERT_CONTEXT');
	const token = sanitizeToken(getRequiredEnv('AIEXPERT_TOKEN'));

	return {
		'content-type': 'application/json',
		authorization: token,
		context,
		'x-context': context,
	};
}

function getBaseUrl(): string {
	return getRequiredEnv('AIEXPERT_CHAT_BASE_URL');
}

function getConversationServiceTitleUrl(conversationId: string): string {
	return new URL(`/conversation-service/conversations/${conversationId}/title`, getBaseUrl()).toString();
}

export async function createInteraction(
	page: Page,
	prompt: string,
	conversationId: string | null,
	baseUrl: string,
	headers: Record<string, string>,
): Promise<{ conversationId: string; interactionId: string }> {
	const url = `${baseUrl}/create`;

	const response = await page.request.post(url, {
		headers,
		data: {
			userMessage: prompt,
			conversationId,
		},
		timeout: REQUEST_TIMEOUT_MS,
	});
	const responseText = await response.text();

	if (!response.ok()) {
		throw new Error(`Create failed: ${response.status()} at ${url} - ${responseText.substring(0, RESPONSE_PREVIEW_LENGTH)}`);
	}

	let data: Record<string, unknown>;
	try {
		data = JSON.parse(responseText) as Record<string, unknown>;
	} catch {
		throw new Error(
			`Create failed: expected JSON but got non-JSON response at ${url}. ` +
			`Body starts with: ${responseText.substring(0, RESPONSE_PREVIEW_LENGTH)}`,
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
	const timeout = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);
	const url = `${baseUrl}/stream/${conversationId}/interaction/${interactionId}?generateStream=true`;

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
					if (keepAliveCount > MAX_KEEP_ALIVE_EVENTS && !finalText) {
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

export async function updateConversationTitle(
	page: Page,
	conversationId: string,
	newTitle: string,
): Promise<string> {
	const url = getConversationServiceTitleUrl(conversationId);
	const headers = buildHeaders();

	const response = await page.request.put(url, {
		headers,
		data: { title: newTitle },
		timeout: REQUEST_TIMEOUT_MS,
	});

	if (!response.ok()) {
		const responseText = await response.text();
		throw new Error(`Title update failed: ${response.status()} - ${responseText.substring(0, RESPONSE_PREVIEW_LENGTH)}`);
	}

	return newTitle;
}

export async function seedConversationWithTenInteractions(
	page: Page,
): Promise<{ conversationId: string; interactionIds: string[]; responses: string[] }> {
	const baseUrl = getBaseUrl();
	const headers = buildHeaders();

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
