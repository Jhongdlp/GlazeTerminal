use super::MiddlewareTrait;
use std::collections::VecDeque;
use std::sync::{Mutex, Arc};

pub struct ContextBuffer {
    buffer: Arc<Mutex<VecDeque<u8>>>,
    capacity: usize,
}

impl ContextBuffer {
    pub fn new(capacity: usize) -> Self {
        Self {
            buffer: Arc::new(Mutex::new(VecDeque::with_capacity(capacity))),
            capacity,
        }
    }

    pub fn get_context(&self) -> String {
        let buffer = self.buffer.lock().unwrap();
        String::from_utf8_lossy(&buffer.iter().copied().collect::<Vec<u8>>()).to_string()
    }
    
    fn push_data(&self, data: &[u8]) {
        let mut buffer = self.buffer.lock().unwrap();
        for &byte in data {
            if buffer.len() >= self.capacity {
                buffer.pop_front();
            }
            buffer.push_back(byte);
        }
    }
}

impl MiddlewareTrait for ContextBuffer {
    fn on_process_output(&self, data: &[u8]) -> Option<Vec<u8>> {
        // Capture output for context
        self.push_data(data);
        // Pass through unchanged
        Some(data.to_vec())
    }

    fn on_user_input(&self, data: &[u8]) -> Option<Vec<u8>> {
        // We usually don't buffer input echo locally, but we could.
        // For now, just passthrough.
        Some(data.to_vec())
    }
}
