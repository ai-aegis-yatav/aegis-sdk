use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::anomaly::*;
use crate::transport::Transport;

pub struct AnomalyResource {
    transport: Arc<Transport>,
}

impl AnomalyResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn algorithms(&self) -> Result<Vec<AnomalyAlgorithm>> {
        self.transport
            .request(Method::GET, "/v3/anomaly/algorithms", None::<&()>)
            .await
    }

    pub async fn detect(&self, request: &AnomalyDetectRequest) -> Result<AnomalyDetectResponse> {
        self.transport
            .request(Method::POST, "/v3/anomaly/detect", Some(request))
            .await
    }

    pub async fn detect_batch(
        &self,
        request: &AnomalyBatchRequest,
    ) -> Result<AnomalyBatchResponse> {
        self.transport
            .request(Method::POST, "/v3/anomaly/detect/batch", Some(request))
            .await
    }

    pub async fn events(
        &self,
        range: Option<&str>,
    ) -> Result<Vec<AnomalyEvent>> {
        let path = match range {
            Some(r) => format!("/v3/anomaly/events?range={}", r),
            None => "/v3/anomaly/events".to_string(),
        };
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn stats(&self) -> Result<AnomalyStats> {
        self.transport
            .request(Method::GET, "/v3/anomaly/stats", None::<&()>)
            .await
    }
}
