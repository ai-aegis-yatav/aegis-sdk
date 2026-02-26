export type * from "./common";
export type * from "./judge";
export type * from "./rules";

// V1 models
export interface Escalation {
  id: string;
  judgment_id: string;
  reason: string;
  status: string;
  priority: number;
  assigned_to?: string;
  resolved_by?: string;
  resolution?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EscalationCreateRequest {
  judgment_id: string;
  reason: string;
  priority?: number;
}

export interface EscalationStats {
  total: number;
  pending: number;
  in_review: number;
  resolved: number;
  average_resolution_time_ms?: number;
  by_priority: Record<string, number>;
}

export interface Evidence {
  id: string;
  judgment_id: string;
  evidence_type: string;
  content: unknown;
  hash?: string;
  metadata: Record<string, unknown>;
  created_at?: string;
}

export interface EvidenceVerification {
  id: string;
  is_valid: boolean;
  hash_match: boolean;
  verified_at: string;
  details?: Record<string, unknown>;
}

export interface AnalyticsOverview {
  total_judgments: number;
  total_blocked: number;
  total_allowed: number;
  avg_latency_ms?: number;
  risk_distribution: Record<string, number>;
  time_series: Record<string, unknown>[];
  defense_layers: Record<string, unknown>[];
  top_threats: Record<string, unknown>[];
}

export interface EmbedRequest { text: string; model?: string; }
export interface EmbedResponse { embedding: number[]; model: string; dimensions: number; }
export interface ClassifyMLRequest { text: string; labels?: string[]; model?: string; }
export interface ClassifyMLResponse { label: string; confidence: number; scores: Record<string, number>; }
export interface SimilarityRequest { query: string; documents: string[]; top_k?: number; model?: string; }
export interface SimilarityResponse { results: Record<string, unknown>[]; model: string; }

// V2 models
export interface ContentClassifyRequest { content: string; categories?: string[]; threshold?: number; model?: string; }
export interface ContentClassifyResponse { category: string; confidence: number; sub_categories: Record<string, unknown>[]; scores: Record<string, number>; model: string; }
export interface SafetyCheckRequest { content: string; categories?: string[]; backend?: string; threshold?: number; }
export interface SafetyCheckResponse { is_safe: boolean; overall_score: number; categories: Record<string, unknown>[]; flagged_categories: string[]; backend: string; details?: Record<string, unknown>; }
export interface JailbreakDetectRequest { content: string; detection_methods?: string[]; threshold?: number; }
export interface JailbreakDetectResponse { is_jailbreak: boolean; confidence: number; jailbreak_type?: string; matched_patterns: string[]; details?: Record<string, unknown>; }
export interface AdvancedDetectRequest { content: string; attack_types?: string[]; context?: Record<string, unknown>; }
export interface AdvancedDetectResponse { detected: boolean; attack_type?: string; confidence: number; attack_details: Record<string, unknown>[]; mitigations: string[]; details?: Record<string, unknown>; }

export interface TrustValidateRequest { content: string; context?: Record<string, unknown>; source?: string; }
export interface TrustValidateResponse { trust_score: number; is_trusted: boolean; factors: Record<string, unknown>[]; details?: Record<string, unknown>; }
export interface RagDetectRequest { query: string; documents: string[]; context?: Record<string, unknown>; }
export interface RagDetectResponse { is_poisoned: boolean; poisoned_documents: number[]; confidence: number; details?: Record<string, unknown>; }
export interface CircuitBreakerResponse { tripped: boolean; reason?: string; severity: string; details?: Record<string, unknown>; }
export interface CircuitBreakerStatus { state: string; failure_count: number; last_failure_at?: string; cooldown_remaining_ms?: number; }
export interface AdaptiveEvalResponse { threat_level: string; adapted_defenses: string[]; confidence: number; recommendations: string[]; details?: Record<string, unknown>; }

// V3 models
export interface AgentScanRequest { prompt: string; tools?: string[]; context?: Record<string, unknown>; scan_type?: string; }
export interface AgentScanResponse { injection_detected: boolean; injection_type?: string; confidence: number; dpi_results?: Record<string, unknown>; ipi_results?: Record<string, unknown>; recommendations: string[]; details?: Record<string, unknown>; }
export interface ToolchainRequest { tools: Record<string, unknown>[]; execution_plan?: string[]; context?: Record<string, unknown>; }
export interface ToolchainResponse { is_safe: boolean; risk_level: string; tool_risks: Record<string, unknown>[]; chain_risks: Record<string, unknown>[]; recommendations: string[]; }
export interface AnomalyDetectRequest { metric: string; algorithm?: string; data_range?: Record<string, unknown>; parameters?: Record<string, unknown>; }
export interface AnomalyDetectResponse { anomalies_detected: number; anomalies: Record<string, unknown>[]; algorithm: string; threshold: number; details?: Record<string, unknown>; }
export interface MultimodalScanRequest { content: string; content_type?: string; image_url?: string; image_base64?: string; scan_types?: string[]; context?: Record<string, unknown>; }
export interface MultimodalScanResponse { is_safe: boolean; threats: Record<string, unknown>[]; modality_results: Record<string, unknown>; overall_risk: number; details?: Record<string, unknown>; }
export interface SaberEstimateRequest { content: string; prior_alpha?: number; prior_beta?: number; context?: Record<string, unknown>; }
export interface SaberEstimateResponse { risk_estimate: number; confidence_interval: number[]; alpha: number; beta: number; details?: Record<string, unknown>; }
export interface SaberEvaluateRequest { content: string; n_samples?: number; defense?: string; parameters?: Record<string, unknown>; }
export interface SaberEvaluateResponse { safety_rate: number; n_safe: number; n_total: number; confidence: number; samples: Record<string, unknown>[]; details?: Record<string, unknown>; }

export interface WatermarkRequest { content: string; watermark_type?: string; metadata?: Record<string, unknown>; }
export interface WatermarkResponse { watermarked_content: string; watermark_id: string; verification_url?: string; details?: Record<string, unknown>; }
export interface PiiDetectRequest { content: string; locale?: string; categories?: string[]; }
export interface PiiDetectResponse { pii_found: boolean; entities: Record<string, unknown>[]; redacted_content?: string; details?: Record<string, unknown>; }

export interface ApiKeyCreateRequest { name: string; description?: string; scopes?: string[]; expires_in_days?: number; }
export interface ApiKey { id: string; name: string; key_prefix: string; key_preview: string; scopes: string[]; permissions: string[]; created_at?: string; last_used_at?: string; expires_at?: string; is_active: boolean; }
export interface ApiKeyCreateResponse extends ApiKey { api_key: string; key: string; }

export interface CiGateRequest { test_suite: string; thresholds?: Record<string, number>; parameters?: Record<string, unknown>; }
export interface CiGateResponse { passed: boolean; score: number; results: Record<string, unknown>[]; failures: Record<string, unknown>[]; details?: Record<string, unknown>; }
