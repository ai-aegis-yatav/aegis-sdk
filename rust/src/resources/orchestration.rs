//! Orchestration resource — `/v1/orchestration/*` endpoints.
//!
//! Every `runs/*` call always includes v1/judge. v2/v3 detectors are layered
//! on top via in-process adapters server-side.

use std::collections::HashMap;
use std::sync::Arc;

use reqwest::Method;
use serde::{Deserialize, Serialize};

use crate::error::Result;
use crate::transport::Transport;

// ---- Models ----

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Scenario {
    Basic,
    Standard,
    Full,
    Advanced,
    Agent,
    Anomaly,
    Pii,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EnsembleMode {
    Balanced,
    Recall,
    Precision,
    Strict,
    Bayes,
    Auto,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EnsembleAlgorithm {
    Max,
    ArithMean,
    WeightedMean,
    NoisyOr,
    MajorityVote,
    LogOddsSum,
    StrictConsensus,
    TwoStageVeto,
    HierarchicalCascade,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Contributor {
    pub name: String,
    pub score: f64,
    pub block: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrchestratedDecision {
    pub scenario: Scenario,
    pub mode: EnsembleMode,
    pub algorithm: EnsembleAlgorithm,
    pub decision: String,
    pub ensemble_score: f64,
    pub threshold: f64,
    pub contributors: Vec<Contributor>,
    pub explanation: String,
    pub total_latency_ms: u64,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct RunRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scenario: Option<Scenario>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mode: Option<EnsembleMode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm: Option<EnsembleAlgorithm>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub weights: HashMap<String, f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub threshold: Option<f64>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RunResponse {
    pub decision: OrchestratedDecision,
}

#[derive(Debug, Clone, Serialize)]
pub struct TimeseriesAnomalyRequest {
    pub value: f64,
    pub history: Vec<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct TimeseriesAnomalyResponse {
    pub is_anomaly: bool,
    pub anomaly_score: f64,
    pub algorithm: String,
    pub latency_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrchestrationConfig {
    pub tenant_id: uuid::Uuid,
    pub scenario: Scenario,
    pub algorithm: EnsembleAlgorithm,
    pub mode: EnsembleMode,
    pub weights: HashMap<String, f64>,
    pub thresholds: HashMap<String, f64>,
    pub source_job_id: Option<uuid::Uuid>,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct UpsertConfigRequest {
    pub algorithm: EnsembleAlgorithm,
    pub mode: EnsembleMode,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub weights: HashMap<String, f64>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub thresholds: HashMap<String, f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_job_id: Option<uuid::Uuid>,
}

#[derive(Debug, Clone, Serialize)]
pub struct GridSearchRequest {
    pub domain: String,
    pub scenario: Scenario,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_samples: Option<usize>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GridSearchEntry {
    pub label: String,
    pub algorithm: String,
    pub precision: f64,
    pub recall: f64,
    pub f1: f64,
    pub pr_auc: f64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GridSearchResponse {
    pub domain: String,
    pub total_samples: usize,
    pub top_combos: Vec<GridSearchEntry>,
}

#[derive(Debug, Clone, Serialize)]
pub struct GridSearchJobRequest {
    pub domain: String,
    pub scenario: Scenario,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_samples: Option<usize>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateJobResponse {
    pub job_id: uuid::Uuid,
    pub status: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GridSearchJob {
    pub id: uuid::Uuid,
    pub tenant_id: Option<uuid::Uuid>,
    pub domain: String,
    pub scenario: Scenario,
    pub status: String,
    pub dataset_path: String,
    pub created_at: String,
    pub started_at: Option<String>,
    pub finished_at: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Default)]
pub struct GridMetrics {
    pub precision: f64,
    pub recall: f64,
    pub f1: f64,
    pub pr_auc: f64,
    pub support: usize,
}

#[derive(Debug, Clone, Deserialize)]
pub struct GridSearchResult {
    pub id: uuid::Uuid,
    pub job_id: uuid::Uuid,
    pub algorithm: EnsembleAlgorithm,
    pub params: serde_json::Value,
    pub metrics: GridMetrics,
    pub is_optimal: bool,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct PromoteRequest {
    pub tenant_id: uuid::Uuid,
    pub scenario: Scenario,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DatasetEntry {
    pub domain: String,
    pub path: String,
}

// ---- Resource ----

pub struct OrchestrationResource {
    transport: Arc<Transport>,
}

impl OrchestrationResource {
    pub(crate) fn new(transport: Arc<Transport>) -> Self {
        Self { transport }
    }

    async fn run(&self, path: &str, req: &RunRequest) -> Result<OrchestratedDecision> {
        let resp: RunResponse = self.transport.request(Method::POST, path, Some(req)).await?;
        Ok(resp.decision)
    }

    pub async fn run_generic(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs", req).await
    }
    pub async fn basic(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/basic", req).await
    }
    pub async fn standard(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/standard", req).await
    }
    pub async fn full(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/full", req).await
    }
    pub async fn advanced(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/advanced", req).await
    }
    pub async fn agent(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/agent", req).await
    }
    pub async fn anomaly(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/anomaly", req).await
    }
    pub async fn pii(&self, req: &RunRequest) -> Result<OrchestratedDecision> {
        self.run("/v1/orchestration/runs/pii", req).await
    }

    pub async fn anomaly_timeseries(
        &self,
        req: &TimeseriesAnomalyRequest,
    ) -> Result<TimeseriesAnomalyResponse> {
        self.transport
            .request(
                Method::POST,
                "/v1/orchestration/runs/anomaly/timeseries",
                Some(req),
            )
            .await
    }

    pub async fn get_config(
        &self,
        tenant_id: uuid::Uuid,
        scenario: &str,
    ) -> Result<OrchestrationConfig> {
        let path = format!("/v1/orchestration/configs/{}/{}", tenant_id, scenario);
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn upsert_config(
        &self,
        tenant_id: uuid::Uuid,
        scenario: &str,
        body: &UpsertConfigRequest,
    ) -> Result<OrchestrationConfig> {
        let path = format!("/v1/orchestration/configs/{}/{}", tenant_id, scenario);
        self.transport
            .request(Method::PUT, &path, Some(body))
            .await
    }

    /// Synchronous grid search over a domain dataset (smoke-test variant).
    /// Use [`Self::create_gridsearch_job`] for the async, DB-persisted version.
    pub async fn gridsearch(&self, req: &GridSearchRequest) -> Result<GridSearchResponse> {
        self.transport
            .request(Method::POST, "/v1/orchestration/gridsearch", Some(req))
            .await
    }

    pub async fn create_gridsearch_job(
        &self,
        req: &GridSearchJobRequest,
    ) -> Result<CreateJobResponse> {
        self.transport
            .request(Method::POST, "/v1/orchestration/gridsearch/jobs", Some(req))
            .await
    }

    pub async fn get_gridsearch_job(&self, job_id: uuid::Uuid) -> Result<GridSearchJob> {
        let path = format!("/v1/orchestration/gridsearch/jobs/{}", job_id);
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn list_gridsearch_results(
        &self,
        job_id: uuid::Uuid,
    ) -> Result<Vec<GridSearchResult>> {
        let path = format!("/v1/orchestration/gridsearch/jobs/{}/results", job_id);
        self.transport
            .request(Method::GET, &path, None::<&()>)
            .await
    }

    pub async fn promote_gridsearch_job(
        &self,
        job_id: uuid::Uuid,
        body: &PromoteRequest,
    ) -> Result<OrchestrationConfig> {
        let path = format!("/v1/orchestration/gridsearch/jobs/{}/promote", job_id);
        self.transport
            .request(Method::POST, &path, Some(body))
            .await
    }

    pub async fn list_datasets(&self) -> Result<Vec<DatasetEntry>> {
        self.transport
            .request(Method::GET, "/v1/orchestration/datasets", None::<&()>)
            .await
    }

    // ---- V3 Integrated Pipeline ----
    pub async fn pipeline_run(&self, req: &PipelineRequest) -> Result<PipelineResponse> {
        self.transport
            .request(Method::POST, "/v3/pipeline/run", Some(req))
            .await
    }

    // ---- V3 Military Orchestrator ----
    pub async fn military_orchestrate(
        &self,
        req: &MilitaryOrchestrateRequest,
    ) -> Result<MilitaryOrchestrateResponse> {
        self.transport
            .request(Method::POST, "/v3/military/orchestrate", Some(req))
            .await
    }

    pub async fn military_status(&self) -> Result<MilitaryStatusResponse> {
        self.transport
            .request(Method::GET, "/v3/military/status", None::<&()>)
            .await
    }
}

// ---- V3 Pipeline ----

#[derive(Debug, Clone, Default, Serialize)]
pub struct PipelineRequest {
    pub prompt: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scenario_id: Option<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub algorithms: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_provider_id: Option<uuid::Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub evolution_generations: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub saber_trials: Option<usize>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct PipelineResponse {
    pub unprotected: serde_json::Value,
    pub redteam: serde_json::Value,
    pub paladin: serde_json::Value,
    pub output_defense: serde_json::Value,
    pub evolution: serde_json::Value,
    pub total_latency_ms: u64,
}

// ---- V3 Military Orchestrator ----

#[derive(Debug, Clone, Default, Serialize)]
pub struct MilitaryOrchestrateRequest {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub channel_level: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_domain: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_domain: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct MilitaryModuleResult {
    pub status: String,
    pub risk_score: f64,
    pub latency_ms: u64,
    pub summary: String,
    pub details: serde_json::Value,
}

#[derive(Debug, Clone, Deserialize)]
pub struct MilitaryOrchestrateResponse {
    pub overall_risk: f64,
    pub overall_status: String,
    pub modules: HashMap<String, MilitaryModuleResult>,
    pub total_latency_ms: u64,
    pub timestamp: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct MilitaryModuleStatus {
    pub name: String,
    pub available: bool,
    pub last_analysis: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct MilitaryStatusResponse {
    pub modules: Vec<MilitaryModuleStatus>,
    pub overall_health: String,
    pub version: String,
}
