use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SafetyCheckRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SafetyCheckResponse {
    #[serde(default)]
    pub is_safe: bool,
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub categories: Vec<String>,
    #[serde(default)]
    pub flags: Vec<String>,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub scores: HashMap<String, f64>,
    #[serde(default)]
    pub backend: String,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SafetyBatchRequest {
    pub texts: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SafetyBatchResponse {
    pub results: Vec<SafetyCheckResponse>,
    #[serde(default)]
    pub total_latency_ms: f64,
    #[serde(default)]
    pub unsafe_count: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct JailbreakDetectRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct JailbreakDetectResponse {
    #[serde(default)]
    pub is_jailbreak: bool,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub jailbreak_type: String,
    #[serde(default)]
    pub matches: Vec<JailbreakMatch>,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct JailbreakMatch {
    #[serde(rename = "type", default)]
    pub match_type: String,
    #[serde(default)]
    pub pattern: String,
    #[serde(default)]
    pub matched_text: String,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub severity: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct JailbreakBatchRequest {
    pub texts: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct JailbreakBatchResponse {
    pub results: Vec<JailbreakDetectResponse>,
    #[serde(default)]
    pub total_latency_ms: f64,
    #[serde(default)]
    pub jailbreak_count: i32,
}
