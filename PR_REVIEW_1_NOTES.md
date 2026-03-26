# PR Review 1 - Mentor Points (Better Comments)

## Summary for Wisam + Usman

1. Standardize folder and file naming.
- Rename `side_panel` to `conversational_panel`.
- Inside each page folder, keep helper files as `actions.ts`, `assertions.ts`, `locators.ts`, `tasks.ts` where needed.
- Avoid redundant prefixes like `login_page_actions.ts` inside `login_page/`.

2. Keep strict separation of concerns.
- `actions`: single UI interactions.
- `assertions`: verification functions.
- `tasks`: multi-step workflows.
- Move any assertion logic from actions to assertions.

3. Use consistent locator style.
- Do not mix locator-object and locator-function styles in one file.
- Parameterize dynamic locators instead of hardcoding variants.

4. Refactor login flow for reuse.
- Keep login as a generic task that does navigate + fill username + fill password + click.
- Use config/JSON data for `baseURL`, `workspaceURL`, `username`, `password`.

5. Keep browser utils generic.
- `browser_actions.utils.ts` should contain only reusable element-level helpers.
- Page-specific waits/readiness checks should stay in feature assertions.

6. Avoid redundant checks.
- Do not add a separate visible assertion before `click()` unless there is a business reason.

7. Cleanup and dependency hygiene.
- Remove unused imports.
- Remove unnecessary helper/types files that are not required.

## Notes

- Naming refactor is applied: `side_panel` was renamed to `conversational_panel`, and helper files now use simplified names (`actions.ts`, `assertions.ts`, `locators.ts`, `tasks.ts`).
- Core login/config/browser-utils alignment is applied in this branch.
