import { test, expect } from "@playwright/test";
import { gotoApp } from "../support/fakeTauri";
import { AppShell, TimerPage, HistoryPage } from "../support/pages";

test.describe("navigation", () => {
  test("opens on the timer view and switches tabs", async ({ page }) => {
    await gotoApp(page);
    const shell = new AppShell(page);
    const timer = new TimerPage(page);
    const history = new HistoryPage(page);

    // Default view is the timer setup.
    await expect(timer.subjectInput).toBeVisible();

    // History tab → empty state (no seeded sessions).
    await shell.goTo("history");
    await expect(history.empty).toBeVisible();
    await expect(timer.subjectInput).toBeHidden();

    // Back to timer.
    await shell.goTo("timer");
    await expect(timer.subjectInput).toBeVisible();
    await expect(history.empty).toBeHidden();
  });
});
