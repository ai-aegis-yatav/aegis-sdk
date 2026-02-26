use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::*;
use crate::transport::Transport;

pub struct MlResource {
    transport: Arc<Transport>,
}

impl MlResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn health(&self) -> Result<HealthResponse> {
        self.transport
            .request(Method::GET, "/v1/ml/health", None::<&()>)
            .await
    }

    pub async fn embed(&self, request: &MlEmbedRequest) -> Result<MlEmbedResponse> {
        self.transport
            .request(Method::POST, "/v1/ml/embed", Some(request))
            .await
    }

    pub async fn embed_batch(
        &self,
        request: &MlEmbedBatchRequest,
    ) -> Result<MlEmbedBatchResponse> {
        self.transport
            .request(Method::POST, "/v1/ml/embed/batch", Some(request))
            .await
    }

    pub async fn classify(&self, request: &MlClassifyRequest) -> Result<MlClassifyResponse> {
        self.transport
            .request(Method::POST, "/v1/ml/classify", Some(request))
            .await
    }

    pub async fn search(&self, request: &MlSearchRequest) -> Result<MlSearchResponse> {
        self.transport
            .request(Method::POST, "/v1/ml/search", Some(request))
            .await
    }
}
