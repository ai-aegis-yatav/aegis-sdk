use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::transport::Transport;

pub struct AdversaFlowResource {
    transport: Arc<Transport>,
}

impl AdversaFlowResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn list_campaigns(&self) -> Result<serde_json::Value> {
        self.transport
            .request(Method::GET, "/v2/adversaflow/campaigns", None::<&()>)
            .await
    }

    pub async fn get_attack_tree(&self, campaign_id: &str) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::GET,
                &format!("/v2/adversaflow/tree/{}", campaign_id),
                None::<&()>,
            )
            .await
    }

    pub async fn get_attack_trace(
        &self,
        campaign_id: &str,
        node_id: &str,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::GET,
                &format!("/v2/adversaflow/trace/{}/{}", campaign_id, node_id),
                None::<&()>,
            )
            .await
    }

    pub async fn get_campaign_stats(&self, campaign_id: &str) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::GET,
                &format!("/v2/adversaflow/stats/{}", campaign_id),
                None::<&()>,
            )
            .await
    }

    pub async fn get_campaign_metrics(&self, campaign_id: &str) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::GET,
                &format!("/v2/adversaflow/metrics/{}", campaign_id),
                None::<&()>,
            )
            .await
    }

    pub async fn record_attack(
        &self,
        campaign_id: &str,
        attack: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.transport
            .request(
                Method::POST,
                &format!("/v2/adversaflow/metrics/{}/record", campaign_id),
                Some(attack),
            )
            .await
    }
}
