# Contributing

Read [AGENTS.md](AGENTS.md) and the relevant product/design document first.
Use `pnpm install --frozen-lockfile`, `pnpm setup:api`, then `pnpm check`.
UI changes also require `pnpm test:browser` and visual inspection.

Commit subjects follow Conventional Commits in English, at most 72 characters.
Inspect staged changes before committing. Keep document updates with their owning
behavior change. In a PR, explain the user-visible result, verification and any
remaining limitations; distinguish simulated integrations from real ones.
