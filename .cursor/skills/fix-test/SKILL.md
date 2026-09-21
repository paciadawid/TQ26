---
name: fix-test
description: >-
  Diagnose and fix a Playwright test that failed in GitHub Actions CI. Use
  when the user asks to fix a failing test, a red CI check, or points at a
  failed workflow run/PR.
---

# Fix Test

Prefix shell with `rtk` (`rtk gh`, `rtk npx`, `rtk git`).

## 1. Resolve the failing run

Completion: owner, repo, run/check ID (or "latest run on this branch").

- PR/URL given → `rtk gh pr checks <pr>` to find the failed check.
- Nothing given → `rtk gh run list` for the most recent failed run on the
  current branch.

Fetch logs/annotations for the failed job (`rtk gh run view <id> --log-failed`
or the GitHub MCP `get_check_runs`) to identify the failing spec file(s) and
error.

## 2. Reproduce locally

Checkout the same ref/branch and run only the failing spec(s):
`rtk npx playwright test <spec path>`. Use the HTML report / trace
(`trace: 'on'`, `video: 'on'` in `playwright.config.ts`) for the real failure
detail — CI log text alone is often not enough.

## 3. Diagnose before editing

Classify the failure: product/UI change (locator broke), flaky wait, shared
test-state contention (see `.cursor/rules/playwright-fixtures.mdc` on
per-worker accounts), env/config issue, or a genuine bug the test correctly
caught (ask before "fixing" that by weakening the assertion).

## 4. Apply the minimal fix

Fix only what's broken — don't restructure unrelated code
(`.cursor/rules/anti-overengineering.mdc`). Keep it compliant with
`.cursor/rules/page-object-model.mdc`, `.cursor/rules/playwright-locators.mdc`,
`.cursor/rules/typescript-strict.mdc`, `.cursor/rules/no-try-catch-in-specs.mdc`.

## 5. Gate before declaring done

Follow `.cursor/rules/local-test-gate-before-push.mdc` — 3 consecutive green
runs of the affected spec(s) — before this is push-ready. Report the CI
run/check fixed, root cause, and the gate result. Do not commit or push
unless asked; if asked, use `.cursor/rules/conventional-commits.mdc`
(`fix:` type).
