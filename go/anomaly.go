package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type AnomalyService struct {
	t *internal.Transport
}

func (s *AnomalyService) Algorithms(ctx context.Context) ([]models.AnomalyAlgorithm, error) {
	var resp []models.AnomalyAlgorithm
	if err := s.t.Do(ctx, "GET", "/anomaly/algorithms", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AnomalyService) Detect(ctx context.Context, req models.AnomalyDetectRequest) (*models.AnomalyDetectResponse, error) {
	var resp models.AnomalyDetectResponse
	if err := s.t.Do(ctx, "POST", "/anomaly/detect", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnomalyService) DetectBatch(ctx context.Context, req models.AnomalyDetectBatchRequest) (*models.AnomalyDetectBatchResponse, error) {
	var resp models.AnomalyDetectBatchResponse
	if err := s.t.Do(ctx, "POST", "/anomaly/detect/batch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnomalyService) Events(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.AnomalyEvent], error) {
	var resp models.PaginatedResponse[models.AnomalyEvent]
	path := buildPath("/anomaly/events", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AnomalyService) Stats(ctx context.Context) (*models.AnomalyStats, error) {
	var resp models.AnomalyStats
	if err := s.t.Do(ctx, "GET", "/anomaly/stats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
