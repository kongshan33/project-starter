import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3210", trace: "retain-on-failure" },
  webServer: [
    {
      command: "uv run --project apps/api --locked uvicorn app.main:app --app-dir apps/api --host 127.0.0.1 --port 8210",
      url: "http://127.0.0.1:8210/health", reuseExistingServer: false, timeout: 60000,
    },
    {
      command: "pnpm --filter @starter/web exec next dev --hostname 127.0.0.1 --port 3210",
      url: "http://127.0.0.1:3210", reuseExistingServer: false, timeout: 120000,
      env: { API_INTERNAL_URL: "http://127.0.0.1:8210", NEXT_TELEMETRY_DISABLED: "1" },
    },
  ],
});
