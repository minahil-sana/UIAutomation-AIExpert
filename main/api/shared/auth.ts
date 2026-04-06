export const REQUEST_TIMEOUT_MS = 30000;
export const STREAM_TIMEOUT_MS = 120000;
export const RESPONSE_PREVIEW_LENGTH = 300;
export const MAX_KEEP_ALIVE_EVENTS = 50;

export function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required env variable: ${name}`);
	}
	return value;
}

export function sanitizeToken(rawToken: string): string {
	let token = rawToken.trim();
	if (token.startsWith('"') && token.endsWith('"')) {
		token = token.slice(1, -1);
	}
	if (token.startsWith('Bearer ')) {
		return token;
	}
	return `Bearer ${token}`;
}

export function buildHeaders(): Record<string, string> {
	const context = getRequiredEnv('AIEXPERT_CONTEXT');
	const token = sanitizeToken(getRequiredEnv('AIEXPERT_TOKEN'));
	return {
		'content-type': 'application/json',
		authorization: token,
		context,
		'x-context': context,
	};
}

export function getBaseUrl(): string {
	return getRequiredEnv('AIEXPERT_CHAT_BASE_URL');
}
