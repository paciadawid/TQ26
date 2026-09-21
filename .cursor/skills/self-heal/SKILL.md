---
name: self-heal
description: >-
  Diagnose and, if safe, fix a Playwright test failing in CI for the current
  pull request. Meant to be triggered automatically by a Cursor Automation
  on this repo's "Checks completed" git event, running unattended once per
  CI result - green means nothing to do, red means attempt one bounded
  fix-and-verify cycle. Owns diagnosis, the fix, verification,
  committing/pushing, and PR reporting itself; there is no wrapping CI
  workflow.
---

# Self-Heal (unattended, PR CI loop)

You are running unattended, checked out on a pull request branch, triggered
because this PR's CI checks just completed. There is no human to ask —
every decision below must be made autonomously per the fallback rule in
step 4. Prefix shell with `rtk` (`rtk gh`, `rtk npx`, `rtk git`).

## 1. Read current CI status

`rtk gh pr checks` (or `gh pr view --json statusCheckRollup`) for the PR on
the current branch.

- **All required checks passed** → nothing to do. Stop here — don't touch
  the working tree, don't comment, don't spend an attempt.
- **Only the `lint` job failed** → out of scope for this skill (lint/format
  issues aren't a Playwright test failure). Stop, no action, no comment.
- **The `test` job failed** → continue to step 2.

## 2. Loop guard — max 3 attempts

Count prior self-heal commits on this branch:
`rtk git log --oneline | grep -c '\[self-heal\]'`

- If the count is **3 or more**, stop without another fix attempt. Post one
  PR comment (`gh pr comment`) noting self-heal has already tried 3 times
  and this needs a human look — but skip the comment if an equivalent one
  is already the latest comment on the PR (don't spam on every subsequent
  red run).
- Otherwise continue to step 3; remember `attempt = count + 1` for the
  commit message in step 5.

## 3. Fetch the failure and diagnose

Get the failed run's id from `gh pr checks` / `gh run list --branch
<branch>`, then `rtk gh run view <run-id> --log-failed`. Follow
`.cursor/skills/fix-test/SKILL.md` steps 2–3: reproduce the failing spec(s)
locally and classify the failure — broken locator, flaky wait, shared
test-state contention, env/config issue, or a genuine bug the test correctly
caught.

## 4. Decide: fix or report — never ask, never guess

Unattended means no one to ask. Where `fix-test` step 3 says "ask before
weakening an assertion," here you must instead **not fix it** and report:

- **Test-code issue** (broken locator/selector, flaky wait, fixture/test-
  state bug) → apply the minimal fix per `fix-test` step 4 and this repo's
  `.cursor/rules/` (page-object-model, playwright-locators, typescript-
  strict, no-try-catch-in-specs, anti-overengineering). Never modify
  product/app code — anything outside `tests/`, `pages/`, `fixtures/`,
  `api/`, `dto/` is out of scope. Never weaken, remove, or loosen an
  assertion to make the test pass.
- **Anything else** — looks like a genuine product bug, root cause is
  ambiguous, or you're not confident in the fix — make **no** code changes.
  Post a PR comment (`gh pr comment`) explaining the root cause and why it
  wasn't auto-fixed, then stop.

## 5. Verify, then commit and push yourself

Before finishing a fix: run only the affected spec file(s) once (`rtk npx
playwright test <spec path>`), then `npm run lint` and `npm run typecheck`.
If any of those fail, run `git checkout -- .` and fall back to the report
path in step 4 instead of pushing a broken fix.

If verification passes, commit and push — there is no workflow step doing
this for you:

```bash
git add -A
git commit -m "fix: self-heal PR CI, attempt <attempt> [self-heal]"
git push
```

Pushing restarts CI on this PR, which re-triggers this same automation on
the next "Checks completed" event — that's how the retry loop closes across
runs. Do not comment on the PR after a successful push; let the next CI
result speak for itself.
