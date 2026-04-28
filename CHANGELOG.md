# Changelog

All notable changes to **Minu's Garden** will be documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.5.0] — 2026-04-28

### Sprint 9: Tier S consolidation

PR `feat/tier-s-consolidation` — 26 commits atómicos llevando el repo a tier S sin tocar arquitectura.

#### Added

- Scripts `typecheck`, `format:check`, `lint:fix`, `validate`, `test`, `test:watch`, `test:coverage`, `circular`, `prepare`.
- Vitest 4 + jsdom + @testing-library/react + @testing-library/jest-dom.
- Suites: `timerStore`, `plantService`, `usePlantGrowth`, `lib/tauri`, `historyStore`, `audioService` — 64 tests, cobertura 95% líneas / 92% funciones sobre los módulos cubiertos (umbral 60%).
- `madge` (`pnpm circular`), `simple-git-hooks` + `lint-staged` (pre-commit con `eslint --fix --max-warnings=0` + `prettier --write`).
- `.github/workflows/validate.yml` (typecheck + lint + format + circular + test + build en PR/push a main) y `audit.yml` (semanal, `pnpm audit --prod` + `cargo audit`).
- `.github/PULL_REQUEST_TEMPLATE.md` (español, con checklist).
- `CONTRIBUTING.md` interno.
- 4 ADRs retroactivos en `docs/adr/`: 0001 CSP Tauri, 0002 Zustand flat stores, 0003 SQLite local, 0004 Module boundaries y alias.
- `docs/adr/0000-template.md` (MADR español).
- `@types/node` para `vite.config.ts` (retira el `@ts-expect-error`).

#### Changed

