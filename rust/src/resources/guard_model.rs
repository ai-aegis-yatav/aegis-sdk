use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct GuardModel {
    transport: Arc<Transport>,
}

impl GuardModel {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn stats(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/guard-model/stats", None::<&()>)
            .await
    }

    pub async fn performance(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/guard-model/performance", None::<&()>)
            .await
    }

    pub async fn train(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/guard-model/train", Some(body))
            .await
    }

    pub async fn train_status(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/guard-model/train/status", None::<&()>)
            .await
    }

    pub async fn train_cancel(&self) -> Result<Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/guard-model/train/cancel",
                None::<&()>,
            )
            .await
    }
}
