---
name: project-doc-sync
description: Reconcile repository documentation and the active handoff with a completed or in-progress code change. Use when behavior, architecture, design rules, project status or agent ownership changes.
---

Read `design/docs/DOCUMENTATION.md` and `design/docs/AGENT_HANDOFF.md`. Inspect the
actual diff and relevant evidence. Use the update matrix to choose document owners;
do not rewrite every document for a local change.

Keep intended behavior, actual implementation and observed validation distinct.
Do not turn simulated tests into live integration acceptance. Preserve accepted
user constraints and mark pending choices. Move historical material out of current
status instead of prepending duplicate changelogs.

For a handoff, record the current branch/base, dirty work, objective, constraints,
completed files, exact checks and next operation. Do not include credentials or
private user data. Run `pnpm check:template` and `pnpm handoff:check`; report any
uncertainty the checks cannot resolve.
