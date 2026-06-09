# Minu's Garden — Arquitectura

## Stack

| Capa              | Tecnología                                | Versión                                 |
| ----------------- | ----------------------------------------- | --------------------------------------- |
| UI Framework      | React                                     | 19                                      |
| Lenguaje frontend | TypeScript                                | 6 (strict + `noUncheckedIndexedAccess`) |
| Estilos           | CSS Vanilla (Custom Properties + BEM)     | -                                       |
| Bundler           | Vite                                      | 8                                       |
| Desktop shell     | Tauri                                     | 2                                       |
| Backend nativo    | Rust                                      | edition 2021                            |
| Base de datos     | SQLite                                    | via `rusqlite` (`bundled`)              |
| Estado global     | Zustand                                   | 5                                       |
| Audio             | Howler                                    | 2                                       |
| Tests             | Vitest 4 + @testing-library/react + jsdom | -                                       |

## Arquitectura en capas

```
┌─────────────────────────────────────┐
│           UI — React + TSX          │  Componentes, vistas, modales
├─────────────────────────────────────┤
│        State — Zustand stores       │  Un store por feature; persist en settings
├─────────────────────────────────────┤
│     Data — repository (lib/data)    │  Única frontera de datos; contrato wire⇄dominio
├─────────────────────────────────────┤
│       Tauri Bridge — invoke()       │  src/lib/tauri.ts (typed wrapper, transporte)
├─────────────────────────────────────┤
│    Rust backend — src-tauri/src/    │  Comandos IPC, esquema, migraciones
├─────────────────────────────────────┤
│         SQLite — app.db             │  Persistencia local (AppData)
└─────────────────────────────────────┘
```

> **Frontera de datos** ([ADR-0005](adr/0005-data-repository-boundary.md)): ningún store ni
> componente llama `tauriInvoke` directamente. Todo acceso a estado persistido pasa por
> `repository` (`src/lib/data/`), que envuelve el transporte y mapea wire (snake_case) ⇄
> dominio (camelCase). El día que se añada un backend remoto de sincronización, solo cambia
> `src/lib/data/index.ts`; los stores no se tocan.

## Boundaries y enforcement

- Cada feature vive en `src/modules/<name>/` y expone su API por `index.ts` (barrel).
- Imports cross-módulo: solo `@/modules/<name>` (alias). El patrón profundo `@/modules/<name>/<archivo>` está **prohibido por ESLint** (`no-restricted-imports`).
- Imports intra-módulo: relativos (`./`, `../`). No usar `@/modules/<self>/...`.
- Sin dependencias circulares: `import/no-cycle` en ESLint + `pnpm circular` (madge) como red secundaria. Detalle en [ADR-0004](adr/0004-module-boundaries-and-alias.md).
- Path alias `@/*` → `src/*` configurado en `tsconfig.json`, `vite.config.ts` y `vitest.config.ts`.

## Estructura de carpetas

