// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

use rusqlite::Connection;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DbState(pub Mutex<Connection>);

/// Ordered list of schema migrations. The array index + 1 is the migration's
/// version number; `run_migrations` applies every migration whose version is
/// greater than the database's current `PRAGMA user_version`, then bumps it.
///
/// RULES for adding a migration:
/// - Append a new entry; never edit or reorder an existing one (shipped DBs
///   have already run them).
/// - A migration is a single SQL batch. It runs exactly once per database.
/// - From v2 onward you can use plain `ALTER TABLE ... ADD COLUMN` / `CREATE
///   TABLE` without `IF NOT EXISTS` guards — the version gate guarantees it
///   only runs against a schema that doesn't have the change yet.
const MIGRATIONS: &[&str] = &[
    // ── v1 ── Baseline schema.
    //
    // Uses IF NOT EXISTS + swallowed ALTERs so it is safe to apply to a
    // pre-migration database (one created before user_version tracking, which
    // already has these tables and possibly the updated plant columns). On a
    // fresh database it creates everything. Either way it ends at version 1.
    "CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        subject TEXT NOT NULL DEFAULT '',
        completed INTEGER NOT NULL DEFAULT 0,
        hearts_earned INTEGER NOT NULL DEFAULT 0,
        plant_species TEXT NOT NULL DEFAULT 'daisy',
        plant_stage INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        total_hearts INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
    );

    INSERT OR IGNORE INTO user_state (id, total_hearts, updated_at)
    VALUES (1, 0, datetime('now'));

    CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL DEFAULT '#e8a0b4',
        last_used_at TEXT,
        use_count INTEGER NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO subjects (id, name, color)
    VALUES
        ('11111111-1111-1111-1111-111111111111', 'Mathematics', '#e8a0b4'),
        ('22222222-2222-2222-2222-222222222222', 'History',     '#a0c4e8'),
        ('33333333-3333-3333-3333-333333333333', 'Science',     '#a0e8b4');",
    // ── v2 ── Shop inventory.
    //
    // Generic ownership ledger for everything purchasable: `kind` partitions
    // future categories (seed, tool, decoration, upgrade, plot) and `item_id`
    // is the domain id within that kind (species id for seeds). Buying a seed
    // unlocks its species permanently; quantity-based consumables can extend
    // this table later without reshaping it. Every player starts with the
    // daisy — it is the garden's first friend.
    "CREATE TABLE inventory (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        item_id TEXT NOT NULL,
        acquired_at TEXT NOT NULL,
        UNIQUE (kind, item_id)
    );

    INSERT INTO inventory (id, kind, item_id, acquired_at)
    VALUES ('starter-daisy', 'seed', 'daisy', datetime('now'));",
];

/// Legacy column back-fill for databases created before updates, where the
/// `sessions` table existed without the plant columns. `ALTER ... ADD COLUMN`
/// errors if the column already exists, so each statement is run independently
/// and its error swallowed. Only relevant while migrating such a DB up to v1;
/// harmless (no-op duplicate-column error) on every other database.
const LEGACY_BACKFILLS: &[&str] = &[
    "ALTER TABLE sessions ADD COLUMN plant_species TEXT NOT NULL DEFAULT 'daisy';",
    "ALTER TABLE sessions ADD COLUMN plant_stage INTEGER NOT NULL DEFAULT 1;",
];

fn run_migrations(conn: &Connection) -> rusqlite::Result<()> {
    let mut version: i64 =
        conn.pragma_query_value(None, "user_version", |row| row.get(0))?;

    for (index, migration) in MIGRATIONS.iter().enumerate() {
        let target = (index + 1) as i64;
        if version < target {
            conn.execute_batch(migration)?;

            // Back-fill legacy columns only while establishing the baseline.
            if target == 1 {
                for backfill in LEGACY_BACKFILLS {
                    let _ = conn.execute_batch(backfill);
                }
            }

            conn.pragma_update(None, "user_version", target)?;
            version = target;
        }
    }

    Ok(())
}

