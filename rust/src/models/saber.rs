use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct QueryTrialInput {
    pub query_id: String,
    pub total_trials: usize,
    pub success_count: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberEstimateRequest {
    pub queries: Vec<QueryTrialInput>,
    #[serde(default = "default_min_trials")]
    pub min_trials: usize,
    #[serde(default = "default_target_budgets")]
    pub target_budgets: Vec<usize>,
    #[serde(default = "default_confidence")]
    pub confidence_level: f64,
}

fn default_min_trials() -> usize { 10 }
fn default_target_budgets() -> Vec<usize> { vec![1, 10, 100, 1000] }
fn default_confidence() -> f64 { 0.95 }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberEstimateResponse {
    #[serde(default)]
    pub overall_asr: f64,
    #[serde(default)]
    pub budget_predictions: HashMap<String, f64>,
    #[serde(default)]
    pub confidence_intervals: HashMap<String, [f64; 2]>,
    #[serde(default)]
    pub per_query_results: Vec<serde_json::Value>,
    #[serde(default)]
    pub metadata: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberEvaluateRequest {
    pub prompts: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub n_samples: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub defense_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberEvaluateResponse {
    #[serde(default)]
    pub bon_score: f64,
    #[serde(default)]
    pub results: Vec<serde_json::Value>,
    #[serde(default)]
    pub total_samples: usize,
    #[serde(default)]
    pub successful_attacks: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberBudget {
    pub tau: f64,
    #[serde(default)]
    pub budget: f64,
    #[serde(default)]
    pub confidence_interval: [f64; 2],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberCompareRequest {
    pub defense_ids: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub test_prompts: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub budgets: Option<Vec<usize>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberCompareResponse {
    #[serde(default)]
    pub comparisons: Vec<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub winner: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SaberReport {
    pub id: String,
    #[serde(default)]
    pub results: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}
