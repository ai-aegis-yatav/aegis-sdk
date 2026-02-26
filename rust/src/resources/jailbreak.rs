use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::safety::*;
use crate::transport::Transport;

pub struct JailbreakResource {
    transport: Arc<Transport>,
}

impl JailbreakResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn detect(
        &self,
        request: &JailbreakDetectRequest,
    ) -> Result<JailbreakDetectResponse> {
        self.transport
            .request(Method::POST, "/v2/jailbreak/detect", Some(request))
            .await
    }

    pub async fn detect_batch(
        &self,
        request: &JailbreakBatchRequest,
    ) -> Result<JailbreakBatchResponse> {
        self.transport
            .request(Method::POST, "/v2/jailbreak/detect/batch", Some(request))
            .await
    }

    pub async fn types(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v2/jailbreak/types", None::<&()>)
            .await
    }
}
