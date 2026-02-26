package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type AnalyticsService struct {
	t *internal.Transport
}

func (s *AnalyticsService) Overview(ctx context.Context) (*models.AnalyticsOverview, error) {
	var resp models.AnalyticsOverview
	if err := s.t.Do(ctx, "GET", "/analytics/overview", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnalyticsService) Judgments(ctx context.Context) (*models.AnalyticsJudgments, error) {
	var resp models.AnalyticsJudgments
	if err := s.t.Do(ctx, "GET", "/analytics/judgments", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnalyticsService) DefenseLayers(ctx context.Context) (*models.AnalyticsDefenseLayers, error) {
	var resp models.AnalyticsDefenseLayers
	if err := s.t.Do(ctx, "GET", "/analytics/defense-layers", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnalyticsService) Threats(ctx context.Context) (*models.AnalyticsThreats, error) {
	var resp models.AnalyticsThreats
	if err := s.t.Do(ctx, "GET", "/analytics/threats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnalyticsService) Performance(ctx context.Context) (*models.AnalyticsPerformance, error) {
	var resp models.AnalyticsPerformance
	if err := s.t.Do(ctx, "GET", "/analytics/performance", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
