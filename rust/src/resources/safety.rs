use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::safety::*;
use crate::transport::Transport;

pub struct SafetyResource {
    transport: Arc<Transport>,
}

impl SafetyResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn check(&self, request: &SafetyCheckRequest) -> Result<SafetyCheckResponse> {
        self.transport
            .request(Method::POST, "/v2/safety/check", Some(request))
            .await
    }

    pub async fn check_batch(&self, request: &SafetyBatchRequest) -> Result<SafetyBatchResponse> {
        self.transport
            .request(Method::POST, "/v2/safety/check/batch", Some(request))
            .await
    }

    pub async fn categories(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v2/safety/categories", None::<&()>)
            .await
    }

    pub async fn backends(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v2/safety/backends", None::<&()>)
            .await
    }
}
