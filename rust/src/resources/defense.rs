use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::defense::*;
use crate::transport::Transport;

pub struct DefenseResource {
    transport: Arc<Transport>,
}

impl DefenseResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn paladin_stats(&self) -> Result<PaladinStats> {
        self.transport
            .request(Method::GET, "/v2/defense/paladin/stats", None::<&()>)
            .await
    }

    pub async fn enable_layer(&self, layer_name: &str) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                &format!("/v2/defense/paladin/layer/{}/enable", layer_name),
                None::<&()>,
            )
            .await
    }

    pub async fn validate_trust(
        &self,
        request: &TrustValidateRequest,
    ) -> Result<TrustValidateResponse> {
        self.transport
            .request(Method::POST, "/v2/defense/trust/validate", Some(request))
            .await
    }

    pub async fn trust_profile(&self) -> Result<TrustProfile> {
        self.transport
            .request(Method::GET, "/v2/defense/trust/profile", None::<&()>)
            .await
    }

    pub async fn rag_detect(&self, request: &RagDetectRequest) -> Result<RagDetectResponse> {
        self.transport
            .request(Method::POST, "/v2/defense/rag/detect", Some(request))
            .await
    }

    pub async fn rag_secure_query(
        &self,
        request: &RagSecureQueryRequest,
    ) -> Result<RagSecureQueryResponse> {
        self.transport
            .request(
                Method::POST,
                "/v2/defense/rag/secure-query",
                Some(request),
            )
            .await
    }

    pub async fn circuit_breaker_evaluate(
        &self,
        request: &CircuitBreakerRequest,
    ) -> Result<CircuitBreakerResponse> {
        self.transport
            .request(
                Method::POST,
                "/v2/defense/circuit-breaker/evaluate",
                Some(request),
            )
            .await
    }

    pub async fn circuit_breaker_status(&self) -> Result<CircuitBreakerResponse> {
        self.transport
            .request(
                Method::GET,
                "/v2/defense/circuit-breaker/status",
                None::<&()>,
            )
            .await
    }

    pub async fn adaptive_evaluate(
        &self,
        request: &AdaptiveEvalRequest,
    ) -> Result<AdaptiveEvalResponse> {
        self.transport
            .request(
                Method::POST,
                "/v2/defense/adaptive/evaluate",
                Some(request),
            )
            .await
    }

    pub async fn adaptive_learn(
        &self,
        request: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v2/defense/adaptive/learn", Some(request))
            .await
    }
}
