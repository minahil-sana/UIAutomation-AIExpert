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
        getConvertToCanvasButton: (page: Page): Locator => page.locator('.pendo-convert-to-dashboard-btn').locator('button').first(),
    },
    'Canvas History': {
        getCanvasHistoryButton: (page: Page): Locator => page.getByTestId('side-menu__dashboard-conversation-history-btn').locator('button').first(),
        getDraftHeader: (page: Page): Locator => page.getByTestId('Draft-header'),
        getDraftCountLabel: (page: Page): Locator => page.getByTestId('Draft-header').locator('span').nth(1),
        getDraftItem: (page: Page, itemIndex: number): Locator => page.getByTestId(`Draft-item-${itemIndex}-isSelected`),
        getDraftItemTitle: (page: Page, itemIndex: number): Locator => page.getByTestId(`Draft-item-${itemIndex}-isSelected`).locator('p[slot="trigger"]'),
        getDraftItemRenameButton: (page: Page, itemIndex: number): Locator =>page.getByTestId(`Draft-item-${itemIndex}-isSelected`).locator('.pendo-dashboard-rename-edit-btn').locator('button').first(),
        getDraftItemRenameInput: (page: Page, itemIndex: number): Locator => page.getByTestId(`Draft-item-rename-input-${itemIndex}-isSelected`).locator('input'),
    },
    'Canvas Workspace': {
        getCanvasGrid: (page: Page): Locator => page.getByTestId('eva-dashboard-grid'),
        getPublishButton: (page: Page): Locator => page.getByTestId('dashboard-publish-publish-btn').locator('button').first(),
        getManualRefreshButton: (page: Page): Locator => page.getByTestId('dashboard-manual-refresh-btn').locator('button').first(),
        getWidgetActionsButton: (page: Page): Locator => page.getByTestId('widget-actions').last(),
        getWidgetActionsMenu: (page: Page): Locator => page.locator('en-panel .sc-gDzyrw').last(),
        getWidgetUpdatedOnValue: (page: Page): Locator => page.locator('en-panel .sc-gDzyrw').last().locator('span').nth(1),
        getWidgetChartSwitchHorizontalBar: (page: Page): Locator => page.getByTestId('chart-switch-horizontal_bar').last(),
        getWidgetChartSwitchHorizontalBarSelected: (page: Page): Locator => page.getByTestId('chart-switch-horizontal_bar-selected').last(),
        getLiveIndicator: (page: Page): Locator => page.locator('.live-text-wrapper'),
        getPublishedWidgets: (page: Page): Locator => page.locator('[data-testid^="published-widget-"]'),
        getWidget1GridItem: (page: Page): Locator => page.locator('.react-grid-item').filter({ has: page.locator('[data-testid^="published-widget-1"]') }),
        getWidget1Title: (page: Page): Locator => page.locator('[data-testid^="published-widget-1"]').locator('[data-testid="eva-widget-header-title"]'),
        getWidget1ResizeHandle: (page: Page): Locator => page.locator('.react-grid-item').filter({ has: page.locator('[data-testid^="published-widget-1"]') }).locator('.react-resizable-handle-se'),
        getWidget1DragHandle: (page: Page): Locator => page.locator('.react-grid-item').filter({ has: page.locator('[data-testid^="published-widget-1"]') }).locator('[data-testid="widget-drag-handle"]'),
        getWidget2GridItem: (page: Page): Locator => page.locator('.react-grid-item').filter({ has: page.locator('[data-testid^="published-widget-2"]') }),
        getWidget2Title: (page: Page): Locator => page.locator('[data-testid^="published-widget-2"]').locator('[data-testid="eva-widget-header-title"]'),
        getWidgetDeleteButton: (page: Page): Locator => page.getByTestId('delete-widget').last(),
        getCanvasEmptyPromptsContainer: (page: Page): Locator => conversationalPanelLocators['Canvas Workspace'].getCanvasGrid(page).getByTestId('EvaPrompts'),
    },
    'Conversation History': {
        getConversationListButton: (page: Page): Locator => page.getByTestId('conversation-history__btn'),
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
