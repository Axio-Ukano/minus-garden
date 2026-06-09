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
