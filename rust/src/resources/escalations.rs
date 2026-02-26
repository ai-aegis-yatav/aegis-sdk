use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::escalations::*;
use crate::transport::Transport;

pub struct EscalationsResource {
    transport: Arc<Transport>,
}

impl EscalationsResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn create(&self, request: &EscalationCreateRequest) -> Result<Escalation> {
        self.transport
            .request(Method::POST, "/v1/escalations", Some(request))
            .await
    }

    pub async fn get(&self, id: &str) -> Result<Escalation> {
        self.transport
            .request(
                Method::GET,
                &format!("/v1/escalations/{}", id),
                None::<&()>,
            )
            .await
    }

    pub async fn list(&self, params: &EscalationListParams) -> Result<EscalationListResponse> {
        let mut query_parts = Vec::new();
        if let Some(ref status) = params.status {
            query_parts.push(format!("status={}", status));
        }
        if let Some(page) = params.page {
            query_parts.push(format!("page={}", page));
        }
        if let Some(limit) = params.limit {
            query_parts.push(format!("limit={}", limit));
        }
        let path = if query_parts.is_empty() {
            "/v1/escalations".to_string()
        } else {
            format!("/v1/escalations?{}", query_parts.join("&"))
        };
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn resolve(
        &self,
        id: &str,
        request: &EscalationResolveRequest,
    ) -> Result<Escalation> {
        self.transport
            .request(
                Method::POST,
                &format!("/v1/escalations/{}/resolve", id),
                Some(request),
            )
            .await
    }

    pub async fn assign(&self, id: &str, request: &EscalationAssignRequest) -> Result<Escalation> {
        self.transport
            .request(
                Method::POST,
                &format!("/v1/escalations/{}/assign", id),
                Some(request),
            )
            .await
    }

    pub async fn claim(&self, id: &str) -> Result<Escalation> {
        self.transport
            .request(
                Method::POST,
                &format!("/v1/escalations/{}/claim", id),
                None::<&()>,
            )
            .await
    }

    pub async fn stats(&self) -> Result<EscalationStats> {
        self.transport
            .request(Method::GET, "/v1/escalations/stats", None::<&()>)
            .await
    }
}
