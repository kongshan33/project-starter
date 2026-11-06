import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("real Web → API preview and keyboard navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByLabel("Idea title").fill("  Build something useful  ");
  await page.getByRole("button", { name: "Create preview" }).click();
  await expect(page.getByRole("heading", { name: "Build something useful" })).toBeVisible();
  await expect(page.getByText("3 words · 22 characters")).toBeVisible();
  await page.getByRole("link", { name: "Design system", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quiet by design.");
});

test("slow failure preserves input/result and blocks duplicate submission", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Idea title").fill("Previous result");
  const button = page.getByRole("button", { name: "Create preview" });
  await button.click();
  await expect(page.getByRole("heading", { name: "Previous result" })).toBeVisible();
  const initial = await button.boundingBox();
  let requests = 0;
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/preview", async route => {
    requests++;
    await gate;
    await route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"Synthetic failure"}' });
  });
  await page.getByLabel("Idea title").fill("Keep this draft");
  await button.click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute("aria-busy", "true");
  await expect(button.locator(".ui-button-progress")).toHaveCount(0);
  await expect(button.locator(".ui-button-progress")).toBeVisible();
  const pending = await button.boundingBox();
  expect(pending?.width).toBe(initial?.width);
  expect(pending?.height).toBe(initial?.height);
  await page.locator("form").evaluate(form => (form as HTMLFormElement).requestSubmit());
  expect(requests).toBe(1);
  await expect(page.getByRole("heading", { name: "Previous result" })).toBeVisible();
  release();
  await expect(page.locator("form").getByRole("alert")).toContainText("please try again");
  await expect(page.getByLabel("Idea title")).toHaveValue("Keep this draft");
  await expect(button).toBeEnabled();
  await page.unroute("**/api/preview");
  await button.click();
  await expect(page.getByRole("heading", { name: "Keep this draft" })).toBeVisible();
});

test("native constraints prevent empty submission and proxy rejects malformed input", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create preview" }).click();
  await expect(page.getByLabel("Idea title")).toBeFocused();
  expect((await request.post("/api/preview", { data: { title: " " } })).status()).toBe(422);
  expect((await request.post("/api/preview", { data: Buffer.from("{"), headers: { "Content-Type": "application/json" } })).status()).toBe(400);
});

for (const width of [1440, 390]) for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`layout and control states: ${width}px, motion=${reducedMotion}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1100 });
    await page.emulateMedia({ reducedMotion });
    await mkdir("output/playwright", { recursive: true });
    for (const route of ["/", "/design-system"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `output/playwright/${route === "/" ? "overview" : "design"}-${width}-${reducedMotion}.png`, fullPage: true, caret: "initial" });
    }
    if (reducedMotion === "reduce") {
      expect(await page.getByRole("button", { name: "Primary action" }).evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s");
    }
  });
}
