use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::{MultimodalScanRequest, MultimodalScanResponse};
use crate::transport::Transport;

pub struct MultimodalResource {
    transport: Arc<Transport>,
}

impl MultimodalResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn scan(
        &self,
        request: &MultimodalScanRequest,
    ) -> Result<MultimodalScanResponse> {
        self.transport
            .request(Method::POST, "/v3/multimodal/scan", Some(request))
            .await
    }

    pub async fn detect_image(
        &self,
        request: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v3/multimodal/image", Some(request))
            .await
    }

    pub async fn detect_viscra(
        &self,
        request: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v3/multimodal/viscra", Some(request))
            .await
    }

    pub async fn detect_mml(
        &self,
        request: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v3/multimodal/mml", Some(request))
            .await
    }
}
