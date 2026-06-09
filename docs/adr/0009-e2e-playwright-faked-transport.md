# ADR-0009: E2E con Playwright sobre el frontend y transporte Tauri faked

- **Estado:** Aceptada
- **Fecha:** 2026-06-09
- **Decisores:** @autor

## Contexto

El smoke manual (playbook §4) cubre el flujo crítico: configurar sesión → completar → ver en History → corazones. Repetirlo a mano en cada PR es trabajo y es saltable. El playbook §14 tenía los E2E con Playwright como diferimiento ("cuando haya 2 vistas críticas que se rompen entre sí"); la app ya tiene varias vistas (timer, history, music, settings), así que el disparador se cumple.

Detalle técnico decisivo: **Playwright no maneja la ventana nativa de Tauri** — automatiza navegadores. En `localhost:1420` no existe `window.__TAURI_INTERNALS__`, así que todo `invoke` lanzaría. Para E2E nativo real (ventana + IPC + SQLite) la vía de Tauri es `tauri-driver` + WebDriver (WebdriverIO/Selenium), no Playwright, y no encaja en el CI actual (Ubuntu, pnpm-only, sin WebView2 ni display).

## Decisión

Montar Playwright contra el frontend de Vite con el **transporte Tauri faked en memoria**:

- `e2e/support/fakeTauri.ts` inyecta (`addInitScript`) un `window.__TAURI_INTERNALS__.invoke` que implementa los 8 comandos con las mismas shapes que Rust, sobre estado en memoria con _seed_ parametrizable. Se ejecuta el frontend real + `repository` + stores; solo SQLite/Rust se finge. La frontera `repository` (ADR-0005) es justo lo que hace esto limpio.
- `e2e/support/pages.ts` — Page Object Model; los selectores se anclan a `data-testid` (estables ante cambios de copy, idioma y layout). Cambios de UI → se actualiza el page object, no los specs.
- Specs iniciales: navegación entre tabs, flujo completo de sesión (con `page.clock` para adelantar el countdown sin esperar 5 min), y guardas de kiosko (anti context-menu / devtools).
- Scripts `pnpm e2e[:ui|:headed|:report]`; workflow `e2e.yml` separado de `validate.yml`.

El **E2E nativo (tauri-driver)** queda como diferimiento explícito, con su disparador documentado.

## Consecuencias

### Positivas

- El flujo crítico se valida automáticamente en cada PR; el smoke manual se reduce a "persiste de verdad en SQLite".
- Resistente a cambios de UI (testids + POM), tal como se pidió para escalar pantallas/botones.
- `page.clock` da tests deterministas y rápidos (sin esperas reales).
- Seed parametrizable → fácil cubrir estados (history vacío, pre-poblado, materias custom).

### Negativas

- **No** cubre el camino real IPC→SQLite ni migraciones (eso es el E2E nativo diferido). El smoke manual de persistencia sigue siendo necesario hasta entonces.
- Añadir `data-testid` acopla (mínimamente) el markup a los tests. Se acepta: es el método estándar y i18n-estable.
- `page.clock.install()` debe llamarse **después** de `goto` para interceptar los timers ya montados (aprendido en la implementación).

### Neutras

- `e2e/` queda fuera de `tsconfig` de la app y del type-aware lint (override en `eslint.config.js`); Playwright lo type-checa en runtime.

## Alternativas consideradas

### E2E nativo con tauri-driver + WebdriverIO ahora

Cubriría IPC+SQLite reales y reemplazaría el smoke entero, pero es pesado, driver Windows-específico y no entra en el CI actual. Diferido; disparador: cuando el camino DB sea fuente recurrente de regresiones o se prepare distribución pública.

### Mockear a nivel de `repository` (no del transporte)

Más sencillo, pero dejaría sin probar `repository` y el wrapper `tauriInvoke`. Inyectar en el transporte ejercita toda la cadena de cliente. Elegido por mayor cobertura real.

## Notas / referencias

- Implementación: `playwright.config.ts`, `e2e/`, scripts en `package.json`, `.github/workflows/e2e.yml`.
- Relacionado: ADR-0005 (frontera de datos), ADR-0008 (kiosko).
