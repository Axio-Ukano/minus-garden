# ADR-0009: E2E with Playwright against the frontend and faked Tauri transport

- **Status:** Accepted
- **Date:** 2026-06-09
- **Deciders:** @author

## Context

The manual smoke test (playbook §4) covers the critical flow: configure session → complete → view in History → hearts. Repeating it by hand on every PR is work and is skippable. Playbook §14 had E2E with Playwright as a deferral ("when there are 2 critical views that break each other"); the app now has several views (timer, history, music, settings), so the trigger has been met.

A decisive technical detail: **Playwright does not drive the native Tauri window** — it automates browsers. At `localhost:1420` there is no `window.__TAURI_INTERNALS__`, so every `invoke` would throw. For real native E2E (window + IPC + SQLite) the Tauri path is `tauri-driver` + WebDriver (WebdriverIO/Selenium), not Playwright, and it does not fit the current CI (Ubuntu, pnpm-only, no WebView2 or display).

## Decision

Mount Playwright against the Vite frontend with the **Tauri transport faked in memory**:

- `e2e/support/fakeTauri.ts` injects (via `addInitScript`) a `window.__TAURI_INTERNALS__.invoke` that implements the 8 commands with the same shapes as Rust, over in-memory state with a parametrizable _seed_. The real frontend + `repository` + stores are exercised; only SQLite/Rust is faked. The `repository` boundary (ADR-0005) is exactly what makes this clean.
- `e2e/support/pages.ts` — Page Object Model; selectors are anchored to `data-testid` (stable against copy, language, and layout changes). UI changes → update the page object, not the specs.
- Initial specs: tab navigation, full session flow (using `page.clock` to advance the countdown without waiting 5 minutes), and kiosk guards (anti context-menu / devtools).
- Scripts `pnpm e2e[:ui|:headed|:report]`; `e2e.yml` workflow separate from `validate.yml`.

**Native E2E (tauri-driver)** is left as an explicit deferral, with its trigger documented.

## Consequences

### Good

- The critical flow is validated automatically on every PR; the manual smoke test is reduced to "actually persists in SQLite".
- Resilient to UI changes (testids + POM), as requested for scaling screens/buttons.
- `page.clock` gives deterministic, fast tests (no real waits).
- Parametrizable seed → easy to cover states (empty history, pre-populated, custom subjects).

### Bad

- Does **not** cover the real IPC→SQLite path or migrations (that is the deferred native E2E). The manual persistence smoke test remains necessary until then.
- Adding `data-testid` couples (minimally) the markup to tests. Accepted: it is the standard method and i18n-stable.
- `page.clock.install()` must be called **after** `goto` to intercept already-mounted timers (learned during implementation).

### Neutral

- `e2e/` sits outside the app's `tsconfig` and type-aware lint (override in `eslint.config.js`); Playwright type-checks it at runtime.

## Considered Alternatives

### Native E2E with tauri-driver + WebdriverIO now

Would cover real IPC+SQLite and replace the entire smoke test, but is heavy, Windows-specific for the driver, and does not fit the current CI. Deferred; trigger: when the DB path is a recurring source of regressions or a public distribution is being prepared.

### Mock at the `repository` level (not the transport)

Simpler, but would leave `repository` and the `tauriInvoke` wrapper untested. Injecting at the transport level exercises the entire client chain. Chosen for greater real coverage.

## Notes / References

- Implementation: `playwright.config.ts`, `e2e/`, scripts in `package.json`, `.github/workflows/e2e.yml`.
- Related: ADR-0005 (data boundary), ADR-0008 (kiosk mode).
