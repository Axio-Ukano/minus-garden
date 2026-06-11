// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import type { Page, Locator } from "@playwright/test";

// ─── Page Object Model ────────────────────────────────────────────────────────
//
// All selectors live here, anchored to data-testid (stable across copy, i18n and
// layout changes). When the UI changes, update the page object — not the specs.

export class AppShell {
  constructor(private readonly page: Page) {}

  nav(tab: "timer" | "history" | "music"): Locator {
    return this.page.getByTestId(`nav-${tab}`);
  }

  goTo(tab: "timer" | "history" | "music"): Promise<void> {
    return this.nav(tab).click();
  }

  /** "× N" hearts counter in the header. */
  get headerHearts(): Locator {
    return this.page.getByTestId("header-hearts");
  }
}

export class TimerPage {
  constructor(private readonly page: Page) {}

  get subjectInput(): Locator {
    return this.page.getByTestId("subject-input");
  }

  get durationInput(): Locator {
    return this.page.getByTestId("duration-input");
  }

  get startButton(): Locator {
    return this.page.getByTestId("timer-start");
  }

  get finishedView(): Locator {
    return this.page.getByTestId("timer-finished");
  }

  get finishedHearts(): Locator {
    return this.page.getByTestId("finished-hearts");
  }

  get viewHistoryButton(): Locator {
    return this.page.getByTestId("finished-view-history");
  }

  async configure(subject: string, durationMinutes: number): Promise<void> {
    await this.subjectInput.fill(subject);
    // Close the combobox dropdown so it can't overlay the duration field.
    await this.subjectInput.press("Escape");
    await this.durationInput.fill(String(durationMinutes));
    await this.durationInput.press("Enter");
  }

  start(): Promise<void> {
    return this.startButton.click();
  }
}

export class HistoryPage {
  constructor(private readonly page: Page) {}

  get hearts(): Locator {
    return this.page.getByTestId("history-hearts");
  }

  get sessionCards(): Locator {
    return this.page.getByTestId("session-card");
  }

  get empty(): Locator {
    return this.page.getByTestId("history-empty");
  }
}

// ─── Game-mode layer ──────────────────────────────────────────────────────────

export class GameModePage {
  constructor(private readonly page: Page) {}

  /** Gate button that slides open the game-mode overlay (visible on all tabs). */
  get gateButton(): Locator {
    return this.page.getByTestId("gamemode-gate");
  }

  /** Slide-in overlay that hosts the shop, garden, and mini-games sections. */
  get layer(): Locator {
    return this.page.getByTestId("gamemode-layer");
  }

  /** Rail navigation buttons inside the layer. */
  section(name: "shop" | "garden" | "minigames"): Locator {
    return this.page.getByTestId(`gamemode-section-${name}`);
  }

  /** Back/close button inside the layer. */
  get backButton(): Locator {
    return this.page.getByTestId("gamemode-back");
  }

  /** Open the layer by clicking the gate button. */
  open(): Promise<void> {
    return this.gateButton.click();
  }

  /** Close the layer via the back button. */
  close(): Promise<void> {
    return this.backButton.click();
  }
}

// ─── Shop view (inside the game-mode layer) ───────────────────────────────────

export class ShopPage {
  constructor(private readonly page: Page) {}

  /** The shop view container. */
  get view(): Locator {
    return this.page.getByTestId("shop-view");
  }

  /** Seed listing tile for a given species id. */
  item(speciesId: string): Locator {
    return this.page.getByTestId(`shop-item-${speciesId}`);
  }

  /** Detail panel that slides in when a seed is selected. */
  get detail(): Locator {
    return this.page.getByTestId("shop-detail");
  }

  /**
   * Primary action button in the detail panel.
   * On first click it becomes the confirm button; on second click the purchase completes.
   */
  get buyButton(): Locator {
    return this.page.getByTestId("shop-buy");
  }

  /** Confirmation button that appears after the first buy click. */
  get confirmButton(): Locator {
    return this.page.getByTestId("shop-confirm");
  }

  /** "Grow" button shown when the player already owns the selected seed. */
  get growButton(): Locator {
    return this.page.getByTestId("shop-grow");
  }

  /** Close button on the detail panel. */
  get detailCloseButton(): Locator {
    return this.page.getByTestId("shop-detail-close");
  }

  /** Open the detail panel for a given species by clicking its tile. */
  openItem(speciesId: string): Promise<void> {
    return this.item(speciesId).click();
  }

  /** Execute a full purchase: click buy → click confirm. */
  async confirmPurchase(): Promise<void> {
    await this.buyButton.click();
    await this.confirmButton.click();
  }
}
