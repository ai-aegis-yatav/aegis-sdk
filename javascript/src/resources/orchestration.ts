import type { Transport } from "../transport";

export type OrchestrationScenario =
  | "basic"
  | "standard"
  | "full"
  | "advanced"
  | "agent"
  | "anomaly"
  | "pii";

export type OrchestrationMode =
  | "balanced"
  | "recall"
  | "precision"
  | "strict"
  | "bayes"
  | "auto";

export type EnsembleAlgorithm =
  | "max"
  | "arith_mean"
  | "weighted_mean"
  | "noisy_or"
  | "majority_vote"
  | "log_odds_sum"
  | "strict_consensus"
  | "two_stage_veto"
  | "hierarchical_cascade";

export interface Contributor {
  name: string;
  score: number;
  block: boolean;
  latency_ms?: number;
}

export interface OrchestratedDecision {
  scenario: OrchestrationScenario;
  mode: OrchestrationMode;
  algorithm: EnsembleAlgorithm;
  decision: "block" | "allow";
  ensemble_score: number;
  threshold: number;
  contributors: Contributor[];
  explanation: string;
  total_latency_ms: number;
}

export interface RunRequest {
  content: string;
  scenario?: OrchestrationScenario;
  mode?: OrchestrationMode;
  algorithm?: EnsembleAlgorithm;
  weights?: Record<string, number>;
  threshold?: number;
}

export interface RunResponse {
  decision: OrchestratedDecision;
}

export interface TimeseriesAnomalyRequest {
  value: number;
  history: number[];
  algorithm?: "zscore" | "moving_average" | "iqr" | "isolation_forest";
}

export interface TimeseriesAnomalyResponse {
  is_anomaly: boolean;
  anomaly_score: number;
  algorithm: string;
  latency_ms: number;
}

export interface OrchestrationConfig {
  tenant_id: string;
  scenario: OrchestrationScenario;
  algorithm: EnsembleAlgorithm;
  mode: OrchestrationMode;
  weights: Record<string, number>;
  thresholds: Record<string, number>;
  source_job_id?: string | null;
  updated_at: string;
}

export interface UpsertConfigRequest {
  algorithm: EnsembleAlgorithm;
  mode: OrchestrationMode;
  weights?: Record<string, number>;
  thresholds?: Record<string, number>;
  source_job_id?: string;
}

export interface GridSearchRequest {
  domain: string;
  scenario: OrchestrationScenario;
  max_samples?: number;
}

export interface GridSearchEntry {
  label: string;
  algorithm: string;
  precision: number;
  recall: number;
  f1: number;
  pr_auc: number;
}

export interface GridSearchResponse {
  domain: string;
  total_samples: number;
  top_combos: GridSearchEntry[];
}

export interface GridSearchJobRequest {
  domain: string;
  scenario: OrchestrationScenario;
  max_samples?: number;
}

export interface GridSearchJob {
  id: string;
  tenant_id?: string | null;
  domain: string;
  scenario: OrchestrationScenario;
  status: "queued" | "running" | "done" | "failed" | "cancelled";
  dataset_path: string;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  error?: string | null;
}

export interface GridSearchResult {
  id: string;
  job_id: string;
  algorithm: EnsembleAlgorithm;
  params: Record<string, unknown>;
  metrics: {
    precision: number;
    recall: number;
    f1: number;
    pr_auc: number;
    support: number;
  };
  is_optimal: boolean;
  created_at: string;
}

export class Orchestration {
  constructor(private t: Transport) {}

  // --- Runs (v1 always included) ---
  private async _run(
    path: string,
    req: RunRequest,
  ): Promise<OrchestratedDecision> {
    const res = await this.t.request<RunResponse>({
      method: "POST",
      path,
      body: req,
    });
    return res.decision;
  }

  run(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs", req);
  }
  basic(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/basic", req);
  }
  standard(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/standard", req);
  }
  full(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/full", req);
  }
  advanced(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/advanced", req);
  }
  agent(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/agent", req);
  }
  anomaly(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/anomaly", req);
  }
  pii(req: RunRequest): Promise<OrchestratedDecision> {
    return this._run("/v1/orchestration/runs/pii", req);
  }

  anomalyTimeseries(
    req: TimeseriesAnomalyRequest,
  ): Promise<TimeseriesAnomalyResponse> {
    return this.t.request({
      method: "POST",
      path: "/v1/orchestration/runs/anomaly/timeseries",
      body: req,
    });
  }

