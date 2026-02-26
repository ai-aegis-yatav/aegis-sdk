use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::defense::*;
use crate::transport::Transport;

pub struct GuardNetResource {
    transport: Arc<Transport>,
}

impl GuardNetResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn analyze(&self, request: &GuardNetRequest) -> Result<GuardNetResponse> {
        self.transport
            .request(Method::POST, "/v3/defense/guardnet", Some(request))
            .await
    }

    pub async fn jbshield(&self, request: &GuardNetRequest) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v3/defense/jbshield", Some(request))
            .await
    }

    pub async fn ccfc(&self, request: &GuardNetRequest) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v3/defense/ccfc", Some(request))
            .await
    }

    pub async fn muli(&self, request: &GuardNetRequest) -> Result<serde_json::Value> {
        self.transport
            .request(Method::POST, "/v3/defense/muli", Some(request))
            .await
    }

    pub async fn unified(
        &self,
        request: &UnifiedDefenseRequest,
    ) -> Result<UnifiedDefenseResponse> {
        self.transport
            .request(Method::POST, "/v3/defense/unified", Some(request))
            .await
    }
}
