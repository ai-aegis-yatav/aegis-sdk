use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct Korean {
    transport: Arc<Transport>,
}

impl Korean {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn analyze(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/korean/analyze", Some(body))
            .await
    }
}
