package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
	"github.com/ai-aegis-yatav/aegis-sdk/go/streaming"
)

type JudgeService struct {
	t *internal.Transport
}

func (s *JudgeService) Create(ctx context.Context, req models.JudgeRequest) (*models.JudgeResponse, error) {
	var resp models.JudgeResponse
	if err := s.t.Do(ctx, "POST", "/v1/judge", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *JudgeService) Batch(ctx context.Context, req models.JudgeBatchRequest) (*models.JudgeBatchResponse, error) {
	var resp models.JudgeBatchResponse
	if err := s.t.Do(ctx, "POST", "/v1/judge/batch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *JudgeService) Stream(ctx context.Context, req models.JudgeRequest) (*streaming.StreamReader, error) {
	req.Stream = true
	return s.t.DoStream(ctx, "POST", "/v1/judge/stream", req)
}

func (s *JudgeService) List(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.JudgeResponse], error) {
	var resp models.PaginatedResponse[models.JudgeResponse]
	path := buildPath("/v1/judge", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *JudgeService) Get(ctx context.Context, id string) (*models.JudgeResponse, error) {
	var resp models.JudgeResponse
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v1/judge/%s", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
