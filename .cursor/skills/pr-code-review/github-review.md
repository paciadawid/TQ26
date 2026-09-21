# Post the review on GitHub

Load this file only when the user asked to leave comments, submit a review, or post findings. Discover GitHub MCP schemas before calling.

## Verdict

| Condition                                                | `event`           |
| -------------------------------------------------------- | ----------------- |
| User asked to approve **and** zero **blocking** findings | `APPROVE`         |
| At least one **blocking** finding                        | `REQUEST_CHANGES` |
| Otherwise                                                | `COMMENT`         |

Never `APPROVE` on your own initiative.

## Steps

Completion: a submitted review URL, or an explicit GitHub error.

1. `pull_request_review_write` `create` with **no** `event` (pending review). `commitID` = PR head SHA. `body` = the aggregated `## Standards` / `## Spec` report plus the one-line summary.
2. For each **blocking** finding with a file and line: `add_comment_to_pending_review`
   - `path`: repo-relative path
   - `subjectType`: `LINE`
   - `side`: `RIGHT`
   - `line`: the new-file line from the diff
   - `body`: severity, cited rule or spec line, one-sentence finding
3. Group **suggestion** / **nit** into the review body. Line-comment a suggestion only when a specific hunk is required to make it actionable.
4. `pull_request_review_write` `submit_pending` with the `event` from the table and the same summary `body`.

If a pending review already exists for this user, `delete_pending` first, then start at step 1.

Cap: at most 15 line comments. Remaining findings stay in the review body.

Return the PR URL and the submitted verdict to the user.
