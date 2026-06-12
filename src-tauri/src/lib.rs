// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

mod db;
mod commands;

use tauri::Manager;
use db::init_db;
use commands::{save_session, get_sessions, delete_session,
               get_user_state, update_hearts,
               get_subjects, save_subject, update_subject_usage,
               get_inventory, purchase_item};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let db_state = init_db(app.handle());
            app.manage(db_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            save_session,
            get_sessions,
            delete_session,
            get_user_state,
            update_hearts,
            get_subjects,
            save_subject,
            update_subject_usage,
            get_inventory,
            purchase_item,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
