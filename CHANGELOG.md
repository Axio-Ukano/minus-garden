# Changelog

Todos los cambios relevantes de **Minu's Garden** quedan documentados aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

---

## [0.6.0](https://github.com/Axio-Ukano/minus-garden/compare/minus-garden-v0.5.0...minus-garden-v0.6.0) (2026-05-05)


### Añadido

* add 8 new plant species with pixel-art sprites and unlock threshold logic ([53fe44e](https://github.com/Axio-Ukano/minus-garden/commit/53fe44e72163e6d74d3c3ad96c26bbe308c87776))
* complete i18n English refactor with ES/EN language toggle ([8e1852f](https://github.com/Axio-Ukano/minus-garden/commit/8e1852f889d20ceddb1777950392e5b7c7252935))
* complete plant sprite redesign with variable viewBox ([5b7e4bb](https://github.com/Axio-Ukano/minus-garden/commit/5b7e4bb63af8a03f0e7bebb12fcd81ecc5ded652))
* complete plant sprite redesign with variable viewBox dimensions ([6fde699](https://github.com/Axio-Ukano/minus-garden/commit/6fde699d7b9148ee6cb98a4c6b4bfe26d05794a5))
* **history:** Sprint 2 - SQLite + historial de sesiones ([22b4045](https://github.com/Axio-Ukano/minus-garden/commit/22b404596cc5cd3d5f31696622bf9e5a86f73d7f))
* **history:** SQLite persistence, session history and hearts sync ([c9587de](https://github.com/Axio-Ukano/minus-garden/commit/c9587deab36fdc3f79af0fb011e6ec0f5a424194))
* i18n English refactor with ES/EN language toggle ([8ded98e](https://github.com/Axio-Ukano/minus-garden/commit/8ded98eae4a4adf3bc6b94bd4de4d1226814610a))
* plant system expansion — 10 species, pixel-art sprites, unlock threshold ([c42c7bf](https://github.com/Axio-Ukano/minus-garden/commit/c42c7bfa41da27b528281452cedf0b5928e7924e))
* **plant:** plant growth logic and timer integration ([3ce5b7d](https://github.com/Axio-Ukano/minus-garden/commit/3ce5b7d7b344379e08262fe3e289b803f3f03180))
* **plant:** PlantDisplay pixel art + timer and history integration ([7f5ca77](https://github.com/Axio-Ukano/minus-garden/commit/7f5ca7798f48cbb3a5cea2f697eba2f57731d958))
* **sprint4:** UX polish, music player, settings, and new UI components ([43c77ab](https://github.com/Axio-Ukano/minus-garden/commit/43c77ab05a0edc344f7222be4fcd622a22fac850))
* **sprint4:** UX polish, music player, settings, and new UI components ([cafee1e](https://github.com/Axio-Ukano/minus-garden/commit/cafee1e9f8f512184d9845306119ec354aaaa8c2))
* **sprint6:** add tauriInvoke wrapper + toast-based error UX ([f3b8f30](https://github.com/Axio-Ukano/minus-garden/commit/f3b8f30e67dae0d3d05620f40dd330ca722cd374))
* **sprint6:** localize ErrorBoundary copy via settingsStore ([86b9e05](https://github.com/Axio-Ukano/minus-garden/commit/86b9e051a52694a8e1ccd295456b5fa9287264a7))
* **subjects:** subjects table and Tauri commands ([2cdb869](https://github.com/Axio-Ukano/minus-garden/commit/2cdb869623cdb5e90569c5ea9f79668c79f9c881))
* **subjects:** subjectStore with load, add and markUsed ([f749082](https://github.com/Axio-Ukano/minus-garden/commit/f749082b75bbc2168d188d68138dd0431b6c817a))
* **tauri:** define explicit CSP for production ([d55f09e](https://github.com/Axio-Ukano/minus-garden/commit/d55f09eab58c2382411360a3b7be777966f03800))
* **test:** scaffold Vitest with jsdom and Testing Library ([521552a](https://github.com/Axio-Ukano/minus-garden/commit/521552aff42773b4d3ce4fffbf118080b56c9c7f))
* tier S consolidation (Sprint 9, v0.5.0) ([4ad68b5](https://github.com/Axio-Ukano/minus-garden/commit/4ad68b5eb74a47ae2308c0c41b035d26912fa52d))
* **timer:** core timer with Zustand state and session tracking ([2b8f02b](https://github.com/Axio-Ukano/minus-garden/commit/2b8f02b9764c0c4934bf01d34fa9587c95551bf7))
* **timer:** core timer with Zustand state and session tracking ([cdc3459](https://github.com/Axio-Ukano/minus-garden/commit/cdc3459b166faa22b64e336e7eee3c1e7bb3174c))
* **timer:** two-column layout with 4 states and subject selector ([614739e](https://github.com/Axio-Ukano/minus-garden/commit/614739e0bbbb4ecf938462e64ebee896d5244f8a))
* **ui:** pixel art design system base ([de6c162](https://github.com/Axio-Ukano/minus-garden/commit/de6c162c04f0512bf835e6b70fceac25cd39f3f4))


### Corregido

* **history:** log silent catch on user state load for diagnostics ([b081915](https://github.com/Axio-Ukano/minus-garden/commit/b0819158ec6672b1e66afb031084e1a2e44067bb))
* resolve TypeScript JSX type errors with React 19 + moduleResolution bundler ([e12d95c](https://github.com/Axio-Ukano/minus-garden/commit/e12d95c4aa3bcc58dd76437e29265d92fd3094f7))
* settings nav labels and hierarchy ([9f5ab8d](https://github.com/Axio-Ukano/minus-garden/commit/9f5ab8d5b9687281abc9c688058a7ca0390c9bef))
* settings nav order, sidebar width, and breathing room ([afa5922](https://github.com/Axio-Ukano/minus-garden/commit/afa592248a4a060369098c64d2d16c0661561c17))
* settings nav overflow + cactus sprite redesign ([99a2c3f](https://github.com/Axio-Ukano/minus-garden/commit/99a2c3fe6d72204a610193c4e158c5d839e39ade))
* **timer:** 50/50 layout, cleaner proportions and button hierarchy ([598bcdf](https://github.com/Axio-Ukano/minus-garden/commit/598bcdfc89b1a54d2359442fb85145b51a102dd5))
* **timer:** idle layout — space-between controls, centered duration, 2x plant ([cc43e27](https://github.com/Axio-Ukano/minus-garden/commit/cc43e277419c13b93b31e2b31e837cee3acf87ed))
* **timer:** plant column on right, controls on left ([74a55f8](https://github.com/Axio-Ukano/minus-garden/commit/74a55f88da4cc2e43193c760c3b026c478836f33))
* translate common tooltips and aria-labels ([df7985e](https://github.com/Axio-Ukano/minus-garden/commit/df7985ed7f361a1a7cfd901b407cc853de54d6f8))
* **ui:** fix input sync, restore palette aliases, clean layout ([e451fa4](https://github.com/Axio-Ukano/minus-garden/commit/e451fa43c0433ad63282f9adde2fb19957e91332))
* **ui:** polish timer UX — palette, scroll, input, icons, selection ([81d7681](https://github.com/Axio-Ukano/minus-garden/commit/81d7681e1c1de1d33861baca95d954a467f8479f))
* **ui:** restore pink palette, fix scroll and input sync ([c76128c](https://github.com/Axio-Ukano/minus-garden/commit/c76128c4f4b407c9bceb8b5a6561b1fbbc3e30cb))
* **ui:** timer layout, palette consistency and duration input sync ([c3cfe1e](https://github.com/Axio-Ukano/minus-garden/commit/c3cfe1e27bf81f4803b2fe7b35fb4c6524ad86c7))


### Cambiado

* **core:** mega overhaul of architecture, linting, and UI ([6252294](https://github.com/Axio-Ukano/minus-garden/commit/62522948e7787eae2eea544535e03b7e7ef10fa0))
* enforce architecture boundaries (sprint 8) ([6bf025c](https://github.com/Axio-Ukano/minus-garden/commit/6bf025ce6956855851b1106d52d79d33947d9712))
* enforce architecture boundaries across components, lib, and modules ([d33f910](https://github.com/Axio-Ukano/minus-garden/commit/d33f910086ed59617f24655011cb2db690e6ddca))
* enforce module boundaries and add components barrel ([ced192b](https://github.com/Axio-Ukano/minus-garden/commit/ced192b8138f0c6e3cec3dafc3b4c3fd5943492a))
* **modules:** import audio and history through barrel files ([9081404](https://github.com/Axio-Ukano/minus-garden/commit/9081404192f70f7491b089c90a89e31990d83919))
* move inline styles to CSS files and implement ErrorBoundary ([17691d1](https://github.com/Axio-Ukano/minus-garden/commit/17691d192ccc7528a4b2bd637091a5aa7937a860))
* move inline styles to CSS files and implement ErrorBoundary ([7a91580](https://github.com/Axio-Ukano/minus-garden/commit/7a91580e7afafcaf2be9661cd63cb1e7f73f087d))
* **sprint6:** add barrel exports per feature module ([6f69ca5](https://github.com/Axio-Ukano/minus-garden/commit/6f69ca53da0f4ae12221abd2e522baf753ba67f7))
* **sprint6:** split 540-line SettingsModal into per-section files ([dd8a11b](https://github.com/Axio-Ukano/minus-garden/commit/dd8a11b4646cb362b84ba22cafe808a48de9a222))

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
