package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type SafetyService struct {
	t *internal.Transport
}

func (s *SafetyService) Check(ctx context.Context, req models.SafetyCheckRequest) (*models.SafetyCheckResponse, error) {
	var resp models.SafetyCheckResponse
	if err := s.t.Do(ctx, "POST", "/safety/check", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *SafetyService) CheckBatch(ctx context.Context, req models.SafetyCheckBatchRequest) (*models.SafetyCheckBatchResponse, error) {
	var resp models.SafetyCheckBatchResponse
	if err := s.t.Do(ctx, "POST", "/safety/check/batch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *SafetyService) Categories(ctx context.Context) ([]models.CategoryInfo, error) {
	var resp []models.CategoryInfo
	if err := s.t.Do(ctx, "GET", "/safety/categories", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SafetyService) Backends(ctx context.Context) ([]models.SafetyBackend, error) {
	var resp []models.SafetyBackend
	if err := s.t.Do(ctx, "GET", "/safety/backends", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
