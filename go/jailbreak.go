package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// JailbreakService — V2 jailbreak detection.
type JailbreakService struct {
	t *internal.Transport
}

func (s *JailbreakService) Detect(ctx context.Context, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/jailbreak/detect", map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *JailbreakService) DetectBatch(ctx context.Context, texts []string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/jailbreak/detect/batch", map[string]any{"texts": texts}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *JailbreakService) Types(ctx context.Context) (any, error) {
	var resp any
	if err := s.t.Do(ctx, "GET", "/v2/jailbreak/types", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
