# Changelog

All notable changes to **Minu's Garden** are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versioned with [SemVer](https://semver.org/).

---

## [0.10.0](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.9.0...minus-garden-v0.10.0) (2026-06-12)


### Added

* **shop:** seed shop, game-mode layer, inventory, and first economy pass ([#55](https://github.com/Axio-Ukano/minus-garden/issues/55)) ([1298190](https://github.com/Axio-Ukano/minus-garden/commit/12981900a967e6f832eb4008481441521da702e8))

## [0.9.0](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.8.0...minus-garden-v0.9.0) (2026-06-11)


### Added

* **plants:** stage close-up navigation arrows with slide animation ([#53](https://github.com/Axio-Ukano/minus-garden/issues/53)) ([95489af](https://github.com/Axio-Ukano/minus-garden/commit/95489af8d5eb29a2d98f1d69e1a8c913d6ecef4a))


### Fixed

* **toast:** independent per-toast lifecycle, dedup, and close button ([#52](https://github.com/Axio-Ukano/minus-garden/issues/52)) ([55ecfb3](https://github.com/Axio-Ukano/minus-garden/commit/55ecfb31e8b81ed9e9c6a3f72735c57f692dedd8))

## [0.8.0](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.7.0...minus-garden-v0.8.0) (2026-06-10)

### Added

- seed packet sprites per species + stage close-up in stages modal ([#46](https://github.com/Axio-Ukano/minus-garden/issues/46)) ([4b52beb](https://github.com/Axio-Ukano/minus-garden/commit/4b52bebb4380b189e22c23a70d220f3cd4317b2b))

## [0.7.0](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.6.1...minus-garden-v0.7.0) (2026-06-10)

### Added

- redesigned plant sprites v2 — unified 24×30 grid with shared pot ([#44](https://github.com/Axio-Ukano/minus-garden/issues/44)) ([76375ea](https://github.com/Axio-Ukano/minus-garden/commit/76375ea37a0cf3adf253e7448da868c06138f833))

## [0.6.1](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.6.0...minus-garden-v0.6.1) (2026-06-09)

### Fixed

- respect mute in timer SFX, prevent heart loss, wall-clock countdown ([#42](https://github.com/Axio-Ukano/minus-garden/issues/42)) ([688755c](https://github.com/Axio-Ukano/minus-garden/commit/688755c18ca5ec6d0d511050215f4c9e6e158209))

## [0.6.0](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.5...minus-garden-v0.6.0) (2026-06-09)

### Added

- game-mode webview, versioned migrations and data-layer boundary ([#39](https://github.com/Axio-Ukano/minus-garden/issues/39)) ([47ba68d](https://github.com/Axio-Ukano/minus-garden/commit/47ba68d421dba6bb9a4b6fb01985ebf5fe961f52))

## [0.5.5](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.4...minus-garden-v0.5.5) (2026-05-20)

### Fixed

- nest InfoTooltip outside ambient-btn to avoid button-in-button ([#37](https://github.com/Axio-Ukano/minus-garden/issues/37)) ([22595db](https://github.com/Axio-Ukano/minus-garden/commit/22595dbcc7eaae42d78ef8d8d9070bc5f160e049))

## [0.5.4](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.3...minus-garden-v0.5.4) (2026-05-20)

### Changed

- comply with react-hooks v7 strict rules ([#35](https://github.com/Axio-Ukano/minus-garden/issues/35)) ([749e34a](https://github.com/Axio-Ukano/minus-garden/commit/749e34a3b68bd151dedc331c5eb6452e84c6ffce))

## [0.5.3](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.2...minus-garden-v0.5.3) (2026-05-06)

### Fixed

- **ci:** rewrite Cargo.lock auto-sync with fresh clone approach ([#29](https://github.com/Axio-Ukano/minus-garden/issues/29)) ([42e9d69](https://github.com/Axio-Ukano/minus-garden/commit/42e9d69d7b7b9d19beb1da517d7e79f0bae141dc))

## [0.5.2](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.1...minus-garden-v0.5.2) (2026-05-05)

### Fixed

- **ci:** add explicit permissions to validate and audit workflows ([#27](https://github.com/Axio-Ukano/minus-garden/issues/27)) ([bf0485f](https://github.com/Axio-Ukano/minus-garden/commit/bf0485fe26a823b32845b3c9c4fd93b1a74ca48b))

## [0.5.1](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.0...minus-garden-v0.5.1) (2026-05-05)

### Fixed

- **deps:** update Cargo.lock to patch rand unsoundness (RUSTSEC-2024-0034) ([#23](https://github.com/Axio-Ukano/minus-garden/issues/23)) ([0dd303b](https://github.com/Axio-Ukano/minus-garden/commit/0dd303b9ed44a2b9f62e2708d8861a7bb64cb362))

## [0.5.0] — 2026-04-28

Pull Request `feat/tier-s-consolidation`: 26 atomic commits bringing the repository to tier S without touching the architecture. Each commit leaves `pnpm validate && pnpm build` green.

#### Added

- Tooling scripts: `typecheck`, `format:check`, `lint:fix`, `validate`, `test`, `test:watch`, `test:coverage`, `circular`, `prepare`.
- Vitest 4 + jsdom + `@testing-library/react` + `@testing-library/jest-dom`.
- Test suites: `timerStore`, `plantService`, `usePlantGrowth`, `lib/tauri`, `historyStore`, `audioService` (64 tests). Coverage at 95% lines / 92% functions over covered modules; gating threshold at 60%.
- `madge` for cycle detection (`pnpm circular`).
- `simple-git-hooks` + `lint-staged` with a pre-commit hook that runs `eslint --fix --max-warnings=0` + `prettier --write` on staged files only.
- `.github/workflows/validate.yml`: typecheck + lint + format:check + circular + test:coverage + build on every PR and push to `main`.
- `.github/workflows/audit.yml`: weekly cron (Mondays 08:00 UTC) running `pnpm audit --prod` and `cargo audit`.
- `.github/PULL_REQUEST_TEMPLATE.md` with a full checklist.
- `CONTRIBUTING.md` (workflow, Conventional Commits, PR rules).
- `docs/adr/` folder with the MADR template (`0000-template.md`) and 4 retroactive ADRs:
  - `0001-csp-tauri.md` — explicit CSP policy.
  - `0002-zustand-flat-stores.md` — one Zustand store per feature.
  - `0003-sqlite-local.md` — local persistence with rusqlite.
  - `0004-module-boundaries-and-alias.md` — barrels + `@/*` alias + enforcement.
- `@types/node` for `vite.config.ts`.
- `src/test-types.d.ts` augmenting Vitest with jest-dom matchers.

#### Changed

- ESLint: `no-explicit-any` and `no-unused-vars` elevated to `error`. Type-aware rules enabled (`no-floating-promises`, `no-misused-promises` with `checksVoidReturn.attributes=false`). `eslint-plugin-import` with `import/no-cycle` and `no-restricted-imports` blocking the `@/modules/*/*` pattern: cross-module imports must go through the barrel `@/modules/<name>`, intra-module imports must be relative.
- TypeScript: `noUncheckedIndexedAccess: true` enabled. Fallout fixed in `plantService`, `PlantDisplay`, `PlantStagesModal`, `TimerSetupView`, `MiniPlayer`, `audioStore` (12 sites, explicit guards or `?? fallback`).
- `tauri.conf.json`: explicit CSP replaces `null` (default-src 'self'; img/media include `asset:`/`asset.localhost`; style allows Google Fonts; font includes `fonts.gstatic.com`; connect-src includes `ipc:` and `http://ipc.localhost`).
- `historyStore.loadUserState`: adds `console.error` in its `catch` for developer diagnostics (the error toast is handled by the bridge).
- `.vscode/extensions.json`: recommends `dbaeumer.vscode-eslint` and `esbenp.prettier-vscode` in addition to Tauri and rust-analyzer.
- `README.md`: rewritten (repo structure, scripts, conventions, links to docs and ADRs).
- `docs/architecture.md`: reflects boundaries enforcement, current Tauri commands, tooling/CI section, updated folder schema.
- `docs/requirements.md`: adds entries for v0.3.1–0.3.3 (catalogue + i18n + sprites), v0.4.0 / v0.4.1 (cleanup), v0.5.0 (with conscious deferrals).

#### Removed

- `tailwindcss` and `@tailwindcss/vite` (no real usage: the stack is Vanilla CSS with Custom Properties + BEM). CSS bundle unchanged (34.54 kB) confirms the plugin was inert.
- `@types/howler` moved from `dependencies` to `devDependencies` (pure type package).
- `@ts-expect-error` in `vite.config.ts` (unnecessary after adding `@types/node`).

#### Fixed

- 8 fire-and-forget promises in `App.tsx`, `HistoryView.tsx` and `timerStore.ts` are now explicit with `void` (detected by `no-floating-promises`).
- `pnpm-lock.yaml` added to `.prettierignore` (lockfiles must not be formatted).

---

## [0.4.1] — 2026-04-27

#### Changed

- `PlantStagesModal` moved from `src/modules/timer/components/` to `src/modules/plants/` and re-exported through the `plants` barrel (the modal belongs conceptually to the `plants` module, not `timer`).
- `TimerSetupView` and `TimerActiveView` consume `plants`, `settings`, `audio` and `subjects` exclusively via their barrels (`@/modules/*`) instead of relative paths to internal files.

#### Added

- `src/components/index.ts` (barrel) for consistency with the barrel convention in `src/modules/`. Re-exports `useToastStore` and `pushToast`.

---

## [0.4.0] — 2026-04-27

#### Added

- **Typed Tauri bridge:** new `src/lib/tauri.ts` with `tauriInvoke<T>(command, args)`, a literal union `TauriCommand`, localized error messages, console logging and `TauriError` re-thrown so callers can react.
- **Toasts:** the `Toast.tsx` component (previously unused) is wired up to a `toastStore` and `ToastContainer`. Tauri command failures are now shown on screen instead of failing silently.
- **Path aliases:** `@/*` → `src/*` configured in `tsconfig.json` and `vite.config.ts`. New code uses barrel imports.
- **Barrel exports per module:** each `src/modules/*` exposes its public API via `index.ts`. Cross-module callers go through the barrel.

#### Changed

- **`SettingsModal` refactor:** the 540-line file is split into a thin shell + sections (`SoundSection`, `InterfaceSection`, `WipSection`) and `VolumeSlider` is extracted.
- **`ErrorBoundary` i18n:** copy that was hardcoded in Spanish ("REINTENTAR") is now localized via `settingsStore`. The duplicate-subject error from Rust is returned in English and the frontend localizes it via new `error.*` keys.
- **DB schema:** `plant_species` and `plant_stage` columns are folded into the initial `CREATE TABLE sessions` for fresh installs. The post-create `ALTER TABLE` statements are kept as idempotent fallbacks for existing databases.
- **Common tooltips:** translated to EN/ES along with `aria-labels`.

#### Fixed

- Dead command `get_plant_species` (queried a `plant_species` table that was never created). Species are static frontend metadata and do not need a round-trip to SQLite.

#### Removed

- Unused Rust dependency `serde_json`.

#### Hygiene

- Author/version placeholders corrected in `Cargo.toml`.
- Versions reconciled: `package.json`, `Cargo.toml` and `tauri.conf.json` all at `0.4.0`.
- Prettier and ESLint applied across the entire repo.

#### Changed

- `.gitattributes` updated to force LF line endings on all text files, breaking the CRLF↔LF cycle that produced false diffs on Windows.
- Full repo renormalization (`git add --renormalize .`).

---

## [0.3.3] — 2026-04-25

#### Changed

- Complete redesign of pixel-art sprites for all species with variable `viewBox` dimensions per plant to preserve real proportions (lotus is wider than tall, cactus the opposite, etc.). `PlantDisplay` now takes a per-species `viewBox` instead of the previous fixed 16×16 grid.

---

## [0.3.2] — 2026-04-24

#### Added

- Full i18n system with `src/i18n/en.ts`, `src/i18n/es.ts`, `types.ts` and `index.ts` files.
- EN/ES language toggle persisted in `settingsStore`.
- `useTranslation` hook that selects the active bundle.

#### Changed

- Massive refactor of hardcoded Spanish strings to i18n keys. All views and modals go through `t.<section>.<key>`.
- Prettier applied across the entire repo.

#### Fixed

- Nav overflow in `SettingsModal`.
- Labels and visual hierarchy of the settings nav.
- Order and width of the settings sidebar.
- Cactus sprite redesign (it did not scale well alongside the others).

---

## [0.3.1] — 2026-04-24

#### Added

- 8 new species with pixel-art sprites and unlock threshold logic:
  - `gerbera`, `lavanda`, `clavel`, `lirio`, `peonia`, `cactus`, `orquidea`, `lotus`.
- `unlockThreshold` per species (fraction of `stageThreshold` required at session close to unlock each stage).
- `calculateFinalStage(durationMinutes, species)` that applies the threshold when saving a session.

#### Fixed

- JSX type errors with React 19 + `moduleResolution: bundler` (`React.FC` replaced where ambiguous, type imports normalized).

---

## [0.3.0] — 2026-04-24

#### Changed

- **Rebranding:** official rename of the project to **Minu's Garden** (technical ID: `minus-garden`).
- **Styles architecture:** large-scale migration from inline `style={...}` to external CSS files (`TimerViews.css`, `HistoryView.css`) following BEM methodology.
- **Code quality:** naming standardization (PascalCase for UI, camelCase for logic), strict Prettier/ESLint rules applied across the entire repo.

#### Added

- Global `ErrorBoundary` to capture and handle UI failures gracefully.
- Project documentation synced with the actual state (`docs/architecture.md`, `docs/requirements.md`, `docs/vision.md`, `docs/palette.md`).

---

## [0.2.5] — 2026-04-24

#### Added

- **Music player:** audio system with a 6-track Lofi playlist and a persistent `MiniPlayer` when navigating away from the music view.
- **Ambient:** ambient sound selector (Rain, Forest, Cafe, Fireplace, White Noise) with independent volume mixing.
- **Settings:** configuration panel for volume management (Master, Music, Ambient, SFX), dark mode and interface preferences.
- **Premium UI:** `PixelSlider`, custom `Tooltip`, pixel-art cursor system.
- **SFX:** sound effects for buttons, click, typing, timer and session save.

---

## [0.2.0] — 2026-04-23

#### Added

- **Plant system:** growth logic integrated with the timer (Daisy and Sunflower). Plants evolve visually as study minutes are completed.
- **Subject management:** `subjects` table and Tauri commands (`get_subjects`, `save_subject`, `update_subject_usage`). `subjectStore` with `load`, `add` and `markUsed`. SQLite persistence and colour picker.
- **Timer redesign:** two-column layout with four dynamic states (idle, running, paused, finished) and a subject selector with autocomplete.
- **Design system:** pixel-art foundation and "Cozy Pink" palette established.
- **Pixel art base:** CSS variable system, "Press Start 2P" typography, UI primitives (PixelButton, etc.).

#### Changed

- Major refactor (commit "mega overhaul"): architecture, linting and UI consolidated.

#### Fixed

- Duration input synchronization.
- Palette alias restoration.
- Clean timer layout (50/50, controls on the left, plant on the right, well-hierarchized buttons).
- Scroll, pink palette, selection and icon consistency.
- Idle-state layout: controls with `space-between`, centred duration, plant 2x.

---

## [0.1.5] — 2026-04-23

#### Added

- **Local persistence:** SQLite via `rusqlite` in Rust with a `sessions` table and imperative migrations in `db.rs`.
- **Economy:** heart system (1 heart per 5 completed study minutes). `user_state` table with `total_hearts`. Commands `get_user_state` and `update_hearts`.
- **History view:** session list read directly from SQLite with date, duration, subject and hearts earned; individual session deletion.

#### Removed

- In-memory `sessionStore` (replaced by real persistence).

---

## [0.1.0] — 2026-04-23

#### Added

- **Project setup:** Tauri 2 + React 19 + TypeScript from scratch.
- **Base timer:** stopwatch with Zustand and in-memory session recording.
- **Initial documentation:** `docs/vision.md`, `docs/requirements.md`, `docs/architecture.md` and `docs/palette.md`.

#### Removed

- Tauri template boilerplate that does not contribute to the app.
