# Minu's Garden — Architecture

## Stack

| Capa              | Tecnología   | Versión              |
| ----------------- | ------------ | -------------------- |
| UI Framework      | React        | 19                   |
| Lenguaje frontend | TypeScript   | 5.8                  |
| Estilos           | Tailwind CSS | 4                    |
| Bundler           | Vite         | 7                    |
| Desktop shell     | Tauri        | 2                    |
| Backend nativo    | Rust         | 1.95                 |
| Base de datos     | SQLite       | via tauri-plugin-sql |
| Estado global     | Zustand      | (v0.2+)              |

## Arquitectura en capas

```
┌─────────────────────────────────────┐
│           UI — React + TSX          │  Componentes, páginas, vistas
├─────────────────────────────────────┤
│        State — Zustand stores       │  Estado global de la app
├─────────────────────────────────────┤
│       Tauri Bridge — invoke()       │  Comandos Rust ↔ JS
├─────────────────────────────────────┤
│    Rust backend — src-tauri/src/    │  Lógica de negocio, queries SQL
├─────────────────────────────────────┤
│         SQLite — app.db             │  Persistencia local
└─────────────────────────────────────┘
```

## Estructura de carpetas

```
minus-garden/
├── src/                        # Frontend React
│   ├── components/             # Componentes reutilizables
│   ├── modules/
│   │   ├── timer/              # Timer de estudio
│   │   ├── garden/             # Jardín virtual
│   │   ├── economy/            # Corazones y tienda
│   │   ├── history/            # Historial de sesiones
│   │   └── minigames/          # Mini-juegos (v0.3+)
│   └── styles/
│       └── theme.css           # Variables CSS custom
├── src-tauri/                  # Backend Rust (Tauri)
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs              # Comandos Tauri
│   └── tauri.conf.json
└── docs/                       # Documentación del proyecto
```

## Tablas de base de datos

### `Session`

| Campo             | Tipo       | Descripción                    |
| ----------------- | ---------- | ------------------------------ |
| `id`              | INTEGER PK | ID autoincremental             |
| `startTime`       | TEXT       | ISO 8601 timestamp             |
| `endTime`         | TEXT       | ISO 8601 timestamp             |
| `durationMinutes` | INTEGER    | Duración en minutos            |
| `subject`         | TEXT NULL  | Materia/tema (opcional)        |
| `completed`       | BOOLEAN    | Si se completó o se canceló    |
| `heartsEarned`    | INTEGER    | Corazones ganados en la sesión |

### `Plant`

| Campo          | Tipo       | Descripción                                         |
| -------------- | ---------- | --------------------------------------------------- |
| `id`           | INTEGER PK | ID autoincremental                                  |
| `type`         | TEXT       | Tipo de planta (rose, daisy, etc.)                  |
| `level`        | INTEGER    | Nivel de crecimiento (0=semilla, 1=brote, 2=planta) |
| `positionSlot` | INTEGER    | Slot en el jardín (0–8)                             |
| `createdAt`    | TEXT       | ISO 8601 timestamp                                  |

### `InventoryItem`

| Campo        | Tipo       | Descripción         |
| ------------ | ---------- | ------------------- |
| `id`         | INTEGER PK | ID autoincremental  |
| `type`       | TEXT       | Tipo de item        |
| `costHearts` | INTEGER    | Precio en corazones |

### `UserState`

| Campo         | Tipo    | Descripción                       |
| ------------- | ------- | --------------------------------- |
| `totalHearts` | INTEGER | Balance total de corazones 💗     |
| `settings`    | TEXT    | JSON con preferencias del usuario |

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
