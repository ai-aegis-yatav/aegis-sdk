use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    #[serde(default)]
    pub total: i64,
    #[serde(default)]
    pub page: i32,
    #[serde(default)]
    pub limit: i32,
    #[serde(default)]
    pub has_more: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct QuotaInfo {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub used: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub remaining: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reset_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnalyticsOverview {
    #[serde(default)]
    pub total_requests: i64,
    #[serde(default)]
    pub approved: i64,
    #[serde(default)]
    pub blocked: i64,
    #[serde(default)]
    pub escalated: i64,
    #[serde(default)]
    pub avg_latency_ms: f64,
    #[serde(default)]
    pub top_risks: Vec<TopRisk>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TopRisk {
    pub label: String,
    pub count: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AnalyticsTimeline {
    pub points: Vec<TimelinePoint>,
    #[serde(default)]
    pub interval: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TimelinePoint {
    pub timestamp: String,
    #[serde(default)]
    pub total: i64,
    #[serde(default)]
    pub approved: i64,
    #[serde(default)]
    pub blocked: i64,
    #[serde(default)]
    pub escalated: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Evidence {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub judgment_id: Option<String>,
    #[serde(default)]
    pub evidence_type: String,
    #[serde(default)]
    pub data: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct EvidenceVerification {
    pub valid: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ApiKey {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prefix: Option<String>,
    #[serde(default)]
    pub permissions: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(default)]
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ApiKeyCreateRequest {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub permissions: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ApiKeyCreateResponse {
    pub id: String,
    pub key: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prefix: Option<String>,
    #[serde(default)]
    pub permissions: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct WatermarkRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct WatermarkResponse {
    #[serde(default)]
    pub watermarked_content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub watermark_id: Option<String>,
    #[serde(default)]
    pub compliant: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct PiiDetectRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct PiiDetectResponse {
    #[serde(default)]
    pub pii_detected: bool,
    #[serde(default)]
    pub entities: Vec<PiiEntity>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub redacted_text: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct PiiEntity {
    #[serde(default)]
    pub entity_type: String,
    #[serde(default)]
    pub text: String,
    #[serde(default)]
    pub start: usize,
    #[serde(default)]
    pub end: usize,
    #[serde(default)]
    pub confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct CiGateRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub test_prompts: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thresholds: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct CiGateResponse {
    #[serde(default)]
    pub passed: bool,
    #[serde(default)]
    pub gate_id: String,
    #[serde(default)]
    pub results: Vec<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ClassifyRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ClassifyResponse {
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub needs_llm_review: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subcategory: Option<String>,
    #[serde(default)]
    pub similar_examples: Vec<SimilarExample>,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SimilarExample {
    pub text: String,
    pub category: String,
    #[serde(default)]
    pub similarity: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subcategory: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ClassifyBatchRequest {
    pub texts: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ClassifyBatchResponse {
    pub results: Vec<ClassifyResponse>,
    #[serde(default)]
    pub total_latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct CategoryInfo {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default)]
    pub example_count: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct NlpAnalyzeRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct NlpAnalyzeResponse {
    #[serde(default)]
    pub language: serde_json::Value,
    #[serde(default)]
    pub jailbreak: serde_json::Value,
    #[serde(default)]
    pub harmful: serde_json::Value,
    #[serde(default)]
    pub overall_risk_score: f64,
    #[serde(default)]
    pub decision: String,
    #[serde(default)]
    pub processing_time_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlEmbedRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlEmbedResponse {
    pub embedding: Vec<f32>,
    #[serde(default)]
    pub dimension: usize,
    #[serde(default)]
    pub model: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlEmbedBatchRequest {
    pub texts: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlEmbedBatchResponse {
    pub embeddings: Vec<Vec<f32>>,
    #[serde(default)]
    pub dimension: usize,
    #[serde(default)]
    pub model: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlClassifyRequest {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlClassifyResponse {
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub is_jailbreak: bool,
    #[serde(default)]
    pub scores: HashMap<String, f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlSearchRequest {
    pub query: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_k: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlSearchResponse {
    pub results: Vec<MlSearchResult>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MlSearchResult {
    pub text: String,
    pub category: String,
    #[serde(default)]
    pub similarity: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ComplianceVerifyRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ComplianceVerifyResponse {
    #[serde(default)]
    pub compliant: bool,
    #[serde(default)]
    pub violations: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RiskAssessRequest {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RiskAssessResponse {
    #[serde(default)]
    pub risk_level: String,
    #[serde(default)]
    pub score: f64,
    #[serde(default)]
    pub factors: Vec<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recommendations: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct RedTeamCampaign {
    #[serde(default)]
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AdvancedAttackDetectRequest {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub attack_types: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct AdvancedAttackDetectResponse {
    #[serde(default)]
    pub detected: bool,
    #[serde(default)]
    pub attacks: Vec<DetectedAttack>,
    #[serde(default)]
    pub overall_risk: f64,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct DetectedAttack {
    #[serde(default)]
    pub attack_type: String,
    #[serde(default)]
    pub confidence: f64,
    #[serde(default)]
    pub severity: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MultimodalScanRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image: Option<ImageData>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub audio_transcription: Option<String>,
    #[serde(default)]
    pub check_types: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ImageData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base64: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub media_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct MultimodalScanResponse {
    #[serde(default)]
    pub safe: bool,
    #[serde(default)]
    pub threats: Vec<DetectedAttack>,
    #[serde(default)]
    pub overall_risk: f64,
    #[serde(default)]
    pub latency_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct EvolutionGenerateRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target_behavior: Option<String>,
    #[serde(default)]
    pub categories: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub attack_type: Option<String>,
    #[serde(default)]
    pub count: usize,
    #[serde(default)]
    pub difficulty: String,
    #[serde(default)]
    pub include_multi_turn: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct EvolutionGenerateResponse {
    #[serde(default)]
    pub scenarios: Vec<serde_json::Value>,
    #[serde(default)]
    pub total_generated: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct EvolutionEvolveRequest {
    #[serde(default)]
    pub prompts: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mutation_rate: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generations: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct EvolutionEvolveResponse {
    #[serde(default)]
    pub evolved: Vec<serde_json::Value>,
    #[serde(default)]
    pub generations: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct EvolutionStats {
    #[serde(default)]
    pub total_generated: i64,
    #[serde(default)]
    pub total_evolved: i64,
    #[serde(default)]
    pub categories: HashMap<String, i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct HealthResponse {
    #[serde(default)]
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uptime: Option<String>,
}
