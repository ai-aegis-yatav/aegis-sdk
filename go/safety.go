package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// SafetyService — V2 content safety check.
type SafetyService struct {
	t *internal.Transport
}

func (s *SafetyService) Check(ctx context.Context, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/safety/check", map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SafetyService) CheckBatch(ctx context.Context, texts []string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/safety/check/batch", map[string]any{"texts": texts}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SafetyService) Categories(ctx context.Context) (any, error) {
	var resp any
	if err := s.t.Do(ctx, "GET", "/v2/safety/categories", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *SafetyService) Backends(ctx context.Context) (any, error) {
	var resp any
	if err := s.t.Do(ctx, "GET", "/v2/safety/backends", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
