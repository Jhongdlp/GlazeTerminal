#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod core;
mod middleware;
mod ipc;

use ipc::AppState;

use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            
            // On Linux, we generally rely on window transparency and the compositor.
            // Some compositors support blur requests, but it's less standardized.
            
            Ok(())
        })
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            ipc::spawn_pty,
            ipc::write_pty,
            ipc::resize_pty
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
