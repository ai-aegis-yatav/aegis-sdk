use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AgentScanRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prompt: Option<String>,
    #[serde(default)]
    pub external_data: Vec<String>,
    #[serde(default)]
    pub session_id: String,
    #[serde(default)]
    pub user_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AgentScanResponse {
    #[serde(default)]
    pub safe: bool,
    #[serde(default)]
    pub threats: Vec<ThreatDetection>,
    #[serde(default)]
    pub overall_risk: f64,
    #[serde(default)]
    pub recommendations: Vec<String>,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ThreatDetection {
    #[serde(default)]
    pub threat_type: String,
    #[serde(default)]
    pub severity: String,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub evidence: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ToolchainRequest {
    #[serde(default)]
    pub tools: Vec<ToolDefinition>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub execution_plan: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ToolDefinition {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default)]
    pub permissions: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameters: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ToolchainResponse {
    #[serde(default)]
    pub safe: bool,
    #[serde(default)]
    pub risk_score: f64,
    #[serde(default)]
    pub violations: Vec<ToolchainViolation>,
    #[serde(default)]
    pub recommendations: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ToolchainViolation {
    pub tool: String,
    #[serde(default)]
    pub violation_type: String,
    #[serde(default)]
    pub severity: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MemoryPoisoningRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub memory_context: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MemoryPoisoningResponse {
    #[serde(default)]
    pub poisoning_detected: bool,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub poisoned_entries: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ReasoningHijackRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reasoning_chain: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ReasoningHijackResponse {
    #[serde(default)]
    pub hijack_detected: bool,
    #[serde(default)]
    pub confidence: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hijack_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}
