// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { test, expect } from "@playwright/test";
import { gotoApp } from "../support/fakeTauri";
import { AppShell, TimerPage, HistoryPage } from "../support/pages";

test.describe("study session flow", () => {
  test("completing a 5-minute session awards a heart and records history", async ({ page }) => {
    await gotoApp(page);
    // Control time so the countdown can be fast-forwarded instead of waited out.
    await page.clock.install();

    const shell = new AppShell(page);
    const timer = new TimerPage(page);
    const history = new HistoryPage(page);

    await timer.configure("Focus E2E", 5);
    await timer.start();

    // start() runs after an async subject-create, so wait until the timer is
    // actually running (setup view gone) before fast-forwarding — otherwise the
    // countdown interval may not exist yet.
    await expect(timer.startButton).toBeHidden();

    // Run the fake clock past the 5-minute (300s) countdown.
    await page.clock.runFor(305_000);

    // Finished view shows the earned heart (floor(5 / 5) = 1).
    await expect(timer.finishedView).toBeVisible();
    await expect(timer.finishedHearts).toContainText("+1");

    // Header hearts counter reflects the new balance reactively.
    await expect(shell.headerHearts).toContainText("1");

    // History persists the session and the heart total.
    await timer.viewHistoryButton.click();
    await expect(history.sessionCards).toHaveCount(1);
    await expect(history.sessionCards.first()).toContainText("Focus E2E");
    await expect(history.hearts).toContainText("1");
  });
});
