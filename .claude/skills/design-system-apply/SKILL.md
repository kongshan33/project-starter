---
name: design-system-apply
description: Build or change this project's UI using its accepted design system, shared controls and asynchronous-state rules. Use for interface implementation or consistency work, not backend-only tasks or unrelated visual styles.
---

Read `design/docs/DESIGN_SYSTEM.md` and the affected feature's product behavior.
Inspect `packages/ui` and the `/design-system` example before adding a control.
Reuse existing tokens and semantics; describe a product-specific exception within
its actual scope. Keep shared controls independent of application routes.

For asynchronous work, cover initial, waiting, success, empty and error states
that apply. Prevent duplicate actions immediately, retain input and prior results,
and reject obsolete results. Preserve component identity when focus or media relies
on it. Use visible labels, keyboard controls and reduced-motion behavior.

When modern platform behavior is uncertain, consult current primary docs or an
installed modern-web-guidance skill. Run appropriate code checks, browser tests and
desktop/narrow visual inspection. Synchronize the owning design rules and examples.
