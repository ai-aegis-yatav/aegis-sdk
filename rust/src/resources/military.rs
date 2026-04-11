use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct Military {
    transport: Arc<Transport>,
}

impl Military {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn anti_spoofing(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/military/anti-spoofing/analyze",
                Some(body),
            )
            .await
    }

    pub async fn classification(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/military/classification/analyze",
                Some(body),
            )
            .await
    }

    pub async fn command_chain(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/military/command-chain/analyze",
                Some(body),
            )
            .await
    }

    pub async fn cross_domain(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/military/cross-domain/analyze",
                Some(body),
            )
            .await
    }

    pub async fn opsec(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/military/opsec/analyze", Some(body))
            .await
    }

    pub async fn roe(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/military/roe/analyze", Some(body))
            .await
    }

    pub async fn tactical_autonomy(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/military/tactical-autonomy/analyze",
                Some(body),
            )
            .await
    }

    pub async fn orchestrate(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/military/orchestrate", Some(body))
            .await
    }

    pub async fn status(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/military/status", None::<&()>)
            .await
    }
}
