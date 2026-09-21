---
name: pr-code-review
description: >-
  Reviews a GitHub pull request on two axes: Standards (this repo's Playwright
  QA rules) and Spec (PR body / linked issue). Use when the user asks to review
  a PR or to leave GitHub review comments.
icon: git-branch
color: blue
---

# PR code review

Two-axis review of a pull request (or the current branch if no PR exists):

- **Standards**: does the diff follow `.cursor/rules/`?
- **Spec**: does the diff implement what the PR / issue asked for?

Run the axes as **parallel readonly subagents**, then report them side by side. Do not merge or rerank findings. Do not edit code or post to GitHub unless the user asked.

Prefix shell with `rtk` (`rtk gh`, `rtk git`).

## Process

### 1. Resolve the target

Completion: owner, repo, PR number (or a confirmed local-only diff), base ref, head SHA.

| User said                  | Do this                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| PR number or GitHub URL    | Parse `owner`, `repo`, `pullNumber`                                                                                  |
| "this PR" / current branch | `rtk gh pr view --json number,url,title,body,baseRefName,headRefOid`                                                 |
| No PR                      | Local review: `rtk git rev-parse --abbrev-ref HEAD` and `rtk git diff origin/<default>...HEAD`. Skip GitHub posting. |

Confirm the diff is non-empty before spawning reviewers. Empty diff → stop and say so.

### 2. Gather (parallel)

For a GitHub PR, discover GitHub MCP schemas then call:

- `pull_request_read` `get`
- `pull_request_read` `get_diff`
- `pull_request_read` `get_files`
- `pull_request_read` `get_commits`
- `pull_request_read` `get_check_runs`

Also list rule files: `.cursor/rules/*.mdc`. Pass **paths**, not file bodies, to the Standards agent.

### 3. Identify the spec

In order:

1. PR title + body
2. Issue refs in the body or commits (`#123`, `Closes #45`) — fetch via GitHub issue tools
3. A path the user passed
4. A file under `docs/` or `specs/` matching the branch name

If none: Spec agent reports "no spec available" and only flags obvious scope creep. Do not invent requirements.

### 4. Spawn both axes

Launch in **one** message, both `readonly`, `run_in_background: false`:

| Axis      | `subagent_type`         | Prompt must include                                                    |
| --------- | ----------------------- | ---------------------------------------------------------------------- |
| Standards | `pr-standards-reviewer` | Diff (or `git diff` command), commit list, rule file paths             |
| Spec      | `pr-spec-reviewer`      | Diff, commit list, spec text or "no spec available", check-run summary |

If those types are missing, use `generalPurpose` and instruct it to follow `.cursor/agents/pr-standards-reviewer.md` or `.cursor/agents/pr-spec-reviewer.md`.

Subagents must not edit files, commit, push, or post reviews.

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec`, verbatim or lightly cleaned.

End with one line: findings per axis, and the worst issue **within each axis**. Do not pick a winner across axes.

Severity in this report:

- **blocking**: documented rule broken, or a spec requirement missing/wrong
- **suggestion**: judgement call (smell, maintainability)
- **nit**: optional

### 6. Post to GitHub (only if asked)

If the user asked to leave comments, submit a review, or post findings, follow [github-review.md](github-review.md). Otherwise stop after the chat report.

## Do not

- Fix findings unless the user asked
- Approve a PR unless the user explicitly asked to approve **and** there are zero blocking findings
- Restate `.cursor/rules/` in the report; cite the rule file instead
