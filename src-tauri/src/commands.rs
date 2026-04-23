use rusqlite::params;
use serde::{Deserialize, Serialize};
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

#[derive(Debug, Serialize, Deserialize)]
pub struct PlantSpecies {
    pub id: String,
    pub name: String,
    pub max_stages: i64,
    pub stage_thresholds: String,
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

#[tauri::command]
pub fn get_plant_species(state: tauri::State<'_, DbState>) -> Result<Vec<PlantSpecies>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name, max_stages, stage_thresholds FROM plant_species")
        .map_err(|e| e.to_string())?;

    let species = stmt
        .query_map([], |row| {
            Ok(PlantSpecies {
                id: row.get(0)?,
                name: row.get(1)?,
                max_stages: row.get(2)?,
                stage_thresholds: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<PlantSpecies>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(species)
}
