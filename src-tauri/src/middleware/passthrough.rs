use super::MiddlewareTrait;

pub struct PassthroughLayer;

impl PassthroughLayer {
    pub fn new() -> Self {
        Self
    }
}

impl MiddlewareTrait for PassthroughLayer {
    fn on_process_output(&self, data: &[u8]) -> Option<Vec<u8>> {
        Some(data.to_vec())
    }

    fn on_user_input(&self, data: &[u8]) -> Option<Vec<u8>> {
        Some(data.to_vec())
    }
}
