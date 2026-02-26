package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type MultimodalService struct {
	t *internal.Transport
}

func (s *MultimodalService) Scan(ctx context.Context, req models.MultimodalScanRequest) (*models.MultimodalScanResponse, error) {
	var resp models.MultimodalScanResponse
	if err := s.t.Do(ctx, "POST", "/multimodal/scan", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MultimodalService) ImageAttack(ctx context.Context, req models.ImageAttackRequest) (*models.ImageAttackResponse, error) {
	var resp models.ImageAttackResponse
	if err := s.t.Do(ctx, "POST", "/multimodal/image-attack", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MultimodalService) VisCRA(ctx context.Context, req models.VisCRARequest) (*models.VisCRAResponse, error) {
	var resp models.VisCRAResponse
	if err := s.t.Do(ctx, "POST", "/multimodal/viscra", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *MultimodalService) MML(ctx context.Context, req models.MMLRequest) (*models.MMLResponse, error) {
	var resp models.MMLResponse
	if err := s.t.Do(ctx, "POST", "/multimodal/mml", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
