use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::saber::*;
use crate::transport::Transport;

pub struct SaberResource {
    transport: Arc<Transport>,
}

impl SaberResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn estimate(
        &self,
        request: &SaberEstimateRequest,
    ) -> Result<SaberEstimateResponse> {
        self.transport
            .request(Method::POST, "/v3/saber/estimate", Some(request))
            .await
    }

    pub async fn evaluate(
        &self,
        request: &SaberEvaluateRequest,
    ) -> Result<SaberEvaluateResponse> {
        self.transport
            .request(Method::POST, "/v3/saber/evaluate", Some(request))
            .await
    }

    pub async fn budget(
        &self,
        tau: Option<f64>,
    ) -> Result<Vec<SaberBudget>> {
        let path = match tau {
            Some(t) => format!("/v3/saber/budget?tau={}", t),
            None => "/v3/saber/budget".to_string(),
        };
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn compare(&self, request: &SaberCompareRequest) -> Result<SaberCompareResponse> {
        self.transport
            .request(Method::POST, "/v3/saber/compare", Some(request))
            .await
    }

    pub async fn report(&self, id: &str) -> Result<SaberReport> {
        self.transport
            .request(
                Method::GET,
                &format!("/v3/saber/report/{}", id),
                None::<&()>,
            )
            .await
    }

    pub async fn update_deterministic_patterns(
        &self,
        patterns: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                "/v3/saber/deterministic/update",
                Some(patterns),
            )
            .await
    }
}
