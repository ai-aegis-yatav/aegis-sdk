use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyDetectRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metric: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub range: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyDetectResponse {
    #[serde(default)]
    pub anomalies: Vec<AnomalyEvent>,
    #[serde(default)]
    pub total_points: usize,
    #[serde(default)]
    pub anomaly_count: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm_used: Option<String>,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyAlgorithm {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default)]
    pub parameters: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyEvent {
    pub timestamp: String,
    #[serde(default)]
    pub value: f64,
    #[serde(default)]
    pub is_anomaly: bool,
    #[serde(default)]
    pub score: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expected_range: Option<[f64; 2]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metric: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyStats {
    #[serde(default)]
    pub total_anomalies: i64,
    #[serde(default)]
    pub anomalies_by_metric: HashMap<String, i64>,
    #[serde(default)]
    pub anomalies_by_severity: HashMap<String, i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub most_recent: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyBatchRequest {
    pub requests: Vec<AnomalyDetectRequest>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnomalyBatchResponse {
    pub results: Vec<AnomalyDetectResponse>,
    #[serde(default)]
    pub total_latency_ms: f64,
}
