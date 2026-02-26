use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::{CiGateRequest, CiGateResponse};
use crate::transport::Transport;

pub struct OpsResource {
    transport: Arc<Transport>,
}

impl OpsResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn ci_gate(&self, request: &CiGateRequest) -> Result<CiGateResponse> {
        self.transport
            .request(Method::POST, "/ops/evalops/ci-gate", Some(request))
            .await
    }

    pub async fn run_benchmark(
        &self,
        benchmark_name: &str,
        config: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                &format!("/ops/evalops/benchmark/{}", benchmark_name),
                Some(config),
            )
            .await
    }

    pub async fn get_thresholds(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/ops/evalops/thresholds", None::<&()>)
            .await
    }

    pub async fn set_thresholds(
        &self,
        thresholds: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                "/ops/evalops/thresholds",
                Some(thresholds),
            )
            .await
    }

    pub async fn github_action_check(
        &self,
        config: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                "/ops/evalops/github-action-check",
                Some(config),
            )
            .await
    }

    pub async fn redteam_campaigns(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/ops/redteam/campaigns", None::<&()>)
            .await
    }

    pub async fn redteam_start(
        &self,
        config: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/ops/redteam/start", Some(config))
            .await
    }
}
