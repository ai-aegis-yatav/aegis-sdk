package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type SaberService struct {
	t *internal.Transport
}

func (s *SaberService) Estimate(ctx context.Context, req models.SaberEstimateRequest) (*models.SaberEstimateResponse, error) {
	var resp models.SaberEstimateResponse
	if err := s.t.Do(ctx, "POST", "/saber/estimate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *SaberService) Evaluate(ctx context.Context, req models.SaberEvaluateRequest) (*models.SaberEvaluateResponse, error) {
	var resp models.SaberEvaluateResponse
	if err := s.t.Do(ctx, "POST", "/saber/evaluate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *SaberService) Budget(ctx context.Context, req models.SaberBudgetRequest) (*models.SaberBudget, error) {
	var resp models.SaberBudget
	if err := s.t.Do(ctx, "POST", "/saber/budget", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *SaberService) Compare(ctx context.Context, req models.SaberCompareRequest) (*models.SaberCompareResponse, error) {
	var resp models.SaberCompareResponse
	if err := s.t.Do(ctx, "POST", "/saber/compare", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *SaberService) Report(ctx context.Context) (*models.SaberReport, error) {
	var resp models.SaberReport
	if err := s.t.Do(ctx, "GET", "/saber/report", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
