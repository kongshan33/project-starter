---
name: fastapi-conventions
description: Add or modify FastAPI routes and Pydantic contracts in this template's API workspace, keeping service and integration boundaries explicit. Use for API work, not general Python scripts.
---

Read `design/docs/ARCHITECTURE.md` and neighboring code. Routers express HTTP;
Pydantic v2 schemas validate input/output; services own orchestration; integrations
own providers and persistence. Use typed return values and Annotated for dependency,
path and query declarations when needed.

Keep private identity server-derived. Configured storage failures remain failures;
do not silently replace persistence with an in-memory store. Keep public response
models separate from private job/provider data. Apply timeouts at external boundaries.

When a Web contract changes, update TypeScript guards and shared fixtures along
with Python schemas. Test meaningful failure/ownership/idempotency boundaries that
apply, not just happy-path object shapes. Run the API lint, typecheck and test tasks.
Use current official FastAPI/Pydantic docs for version-sensitive behavior.
