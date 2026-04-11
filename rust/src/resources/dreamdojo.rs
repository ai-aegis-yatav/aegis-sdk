use std::sync::Arc;

use reqwest::Method;
use serde_json::Value;

use crate::error::Result;
use crate::transport::Transport;

pub struct Dreamdojo {
    transport: Arc<Transport>,
}

impl Dreamdojo {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn validate_action(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/dreamdojo/validate-action", Some(body))
            .await
    }

    pub async fn validate_input(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/dreamdojo/validate-input", Some(body))
            .await
    }

    pub async fn validate_pipeline(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/dreamdojo/validate-pipeline", Some(body))
            .await
    }

    pub async fn validate_latent(&self, body: &Value) -> Result<Value> {
        self.transport
            .request(Method::POST, "/v3/dreamdojo/validate-latent", Some(body))
            .await
    }

    pub async fn embodiments(&self) -> Result<Value> {
        self.transport
            .request(Method::GET, "/v3/dreamdojo/embodiments", None::<&()>)
            .await
    }
}
