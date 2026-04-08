package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// GuardNetService — V3 advanced defense (GuardNet, JBShield, CCFC, MULI).
type GuardNetService struct {
	t *internal.Transport
}

func (s *GuardNetService) post(ctx context.Context, path, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", path, map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *GuardNetService) Analyze(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v3/defense/guardnet", text)
}
func (s *GuardNetService) JBShield(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v3/defense/jbshield", text)
}
func (s *GuardNetService) CCFC(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v3/defense/ccfc", text)
}
func (s *GuardNetService) MULI(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v3/defense/muli", text)
}
func (s *GuardNetService) Unified(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v3/defense/unified", text)
}
