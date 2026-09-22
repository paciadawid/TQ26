# TQ26

A [Playwright](https://playwright.dev/) test suite covering:

- **UI**: end-to-end browser flows against the [BearStore](https://bearstore-testsite.smartbear.com) SmartStore demo site — search, shopping cart, and checkout.
- **API**: HTTP-level coverage of the [GoRest](https://gorest.co.in) public REST API — user creation, retrieval, and auth behavior.

Written in strict TypeScript, following the Page Object Model for UI tests and typed API clients for API tests.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- npm

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

Copy the example env file and set your GoRest token (needed for the `api` project's authenticated requests):

```bash
cp .env.example .env
```

```
GOREST_ACCESS_TOKEN=<your-token>
```

`.env` is gitignored — never commit real tokens.

## Running tests

```bash
npm test                              # run everything (ui + api)
npx playwright test --project=ui      # UI tests only
npx playwright test --project=api     # API tests only
npx playwright test tests/ui/cart.spec.ts   # a single spec
npx playwright test --ui              # Playwright's interactive UI mode
```

An HTML report is generated after each run:

```bash
npx playwright show-report
```

## Code quality

```bash
npm run lint          # ESLint
npm run lint:fix       # ESLint with autofix
npm run format:check   # Prettier check
npm run format         # Prettier write
npm run typecheck      # tsc --noEmit
```

A [Husky](https://typicode.github.io/husky/) pre-commit hook runs lint-staged automatically on staged files.

## Project structure

```
pages/          Page objects for UI flows (Page Object Model)
fixtures/       Playwright fixtures wiring page objects / API clients into tests
api/            Typed API clients (e.g. GoRestUser)
dto/            Request/response types for the API clients
tests/ui/       UI specs (tests/ui/**/*.spec.ts)
tests/api/      API specs (tests/api/**/*.spec.ts)
playwright.config.ts   Project config: baseURLs, projects, reporters
```

- **UI tests** use a worker-scoped fixture that seeds a fresh, disposable BearStore account per worker (see `fixtures/ui.ts`), so parallel runs never contend over the same cart/session.
- **API tests** use a `createdUserIds` fixture to track and clean up any users created during a test.

Coding standards for this repo (Page Object Model, locator priority, fixture patterns, no secrets in tests, etc.) are documented as Cursor rules under [`.cursor/rules/`](.cursor/rules/).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

- **lint**: ESLint, Prettier check, typecheck
- **test**: the full Playwright suite (Chromium), with the HTML report uploaded as an artifact

## Agent skills

This repo ships with Cursor agent skills (`.cursor/skills/`) that automate the test lifecycle end to end: writing a new spec, self-reviewing it against these standards, gating on 3 green runs, opening a PR, and self-healing red CI — see `add-test`, `pr-code-review`, `fix-test`, `self-heal`, and `ship-test`.
