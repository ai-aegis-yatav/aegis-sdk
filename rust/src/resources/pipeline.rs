use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct Pipeline {
    transport: Arc<Transport>,
}

impl Pipeline {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn run(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/pipeline/run", Some(body))
            .await
    }
}
