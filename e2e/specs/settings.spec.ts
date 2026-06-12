// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { test, expect } from "@playwright/test";
import { gotoApp } from "../support/fakeTauri";

test.describe("settings · sound", () => {
  test("the ambient info icon stays hoverable above its tile and reveals the tooltip", async ({
    page,
  }) => {
    await gotoApp(page);

    await page.getByRole("button", { name: "Open settings" }).click();
    await page.getByRole("button", { name: /sound/i }).click();

    // The info icon overlays the tile's corner. If the tile's hover state ever
    // stacks over it again, this .hover() fails its hit-test — that is the
    // regression guard. The tooltip bubble appearing confirms the icon, not the
    // tile, received the pointer.
    const infoIcon = page.locator(".ambient-btn-wrap").first().locator(".info-tooltip-btn");
    await expect(infoIcon).toBeVisible();
    await infoIcon.hover();

    await expect(page.locator(".info-tooltip-bubble--portal")).toBeVisible();
  });
});
