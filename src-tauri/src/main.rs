#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod core;
mod middleware;
mod ipc;

use ipc::AppState;

fn main() {
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            ipc::spawn_pty,
            ipc::write_pty,
            ipc::resize_pty
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
