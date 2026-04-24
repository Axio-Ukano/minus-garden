use rusqlite::Connection;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DbState(pub Mutex<Connection>);

pub fn init_db(app_handle: &AppHandle) -> DbState {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("failed to resolve app_data_dir");
    let db_dir = app_data_dir.join("minus-garden");

    std::fs::create_dir_all(&db_dir).expect("failed to create db directory");

    let db_path = db_dir.join("minus-garden.db");
    let conn = Connection::open(&db_path).expect("failed to open SQLite connection");

    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL,
            subject TEXT NOT NULL DEFAULT '',
            completed INTEGER NOT NULL DEFAULT 0,
            hearts_earned INTEGER NOT NULL DEFAULT 0
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
            ('11111111-1111-1111-1111-111111111111', 'Matemáticas', '#e8a0b4'),
            ('22222222-2222-2222-2222-222222222222', 'Historia',    '#a0c4e8'),
            ('33333333-3333-3333-3333-333333333333', 'Ciencias',    '#a0e8b4');",
    )
    .expect("failed to run migrations");

    // ALTER TABLE ignores errors for columns that already exist (idempotent)
    let _ = conn.execute_batch(
        "ALTER TABLE sessions ADD COLUMN plant_species TEXT NOT NULL DEFAULT 'daisy';",
    );
    let _ = conn.execute_batch(
        "ALTER TABLE sessions ADD COLUMN plant_stage INTEGER NOT NULL DEFAULT 1;",
    );

    DbState(Mutex::new(conn))
}