  // --- Tenant configs ---
  getConfig(
    tenantId: string,
    scenario: OrchestrationScenario,
  ): Promise<OrchestrationConfig> {
    return this.t.request({
      method: "GET",
      path: `/v1/orchestration/configs/${tenantId}/${scenario}`,
    });
  }

  upsertConfig(
    tenantId: string,
    scenario: OrchestrationScenario,
    body: UpsertConfigRequest,
  ): Promise<OrchestrationConfig> {
    return this.t.request({
      method: "PUT",
      path: `/v1/orchestration/configs/${tenantId}/${scenario}`,
      body,
    });
  }

  // --- Gridsearch (synchronous, smoke-test variant) ---
  gridsearch(req: GridSearchRequest): Promise<GridSearchResponse> {
    return this.t.request({
      method: "POST",
      path: "/v1/orchestration/gridsearch",
      body: req,
    });
  }

  // --- Gridsearch jobs (async, DB-persisted) ---
  createGridsearchJob(
    req: GridSearchJobRequest,
  ): Promise<{ job_id: string; status: string }> {
    return this.t.request({
      method: "POST",
      path: "/v1/orchestration/gridsearch/jobs",
      body: req,
    });
  }

  getGridsearchJob(jobId: string): Promise<GridSearchJob> {
    return this.t.request({
      method: "GET",
      path: `/v1/orchestration/gridsearch/jobs/${jobId}`,
    });
  }

  listGridsearchResults(jobId: string): Promise<GridSearchResult[]> {
    return this.t.request({
      method: "GET",
      path: `/v1/orchestration/gridsearch/jobs/${jobId}/results`,
    });
  }

  promoteGridsearchJob(
    jobId: string,
    body: { tenant_id: string; scenario: OrchestrationScenario },
  ): Promise<OrchestrationConfig> {
    return this.t.request({
      method: "POST",
      path: `/v1/orchestration/gridsearch/jobs/${jobId}/promote`,
      body,
    });
  }

  listDatasets(): Promise<Array<{ domain: string; path: string }>> {
    return this.t.request({
      method: "GET",
      path: "/v1/orchestration/datasets",
    });
  }

  // --- V3 Integrated Pipeline (RedTeam → LLM → PALADIN → SABER → Evolution) ---
  pipelineRun(req: PipelineRequest): Promise<PipelineResponse> {
    return this.t.request({
      method: "POST",
      path: "/v3/pipeline/run",
      body: req,
    });
  }

  // --- V3 Military Orchestrator (7 defense modules) ---
  militaryOrchestrate(
    req: MilitaryOrchestrateRequest,
  ): Promise<MilitaryOrchestrateResponse> {
    return this.t.request({
      method: "POST",
      path: "/v3/military/orchestrate",
      body: req,
    });
  }

  militaryStatus(): Promise<MilitaryStatusResponse> {
    return this.t.request({
      method: "GET",
      path: "/v3/military/status",
    });
  }
}

// ---- V3 Pipeline types (POST /v3/pipeline/run) ----

export interface PipelineRequest {
  prompt: string;
  scenario_id?: string;
  algorithms?: string[];
  category?: string;
  target_provider_id?: string;
  evolution_generations?: number;
  saber_trials?: number;
}

export interface PipelineResponse {
  unprotected: Record<string, unknown>;
  redteam: Record<string, unknown>;
  paladin: Record<string, unknown>;
  output_defense: Record<string, unknown>;
  evolution: Record<string, unknown>;
  total_latency_ms: number;
}

// ---- V3 Military Orchestrator types ----

export interface MilitaryOrchestrateRequest {
  text: string;
  channel_level?: number;
  source_domain?: string;
  target_domain?: string;
  session_id?: string;
}

export interface MilitaryModuleResult {
  status: string;
  risk_score: number;
  latency_ms: number;
  summary: string;
  details: unknown;
}

export interface MilitaryOrchestrateResponse {
  overall_risk: number;
  overall_status: string;
  modules: Record<string, MilitaryModuleResult>;
  total_latency_ms: number;
  timestamp: string;
}

export interface MilitaryStatusResponse {
  modules: Array<{
    name: string;
    available: boolean;
    last_analysis?: string | null;
  }>;
  overall_health: string;
  version: string;
}
