use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct Reports {
    transport: Arc<Transport>,
}

impl Reports {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn generate(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/reports/generate", Some(body))
            .await
    }
}
