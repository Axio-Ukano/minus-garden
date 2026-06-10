# ADR-0006: Versioned SQLite migrations with `PRAGMA user_version`

- **Status:** Accepted
- **Date:** 2026-06-09
- **Deciders:** @author

## Context

`db.rs` created the schema with `CREATE TABLE IF NOT EXISTS` plus two idempotent `ALTER TABLE … ADD COLUMN` statements (with the error swallowed by `let _ =`) to back-fill pre-Sprint 6 installations. That pattern works but does not scale: every future schema change forces more `IF NOT EXISTS`/ALTERs to be swallowed, with no way to know what version a given database is at, no guaranteed order, and the risk of applying a change twice. ADR-0003 already anticipated "versionable schema with imperative migrations"; this ADR defines that mechanism before the schema grows with the gamification work.

## Decision

Implement a migration runner in `db.rs` based on `PRAGMA user_version`:

- `MIGRATIONS: &[&str]` — ordered list; index + 1 is the version number of each migration.
- `run_migrations` reads `user_version`, applies in order each migration whose version is higher than the current one, and after each migration increments `user_version`.
- **Migration v1** = baseline schema. Uses `IF NOT EXISTS` + the legacy ALTERs (swallowed) to safely absorb any existing database (pre-`user_version`, with tables already created, with or without plant columns). On a fresh database it creates everything. In both cases it finishes at version 1.
- **From v2 onwards**: plain `ALTER`/`CREATE` without guards — the version guarantees they only run against a schema that does not yet have the change.

Rust unit tests (`#[cfg(test)]` in `db.rs`) are added that verify: fresh database → latest version, idempotency (second run does not duplicate seeds), and upgrade from a legacy database without plant columns.

## Consequences

### Good

- The **next** schema change is a new entry in `MIGRATIONS`, trivial and auditable.
- Schema state is explicit and queryable (`user_version`).
- Order and idempotency are guaranteed; no risk of double application.
- Covered by Rust tests.

### Bad

- Migrations are never edited or reordered once published; only appended. Requires discipline.
- Rust tests do not run in the frontend CI (`validate.yml` is pnpm-only); they are run with `cargo test`.

### Neutral

- Migration v1 retains the legacy `IF NOT EXISTS`/ALTER pattern for backward compatibility; this is not debt, it is the contract for "absorbing what is already installed".

## Considered Alternatives

### `tauri-plugin-sql` with declarative migrations

Provides a migration system, but adds a dependency and moves the schema to JS/config. For an already-minimal existing Rust layer, this is over-engineering. Deferred.

### `refinery` / `rusqlite_migration` crate

More complete, but adds a dependency for something that `user_version` + `&[&str]` solves in ~30 lines. Discarded as unnecessary weight.

## Notes / References

- Supersedes the mechanism described in ADR-0003 without invalidating its core decision (local SQLite).
- Update the schema and migration flow in `docs/architecture.md`.
