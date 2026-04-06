import { Locator, Page } from '@playwright/test';

export const conversationalPanelLocators = {
    getAiExpertPanelRoot: (page: Page): Locator => page.locator('[id="single-spa-application:@xcloud-workspace/aiExpertPanel"]'),
    getLatestResponseMessage: (page: Page): Locator => page.getByTestId(/interaction__response-message--interaction-\d+/).last(),
    'Panel Layout':{
        getPanelContainer: (page: Page): Locator => page.locator('.app-layout.is-ai-expert-open'),
        getEmptyStateContainer: (page: Page): Locator => conversationalPanelLocators.getAiExpertPanelRoot(page).getByTestId('EvaPrompts'),
        getEnablementTileByName: (page: Page, tileName: string): Locator => conversationalPanelLocators.getAiExpertPanelRoot(page).getByRole('button', { name: tileName, exact: true }),
    },
    'Chat Input': {
        getPromptBackButton: (page: Page): Locator => page.getByTestId('chat__prompt-back-btn'),
        getChatInput: (page: Page): Locator => page.getByTestId('chat__input'),
        getPromptQuestionByCategoryAndNumber: (page: Page, category: string, questionNumber: number): Locator => conversationalPanelLocators.getAiExpertPanelRoot(page).getByTestId(`prompt-item-${category}-${questionNumber}`),
    },
    'Interaction Response': {
        getReasoningStatus: (page: Page): Locator => page.locator('span.sc-gWaSiO'),
    },
    'Interaction Actions':{
        getDeleteActionButton: (page: Page): Locator => conversationalPanelLocators.getLatestResponseMessage(page).getByTestId(/interaction__delete-btn--interaction-\d+/),
        getCopyInteractionButton: (page: Page, interactionIndex: number): Locator => page.getByTestId(`interaction__copy-btn--interaction-${interactionIndex}`),
        getAdditionalActionsTrigger: (page: Page): Locator => conversationalPanelLocators.getLatestResponseMessage(page).getByTestId('eva-additional-actions-panel').locator('[slot="trigger"]'),
        getAdditionalActions: (page: Page): Locator => conversationalPanelLocators.getLatestResponseMessage(page).getByTestId('eva-additional-actions-panel'),
        getInteractionDownloadButton: (page: Page): Locator => conversationalPanelLocators.getLatestResponseMessage(page).getByTestId(/interaction__download-btn--interaction-\d+/),

    },
    'Interaction Feedback': {
        getThumbsUpButton: (page: Page): Locator => page.getByTestId(/interaction__feedback-like-btn--interaction-\d+/).last(),
        getThumbsDownButton: (page: Page): Locator => page.getByTestId(/interaction__feedback-dislike-btn--interaction-\d+/).last(),
        getFeedbackLabelInput: (page: Page): Locator => conversationalPanelLocators.getLatestResponseMessage(page).getByTestId('interaction__feedback-message-input--interaction-0').locator('textarea'),
        getFeedbackSubmitButton: (page: Page): Locator => page.getByTestId(`interaction__feedback-submit-btn--interaction-0`),
        getFeedbackAccurateOption: (page: Page): Locator => page.getByTestId(`interaction__feedback-reaction-btn--interaction-0-reaction-0`),
        getFeedbackSuccessToast: (page: Page): Locator => page.getByText('Thank you for your valuable feedback'),
        getCopyAlert: (page: Page): Locator => page.getByRole('alert'),
    },
    'Table and Chart': {
        getTableResponseContainer: (page: Page): Locator => page.getByTestId('eva-table'),
        getChartResponseContainer: (page: Page): Locator => page.getByTestId('chart').last(),
        getChartOptionsButton: (page: Page): Locator => page.getByTestId('eva-graph-expandable-wrapper').last().getByTestId('widget-actions'),
        getHorizontalBarChartOption: (page: Page): Locator => page.getByTestId('chart-switch-horizontal_bar'),
        getHorizontalBarChartSelected: (page: Page): Locator => page.getByTestId('chart-switch-horizontal_bar-selected'),
    },
    'Conversation Header': {
        getConversationDownloadButton: (page: Page): Locator => page.locator('.sc-hvigdm.kMpmen.pendo-chat-header__download-btn > .en-c-button'),
        getConversationTitle: (page: Page): Locator => page.getByTestId('chat-header__title'),
    },
    'Conversation History': {
        getConversationListButton: (page: Page): Locator => page.getByTestId('conversation-history__btn'),
        getConversationSearchInput: (page: Page): Locator => page.getByTestId('conversation-history__search-input').locator('input'),
        getConversationItemByTitle: (page: Page, title: string): Locator => conversationalPanelLocators['Conversation Header'].getConversationTitle(page).filter({ hasText: title }),
        getConversationItemByTitleUnselected: (page: Page, title: string): Locator => page.getByTestId(/conversation-history__item--\d+(?!-isSelected)/).filter({ hasText: title }).first(),
        getConversationNameButton: (page: Page): Locator => page.getByTestId('conversation-history__item--0-isSelected'),
        getConversationRenameButton: (page: Page): Locator => page.getByTestId('conversation-history__item-edit-btn--0'),
        getConversationRenameInput: (page: Page): Locator => page.getByTestId('conversation-history__item-rename-input--0'),
        getConversationDeleteButton: (page: Page): Locator => page.getByTestId('conversation-history__item-delete-btn--0'),
    },
    'Confirmation Modals': { 
        getDeleteInteractionConfirmButton: (page: Page): Locator => page.getByTestId('confirm__model-confirm-btn').getByRole('button', { name: 'Delete' }),
        getDeleteConversationConfirmButton: (page: Page): Locator => page.getByTestId('conversation-history__item-confirm-btn--0').getByRole('button', { name: 'Delete' }),
    }      
};
