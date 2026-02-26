package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type ClassifyService struct {
	t *internal.Transport
}

func (s *ClassifyService) Classify(ctx context.Context, req models.ClassifyRequest) (*models.ClassifyResponse, error) {
	var resp models.ClassifyResponse
	if err := s.t.Do(ctx, "POST", "/classify", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *ClassifyService) Batch(ctx context.Context, req models.ClassifyBatchRequest) (*models.ClassifyBatchResponse, error) {
	var resp models.ClassifyBatchResponse
	if err := s.t.Do(ctx, "POST", "/classify/batch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *ClassifyService) Categories(ctx context.Context) ([]models.CategoryInfo, error) {
	var resp []models.CategoryInfo
	if err := s.t.Do(ctx, "GET", "/classify/categories", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
