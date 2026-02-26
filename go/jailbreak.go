package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type JailbreakService struct {
	t *internal.Transport
}

func (s *JailbreakService) Detect(ctx context.Context, req models.JailbreakDetectRequest) (*models.JailbreakDetectResponse, error) {
	var resp models.JailbreakDetectResponse
	if err := s.t.Do(ctx, "POST", "/jailbreak/detect", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *JailbreakService) DetectBatch(ctx context.Context, req models.JailbreakDetectBatchRequest) (*models.JailbreakDetectBatchResponse, error) {
	var resp models.JailbreakDetectBatchResponse
	if err := s.t.Do(ctx, "POST", "/jailbreak/detect/batch", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *JailbreakService) Types(ctx context.Context) ([]models.JailbreakType, error) {
	var resp []models.JailbreakType
	if err := s.t.Do(ctx, "GET", "/jailbreak/types", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
