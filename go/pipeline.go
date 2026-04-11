package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// PipelineService — V3 defense pipeline execution.
type PipelineService struct {
	t *internal.Transport
}

func (s *PipelineService) Run(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/pipeline/run", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
