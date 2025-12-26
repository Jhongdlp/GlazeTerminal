use portable_pty::{native_pty_system, CommandBuilder, PtyPair, PtySize};
use std::{
    io::{Read, Write},
    sync::{Arc, Mutex},
    thread,
};
use tauri::{AppHandle, Emitter, Runtime};
use crate::middleware::{MiddlewareChain, context_buffer::ContextBuffer, MiddlewareTrait};

#[derive(Clone, serde::Serialize)]
struct PtyOutputPayload {
    id: String,
    data: String,
}

#[derive(Clone, serde::Serialize)]
struct PtyExitPayload {
    id: String,
    code: Option<i32>,
}

pub struct PtyManager {
    pty_pair: Arc<Mutex<PtyPair>>,
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    middleware: MiddlewareChain,
}

impl PtyManager {
    pub fn new<R: Runtime>(app: AppHandle<R>, id: String, cols: u16, rows: u16) -> Result<Self, anyhow::Error> {
        let pty_system = native_pty_system();

        let pair = pty_system.openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })?;

        let cwd = std::env::current_dir()?;
        
        // Determine shell
        let shell = std::env::var("SHELL").unwrap_or_else(|_| "bash".to_string());
        
        let mut cmd = CommandBuilder::new(shell);
        cmd.cwd(cwd);

        let _child = pair.slave.spawn_command(cmd)?;
        
        // Initialize Middleware Chain
        // In the future this can be dynamic or passed in. For Phase 2, we hardcode ContextBuffer.
        let context_buffer = ContextBuffer::new(1024 * 1024); // 1MB buffer
        let middleware: MiddlewareChain = Arc::new(Mutex::new(vec![
            Box::new(context_buffer) as Box<dyn MiddlewareTrait>
        ]));

        let writer = pair.master.take_writer()?;
        let writer = Arc::new(Mutex::new(writer));

        // Get reader
        let mut reader = pair.master.try_clone_reader()?;
        let pair_arc = Arc::new(Mutex::new(pair));
        let middleware_clone = middleware.clone();
        
        // Spawn reader thread
        let app_handle = app.clone();
        let thread_id = id.clone();
        let exit_id = id.clone();
        
        thread::spawn(move || {
            let mut buffer = [0u8; 1024];
            loop {
                match reader.read(&mut buffer) {
                    Ok(n) if n > 0 => {
                        let data = &buffer[..n];
                        
                        // Process Output Middleware
                        let chain = middleware_clone.lock().unwrap();
                        let mut final_data = Some(data.to_vec());
                        
                        for layer in chain.iter() {
                             if let Some(d) = final_data {
                                 final_data = layer.on_process_output(&d);
                             } else {
                                 break;
                             }
                        }

                        if let Some(processed) = final_data {
                             if !processed.is_empty() {
                                 let data_str = String::from_utf8_lossy(&processed).to_string();
                                 let _ = app_handle.emit("pty_data", PtyOutputPayload { 
                                     id: thread_id.clone(),
                                     data: data_str 
                                 });
                             }
                        }
                    }
                    Ok(_) => break, // EOF
                    Err(_) => break, // Error
                }
            }
            let _ = app_handle.emit("pty_exit", PtyExitPayload { id: exit_id, code: Some(0) }); 
        });

        Ok(Self {
            pty_pair: pair_arc,
            writer,
            middleware, 
        })
    }

    pub fn write(&self, data: &str) -> Result<(), anyhow::Error> {
        // Process Input Middleware
        let chain = self.middleware.lock().unwrap();
        let mut final_data = Some(data.as_bytes().to_vec());
        
        for layer in chain.iter() {
             if let Some(d) = final_data {
                 final_data = layer.on_user_input(&d);
             } else {
                 break;
             }
        }
        
        if let Some(processed) = final_data {
             let mut writer = self.writer.lock().unwrap();
             writer.write_all(&processed)?;
        }
        Ok(())
    }

    pub fn resize(&self, cols: u16, rows: u16) -> Result<(), anyhow::Error> {
        let pair = self.pty_pair.lock().unwrap();
        pair.master.resize(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })?;
        Ok(())
    }
}
