package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// OrchestrationService wraps /v1/orchestration/* endpoints.
// Every runs/* call always includes v1/judge.
type OrchestrationService struct {
	t *internal.Transport
}

type OrchestrationRunRequest struct {
	Content   string             `json:"content"`
	Scenario  string             `json:"scenario,omitempty"`
	Mode      string             `json:"mode,omitempty"`
	Algorithm string             `json:"algorithm,omitempty"`
	Weights   map[string]float64 `json:"weights,omitempty"`
	Threshold *float64           `json:"threshold,omitempty"`
}

type OrchestrationContributor struct {
	Name      string  `json:"name"`
	Score     float64 `json:"score"`
	Block     bool    `json:"block"`
	LatencyMs *uint64 `json:"latency_ms,omitempty"`
}

type OrchestratedDecision struct {
	Scenario       string                     `json:"scenario"`
	Mode           string                     `json:"mode"`
	Algorithm      string                     `json:"algorithm"`
	Decision       string                     `json:"decision"`
	EnsembleScore  float64                    `json:"ensemble_score"`
	Threshold      float64                    `json:"threshold"`
	Contributors   []OrchestrationContributor `json:"contributors"`
	Explanation    string                     `json:"explanation"`
	TotalLatencyMs uint64                     `json:"total_latency_ms"`
}

type orchestrationRunResponse struct {
	Decision OrchestratedDecision `json:"decision"`
}

func (s *OrchestrationService) run(ctx context.Context, path string, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	var resp orchestrationRunResponse
	if err := s.t.Do(ctx, "POST", path, req, &resp); err != nil {
		return nil, err
	}
	return &resp.Decision, nil
}

func (s *OrchestrationService) Run(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs", req)
}
func (s *OrchestrationService) Basic(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/basic", req)
}
func (s *OrchestrationService) Standard(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/standard", req)
}
func (s *OrchestrationService) Full(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/full", req)
}
func (s *OrchestrationService) Advanced(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/advanced", req)
}
func (s *OrchestrationService) Agent(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/agent", req)
}
func (s *OrchestrationService) Anomaly(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/anomaly", req)
}
func (s *OrchestrationService) PII(ctx context.Context, req OrchestrationRunRequest) (*OrchestratedDecision, error) {
	return s.run(ctx, "/v1/orchestration/runs/pii", req)
}

type TimeseriesAnomalyRequest struct {
	Value     float64   `json:"value"`
	History   []float64 `json:"history"`
	Algorithm string    `json:"algorithm,omitempty"`
}

type TimeseriesAnomalyResponse struct {
	IsAnomaly    bool    `json:"is_anomaly"`
	AnomalyScore float64 `json:"anomaly_score"`
	Algorithm    string  `json:"algorithm"`
	LatencyMs    uint64  `json:"latency_ms"`
}

