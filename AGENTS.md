# Project instructions

This is the shared instruction source for Codex and Claude Code. `CLAUDE.md`
imports this file. Keep imports one-way and preserve explicit user instructions.

## Start work

1. Read `PROJECT.md`, `TASK.md`, and `.ai/handoff/current.md`.
2. Inspect the current branch, `git status --short`, and relevant diffs. Preserve
   unrelated work. Handoff notes are context, not proof of the current checkout.
3. Read the relevant documents in `design/docs/`; consult `DECISIONS.md` when a
   product or architecture decision matters. Do not load the whole design archive.
4. Consult `SKILLS.md` and applicable skills. If a tool or skill is absent, report
   the concrete limitation and use the documented local workflow when possible.

## Structure

- `apps/web/app`: thin routes and application shell; interactive UI belongs in
  `apps/web/features/<feature>`; application-wide compositions in `components/`.
- `apps/api/app/routers`: HTTP boundaries; `schemas`: Pydantic models;
  `services`: orchestration; `integrations`: external adapters.
- `packages/types`: TypeScript contracts, runtime guards, and shared fixtures.
  Python schemas remain Python; do not imply TypeScript is shared with Python.
- `packages/core`: pure logic without React, DOM, network or provider clients.
- `packages/ui`: shared tokens, controls and feedback. Application routes do not
  belong here; navigation remains a real framework link.
- `packages/config`: shared tooling. Optional modules are described in
  `design/docs/OPTIONAL_MODULES.md`; none is a production integration by default.

## Implement and verify

- Use TypeScript strict and Python type annotations. Keep server credentials
  server-side. Never add credentials or private user data to source or handoffs.
- Use Server Components by default, client components for interaction. Prefer
  native HTML, visible labels, real buttons/links and keyboard-accessible controls.
- Follow `design/docs/DESIGN_SYSTEM.md`. Reuse tokens and components; distinguish
  product-specific exceptions from shared rules.
- Preserve existing results and user input during requests and failures. Disable
  duplicate submission immediately; delayed feedback must not delay execution.
- Run `pnpm check` for shared/code changes. For changed user journeys or shared
  UI, run `pnpm test:browser` and inspect affected desktop/mobile views.
  For prose-only changes, run `pnpm check:template`; do not invent test results.
- Tests use local deterministic data. External accounts, paid providers,
  deployment and actual user outcomes require separate evidence.

## Maintain context

Follow the change-to-document matrix in `design/docs/DOCUMENTATION.md`.
Update only documents affected by the change. Keep current facts separate from
planned work and historical decisions. Do not turn a proposal into an accepted
decision without evidence of the user's choice or authority to make it.

At a meaningful checkpoint, before switching agents, or when pausing an unfinished
task, update `.ai/handoff/current.md`: target, constraints, branch/base commit,
relevant dirty files, completed changes, exact checks/results, next action and
blockers. Check it with `pnpm handoff:check`. Keep it short; link to evidence.
On completion, move durable facts to their owning document and clear stale next
steps. Read `design/docs/AGENT_HANDOFF.md` for the full handoff protocol.

## Git

Before a commit, inspect repository contribution instructions, commit settings and
recent subjects. Review `git diff --cached --stat` and `git diff --cached`.
Use an English Conventional Commit subject: `type(scope): imperative summary`,
lowercase summary, at most 72 characters, no trailing period. Do not bypass hooks.
Creating a commit does not authorize publishing, deployment or paid operations;
follow the user's actual scope. Never commit generated caches or local secrets.
