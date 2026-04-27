# Changelog

All notable changes to **Minu's Garden** will be documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

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
