use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::{Evidence, EvidenceVerification};
use crate::transport::Transport;

pub struct EvidenceResource {
    transport: Arc<Transport>,
}

impl EvidenceResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn list(&self) -> Result<Vec<Evidence>> {
        self.transport
            .request(Method::GET, "/v1/evidence", None::<&()>)
            .await
    }

    pub async fn get(&self, id: &str) -> Result<Evidence> {
        self.transport
            .request(Method::GET, &format!("/v1/evidence/{}", id), None::<&()>)
            .await
    }

    pub async fn get_for_judgment(&self, judgment_id: &str) -> Result<Vec<Evidence>> {
        self.transport
            .request(
                Method::GET,
                &format!("/v1/evidence/judgment/{}", judgment_id),
                None::<&()>,
            )
            .await
    }

    pub async fn verify(&self, id: &str) -> Result<EvidenceVerification> {
        self.transport
            .request(
                Method::GET,
                &format!("/v1/evidence/{}/verify", id),
                None::<&()>,
            )
            .await
    }
}
