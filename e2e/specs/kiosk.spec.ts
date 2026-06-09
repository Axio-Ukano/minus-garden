import { test, expect } from "@playwright/test";
import { gotoApp } from "../support/fakeTauri";

test.describe("kiosk guards (behaves like a game, not a browser)", () => {
  test("suppresses the right-click context menu", async ({ page }) => {
    await gotoApp(page);

    // dispatchEvent returns false when a listener called preventDefault.
    const prevented = await page.evaluate(() => {
      const evt = new MouseEvent("contextmenu", { cancelable: true, bubbles: true });
      return !document.dispatchEvent(evt);
    });
    expect(prevented).toBe(true);
  });

  test("swallows the devtools shortcut (F12)", async ({ page }) => {
    await gotoApp(page);

    const prevented = await page.evaluate(() => {
      const evt = new KeyboardEvent("keydown", { key: "F12", cancelable: true, bubbles: true });
      return !document.dispatchEvent(evt);
    });
    expect(prevented).toBe(true);
  });
});
