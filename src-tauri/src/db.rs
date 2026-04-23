use rusqlite::Connection;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DbState(pub Mutex<Connection>);

pub fn init_db(app_handle: &AppHandle) -> DbState {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("failed to resolve app_data_dir");
    let db_dir = app_data_dir.join("minu-garden");

    std::fs::create_dir_all(&db_dir).expect("failed to create db directory");

    let db_path = db_dir.join("minu-garden.db");
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
        VALUES (1, 0, datetime('now'));",
    )
    .expect("failed to run migrations");

    DbState(Mutex::new(conn))
}
