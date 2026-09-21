---
name: add-test
description: >-
  Write a new Playwright test from a plain-language description of a UI or API
  behavior to cover. Use when the user asks to add test coverage, write a new
  spec, or cover a flow/endpoint that isn't tested yet.
---

# Add Test

Prefix shell with `rtk` (`rtk npx`, `rtk lint`).

## 1. Pick the surface

Infer from the description:

- Browser flow (pages, clicks, cart, search, etc.) → **UI**: `tests/ui/**`, `pages/**`, `fixtures/ui.ts`.
- Backend/endpoint behavior → **API**: `tests/api/**`, `api/**`, `dto/**`, `fixtures/api.ts`.

If the description is genuinely ambiguous between the two, ask — do not guess.

## 2. Reuse before creating

- UI: check `pages/**` for an existing page object with the needed elements/methods
  before adding a new one or a new method. Follow `.cursor/rules/page-object-model.mdc`
  and `.cursor/rules/playwright-locators.mdc` for locator choice/placement.
- API: check `api/**` / `dto/**` for an existing client method/type before adding one.
- If UI selectors/flow are unknown, use the `playwright` MCP to navigate the live
  `baseURL` from `playwright.config.ts` and confirm the flow before writing code.
- Wire any new page object / API client into `fixtures/ui.ts` or `fixtures/api.ts`
  (specs must not `new SomePage(page)` — see `.cursor/rules/playwright-fixtures.mdc`).

## 3. Write the spec

Follow, in order: `.cursor/rules/playwright-e2e-structure.mdc`,
`.cursor/rules/no-try-catch-in-specs.mdc`, `.cursor/rules/typescript-strict.mdc`,
`.cursor/rules/no-secrets.mdc`. Cite these; do not restate them.

## 4. Gate before declaring done

Run `rtk npx playwright test <new spec path>` and `rtk lint` / `rtk tsc`.
Then follow `.cursor/rules/local-test-gate-before-push.mdc` — 3 consecutive
green runs of the new spec — before this is push-ready. Do not commit or
push unless asked; if asked, use `.cursor/rules/conventional-commits.mdc`
(`test:` type).