func (s *OrchestrationService) AnomalyTimeseries(ctx context.Context, req TimeseriesAnomalyRequest) (*TimeseriesAnomalyResponse, error) {
	var resp TimeseriesAnomalyResponse
	if err := s.t.Do(ctx, "POST", "/v1/orchestration/runs/anomaly/timeseries", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

type OrchestrationConfig struct {
	TenantID    string             `json:"tenant_id"`
	Scenario    string             `json:"scenario"`
	Algorithm   string             `json:"algorithm"`
	Mode        string             `json:"mode"`
	Weights     map[string]float64 `json:"weights"`
	Thresholds  map[string]float64 `json:"thresholds"`
	SourceJobID *string            `json:"source_job_id,omitempty"`
	UpdatedAt   string             `json:"updated_at"`
}

type UpsertConfigRequest struct {
	Algorithm   string             `json:"algorithm"`
	Mode        string             `json:"mode"`
	Weights     map[string]float64 `json:"weights,omitempty"`
	Thresholds  map[string]float64 `json:"thresholds,omitempty"`
	SourceJobID *string            `json:"source_job_id,omitempty"`
}

func (s *OrchestrationService) GetConfig(ctx context.Context, tenantID, scenario string) (*OrchestrationConfig, error) {
	var resp OrchestrationConfig
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v1/orchestration/configs/%s/%s", tenantID, scenario), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OrchestrationService) UpsertConfig(ctx context.Context, tenantID, scenario string, body UpsertConfigRequest) (*OrchestrationConfig, error) {
	var resp OrchestrationConfig
	if err := s.t.Do(ctx, "PUT", fmt.Sprintf("/v1/orchestration/configs/%s/%s", tenantID, scenario), body, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

// GridSearchRequest is the body for the synchronous /v1/orchestration/gridsearch endpoint.
type GridSearchRequest struct {
	Domain     string `json:"domain"`
	Scenario   string `json:"scenario"`
	MaxSamples *int   `json:"max_samples,omitempty"`
}

type GridSearchEntry struct {
	Label     string  `json:"label"`
	Algorithm string  `json:"algorithm"`
	Precision float64 `json:"precision"`
	Recall    float64 `json:"recall"`
	F1        float64 `json:"f1"`
	PrAuc     float64 `json:"pr_auc"`
}

type GridSearchResponse struct {
	Domain       string            `json:"domain"`
	TotalSamples int               `json:"total_samples"`
	TopCombos    []GridSearchEntry `json:"top_combos"`
}

// Gridsearch runs a synchronous grid search over a domain dataset.
// Use CreateGridsearchJob for the async, DB-persisted variant.
func (s *OrchestrationService) Gridsearch(ctx context.Context, req GridSearchRequest) (*GridSearchResponse, error) {
	var resp GridSearchResponse
	if err := s.t.Do(ctx, "POST", "/v1/orchestration/gridsearch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

type GridSearchJobRequest struct {
	Domain     string `json:"domain"`
	Scenario   string `json:"scenario"`
	MaxSamples *int   `json:"max_samples,omitempty"`
}

type CreateJobResponse struct {
	JobID  string `json:"job_id"`
	Status string `json:"status"`
}

type GridSearchJob struct {
	ID          string  `json:"id"`
	TenantID    *string `json:"tenant_id,omitempty"`
	Domain      string  `json:"domain"`
	Scenario    string  `json:"scenario"`
	Status      string  `json:"status"`
	DatasetPath string  `json:"dataset_path"`
	CreatedAt   string  `json:"created_at"`
	StartedAt   *string `json:"started_at,omitempty"`
	FinishedAt  *string `json:"finished_at,omitempty"`
	Error       *string `json:"error,omitempty"`
}

type GridMetrics struct {
	Precision float64 `json:"precision"`
	Recall    float64 `json:"recall"`
	F1        float64 `json:"f1"`
	PrAuc     float64 `json:"pr_auc"`
	Support   int     `json:"support"`
}

type GridSearchResult struct {
	ID        string                 `json:"id"`
	JobID     string                 `json:"job_id"`
	Algorithm string                 `json:"algorithm"`
	Params    map[string]interface{} `json:"params"`
	Metrics   GridMetrics            `json:"metrics"`
	IsOptimal bool                   `json:"is_optimal"`
	CreatedAt string                 `json:"created_at"`
}

func (s *OrchestrationService) CreateGridsearchJob(ctx context.Context, req GridSearchJobRequest) (*CreateJobResponse, error) {
	var resp CreateJobResponse
	if err := s.t.Do(ctx, "POST", "/v1/orchestration/gridsearch/jobs", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OrchestrationService) GetGridsearchJob(ctx context.Context, jobID string) (*GridSearchJob, error) {
	var resp GridSearchJob
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v1/orchestration/gridsearch/jobs/%s", jobID), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OrchestrationService) ListGridsearchResults(ctx context.Context, jobID string) ([]GridSearchResult, error) {
	var resp []GridSearchResult
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v1/orchestration/gridsearch/jobs/%s/results", jobID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

type PromoteRequest struct {
	TenantID string `json:"tenant_id"`
	Scenario string `json:"scenario"`
}

func (s *OrchestrationService) PromoteGridsearchJob(ctx context.Context, jobID string, req PromoteRequest) (*OrchestrationConfig, error) {
	var resp OrchestrationConfig
	if err := s.t.Do(ctx, "POST", fmt.Sprintf("/v1/orchestration/gridsearch/jobs/%s/promote", jobID), req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

type DatasetEntry struct {
	Domain string `json:"domain"`
	Path   string `json:"path"`
}

func (s *OrchestrationService) ListDatasets(ctx context.Context) ([]DatasetEntry, error) {
	var resp []DatasetEntry
	if err := s.t.Do(ctx, "GET", "/v1/orchestration/datasets", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

// =============================================================================
// V3 Integrated Pipeline (POST /v3/pipeline/run)
// =============================================================================

type PipelineRequest struct {
	Prompt               string   `json:"prompt"`
	ScenarioID           string   `json:"scenario_id,omitempty"`
	Algorithms           []string `json:"algorithms,omitempty"`
	Category             string   `json:"category,omitempty"`
	TargetProviderID     string   `json:"target_provider_id,omitempty"`
	EvolutionGenerations int      `json:"evolution_generations,omitempty"`
	SaberTrials          int      `json:"saber_trials,omitempty"`
}

type PipelineResponse struct {
	Unprotected    map[string]interface{} `json:"unprotected"`
	RedTeam        map[string]interface{} `json:"redteam"`
	Paladin        map[string]interface{} `json:"paladin"`
	OutputDefense  map[string]interface{} `json:"output_defense"`
	Evolution      map[string]interface{} `json:"evolution"`
	TotalLatencyMs uint64                 `json:"total_latency_ms"`
}

func (s *OrchestrationService) PipelineRun(ctx context.Context, req PipelineRequest) (*PipelineResponse, error) {
	var resp PipelineResponse
	if err := s.t.Do(ctx, "POST", "/v3/pipeline/run", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

// =============================================================================
// V3 Military Orchestrator (POST /v3/military/orchestrate, GET /v3/military/status)
// =============================================================================

type MilitaryOrchestrateRequest struct {
	Text          string `json:"text"`
	ChannelLevel  uint8  `json:"channel_level,omitempty"`
	SourceDomain  string `json:"source_domain,omitempty"`
	TargetDomain  string `json:"target_domain,omitempty"`
	SessionID     string `json:"session_id,omitempty"`
}

type MilitaryModuleResult struct {
	Status    string          `json:"status"`
	RiskScore float64         `json:"risk_score"`
	LatencyMs uint64          `json:"latency_ms"`
	Summary   string          `json:"summary"`
	Details   interface{}     `json:"details"`
}

type MilitaryOrchestrateResponse struct {
	OverallRisk    float64                         `json:"overall_risk"`
	OverallStatus  string                          `json:"overall_status"`
	Modules        map[string]MilitaryModuleResult `json:"modules"`
	TotalLatencyMs uint64                          `json:"total_latency_ms"`
	Timestamp      string                          `json:"timestamp"`
}

type MilitaryModuleStatus struct {
	Name         string  `json:"name"`
	Available    bool    `json:"available"`
	LastAnalysis *string `json:"last_analysis,omitempty"`
}

type MilitaryStatusResponse struct {
	Modules       []MilitaryModuleStatus `json:"modules"`
	OverallHealth string                 `json:"overall_health"`
	Version       string                 `json:"version"`
}

func (s *OrchestrationService) MilitaryOrchestrate(ctx context.Context, req MilitaryOrchestrateRequest) (*MilitaryOrchestrateResponse, error) {
	var resp MilitaryOrchestrateResponse
	if err := s.t.Do(ctx, "POST", "/v3/military/orchestrate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OrchestrationService) MilitaryStatus(ctx context.Context) (*MilitaryStatusResponse, error) {
	var resp MilitaryStatusResponse
	if err := s.t.Do(ctx, "GET", "/v3/military/status", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
