# Minu's Garden — Architecture

## Stack

| Layer             | Technology                                | Version                                 |
| ----------------- | ----------------------------------------- | --------------------------------------- |
| UI Framework      | React                                     | 19                                      |
| Frontend language | TypeScript                                | 6 (strict + `noUncheckedIndexedAccess`) |
| Styles            | Vanilla CSS (Custom Properties + BEM)     | -                                       |
| Bundler           | Vite                                      | 8                                       |
| Desktop shell     | Tauri                                     | 2                                       |
| Native backend    | Rust                                      | edition 2021                            |
| Database          | SQLite                                    | via `rusqlite` (`bundled`)              |
| Global state      | Zustand                                   | 5                                       |
| Audio             | Howler                                    | 2                                       |
| Tests             | Vitest 4 + @testing-library/react + jsdom | -                                       |

## Layered architecture

```
┌─────────────────────────────────────┐
│           UI — React + TSX          │  Components, views, modals
├─────────────────────────────────────┤
│        State — Zustand stores       │  One store per feature; persist in settings
├─────────────────────────────────────┤
│     Data — repository (lib/data)    │  Single data boundary; wire⇄domain contract
├─────────────────────────────────────┤
│       Tauri Bridge — invoke()       │  src/lib/tauri.ts (typed wrapper, transport)
├─────────────────────────────────────┤
│    Rust backend — src-tauri/src/    │  IPC commands, schema, migrations
├─────────────────────────────────────┤
│         SQLite — app.db             │  Local persistence (AppData)
└─────────────────────────────────────┘
```

> **Data boundary** ([ADR-0005](adr/0005-data-repository-boundary.md)): no store or
> component calls `tauriInvoke` directly. All access to persisted state goes through
> `repository` (`src/lib/data/`), which wraps the transport and maps wire (snake_case) ⇄
> domain (camelCase). The day a remote sync backend is added, only `src/lib/data/index.ts`
> changes; the stores are untouched.

## Boundaries and enforcement

- Each feature lives in `src/modules/<name>/` and exposes its API via `index.ts` (barrel).
- Cross-module imports: only `@/modules/<name>` (alias). The deep pattern `@/modules/<name>/<file>` is **forbidden by ESLint** (`no-restricted-imports`).
- Intra-module imports: relative (`./`, `../`). Do not use `@/modules/<self>/...`.
- No circular dependencies: `import/no-cycle` in ESLint + `pnpm circular` (madge) as a secondary net. Detail in [ADR-0004](adr/0004-module-boundaries-and-alias.md).
- Path alias `@/*` → `src/*` configured in `tsconfig.json`, `vite.config.ts` and `vitest.config.ts`.

## Folder structure

