use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::common::*;
use crate::transport::Transport;

pub struct EvolutionResource {
    transport: Arc<Transport>,
}

impl EvolutionResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn generate(
        &self,
        request: &EvolutionGenerateRequest,
    ) -> Result<EvolutionGenerateResponse> {
        self.transport
            .request(Method::POST, "/v3/evolution/generate", Some(request))
            .await
    }

    pub async fn evolve(
        &self,
        request: &EvolutionEvolveRequest,
    ) -> Result<EvolutionEvolveResponse> {
        self.transport
            .request(Method::POST, "/v3/evolution/evolve", Some(request))
            .await
    }

    pub async fn stats(&self) -> Result<EvolutionStats> {
        self.transport
            .request(Method::GET, "/v3/evolution/stats", None::<&()>)
            .await
    }
}
