import { test, expect } from "@playwright/test";

test("watchlist persists after refresh", async ({ page }) => {
  await page.goto("/");

  await page.click("text=Add to Watchlist");

  await page.reload();

  await expect(page.getByText("In Watchlist")).toBeVisible();
});

test("offline mode still works", async ({ page, context }) => {
  await page.goto("/");

  await context.setOffline(true);

  await page.click("text=Add to Watchlist");

  await page.reload();

  await expect(page.getByText("In Watchlist")).toBeVisible();
});