// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

use rusqlite::params;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::db::DbState;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Session {
    pub id: String,
    pub start_time: String,
    pub end_time: String,
    pub duration_minutes: i64,
    pub subject: String,
    pub completed: bool,
    pub hearts_earned: i64,
    pub plant_species: String,
    pub plant_stage: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserState {
    pub total_hearts: i64,
}

#[tauri::command]
pub fn save_session(state: tauri::State<'_, DbState>, session: Session) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO sessions
            (id, start_time, end_time, duration_minutes, subject, completed, hearts_earned, plant_species, plant_stage)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            session.id,
            session.start_time,
            session.end_time,
            session.duration_minutes,
            session.subject,
            session.completed as i64,
            session.hearts_earned,
            session.plant_species,
            session.plant_stage,
        ],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_sessions(state: tauri::State<'_, DbState>) -> Result<Vec<Session>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, start_time, end_time, duration_minutes, subject, completed, hearts_earned, plant_species, plant_stage FROM sessions ORDER BY start_time DESC")
        .map_err(|e| e.to_string())?;

    let sessions = stmt
        .query_map([], |row| {
            Ok(Session {
                id: row.get(0)?,
                start_time: row.get(1)?,
                end_time: row.get(2)?,
                duration_minutes: row.get(3)?,
                subject: row.get(4)?,
                completed: row.get::<_, i64>(5)? != 0,
                hearts_earned: row.get(6)?,
                plant_species: row.get(7)?,
                plant_stage: row.get::<_, u32>(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Session>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(sessions)
}

#[tauri::command]
pub fn delete_session(state: tauri::State<'_, DbState>, id: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM sessions WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_user_state(state: tauri::State<'_, DbState>) -> Result<UserState, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.query_row(
        "SELECT total_hearts FROM user_state WHERE id = 1",
        [],
        |row| Ok(UserState { total_hearts: row.get(0)? }),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_hearts(state: tauri::State<'_, DbState>, total_hearts: i64) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE user_state SET total_hearts = ?1, updated_at = datetime('now') WHERE id = 1",
        params![total_hearts],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Subject {
    pub id: String,
    pub name: String,
    pub color: String,
    pub use_count: i64,
}

#[tauri::command]
pub fn get_subjects(state: tauri::State<'_, DbState>) -> Result<Vec<Subject>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, name, color, use_count FROM subjects
             ORDER BY use_count DESC, last_used_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let subjects = stmt
        .query_map([], |row| {
            Ok(Subject {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                use_count: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Subject>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(subjects)
}

#[tauri::command]
pub fn save_subject(
    state: tauri::State<'_, DbState>,
    name: String,
    color: String,
) -> Result<Subject, String> {
    let name = name.trim().to_string();
    if name.is_empty() {
        return Err("Subject name cannot be empty".to_string());
    }
    if name.chars().count() > 50 {
        return Err("Subject name is too long".to_string());
    }
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO subjects (id, name, color) VALUES (?1, ?2, ?3)",
        params![id, name, color],
    )
    .map_err(|e| {
        if e.to_string().contains("UNIQUE constraint failed") {
            "Subject name already exists".to_string()
        } else {
            e.to_string()
        }
    })?;

    Ok(Subject { id, name, color, use_count: 0 })
}

#[tauri::command]
pub fn update_subject_usage(
    state: tauri::State<'_, DbState>,
    id: String,
) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE subjects SET use_count = use_count + 1, last_used_at = ?1 WHERE id = ?2",
        params![chrono::Utc::now().to_rfc3339(), id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

// ─── Inventory ───────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryItem {
    pub id: String,
    pub kind: String,
    pub item_id: String,
    pub acquired_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseResult {
    pub total_hearts: i64,
    pub item: InventoryItem,
}

/// Raw error strings the frontend matches on to localize purchase failures.
/// Keep them stable — `src/lib/tauri.ts` special-cases them by exact value.
pub const ERR_NOT_ENOUGH_HEARTS: &str = "Not enough hearts";
pub const ERR_ALREADY_OWNED: &str = "Item already owned";

#[tauri::command]
pub fn get_inventory(state: tauri::State<'_, DbState>) -> Result<Vec<InventoryItem>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, kind, item_id, acquired_at FROM inventory ORDER BY acquired_at ASC")
        .map_err(|e| e.to_string())?;

    let items = stmt
        .query_map([], |row| {
            Ok(InventoryItem {
                id: row.get(0)?,
                kind: row.get(1)?,
                item_id: row.get(2)?,
                acquired_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<InventoryItem>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(items)
}

/// Core purchase rule, factored out of the Tauri command so it can be unit
/// tested against an in-memory database. Deducting hearts and granting the
/// item happen in one transaction: a purchase can never charge without
/// granting, or grant without charging.
pub fn purchase_item_tx(
    conn: &mut rusqlite::Connection,
    kind: &str,
    item_id: &str,
    price: i64,
) -> Result<PurchaseResult, String> {
    let kind = kind.trim();
    let item_id = item_id.trim();
    if kind.is_empty() || item_id.is_empty() {
        return Err("Invalid item".to_string());
    }
    if price < 0 {
        return Err("Invalid price".to_string());
    }

    let tx = conn.transaction().map_err(|e| e.to_string())?;

    let owned: i64 = tx
        .query_row(
            "SELECT COUNT(*) FROM inventory WHERE kind = ?1 AND item_id = ?2",
            params![kind, item_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;
    if owned > 0 {
        return Err(ERR_ALREADY_OWNED.to_string());
    }

    let hearts: i64 = tx
        .query_row("SELECT total_hearts FROM user_state WHERE id = 1", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;
    if hearts < price {
        return Err(ERR_NOT_ENOUGH_HEARTS.to_string());
    }

    let total_hearts = hearts - price;
    tx.execute(
        "UPDATE user_state SET total_hearts = ?1, updated_at = datetime('now') WHERE id = 1",
        params![total_hearts],
    )
    .map_err(|e| e.to_string())?;

    let item = InventoryItem {
        id: Uuid::new_v4().to_string(),
        kind: kind.to_string(),
        item_id: item_id.to_string(),
        acquired_at: chrono::Utc::now().to_rfc3339(),
    };
    tx.execute(
        "INSERT INTO inventory (id, kind, item_id, acquired_at) VALUES (?1, ?2, ?3, ?4)",
        params![item.id, item.kind, item.item_id, item.acquired_at],
    )
    .map_err(|e| e.to_string())?;

    tx.commit().map_err(|e| e.to_string())?;
    Ok(PurchaseResult { total_hearts, item })
}

#[tauri::command]
pub fn purchase_item(
    state: tauri::State<'_, DbState>,
    kind: String,
    item_id: String,
    price: i64,
) -> Result<PurchaseResult, String> {
    let mut conn = state.0.lock().map_err(|e| e.to_string())?;
    purchase_item_tx(&mut conn, &kind, &item_id, price)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::test_connection;

    fn set_hearts(conn: &rusqlite::Connection, hearts: i64) {
        conn.execute("UPDATE user_state SET total_hearts = ?1 WHERE id = 1", params![hearts])
            .unwrap();
    }

    #[test]
    fn purchase_deducts_hearts_and_grants_item() {
        let mut conn = test_connection();
        set_hearts(&conn, 50);

        let result = purchase_item_tx(&mut conn, "seed", "gerbera", 10).unwrap();
        assert_eq!(result.total_hearts, 40);
        assert_eq!(result.item.kind, "seed");
        assert_eq!(result.item.item_id, "gerbera");

        let owned: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM inventory WHERE kind = 'seed' AND item_id = 'gerbera'",
                [],
                |r| r.get(0),
            )
            .unwrap();
        assert_eq!(owned, 1);
    }

    #[test]
    fn purchase_rejects_insufficient_hearts_without_side_effects() {
        let mut conn = test_connection();
        set_hearts(&conn, 5);

        let err = purchase_item_tx(&mut conn, "seed", "lotus", 110).unwrap_err();
        assert_eq!(err, ERR_NOT_ENOUGH_HEARTS);

        let hearts: i64 = conn
            .query_row("SELECT total_hearts FROM user_state WHERE id = 1", [], |r| r.get(0))
            .unwrap();
        assert_eq!(hearts, 5);
        let owned: i64 = conn
            .query_row("SELECT COUNT(*) FROM inventory WHERE item_id = 'lotus'", [], |r| {
                r.get(0)
            })
            .unwrap();
        assert_eq!(owned, 0);
    }

    #[test]
    fn purchase_rejects_already_owned_item() {
        let mut conn = test_connection();
        set_hearts(&conn, 100);

        // The starter daisy is granted by migration v2.
        let err = purchase_item_tx(&mut conn, "seed", "daisy", 0).unwrap_err();
        assert_eq!(err, ERR_ALREADY_OWNED);
    }

    #[test]
    fn purchase_rejects_invalid_input() {
        let mut conn = test_connection();
        set_hearts(&conn, 100);

        assert!(purchase_item_tx(&mut conn, "", "gerbera", 10).is_err());
        assert!(purchase_item_tx(&mut conn, "seed", "  ", 10).is_err());
        assert!(purchase_item_tx(&mut conn, "seed", "gerbera", -1).is_err());
    }

    #[test]
    fn free_purchase_is_allowed_at_zero_hearts() {
        let mut conn = test_connection();
        set_hearts(&conn, 0);

        let result = purchase_item_tx(&mut conn, "seed", "freebie", 0).unwrap();
        assert_eq!(result.total_hearts, 0);
    }
}

