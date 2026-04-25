# Minu's Garden — Architecture

## Stack

| Capa              | Tecnología  | Versión                  |
| ----------------- | ----------- | ------------------------ |
| UI Framework      | React       | 19                       |
| Lenguaje frontend | TypeScript  | 5.8                      |
| Estilos           | CSS Vanilla | -                        |
| Bundler           | Vite        | 7                        |
| Desktop shell     | Tauri       | 2                        |
| Backend nativo    | Rust        | 1.95                     |
| Base de datos     | SQLite      | via rusqlite (Rust-side) |
| Estado global     | Zustand     | 5                        |

## Arquitectura en capas

```
┌─────────────────────────────────────┐
│           UI — React + TSX          │  Componentes, páginas, módulos
├─────────────────────────────────────┤
│        State — Zustand stores       │  Estado global (Zustand + Persist)
├─────────────────────────────────────┤
│       Tauri Bridge — invoke()       │  Comandos Rust ↔ JS
├─────────────────────────────────────┤
│    Rust backend — src-tauri/src/    │  Manejo de DB (Rusqlite), migraciones
├─────────────────────────────────────┤
│         SQLite — app.db             │  Persistencia local (AppData)
└─────────────────────────────────────┘
```

## Estructura de carpetas

```
minus-garden/
├── src/                        # Frontend React
│   ├── components/             # Componentes comunes (Botones, Sliders, Modales)
│   ├── modules/
│   │   ├── timer/              # Lógica y vistas del cronómetro
│   │   ├── audio/              # Servicio de sonido (Howler) y playlist
│   │   ├── history/            # Historial de sesiones y corazones
│   │   ├── plants/             # Especies, crecimiento y visualización
│   │   ├── subjects/           # Gestión de materias y colores
│   │   └── settings/           # Configuración global y preferencias
│   ├── styles/                 # Variables CSS y estilos globales
│   └── main.tsx                # Punto de entrada y Error Boundary
├── src-tauri/                  # Backend Rust (Tauri)
│   ├── src/
│   │   ├── main.rs             # Punto de entrada
│   │   ├── lib.rs              # Definición de comandos y registro
│   │   └── db.rs               # Gestión de SQLite y migraciones
│   └── tauri.conf.json         # Configuración del empaquetado
└── docs/                       # Documentación del proyecto
```

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
| `total_hearts` | INTEGER | Balance total de corazones 💗     |
| `updated_at`   | TEXT    | Timestamp de última actualización |

### `subjects`

| Campo          | Tipo    | Descripción                  |
| -------------- | ------- | ---------------------------- |
| `id`           | TEXT PK | UUID de la materia           |
| `name`         | TEXT    | Nombre único                 |
| `color`        | TEXT    | Color hexadecimal asociado   |
| `last_used_at` | TEXT    | Timestamp de último uso      |
| `use_count`    | INTEGER | Veces que se ha seleccionado |

### `plant_species`

| Campo              | Tipo    | Descripción                |
| ------------------ | ------- | -------------------------- |
| `id`               | TEXT PK | ID de la planta            |
| `name`             | TEXT    | Nombre visual              |
| `max_stages`       | INTEGER | Cantidad de etapas         |
| `stage_thresholds` | TEXT    | JSON con minutos por etapa |

## Flujo principal

```
Usuario inicia timer
    → Timer completa 25 min
    → Rust registra Session en SQLite
    → heartsEarned calculado y sumado a UserState.totalHearts
    → React UI actualiza balance visible
    → Usuario compra planta en tienda
    → Rust descuenta corazones, inserta Plant en SQLite
    → Jardín React muestra nueva planta en positionSlot
```
