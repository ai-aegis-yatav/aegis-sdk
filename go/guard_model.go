package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// GuardModelService — V3 guard model training & performance.
type GuardModelService struct {
	t *internal.Transport
}

func (s *GuardModelService) Stats(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/guard-model/stats", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *GuardModelService) Performance(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/guard-model/performance", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *GuardModelService) Train(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/guard-model/train", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *GuardModelService) TrainStatus(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/guard-model/train/status", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *GuardModelService) TrainCancel(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/guard-model/train/cancel", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
