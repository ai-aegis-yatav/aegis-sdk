package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// SaberService — V3 Bayesian risk estimation.
type SaberService struct {
	t *internal.Transport
}

// SaberQuery — single query record for Estimate.
type SaberQuery struct {
	QueryID      string `json:"query_id"`
	TotalTrials  int    `json:"total_trials"`
	SuccessCount int    `json:"success_count"`
	Category     string `json:"category,omitempty"`
}

func (s *SaberService) Estimate(ctx context.Context, queries []SaberQuery) (map[string]any, error) {
	if len(queries) == 0 {
		queries = []SaberQuery{{QueryID: "default", TotalTrials: 100, SuccessCount: 5, Category: "smoke"}}
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/saber/estimate", map[string]any{"queries": queries}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SaberService) Evaluate(ctx context.Context, content string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/saber/evaluate", map[string]any{"content": content}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SaberService) Budget(ctx context.Context, tau float64) (map[string]any, error) {
	var resp map[string]any
	path := fmt.Sprintf("/v3/saber/budget?tau=%v", tau)
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SaberService) Compare(ctx context.Context, content string, defenses []string) (map[string]any, error) {
	body := map[string]any{"content": content, "defenses": defenses}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/saber/compare", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SaberService) Report(ctx context.Context, reportID string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v3/saber/report/%s", reportID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
