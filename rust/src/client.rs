use std::sync::Arc;

use crate::config::{ClientConfig, ClientConfigBuilder};
use crate::error::Result;
use crate::models::common::QuotaInfo;
use crate::resources::*;
use crate::transport::Transport;

pub struct AegisClient {
    transport: Arc<Transport>,
}

impl AegisClient {
    pub fn new(config: ClientConfig) -> Result<Self> {
        let transport = Arc::new(Transport::new(config)?);
        Ok(Self { transport })
    }

    pub fn builder(api_key: impl Into<String>) -> ClientBuilder {
        ClientBuilder {
            inner: ClientConfig::builder(api_key),
        }
    }

    pub fn judge(&self) -> JudgeResource {
        JudgeResource::new(Arc::clone(&self.transport))
    }

    pub fn rules(&self) -> RulesResource {
        RulesResource::new(Arc::clone(&self.transport))
    }

    pub fn escalations(&self) -> EscalationsResource {
        EscalationsResource::new(Arc::clone(&self.transport))
    }

    pub fn analytics(&self) -> AnalyticsResource {
        AnalyticsResource::new(Arc::clone(&self.transport))
    }

    pub fn evidence(&self) -> EvidenceResource {
        EvidenceResource::new(Arc::clone(&self.transport))
    }

    pub fn ml(&self) -> MlResource {
        MlResource::new(Arc::clone(&self.transport))
    }

    pub fn nlp(&self) -> NlpResource {
        NlpResource::new(Arc::clone(&self.transport))
    }

    pub fn ai_act(&self) -> AiActResource {
        AiActResource::new(Arc::clone(&self.transport))
    }

    pub fn classify(&self) -> ClassifyResource {
        ClassifyResource::new(Arc::clone(&self.transport))
    }

    pub fn jailbreak(&self) -> JailbreakResource {
        JailbreakResource::new(Arc::clone(&self.transport))
    }

    pub fn safety(&self) -> SafetyResource {
        SafetyResource::new(Arc::clone(&self.transport))
    }

    pub fn defense(&self) -> DefenseResource {
        DefenseResource::new(Arc::clone(&self.transport))
    }

    pub fn advanced(&self) -> AdvancedResource {
        AdvancedResource::new(Arc::clone(&self.transport))
    }

    pub fn adversaflow(&self) -> AdversaFlowResource {
        AdversaFlowResource::new(Arc::clone(&self.transport))
    }

    pub fn guardnet(&self) -> GuardNetResource {
        GuardNetResource::new(Arc::clone(&self.transport))
    }

    pub fn agent(&self) -> AgentResource {
        AgentResource::new(Arc::clone(&self.transport))
    }

    pub fn anomaly(&self) -> AnomalyResource {
        AnomalyResource::new(Arc::clone(&self.transport))
    }

    pub fn multimodal(&self) -> MultimodalResource {
        MultimodalResource::new(Arc::clone(&self.transport))
    }

    pub fn evolution(&self) -> EvolutionResource {
        EvolutionResource::new(Arc::clone(&self.transport))
    }

    pub fn saber(&self) -> SaberResource {
        SaberResource::new(Arc::clone(&self.transport))
    }

    pub fn ops(&self) -> OpsResource {
        OpsResource::new(Arc::clone(&self.transport))
    }

    pub fn api_keys(&self) -> ApiKeysResource {
        ApiKeysResource::new(Arc::clone(&self.transport))
    }

    pub fn orchestration(&self) -> crate::resources::OrchestrationResource {
        crate::resources::OrchestrationResource::new(Arc::clone(&self.transport))
    }

    pub fn dreamdojo(&self) -> Dreamdojo {
        Dreamdojo::new(Arc::clone(&self.transport))
    }

    pub fn military(&self) -> Military {
        Military::new(Arc::clone(&self.transport))
    }

    pub fn guard_model(&self) -> GuardModel {
        GuardModel::new(Arc::clone(&self.transport))
    }

    pub fn korean(&self) -> Korean {
        Korean::new(Arc::clone(&self.transport))
    }

    pub fn pipeline(&self) -> Pipeline {
        Pipeline::new(Arc::clone(&self.transport))
    }

    pub fn reports(&self) -> Reports {
        Reports::new(Arc::clone(&self.transport))
    }

    pub fn token_monitor(&self) -> TokenMonitor {
        TokenMonitor::new(Arc::clone(&self.transport))
    }

    pub fn v3_analytics(&self) -> V3Analytics {
        V3Analytics::new(Arc::clone(&self.transport))
    }

    pub fn quota(&self) -> Option<QuotaInfo> {
        self.transport.last_quota()
    }
}

pub struct ClientBuilder {
    inner: ClientConfigBuilder,
}

impl ClientBuilder {
    pub fn base_url(mut self, url: impl Into<String>) -> Self {
        self.inner = self.inner.base_url(url);
        self
    }

    pub fn timeout(mut self, timeout: std::time::Duration) -> Self {
        self.inner = self.inner.timeout(timeout);
        self
    }

    pub fn max_retries(mut self, max_retries: u32) -> Self {
        self.inner = self.inner.max_retries(max_retries);
        self
    }

    pub fn header(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
        self.inner = self.inner.header(key, value);
        self
    }

    pub fn build(self) -> Result<AegisClient> {
        AegisClient::new(self.inner.build())
    }
}
