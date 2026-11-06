---
name: project-bootstrap
description: Initialize a fresh clone of this project template with a new identity and optional extension, then verify its local startup. Use for starting a new project from this template, not routine feature changes.
---

Read `README.md`, `AGENTS.md`, and `project.json`. Confirm this is the intended new
checkout. Use the user's project name, title, description and module choices;
ask only for essential missing identity information. Existing initialized products
must not be reset to template state.

Run `node scripts/init-project.mjs --name <slug> --title <title> --description <text>`
from the repository root. Add `--extension` only when requested. Pass arguments
safely; do not interpolate untrusted text into shell syntax.

Run frozen pnpm installation (normal installation when the extension adds an
importer), `pnpm setup:api`, and `pnpm check`. Follow README for browser verification.
Fill PRODUCT_SPEC with the user's actual goals; preserve unresolved decisions.
Update PROJECT, TASK and the handoff with actual results and remaining work.

Do not create cloud resources, publish, install unrelated plugins or reuse secrets
unless the user's task authorizes those actions. Report the created location,
startup command, verification and outstanding integration work.