```
minus-garden/
├── .github/
│   ├── workflows/
│   │   ├── validate.yml         # CI: typecheck + lint + format + circular + test + build
│   │   └── audit.yml            # pnpm audit + cargo audit (weekly)
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── architecture.md          # this document
│   ├── adr/                     # architectural decisions
│   ├── requirements.md          # milestones per sprint
│   ├── palette.md               # design palette
│   └── vision.md                # product vision
├── src/                         # React frontend
│   ├── components/              # shared UI primitives (header, panel, icons, slider…)
│   ├── i18n/                    # en.ts, es.ts, types.ts, index.ts
│   ├── lib/
│   │   ├── tauri.ts             # typed transport bridge (TauriCommand, tauriInvoke<T>, TauriError)
│   │   ├── data/                # data boundary: repository + domain types (ADR-0005)
│   │   ├── kiosk.ts             # game-mode guards (anti context-menu/devtools/drag, ADR-0008)
│   │   └── toast/               # toast store + components
│   ├── modules/
│   │   ├── audio/               # Howler service, store, registry, hook
│   │   ├── gamemode/            # game-mode layer (gate tab, rail: shop/garden/minigames) + store
│   │   ├── history/             # session list view + store
│   │   ├── inventory/           # ownership store (shop writes, timer/garden read)
│   │   ├── music/               # MiniPlayer + MusicPlayerView
│   │   ├── plants/              # species, growth, stages modal, per-species SVG, seed packets, seed catalog (economy)
│   │   ├── settings/            # modal + sections (Sound, Interface, …)
│   │   ├── shop/                # seed shop view + detail overlay
│   │   ├── subjects/            # subject management
│   │   └── timer/               # store + views (Setup/Active/Finished) + hook
│   ├── styles/                  # CSS variables + global
│   ├── App.tsx
│   ├── main.tsx                 # entry + ErrorBoundary
│   └── test-types.d.ts          # augments Vitest with jest-dom matchers
├── src-tauri/                   # Rust backend
│   ├── src/
│   │   ├── main.rs              # entry point
│   │   ├── lib.rs               # builder, command registration
│   │   ├── db.rs                # SQLite connection, migrations
│   │   └── commands.rs          # IPC command implementations
│   ├── capabilities/default.json
│   └── tauri.conf.json          # window, explicit CSP, bundle
├── e2e/                         # Playwright E2E (frontend, faked Tauri transport — ADR-0009)
│   ├── support/
│   │   ├── fakeTauri.ts         # in-memory backend + parametrizable seed
│   │   └── pages.ts             # Page Object Model (data-testid selectors)
│   └── specs/                   # navigation, session-flow, kiosk
├── playwright.config.ts         # webServer pnpm dev + chromium project
├── test/
│   └── setup.ts                 # @testing-library/jest-dom + cleanup
├── eslint.config.js             # flat config, type-aware, boundaries
├── tsconfig.json                # strict + noUncheckedIndexedAccess
├── tsconfig.node.json           # vite.config.ts + vitest.config.ts
├── vite.config.ts
├── vitest.config.ts             # jsdom env + setup + coverage 60%
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

## Exposed Tauri commands

Defined in `src-tauri/src/commands.rs`, registered in `src-tauri/src/lib.rs`, consumed by `src/lib/tauri.ts` with the `TauriCommand` union type:

- `save_session(session)` — inserts into `sessions`.
- `get_sessions()` — returns all sessions ordered by `start_time` desc.
- `delete_session(id)` — deletes by id.
- `get_user_state()` — returns `{ total_hearts }`.
- `update_hearts(totalHearts)` — UPSERT into `user_state`.
- `get_subjects()` — all saved subjects.
- `save_subject(name)` — UPSERT (rejects duplicate names).
- `update_subject_usage(id)` — increments `use_count` and `last_used_at`.
- `get_inventory()` — all owned items (seeds, future categories).
- `purchase_item(kind, itemId, price)` — atomic transaction: checks ownership and balance, deducts hearts, grants the item, returns `{ total_hearts, item }`.

`tauriInvoke<T>(command, args)` wraps `invoke`:

- Localizes errors (es/en) based on `useSettingsStore.getState().language`.
- Logs to the console with the tag `[tauriInvoke:<command>]`.
- Pushes an `error` toast with the localized message.
- Re-throws a `TauriError` carrying the original `raw` so the caller decides whether to block its flow.

## Database tables

### `sessions`

| Field              | Type    | Description                   |
| ------------------ | ------- | ----------------------------- |
| `id`               | TEXT PK | Session UUID                  |
| `start_time`       | TEXT    | ISO 8601 timestamp            |
| `end_time`         | TEXT    | ISO 8601 timestamp            |
| `duration_minutes` | INTEGER | Duration in minutes           |
| `subject`          | TEXT    | Subject name                  |
| `completed`        | INTEGER | 1 if completed, 0 otherwise   |
| `hearts_earned`    | INTEGER | Hearts earned                 |
| `plant_species`    | TEXT    | Species ID (daisy, sunflower) |
| `plant_stage`      | INTEGER | Final stage reached           |

### `user_state`

| Field          | Type    | Description           |
| -------------- | ------- | --------------------- |
| `id`           | INTEGER | Unique ID (1)         |
| `total_hearts` | INTEGER | Total hearts balance  |
| `updated_at`   | TEXT    | Last-update timestamp |

### `subjects`

| Field          | Type    | Description                |
| -------------- | ------- | -------------------------- |
| `id`           | TEXT PK | Subject UUID               |
| `name`         | TEXT    | Unique name                |
| `color`        | TEXT    | Associated hex color       |
| `last_used_at` | TEXT    | Last-used timestamp        |
| `use_count`    | INTEGER | Times it has been selected |

### `inventory`

| Field         | Type    | Description                                        |
| ------------- | ------- | -------------------------------------------------- |
| `id`          | TEXT PK | Item UUID (`starter-daisy` for the seeded starter) |
| `kind`        | TEXT    | Category: `seed` today; tools/decor/plots later    |
| `item_id`     | TEXT    | Domain id within the kind (species id for seeds)   |
| `acquired_at` | TEXT    | Acquisition timestamp                              |

Unique on `(kind, item_id)` — buying a seed unlocks its species permanently.
Migration v2 creates the table and grants the starter daisy.

> Persistence decision detail: [ADR-0003](adr/0003-sqlite-local.md).

### Schema migrations

The schema is versioned with `PRAGMA user_version` ([ADR-0006](adr/0006-versioned-sqlite-migrations.md)).
`db.rs` keeps `MIGRATIONS: &[&str]` (index + 1 = version number) and a runner that applies,
in order, every migration with a version higher than the current one, bumping `user_version`
after each.

- **v1**: baseline schema. Uses `IF NOT EXISTS` + legacy ALTER (swallowed) to safely absorb any
  prior database (pre-`user_version`, with or without plant columns).
- **v2+**: plain `ALTER`/`CREATE`, no guards — the version guarantees they run only once.

Rules: published migrations are **never** edited or reordered; they are only appended.
Rust unit tests (`#[cfg(test)]` in `db.rs`) cover a fresh database, idempotency and the legacy upgrade.

