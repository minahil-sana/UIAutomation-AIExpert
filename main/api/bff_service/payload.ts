export function createConversationPayload(userMessage: string, conversationId: string | null): object {
	return {
		userMessage,
		conversationId,
	};
}
