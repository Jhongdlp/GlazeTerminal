use std::sync::{Arc, Mutex};

pub mod passthrough;
pub mod context_buffer;

/// Trait for middleware layers that can intercept/modify PTY traffic.
pub trait MiddlewareTrait: Send + Sync {
    /// Called when the PTY produces output (data flowing to the user/frontend).
    /// Return Some(data) to pass it through (modified or not), or None to suppress it.
    fn on_process_output(&self, data: &[u8]) -> Option<Vec<u8>>;

    /// Called when the user sends input (data flowing to the shell).
    /// Return Some(data) to pass it through, or None to suppress it.
    fn on_user_input(&self, data: &[u8]) -> Option<Vec<u8>>;
}

pub type MiddlewareChain = Arc<Mutex<Vec<Box<dyn MiddlewareTrait>>>>;