- ESLint: `no-explicit-any` y `no-unused-vars` elevados a `error`. Reglas type-aware activadas (`no-floating-promises`, `no-misused-promises` con `checksVoidReturn.attributes=false`). `eslint-plugin-import` con `import/no-cycle` y `no-restricted-imports` bloqueando `@/modules/*/*` (los imports cross-módulo deben ir al barrel `@/modules/<name>`).
- TypeScript: `noUncheckedIndexedAccess: true`. Fixes de fallout en `plantService`, `PlantDisplay`, `PlantStagesModal`, `TimerSetupView`, `MiniPlayer`, `audioStore`.
- `vite.config.ts`: alias `@` mantenido; sin Tauri/CSP changes aquí.
- `tauri.conf.json`: CSP explícita reemplaza `null` (default-src 'self', img/media incluyen asset:/asset.localhost, style permite Google Fonts, font incluye fonts.gstatic.com, connect-src incluye ipc: y http://ipc.localhost).
- `historyStore.loadUserState`: añade `console.error` en su `catch` para diagnóstico (toast lo cubre el bridge).
- `.vscode/extensions.json`: recomienda ESLint y Prettier además de Tauri y rust-analyzer.
- `README.md`: reescrito (estructura, scripts, convenciones, links a docs y ADRs).
- `docs/architecture.md`: refleja boundaries enforcement, comandos Tauri actuales, sección de tooling/CI.
- `docs/requirements.md`: añade entradas para v0.3, v0.4 (Sprints 6–8) y v0.5 (Sprint 9 con diferimientos).

#### Removed

- `tailwindcss` y `@tailwindcss/vite` (sin uso real: BEM + Custom Properties son la única vía de estilado). Bundle CSS sin cambio (34.54 KB) confirma el plugin era inerte.
- `@types/howler` movido de `dependencies` a `devDependencies` (paquete de tipos puro).

#### Fixed

- 8 promesas fire-and-forget en `App.tsx`, `HistoryView.tsx` y `timerStore.ts` ahora explícitas con `void` (detectadas por `no-floating-promises`).
- `pnpm-lock.yaml` añadido a `.prettierignore` (lockfiles no deben formatearse).

## [0.4.1] — 2026-04-27

### Sprint 7: Refactoring de límites de módulo

- **`PlantStagesModal` reubicado:** Movido de `src/modules/timer/components/` a
  `src/modules/plants/` y exportado por el barrel de `plants`. El modal muestra
  etapas de crecimiento de plantas — conceptualmente pertenece al módulo `plants`,
  no a `timer`.
- **Imports cruzados corregidos:** `TimerSetupView` y `TimerActiveView` ahora
  consumen `plants`, `settings`, `audio` y `subjects` a través de sus barrels
  (`@/modules/*`) en lugar de rutas relativas directas a archivos internos.
- **Barrel de `src/components/`:** Añadido `src/components/index.ts` para
  consistencia con la convención de barrels ya establecida en `src/modules/`.
  Re-exporta `useToastStore` y `pushToast` para cohesionar el feature de Toast.

## [0.4.0] — 2026-04-27

### Sprint 6: Architecture Cleanup & Scaling Foundation

- **Latent bug fix:** Removed the dead `get_plant_species` Tauri command, which queried a `plant_species` table that was never created. Species are static frontend metadata and don't need a SQLite round-trip.
- **DB schema:** Folded `plant_species` and `plant_stage` columns into the initial `CREATE TABLE sessions` for fresh installs. The post-create `ALTER TABLE` calls remain as idempotent fallback for existing DBs.
- **Path aliases:** Added `@/*` → `src/*` to tsconfig and `vite.config.ts`. New code uses barrel imports; deep relative imports get rewritten as files are touched.
- **Typed Tauri error layer:** New `src/lib/tauri.ts` exposes `tauriInvoke<T>(command, args)` with a string-literal command union, localized error messages, console logging, and a typed `TauriError` re-throw. Every persistence call site in `historyStore` and `subjectStore` now goes through it.
- **Toast UX:** Wired the previously unused `Toast.tsx` component to a new `toastStore` + `ToastContainer`. Tauri command failures now surface to the user instead of failing silently.
- **i18n:** Localized the `ErrorBoundary` (was hardcoded Spanish "REINTENTAR") and replaced the Spanish duplicate-subject error in Rust with English; frontend localizes via the new `error.*` i18n keys.
- **Settings refactor:** Split the 540-line `SettingsModal.tsx` into a thin shell + per-section files (`SoundSection`, `InterfaceSection`, `WipSection`) and extracted `VolumeSlider`.
- **Barrel exports:** Each `src/modules/*` feature now has an `index.ts` exposing its public surface (view + store + types). Cross-module callers go through the barrel.
- **Hygiene:** Dropped unused `serde_json` Rust dep, fixed placeholder author/version in `Cargo.toml`, reconciled all version strings (`package.json`, `Cargo.toml`, `tauri.conf.json`) to `0.4.0`.

## [0.3.0] — 2026-04-24

### Sprint 5: Identidad y Mantenibilidad

- **Rebranding:** Renombrado oficial del proyecto a **Minu's Garden** (ID técnico: `minus-garden`).
- **Arquitectura de Estilos:** Migración masiva de estilos inline a archivos CSS externos (`TimerViews.css`, `HistoryView.css`) siguiendo metodología BEM.
- **Robustez:** Implementación de un `ErrorBoundary` global para capturar y manejar fallos en la UI de forma elegante.
- **Calidad de Código:** Estandarización de nombres de archivos (PascalCase para UI, camelCase para lógica) y aplicación de reglas estrictas de Prettier/ESLint.

## [0.2.5] — 2026-04-24

### Sprint 4: UX Avanzada y Sistema de Sonido

- **Reproductor de Música:** Integración de un sistema de audio con playlist de 6 tracks Lofi y MiniPlayer persistente.
- **Ambiente:** Añadido selector de sonidos ambientales (Lluvia, Bosque, Café, etc.) con mezcla de volumen independiente.
- **Settings:** Nuevo panel de configuración para gestión de volúmenes, modo oscuro y preferencias de interfaz.
- **UI Components:** Creación de componentes premium: `PixelSlider`, `Tooltip` personalizado y sistema de cursores pixel-art.

## [0.2.0] — 2026-04-23

### Sprint 3: Crecimiento y Personalización

- **Sistema de Plantas:** Lógica de crecimiento integrada con el timer (Margarita y Girasol). Las plantas evolucionan visualmente al completar sesiones.
- **Gestión de Materias:** Implementación de base de datos para materias (`subjects`) con persistencia en SQLite y selector de colores.
- **Rediseño de Timer:** Nueva interfaz de dos columnas con estados dinámicos (Idle, Running, Paused, Finished).
- **Diseño Visual:** Establecimiento de la base del sistema de diseño Pixel Art y paleta de colores "Cozy Pink".

## [0.1.5] — 2026-04-23

### Sprint 2: Persistencia y Economía

- **Core de Datos:** Implementación de persistencia local mediante SQLite usando `rusqlite` en Rust.
- **Economía:** Sistema de recolección de corazones (1 ♥ por cada 5 min de estudio).
- **Historial:** Nueva vista de historial de sesiones con datos extraídos directamente de la base de datos local.

## [0.1.0] — 2026-04-23

### Sprint 1: Fundamentos

- **Setup:** Inicialización del proyecto con Tauri 2, React 19 y TypeScript.
- **Timer:** Implementación inicial del cronómetro con Zustand.
- **Documentación:** Creación de la visión del proyecto, requerimientos y arquitectura base.