pub fn init_db(app_handle: &AppHandle) -> DbState {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("failed to resolve app_data_dir");
    let db_dir = app_data_dir.join("minus-garden");

    std::fs::create_dir_all(&db_dir).expect("failed to create db directory");

    let db_path = db_dir.join("minus-garden.db");
    let conn = Connection::open(&db_path).expect("failed to open SQLite connection");

    run_migrations(&conn).expect("failed to run migrations");

    DbState(Mutex::new(conn))
}

/// In-memory database at the latest schema version, for unit tests across
/// modules (commands.rs tests purchase rules against it).
#[cfg(test)]
pub fn test_connection() -> Connection {
    let conn = Connection::open_in_memory().expect("in-memory db");
    run_migrations(&conn).expect("migrations");
    conn
}

#[cfg(test)]
mod tests {
    use super::*;

    fn current_version(conn: &Connection) -> i64 {
        conn.pragma_query_value(None, "user_version", |row| row.get(0))
            .unwrap()
    }

    #[test]
    fn migrates_fresh_db_to_latest_version() {
        let conn = Connection::open_in_memory().unwrap();
        run_migrations(&conn).unwrap();
        assert_eq!(current_version(&conn), MIGRATIONS.len() as i64);

        // Baseline objects exist.
        let hearts: i64 = conn
            .query_row("SELECT total_hearts FROM user_state WHERE id = 1", [], |r| {
                r.get(0)
            })
            .unwrap();
        assert_eq!(hearts, 0);
        let subjects: i64 = conn
            .query_row("SELECT COUNT(*) FROM subjects", [], |r| r.get(0))
            .unwrap();
        assert_eq!(subjects, 3);

        // v2: inventory exists and the starter daisy is granted.
        let starter: String = conn
            .query_row(
                "SELECT item_id FROM inventory WHERE kind = 'seed' AND item_id = 'daisy'",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert_eq!(starter, "daisy");
    }

    #[test]
    fn upgrades_v1_db_with_inventory_and_starter_daisy() {
        // Simulate a database already at v1: run only the baseline, then the
        // full runner must apply v2 on top.
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(MIGRATIONS[0]).unwrap();
        conn.pragma_update(None, "user_version", 1).unwrap();

        run_migrations(&conn).unwrap();
        assert_eq!(current_version(&conn), MIGRATIONS.len() as i64);

        let owned: i64 = conn
            .query_row("SELECT COUNT(*) FROM inventory WHERE kind = 'seed'", [], |r| r.get(0))
            .unwrap();
        assert_eq!(owned, 1);
    }

    #[test]
    fn run_migrations_is_idempotent() {
        let conn = Connection::open_in_memory().unwrap();
        run_migrations(&conn).unwrap();
        // A second run must be a no-op and must not error.
        run_migrations(&conn).unwrap();
        assert_eq!(current_version(&conn), MIGRATIONS.len() as i64);
        let subjects: i64 = conn
            .query_row("SELECT COUNT(*) FROM subjects", [], |r| r.get(0))
            .unwrap();
        assert_eq!(subjects, 3); // seeds not duplicated
    }

    #[test]
    fn upgrades_legacy_db_without_plant_columns() {
        // Simulate a pre-updated database: tables exist, user_version still 0,
        // sessions has no plant columns.
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(
            "CREATE TABLE sessions (
                id TEXT PRIMARY KEY,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                duration_minutes INTEGER NOT NULL,
                subject TEXT NOT NULL DEFAULT '',
                completed INTEGER NOT NULL DEFAULT 0,
                hearts_earned INTEGER NOT NULL DEFAULT 0
            );",
        )
        .unwrap();

        run_migrations(&conn).unwrap();
        assert_eq!(current_version(&conn), MIGRATIONS.len() as i64);

        // Plant columns were back-filled, so inserting with defaults works.
        conn.execute(
            "INSERT INTO sessions (id, start_time, end_time, duration_minutes)
             VALUES ('a', 't', 't', 25)",
            [],
        )
        .unwrap();
        let species: String = conn
            .query_row("SELECT plant_species FROM sessions WHERE id = 'a'", [], |r| {
                r.get(0)
            })
            .unwrap();
        assert_eq!(species, "daisy");
    }
}
