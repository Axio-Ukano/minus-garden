# Changelog

Todos los cambios relevantes de **Minu's Garden** quedan documentados aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

---

## [0.5.3](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.2...minus-garden-v0.5.3) (2026-05-06)


### Corregido

* **ci:** rewrite Cargo.lock auto-sync with fresh clone approach ([#29](https://github.com/Axio-Ukano/minus-garden/issues/29)) ([42e9d69](https://github.com/Axio-Ukano/minus-garden/commit/42e9d69d7b7b9d19beb1da517d7e79f0bae141dc))

## [0.5.2](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.1...minus-garden-v0.5.2) (2026-05-05)


### Corregido

* **ci:** add explicit permissions to validate and audit workflows ([#27](https://github.com/Axio-Ukano/minus-garden/issues/27)) ([bf0485f](https://github.com/Axio-Ukano/minus-garden/commit/bf0485fe26a823b32845b3c9c4fd93b1a74ca48b))

## [0.5.1](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.0...minus-garden-v0.5.1) (2026-05-05)


### Corregido

* **deps:** update Cargo.lock to patch rand unsoundness (RUSTSEC-2024-0034) ([#23](https://github.com/Axio-Ukano/minus-garden/issues/23)) ([0dd303b](https://github.com/Axio-Ukano/minus-garden/commit/0dd303b9ed44a2b9f62e2708d8861a7bb64cb362))

## [0.5.0] — 2026-04-28

### Sprint 9 — Tier S consolidation

Pull Request `feat/tier-s-consolidation`: 26 commits atómicos llevando el repositorio a tier S sin tocar arquitectura. Cada commit deja `pnpm validate && pnpm build` verde.

#### Añadido

- Scripts de tooling: `typecheck`, `format:check`, `lint:fix`, `validate`, `test`, `test:watch`, `test:coverage`, `circular`, `prepare`.
- Vitest 4 + jsdom + `@testing-library/react` + `@testing-library/jest-dom`.
- Suites: `timerStore`, `plantService`, `usePlantGrowth`, `lib/tauri`, `historyStore`, `audioService` (64 tests). Cobertura 95% líneas / 92% funciones sobre los módulos cubiertos; umbral de gating 60%.
- `madge` para detección de ciclos (`pnpm circular`).
- `simple-git-hooks` + `lint-staged` con pre-commit que ejecuta `eslint --fix --max-warnings=0` + `prettier --write` solo en archivos staged.
- `.github/workflows/validate.yml`: typecheck + lint + format:check + circular + test:coverage + build en cada PR y push a `main`.
- `.github/workflows/audit.yml`: cron semanal (lunes 08:00 UTC) corriendo `pnpm audit --prod` y `cargo audit`.
- `.github/PULL_REQUEST_TEMPLATE.md` en español con checklist completo.
- `CONTRIBUTING.md` interno (flujo, Conventional Commits, reglas de PR).
- Carpeta `docs/adr/` con plantilla MADR (`0000-template.md`) y 4 ADRs retroactivos:
  - `0001-csp-tauri.md` — política CSP explícita.
  - `0002-zustand-flat-stores.md` — un store Zustand por feature.
  - `0003-sqlite-local.md` — persistencia local con rusqlite.
  - `0004-module-boundaries-and-alias.md` — barrels + alias `@/*` + enforcement.
- `@types/node` para `vite.config.ts`.
- `src/test-types.d.ts` que augmenta Vitest con los matchers de jest-dom.

#### Cambiado

- ESLint: `no-explicit-any` y `no-unused-vars` elevados a `error`. Reglas type-aware activas (`no-floating-promises`, `no-misused-promises` con `checksVoidReturn.attributes=false`). `eslint-plugin-import` con `import/no-cycle` y `no-restricted-imports` bloqueando el patrón `@/modules/*/*`: los imports cross-módulo deben ir al barrel `@/modules/<name>`, los intra-módulo deben ser relativos.
- TypeScript: `noUncheckedIndexedAccess: true` activado. Fallout corregido en `plantService`, `PlantDisplay`, `PlantStagesModal`, `TimerSetupView`, `MiniPlayer`, `audioStore` (12 sitios, guards explícitos o `?? fallback`).
- `tauri.conf.json`: CSP explícita reemplaza `null` (default-src 'self'; img/media incluyen `asset:`/`asset.localhost`; style permite Google Fonts; font incluye `fonts.gstatic.com`; connect-src incluye `ipc:` y `http://ipc.localhost`).
- `historyStore.loadUserState`: añade `console.error` en su `catch` para diagnóstico de desarrollador (el toast de error lo cubre el bridge).
- `.vscode/extensions.json`: recomienda `dbaeumer.vscode-eslint` y `esbenp.prettier-vscode` además de Tauri y rust-analyzer.
- `README.md`: reescrito (estructura del repo, scripts, convenciones, links a docs y ADRs).
- `docs/architecture.md`: refleja boundaries enforcement, comandos Tauri actuales, sección de tooling/CI, esquema de carpetas actualizado.
- `docs/requirements.md`: añade entradas v0.3.1–0.3.3 (catálogo + i18n + sprites), v0.4.0 / v0.4.1 (saneamiento), v0.5.0 (este sprint con diferimientos conscientes).

#### Eliminado

- `tailwindcss` y `@tailwindcss/vite` (sin uso real: el stack es CSS Vanilla con Custom Properties + BEM). Bundle CSS sin cambios (34.54 kB) confirma que el plugin estaba inerte.
- `@types/howler` movido de `dependencies` a `devDependencies` (paquete de tipos puro).
- `@ts-expect-error` en `vite.config.ts` (innecesario tras añadir `@types/node`).

#### Corregido

- 8 promesas fire-and-forget en `App.tsx`, `HistoryView.tsx` y `timerStore.ts` ahora explícitas con `void` (detectadas por `no-floating-promises`).
- `pnpm-lock.yaml` añadido a `.prettierignore` (los lockfiles no deben formatearse).

---

## [0.4.1] — 2026-04-27

### Sprint 8 — Boundaries enforcement final

#### Cambiado

- `PlantStagesModal` reubicado de `src/modules/timer/components/` a `src/modules/plants/` y reexportado por el barrel de `plants` (el modal pertenece conceptualmente al módulo `plants`, no a `timer`).
- `TimerSetupView` y `TimerActiveView` consumen `plants`, `settings`, `audio` y `subjects` exclusivamente vía sus barrels (`@/modules/*`) en lugar de rutas relativas a archivos internos.

#### Añadido

- `src/components/index.ts` (barrel) para consistencia con la convención de barrels en `src/modules/`. Reexporta `useToastStore` y `pushToast`.

---

## [0.4.0] — 2026-04-27

### Sprint 6 — Architecture Cleanup & Scaling Foundation

Primer sprint dedicado completamente al saneamiento arquitectónico antes de seguir creciendo el alcance funcional.

#### Añadido

- **Bridge Tauri tipado:** nuevo `src/lib/tauri.ts` con `tauriInvoke<T>(command, args)`, unión literal `TauriCommand`, mensajes de error localizados, log a consola y `TauriError` re-lanzado para que los callers puedan reaccionar.
- **Toasts:** se cablea el componente `Toast.tsx` (existía sin uso) a un `toastStore` y `ToastContainer`. Los fallos de comandos Tauri ahora se ven en pantalla en lugar de fallar silenciosamente.
- **Path aliases:** `@/*` → `src/*` configurado en `tsconfig.json` y `vite.config.ts`. Código nuevo usa imports por barrel.
- **Barrel exports por módulo:** cada `src/modules/*` expone su API pública vía `index.ts`. Los callers cross-módulo pasan por el barrel.

#### Cambiado

- **Refactor de `SettingsModal`:** se divide el archivo de 540 líneas en una shell delgada + secciones (`SoundSection`, `InterfaceSection`, `WipSection`) y se extrae `VolumeSlider`.
- **i18n del `ErrorBoundary`:** copia que estaba hardcodeada en español ("REINTENTAR") ahora se localiza vía `settingsStore`. El error de subject duplicado en Rust se devuelve en inglés y el frontend lo localiza vía nuevas keys `error.*`.
- **DB schema:** se pliegan las columnas `plant_species` y `plant_stage` dentro del `CREATE TABLE sessions` inicial para fresh installs. Los `ALTER TABLE` post-create se mantienen como fallback idempotente para BDs existentes.
- **Tooltips comunes:** traducidos a EN/ES junto con `aria-labels`.

#### Corregido

- Comando muerto `get_plant_species` (consultaba una tabla `plant_species` que nunca se creaba). Las especies son metadata estática del frontend, no necesitan round-trip a SQLite.

#### Eliminado

- Dependencia Rust `serde_json` sin uso.

#### Higiene

- Author/version placeholder corregidos en `Cargo.toml`.
- Versiones reconciliadas: `package.json`, `Cargo.toml` y `tauri.conf.json` todas en `0.4.0`.
- Aplicación de Prettier y ESLint sobre todo el repo.

### Sprint 7 — Normalización de Git (mismo release)

#### Cambiado

- `.gitattributes` actualizado para forzar line endings LF en todos los archivos de texto, rompiendo el ciclo CRLF↔LF que generaba diffs falsos en Windows.
- Repo renormalizado completo (`git add --renormalize .`).

---

## [0.3.3] — 2026-04-25

### Sprint 8 (numeración original) — Rediseño de sprites de plantas

#### Cambiado

- Rediseño completo de los sprites pixel-art de todas las especies con dimensiones de `viewBox` variables por planta para preservar proporciones reales (lotus es más ancho que alto, cactus al revés, etc.). El `PlantDisplay` toma `viewBox` por especie en lugar de la grilla 16×16 fija anterior.

---

## [0.3.2] — 2026-04-24

### Sprint 7 (numeración original) — i18n EN/ES

#### Añadido

- Sistema completo de i18n con archivos `src/i18n/en.ts`, `src/i18n/es.ts`, `types.ts` e `index.ts`.
- Toggle de idioma EN/ES persistido en `settingsStore`.
- Hook `useTranslation` que selecciona el bundle activo.

#### Cambiado

- Refactor masivo de strings hardcoded en español a keys i18n. Todas las vistas y modales pasan por `t.<seccion>.<key>`.
- Aplicación de Prettier sobre todo el repo.

#### Corregido

- Overflow del nav en `SettingsModal`.
- Etiquetas y jerarquía visual del nav de settings.
- Orden y ancho del sidebar de settings.
- Rediseño del sprite de cactus (no escalaba bien con el resto).

---

## [0.3.1] — 2026-04-24

### Sprint 6 (numeración original) — Expansión del catálogo de plantas

#### Añadido

- 8 nuevas especies con sprites pixel-art y lógica de unlock threshold:
  - `gerbera`, `lavanda`, `clavel`, `lirio`, `peonia`, `cactus`, `orquidea`, `lotus`.
- `unlockThreshold` por especie (fracción del `stageThreshold` requerida al cierre de sesión para desbloquear cada etapa).
- `calculateFinalStage(durationMinutes, species)` que aplica el threshold al guardar la sesión.

#### Corregido

- Errores de tipos JSX con React 19 + `moduleResolution: bundler` (`React.FC` reemplazado donde ambiguo, type imports normalizados).

---

## [0.3.0] — 2026-04-24

### Sprint 5 — Identidad y mantenibilidad

#### Cambiado

- **Rebranding:** renombrado oficial del proyecto a **Minu's Garden** (ID técnico: `minus-garden`).
- **Arquitectura de estilos:** migración masiva de `style={...}` inline a archivos CSS externos (`TimerViews.css`, `HistoryView.css`) siguiendo metodología BEM.
- **Calidad de código:** estandarización de naming (PascalCase para UI, camelCase para lógica), reglas estrictas de Prettier/ESLint aplicadas en todo el repo.

#### Añadido

- `ErrorBoundary` global para capturar y manejar fallos en la UI de forma elegante.
- Documentación del proyecto sincronizada con el estado real (`docs/architecture.md`, `docs/requirements.md`, `docs/vision.md`, `docs/palette.md`).

---

## [0.2.5] — 2026-04-24

### Sprint 4 — UX avanzada y sistema de sonido

#### Añadido

- **Reproductor de música:** sistema de audio con playlist Lofi de 6 tracks y `MiniPlayer` persistente cuando se navega fuera de la vista de música.
- **Ambiente:** selector de sonidos ambientales (Lluvia, Bosque, Café, Chimenea, Ruido Blanco) con mezcla de volumen independiente.
- **Settings:** panel de configuración para gestión de volúmenes (Master, Música, Ambient, SFX), modo oscuro y preferencias de interfaz.
- **UI premium:** componentes `PixelSlider`, `Tooltip` personalizado, sistema de cursores pixel-art.
- **SFX:** efectos de sonido para botones, click, typing, timer y guardado de sesión.

---

## [0.2.0] — 2026-04-23

### Sprint 3 — Crecimiento, materias y rediseño del timer

#### Añadido

- **Sistema de plantas:** lógica de crecimiento integrada con el timer (Margarita y Girasol). Las plantas evolucionan visualmente al completar minutos.
- **Gestión de materias:** tabla `subjects` y comandos Tauri (`get_subjects`, `save_subject`, `update_subject_usage`). `subjectStore` con `load`, `add` y `markUsed`. Persistencia en SQLite y selector de colores.
- **Rediseño del timer:** layout de dos columnas con cuatro estados dinámicos (idle, running, paused, finished) y selector de subject con autocompletado.
- **Sistema de diseño:** establecimiento de la base pixel-art y paleta "Cozy Pink".
- **Pixel art base:** sistema de variables CSS, tipografía "Press Start 2P", primitivas UI (PixelButton, etc.).

#### Cambiado

- Refactor mayor (commit "mega overhaul"): arquitectura, linting y UI consolidados antes del cierre de sprint.

#### Corregido

- Sincronización del input de duración.
- Restauración de aliases de paleta.
- Layout limpio del timer (50/50, controles a la izquierda, planta a la derecha, botones bien jerarquizados).
- Scroll, paleta rosa, selección y consistencia de íconos.
- Layout en estado idle: controles con `space-between`, duración centrada, planta 2x.

---

## [0.1.5] — 2026-04-23

### Sprint 2 — Persistencia y economía de corazones

#### Añadido

- **Persistencia local:** SQLite vía `rusqlite` en Rust con la tabla `sessions` y migraciones imperativas en `db.rs`.
- **Economía:** sistema de corazones (1 corazón por cada 5 min de estudio completados). Tabla `user_state` con `total_hearts`. Comandos `get_user_state` y `update_hearts`.
- **Vista de historial:** lista de sesiones leída directamente de SQLite con fecha, duración, materia y corazones ganados; eliminación individual de sesiones.

#### Eliminado

- `sessionStore` en memoria (reemplazado por la persistencia real).

---

## [0.1.0] — 2026-04-23

### Sprint 1 — Fundamentos

#### Añadido

- **Setup del proyecto:** Tauri 2 + React 19 + TypeScript desde cero.
- **Timer base:** cronómetro con Zustand y registro de sesiones en memoria.
- **Documentación inicial:** `docs/vision.md`, `docs/requirements.md`, `docs/architecture.md` y `docs/palette.md`.

#### Eliminado

- Boilerplate de la plantilla de Tauri que no aporta a la app.
