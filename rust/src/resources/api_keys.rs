use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::{ApiKey, ApiKeyCreateRequest, ApiKeyCreateResponse};
use crate::transport::Transport;

pub struct ApiKeysResource {
    transport: Arc<Transport>,
}

impl ApiKeysResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn create(&self, request: &ApiKeyCreateRequest) -> Result<ApiKeyCreateResponse> {
        self.transport
            .request(Method::POST, "/v3/api-keys", Some(request))
            .await
    }

    pub async fn list(&self) -> Result<Vec<ApiKey>> {
        self.transport
            .request(Method::GET, "/v3/api-keys", None::<&()>)
            .await
    }

    pub async fn get(&self, id: &str) -> Result<ApiKey> {
        self.transport
            .request(
                Method::GET,
                &format!("/v3/api-keys/{}", id),
                None::<&()>,
            )
            .await
    }

    pub async fn revoke(&self, id: &str) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                &format!("/v3/api-keys/{}/revoke", id),
                None::<&()>,
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<()> {
        self.transport
            .request::<serde_json::Value>(
                Method::DELETE,
                &format!("/v3/api-keys/{}", id),
                None::<&()>,
            )
            .await?;
        Ok(())
    }
}
