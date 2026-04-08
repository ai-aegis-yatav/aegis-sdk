package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type OpsService struct {
	t *internal.Transport
}

func (s *OpsService) CiGate(ctx context.Context, req models.CiGateRequest) (*models.CiGateResponse, error) {
	var resp models.CiGateResponse
	if err := s.t.Do(ctx, "POST", "/v1/ops/ci-gate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OpsService) Benchmark(ctx context.Context, req models.BenchmarkRequest) (*models.BenchmarkResponse, error) {
	var resp models.BenchmarkResponse
	if err := s.t.Do(ctx, "POST", "/v1/ops/benchmark", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OpsService) GetThresholds(ctx context.Context) (*models.ThresholdsConfig, error) {
	var resp models.ThresholdsConfig
	if err := s.t.Do(ctx, "GET", "/v1/ops/thresholds", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OpsService) SetThresholds(ctx context.Context, req models.ThresholdsConfig) (*models.ThresholdsConfig, error) {
	var resp models.ThresholdsConfig
	if err := s.t.Do(ctx, "PUT", "/v1/ops/thresholds", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OpsService) RedteamStats(ctx context.Context) (*models.RedteamStats, error) {
	var resp models.RedteamStats
	if err := s.t.Do(ctx, "GET", "/v1/ops/redteam/stats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *OpsService) AttackLibrary(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.AttackEntry], error) {
	var resp models.PaginatedResponse[models.AttackEntry]
	path := buildPath("/v1/ops/redteam/attacks", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
