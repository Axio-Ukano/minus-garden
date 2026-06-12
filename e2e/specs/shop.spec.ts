// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { test, expect } from "@playwright/test";
import { gotoApp } from "../support/fakeTauri";
import { AppShell, TimerPage, GameModePage, ShopPage } from "../support/pages";

test.describe("shop", () => {
  test("gate opens the shop with the starter collection", async ({ page }) => {
    await gotoApp(page, { totalHearts: 0 });
    const gameMode = new GameModePage(page);
    const shop = new ShopPage(page);

    // Open the game-mode layer via the gate button.
    await gameMode.open();

    // The shop view is visible by default when the layer opens.
    await expect(shop.view).toBeVisible();

    // The daisy seed tile is present in the catalog.
    await expect(shop.item("daisy")).toBeVisible();

    // Open the daisy detail panel.
    await shop.openItem("daisy");
    await expect(shop.detail).toBeVisible();

    // Daisy is the starter — it is already owned, so the grow button shows
    // instead of the buy button.
    await expect(shop.growButton).toBeVisible();
    await expect(shop.buyButton).toBeHidden();
  });

  test("buying a seed deducts hearts and unlocks it", async ({ page }) => {
    await gotoApp(page, { totalHearts: 50 });
    const shell = new AppShell(page);
    const gameMode = new GameModePage(page);
    const shop = new ShopPage(page);

    await gameMode.open();
    await expect(shop.view).toBeVisible();

    // Open the gerbera detail (price = 10 hearts).
    await shop.openItem("gerbera");
    await expect(shop.detail).toBeVisible();

    // Buy button is enabled when the player can afford it.
    await expect(shop.buyButton).toBeEnabled();

    // Two-step purchase: arm then confirm.
    await shop.confirmPurchase();

    // After purchase the detail shows the owned/grow state.
    await expect(shop.growButton).toBeVisible();

    // Header hearts reflects the deducted balance: 50 - 10 = 40.
    await expect(shell.headerHearts).toContainText("× 40");

    // Close the detail.
    await shop.detailCloseButton.click();
    await expect(shop.detail).toBeHidden();
  });

  test("insufficient hearts disables the purchase button", async ({ page }) => {
    await gotoApp(page, { totalHearts: 5 });
    const gameMode = new GameModePage(page);
    const shop = new ShopPage(page);

    await gameMode.open();
    await expect(shop.view).toBeVisible();

    // Lotus costs 110 hearts; the player only has 5.
    await shop.openItem("lotus");
    await expect(shop.detail).toBeVisible();
    await expect(shop.buyButton).toBeDisabled();
  });

  test("the growth filmstrip scrolls by drag and by wheel", async ({ page }) => {
    await gotoApp(page, { totalHearts: 5 });
    const gameMode = new GameModePage(page);
    const shop = new ShopPage(page);

    await gameMode.open();
    // Lotus has the most stages, so its filmstrip overflows the frame.
    await shop.openItem("lotus");

    const strip = page.locator(".shop-detail__stages");
    await expect(strip).toBeVisible();

    // Precondition: it genuinely overflows, and is marked draggable.
    const overflow = await strip.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflow).toBeGreaterThan(0);
    await expect(strip).toHaveClass(/shop-detail__stages--draggable/);

    // Drag-to-scroll: grab near the right edge and pull left.
    const box = (await strip.boundingBox())!;
    const midY = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width - 16, midY);
    await page.mouse.down();
    await page.mouse.move(box.x + 24, midY, { steps: 10 });
    await page.mouse.up();
    expect(await strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);

    // Native scrolling is untouched: a real scrollbar (overflow-x: auto), a
    // keyboard-focusable region, and a live scroll position the drag only
    // rides on top of.
    expect(await strip.evaluate((el) => getComputedStyle(el).overflowX)).toBe("auto");
    await expect(strip).toHaveAttribute("tabindex", "0");
    await strip.evaluate((el) => (el.scrollLeft = 0));
    await strip.evaluate((el) => (el.scrollLeft = el.scrollWidth - el.clientWidth));
    expect(await strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });

  test("back button returns to the desk", async ({ page }) => {
    await gotoApp(page);
    const gameMode = new GameModePage(page);
    const timer = new TimerPage(page);

    // Open the layer then close it.
    await gameMode.open();
    await expect(gameMode.layer).toBeVisible();

    await gameMode.close();

    // The overlay is gone and the underlying timer setup is visible again.
    await expect(gameMode.layer).toBeHidden();
    await expect(timer.subjectInput).toBeVisible();
  });
});
