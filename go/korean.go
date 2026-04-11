package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// KoreanService — V3 Korean-language threat analysis.
type KoreanService struct {
	t *internal.Transport
}

func (s *KoreanService) Analyze(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/korean/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
