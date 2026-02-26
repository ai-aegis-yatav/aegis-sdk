use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::{NlpAnalyzeRequest, NlpAnalyzeResponse};
use crate::transport::Transport;

pub struct NlpResource {
    transport: Arc<Transport>,
}

impl NlpResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn analyze(&self, request: &NlpAnalyzeRequest) -> Result<NlpAnalyzeResponse> {
        self.transport
            .request(Method::POST, "/v1/nlp/analyze", Some(request))
            .await
    }

    pub async fn detect_jailbreak(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v1/nlp/detect/jailbreak", Some(&body))
            .await
    }

    pub async fn detect_harmful(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v1/nlp/detect/harmful", Some(&body))
            .await
    }

    pub async fn detect_language(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v1/nlp/detect/language", Some(&body))
            .await
    }
}
