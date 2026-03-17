import { Locator, Page } from '@playwright/test';

export type SidePanelLocators = {
	panelContainer: Locator;
	emptyStateContainer: Locator;
	promptBackButton: Locator;
	chatInput: Locator;
	latestResponseMessage: Locator;
	deleteActionButton: Locator;
	copyInteractionButton: (index: number) => Locator;
    additionalActions: Locator;
	additionalActionsTrigger: Locator;
	thumbsUpButton: Locator;
    thumbsDownButton: Locator;
	feedbackLabelInput: Locator;
	feedbackSubmitButton: Locator;
	feedbackAccurateOption: Locator;
	feedbackSuccessToast: Locator;
	copyAlert: Locator;
	interactionDownloadButton: Locator;
	reasoningStatus: Locator;
	tableResponseContainer: Locator;
	chartResponseContainer: Locator;
	chartOptionsButton: Locator;
	horizontalBarChartOption: Locator;
    horizontalBarChartSelected: Locator;
	conversationDownloadButton: Locator;
	conversationListButton: Locator;
    conversationNameButton: Locator;
	conversationRenameButton: Locator;
	conversationRenameInput: Locator;
	conversationDeleteButton: Locator;
	conversationTitle: Locator;
	deleteInteractionConfirmButton: Locator;
	deleteConversationConfirmButton: Locator;
};

export function getSidePanelLocators(page: Page): SidePanelLocators {
	const aiExpertPanelRoot = page.locator('[id="single-spa-application:@xcloud-workspace/aiExpertPanel"]');
	const latestResponseMessage = page.getByTestId(/interaction__response-message--interaction-\d+/).last();

	return {
		panelContainer: page.locator('.app-layout.is-ai-expert-open'),
		emptyStateContainer: aiExpertPanelRoot.getByTestId('EvaPrompts'),
		promptBackButton: page.getByTestId('chat__prompt-back-btn'),
		chatInput: page.getByTestId('chat__input'),
		latestResponseMessage,
		deleteActionButton: latestResponseMessage.getByTestId(/interaction__delete-btn--interaction-\d+/),
        copyInteractionButton: (index: number) => page.getByTestId(`interaction__copy-btn--interaction-${index}`),		
		additionalActions: latestResponseMessage.getByTestId('eva-additional-actions-panel'),
		additionalActionsTrigger: latestResponseMessage.getByTestId('eva-additional-actions-panel').locator('[slot="trigger"]'),
		thumbsUpButton: page.getByTestId(/interaction__feedback-like-btn--interaction-\d+/).last(),
		thumbsDownButton: page.getByTestId(/interaction__feedback-dislike-btn--interaction-\d+/).last(),
        feedbackLabelInput: page.getByTestId('interaction__feedback-message-input--interaction-0').locator('textarea'),
        feedbackSubmitButton: page.getByTestId('interaction__feedback-submit-btn--interaction-0'),
        feedbackAccurateOption: page.getByTestId('interaction__feedback-reaction-btn--interaction-0-reaction-0'),
		feedbackSuccessToast: page.getByText('Thank you for your valuable feedback'),
		copyAlert: page.getByRole('alert'),
		interactionDownloadButton: latestResponseMessage.getByTestId(/interaction__download-btn--interaction-\d+/),
		reasoningStatus: page.locator('span.sc-gWaSiO'),
		tableResponseContainer: page.getByTestId('eva-table'),
		chartResponseContainer: page.getByTestId('chart').last(),
		chartOptionsButton: page.getByTestId('eva-graph-expandable-wrapper').last().getByTestId('widget-actions'),
		horizontalBarChartOption: page.getByTestId('chart-switch-horizontal_bar'),
        horizontalBarChartSelected: page.getByTestId('chart-switch-horizontal_bar-selected'),
		conversationDownloadButton: page.locator('.sc-hvigdm.kMpmen.pendo-chat-header__download-btn > .en-c-button'),
		conversationListButton: page.getByTestId('conversation-history__btn'),
		conversationNameButton: page.getByTestId('conversation-history__item--0-isSelected'),
        conversationRenameButton: page.getByTestId('conversation-history__item-edit-btn--0'),
		conversationRenameInput: page.getByTestId('conversation-history__item-rename-input--0'),
		conversationDeleteButton: page.getByTestId('conversation-history__item-delete-btn--0'),
		conversationTitle: page.getByTestId('chat-header__title'),
		deleteInteractionConfirmButton: page.getByTestId('confirm__model-confirm-btn').getByRole('button', { name: 'Delete' }),
		deleteConversationConfirmButton: page.getByTestId('conversation-history__item-confirm-btn--0').getByRole('button', { name: 'Delete' }),
	};
}

export function enablementTileByName(page: Page, tileName: string): Locator {
    const aiExpertPanelRoot = page.locator('[id="single-spa-application:@xcloud-workspace/aiExpertPanel"]');
	return aiExpertPanelRoot.getByRole('button', { name: tileName, exact: true });
}

export function promptQuestionByKnowledge(page: Page ): Locator {
    const aiExpertPanelRoot = page.locator('[id="single-spa-application:@xcloud-workspace/aiExpertPanel"]');
	return aiExpertPanelRoot.getByTestId('prompt-item-Knowledge-0');
}

export function promptQuestionByDevices(page: Page ): Locator {
    const aiExpertPanelRoot = page.locator('[id="single-spa-application:@xcloud-workspace/aiExpertPanel"]');
	return aiExpertPanelRoot.getByTestId('prompt-item-Devices-2');
}
