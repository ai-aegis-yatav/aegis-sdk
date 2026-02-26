use std::sync::Arc;

use reqwest::Method;

use crate::error::Result;
use crate::models::agent::*;
use crate::transport::Transport;

pub struct AgentResource {
    transport: Arc<Transport>,
}

impl AgentResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    pub async fn scan(&self, request: &AgentScanRequest) -> Result<AgentScanResponse> {
        self.transport
            .request(Method::POST, "/v3/agent/scan", Some(request))
            .await
    }

    pub async fn toolchain(&self, request: &ToolchainRequest) -> Result<ToolchainResponse> {
        self.transport
            .request(Method::POST, "/v3/agent/toolchain", Some(request))
            .await
    }

    pub async fn detect_memory_poisoning(
        &self,
        request: &MemoryPoisoningRequest,
    ) -> Result<MemoryPoisoningResponse> {
        self.transport
            .request(
                Method::POST,
                "/v3/agent/memory-poisoning",
                Some(request),
            )
            .await
    }

    pub async fn detect_reasoning_hijack(
        &self,
        request: &ReasoningHijackRequest,
    ) -> Result<ReasoningHijackResponse> {
        self.transport
            .request(
                Method::POST,
                "/v3/agent/reasoning-hijack",
                Some(request),
            )
            .await
    }

    pub async fn detect_tool_disguise(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "content": text });
        self.transport
            .request(Method::POST, "/v3/agent/tool-disguise", Some(&body))
            .await
    }

    pub async fn detect_privilege_escalation(&self, text: &str) -> Result<serde_json::Value> {
        let body = serde_json::json!({ "content": text });
        self.transport
            .request(
                Method::POST,
                "/v3/agent/privilege-escalation",
                Some(&body),
            )
            .await
    }
}
