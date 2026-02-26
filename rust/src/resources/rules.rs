use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::rules::*;
use crate::transport::Transport;

pub struct RulesResource {
    transport: Arc<Transport>,
}

impl RulesResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn create(&self, request: &RuleCreateRequest) -> Result<Rule> {
        self.transport
            .request(Method::POST, "/v1/rules", Some(request))
            .await
    }

    pub async fn get(&self, id: &str) -> Result<Rule> {
        self.transport
            .request(Method::GET, &format!("/v1/rules/{}", id), None::<&()>)
            .await
    }

    pub async fn update(&self, id: &str, request: &RuleUpdateRequest) -> Result<Rule> {
        self.transport
            .request(Method::PUT, &format!("/v1/rules/{}", id), Some(request))
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.transport
            .request::<serde_json::Value>(
                Method::DELETE,
                &format!("/v1/rules/{}", id),
                None::<&()>,
            )
            .await?;
        Ok(())
    }

    pub async fn list(&self, params: &RuleListParams) -> Result<RuleListResponse> {
        let mut query_parts = Vec::new();
        if let Some(page) = params.page {
            query_parts.push(format!("page={}", page));
        }
        if let Some(limit) = params.limit {
            query_parts.push(format!("limit={}", limit));
        }
        let path = if query_parts.is_empty() {
            "/v1/rules".to_string()
        } else {
            format!("/v1/rules?{}", query_parts.join("&"))
        };
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn test(&self, request: &RuleTestRequest) -> Result<RuleTestResponse> {
        self.transport
            .request(Method::POST, "/v1/rules/test", Some(request))
            .await
    }

    pub async fn reload(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v1/rules/reload", None::<&()>)
            .await
    }

    pub async fn templates(&self) -> Result<Vec<RuleTemplate>> {
        self.transport
            .request(Method::GET, "/v1/rules/templates", None::<&()>)
            .await
    }

    pub async fn seed(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v1/rules/seed", None::<&()>)
            .await
    }
}
