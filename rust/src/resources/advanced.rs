use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::AdvancedAttackDetectRequest;
use crate::models::common::AdvancedAttackDetectResponse;
use crate::transport::Transport;

pub struct AdvancedResource {
    transport: Arc<Transport>,
}

impl AdvancedResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn detect(
        &self,
        request: &AdvancedAttackDetectRequest,
    ) -> Result<AdvancedAttackDetectResponse> {
        self.transport
            .request(Method::POST, "/v2/advanced/detect", Some(request))
            .await
    }

    pub async fn detect_hybrid_web(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v2/advanced/hybrid-web", Some(&body))
            .await
    }

    pub async fn detect_vsh(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v2/advanced/vsh", Some(&body))
            .await
    }

    pub async fn detect_few_shot(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v2/advanced/few-shot", Some(&body))
            .await
    }

    pub async fn detect_cot(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v2/advanced/cot", Some(&body))
            .await
    }

    pub async fn detect_acoustic(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(Method::POST, "/v2/advanced/acoustic", Some(&body))
            .await
    }

    pub async fn detect_context_confusion(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(
                Method::POST,
                "/v2/advanced/context-confusion",
                Some(&body),
            )
            .await
    }

    pub async fn detect_info_extraction(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "text": text });
        self.transport
            .request(
                Method::POST,
                "/v2/advanced/info-extraction",
                Some(&body),
            )
            .await
    }
}
