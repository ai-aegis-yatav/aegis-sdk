use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TrustValidateRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub trust_level: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TrustValidateResponse {
    #[serde(default)]
    pub trusted: bool,
    #[serde(default)]
    pub trust_score: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub violations: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TrustProfile {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
    #[serde(default)]
    pub trust_score: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub trust_level: Option<String>,
    #[serde(default)]
    pub total_requests: i64,
    #[serde(default)]
    pub blocked_requests: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RagDetectRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RagDetectResponse {
    #[serde(default)]
    pub poisoning_detected: bool,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub poisoned_sources: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RagSecureQueryRequest {
    pub query: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sources: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RagSecureQueryResponse {
    #[serde(default)]
    pub safe: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sanitized_query: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filtered_sources: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct CircuitBreakerRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct CircuitBreakerResponse {
    #[serde(default)]
    pub state: String,
    #[serde(default)]
    pub allowed: bool,
    #[serde(default)]
    pub failure_count: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub threshold: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reset_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AdaptiveEvalRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AdaptiveEvalResponse {
    #[serde(default)]
    pub decision: String,
    #[serde(default)]
    pub confidence: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub adapted_threshold: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub learning_rate: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct PaladinStats {
    #[serde(default)]
    pub total_evaluations: i64,
    #[serde(default)]
    pub blocked: i64,
    #[serde(default)]
    pub approved: i64,
    #[serde(default)]
    pub layers: Vec<PaladinLayerStats>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct PaladinLayerStats {
    pub name: String,
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub total_checks: i64,
    #[serde(default)]
    pub blocks: i64,
    #[serde(default)]
    pub avg_latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GuardNetRequest {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub threshold: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct GuardNetResponse {
    #[serde(default)]
    pub jailbreak_probability: f64,
    #[serde(default)]
    pub should_block: bool,
    #[serde(default)]
    pub hierarchy_scores: Vec<serde_json::Value>,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct UnifiedDefenseRequest {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub threshold: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct UnifiedDefenseResponse {
    #[serde(default)]
    pub should_block: bool,
    #[serde(default)]
    pub overall_score: f64,
    #[serde(default)]
    pub results: serde_json::Value,
    #[serde(default)]
    pub latency_ms: f64,
}
