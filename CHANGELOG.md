# Changelog

All notable changes to **Minu's Garden** will be documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

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
