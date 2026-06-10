# ADR-0003: Local persistence with SQLite (rusqlite) in the Rust process

- **Status:** Accepted
- **Date:** 2026-04-27
- **Deciders:** @author

## Context

The app saves study sessions, total hearts, and user subjects. As a desktop offline-first app with no backend, storage must live 100% on the user's machine and survive restarts. The Rust layer of Tauri is already available and can access the native filesystem.

## Decision

Use SQLite via `rusqlite` (with the `bundled` feature) directly in `src-tauri/src/db.rs`. The database is created on app startup in the standard data directory (`AppData` on Windows, `~/Library/Application Support` on macOS, `~/.local/share` on Linux).

Current schema (declared in `db.rs`):

- `sessions` — `id, start_time, end_time, duration_minutes, subject, completed, hearts_earned, plant_species, plant_stage`
- `user_state` — `total_hearts`
- `subjects` — `id, name, last_used, usage_count`

The Tauri commands in `src-tauri/src/commands.rs` expose exactly the operations the frontend needs (`save_session`, `get_sessions`, `delete_session`, `get_user_state`, `update_hearts`, `get_subjects`, `save_subject`, `update_subject_usage`).

## Consequences

### Good

- Robust, transactional persistence with no external dependency.
- Schema is versionable with imperative migrations in `db.rs`.
- No network: zero latency, zero attack surface, zero cost.
- Compatible with the legal audit requirement of "data only on the user's device".

### Bad

- Schema changes require manual migration code (no ORM with automatic migrations).
- Cross-device sync is not possible without rewriting this layer (out of scope).

### Neutral

- Inspecting the database requires opening the `.db` file with an external SQLite client during debugging.

## Considered Alternatives

### IndexedDB in the WebView

Simpler from the frontend, but storage ends up in the WebView profile and can be deleted when clearing cache or updating the version. Discarded due to fragility.

### JSON file on disk

Trivial but no transactions or queries; corrupting the file means losing everything. Discarded due to fragility.

### sqlx + embedded Postgres-compat

Over-engineering for the current scope.

## Notes

- Table schemas and migration logic must be kept documented in `docs/architecture.md`. Any breaking change requires an additional ADR with an upgrade plan.