## Main flow — completed study session

```
User configures subject + plant + duration (TimerSetupView)
  → useTimerStore.start() → status: running, secondsLeft = duration*60
  → useTimer hook decrements every second (tick → tick → ... → finish)
  → finish() computes hearts (calculateHeartsEarned) and stage (calculateFinalStage)
  → composes Session, calls useHistoryStore.saveSession() and syncHearts()
  → repository.sessions.save(session) → tauriInvoke("save_session") inserts into SQLite
  → repository.userState.setHearts(total) → tauriInvoke("update_hearts") UPSERT into SQLite
  → audioService.playSfx("timer_finish") + setTimeout("session_saved", 800ms)
  → status: finished
  → HistoryView reflects the new session and the header shows hearts +X
```

## Security

- Explicit CSP in `tauri.conf.json` — see [ADR-0001](adr/0001-csp-tauri.md).
- Minimal capabilities (`core:default` + `opener:default`).
- No secrets in the repo. No network except font CDNs (Google Fonts).
- 100% local persistence; no telemetry, no auth.
- Kiosk mode ([ADR-0008](adr/0008-kiosk-mode.md)): `src/lib/kiosk.ts` blocks the context menu,
  devtools/view-source shortcuts and image dragging; CSS suppresses text selection except in
  inputs. It is game UX, not a security barrier.

## Tooling and CI

- ESLint flat config, type-aware (`@typescript-eslint/no-floating-promises`, `no-misused-promises`, `no-explicit-any` and `no-unused-vars` at `error`, boundaries rule).
- Prettier mandatory (lint-staged in pre-commit).
- TypeScript strict + `noUncheckedIndexedAccess`.
- Vitest with jsdom, minimum 60% coverage on priority modules.
- Playwright for frontend E2E with faked Tauri transport ([ADR-0009](adr/0009-e2e-playwright-faked-transport.md)): `pnpm e2e`. `data-testid` selectors + Page Object Model in `e2e/support/`.
- madge for cycle detection.
- GitHub Actions workflows: `validate.yml` (every PR / push to main), `e2e.yml` (Playwright on PR / push) and `audit.yml` (weekly).
