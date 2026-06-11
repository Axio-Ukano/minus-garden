// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
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
