package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// MultimodalService — V3 multimodal security.
type MultimodalService struct {
	t *internal.Transport
}

func (s *MultimodalService) Scan(ctx context.Context, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/multimodal/scan", map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MultimodalService) ScanWith(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/multimodal/scan", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MultimodalService) Image(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/multimodal/image", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MultimodalService) VisCRA(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/multimodal/viscra", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MultimodalService) MML(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/multimodal/mml", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
