# Minu's Garden — Requirements y Sprints

## MVP v0.1 — Funcionalidad base

### Timer de estudio

- [x] Timer configurable (Duraciones: 5, 10, 15, 25, 50 min)
- [x] Inicio, pausa y reset
- [x] Registro automático de sesión al completar
- [x] Campo de materia/tema con autocompletado y colores

### Economía de corazones

- [x] Ganar corazones al completar sesiones de estudio
- [x] Fórmula base: 1 corazón por cada 5 min completados
- [x] Balance de corazones visible en todo momento
- [x] Persistencia en SQLite (User State)

### Jardín virtual

- [ ] Vista de jardín con slots fijos (ej. 6–9 posiciones)
- [x] Plantas disponibles (Margarita, Girasol y más en sprints siguientes)
- [ ] Comprar plantas con corazones
- [x] Las plantas tienen niveles de crecimiento (semilla → brote → planta)
- [x] Crecer con el tiempo / sesiones completadas

### Historial

- [x] Lista de sesiones completadas
- [x] Fecha, duración, materia y corazones ganados por sesión
- [x] Eliminación de sesiones individuales

---

## v0.2 — Mejoras y contenido

### Sonidos y ambiente

- [x] Sonidos ambientes (Lluvia, Bosque, Café, Chimenea, Ruido Blanco)
- [x] Música Lofi integrada con playlist (6 tracks)
- [x] Efectos de sonido (SFX) para botones y timer
- [x] Mezclador de volumen independiente para Master, Música, Ambiente y SFX

### Personalización y UX

- [x] Modo oscuro nativo
- [x] Posicionamiento de la planta (izquierda / derecha)
- [x] Cursores pixel-art personalizados
- [x] Error Boundary para manejo de fallos
- [ ] Notificaciones de escritorio al terminar sesión
- [ ] Modo compacto (ventana pequeña solo con timer)

---

## v0.3 — Catálogo de plantas y ajustes

- [x] Especies adicionales: Gerbera, Lavanda, Clavel, Lirio, Peonía, Cactus, Orquídea, Loto.
- [x] Modal "Etapas de la planta" con thresholds visibles.
- [x] Selector ambient con randomizer opcional (cambia track cada N min).

---

## v0.4 — Saneamiento arquitectónico (Sprints 6–8)

- [x] Sprint 6: Bridge Tauri tipado (`tauriInvoke<T>`), errores localizados, toast UX.
- [x] Sprint 7: Normalización de Git (LF line endings, `.gitattributes` actualizado, eliminación de archivos sueltos).
- [x] Sprint 8: Boundaries entre módulos via barrel `index.ts`, alias `@/*`, limpieza de exports muertos.

---

## v0.5 — Tier S (Sprint 9, este)

- [x] Drop de Tailwind 4 sin uso (CSS Vanilla queda como stack único).
- [x] Scripts de validación: `typecheck`, `format:check`, `lint:fix`, `validate`, `circular`, `test*`.
- [x] `@types/howler` movido a devDependencies; `@types/node` añadido y `@ts-expect-error` retirado de `vite.config.ts`.
- [x] Migración completa de imports cross-módulo a `@/modules/<name>` y de intra-módulo a relativos.
- [x] ESLint: `no-explicit-any`/`no-unused-vars` en `error`, type-aware (`no-floating-promises`, `no-misused-promises`), `eslint-plugin-import` con `import/no-cycle` y `no-restricted-imports` para boundaries.
- [x] TypeScript: `noUncheckedIndexedAccess` activado; fallout corregido.
- [x] madge para detección de ciclos; `simple-git-hooks` + `lint-staged` en pre-commit.
- [x] Vitest 4 + jsdom + Testing Library + jest-dom; suites para `timerStore`, `plantService`, `usePlantGrowth`, `lib/tauri`, `historyStore`, `audioService`. Cobertura sobre los módulos cubiertos: 95% líneas, 92% funciones.
- [x] CSP explícita en `tauri.conf.json` (ADR-0001).
- [x] CI: `.github/workflows/validate.yml` (PR/push) y `audit.yml` (semanal pnpm audit + cargo audit).
- [x] PR template y CONTRIBUTING.md.
- [x] 4 ADRs retroactivos: CSP, Zustand flat stores, SQLite local, module boundaries.

### Diferimientos conscientes

- Tests E2E con Playwright (cuando haya 2 vistas críticas).
- `tauri-plugin-log` (cuando se distribuya fuera de uso personal).
- `manualChunks` en Vite (si bundle gzip supera 200 KB).
- Autohospedar la fuente "Press Start 2P" para cerrar `font-src` a `'self'`.
- Puerto `SessionRecorder` para desacoplar timer ⇄ history (solo si crece la dependencia).
- Split de `SoundSection.tsx` (cuando se añada nueva sub-feature).
- Refactor de `App.tsx` a router-map (cuando se añada una 3ª/4ª vista).
