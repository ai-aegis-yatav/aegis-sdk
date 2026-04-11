package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// ReportsService — V3 report generation.
type ReportsService struct {
	t *internal.Transport
}

func (s *ReportsService) Generate(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/reports/generate", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