```
minus-garden/
├── .github/
│   ├── workflows/
│   │   ├── validate.yml         # CI: typecheck + lint + format + circular + test + build
│   │   └── audit.yml            # pnpm audit + cargo audit (semanal)
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── architecture.md          # este documento
│   ├── adr/                     # decisiones arquitectónicas
│   ├── requirements.md          # hitos por sprint
│   ├── palette.md               # paleta de diseño
│   └── vision.md                # visión del producto
├── src/                         # Frontend React
│   ├── components/              # primitivas UI compartidas (header, panel, iconos, slider…)
│   ├── i18n/                    # en.ts, es.ts, types.ts, index.ts
│   ├── lib/
│   │   ├── tauri.ts             # bridge tipado de transporte (TauriCommand, tauriInvoke<T>, TauriError)
│   │   ├── data/                # frontera de datos: repository + tipos de dominio (ADR-0005)
│   │   ├── kiosk.ts             # guardas de modo juego (anti context-menu/devtools/drag, ADR-0008)
│   │   └── toast/               # store + componentes de toasts
│   ├── modules/
│   │   ├── audio/               # Howler service, store, registry, hook
│   │   ├── history/             # vista + store de sesiones e historial
│   │   ├── music/               # MiniPlayer + MusicPlayerView
│   │   ├── plants/              # especies, growth, modal y SVG por especie
│   │   ├── settings/            # modal + sections (Sound, Interface, …)
│   │   ├── subjects/            # gestión de materias
│   │   └── timer/               # store + vistas (Setup/Active/Finished) + hook
│   ├── styles/                  # variables CSS + global
│   ├── App.tsx
│   ├── main.tsx                 # entry + ErrorBoundary
│   └── test-types.d.ts          # augmenta Vitest con jest-dom matchers
├── src-tauri/                   # Backend Rust
│   ├── src/
│   │   ├── main.rs              # punto de entrada
│   │   ├── lib.rs               # builder, registro de comandos
│   │   ├── db.rs                # conexión SQLite, migraciones
│   │   └── commands.rs          # implementación de comandos IPC
│   ├── capabilities/default.json
│   └── tauri.conf.json          # ventana, CSP explícita, bundle
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

## Comandos Tauri expuestos

Definidos en `src-tauri/src/commands.rs`, registrados en `src-tauri/src/lib.rs`, consumidos por `src/lib/tauri.ts` con tipado union `TauriCommand`:

- `save_session(session)` — inserta en `sessions`.
- `get_sessions()` — devuelve todas las sesiones ordenadas por `start_time` desc.
- `delete_session(id)` — borra por id.
- `get_user_state()` — devuelve `{ total_hearts }`.
- `update_hearts(totalHearts)` — UPSERT en `user_state`.
- `get_subjects()` — todos los subjects guardados.
- `save_subject(name)` — UPSERT (rechaza nombres duplicados).
- `update_subject_usage(id)` — incrementa `use_count` y `last_used_at`.

`tauriInvoke<T>(command, args)` envuelve `invoke`:

- Localiza errores (es/en) según `useSettingsStore.getState().language`.
- Loguea por consola con tag `[tauriInvoke:<command>]`.
- Empuja un toast tipo `error` con el mensaje localizado.
- Re-lanza un `TauriError` con el `raw` original para que el caller decida si bloquea su flujo.

## Tablas de base de datos

### `sessions`

| Campo              | Tipo    | Descripción                         |
| ------------------ | ------- | ----------------------------------- |
| `id`               | TEXT PK | UUID de la sesión                   |
| `start_time`       | TEXT    | ISO 8601 timestamp                  |
| `end_time`         | TEXT    | ISO 8601 timestamp                  |
| `duration_minutes` | INTEGER | Duración en minutos                 |
| `subject`          | TEXT    | Nombre de la materia                |
| `completed`        | INTEGER | 1 si se completó, 0 si no           |
| `hearts_earned`    | INTEGER | Corazones ganados                   |
| `plant_species`    | TEXT    | ID de la especie (daisy, sunflower) |
| `plant_stage`      | INTEGER | Etapa final alcanzada               |

### `user_state`

| Campo          | Tipo    | Descripción                       |
| -------------- | ------- | --------------------------------- |
| `id`           | INTEGER | ID único (1)                      |
| `total_hearts` | INTEGER | Balance total de corazones        |
| `updated_at`   | TEXT    | Timestamp de última actualización |

### `subjects`

| Campo          | Tipo    | Descripción                  |
| -------------- | ------- | ---------------------------- |
| `id`           | TEXT PK | UUID de la materia           |
| `name`         | TEXT    | Nombre único                 |
| `color`        | TEXT    | Color hexadecimal asociado   |
| `last_used_at` | TEXT    | Timestamp de último uso      |
| `use_count`    | INTEGER | Veces que se ha seleccionado |

> Detalle de la decisión de persistencia: [ADR-0003](adr/0003-sqlite-local.md).

### Migraciones de esquema

El esquema se versiona con `PRAGMA user_version` ([ADR-0006](adr/0006-versioned-sqlite-migrations.md)).
`db.rs` mantiene `MIGRATIONS: &[&str]` (índice + 1 = número de versión) y un runner que aplica
en orden cada migración con versión mayor a la actual, subiendo `user_version` tras cada una.

- **v1**: esquema baseline. Usa `IF NOT EXISTS` + ALTER legacy (tragados) para absorber con
  seguridad cualquier base previa (pre-`user_version`, con o sin columnas de planta).
- **v2+**: `ALTER`/`CREATE` planos, sin guardas — la versión garantiza que solo corren una vez.

Reglas: las migraciones publicadas **nunca** se editan ni reordenan; solo se añaden al final.
Tests unitarios Rust (`#[cfg(test)]` en `db.rs`) cubren base nueva, idempotencia y upgrade legacy.

## Flujo principal — sesión de estudio completada

```
Usuario configura subject + planta + duración (TimerSetupView)
  → useTimerStore.start() → status: running, secondsLeft = duration*60
  → useTimer hook decrementa cada segundo (tick → tick → ... → finish)
  → finish() calcula hearts (calculateHeartsEarned) y etapa (calculateFinalStage)
  → compone Session, llama useHistoryStore.saveSession() y syncHearts()
  → repository.sessions.save(session) → tauriInvoke("save_session") inserta en SQLite
  → repository.userState.setHearts(total) → tauriInvoke("update_hearts") UPSERT en SQLite
  → audioService.playSfx("timer_finish") + setTimeout("session_saved", 800ms)
  → status: finished
  → HistoryView refleja la nueva sesión y el header muestra hearts +X
```

## Seguridad

- CSP explícita en `tauri.conf.json` — ver [ADR-0001](adr/0001-csp-tauri.md).
- Capabilities mínimas (`core:default` + `opener:default`).
- Sin secretos en repo. Sin red salvo CDNs de fuentes (Google Fonts).
- Persistencia 100% local; sin telemetría ni auth.
- Modo kiosko ([ADR-0008](adr/0008-kiosk-mode.md)): `src/lib/kiosk.ts` bloquea menú contextual,
  atajos de devtools/ver-fuente y arrastre de imágenes; CSS suprime selección de texto salvo en
  inputs. Es UX de juego, no una barrera de seguridad.

## Tooling y CI

- ESLint flat config, type-aware (`@typescript-eslint/no-floating-promises`, `no-misused-promises`, `no-explicit-any` y `no-unused-vars` en `error`, regla de boundaries).
- Prettier obligatorio (lint-staged en pre-commit).
- TypeScript strict + `noUncheckedIndexedAccess`.
- Vitest con jsdom, cobertura mínima 60% en módulos prioritarios.
- madge para detectar ciclos.
- GitHub Actions workflows: `validate.yml` (todo PR / push a main) y `audit.yml` (semanal).
