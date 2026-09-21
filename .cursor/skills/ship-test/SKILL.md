---
name: ship-test
description: >-
  End-to-end pipeline for a new test: write it, self-review and fix it
  against this repo's standards, open a PR, then watch CI and self-heal it
  inline until green (or the attempt cap is hit). Use when the user asks to
  add test coverage AND ship it - not just write the spec.
---

# Ship Test

Chains three existing skills into one pipeline. Reuse them by reference;
don't restate their steps here.

## 1. Add the test

Follow `.cursor/skills/add-test/SKILL.md` steps 1–3 (pick surface, reuse
before creating, write the spec). Ignore its own "commit or push unless
asked" note and its step 4 gate for now — this skill's steps 3–4 below
supersede both.

## 2. Review for standards compliance, then fix

Diff the new/changed files (`rtk git status --porcelain` /
`rtk git diff`). Reuse the **Standards axis** from
`.cursor/skills/pr-code-review/SKILL.md`: launch the
`pr-standards-reviewer` subagent (or `generalPurpose` following
`.cursor/agents/pr-standards-reviewer.md` if that type is unavailable),
scoped to just this diff plus `.cursor/rules/*.mdc` paths. Skip the Spec
axis and all GitHub-gather steps — there's no PR yet.

Fix every **blocking** finding yourself. Use judgment on
suggestions/nits — fix trivial ones, otherwise leave them. Re-run the
reviewer once after fixing to confirm no blocking findings remain; don't
loop indefinitely — if something can't be resolved cleanly, stop and ask.

## 3. Gate before pushing

Follow `.cursor/skills/add-test/SKILL.md` step 4 and
`.cursor/rules/local-test-gate-before-push.mdc`: 3 consecutive green runs of
the new spec, plus clean lint/typecheck.

## 4. Commit, push, open the PR

Commit per `.cursor/rules/conventional-commits.mdc` (`test:` type). Push the
branch and `gh pr create`, with the title/body describing the coverage
added.

## 5. Self-heal inline until green or exhausted

Don't rely on a separately configured Automation for this — do it yourself,
in this same session:

1. Watch CI to completion (`gh pr checks --watch` or poll).
2. **Green** → done. Report the PR URL and stop.
3. **Red** → run `.cursor/skills/self-heal/SKILL.md` steps 1–5 yourself,
   synchronously. Its own step 2 loop guard (counting `[self-heal]`-tagged
   commits) already caps this at 3 attempts — don't add a second counter.
4. After a self-heal push, go back to step 1 (watch CI again). Stop looping
   the moment CI is green, self-heal's loop guard trips, or its step 4
   falls back to reporting instead of fixing.
5. Report the final state: PR URL, and either "green" or what's still
   failing plus the reason self-heal stopped.

## Do not

- Skip the review-and-fix step or the 3x-green gate to save time.
- Touch product/app code during the self-heal phase — same restriction as
  `.cursor/skills/self-heal/SKILL.md` step 4.
- Merge the PR yourself.
