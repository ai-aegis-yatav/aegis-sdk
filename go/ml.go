package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type MLService struct {
	t *internal.Transport
}

func (s *MLService) Health(ctx context.Context) (*models.MLHealthResponse, error) {
	var resp models.MLHealthResponse
	if err := s.t.Do(ctx, "GET", "/ml/health", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MLService) Embed(ctx context.Context, req models.EmbedRequest) (*models.EmbedResponse, error) {
	var resp models.EmbedResponse
	if err := s.t.Do(ctx, "POST", "/ml/embed", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MLService) EmbedBatch(ctx context.Context, req models.EmbedBatchRequest) (*models.EmbedBatchResponse, error) {
	var resp models.EmbedBatchResponse
	if err := s.t.Do(ctx, "POST", "/ml/embed/batch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MLService) Classify(ctx context.Context, req models.MLClassifyRequest) (*models.MLClassifyResponse, error) {
	var resp models.MLClassifyResponse
	if err := s.t.Do(ctx, "POST", "/ml/classify", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MLService) Similarity(ctx context.Context, req models.SimilarityRequest) (*models.SimilarityResponse, error) {
	var resp models.SimilarityResponse
	if err := s.t.Do(ctx, "POST", "/ml/similarity", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
