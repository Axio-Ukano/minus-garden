# ADR-0003: Persistencia local con SQLite (rusqlite) en el proceso Rust

- **Estado:** Aceptada
- **Fecha:** 2026-04-27
- **Decisores:** @autor

## Contexto

La app guarda sesiones de estudio, total de hearts y subjects del usuario. Al ser desktop offline-first sin backend, el almacenamiento debe vivir 100% en la máquina del usuario y sobrevivir reinicios. La capa Rust de Tauri ya está disponible y puede acceder al filesystem nativo.

## Decisión

Usar SQLite vía `rusqlite` (con `bundled` feature) directamente en `src-tauri/src/db.rs`. La base se crea al arrancar la app en el directorio estándar de datos (`AppData` en Windows, `~/Library/Application Support` en macOS, `~/.local/share` en Linux).

Esquema actual (declarado en `db.rs`):

- `sessions` — `id, start_time, end_time, duration_minutes, subject, completed, hearts_earned, plant_species, plant_stage`
- `user_state` — `total_hearts`
- `subjects` — `id, name, last_used, usage_count`

Los comandos Tauri en `src-tauri/src/commands.rs` exponen exactamente las operaciones que el frontend necesita (`save_session`, `get_sessions`, `delete_session`, `get_user_state`, `update_hearts`, `get_subjects`, `save_subject`, `update_subject_usage`).

## Consecuencias

### Positivas

- Persistencia robusta, transaccional, sin dependencia externa.
- Esquema versionable con migraciones imperativas en `db.rs`.
- Sin red: cero latencia, cero superficie de ataque, cero coste.
- Compatible con auditoría legal de "datos solo en el dispositivo del usuario".

### Negativas

- Cambios de esquema requieren código de migración manual (no hay ORM con migraciones automáticas).
- Sincronización entre dispositivos no es posible sin reescribir esta capa (out of scope).

### Neutras

- Inspeccionar la BD requiere abrir el archivo `.db` con un cliente SQLite externo durante debug.

## Alternativas consideradas

### IndexedDB en el WebView

Más simple desde el frontend, pero el almacenamiento queda en el perfil del WebView y puede borrarse al limpiar caché o al actualizar la versión. Descartado por fragilidad.

### Archivo JSON en disco

Trivial pero sin transacciones ni queries; corromper el archivo significa perder todo. Descartado por fragilidad.

### sqlx + Postgres-compat embebido

Sobreingeniería para el alcance actual.

## Notas

- Los esquemas de tablas y la lógica de migración deben mantenerse documentados en `docs/architecture.md`. Cualquier cambio incompatible exige ADR adicional con plan de upgrade.
