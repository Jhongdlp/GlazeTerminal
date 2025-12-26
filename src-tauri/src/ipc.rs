use crate::core::pty_manager::PtyManager;
use std::{collections::HashMap, sync::{Arc, Mutex}};
use tauri::{AppHandle, State, Runtime};

pub struct AppState {
    pub ptys: Arc<Mutex<HashMap<String, Arc<PtyManager>>>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            ptys: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[tauri::command]
pub async fn spawn_pty<R: Runtime>(
    app: AppHandle<R>,
    state: State<'_, AppState>,
    id: String,
    cols: u16,
    rows: u16,
) -> Result<(), String> {
    let pty = PtyManager::new(app, id.clone(), cols, rows).map_err(|e| e.to_string())?;
    
    state.ptys.lock().unwrap().insert(id, Arc::new(pty));
    Ok(())
}

#[tauri::command]
pub fn write_pty(
    state: State<'_, AppState>,
    id: String,
    data: String,
) -> Result<(), String> {
    let ptys = state.ptys.lock().unwrap();
    if let Some(pty) = ptys.get(&id) {
        pty.write(&data).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn resize_pty(
    state: State<'_, AppState>,
    id: String,
    cols: u16,
    rows: u16,
) -> Result<(), String> {
    let ptys = state.ptys.lock().unwrap();
    if let Some(pty) = ptys.get(&id) {
        pty.resize(cols, rows).map_err(|e| e.to_string())?;
    }
    Ok(())
}
